import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { load } from "js-yaml";
import { describe, expect, it } from "vitest";

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storiesDir = path.join(appDir, "src", "content", "stories");

const storyFiles = fs.readdirSync(storiesDir).filter((file) => file.endsWith(".md"));
const storyIds = new Set(storyFiles.map((file) => file.replace(/\.md$/, "")));
const STATIC_ROOT_ROUTES = new Set(["about", "page"]);

describe("story content integrity", () => {
  it("keeps at least the published catalog in place", () => {
    expect(storyFiles.length).toBeGreaterThanOrEqual(44);
  });

  it("resolves every internal body link", () => {
    const failures: string[] = [];
    for (const file of storyFiles) {
      const body = fs.readFileSync(path.join(storiesDir, file), "utf8");
      for (const match of body.matchAll(/\]\(\/([a-z0-9-]+)\/[^)]*\)/g)) {
        const target = match[1];
        if (!storyIds.has(target) && !STATIC_ROOT_ROUTES.has(target)) {
          failures.push(`${file}: unresolved internal link "/${target}/".`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it("resolves every relatedSlug to a different published story", () => {
    const failures: string[] = [];
    for (const file of storyFiles) {
      const raw = fs.readFileSync(path.join(storiesDir, file), "utf8");
      const match = raw.match(/^---\n([\s\S]*?)\n---/);
      if (!match) {
        failures.push(`${file}: missing frontmatter.`);
        continue;
      }
      const frontmatter = load(match[1]) as {
        relatedSlug?: unknown;
        draft?: unknown;
      };
      if (frontmatter.relatedSlug === undefined) {
        continue;
      }
      const sourceId = file.replace(/\.md$/, "");
      const targetId = String(frontmatter.relatedSlug);
      if (targetId === sourceId) {
        failures.push(`${file}: relatedSlug references itself.`);
        continue;
      }
      const targetFile = `${targetId}.md`;
      if (!storyIds.has(targetId)) {
        failures.push(`${file}: relatedSlug "${targetId}" does not exist.`);
        continue;
      }
      const targetRaw = fs.readFileSync(path.join(storiesDir, targetFile), "utf8");
      const targetMatch = targetRaw.match(/^---\n([\s\S]*?)\n---/);
      const targetFrontmatter = targetMatch
        ? (load(targetMatch[1]) as { draft?: unknown })
        : {};
      if (targetFrontmatter.draft === true) {
        failures.push(`${file}: relatedSlug "${targetId}" is a draft.`);
      }
    }
    expect(failures).toEqual([]);
  });
});
