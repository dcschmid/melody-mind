import { describe, expect, it } from "vitest";
import { normalizeWhitespace } from "./format";

describe("normalizeWhitespace", () => {
  it("collapses repeated whitespace into single spaces", () => {
    expect(normalizeWhitespace("a  b\t\nc")).toBe("a b c");
  });

  it("trims leading and trailing whitespace", () => {
    expect(normalizeWhitespace("  padded  ")).toBe("padded");
  });

  it("returns an empty string for blank input", () => {
    expect(normalizeWhitespace("   ")).toBe("");
  });
});
