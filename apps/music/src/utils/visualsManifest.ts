import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import type { CollectionEntry } from "astro:content";
import { getAlbumCoverImagePath } from "./musicImages";
import { mixAmbientColor } from "./visuals";
import type { VisualAlbumManifest } from "../types/visuals";

type AlbumEntry = CollectionEntry<"albums">;

const LANGUAGE_TAGS: Record<string, string> = {
  arabic: "ar",
  dutch: "nl",
  english: "en",
  finnish: "fi",
  french: "fr",
  german: "de",
  italian: "it",
  instrumental: "en",
  japanese: "ja",
  korean: "ko",
  norwegian: "no",
  polish: "pl",
  portuguese: "pt",
  spanish: "es",
  swedish: "sv",
};

export const normalizeVisualsLanguage = (language?: string): string => {
  const normalized = language?.trim().toLowerCase();
  if (!normalized) {
    return "en";
  }
  return LANGUAGE_TAGS[normalized] || normalized;
};

export const readCoverAmbientColor = async (coverImage: string): Promise<string> => {
  try {
    const coverPath = path.resolve(process.cwd(), "src/assets/album-covers", coverImage);
    const { dominant } = await sharp(coverPath).stats();
    return mixAmbientColor(dominant);
  } catch {
    return mixAmbientColor(null);
  }
};

export const buildVisualAlbumManifest = async (
  entry: AlbumEntry
): Promise<VisualAlbumManifest> => ({
  albumId: entry.id,
  title: entry.data.title,
  url: `/${entry.id}/`,
  artworkUrl: getAlbumCoverImagePath(entry.data.coverImage),
  language: normalizeVisualsLanguage(entry.data.language),
  ambientColor: await readCoverAmbientColor(entry.data.coverImage),
  tracks: [...entry.data.songs]
    .sort((left, right) => left.trackNumber - right.trackNumber)
    .map((song) => ({
      trackNumber: song.trackNumber,
      title: song.title,
      ...(song.durationSeconds ? { durationSeconds: song.durationSeconds } : {}),
      ...(song.lyricsUrl ? { lyricsUrl: song.lyricsUrl } : {}),
      isInstrumental: song.isInstrumental === true,
    })),
});
