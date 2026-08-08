import { describe, expect, it, vi } from "vitest";

interface StoryEntry {
  id: string;
  data: Record<string, unknown>;
}

const state = vi.hoisted(() => ({
  stories: [] as StoryEntry[],
  feedConfig: undefined as Record<string, unknown> | undefined,
}));

vi.mock("astro:content", () => ({
  getCollection: (
    _name: string,
    filter?: (entry: { data: { draft?: boolean } }) => boolean
  ) => {
    const result = filter
      ? state.stories.filter((entry) => filter(entry))
      : state.stories;
    return Promise.resolve(result);
  },
}));

vi.mock("@astrojs/rss", () => ({
  default: (config: Record<string, unknown>) => {
    state.feedConfig = config;
    return new Response("<rss />");
  },
}));

const makeStoryEntry = (
  id: string,
  publishedAt: string,
  overrides: Record<string, unknown> = {}
): StoryEntry => ({
  id,
  data: {
    title: `Story ${id}`,
    dek: `Dek for ${id}.`,
    publishedAt: new Date(publishedAt),
    topics: ["scenes"],
    byline: "Editorial Team",
    draft: false,
    ...overrides,
  },
});

describe("stories rss feed", () => {
  it("sorts published stories newest first and maps editorial fields", async () => {
    state.stories = [
      makeStoryEntry("older", "2026-01-01T00:00:00Z"),
      makeStoryEntry("newer", "2026-02-01T00:00:00Z"),
      makeStoryEntry("draft", "2026-03-01T00:00:00Z", { draft: true }),
    ];

    vi.resetModules();
    const { GET } = await import("../src/pages/rss.xml");
    await GET({});
    const config = state.feedConfig as Record<string, unknown>;
    const items = config.items as Array<Record<string, unknown>>;

    expect(config.title).toBe("MelodyMind Stories");
    expect(config.site).toBe("https://stories.melody-mind.de");
    expect(items.map((item) => item.link)).toEqual(["/newer/", "/older/"]);
    expect(items[0]).toMatchObject({
      title: "Story newer",
      description: "Dek for newer.",
      pubDate: new Date("2026-02-01T00:00:00Z"),
      categories: ["scenes"],
      author: "Editorial Team",
    });
  });
});
