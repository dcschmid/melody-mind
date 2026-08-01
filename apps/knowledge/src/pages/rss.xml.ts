import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
export async function GET(context: { site: URL }) {
  const articles = await getCollection("articles", ({ data }) => !data.draft);
  return rss({
    title: "MelodyMind Knowledge",
    description: "Research-led music guides and listening terms.",
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.dek,
      pubDate: article.data.publishedAt,
      link: `/${article.id}/`,
    })),
  });
}
