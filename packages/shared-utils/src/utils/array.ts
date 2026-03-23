/**
 * Small array-navigation helpers shared by pages that need stable previous/next behavior.
 *
 * These utilities are intentionally minimal:
 * - they never mutate the input array
 * - they preserve the caller's existing ordering
 * - and they return `null`/`-1` instead of throwing for missing items or invalid positions
 */

/**
 * Finds the index of the first item whose property value matches the provided key value.
 *
 * Returns `-1` when no matching item exists.
 */
function findByKey<T, K extends keyof T>(array: T[], key: K, value: T[K]): number {
  return array.findIndex((item) => item[key] === value);
}

/**
 * Returns the previous and next neighbors for a given array index.
 *
 * Out-of-range indexes resolve to `{ prev: null, next: null }`, which keeps caller code simple
 * for edge cases such as the first/last item or a failed lookup upstream.
 */
function getAdjacentItems<T>(
  array: T[],
  currentIndex: number
): { prev: T | null; next: T | null } {
  if (currentIndex < 0 || currentIndex >= array.length) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? (array[currentIndex - 1] ?? null) : null,
    next: currentIndex < array.length - 1 ? (array[currentIndex + 1] ?? null) : null,
  };
}

/**
 * Resolves the array index by key lookup and then returns the adjacent neighbors.
 *
 * This is primarily useful for detail pages that need previous/next navigation based on
 * the existing collection order without duplicating lookup logic.
 */
export function getAdjacentByKey<T, K extends keyof T>(
  array: T[],
  key: K,
  value: T[K]
): { prev: T | null; next: T | null; index: number } {
  const index = findByKey(array, key, value);
  const { prev, next } = getAdjacentItems(array, index);

  return { prev, next, index };
}
