import type { CollectionEntry } from "astro:content";
import { getCollectionCached, type GetCollectionCachedOptions } from "./getCollectionCached";

export async function getCollectionEntries<CollectionName extends string>(
  collectionName: CollectionName,
  opts?: GetCollectionCachedOptions
): Promise<CollectionEntry<CollectionName>[]> {
  const entries = await getCollectionCached(collectionName, opts);
  return entries as CollectionEntry<CollectionName>[];
}
