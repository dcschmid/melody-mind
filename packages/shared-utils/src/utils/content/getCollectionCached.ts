/**
 * Lightweight process-local cache for Astro content collection reads.
 *
 * This helper wraps `astro:content`'s `getCollection()` with a small in-memory
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
import { createMemoCache } from "@shared-utils/utils/memoCache";

/** Broad collection entry array type used by the generic cache layer. */
export type AnyCollectionEntries = (Record<string, unknown>)[];

/**
 * Shared in-memory cache for collection entry arrays.
 */
const _collectionCache = createMemoCache<string, AnyCollectionEntries>();

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
    const items = (await getCollection(collectionName)) as AnyCollectionEntries;

    if (!bypass) {
      _collectionCache.set(collectionName, items);
    }
    return items;
  } catch (error) {
    loggers.content.error(`Failed to load collection "${collectionName}"`, error);
    return [] as AnyCollectionEntries;
  }
}
