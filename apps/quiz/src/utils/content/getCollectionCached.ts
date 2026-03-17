/**
 * getCollectionCached
 * Lightweight in-memory cache for getCollection results during a single server runtime.
 * Avoids repeated disk/file system glob overhead under higher traffic.
 * NOT persistent between server restarts; safe for static hosting / SSR edge.
 */
import type { CollectionEntry } from "astro:content";
import { loggers } from "@utils/logging";
import { LRUCache } from "@utils/cache/LRUCache";

type AnyCollectionEntries = CollectionEntry<any>[];

/**
 * Maximum number of cached collections.
 * Prevents memory bloat with many different collections.
 */
const MAX_CACHE_SIZE = 50;

/**
 * Default TTL for cached collections (5 minutes).
 */
const DEFAULT_TTL_MS = 5 * 60 * 1000;

/**
 * LRU cache for collection entries with TTL support.
 */
const _collectionCache = new LRUCache<string, AnyCollectionEntries>({
  maxSize: MAX_CACHE_SIZE,
  ttlMs: DEFAULT_TTL_MS,
});

/**
 * Track which collections have logged failures to avoid spam.
 */
const _collectionFailuresLogged = new Set<string>();

export interface GetCollectionCachedOptions {
  /** Disable caching for one-off calls */
  bypass?: boolean;
}

/**
 * Retrieve a content collection, caching the result for the default TTL.
 * Falls back to empty array on failure (caller can decide on fallback language logic).
 *
 * @param collectionName - The name of the collection to retrieve
 * @param opts - Options for caching behavior
 * @returns The collection entries, or an empty array on failure
 */
export async function getCollectionCached(
  collectionName: string,
  opts: GetCollectionCachedOptions = {}
): Promise<AnyCollectionEntries> {
  const { bypass = false } = opts;

  if (!bypass) {
    const cached = _collectionCache.get(collectionName);
    if (cached !== undefined) {
      return cached;
    }
  }

  try {
    const { getCollection } = await import("astro:content");
    const items = (await getCollection(collectionName as any)) as AnyCollectionEntries;

    if (!bypass) {
      _collectionCache.set(collectionName, items);
    }
    return items;
  } catch (error) {
    if (!_collectionFailuresLogged.has(collectionName)) {
      loggers.content.error(`Failed to load collection "${collectionName}"`, error);
      _collectionFailuresLogged.add(collectionName);
    }
    return [] as AnyCollectionEntries;
  }
}

/** Clear the entire in-memory cache (useful for dev hot reload triggers). */
export function clearCollectionCache(): void {
  _collectionCache.clear();
}
