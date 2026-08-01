import { describe, expect, it } from "vitest";

import {
  formatArchivePageUrl,
  getArchivePageHref,
  getArchivePageSlice,
} from "../src/utils/archivePagination";

describe("Knowledge archive pagination", () => {
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
});
