import { describe, expect, it } from "vitest";

import {
  formatArchivePageUrl,
  getArchivePageHref,
  getArchivePageSlice,
  getSearchPageSlice,
  normalizeSearchValue,
} from "./index";

describe("archive pagination", () => {
  it.each([
    [0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [30, 1, 1, 30, 1],
    [31, 1, 1, 30, 2],
    [31, 2, 31, 31, 2],
    [61, 3, 61, 61, 3],
  ])("paginates %i entries on page %i", (count, page, start, end, lastPage) => {
    const result = getArchivePageSlice(Array.from({ length: count }), page);
    expect(result).toMatchObject({ start, end, lastPage });
    expect(result.data).toHaveLength(end === 0 ? 0 : end - start + 1);
  });

  it("clamps page zero and oversized pages to the archive bounds", () => {
    const items = Array.from({ length: 31 });
    expect(getArchivePageSlice(items, 0)).toMatchObject({ currentPage: 1 });
    expect(getArchivePageSlice(items, 99)).toMatchObject({
      currentPage: 2,
      nextUrl: undefined,
      prevUrl: "/",
    });
  });

  it("links adjacent pages through nextUrl and prevUrl", () => {
    const items = Array.from({ length: 31 });
    expect(getArchivePageSlice(items, 1)).toMatchObject({
      nextUrl: "/page/2/",
      prevUrl: undefined,
    });
    expect(getArchivePageSlice(items, 2)).toMatchObject({
      nextUrl: undefined,
      prevUrl: "/",
    });
  });

  it("uses the homepage for page one URLs", () => {
    expect(getArchivePageHref(1)).toBe("/");
    expect(getArchivePageHref(2)).toBe("/page/2/");
    expect(formatArchivePageUrl("/page/1")).toBe("/");
    expect(formatArchivePageUrl("/page/2")).toBe("/page/2/");
  });
});

describe("search pagination", () => {
  it("falls back to page one for non-finite requested pages", () => {
    const items = Array.from({ length: 61 }, (_, index) => index);
    expect(getSearchPageSlice(items, Number.NaN)).toMatchObject({
      currentPage: 1,
      start: 1,
      end: 30,
      lastPage: 3,
    });
    expect(getSearchPageSlice(items, Number.POSITIVE_INFINITY)).toMatchObject({
      currentPage: 3,
    });
  });

  it("keeps the search result shape without navigation urls", () => {
    const items = Array.from({ length: 31 }, (_, index) => index);
    const page = getSearchPageSlice(items, 2);
    expect(page).toEqual({
      currentPage: 2,
      data: [30],
      end: 31,
      lastPage: 2,
      start: 31,
      total: 31,
    });
    expect(page).not.toHaveProperty("nextUrl");
    expect(page).not.toHaveProperty("prevUrl");
  });

  it("returns an empty slice for empty input", () => {
    expect(getSearchPageSlice([], 1)).toEqual({
      currentPage: 1,
      data: [],
      end: 0,
      lastPage: 1,
      start: 0,
      total: 0,
    });
  });
});

describe("search normalization", () => {
  it("removes diacritics, lowercases English, and trims", () => {
    expect(normalizeSearchValue("Motörhead")).toBe("motorhead");
    expect(normalizeSearchValue("  Björk's Electronic Rooms ")).toBe(
      "bjork's electronic rooms"
    );
  });
});
