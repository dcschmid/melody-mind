import { describe, expect, it } from "vitest";
import { normalizeDate } from "./dateUtils";

describe("normalizeDate", () => {
  it("returns valid Date instances unchanged", () => {
    const date = new Date("2026-01-15T00:00:00Z");

    expect(normalizeDate(date)).toBe(date);
  });

  it("parses date strings and numeric timestamps", () => {
    expect(normalizeDate("2026-01-15T00:00:00Z")?.toISOString()).toBe(
      "2026-01-15T00:00:00.000Z"
    );
    expect(normalizeDate(1768435200000)?.toISOString()).toBe("2026-01-15T00:00:00.000Z");
  });

  it("returns null for invalid or empty input", () => {
    expect(normalizeDate("not a date")).toBeNull();
    expect(normalizeDate(new Date("not a date"))).toBeNull();
    expect(normalizeDate(null)).toBeNull();
    expect(normalizeDate(undefined)).toBeNull();
    expect(normalizeDate("")).toBeNull();
    expect(normalizeDate({})).toBeNull();
  });
});
