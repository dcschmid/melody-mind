import { describe, expect, it } from "vitest";
import {
  ABCJS_SOUNDFONT_ORIGIN,
  ABCJS_SOUNDFONT_URL,
  CONTENT_SECURITY_POLICY,
} from "../src/utils/audio";
import {
  EXPECTED_ARTICLE_IDS,
  articleProse,
  countWords,
  validateEntry,
  validateSource,
} from "../scripts/validate-content.mjs";

const sourceIds = Array.from({ length: 15 }, (_, index) => `book-${index + 1}`);
const data = {
  readingMinutes: 23,
  sources: sourceIds.map((id) => ({ id })),
  related: [{ id: "second-article" }],
};

describe("Knowledge long-form validation", () => {
  it("tracks the complete ten-article editorial corpus", () => {
    expect(EXPECTED_ARTICLE_IDS).toHaveLength(10);
    expect(EXPECTED_ARTICLE_IDS).toEqual(
      expect.arrayContaining([
        "how-piano-touch-pedals-and-resonance-shape-sound",
        "how-to-hear-color-and-depth-in-a-classical-orchestra",
      ])
    );
  });

  it("allows the configured ABCJS soundfont through the content security policy", () => {
    expect(new URL(ABCJS_SOUNDFONT_URL).origin).toBe(ABCJS_SOUNDFONT_ORIGIN);
    expect(ABCJS_SOUNDFONT_URL.endsWith("/")).toBe(true);
    expect(CONTENT_SECURITY_POLICY).toContain(
      "connect-src 'self' " + ABCJS_SOUNDFONT_ORIGIN
    );
  });

  it("excludes imports, components, code, images, links, and endnotes metadata", () => {
    const body = `import Note from "./Note.astro";\n\nA [clear example](https://example.com) here.\n\n![alt](image.jpg)\n\n<KeyTerm term="reverb">Useful prose.</KeyTerm>\n\n<Endnotes />\nmetadata ignored`;
    expect(articleProse(body)).not.toContain("metadata ignored");
    expect(countWords(body)).toBe(6);
  });

  it("rejects short copy, unused sources, missing endnotes, and broken relations", () => {
    expect(
      validateEntry(
        { id: "first-article", data, body: "Brief copy." },
        new Set(["first-article"])
      )
    ).toEqual(
      expect.arrayContaining([
        "first-article: 2 editorial words; expected 5000-7500",
        "first-article: readingMinutes 23; expected 1",
        "first-article: unused source book-1",
        "first-article: missing Endnotes component",
        "first-article: invalid relation second-article",
      ])
    );
  });

  it("accepts a source only when its endnote marker is present", () => {
    const body = `${"word ".repeat(5000)} ${sourceIds.map((id) => `[#${id}]`).join(" ")}\n\n<Endnotes />`;
    expect(
      validateEntry(
        { id: "first-article", data, body },
        new Set(["first-article", "second-article"])
      )
    ).toEqual([]);
  });

  it.each([
    [4999, false],
    [5000, true],
    [7500, true],
    [7501, false],
  ])("applies the editorial word boundary at %i words", (words, accepted) => {
    const body = `${"word ".repeat(words)} ${sourceIds.map((id) => `[#${id}]`).join(" ")}\n\n<Endnotes />`;
    const entryData = { ...data, readingMinutes: Math.ceil(words / 225) };
    const failures = validateEntry(
      { id: "first-article", data: entryData, body },
      new Set(["first-article", "second-article"])
    );
    expect(failures.some((failure) => failure.includes("editorial words"))).toBe(
      !accepted
    );
  });

  it("requires fifteen sources", () => {
    const fourteen = sourceIds.slice(0, 14);
    const body = `${"word ".repeat(5000)} ${fourteen.map((id) => `[#${id}]`).join(" ")}\n\n<Endnotes />`;
    expect(
      validateEntry(
        {
          id: "first-article",
          data: { ...data, sources: fourteen.map((id) => ({ id })) },
          body,
        },
        new Set(["first-article", "second-article"])
      )
    ).toContain("first-article: 14 sources; expected at least 15");
  });

  it("rejects an unknown endnote and an incorrect reading time", () => {
    const body = `${"word ".repeat(5000)} ${sourceIds.map((id) => `[#${id}]`).join(" ")} [#unknown-source]\n\n<Endnotes />`;
    expect(
      validateEntry(
        { id: "first-article", data: { ...data, readingMinutes: 22 }, body },
        new Set(["first-article", "second-article"])
      )
    ).toEqual(
      expect.arrayContaining([
        "first-article: readingMinutes 22; expected 23",
        "first-article: unknown source unknown-source",
      ])
    );
  });

  it("requires URL and access date only for online sources", () => {
    expect(validateSource({ id: "veal-dub", type: "book" })).toBeUndefined();
    expect(validateSource({ id: "online-source", type: "website" })).toBe(
      "online-source: online sources require URL and access date"
    );
  });
});
