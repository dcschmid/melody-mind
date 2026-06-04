import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { getAlbumCoverImageUrl } from "../utils/musicImages";

import type { CollectionEntry } from "astro:content";

type AlbumEntry = CollectionEntry<"albums">;

const byPublishedDateDesc = (a: AlbumEntry, b: AlbumEntry): number =>
  b.data.publishedAt.getTime() - a.data.publishedAt.getTime();

const getAlbumCategories = (album: AlbumEntry): string[] =>
  [
    album.data.mainGenre,
    album.data.genre,
    album.data.language,
    ...album.data.moods,
    ...album.data.tags,
  ].filter((category): category is string => Boolean(category));

export const GET: APIRoute = async (context) => {
  const albums: AlbumEntry[] = await getCollection(
    "albums",
    (entry: AlbumEntry) => entry.data.isAvailable
  );

  return rss({
    title: "MelodyMind Music",
    description:
      "New AI-assisted concept albums from MelodyMind Music, spanning rock, metal, pop, punk, gothic, folk, jazz, Latin, classical, and soundtrack releases.",
    site: context.site ?? "https://melody-mind.de",
    items: albums.sort(byPublishedDateDesc).map((album) => ({
      title: album.data.title,
      description: album.data.description,
      pubDate: album.data.publishedAt,
      link: `/${album.id}/`,
      categories: getAlbumCategories(album),
      customData: `<media:thumbnail url="${getAlbumCoverImageUrl(album.data.coverImage)}" />`,
    })),
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
    },
    customData: "<language>en-us</language>",
  });
};
