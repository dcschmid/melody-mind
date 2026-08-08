import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearSeriesMarathonProgress,
  readSeriesMarathonProgress,
  SERIES_MARATHON_STORAGE_KEY,
  writeSeriesMarathonProgress,
  type SeriesMarathonProgress,
} from "./series-marathon-storage";

const createLocalStorage = (overrides: Partial<Storage> = {}) => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
    ...overrides,
  };
};

const makeProgress = (
  seriesId: string,
  overrides: Partial<SeriesMarathonProgress> = {}
): SeriesMarathonProgress => ({
  seriesId,
  albumId: `${seriesId}-album-one`,
  trackNumber: 1,
  currentTime: 42,
  phase: "listening",
  updatedAt: 1768435200000,
  ...overrides,
});

const stubWindow = (localStorage: unknown) => {
  vi.stubGlobal("window", { localStorage });
};

beforeEach(() => {
  stubWindow(createLocalStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("series marathon storage", () => {
  it("writes and reads progress per series", () => {
    writeSeriesMarathonProgress(makeProgress("series-one"));
    writeSeriesMarathonProgress(makeProgress("series-two", { phase: "intermission" }));

    expect(readSeriesMarathonProgress("series-one")).toEqual(makeProgress("series-one"));
    expect(readSeriesMarathonProgress("series-two")).toEqual(
      makeProgress("series-two", { phase: "intermission" })
    );
  });

  it("returns null for unknown or empty storage", () => {
    expect(readSeriesMarathonProgress("missing")).toBeNull();
  });

  it("discards malformed payloads", () => {
    const scenarios = [
      "not json",
      JSON.stringify({ version: 2, progress: {} }),
      JSON.stringify({ version: 1 }),
      JSON.stringify({
        version: 1,
        progress: {
          "series-one": { seriesId: "series-one", phase: "listening" },
          "series-two": { ...makeProgress("series-two"), seriesId: "other-id" },
          "series-three": { ...makeProgress("series-three"), phase: "paused" },
        },
      }),
    ];

    for (const raw of scenarios) {
      window.localStorage.setItem(SERIES_MARATHON_STORAGE_KEY, raw);

      expect(readSeriesMarathonProgress("series-one")).toBeNull();
      expect(readSeriesMarathonProgress("series-two")).toBeNull();
      expect(readSeriesMarathonProgress("series-three")).toBeNull();
    }
  });

  it("clears only the requested series", () => {
    writeSeriesMarathonProgress(makeProgress("series-one"));
    writeSeriesMarathonProgress(makeProgress("series-two"));

    clearSeriesMarathonProgress("series-one");

    expect(readSeriesMarathonProgress("series-one")).toBeNull();
    expect(readSeriesMarathonProgress("series-two")).toEqual(makeProgress("series-two"));
  });

  it("keeps working when storage access is blocked", () => {
    const blockedStorage = createLocalStorage({
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    });
    stubWindow(blockedStorage);

    expect(readSeriesMarathonProgress("series-one")).toBeNull();
    expect(() => writeSeriesMarathonProgress(makeProgress("series-one"))).not.toThrow();
    expect(() => clearSeriesMarathonProgress("series-one")).not.toThrow();
  });
});
