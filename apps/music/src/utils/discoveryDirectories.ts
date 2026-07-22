import { getCollection, type CollectionEntry } from "astro:content";

import type { Entry } from "@components/music/home/types";
import type { IconName } from "@components/visual/Icon.astro";
import type { AlbumData } from "../types/album";

import { formatDuration } from "./albumPresentation";
import { getAvailableAlbums } from "./albums";
import { getAlbumCoverImage } from "./musicImages";

type GenreEntry = CollectionEntry<"genres">;
type SeriesEntry = CollectionEntry<"series">;

export interface GenreDirectoryItem {
  slug: string;
  order: number;
  mainGenre: string;
  title: string;
  eyebrow: string;
  description: string;
  keywords: string[];
  albumCount: number;
  albums: Entry[];
  iconName: IconName;
}

export interface SeriesDirectoryItem {
  slug: string;
  order: number;
  title: string;
  eyebrow: string;
  shortDescription: string;
  keywords: string[];
  albumIds: string[];
  albums: Entry[];
}

export interface DiscoveryDirectoryData {
  albums: AlbumData[];
  sortedAlbumsByDate: AlbumData[];
  albumEntries: Entry[];
  genreDirectories: GenreDirectoryItem[];
  seriesDirectories: SeriesDirectoryItem[];
}

const albumTitleCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

const compareAlbumsByTitle = (a: AlbumData, b: AlbumData) =>
  albumTitleCollator.compare(a.title, b.title) || albumTitleCollator.compare(a.id, b.id);

const compareAlbumsByDate = (a: AlbumData, b: AlbumData) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() ||
  compareAlbumsByTitle(a, b);

const mainGenreIconBySlug: Record<string, IconName> = {
  rock: "guitar",
  metal: "zap",
  pop: "sparkles",
  punk: "flag",
  gothic: "moon",
  "hip-hop": "mic",
  folk: "leaf",
  latin: "sun",
  jazz: "music",
  soundtrack: "tv",
  classical: "book-open",
};

export async function getDiscoveryDirectoryData(): Promise<DiscoveryDirectoryData> {
  const [genreEntries, seriesEntries, albums] = await Promise.all([
    getCollection("genres") as Promise<GenreEntry[]>,
    getCollection("series") as Promise<SeriesEntry[]>,
    getAvailableAlbums(),
  ]);
  const sortedAlbumsByDate = [...albums].sort(compareAlbumsByDate);
  const albumEntries: Entry[] = sortedAlbumsByDate.map((album) => {
    const totalDurationSeconds = album.songs.reduce(
      (acc, song) => acc + (song.durationSeconds || 0),
      0
    );
    const imageSrc = getAlbumCoverImage(album.coverImage);

    return {
      id: album.id,
      title: album.title,
      description: album.description,
      imageSrc,
      imageUrl: typeof imageSrc === "string" ? imageSrc : imageSrc.src,
      imageWidth: typeof imageSrc === "string" ? undefined : imageSrc.width,
      imageHeight: typeof imageSrc === "string" ? undefined : imageSrc.height,
      publishedAt: album.publishedAt,
      publishedAtTime: new Date(album.publishedAt).getTime(),
      genre: album.genre,
      mainGenre: album.mainGenre,
      trackCount: album.songs.length,
      totalDurationSeconds,
      totalDurationLabel: totalDurationSeconds
        ? formatDuration(totalDurationSeconds)
        : "",
      isVisible: true,
    };
  });
  const albumEntriesById = new Map(
    albumEntries.map((album) => [album.id.toLocaleLowerCase("en"), album])
  );
  const albumCountByMainGenre = albums.reduce<Record<string, number>>((counts, album) => {
    if (album.mainGenre) {
      counts[album.mainGenre] = (counts[album.mainGenre] || 0) + 1;
    }
    return counts;
  }, {});

  const genreDirectories: GenreDirectoryItem[] = genreEntries
    .sort(
      (a, b) =>
        a.data.order - b.data.order ||
        albumTitleCollator.compare(a.data.title, b.data.title) ||
        albumTitleCollator.compare(a.id, b.id)
    )
    .map((entry) => ({
      slug: entry.id,
      ...entry.data,
      albumCount: albumCountByMainGenre[entry.data.mainGenre] || 0,
      albums: albumEntries
        .filter((album) => album.mainGenre === entry.data.mainGenre)
        .slice(0, 3),
      iconName: mainGenreIconBySlug[entry.id] || "disc",
    }));

  const seriesDirectories: SeriesDirectoryItem[] = seriesEntries
    .sort(
      (a, b) =>
        a.data.order - b.data.order ||
        albumTitleCollator.compare(a.data.title, b.data.title) ||
        albumTitleCollator.compare(a.id, b.id)
    )
    .map((entry) => ({
      slug: entry.id,
      ...entry.data,
      albums: entry.data.albumIds
        .map((albumId: string) => albumEntriesById.get(albumId.toLocaleLowerCase("en")))
        .filter((album: Entry | undefined): album is Entry => Boolean(album)),
    }))
    .filter((series) => series.albums.length > 0);

  return {
    albums,
    sortedAlbumsByDate,
    albumEntries,
    genreDirectories,
    seriesDirectories,
  };
}
