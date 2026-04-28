import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";
import { getCollectionCached } from "@shared-utils/utils/content/getCollectionCached";

export const prerender = true;

type KnowledgeEntry = CollectionEntry<"knowledge-en">;

interface SearchIndexItem {
  title: string;
  description: string;
  url: string;
}

export const GET: APIRoute = async () => {
  const allEntries = await getCollectionCached("knowledge-en", { getCollection });
  const entries = allEntries as KnowledgeEntry[];
  const items: SearchIndexItem[] = entries
    .filter(({ data }) => !data.draft)
    .map((entry) => {
      const data = entry.data as { title: string; description?: string };

      return {
        title: data.title,
        description: data.description ?? "",
        url: `/knowledge/${entry.id}/`,
      };
    });

  return new Response(JSON.stringify(items), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
