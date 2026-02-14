/**
 * getCollectionCached
 * Lightweight in-memory cache for getCollection results during a single server runtime.
 * Avoids repeated disk/file system glob overhead under higher traffic.
 * NOT persistent between server restarts; safe for static hosting / SSR edge.
 */
import type { CollectionEntry } from "astro:content";
import type { ArtistEntry } from "../../types/artist";
import {
  findUnknownArtistReferences,
  formatArtistReferenceWarnings,
} from "./artistReferences";
import { loggers } from "@utils/logging";

type AnyCollectionEntries = CollectionEntry<any>[];

interface CacheEntry {
  ts: number;
  items: AnyCollectionEntries;
}

// Simple module-level cache map
const _collectionCache = new Map<string, CacheEntry>();
const _collectionFailuresLogged = new Set<string>();
const _collectionValidationLogged = new Set<string>();

/**
 * Maximum number of cached collections.
 * Prevents memory bloat with many different collections.
 */
const MAX_CACHE_SIZE = 50;

/**
 * Interval for automatic cleanup of expired cache entries.
 * Runs every 10 minutes in Node.js runtime.
 */
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

/**
 * Remove expired entries from the cache.
 * Called periodically and when cache size exceeds limit.
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();

  // Remove expired entries
  for (const [key, entry] of _collectionCache) {
    if (now - entry.ts > DEFAULT_TTL) {
      _collectionCache.delete(key);
    }
  }

  // If still over limit, remove oldest entries
  if (_collectionCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(_collectionCache.entries());
    entries.sort((a, b) => a[1].ts - b[1].ts);
    const toDelete = entries.slice(0, _collectionCache.size - MAX_CACHE_SIZE);
    toDelete.forEach(([key]) => _collectionCache.delete(key));
  }
}

// Schedule periodic cleanup (only in Node.js runtime, not during build)
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS);
}

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
  opts: GetCollectionCachedOptions = {}
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
    const items = (await getCollection(collectionName as any)) as AnyCollectionEntries;

    if (
      collectionName === "artists" &&
      !_collectionValidationLogged.has(collectionName)
    ) {
      const unknownReferences = findUnknownArtistReferences(items as ArtistEntry[]);
      if (unknownReferences.length) {
        const details = formatArtistReferenceWarnings(unknownReferences).join("\n");

        if (process.env.STRICT_ARTIST_REFERENCES === "true") {
          throw new Error(`Unknown artist references detected:\n${details}`);
        }

        loggers.content.warn(`Unknown artist references detected:\n${details}`);
      }
      _collectionValidationLogged.add(collectionName);
    }

    if (!bypass) {
      _collectionCache.set(collectionName, { ts: Date.now(), items });
      // Trigger cleanup if cache is getting large
      if (_collectionCache.size > MAX_CACHE_SIZE) {
        cleanupExpiredEntries();
      }
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
