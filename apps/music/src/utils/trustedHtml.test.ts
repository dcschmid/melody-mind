import { describe, expect, it } from "vitest";
import { trustedHtmlList } from "./trustedHtml";

describe("trustedHtmlList", () => {
  it("passes reviewed markup through unchanged", () => {
    const values = trustedHtmlList(["<b>Bold</b>", "<i>Italic</i>"] as const);

    expect(values).toEqual(["<b>Bold</b>", "<i>Italic</i>"]);
  });

  it("handles an empty list", () => {
    expect(trustedHtmlList([])).toEqual([]);
  });
});
