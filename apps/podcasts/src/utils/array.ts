/**
 * Array Utility Functions
 *
 * Shared utilities for array operations.
 */

/**
 * Finds the index of an item by a key value.
 * Returns -1 if not found.
 *
 * @param array - The array to search
 * @param key - The key to match
 * @param value - The value to find
 * @returns Index of the matching item, or -1
 *
 * @example
 * const index = findByKey(podcasts, 'id', '1950s');
 */
export function findByKey<T, K extends keyof T>(array: T[], key: K, value: T[K]): number {
  return array.findIndex((item) => item[key] === value);
}

/**
 * Gets adjacent items in an array by index.
 * Useful for navigation (prev/next).
 *
 * @param array - The array
 * @param currentIndex - Current position
 * @returns Object with prev and next items (null if at boundaries)
 *
 * @example
 * const { prev, next } = getAdjacentItems(podcasts, 2);
 */
export function getAdjacentItems<T>(
  array: T[],
  currentIndex: number,
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
 * Gets adjacent items by a key value.
 * Combines findByKey and getAdjacentItems.
 *
 * @param array - The array
 * @param key - The key to match
 * @param value - The value to find
 * @returns Object with prev and next items
 *
 * @example
 * const { prev, next } = getAdjacentByKey(podcasts, 'id', '1950s');
 */
export function getAdjacentByKey<T, K extends keyof T>(
  array: T[],
  key: K,
  value: T[K],
): { prev: T | null; next: T | null; index: number } {
  const index = findByKey(array, key, value);
  const { prev, next } = getAdjacentItems(array, index);

  return { prev, next, index };
}
