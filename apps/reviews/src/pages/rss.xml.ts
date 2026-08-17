import rss from "@astrojs/rss";
import { getCollection, getEntry } from "astro:content";

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export async function GET(context: { site?: URL }) {
  const reviews = (await getCollection("reviews", ({ data }) => !data.draft)).toSorted(
    (left, right) => right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf()
  );
  const authors = await Promise.all(
    reviews.map((review) => getEntry(review.data.author))
  );

  return rss({
    title: "MelodyMind Reviews",
    description: "Sourced album criticism without numerical scores.",
    site: context.site ?? "https://reviews.melody-mind.de",
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    items: reviews.map((review, index) => {
      const author = authors[index];
      return {
        title: review.data.title,
        description: review.data.dek,
        pubDate: review.data.publishedAt,
        link: `/reviews/${review.id}/`,
        categories: review.data.album.genres,
        ...(author
          ? { customData: `<dc:creator>${escapeXml(author.data.name)}</dc:creator>` }
          : {}),
      };
    }),
    customData: "<language>en</language>",
  });
}
