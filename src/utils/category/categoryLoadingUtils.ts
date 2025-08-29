/**
 * Category Loading Utilities
 *
 * Centralized utilities for loading category data across different pages.
 * Eliminates code duplication in page-level category loading logic.
 */

import { handleLoadingError } from "../error/errorHandlingUtils";
import categoriesIndex from "./categoriesIndex";
import fs from "fs";
import path from "path";

/**
 * Category interface
 */
export interface Category {
  slug: string;
  headline: string;
  imageUrl?: string;
  introSubline?: string;
  text?: string;
  categoryUrl?: string;
  categoryType?: string;
  isPlayable?: boolean;
}

/**
 * Category loading configuration
 */
interface CategoryLoadingConfig {
  language: string;
  fallbackLanguage?: string;
  useAliasPath?: boolean;
}

/**
 * Category loading result
 */
interface CategoryLoadingResult {
  categories: Category[];
  success: boolean;
  error?: string;
  fallbackUsed?: boolean;
}

/**
 * Load categories for a specific language with fallback mechanisms
 */
export async function loadCategoriesForLanguage(
  config: CategoryLoadingConfig
): Promise<CategoryLoadingResult> {
  const { language, fallbackLanguage = "en" } = config;

  // Use Vite's build-time glob import to include all category JSON files.
  // This avoids attempting dynamic runtime imports from the built server output.
  try {
    // Extract the map-building logic into a small typed helper to reduce complexity
    // and avoid using `any` on import.meta. Prefer Vite's globEager but fall back to a
    // statically imported categories index if the glob is not available or yields nothing.
    const buildMap = (): Record<string, Category[]> => {
      type EagerModule = { default: Category[] };
      type MetaType = {
        globEager?: (pattern: string) => Record<string, EagerModule>;
        // Keep glob type available for environments that might provide it in a different form.
        glob?: (pattern: string) => Record<string, () => Promise<EagerModule>>;
      };

      const meta = import.meta as unknown as MetaType;

      // Prefer the eager glob (bundles JSON into the build). If not available, use an empty object.
      const modules = meta.globEager ? meta.globEager("../../json/*_categories.json") : {};

      const map: Record<string, Category[]> = {};
      for (const filePath in modules) {
        const mod = modules[filePath];
        const defaultExport = (mod && (mod.default || [])) as Category[];

        // Try to extract two-letter language code from the filename, e.g. 'de' from '../../json/de_categories.json'
        const m = filePath.match(/([a-z]{2})_categories\.json$/i);
        if (m && m[1]) {
          map[m[1]] = defaultExport;
        } else {
          // Fallback: try to match a segment like '/de_categories.json'
          const m2 = filePath.match(/\/([a-z]{2})_categories\.json$/i);
          if (m2 && m2[1]) {
            map[m2[1]] = defaultExport;
          }
        }
      }

      // If the glob didn't yield any results, try the statically imported categoriesIndex
      // which provides the same language -> categories[] mapping.
      if (Object.keys(map).length === 0) {
        try {
          for (const langKey of Object.keys(categoriesIndex)) {
            // categoriesIndex default export may contain arrays already
            map[langKey] = (categoriesIndex as Record<string, Category[]>)[langKey] ?? [];
          }
        } catch (_err) {
          // If for some reason the index import fails, leave map empty - caller will handle it.
        }

        // If map is still empty, attempt a filesystem fallback. This reads the project's
        // `src/json/*_categories.json` files directly. This is defensive: it only runs
        // during a Node-based build (Astro build) where filesystem access is available.
        if (Object.keys(map).length === 0) {
          try {
            const jsonDir = path.resolve(process.cwd(), "src", "json");
            if (fs.existsSync(jsonDir)) {
              const files = fs.readdirSync(jsonDir);
              for (const file of files) {
                if (/_categories\.json$/i.test(file)) {
                  const filePath = path.join(jsonDir, file);
                  try {
                    const raw = fs.readFileSync(filePath, "utf8");
                    const parsed = JSON.parse(raw);
                    // derive language code from filename like 'de_categories.json'
                    const m = file.match(/^([a-z]{2})_categories\.json$/i);
                    const key =
                      m && m[1] ? m[1].toLowerCase() : file.replace(/_categories\.json$/i, "");
                    map[key] = Array.isArray(parsed) ? parsed : [];
                  } catch (_parseErr) {
                    // If a file fails to parse, skip it and continue with others
                    continue;
                  }
                }
              }
            }
          } catch (_fsErr) {
            // Nothing to do here; leave map empty and let caller handle missing categories.
          }
        }
      }

      return map;
    };

    const map = buildMap();

    // Prefer the requested language
    if (map[language]) {
      return {
        categories: map[language],
        success: true,
        fallbackUsed: false,
      };
    }

    // Then fallback language
    if (fallbackLanguage && fallbackLanguage !== language && map[fallbackLanguage]) {
      return {
        categories: map[fallbackLanguage],
        success: true,
        fallbackUsed: true,
      };
    }

    // If nothing matched, return a consistent failure result.
    const fallbackNote =
      fallbackLanguage && fallbackLanguage !== language ? ` and fallback ${fallbackLanguage}` : "";
    return {
      categories: [],
      success: false,
      error: `Failed to load categories for ${language}${fallbackNote}`,
      fallbackUsed: false,
    };
  } catch (err) {
    // If glob import throws for some reason, surface a helpful error via existing handler.
    handleLoadingError(err, "category data glob import");
    return {
      categories: [],
      success: false,
      error: String(err),
      fallbackUsed: false,
    };
  }
}

/**
 * Load a specific category by slug
 */
export async function loadCategoryBySlug(
  slug: string,
  config: CategoryLoadingConfig
): Promise<Category | null> {
  const result = await loadCategoriesForLanguage(config);

  if (!result.success) {
    return null;
  }

  const category = result.categories.find((cat) => cat.slug === slug);
  return category || null;
}

/**
 * Load categories with fallback to default language
 */
export async function loadCategoriesWithFallback(
  language: string,
  fallbackLanguage: string = "en"
): Promise<Category[]> {
  const result = await loadCategoriesForLanguage({
    language,
    fallbackLanguage,
    useAliasPath: true,
  });

  return result.categories;
}

/**
 * Filter categories by playability status
 */
export function filterPlayableCategories(categories: Category[]): Category[] {
  return categories.filter(isPlayableCategory);
}

/**
 * Filter non-playable categories
 */
export function filterNonPlayableCategories(categories: Category[]): Category[] {
  return categories.filter((category) => !isPlayableCategory(category));
}

/**
 * Type guard for playable categories
 */
export function isPlayableCategory(item: unknown): item is Category & { categoryUrl: string } {
  // Narrow `item` safely before accessing properties to satisfy TypeScript.
  if (!item || typeof item !== "object") {
    return false;
  }

  // Use a Partial<Category> typed variable so property accesses are allowed.
  const it = item as Partial<Category & Record<string, unknown>>;

  return (
    it.isPlayable === true &&
    typeof it.headline === "string" &&
    typeof it.imageUrl === "string" &&
    typeof it.introSubline === "string" &&
    typeof it.slug === "string" &&
    typeof it.text === "string" &&
    typeof it.categoryUrl === "string" &&
    typeof it.categoryType === "string" &&
    Boolean(it.categoryUrl)
  );
}

/**
 * Sort categories by type and name
 */
export function sortCategoriesByType(categories: Category[]): Category[] {
  const typeOrder: Record<string, number> = {
    decade: 1,
    female: 2,
    "classic-rock": 3,
    "metal-classic": 4,
    "metal-modern": 5,
    "metal-avantgarde": 6,
    "mainstream-pop": 7,
    "indie-alternative": 8,
    "global-pop": 9,
    "jazz-soul-funk": 10,
    "hip-hop-rap": 11,
    "house-techno": 12,
    "club-sounds": 13,
    "breaks-experimental": 14,
    "latin-vibes": 15,
    "caribbean-afro": 16,
    "folk-regional": 17,
    "classical-orchestral": 18,
    "countries-regional": 19,
    emotional: 20,
    seasonal: 21,
    situational: 22,
    genre: 23,
    other: 24,
  };

  return categories.sort((a, b) => {
    // First sort by type
    const aOrder = typeOrder[a.categoryType || "other"] || 25;
    const bOrder = typeOrder[b.categoryType || "other"] || 25;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    // Within same type, sort decades chronologically, others alphabetically
    if (a.categoryType === "decade") {
      return a.slug.localeCompare(b.slug);
    }

    // For other types, sort alphabetically by headline
    return a.headline.localeCompare(b.headline);
  });
}

/**
 * Get categories by type
 */
export function getCategoriesByType(categories: Category[], type: string): Category[] {
  return categories.filter((category) => category.categoryType === type);
}

/**
 * Search categories by text
 */
export function searchCategories(categories: Category[], searchTerm: string): Category[] {
  const term = searchTerm.toLowerCase();
  return categories.filter(
    (category) =>
      category.headline.toLowerCase().includes(term) ||
      category.introSubline?.toLowerCase().includes(term) ||
      category.text?.toLowerCase().includes(term) ||
      category.slug.toLowerCase().includes(term)
  );
}

/**
 * Get category statistics
 */
export function getCategoryStats(categories: Category[]): {
  total: number;
  playable: number;
  nonPlayable: number;
  byType: Record<string, number>;
} {
  const playable = filterPlayableCategories(categories);
  const nonPlayable = filterNonPlayableCategories(categories);

  const byType: Record<string, number> = {};
  categories.forEach((category) => {
    const type = category.categoryType || "other";
    byType[type] = (byType[type] || 0) + 1;
  });

  return {
    total: categories.length,
    playable: playable.length,
    nonPlayable: nonPlayable.length,
    byType,
  };
}
