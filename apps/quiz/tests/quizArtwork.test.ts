import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { getQuizArtwork, QUIZ_ORDER, sortQuizIds } from "../src/utils/quizArtwork";

const quizzesDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/content/quizzes"
);

describe("quiz artwork", () => {
  it("covers every quiz in the content collection exactly once", () => {
    const slugs = readdirSync(quizzesDirectory)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/u, ""));

    expect(slugs.length).toBeGreaterThan(0);
    expect([...QUIZ_ORDER].sort()).toEqual([...slugs].sort());

    for (const slug of QUIZ_ORDER) {
      expect(getQuizArtwork(slug)).toBeTruthy();
    }
  });

  it("throws for unknown quiz ids", () => {
    expect(() => getQuizArtwork("missing")).toThrow("Missing quiz artwork for missing.");
  });

  it("sorts quiz ids in catalog order", () => {
    const shuffled = ["the-beatles-revolver", "1950s", "from-pop-to-streaming-pop"];

    expect(shuffled.sort(sortQuizIds)).toEqual([
      "1950s",
      "from-pop-to-streaming-pop",
      "the-beatles-revolver",
    ]);
  });
});
