import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import type { CollectionEntry } from "astro:content";
import type { Song } from "../types/album";
import { getAlbumCoverImageUrl } from "../utils/musicImages";

type AlbumEntry = CollectionEntry<"albums">;

export const GET: APIRoute = async () => {
  const albums = (await getCollection(
    "albums",
    (entry: AlbumEntry) => entry.data.isAvailable
  )) as AlbumEntry[];
  const queues = Object.fromEntries(
    albums.map((entry) => [
      entry.id,
      {
        albumId: entry.id,
        albumTitle: entry.data.title,
        albumUrl: `/${entry.id}/`,
        albumArtworkUrl: getAlbumCoverImageUrl(entry.data.coverImage),
        tracks: entry.data.songs.map((song: Song) => ({
          trackNumber: song.trackNumber,
          title: song.title,
          audioUrl: song.audioUrl,
          ...(song.durationSeconds ? { durationSeconds: song.durationSeconds } : {}),
        })),
      },
    ])
  );

  return new Response(JSON.stringify(queues), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate, stale-while-revalidate=86400",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
