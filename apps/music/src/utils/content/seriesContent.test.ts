import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as yaml from "js-yaml";
import { beforeAll, describe, expect, it } from "vitest";

interface SeriesFrontmatter {
  title?: string;
  albumIds?: string[];
}

interface LoadedSeries {
  id: string;
  data: SeriesFrontmatter;
}

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const seriesDirectory = path.resolve(currentDirectory, "../../content/series");
const albumsDirectory = path.resolve(currentDirectory, "../../content/albums");

let seriesEntries: LoadedSeries[] = [];
let albumIds: Set<string> = new Set();

const parseFrontmatter = (source: string): SeriesFrontmatter | null => {
  const match = source.match(/^---\n([\s\S]*?)\n---/u);
  return match?.[1] ? (yaml.load(match[1]) as SeriesFrontmatter) : null;
};

beforeAll(async () => {
  const seriesFiles = (await readdir(seriesDirectory)).filter((name) =>
    name.endsWith(".mdx")
  );
  seriesEntries = await Promise.all(
    seriesFiles.map(async (fileName) => ({
      id: fileName.replace(/\.mdx$/u, ""),
      data:
        parseFrontmatter(await readFile(path.join(seriesDirectory, fileName), "utf8")) ??
        {},
    }))
  );
  albumIds = new Set(
    (await readdir(albumsDirectory))
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => name.replace(/\.mdx$/u, ""))
  );
});

describe("series content integrity", () => {
  it("references albums that exist", () => {
    expect(seriesEntries.length).toBeGreaterThan(0);

    const issues = seriesEntries.flatMap((series) =>
      (series.data.albumIds ?? []).flatMap((albumId) =>
        albumIds.has(albumId)
          ? []
          : [`${series.id}: album "${albumId}" does not exist in the catalog`]
      )
    );

    expect(issues, issues.join("\n")).toEqual([]);
  });

  it("lists at least one album per series", () => {
    const issues = seriesEntries
      .filter((series) => (series.data.albumIds ?? []).length === 0)
      .map((series) => `${series.id}: albumIds is empty`);

    expect(issues, issues.join("\n")).toEqual([]);
  });
});
