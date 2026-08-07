import { resolveAbsoluteUrl, resolvePageUrl } from "@utils/siteUrls";
import type { AlbumData, Song } from "../types/album";

type DateLike = string | Date;

/* Editorial language labels used in album frontmatter, mapped to BCP-47.
   "zxx" marks instrumental albums (no linguistic content). */
const LANGUAGE_TO_BCP47: Record<string, string> = {
  english: "en",
  german: "de",
  french: "fr",
  spanish: "es",
  italian: "it",
  korean: "ko",
  japanese: "ja",
  dutch: "nl",
  swedish: "sv",
  norwegian: "no",
  finnish: "fi",
  instrumental: "zxx",
};

const toLanguageCode = (language: string | undefined): string | undefined =>
  language ? LANGUAGE_TO_BCP47[language.trim().toLowerCase()] : undefined;

interface MusicAlbumSchemaOptions {
  album: AlbumData & { publishedAt: DateLike };
  canonical: string;
  coverImageUrl: string;
  songs: Song[];
  totalDurationSeconds: number;
  /** Collection pages the album belongs to (genre landing, series pages). */
  collectionPages?: Array<{ url: string; name: string }>;
}

interface MusicAlbumListSchemaOptions {
  albums: Array<AlbumData & { publishedAt: DateLike }>;
  canonical: string;
  description: string;
  name?: string;
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

const getTrackUrl = (canonical: string, trackNumber: number): string =>
  `${canonical}#track-${trackNumber}`;

export function buildMusicAlbumSchema({
  album,
  canonical,
  coverImageUrl,
  songs,
  totalDurationSeconds,
  collectionPages = [],
}: MusicAlbumSchemaOptions): Record<string, unknown> {
  const siteUrl = siteUrlFromCanonical(canonical);
  const artistId = `${siteUrl}#artist`;
  const albumId = `${canonical}#music-album`;
  const sortedSongs = sortSongsByTrackNumber(songs);
  const languageCode = toLanguageCode(album.language);

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
    ...(languageCode ? { inLanguage: languageCode } : {}),
    ...(collectionPages.length > 0
      ? {
          isPartOf: collectionPages.map((page) => ({
            "@type": "CollectionPage",
            url: page.url,
            name: page.name,
          })),
        }
      : {}),
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
      "@id": getTrackUrl(canonical, song.trackNumber),
      name: song.title,
      url: getTrackUrl(canonical, song.trackNumber),
      position: song.trackNumber,
      ...(song.description ? { description: song.description } : {}),
      ...(song.durationSeconds ? { duration: toIsoDuration(song.durationSeconds) } : {}),
      contentUrl: toSchemaUrl(siteUrl, song.audioUrl),
      audio: {
        "@type": "AudioObject",
        url: toSchemaUrl(siteUrl, song.audioUrl),
        encodingFormat: "audio/mpeg",
        ...(song.durationSeconds
          ? { duration: toIsoDuration(song.durationSeconds) }
          : {}),
      },
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
  name = "MelodyMind Music albums",
  site,
  getCoverImageUrl,
}: MusicAlbumListSchemaOptions): Record<string, unknown> {
  const siteUrl = siteUrlFromCanonical(canonical);
  const artistId = `${siteUrl}#artist`;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${canonical}#album-list`,
    name,
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
