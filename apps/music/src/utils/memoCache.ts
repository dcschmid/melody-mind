/**
 * Lightweight memoization helper for pure function results.
 *
 * This replaces the former generic LRUCache (230 lines) because all apps
 * are statically generated (SSG) – there is no long-running process that
 * would benefit from TTL eviction or LRU semantics.
 *
 * @example
 * ```typescript
 * const cache = createMemoCache<string, number>();
 *
 * function computeHash(input: string): number {
 *   const cached = cache.get(input);
 *   if (cached !== undefined) return cached;
 *   const result = expensiveComputation(input);
 *   cache.set(input, result);
 *   return result;
 * }
 * ```
 */
export function createMemoCache<K = string, V = unknown>() {
  const store = new Map<K, V>();
  return {
    get(key: K): V | undefined {
      return store.get(key);
    },
    set(key: K, value: V): void {
      store.set(key, value);
    },
    has(key: K): boolean {
      return store.has(key);
    },
    clear(): void {
      store.clear();
    },
  };
}
