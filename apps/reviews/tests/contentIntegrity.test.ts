import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { load as loadYaml } from "js-yaml";
import { describe, expect, it } from "vitest";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reviewsDir = path.join(appDir, "src", "content", "reviews");
const authorsDir = path.join(appDir, "src", "content", "authors");
const coversDir = path.join(appDir, "src", "assets", "review-covers");

interface ReviewFrontmatter {
  publishedAt: Date;
  updatedAt?: Date;
  author: string;
  cover: { mode: "original" | "typographic"; src?: string };
}

const parseFrontmatter = (fileName: string): ReviewFrontmatter => {
  const source = fs.readFileSync(path.join(reviewsDir, fileName), "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/u);
  if (!match) throw new Error(`${fileName}: missing frontmatter.`);
  return loadYaml(match[1]) as ReviewFrontmatter;
};

const reviewFiles = fs.readdirSync(reviewsDir).filter((file) => file.endsWith(".mdx"));
const authorIds = new Set(
  fs
    .readdirSync(authorsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""))
);
const coverStems = new Set(
  fs.readdirSync(coversDir).map((file) => file.replace(/\.[^.]+$/, ""))
);

describe("review content integrity", () => {
  it("keeps at least the published catalog in place", () => {
    expect(reviewFiles.length).toBeGreaterThanOrEqual(30);
  });

  it("resolves every author reference", () => {
    for (const file of reviewFiles) {
      const { author } = parseFrontmatter(file);
      expect(authorIds.has(author), `${file}: unknown author "${author}"`).toBe(true);
    }
  });

  it("resolves every original cover asset", () => {
    for (const file of reviewFiles) {
      const { cover } = parseFrontmatter(file);
      if (cover.mode !== "original") continue;
      const stem = cover.src
        ?.split("/")
        .pop()
        ?.replace(/\.[^.]+$/, "");
      expect(
        stem && coverStems.has(stem),
        `${file}: missing cover for "${cover.src}"`
      ).toBe(true);
    }
  });

  it("never dates an update before publication", () => {
    for (const file of reviewFiles) {
      const { publishedAt, updatedAt } = parseFrontmatter(file);
      if (!updatedAt) continue;
      expect(
        updatedAt.valueOf() >= publishedAt.valueOf(),
        `${file}: updatedAt precedes publishedAt`
      ).toBe(true);
    }
  });
});
