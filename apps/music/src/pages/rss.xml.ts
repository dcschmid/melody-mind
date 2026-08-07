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

/* RSS enclosures require a byte length; ask the storage for it without
   downloading the track. Items keep working without an enclosure when the
   probe fails, so feeds never depend on remote availability. */
const getAudioByteLength = async (url: string): Promise<number | undefined> => {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) {
        return undefined;
      }
      const length = Number(response.headers.get("content-length"));
      return Number.isFinite(length) && length > 0 ? length : undefined;
    } catch {
      /* Transient network errors get one retry. */
    }
  }
  return undefined;
};

/* Keep probe concurrency low so the storage does not throttle the build. */
const mapWithConcurrencyLimit = async <T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await fn(items[index] as T);
    }
  });
  await Promise.all(workers);

  return results;
};

export const GET: APIRoute = async (context) => {
  const albums: AlbumEntry[] = (
    await getCollection("albums", (entry: AlbumEntry) => entry.data.isAvailable)
  ).sort(byPublishedDateDesc);

  const firstTracks = albums.map((album) => album.data.songs[0]);
  const enclosureLengths = await mapWithConcurrencyLimit(firstTracks, 8, (track) =>
    track ? getAudioByteLength(track.audioUrl) : Promise.resolve(undefined)
  );

  return rss({
    title: "MelodyMind Music",
    description:
      "New AI-assisted concept albums from MelodyMind Music, spanning rock, metal, pop, punk, gothic, folk, jazz, Latin, classical, and soundtrack releases.",
    site: context.site ?? "https://melody-mind.de",
    items: albums.map((album, index) => {
      const firstTrack = firstTracks[index];
      const enclosureLength = enclosureLengths[index];

      return {
        title: album.data.title,
        description: album.data.description,
        pubDate: album.data.publishedAt,
        link: `/${album.id}/`,
        categories: getAlbumCategories(album),
        customData: `<media:thumbnail url="${getAlbumCoverImageUrl(album.data.coverImage)}" />`,
        ...(firstTrack && enclosureLength
          ? {
              enclosure: {
                url: firstTrack.audioUrl,
                length: enclosureLength,
                type: "audio/mpeg",
              },
            }
          : {}),
      };
    }),
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
    },
    customData: "<language>en-us</language>",
  });
};
