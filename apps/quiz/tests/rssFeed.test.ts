import { describe, expect, it, vi } from "vitest";

interface QuizEntry {
  id: string;
  data: Record<string, unknown>;
}

const state = vi.hoisted(() => ({
  quizzes: [] as QuizEntry[],
  feedConfig: undefined as Record<string, unknown> | undefined,
}));

vi.mock("astro:content", () => ({
  getCollection: (
    _name: string,
    filter?: (entry: { data: { draft?: boolean } }) => boolean
  ) => {
    const result = filter
      ? state.quizzes.filter((entry) => filter(entry))
      : state.quizzes;
    return Promise.resolve(result);
  },
}));

vi.mock("@astrojs/rss", () => ({
  default: (config: Record<string, unknown>) => {
    state.feedConfig = config;
    return new Response("<rss />");
  },
}));

const makeQuizEntry = (
  id: string,
  checkedAtDates: string[],
  overrides: Record<string, unknown> = {}
): QuizEntry => ({
  id,
  data: {
    title: `Quiz ${id}`,
    description: `Description for ${id}.`,
    draft: false,
    featuredTopics: ["rock"],
    questions: [
      {
        sources: checkedAtDates.map((checkedAt) => ({ checkedAt: new Date(checkedAt) })),
      },
    ],
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

describe("quiz rss feed", () => {
  it("sorts quizzes by their newest source check and skips drafts", async () => {
    state.quizzes = [
      makeQuizEntry("stale", ["2026-01-01T00:00:00Z"]),
      makeQuizEntry("fresh", ["2026-01-15T00:00:00Z", "2026-02-01T00:00:00Z"]),
      makeQuizEntry("draft", ["2026-03-01T00:00:00Z"], { draft: true }),
    ];

    const config = await loadFeed();
    const items = config.items as Array<Record<string, unknown>>;

    expect(config.title).toBe("MelodyMind Quiz");
    expect(config.site).toBe("https://quiz.melody-mind.de");
    expect(items.map((item) => item.link)).toEqual(["/fresh/", "/stale/"]);
    expect(items[0]?.pubDate).toEqual(new Date("2026-02-01T00:00:00Z"));
    expect(items[0]?.categories).toEqual(["rock"]);
  });
});
