import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RadioCatalogPayload } from "../types/radio";

interface AlbumEntry {
  id: string;
  data: Record<string, unknown>;
  body: string;
}

interface SeriesEntry {
  id: string;
  data: Record<string, unknown>;
}

const state = vi.hoisted(() => ({
  albums: [] as AlbumEntry[],
  series: [] as SeriesEntry[],
}));

vi.mock("astro:content", () => ({
  getCollection: (
    name: string,
    filter?: (entry: { data: { isAvailable?: boolean } }) => boolean
  ) => {
    const entries = name === "albums" ? state.albums : state.series;
    const result = filter ? entries.filter((entry) => filter(entry)) : entries;
    return Promise.resolve(result);
  },
}));

vi.mock("./musicImages", () => ({
  getAlbumCoverImagePath: (coverImage: string) => `/covers/${coverImage}`,
}));

const iso = (day: number) => new Date(Date.UTC(2026, 0, day)).toISOString();

const makeSongs = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    title: `Track ${index + 1}`,
    audioUrl: `https://cdn.example/track-${index + 1}.mp3`,
    trackNumber: index + 1,
    durationSeconds: 120,
    isInstrumental: true,
  }));

const makeAlbumData = (id: string, overrides: Record<string, unknown> = {}) => ({
  title: `Album ${id}`,
  description: `Description for album ${id}.`,
  coverImage: `${id}.webp`,
  publishedAt: iso(1),
  moods: [],
  tags: [],
  energy: "medium",
  artist: "MelodyMind",
  isAvailable: true,
  songs: makeSongs(10),
  radioIntro: `Radio introduction copy for the album called ${id}.`,
  ...overrides,
});

const makeGroup = (
  prefix: string,
  startDay: number,
  overrides: Record<string, unknown> = {}
): AlbumEntry[] =>
  Array.from({ length: 4 }, (_, index) => {
    const id = `${prefix}-${index + 1}`;
    return {
      id,
      data: makeAlbumData(id, { publishedAt: iso(startDay + index), ...overrides }),
      body: "",
    };
  });

/*
 * Every station must clear the catalog minimums (4 albums, 40 tracks), so the
 * fixture groups are sized to satisfy each curated lane and mood family:
 * dark metal, French night pop, Swedish folk, viking metal, calm, defiant,
 * and the Code, Chaos & Coffee series. All tracks are instrumental so the
 * instrumental station covers the whole catalog.
 */
const buildFullCatalog = (): AlbumEntry[] => [
  ...makeGroup("dark", 1, {
    mainGenre: "Metal",
    genre: "Gothic Metal",
    energy: "high",
    moods: ["dark", "nocturnal"],
  }),
  ...makeGroup("french", 5, {
    mainGenre: "Pop",
    genre: "Chanson-Pop",
    language: "French",
    moods: ["melancholic", "nocturnal"],
  }),
  ...makeGroup("swedish", 9, { mainGenre: "Folk", language: "Swedish" }),
  ...makeGroup("viking", 13, {
    mainGenre: "Metal",
    genre: "Viking Metal",
    energy: "high",
    moods: ["epic"],
  }),
  ...makeGroup("calm", 17, {
    mainGenre: "Ambient",
    energy: "low",
    moods: ["atmospheric", "warm"],
  }),
  ...makeGroup("defiant", 21, {
    mainGenre: "Punk",
    energy: "high",
    moods: ["rebellious"],
  }),
  ...makeGroup("series", 25, { mainGenre: "Rock" }),
];

const buildSeriesEntries = (): SeriesEntry[] => [
  {
    id: "code-chaos-and-coffee",
    data: { albumIds: ["series-1", "series-2", "series-3", "series-4"] },
  },
  { id: "the-nine-worlds-of-the-allfather", data: { albumIds: ["viking-1"] } },
];

const loadCatalog = async (): Promise<RadioCatalogPayload> => {
  vi.resetModules();
  const { getRadioCatalog } = await import("./radioCatalog");
  return getRadioCatalog();
};

const getStation = (catalog: RadioCatalogPayload, id: string) => {
  const station = catalog.stations.find((entry) => entry.id === id);
  if (!station) {
    throw new Error(`Missing station ${id}`);
  }
  return station;
};

describe("getRadioCatalog", () => {
  beforeEach(() => {
    state.albums = buildFullCatalog();
    state.series = buildSeriesEntries();
  });

  it("builds curated and mood stations for the whole catalog", async () => {
    const catalog = await loadCatalog();

    expect(catalog.stations).toHaveLength(10);
    expect(
      catalog.stations.filter((station) => station.category === "curated")
    ).toHaveLength(5);
    expect(
      catalog.stations.filter((station) => station.category === "mood")
    ).toHaveLength(5);

    const midnight = getStation(catalog, "midnight-metal");
    expect(midnight.rotation).toEqual({ kind: "single-pool", laneId: "midnight" });
    expect(midnight.albumCount).toBe(4);
    expect(midnight.trackCount).toBe(40);
    expect(midnight.previewAlbum.id).toBe("dark-4");
    expect(midnight.previewAlbum.artworkUrl).toBe("/covers/dark-4.webp");
  });

  it("alternates lanes on multi-lane stations and keeps claimed albums out", async () => {
    const catalog = await loadCatalog();

    const north = getStation(catalog, "stories-from-the-north");
    expect(north.rotation).toEqual({
      kind: "alternating-pools",
      laneIds: ["northern-voices", "saga-metal"],
    });
    expect(north.lanes.map((lane) => lane.albums.map((album) => album.album.id))).toEqual(
      [
        ["swedish-4", "swedish-3", "swedish-2", "swedish-1"],
        ["viking-4", "viking-3", "viking-2", "viking-1"],
      ]
    );
  });

  it("assigns albums to their mood family stations", async () => {
    const catalog = await loadCatalog();

    const dark = getStation(catalog, "mood-dark");
    expect(dark.albumCount).toBe(8);

    const triumphant = getStation(catalog, "mood-triumphant");
    expect(triumphant.lanes[0]?.albums.map((album) => album.album.id)).toEqual([
      "viking-4",
      "viking-3",
      "viking-2",
      "viking-1",
    ]);
  });

  it("ignores unavailable albums", async () => {
    state.albums.push({
      id: "dark-5",
      data: makeAlbumData("dark-5", {
        publishedAt: iso(29),
        mainGenre: "Metal",
        energy: "high",
        moods: ["dark"],
        isAvailable: false,
      }),
      body: "",
    });

    const catalog = await loadCatalog();
    const midnight = getStation(catalog, "midnight-metal");

    expect(midnight.albumCount).toBe(4);
    expect(midnight.lanes[0]?.albums.some((album) => album.album.id === "dark-5")).toBe(
      false
    );
  });

  it("fails when no available albums exist", async () => {
    state.albums = [];

    await expect(loadCatalog()).rejects.toThrow(
      "Radio catalog cannot be built without available albums."
    );
  });

  it("fails when an album is missing energy metadata", async () => {
    const dataWithoutEnergy = { ...state.albums[0]?.data };
    delete dataWithoutEnergy.energy;
    state.albums[0] = { ...(state.albums[0] as AlbumEntry), data: dataWithoutEnergy };

    await expect(loadCatalog()).rejects.toThrow(
      "Radio catalog needs energy metadata for: dark-1."
    );
  });

  it("fails when a station has too few albums", async () => {
    state.albums = state.albums.filter((entry) => entry.id !== "dark-4");

    await expect(loadCatalog()).rejects.toThrow(
      "Radio station midnight-metal has 3 albums; at least 4 are required."
    );
  });

  it("fails when a station has too few tracks", async () => {
    state.albums = state.albums.map((entry) =>
      entry.id.startsWith("dark-")
        ? { ...entry, data: { ...entry.data, songs: makeSongs(9) } }
        : entry
    );

    await expect(loadCatalog()).rejects.toThrow(
      "Radio station midnight-metal has 36 tracks; at least 40 are required."
    );
  });

  it("fails when curated stations lack radio intros for their newest albums", async () => {
    state.albums = state.albums.map((entry) =>
      ["dark-2", "dark-3", "dark-4"].includes(entry.id)
        ? { ...entry, data: { ...entry.data, radioIntro: undefined } }
        : entry
    );

    await expect(loadCatalog()).rejects.toThrow(
      "Radio station midnight-metal needs radioIntro copy for: dark-4, dark-3, dark-2."
    );
  });
});
