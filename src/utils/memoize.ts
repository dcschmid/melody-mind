/**
 * Utility functions for memoization and caching
 *
 * @since 1.0.0
 * @category Utilities
 */

/**
 * Creates a memoized version of a function that remembers the results
 * of previous calls to avoid repeating expensive calculations
 *
 * @template Args - Function argument types
 * @template Result - Function return type
 *
 * @param {(...args: Args) => Result} fn - The function to memoize
 * @param {Object} [options] - Memoization options
 * @param {number} [options.maxSize=100] - Maximum cache size
 * @param {number} [options.ttl] - Cache TTL in milliseconds (optional)
 *
 * @returns {(...args: Args) => Result} A memoized version of the function
 *
 * @example
 * // Memoize expensive calculation
 * const calculateScore = memoize(
 *   (correctAnswers: number, timeBonus: number): number => {
 *     console.log('Calculating score...');
 *     return correctAnswers * 50 + timeBonus;
 *   }
 * );
 *
 * // First call performs calculation
 * console.log(calculateScore(10, 25)); // Output: Calculating score... 525
 *
 * // Second call with same args returns cached result
 * console.log(calculateScore(10, 25)); // Output: 525 (no calculation)
 */
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  options: { maxSize?: number; ttl?: number } = {}
): (...args: Args) => Result {
  const { maxSize = 100, ttl } = options;
  const cache = new Map<string, { value: Result; timestamp: number }>();

  return (...args: Args): Result => {
    const key = JSON.stringify(args);
    const now = Date.now();

    // Check for cached value
    const cached = cache.get(key);

    // Return cached value if valid (respecting TTL if set)
    if (cached && (ttl === undefined || now - cached.timestamp < ttl)) {
      return cached.value;
    }

    // Call original function and cache result
    const result = fn(...args);

    // Implement LRU eviction if needed
    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey !== undefined) {
        cache.delete(oldestKey);
      }
    }

    // Store result with timestamp
    cache.set(key, { value: result, timestamp: now });

    return result;
  };
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked
 *
 * @template Args - Function argument types
 *
 * @param {(...args: Args) => void} fn - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} [immediate=false] - Whether to invoke the function at the beginning of the timeout
 *
 * @returns {(...args: Args) => void} A debounced version of the function
 *
 * @example
 * // Debounce user search to avoid too many API calls
 * const searchUsers = debounce(
 *   (query: string) => {
 *     console.log(`Searching for: ${query}`);
 *     // Perform API call
 *   },
 *   300 // Wait 300ms after last keystroke
 * );
 *
 * // Call multiple times in succession
 * searchUsers("a");
 * searchUsers("ap");
 * searchUsers("app");
 * // Only the final call for "app" will execute after 300ms
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
  immediate = false
): (...args: Args) => void {
  let timeout: number | null = null;

  return function (...args: Args): void {
    const callNow = immediate && !timeout;

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
      timeout = null;
      if (!immediate) {
        fn(...args);
      }
    }, wait);

    if (callNow) {
      fn(...args);
    }
  };
}
