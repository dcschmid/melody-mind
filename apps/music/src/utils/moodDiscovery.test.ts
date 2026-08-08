import { describe, expect, it } from "vitest";
import type { AlbumData, Song } from "../types/album";
import {
  formatMoodName,
  getAlbumDurationSeconds,
  getAlbumMoodFamilies,
  getAlbumVoiceType,
} from "./moodDiscovery";

const makeSong = (overrides: Partial<Song> = {}): Song => ({
  title: "Track",
  audioUrl: "https://cdn.example/track.mp3",
  trackNumber: 1,
  ...overrides,
});

const makeAlbum = (songs: Song[], language?: string): AlbumData => ({
  id: "album",
  title: "Album",
  description: "An album description.",
  coverImage: "album.webp",
  publishedAt: "2026-01-01T00:00:00Z",
  moods: [],
  tags: [],
  energy: "medium",
  artist: "MelodyMind",
  isAvailable: true,
  songs,
  ...(language ? { language } : {}),
});

describe("getAlbumMoodFamilies", () => {
  it("maps moods to families with case and hyphen normalization", () => {
    expect(getAlbumMoodFamilies(["Neon-Dark", "EPIC"])).toEqual(["dark", "triumphant"]);
  });

  it("matches family tokens as substrings of a mood", () => {
    expect(getAlbumMoodFamilies(["late-night haunting"])).toEqual(["dark"]);
  });

  it("returns no families for empty or unmatched moods", () => {
    expect(getAlbumMoodFamilies([])).toEqual([]);
    expect(getAlbumMoodFamilies(["neon", "fast"])).toEqual([]);
  });
});

describe("getAlbumVoiceType", () => {
  it("returns instrumental when every track is instrumental", () => {
    const album = makeAlbum([
      makeSong({ isInstrumental: true, trackNumber: 1 }),
      makeSong({ isInstrumental: true, trackNumber: 2 }),
    ]);

    expect(getAlbumVoiceType(album)).toBe("instrumental");
  });

  it("treats the Instrumental language marker as instrumental", () => {
    const album = makeAlbum([makeSong(), makeSong({ trackNumber: 2 })], "Instrumental");

    expect(getAlbumVoiceType(album)).toBe("instrumental");
  });

  it("returns mixed when only some tracks are instrumental", () => {
    const album = makeAlbum([
      makeSong(),
      makeSong({ isInstrumental: true, trackNumber: 2 }),
    ]);

    expect(getAlbumVoiceType(album)).toBe("mixed");
  });

  it("returns vocal when no track is instrumental", () => {
    expect(getAlbumVoiceType(makeAlbum([makeSong(), makeSong({ trackNumber: 2 })]))).toBe(
      "vocal"
    );
  });
});

describe("getAlbumDurationSeconds", () => {
  it("sums track durations and counts missing durations as zero", () => {
    const album = makeAlbum([
      makeSong({ durationSeconds: 120 }),
      makeSong({ trackNumber: 2 }),
      makeSong({ durationSeconds: 60, trackNumber: 3 }),
    ]);

    expect(getAlbumDurationSeconds(album)).toBe(180);
  });
});

describe("formatMoodName", () => {
  it("replaces hyphens and capitalizes the first letter", () => {
    expect(formatMoodName("dark-pop")).toBe("Dark pop");
  });

  it("returns an empty string for blank moods", () => {
    expect(formatMoodName("   ")).toBe("");
  });
});
