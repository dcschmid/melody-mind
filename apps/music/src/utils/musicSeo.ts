import { resolveAbsoluteUrl, resolvePageUrl } from "@utils/siteUrls";
import type { AlbumData, Song } from "../types/album";

type DateLike = string | Date;

interface MusicAlbumSchemaOptions {
  album: AlbumData & { publishedAt: DateLike };
  canonical: string;
  coverImageUrl: string;
  songs: Song[];
  totalDurationSeconds: number;
}

interface MusicAlbumListSchemaOptions {
  albums: Array<AlbumData & { publishedAt: DateLike }>;
  canonical: string;
  description: string;
  site: string | URL | undefined;
  getCoverImageUrl: (coverImage: string) => string;
}

const siteUrlFromCanonical = (canonical: string): string => new URL(canonical).origin;

const toIsoDate = (value: DateLike | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const toIsoDuration = (seconds: number | undefined): string | undefined => {
  if (!seconds || seconds <= 0) {
    return undefined;
  }

  const wholeSeconds = Math.round(seconds);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainingSeconds = wholeSeconds % 60;

  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${
    remainingSeconds ? `${remainingSeconds}S` : ""
  }`;
};

const sortSongsByTrackNumber = (songs: Song[]): Song[] =>
  [...songs].sort(
    (a, b) => a.trackNumber - b.trackNumber || a.title.localeCompare(b.title)
  );

const toSchemaUrl = (siteUrl: string, value: string): string => {
  const absoluteUrl = resolveAbsoluteUrl(siteUrl, value);

  try {
    return new URL(absoluteUrl).toString();
  } catch {
    return absoluteUrl;
  }
};

export function buildMusicAlbumSchema({
  album,
  canonical,
  coverImageUrl,
  songs,
  totalDurationSeconds,
}: MusicAlbumSchemaOptions): Record<string, unknown> {
  const siteUrl = siteUrlFromCanonical(canonical);
  const artistId = `${siteUrl}#artist`;
  const albumId = `${canonical}#music-album`;
  const sortedSongs = sortSongsByTrackNumber(songs);

  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    "@id": albumId,
    name: album.title,
    description: album.description,
    url: canonical,
    image: {
      "@type": "ImageObject",
      url: coverImageUrl,
      ...(album.coverImageWidth ? { width: album.coverImageWidth } : {}),
      ...(album.coverImageHeight ? { height: album.coverImageHeight } : {}),
      caption: `Cover art for ${album.title}`,
    },
    ...(album.genre ? { genre: album.genre } : {}),
    ...(toIsoDate(album.publishedAt)
      ? { datePublished: toIsoDate(album.publishedAt) }
      : {}),
    ...(toIsoDuration(totalDurationSeconds)
      ? { duration: toIsoDuration(totalDurationSeconds) }
      : {}),
    numTracks: sortedSongs.length,
    byArtist: {
      "@type": "MusicGroup",
      "@id": artistId,
      name: album.artist || "MelodyMind",
      url: siteUrl,
    },
    track: sortedSongs.map((song) => ({
      "@type": "MusicRecording",
      "@id": `${canonical}#track-${song.trackNumber}`,
      name: song.title,
      url: `${canonical}#track-${song.trackNumber}`,
      position: song.trackNumber,
      ...(song.durationSeconds ? { duration: toIsoDuration(song.durationSeconds) } : {}),
      contentUrl: toSchemaUrl(siteUrl, song.audioUrl),
      inAlbum: { "@id": albumId },
      byArtist: { "@id": artistId },
    })),
    potentialAction: {
      "@type": "ListenAction",
      target: canonical,
    },
  };
}

export function buildMusicAlbumListSchema({
  albums,
  canonical,
  description,
  site,
  getCoverImageUrl,
}: MusicAlbumListSchemaOptions): Record<string, unknown> {
  const siteUrl = siteUrlFromCanonical(canonical);
  const artistId = `${siteUrl}#artist`;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${canonical}#album-list`,
    name: "MelodyMind Music albums",
    description,
    numberOfItems: albums.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: albums.map((album, index) => {
      const albumUrl = resolvePageUrl(site, `/${album.id}/`);
      const coverImageUrl = getCoverImageUrl(album.coverImage);

      return {
        "@type": "ListItem",
        position: index + 1,
        url: albumUrl,
        item: {
          "@type": "MusicAlbum",
          "@id": `${albumUrl}#music-album`,
          name: album.title,
          description: album.description,
          url: albumUrl,
          image: coverImageUrl,
          ...(album.genre ? { genre: album.genre } : {}),
          ...(toIsoDate(album.publishedAt)
            ? { datePublished: toIsoDate(album.publishedAt) }
            : {}),
          numTracks: album.songs.length,
          byArtist: {
            "@type": "MusicGroup",
            "@id": artistId,
            name: album.artist || "MelodyMind",
            url: siteUrl,
          },
        },
      };
    }),
  };
}
