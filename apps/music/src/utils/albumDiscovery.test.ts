import { describe, expect, it } from "vitest";
import type { AlbumData } from "../types/album";
import { getAlbumDiscoveryMeta, getRelatedAlbums } from "./albumDiscovery";

const makeAlbum = (overrides: Partial<AlbumData>): AlbumData => ({
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
  songs: [
    { title: "Track One", audioUrl: "https://cdn.example/one.mp3", trackNumber: 1 },
  ],
  ...overrides,
});

describe("getAlbumDiscoveryMeta", () => {
  it("infers moods, energy, and language from the genre maps", () => {
    const meta = getAlbumDiscoveryMeta(
      makeAlbum({ genre: "K-Pop", energy: undefined as unknown as "high" })
    );

    expect(meta.moods).toEqual(expect.arrayContaining(["energetic", "romantic", "neon"]));
    expect(meta.energy).toBe("high");
    expect(meta.language).toBe("Korean");
  });

  it("infers moods and tags from title and description keywords", () => {
    const meta = getAlbumDiscoveryMeta(
      makeAlbum({
        title: "Neon City Nights",
        description: "A war over every heart in the skyline.",
      })
    );

    expect(meta.moods).toEqual(
      expect.arrayContaining(["neon", "nocturnal", "dramatic", "romantic"])
    );
    expect(meta.tags).toEqual(expect.arrayContaining(["city", "conflict"]));
  });

  it("keeps explicit metadata, trims values, and removes duplicates", () => {
    const meta = getAlbumDiscoveryMeta(
      makeAlbum({
        genre: "K-Pop",
        language: "German",
        moods: ["Dark ", "dark", "neon"],
        tags: [" tour ", "tour", ""],
      })
    );

    expect(meta.language).toBe("German");
    expect(meta.moods).toContain("dark");
    expect(meta.moods.filter((mood) => mood === "dark")).toHaveLength(1);
    expect(meta.tags).toEqual(expect.arrayContaining(["tour", "K-Pop"]));
    expect(meta.tags.filter((tag) => tag === "tour")).toHaveLength(1);
  });

  it("falls back to the genre energy and then to medium", () => {
    const withoutEnergy = (genre?: string) =>
      makeAlbum({
        ...(genre ? { genre } : {}),
        energy: undefined as unknown as "medium",
      });

    expect(getAlbumDiscoveryMeta(withoutEnergy("Punk")).energy).toBe("high");
    expect(getAlbumDiscoveryMeta(withoutEnergy("Polka")).energy).toBe("medium");
  });
});

describe("getRelatedAlbums", () => {
  const current = makeAlbum({
    id: "current",
    genre: "Gothic",
    moods: ["dark"],
    artist: "Band A",
  });

  it("excludes the current album and respects the limit", () => {
    const candidates = Array.from({ length: 6 }, (_, index) =>
      makeAlbum({
        id: `candidate-${index}`,
        publishedAt: `2026-01-0${index + 1}T00:00:00Z`,
      })
    );

    const related = getRelatedAlbums(current, [current, ...candidates], 3);

    expect(related).toHaveLength(3);
    expect(related.map((album) => album.id)).not.toContain("current");
  });

  it("ranks genre and mood matches above unrelated albums", () => {
    const strongMatch = makeAlbum({
      id: "strong",
      genre: "Gothic",
      moods: ["dark"],
      publishedAt: "2026-01-02T00:00:00Z",
    });
    const weakMatch = makeAlbum({
      id: "weak",
      genre: "Jazz",
      moods: ["warm"],
      energy: "low",
      artist: "Band B",
      songs: Array.from({ length: 5 }, (_, index) => ({
        title: `Track ${index + 1}`,
        audioUrl: `https://cdn.example/${index + 1}.mp3`,
        trackNumber: index + 1,
      })),
      publishedAt: "2026-01-03T00:00:00Z",
    });

    const related = getRelatedAlbums(current, [weakMatch, strongMatch]);

    expect(related.map((album) => album.id)).toEqual(["strong", "weak"]);
  });

  it("orders equal scores by the newest release date", () => {
    const older = makeAlbum({ id: "older", publishedAt: "2026-01-01T00:00:00Z" });
    const newer = makeAlbum({ id: "newer", publishedAt: "2026-02-01T00:00:00Z" });

    const related = getRelatedAlbums(current, [older, newer]);

    expect(related.map((album) => album.id)).toEqual(["newer", "older"]);
  });
});
