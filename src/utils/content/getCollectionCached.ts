/**
 * getCollectionCached
 * Lightweight in-memory cache for getCollection results during a single server runtime.
 * Avoids repeated disk/file system glob overhead under higher traffic.
 * NOT persistent between server restarts; safe for static hosting / SSR edge.
 */
import type { CollectionEntry } from "astro:content";

type AnyCollectionEntries = CollectionEntry<any>[];

interface CacheEntry {
  ts: number;
  items: AnyCollectionEntries;
}

// Simple module-level cache map
const _collectionCache = new Map<string, CacheEntry>();

export interface GetCollectionCachedOptions {
  /** Optional TTL in ms (default: 5 minutes) */
  ttlMs?: number;
  /** Disable caching for one-off calls */
  bypass?: boolean;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Retrieve a content collection, caching the result for a configurable TTL.
 * Falls back to empty array on failure (caller can decide on fallback language logic).
 */
export async function getCollectionCached(
  collectionName: string,
  opts: GetCollectionCachedOptions = {},
): Promise<AnyCollectionEntries> {
  const { ttlMs = DEFAULT_TTL, bypass = false } = opts;

  if (!bypass) {
    const cached = _collectionCache.get(collectionName);
    if (cached && Date.now() - cached.ts < ttlMs) {
      return cached.items;
    }
  }

  try {
    const { getCollection } = await import("astro:content");
    const items = (await getCollection(
      collectionName as any,
    )) as AnyCollectionEntries;
    if (!bypass) {
      _collectionCache.set(collectionName, { ts: Date.now(), items });
    }
    return items;
  } catch {
    return [] as AnyCollectionEntries;
  }
}

/** Clear the entire in-memory cache (useful for dev hot reload triggers). */
export function clearCollectionCache(): void {
  _collectionCache.clear();
}
