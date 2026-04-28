import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";
import { getCollectionCached } from "@shared-utils/utils/content/getCollectionCached";

export const prerender = true;

type QuizEntry = CollectionEntry<"quizzes">;

interface SearchIndexItem {
  title: string;
  description: string;
  url: string;
}

export const GET: APIRoute = async () => {
  const allEntries = await getCollectionCached("quizzes", { getCollection });
  const entries = allEntries as QuizEntry[];
  const items: SearchIndexItem[] = entries
    .filter((entry) => !entry.data.draft)
    .map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ?? "",
      url: `/${entry.id}`,
    }));

  return new Response(JSON.stringify(items), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
