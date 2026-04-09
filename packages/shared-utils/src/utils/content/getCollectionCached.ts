/**
 * Lightweight process-local cache for Astro content collection reads.
 *
 * This helper wraps `astro:content`'s `getCollection()` with a small in-memory LRU
 * cache so repeated requests in the same server/runtime do not repeatedly pay the
 * content loading and globbing cost.
 *
 * Important scope:
 * - cache entries live only for the current Node/server process,
 * - the cache is not shared across instances, regions or restarts,
 * - and it is mainly useful during SSR/dev workloads or repeated utility calls
 *   within the same build/runtime process.
 */
import type { CollectionEntry } from "astro:content";
import { loggers } from "@shared-utils/utils/logging";
import { LRUCache } from "@shared-utils/utils/cache/LRUCache";

type GetCollectionFn = (name: string) => Promise<CollectionEntry<unknown>[]>;

/** Broad collection entry array type used by the generic cache layer. */
export type AnyCollectionEntries = CollectionEntry<unknown>[];

/**
 * Upper bound for distinct collection names held in memory at once.
 *
 * The cache is keyed by collection name, not by filter parameters.
 */
const MAX_CACHE_SIZE = 50;

/**
 * Default lifetime for a cached collection snapshot.
 *
 * Short enough to stay reasonably fresh in long-lived runtimes while still
 * reducing repeated collection-loading overhead.
 *
 * Can be overridden via COLLECTION_CACHE_TTL_MS env var:
 * - "0" or "Infinity" = no TTL (entries only evicted by LRU, ideal for SSG builds)
 * - numeric value = TTL in milliseconds (default: 5 minutes)
 */
const resolveTtlMs = (): number | undefined => {
  const envValue = process.env.COLLECTION_CACHE_TTL_MS;
  if (envValue !== undefined) {
    const parsed = Number(envValue);
    return parsed <= 0 || !Number.isFinite(parsed) ? undefined : parsed;
  }
  return 5 * 60 * 1000;
};

const DEFAULT_TTL_MS = resolveTtlMs();

/**
 * Shared in-memory cache for collection entry arrays.
 */
const _collectionCache = new LRUCache<string, AnyCollectionEntries>({
  maxSize: MAX_CACHE_SIZE,
  ttlMs: DEFAULT_TTL_MS,
});

/**
 * Tracks which collection names have already emitted a load failure log entry.
 *
 * This keeps repeated runtime failures from flooding logs on every access.
 */
const _collectionFailuresLogged = new Set<string>();

/** Internal wrapper that coerces Astro's overloaded getCollection to a uniform signature. */
function wrapGetCollection(
  getCollection: (name: string) => Promise<CollectionEntry<any>[]>
): GetCollectionFn {
  return async (name: string) =>
    getCollection(name) as Promise<CollectionEntry<unknown>[]>;
}

export interface GetCollectionCachedOptions {
  /**
   * When true, skips both cache reads and cache writes for this invocation.
   *
   * Useful when a caller explicitly wants a fresh collection read without
   * disturbing the shared cache state.
   */
  bypass?: boolean;
  /**
   * The getCollection function from astro:content.
   *
   * Required because astro:content is only available in Astro components/pages.
   */
  getCollection: (name: string) => Promise<CollectionEntry<any>[]>;
}

/**
 * Retrieves a collection by name, optionally reusing a cached snapshot.
 *
 * Behavior:
 * - returns cached entries when available and not expired,
 * - calls the provided getCollection function when a fresh read is needed,
 * - caches successful reads unless `bypass` is enabled,
 * - and returns an empty array on failure after logging the first failure per
 *   collection name.
 *
 * This helper intentionally does not throw for load failures because many callers
 * prefer graceful fallback behavior at the page-assembly layer.
 *
 * @param collectionName - The name of the collection to retrieve
 * @param opts - Options for caching behavior
 * @returns The collection entries, or an empty array on failure
 */
export async function getCollectionCached(
  collectionName: string,
  opts: GetCollectionCachedOptions
): Promise<AnyCollectionEntries> {
  const { bypass = false, getCollection } = opts;

  if (!bypass) {
    const cached = _collectionCache.get(collectionName);
    if (cached !== undefined) {
      return cached;
    }
  }

  try {
    const wrapped = wrapGetCollection(getCollection);
    const items = await wrapped(collectionName);

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
