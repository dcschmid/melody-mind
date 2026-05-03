import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";
import { buildSearchIndex } from "@freshjuice/astro-search-plugin/build";
import { getCollectionCached } from "@shared-utils/utils/content/getCollectionCached";

export const prerender = true;

type KnowledgeEntry = CollectionEntry<"knowledge-en">;

const MAX_BODY_LENGTH = 6000;
const trimSearchText = (value: string) => value.replace(/\s+/g, " ").trim();

export const GET: APIRoute = async () => {
  const allEntries = await getCollectionCached("knowledge-en", { getCollection });
  const entries = allEntries as KnowledgeEntry[];
  const documents = entries
    .filter(({ data }) => !data.draft)
    .map((entry) => {
      const body = trimSearchText(entry.body || "").slice(0, MAX_BODY_LENGTH);

      return {
        id: entry.id,
        type: "Article",
        title: entry.data.title,
        desc: entry.data.description ?? "",
        url: `/knowledge/${entry.id}/`,
        taxonomySubsection: entry.data.taxonomySubsection || "",
        taxonomyGroup: entry.data.taxonomyGroup || "",
        keywords: entry.data.keywords || [],
        takeaways: entry.data.takeaways || [],
        body,
      };
    });

  const index = await buildSearchIndex({
    schema: {
      type: "string",
      title: "string",
      desc: "string",
      url: "string",
      taxonomySubsection: "string",
      taxonomyGroup: "string",
      keywords: "string[]",
      takeaways: "string[]",
      body: "string",
    },
    documents,
    language: "english",
  });

  return new Response(JSON.stringify(index), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
