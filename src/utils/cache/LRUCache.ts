/**
 * Generic LRU (Least Recently Used) Cache implementation.
 *
 * Provides an in-memory cache with automatic eviction of oldest entries
 * when the maximum size is exceeded. Optional TTL (time-to-live) support
 * for automatic expiration of stale entries.
 *
 * @module utils/cache/LRUCache
 */

/**
 * Cache entry with value and metadata.
 */
interface CacheEntry<V> {
  /** The cached value */
  value: V;
  /** Timestamp when the entry was created (ms since epoch) */
  timestamp: number;
}

/**
 * LRU Cache options.
 */
export interface LRUCacheOptions {
  /** Maximum number of entries in the cache (default: 100) */
  maxSize?: number;
  /** Time-to-live in milliseconds (default: no TTL) */
  ttlMs?: number;
}

/**
 * Generic LRU Cache with optional TTL support.
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
   * Get a value from the cache.
   * Returns undefined if the key doesn't exist or the entry has expired.
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
   * Set a value in the cache.
   * If the cache is full, the oldest entry is evicted.
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
   * Check if a key exists in the cache (and hasn't expired).
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
   * Delete a key from the cache.
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the current number of entries in the cache.
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Get all keys in the cache.
   */
  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  /**
   * Get all values in the cache.
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
   * Get all entries in the cache.
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
   * Remove expired entries from the cache.
   * Only has effect if TTL is configured.
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
   * Evict oldest entries if cache is at capacity.
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
