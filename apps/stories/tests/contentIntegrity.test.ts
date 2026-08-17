import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
});
