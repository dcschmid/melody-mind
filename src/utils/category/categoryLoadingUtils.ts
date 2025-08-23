/**
 * Category Loading Utilities
 * 
 * Centralized utilities for loading category data across different pages.
 * Eliminates code duplication in page-level category loading logic.
 */

import { handleLoadingError } from "../error/errorHandlingUtils";

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
  const { language, fallbackLanguage = "en", useAliasPath = true } = config;

  try {
    // First try using the alias path if enabled
    if (useAliasPath) {
      try {
        const categories = await import(`@json/${language}_categories.json`);
        return {
          categories: categories.default || [],
          success: true,
          fallbackUsed: false
        };
      } catch {
        console.warn(`Alias path failed for ${language}_categories.json, trying relative path`);
      }
    }

    // Fallback to relative path
    try {
      const categories = await import(`../../json/${language}_categories.json`);
      return {
        categories: categories.default || [],
        success: true,
        fallbackUsed: false
      };
    } catch (relativeError) {
      // Try fallback language if specified
      if (fallbackLanguage && fallbackLanguage !== language) {
        try {
          const fallbackCategories = await import(`@json/${fallbackLanguage}_categories.json`);
          return {
            categories: fallbackCategories.default || [],
            success: true,
            fallbackUsed: true
          };
        } catch {
          // Last resort: try relative path with fallback language
          try {
            const fallbackCategories = await import(`../../json/${fallbackLanguage}_categories.json`);
            return {
              categories: fallbackCategories.default || [],
              success: true,
              fallbackUsed: true
            };
          } catch (finalError) {
            handleLoadingError(finalError, `fallback category data for ${fallbackLanguage}`);
            return {
              categories: [],
              success: false,
              error: `Failed to load categories for ${language} and fallback ${fallbackLanguage}`,
              fallbackUsed: false
            };
          }
        }
      }

      handleLoadingError(relativeError, `category data for ${language}`);
      return {
        categories: [],
        success: false,
        error: `Failed to load categories for ${language}`,
        fallbackUsed: false
      };
    }
  } catch (error) {
    handleLoadingError(error, `category loading for ${language}`);
    return {
      categories: [],
      success: false,
      error: `Unexpected error loading categories for ${language}`,
      fallbackUsed: false
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

  const category = result.categories.find(cat => cat.slug === slug);
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
    useAliasPath: true
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
  return categories.filter(category => !isPlayableCategory(category));
}

/**
 * Type guard for playable categories
 */
export function isPlayableCategory(item: unknown): item is Category & { categoryUrl: string } {
  return (
    item &&
    typeof item === "object" &&
    item.isPlayable === true &&
    typeof item.headline === "string" &&
    typeof item.imageUrl === "string" &&
    typeof item.introSubline === "string" &&
    typeof item.slug === "string" &&
    typeof item.text === "string" &&
    typeof item.categoryUrl === "string" &&
    typeof item.categoryType === "string" &&
    Boolean(item.categoryUrl)
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
  return categories.filter(category => category.categoryType === type);
}

/**
 * Search categories by text
 */
export function searchCategories(categories: Category[], searchTerm: string): Category[] {
  const term = searchTerm.toLowerCase();
  return categories.filter(category => 
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
  categories.forEach(category => {
    const type = category.categoryType || "other";
    byType[type] = (byType[type] || 0) + 1;
  });

  return {
    total: categories.length,
    playable: playable.length,
    nonPlayable: nonPlayable.length,
    byType
  };
}
