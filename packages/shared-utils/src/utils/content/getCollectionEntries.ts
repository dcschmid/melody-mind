/**
 * Typed wrapper around `getCollectionCached()` for Astro content collections.
 *
 * This helper does not add new caching behavior. Its purpose is to preserve the
 * collection-name generic at the call site so consumers get correctly typed
 * `CollectionEntry<CollectionName>[]` results instead of falling back to a broader
 * untyped array shape from the generic cache layer.
 *
 * In short:
 * - `getCollectionCached()` handles caching and fault tolerance,
 * - `getCollectionEntries()` injects Astro's `getCollection()` function,
 * - and restores the more precise Astro collection typing.
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { getCollectionCached, type GetCollectionCachedOptions } from "./getCollectionCached";

type GetCollectionEntriesOptions = Omit<GetCollectionCachedOptions, "getCollection">;

/**
 * Loads a collection through the shared cache layer and returns the result with the
 * collection-specific Astro entry type preserved.
 *
 * @param collectionName - The Astro content collection identifier
 * @param opts - Optional cache control flags forwarded to `getCollectionCached()`
 * @returns The collection entries typed as `CollectionEntry<CollectionName>[]`
 */
export async function getCollectionEntries<CollectionName extends string>(
  collectionName: CollectionName,
  opts?: GetCollectionEntriesOptions
): Promise<CollectionEntry<CollectionName>[]> {
  const entries = await getCollectionCached(collectionName, {
    ...opts,
    getCollection,
  });
  return entries as CollectionEntry<CollectionName>[];
}
