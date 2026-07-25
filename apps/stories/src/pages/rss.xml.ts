import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site?: URL }) {
  const stories = (await getCollection("stories", ({ data }) => !data.draft)).toSorted(
    (left, right) => right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf()
  );

  return rss({
    title: "MelodyMind Stories",
    description:
      "Sourced long-form music journalism about artists, scenes, recordings, and design.",
    site: context.site ?? "https://stories.melody-mind.de",
    items: stories.map((story) => ({
      title: story.data.title,
      description: story.data.dek,
      pubDate: story.data.publishedAt,
      link: `/${story.id}/`,
      categories: story.data.topics,
      author: story.data.byline,
    })),
    customData: "<language>en</language>",
  });
}
