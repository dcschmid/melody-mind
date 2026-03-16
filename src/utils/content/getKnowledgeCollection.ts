import { getCollectionCached } from "@utils/content/getCollectionCached";
import type { CollectionEntry } from "astro:content";

type KnowledgeEntry = CollectionEntry<"knowledge-en">;

export async function getKnowledgeCollection(): Promise<KnowledgeEntry[]> {
  const entries = await getCollectionCached("knowledge-en").catch(() => []);
  return entries as KnowledgeEntry[];
}
