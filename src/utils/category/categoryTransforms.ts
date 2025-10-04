/**
 * Category Transformation Utilities (Pure Functions)
 *
 * These functions operate purely on provided data (Category[]) and perform
 * filtering, sorting, searching and statistics generation. They contain no
 * side effects and no I/O, making them easily testable and tree-shakable.
 */

import type { Category } from "../../types/category";

/**
 * Type guard for playable categories.
 * Ensures required playable fields exist.
 */
export function isPlayableCategory(item: unknown): item is Category & { categoryUrl: string } {
  if (!item || typeof item !== "object") {
    return false;
  }
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

/** Filter categories by playability status */
export function filterPlayableCategories(categories: Category[]): Category[] {
  return categories.filter(isPlayableCategory);
}

/** Filter non-playable categories */
export function filterNonPlayableCategories(categories: Category[]): Category[] {
  return categories.filter((c) => !isPlayableCategory(c));
}

/** Return categories of a given type */
export function getCategoriesByType(categories: Category[], type: string): Category[] {
  return categories.filter((c) => c.categoryType === type);
}

/** Text search across key textual fields */
export function searchCategories(categories: Category[], searchTerm: string): Category[] {
  const term = searchTerm.toLowerCase();
  return categories.filter(
    (c) =>
      c.headline.toLowerCase().includes(term) ||
      c.introSubline?.toLowerCase().includes(term) ||
      c.text?.toLowerCase().includes(term) ||
      c.slug.toLowerCase().includes(term)
  );
}

/** Compute basic category statistics */
export function getCategoryStats(categories: Category[]): {
  total: number;
  playable: number;
  nonPlayable: number;
  byType: Record<string, number>;
} {
  const playable = filterPlayableCategories(categories);
  const nonPlayable = filterNonPlayableCategories(categories);
  const byType: Record<string, number> = {};
  categories.forEach((c) => {
    const type = c.categoryType || "other";
    byType[type] = (byType[type] || 0) + 1;
  });
  return {
    total: categories.length,
    playable: playable.length,
    nonPlayable: nonPlayable.length,
    byType,
  };
}
