import { beforeEach, describe, expect, it, vi } from "vitest";

interface ReviewEntry {
  id: string;
  data: Record<string, unknown>;
}

const state = vi.hoisted(() => ({
  reviews: [] as ReviewEntry[],
  author: undefined as { data: Record<string, unknown> } | undefined,
  feedConfig: undefined as Record<string, unknown> | undefined,
}));

vi.mock("astro:content", () => ({
  getCollection: (
    _name: string,
    filter?: (entry: { data: { draft?: boolean } }) => boolean
  ) => {
    const result = filter
      ? state.reviews.filter((entry) => filter(entry))
      : state.reviews;
    return Promise.resolve(result);
  },
  getEntry: () => Promise.resolve(state.author),
}));

vi.mock("@astrojs/rss", () => ({
  default: (config: Record<string, unknown>) => {
    state.feedConfig = config;
    return new Response("<rss />");
  },
}));

const makeReviewEntry = (
  id: string,
  publishedAt: string,
  overrides: Record<string, unknown> = {}
): ReviewEntry => ({
  id,
  data: {
    title: `Review ${id}`,
    dek: `Dek for ${id}.`,
    publishedAt: new Date(publishedAt),
    draft: false,
    album: { genres: ["metal"] },
    ...overrides,
  },
});

const readFeedConfig = () => state.feedConfig;

const loadFeed = async () => {
  vi.resetModules();
  const { GET } = await import("../src/pages/rss.xml");
  state.feedConfig = undefined;
  await GET({});

  const config = readFeedConfig();
  if (!config) {
    throw new Error("RSS feed configuration was not captured");
  }
  return config;
};

describe("reviews rss feed", () => {
  beforeEach(() => {
    state.reviews = [
      makeReviewEntry("older", "2026-01-01T00:00:00Z"),
      makeReviewEntry("newer", "2026-02-01T00:00:00Z"),
      makeReviewEntry("draft", "2026-03-01T00:00:00Z", { draft: true }),
    ];
  });

  it("sorts published reviews newest first and uses the author entry", async () => {
    state.author = { data: { name: "Daniel Schmid" } };

    const config = await loadFeed();
    const items = config.items as Array<Record<string, unknown>>;

    expect(config.title).toBe("MelodyMind Reviews");
    expect(items.map((item) => item.link)).toEqual([
      "/reviews/newer/",
      "/reviews/older/",
    ]);
    expect(items[0]).toMatchObject({
      title: "Review newer",
      description: "Dek for newer.",
      categories: ["metal"],
      author: "Daniel Schmid",
    });
  });

  it("falls back to the default author when the entry is missing", async () => {
    state.author = undefined;

    const config = await loadFeed();
    const items = config.items as Array<Record<string, unknown>>;

    expect(items[0]?.author).toBe("Daniel Schmid");
  });
});
