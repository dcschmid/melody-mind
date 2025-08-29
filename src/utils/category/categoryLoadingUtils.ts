/**
 * Category Loading Utilities
 *
 * Centralized utilities for loading category data across different pages.
 * Eliminates code duplication in page-level category loading logic.
 */

import { handleLoadingError } from "../error/errorHandlingUtils";

import categoriesIndex from "./categoriesIndex";

// fs and path are intentionally not used; keep file pure and static to avoid build-time fs operations

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

  // Fast path: use the statically imported categoriesIndex which guarantees inclusion
  // of JSON files at build time. This is simple, deterministic and avoids heavy glob/fs
  // fallbacks that can increase build memory usage.
  try {
    // Normalize keys to lowercase so callers may pass 'DE' or 'de' and still match entries.
    const map: Record<string, Category[]> = (categoriesIndex as Record<string, Category[]>) || {};
    const langKey = String(language || "").toLowerCase();
    const fallbackKey = String(fallbackLanguage || "en").toLowerCase();

    // Lightweight debug: if a language is requested but not found, log a short message.
    // This helps trace issues where categories unexpectedly appear empty.
    const found = Array.isArray(map[langKey]) ? map[langKey] : undefined;
    if (!found || found.length === 0) {
      // Use console.warn to keep linter happy while still surfacing missing content during debugging.
      console.warn(
        `[categoryLoader] requested lang='${langKey}' fallback='${fallbackKey}' -> found=${found ? found.length : 0}`
      );
    }

    // Return exact language result when available.
    if (found && found.length > 0) {
      return {
        categories: found,
        success: true,
        fallbackUsed: false,
      };
    }

    // Try fallback language (normalized)
    if (fallbackKey !== langKey && Array.isArray(map[fallbackKey]) && map[fallbackKey].length > 0) {
      return {
        categories: map[fallbackKey],
        success: true,
        fallbackUsed: true,
      };
    }

    // Nothing found in the static map — return a clear failure result (use normalized keys for message).
    const fallbackNote = fallbackKey !== langKey ? ` and fallback ${fallbackKey}` : "";
    return {
      categories: [],
      success: false,
      error: `Failed to load categories for ${langKey}${fallbackNote}`,
      fallbackUsed: false,
    };
  } catch (err) {
    handleLoadingError(err, "category data retrieval");
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
