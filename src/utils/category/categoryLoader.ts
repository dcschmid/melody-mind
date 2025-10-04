/**
 * Category Loader
 *
 * Focused utilities for loading category data (no transforms). Transforms were
 * extracted to `categoryTransforms.ts` for pure, side-effect free operations.
 */

import type { Category } from "../../types/category";
import { handleLoadingError } from "../error/errorHandlingUtils";

import { getCategories, getCategory } from "./categoriesIndex";

interface CategoryLoadingConfig {
  language: string;
  fallbackLanguage?: string;
  useAliasPath?: boolean; // kept for backward compatibility; not used directly
}

interface CategoryLoadingResult {
  categories: Category[];
  success: boolean;
  error?: string;
  fallbackUsed?: boolean;
}

/**
 * Load categories for a language with optional fallback.
 * Returns metadata about whether a fallback was used.
 */
export async function loadCategoriesForLanguage(
  config: CategoryLoadingConfig
): Promise<CategoryLoadingResult> {
  const { language, fallbackLanguage = "en" } = config;
  const langKey = String(language || "").toLowerCase();
  const fallbackKey = String(fallbackLanguage || "en").toLowerCase();

  try {
    const primary = await getCategories(langKey);
    if (primary.length > 0) {
      return { categories: primary, success: true, fallbackUsed: false };
    }
    if (fallbackKey !== langKey) {
      const fallback = await getCategories(fallbackKey);
      if (fallback.length > 0) {
        return { categories: fallback, success: true, fallbackUsed: true };
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
    return { categories: [], success: false, error: String(err), fallbackUsed: false };
  }
}

/**
 * Load a single category by slug (with inherent fallback logic in getCategory).
 */
export async function loadCategoryBySlug(
  slug: string,
  config: CategoryLoadingConfig
): Promise<Category | null> {
  const { language } = config;
  return getCategory(language, slug);
}

// Legacy note: loadCategoriesWithFallback removed. Use getCategories(language) directly.
