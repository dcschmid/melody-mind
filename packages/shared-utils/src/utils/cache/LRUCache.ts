/**
 * Generic in-memory LRU (Least Recently Used) cache with optional TTL expiry.
 *
 * Implementation notes:
 * - recency is tracked via `Map` insertion order,
 * - reads through `get()` promote an entry to most-recently-used,
 * - `set()` replaces existing keys and also makes them most-recently-used,
 * - and TTL expiry is checked lazily on access or explicit cleanup rather than by
 *   background timers.
 *
 * This makes the cache cheap and deterministic for utility-layer usage such as SEO,
 * content collection caching, and lightweight parsing memoization.
 *
 * @module utils/cache/LRUCache
 */

/**
 * Internal cache record storing the value plus its insertion/update timestamp.
 */
interface CacheEntry<V> {
  /** The cached value */
  value: V;
  /** Timestamp when the entry was created (ms since epoch) */
  timestamp: number;
}

/**
 * Constructor options for `LRUCache`.
 */
export interface LRUCacheOptions {
  /** Maximum number of entries allowed before least-recently-used eviction starts. */
  maxSize?: number;
  /** Optional time-to-live in milliseconds. Expiry is enforced lazily, not proactively. */
  ttlMs?: number;
}

/**
 * Generic LRU cache whose keys and values are fully typed.
 *
 * Semantics:
 * - "least recently used" means the oldest surviving insertion-order entry,
 * - `get()` promotes entries,
 * - `has()` does not promote entries,
 * - TTL expiry removes entries only when they are touched by cache operations or
 *   when `cleanup()` is called explicitly.
 *
 * @example
 * ```typescript
 * const cache = new LRUCache<string, User>({ maxSize: 50, ttlMs: 60000 });
 *
 * cache.set("user:1", { id: 1, name: "Alice" });
 * const user = cache.get("user:1"); // { id: 1, name: "Alice" }
 *
 * // After TTL expires:
 * const stale = cache.get("user:1"); // undefined
 * ```
 */
export class LRUCache<K, V> {
  private readonly cache: Map<K, CacheEntry<V>>;
  private readonly maxSize: number;
  private readonly ttlMs: number | undefined;

  constructor(options: LRUCacheOptions = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize ?? 100;
    this.ttlMs = options.ttlMs;
  }

  /**
   * Returns a cached value and promotes the entry to most-recently-used.
   *
   * Returns `undefined` when:
   * - the key does not exist,
   * - or the entry exists but has expired under the configured TTL.
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check TTL expiration
    if (this.ttlMs !== undefined && Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return undefined;
    }

    // Move to end (most recently used) - Map preserves insertion order
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Inserts or replaces a cached value.
   *
   * If the key already exists, the old entry is removed first so the replacement
   * becomes most-recently-used. If the cache is already at capacity, least-recently-
   * used entries are evicted before the new value is inserted.
   */
  set(key: K, value: V): void {
    // Remove existing entry if present (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest entries if at capacity
    this.evictIfNeeded();

    // Add new entry
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Returns whether a key currently exists and is still fresh.
   *
   * Unlike `get()`, this does not refresh recency ordering.
   */
  has(key: K): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check TTL expiration
    if (this.ttlMs !== undefined && Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Removes a single entry from the cache.
   *
   * Returns `true` when an entry was removed.
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Removes every entry from the cache immediately.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Current raw entry count in the underlying map.
   *
   * Note: this may include expired entries that have not yet been touched or
   * cleaned up explicitly.
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Returns an iterator over keys in current LRU order.
   *
   * The iterator comes directly from the underlying `Map`, so expired entries are
   * not filtered out here.
   */
  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  /**
   * Iterates over non-expired values in LRU order.
   *
   * Expired entries are skipped but not deleted as a side effect.
   */
  *values(): Generator<V> {
    for (const entry of this.cache.values()) {
      // Skip expired entries
      if (this.ttlMs !== undefined && Date.now() - entry.timestamp > this.ttlMs) {
        continue;
      }
      yield entry.value;
    }
  }

  /**
   * Iterates over non-expired `[key, value]` pairs in LRU order.
   *
   * Expired entries are skipped but not deleted as a side effect.
   */
  *entries(): Generator<[K, V]> {
    for (const [key, entry] of this.cache.entries()) {
      // Skip expired entries
      if (this.ttlMs !== undefined && Date.now() - entry.timestamp > this.ttlMs) {
        continue;
      }
      yield [key, entry.value];
    }
  }

  /**
   * Removes all currently expired entries and returns the number removed.
   *
   * This only has an effect when TTL support is enabled.
   */
  cleanup(): number {
    if (this.ttlMs === undefined) {
      return 0;
    }

    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttlMs) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Evicts least-recently-used entries until there is room for one more insert.
   */
  private evictIfNeeded(): void {
    while (this.cache.size >= this.maxSize) {
      // Map preserves insertion order, so first key is oldest
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      } else {
        break;
      }
    }
  }
}

/**
 * Create a simple memoization cache for function results.
 *
 * @example
 * ```typescript
 * const expensiveCache = createMemoCache<string, number>({ maxSize: 50 });
 *
 * function computeHash(input: string): number {
 *   const cached = expensiveCache.get(input);
 *   if (cached !== undefined) return cached;
 *
 *   const result = expensiveComputation(input);
 *   expensiveCache.set(input, result);
 *   return result;
 * }
 * ```
 */
export function createMemoCache<K, V>(options?: LRUCacheOptions): LRUCache<K, V> {
  return new LRUCache<K, V>(options);
}
