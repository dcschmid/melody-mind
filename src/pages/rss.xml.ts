import rss from "@astrojs/rss";
import { getCollection, type CollectionEntry } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  type KnowledgeEntry = CollectionEntry<"knowledge-en">;
  // Get all knowledge articles
  const knowledgeArticles: KnowledgeEntry[] = await getCollection("knowledge-en");
  const site = (context.site || "https://melody-mind.de").toString().replace(/\/$/, "");
  const feedUrl = `${site}/rss.xml`;

  // Filter out draft articles and sort by date (newest first)
  const publishedArticles = knowledgeArticles
    .filter((article) => !article.data.draft)
    .sort((a, b) => {
      const dateA = a.data.updatedAt || a.data.createdAt || new Date(0);
      const dateB = b.data.updatedAt || b.data.createdAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

  return rss({
    title: "MelodyMind Knowledge",
    description:
      "Deep dives into music history, genres, artists, and cultural movements that shaped the sound of each era.",
    site,
    items: publishedArticles.map((article) => {
      const slug = article.slug || article.id.replace(/\.md$/, "");
      const link = new URL(`/knowledge/${slug}`, site).toString();
      const pubDate = new Date(
        article.data.updatedAt || article.data.createdAt || Date.now()
      );
      return {
        title: article.data.title,
        description: article.data.description,
        link,
        guid: link,
        pubDate,
        author: article.data.author,
        categories: article.data.keywords,
      };
    }),
    customData: `<language>en-us</language>
<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    stylesheet: "/rss-styles.xsl",
  });
}
