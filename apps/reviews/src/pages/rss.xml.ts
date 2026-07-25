import rss from "@astrojs/rss";
import { getCollection, getEntry } from "astro:content";

export async function GET(context: { site?: URL }) {
  const reviews = (await getCollection("reviews", ({ data }) => !data.draft)).toSorted(
    (left, right) => right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf()
  );
  const author = await getEntry("authors", "daniel-schmid");

  return rss({
    title: "MelodyMind Reviews",
    description: "Sourced album criticism without numerical scores.",
    site: context.site ?? "https://reviews.melody-mind.de",
    items: reviews.map((review) => ({
      title: review.data.title,
      description: review.data.dek,
      pubDate: review.data.publishedAt,
      link: `/reviews/${review.id}/`,
      categories: review.data.album.genres,
      author: author?.data.name ?? "Daniel Schmid",
    })),
    customData: "<language>en</language>",
  });
}
