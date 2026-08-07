import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";

import type { CollectionEntry } from "astro:content";
import type { Song } from "../../types/album";
import type { AlbumPlayerQueue } from "../../types/player";
import { getAlbumCoverImagePath } from "../../utils/musicImages";

type AlbumEntry = CollectionEntry<"albums">;

export const getStaticPaths: GetStaticPaths = async () => {
  const albums = (await getCollection(
    "albums",
    (entry: AlbumEntry) => entry.data.isAvailable
  )) as AlbumEntry[];

  return albums.map((entry) => ({
    params: { albumId: entry.id },
    props: {
      queue: {
        kind: "album",
        queueId: `album:${entry.id}`,
        title: entry.data.title,
        url: `/${entry.id}/`,
        album: {
          id: entry.id,
          title: entry.data.title,
          url: `/${entry.id}/`,
          artworkUrl: getAlbumCoverImagePath(entry.data.coverImage),
        },
        tracks: entry.data.songs.map((song: Song) => ({
          trackNumber: song.trackNumber,
          title: song.title,
          audioUrl: song.audioUrl,
          ...(song.durationSeconds ? { durationSeconds: song.durationSeconds } : {}),
        })),
      } satisfies AlbumPlayerQueue,
    },
  }));
};

export const GET: APIRoute = ({ props }) =>
  new Response(JSON.stringify(props.queue), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
