import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const quizzesDir = path.join(appDir, "src", "content", "quizzes");

/* Curated journey quizzes intentionally share crafted arc paragraphs between
   related questions; this guard targets generated filler, not that device. */
const TEMPLATE_PATTERNS = [
  /gives this part of the history a specific person, work, place, or tool\./,
  /belong together here; the comparison names each part of the change\./,
  /^The (?:true|false) answer fixes the chronology before later styles are compared with it\./,
  /Reading the credit or date beside the musical detail/,
  /It also separates a documented fact from a broad claim about the whole style\./,
];

const quizFiles = fs.readdirSync(quizzesDir).filter((file) => file.endsWith(".md"));

const extractContexts = (source: string): string[] =>
  [...source.matchAll(/ {4}context: >-\n((?: {6}.+\n)+)/g)].map((block) =>
    block[1]
      .split("\n")
      .filter(Boolean)
      .map((line) => line.trim())
      .join(" ")
  );

describe("quiz content quality", () => {
  it("keeps question contexts free of template filler", () => {
    const failures: string[] = [];
    for (const file of quizFiles) {
      const source = fs.readFileSync(path.join(quizzesDir, file), "utf8");
      for (const context of extractContexts(source)) {
        for (const pattern of TEMPLATE_PATTERNS) {
          if (pattern.test(context)) {
            failures.push(
              `${file}: template filler in context "${context.slice(0, 70)}…"`
            );
          }
        }
      }
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
});
