import type { ImageMetadata } from "astro";

import type { AlbumData } from "../types/album";
import { getDiscoveryDirectoryData } from "./discoveryDirectories";
import { normalizeAlbumSearchValue } from "./albumSearch";

export const ALBUM_ARCHIVE_PAGE_SIZE = 24;

export const getAlbumArchivePageHref = (page: number) =>
  page <= 1 ? "/albums/" : `/albums/page/${page}/`;

export const formatAlbumArchivePageUrl = (url: string) => {
  const normalized = url.endsWith("/") ? url : `${url}/`;
  return normalized === "/albums/page/1/" ? "/albums/" : normalized;
};

/** One alphabetical archive row; feeds SSR cards, JSON-LD, and the search index. */
export interface AlbumArchiveItem {
  album: AlbumData;
  /** Imported cover asset so responsive renditions stay available. */
  imageSrc: string | ImageMetadata;
  title: string;
  description: string;
  genre: string | undefined;
  mainGenre: string | undefined;
  moods: string[];
  tags: string[];
  trackCount: number;
  seriesTitles: string[];
  /** Normalized (diacritic/case-insensitive) searchable haystack. */
  searchText: string;
}

const albumTitleCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

export async function getAlbumArchiveItems(): Promise<AlbumArchiveItem[]> {
  const { albums, albumEntries, seriesDirectories } = await getDiscoveryDirectoryData();
  const albumDataById = new Map(albums.map((album) => [album.id, album]));
  const seriesTitlesByAlbumId = new Map<string, string[]>();

  seriesDirectories.forEach((series) => {
    series.albumIds.forEach((albumId) => {
      const titles = seriesTitlesByAlbumId.get(albumId) || [];
      titles.push(series.title);
      seriesTitlesByAlbumId.set(albumId, titles);
    });
  });

  const sortedEntries = [...albumEntries].sort(
    (a, b) =>
      albumTitleCollator.compare(a.title, b.title) ||
      albumTitleCollator.compare(a.id, b.id)
  );
  const items: AlbumArchiveItem[] = [];

  for (const entry of sortedEntries) {
    const data = albumDataById.get(entry.id);
    if (!data) {
      throw new Error(`Album archive entry "${entry.id}" has no matching album data.`);
    }
    const seriesTitles = seriesTitlesByAlbumId.get(entry.id) || [];
    items.push({
      album: data,
      imageSrc: entry.imageSrc,
      title: entry.title,
      description: entry.description,
      genre: entry.genre,
      mainGenre: entry.mainGenre,
      moods: data.moods,
      tags: data.tags,
      trackCount: entry.trackCount,
      seriesTitles,
      searchText: normalizeAlbumSearchValue(
        [
          entry.title,
          entry.genre || "",
          entry.mainGenre || "",
          ...data.moods,
          ...data.tags,
          ...seriesTitles,
        ]
          .filter(Boolean)
          .join(" ")
      ),
    });
  }

  return items;
}
