import { describe, expect, it } from "vitest";
import type { AlbumData, Song } from "../types/album";
import { buildMusicAlbumListSchema, buildMusicAlbumSchema } from "./musicSeo";

const makeSong = (trackNumber: number, overrides: Partial<Song> = {}): Song => ({
  title: `Track ${trackNumber}`,
  audioUrl: `https://cdn.example/track-${trackNumber}.mp3`,
  trackNumber,
  ...overrides,
});

const makeAlbum = (overrides: Partial<AlbumData> = {}): AlbumData => ({
  id: "test-album",
  title: "Test Album",
  description: "A test album description.",
  coverImage: "test-album.webp",
  publishedAt: "2026-01-15T00:00:00Z",
  moods: [],
  tags: [],
  energy: "medium",
  artist: "MelodyMind",
  isAvailable: true,
  songs: [],
  ...overrides,
});

const canonical = "https://melody-mind.de/test-album/";

describe("buildMusicAlbumSchema", () => {
  it("builds a MusicAlbum node with sorted tracks and stable IDs", () => {
    const schema = buildMusicAlbumSchema({
      album: makeAlbum({ genre: "Gothic", language: "German" }),
      canonical,
      coverImageUrl: "https://melody-mind.de/covers/test-album.webp",
      songs: [makeSong(2), makeSong(1), makeSong(3)],
      totalDurationSeconds: 3720,
    }) as Record<string, unknown>;

    expect(schema["@type"]).toBe("MusicAlbum");
    expect(schema["@id"]).toBe(`${canonical}#music-album`);
    expect(schema.genre).toBe("Gothic");
    expect(schema.inLanguage).toBe("de");
    expect(schema.datePublished).toBe("2026-01-15T00:00:00.000Z");
    expect(schema.duration).toBe("PT1H2M");
    expect(schema.numTracks).toBe(3);

    const tracks = schema.track as Array<Record<string, unknown>>;
    expect(tracks.map((track) => track.position)).toEqual([1, 2, 3]);
    expect(tracks[0]?.["@id"]).toBe(`${canonical}#track-1`);
    expect(tracks[0]?.contentUrl).toBe("https://cdn.example/track-1.mp3");
  });

  it("maps the editorial language and keeps unknown languages out", () => {
    const instrumental = buildMusicAlbumSchema({
      album: makeAlbum({ language: "Instrumental" }),
      canonical,
      coverImageUrl: "https://melody-mind.de/covers/test.webp",
      songs: [makeSong(1)],
      totalDurationSeconds: 60,
    }) as Record<string, unknown>;
    const unknown = buildMusicAlbumSchema({
      album: makeAlbum({ language: "Klingon" }),
      canonical,
      coverImageUrl: "https://melody-mind.de/covers/test.webp",
      songs: [makeSong(1)],
      totalDurationSeconds: 60,
    }) as Record<string, unknown>;

    expect(instrumental.inLanguage).toBe("zxx");
    expect(unknown.inLanguage).toBeUndefined();
  });

  it("omits the duration when there is nothing to measure", () => {
    const schema = buildMusicAlbumSchema({
      album: makeAlbum(),
      canonical,
      coverImageUrl: "https://melody-mind.de/covers/test.webp",
      songs: [makeSong(1)],
      totalDurationSeconds: 0,
    }) as Record<string, unknown>;

    expect(schema.duration).toBeUndefined();
  });

  it("links collection pages and per-track durations", () => {
    const schema = buildMusicAlbumSchema({
      album: makeAlbum(),
      canonical,
      coverImageUrl: "https://melody-mind.de/covers/test.webp",
      songs: [makeSong(1, { durationSeconds: 181 })],
      totalDurationSeconds: 181,
      collectionPages: [{ url: "https://melody-mind.de/genre/gothic/", name: "Gothic" }],
    }) as Record<string, unknown>;

    expect(schema.isPartOf).toEqual([
      {
        "@type": "CollectionPage",
        url: "https://melody-mind.de/genre/gothic/",
        name: "Gothic",
      },
    ]);
    expect(schema.duration).toBe("PT3M1S");
    const tracks = schema.track as Array<Record<string, unknown>>;
    expect(tracks[0]?.duration).toBe("PT3M1S");
  });
});

describe("buildMusicAlbumListSchema", () => {
  it("builds a descending ItemList with resolved album URLs", () => {
    const albums = [
      makeAlbum({
        id: "alpha",
        title: "Alpha",
        coverImage: "alpha.webp",
        publishedAt: "2026-02-01T00:00:00Z",
      }),
      makeAlbum({
        id: "beta",
        title: "Beta",
        coverImage: "beta.webp",
        publishedAt: "2026-01-01T00:00:00Z",
      }),
    ];

    const schema = buildMusicAlbumListSchema({
      albums,
      canonical: "https://melody-mind.de/",
      description: "All albums.",
      site: "https://melody-mind.de",
      getCoverImageUrl: (coverImage) => `https://melody-mind.de/covers/${coverImage}`,
    }) as Record<string, unknown>;

    expect(schema["@type"]).toBe("ItemList");
    expect(schema.numberOfItems).toBe(2);
    expect(schema.itemListOrder).toBe("https://schema.org/ItemListOrderDescending");

    const items = schema.itemListElement as Array<Record<string, unknown>>;
    expect(items.map((item) => item.position)).toEqual([1, 2]);
    expect(items[0]?.url).toBe("https://melody-mind.de/alpha/");

    const firstItem = items[0]?.item as Record<string, unknown>;
    expect(firstItem.name).toBe("Alpha");
    expect(firstItem.image).toBe("https://melody-mind.de/covers/alpha.webp");
    expect(firstItem.datePublished).toBe("2026-02-01T00:00:00.000Z");
  });
});
