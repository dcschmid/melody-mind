import rss from "@astrojs/rss";
import type { CollectionEntry } from "astro:content";
import type { APIContext } from "astro";
import { getCollectionEntries } from "@shared-utils/utils/content/getCollectionEntries";
import type { KnowledgeData } from "../content.config";

export async function GET(context: APIContext) {
  type KnowledgeEntry = CollectionEntry<"knowledge-en">;
  // Get all knowledge articles
  const knowledgeArticles: KnowledgeEntry[] = await getCollectionEntries("knowledge-en");
  const site = (context.site || "https://melody-mind.de").toString().replace(/\/$/, "");
  const feedUrl = `${site}/rss.xml`;

  // Filter out draft articles and sort by date (newest first)
  const publishedArticles = knowledgeArticles
    .filter((article) => !article.data.draft)
    .sort((a, b) => {
      const dateA = (a.data.updatedAt || a.data.createdAt || new Date(0)) as Date;
      const dateB = (b.data.updatedAt || b.data.createdAt || new Date(0)) as Date;
      return dateB.getTime() - dateA.getTime();
    });

  return rss({
    title: "MelodyMind Knowledge",
    description:
      "Deep dives into music history, genres, artists, and cultural movements that shaped the sound of each era.",
    site,
    items: publishedArticles.map((article) => {
      const data = article.data as KnowledgeData;
      const slug = article.id.replace(/\.mdx?$/, "");
      const link = new URL(`/knowledge/${slug}`, site).toString();
      const pubDate = new Date(
        (data.updatedAt || data.createdAt || Date.now()) as string | number | Date
      );
      return {
        title: data.title as string,
        description: data.description as string,
        link,
        guid: link,
        pubDate,
        author: data.author as string | undefined,
        categories: data.keywords as string[] | undefined,
      };
    }),
    customData: `<language>en-us</language>
<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    stylesheet: "/rss-styles.xsl",
  });
}
