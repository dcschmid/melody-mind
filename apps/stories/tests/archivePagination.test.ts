import { describe, expect, it } from "vitest";

import {
  formatArchivePageUrl,
  getArchivePageHref,
  getArchivePageSlice,
} from "../src/utils/archivePagination";

describe("Stories archive pagination", () => {
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

  it("uses the homepage for page one URLs", () => {
    expect(getArchivePageHref(1)).toBe("/");
    expect(getArchivePageHref(2)).toBe("/page/2/");
    expect(formatArchivePageUrl("/page/1")).toBe("/");
    expect(formatArchivePageUrl("/page/2")).toBe("/page/2/");
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

  it("clamps out-of-range pages to the archive bounds", () => {
    const items = Array.from({ length: 31 });
    expect(getArchivePageSlice(items, 0)).toMatchObject({ currentPage: 1 });
    expect(getArchivePageSlice(items, 99)).toMatchObject({
      currentPage: 2,
      nextUrl: undefined,
      prevUrl: "/",
    });
  });
});
