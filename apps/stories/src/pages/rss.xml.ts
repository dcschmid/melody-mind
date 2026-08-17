import rss from "@astrojs/rss";

import { getPublishedStories } from "@utils/archive";

const escapeXml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export async function GET(context: { site?: URL }) {
  const stories = await getPublishedStories();

  return rss({
    title: "MelodyMind Stories",
    description:
      "Sourced long-form music journalism about artists, scenes, recordings, and design.",
    site: context.site ?? "https://stories.melody-mind.de",
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    items: stories.map((story) => ({
      title: story.data.title,
      description: story.data.dek,
      pubDate: story.data.publishedAt,
      link: `/${story.id}/`,
      categories: story.data.topics,
      customData: `<dc:creator>${escapeXml(story.data.byline)}</dc:creator>`,
    })),
    customData: "<language>en</language>",
  });
}
