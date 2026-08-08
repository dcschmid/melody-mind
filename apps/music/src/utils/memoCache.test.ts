import { describe, expect, it } from "vitest";
import { createMemoCache } from "./memoCache";

describe("createMemoCache", () => {
  it("stores and returns values by key", () => {
    const cache = createMemoCache<string, number>();

    expect(cache.has("a")).toBe(false);
    expect(cache.get("a")).toBeUndefined();

    cache.set("a", 1);

    expect(cache.has("a")).toBe(true);
    expect(cache.get("a")).toBe(1);
  });

  it("overwrites existing entries and clears everything", () => {
    const cache = createMemoCache<string, number>();
    cache.set("a", 1);
    cache.set("a", 2);

    expect(cache.get("a")).toBe(2);

    cache.clear();

    expect(cache.has("a")).toBe(false);
  });
});
