/**
 * Category Loading Utilities
 *
 * Centralized utilities for loading category data across different pages.
 * Eliminates code duplication in page-level category loading logic.
 */

import { handleLoadingError } from "../error/errorHandlingUtils";

import { getCategories } from "./categoriesIndex";

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
  const langKey = String(language || "").toLowerCase();
  const fallbackKey = String(fallbackLanguage || "en").toLowerCase();

  try {
    // Lade primäre Sprache lazy
    const primary = await getCategories(langKey);
    if (primary.length > 0) {
      return {
        categories: primary,
        success: true,
        fallbackUsed: false,
      };
    }

    // Fallback nur wenn unterschiedlich
    if (fallbackKey !== langKey) {
      const fallback = await getCategories(fallbackKey);
      if (fallback.length > 0) {
        return {
          categories: fallback,
          success: true,
          fallbackUsed: true,
        };
      }
    }

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
  const { language, fallbackLanguage = "en" } = config;
  const langKey = language.toLowerCase();
  const primary = await getCategories(langKey);
  const found = primary.find((c) => c.slug === slug);
  if (found) {
    return found;
  }
  if (langKey !== "en" && fallbackLanguage) {
    const fb = await getCategories(fallbackLanguage.toLowerCase());
    return fb.find((c) => c.slug === slug) || null;
  }
  return null;
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
