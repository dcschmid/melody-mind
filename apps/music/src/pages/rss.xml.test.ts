import { afterEach, describe, expect, it, vi } from "vitest";

interface AlbumEntry {
  id: string;
  data: Record<string, unknown>;
  body: string;
}

const state = vi.hoisted(() => ({
  albums: [] as AlbumEntry[],
  feedConfig: undefined as Record<string, unknown> | undefined,
}));

vi.mock("astro:content", () => ({
  getCollection: (
    _name: string,
    filter?: (entry: { data: { isAvailable?: boolean } }) => boolean
  ) => {
    const result = filter ? state.albums.filter((entry) => filter(entry)) : state.albums;
    return Promise.resolve(result);
  },
}));

vi.mock("@astrojs/rss", () => ({
  default: (config: Record<string, unknown>) => {
    state.feedConfig = config;
    return new Response("<rss />");
  },
}));

vi.mock("../utils/musicImages", () => ({
  getAlbumCoverImageUrl: (coverImage: string) =>
    `https://melody-mind.de/covers/${coverImage}`,
}));

const makeAlbumEntry = (
  id: string,
  publishedAt: string,
  overrides: Record<string, unknown> = {}
): AlbumEntry => ({
  id,
  data: {
    title: `Album ${id}`,
    description: `Description for ${id}.`,
    coverImage: `${id}.webp`,
    publishedAt: new Date(publishedAt),
    isAvailable: true,
    moods: [],
    tags: [],
    songs: [
      {
        title: "First Track",
        audioUrl: `https://cdn.example/${id}/01.mp3`,
        trackNumber: 1,
      },
    ],
    ...overrides,
  },
  body: "",
});

const headResponse = (contentLength?: string) =>
  new Response(null, {
    status: 200,
    headers: contentLength ? { "content-length": contentLength } : {},
  });

const readFeedConfig = () => state.feedConfig;

const loadFeed = async (site?: URL) => {
  vi.resetModules();
  const { GET } = await import("./rss.xml");
  state.feedConfig = undefined;
  const response = await GET({ site } as never);

  const config = readFeedConfig();
  if (!config) {
    throw new Error("RSS feed configuration was not captured");
  }
  return { response, config };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("music rss feed", () => {
  it("sorts available albums newest first and builds feed items", async () => {
    state.albums = [
      makeAlbumEntry("older", "2026-01-01T00:00:00Z", {
        mainGenre: "Metal",
        genre: "Gothic Metal",
        language: "English",
        moods: ["dark"],
        tags: ["concept"],
      }),
      makeAlbumEntry("newer", "2026-02-01T00:00:00Z"),
      makeAlbumEntry("hidden", "2026-03-01T00:00:00Z", { isAvailable: false }),
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => headResponse("123456"))
    );

    const { config } = await loadFeed();
    const items = config.items as Array<Record<string, unknown>>;

    expect(config.title).toBe("MelodyMind Music");
    expect(config.site).toBe("https://melody-mind.de");
    expect(config.customData).toBe("<language>en-us</language>");
    expect(config.xmlns).toEqual({ media: "http://search.yahoo.com/mrss/" });

    expect(items.map((item) => item.link)).toEqual(["/newer/", "/older/"]);
    expect(items[1]?.categories).toEqual([
      "Metal",
      "Gothic Metal",
      "English",
      "dark",
      "concept",
    ]);
    expect(items[0]?.customData).toBe(
      '<media:thumbnail url="https://melody-mind.de/covers/newer.webp" />'
    );
  });

  it("adds an enclosure from the probed content length", async () => {
    state.albums = [makeAlbumEntry("one", "2026-01-01T00:00:00Z")];
    const fetchMock = vi.fn(async () => headResponse("987654"));
    vi.stubGlobal("fetch", fetchMock);

    const { config } = await loadFeed();
    const items = config.items as Array<Record<string, unknown>>;

    expect(items[0]?.enclosure).toEqual({
      url: "https://cdn.example/one/01.mp3",
      length: 987654,
      type: "audio/mpeg",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries a failed probe once and keeps the enclosure on recovery", async () => {
    state.albums = [makeAlbumEntry("one", "2026-01-01T00:00:00Z")];
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(headResponse("4242"));
    vi.stubGlobal("fetch", fetchMock);

    const { config } = await loadFeed();
    const items = config.items as Array<Record<string, unknown>>;

    expect(items[0]?.enclosure).toEqual({
      url: "https://cdn.example/one/01.mp3",
      length: 4242,
      type: "audio/mpeg",
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("omits the enclosure when the probe fails with an error response", async () => {
    state.albums = [makeAlbumEntry("one", "2026-01-01T00:00:00Z")];
    const fetchMock = vi.fn(async () => new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    const { config } = await loadFeed();
    const items = config.items as Array<Record<string, unknown>>;

    expect(items[0]?.enclosure).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("uses the Astro site when provided", async () => {
    state.albums = [makeAlbumEntry("one", "2026-01-01T00:00:00Z")];
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => headResponse("1"))
    );

    const { config } = await loadFeed(new URL("https://music.example/"));

    expect(config.site).toEqual(new URL("https://music.example/"));
  });
});
