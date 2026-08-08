import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as yaml from "js-yaml";
import { beforeAll, describe, expect, it } from "vitest";
import { normalizeImageKey, stripImageExtension } from "../imageAssets";

interface AlbumSong {
  title?: string;
  audioUrl?: string;
  lyricsUrl?: string;
  isInstrumental?: boolean;
  transcriptUnavailableReason?: string;
  trackNumber?: number;
}

interface AlbumFrontmatter {
  title?: string;
  coverImage?: string;
  publishedAt?: string | Date;
  songs?: AlbumSong[];
  zipUrl?: string;
}

interface LoadedAlbum {
  id: string;
  data: AlbumFrontmatter;
}

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const albumsDirectory = path.resolve(currentDirectory, "../../content/albums");
const coversDirectory = path.resolve(currentDirectory, "../../assets/album-covers");

let albums: LoadedAlbum[] = [];

const parseFrontmatter = (source: string): AlbumFrontmatter | null => {
  const match = source.match(/^---\n([\s\S]*?)\n---/u);
  return match?.[1] ? (yaml.load(match[1]) as AlbumFrontmatter) : null;
};

const albumUrls = (album: LoadedAlbum): string[] => {
  const trackUrls = (album.data.songs || []).flatMap((song) =>
    [song.audioUrl, song.lyricsUrl].filter((url): url is string => Boolean(url))
  );
  return album.data.zipUrl ? [...trackUrls, album.data.zipUrl] : trackUrls;
};

beforeAll(async () => {
  const fileNames = (await readdir(albumsDirectory)).filter((name) =>
    name.endsWith(".mdx")
  );
  albums = await Promise.all(
    fileNames.map(async (fileName) => ({
      id: fileName.replace(/\.mdx$/u, ""),
      data:
        parseFrontmatter(await readFile(path.join(albumsDirectory, fileName), "utf8")) ??
        {},
    }))
  );
});

describe("album content integrity", () => {
  it("parses frontmatter for every album file", () => {
    expect(albums.length).toBeGreaterThan(0);

    const issues = albums
      .filter((album) => !album.data.title || !Array.isArray(album.data.songs))
      .map((album) => `${album.id}: missing title or songs`);

    expect(issues, issues.join("\n")).toEqual([]);
  });

  it("references a cover asset that exists", async () => {
    /* Cover lookups strip raster extensions (see imageAssets), so compare keys. */
    const coverKeys = new Set(
      (await readdir(coversDirectory)).map((fileName) => stripImageExtension(fileName))
    );
    const issues = albums.flatMap((album) => {
      const coverImage = album.data.coverImage;
      if (!coverImage) {
        return [`${album.id}: coverImage is missing`];
      }
      return coverKeys.has(normalizeImageKey(coverImage))
        ? []
        : [`${album.id}: cover asset ${coverImage} does not exist`];
    });

    expect(issues, issues.join("\n")).toEqual([]);
  });

  it("uses valid absolute https asset URLs", () => {
    const issues = albums.flatMap((album) =>
      albumUrls(album).flatMap((url) => {
        try {
          const parsed = new URL(url);
          return parsed.protocol === "https:"
            ? []
            : [`${album.id}: ${url} is not an https URL`];
        } catch {
          return [`${album.id}: ${url} is not a valid URL`];
        }
      })
    );

    expect(issues, issues.join("\n")).toEqual([]);
  });

  it("keeps every album's assets in a single folder", () => {
    const issues = albums.flatMap((album) => {
      const folders = new Set(
        albumUrls(album).map((url) => url.slice(0, url.lastIndexOf("/") + 1))
      );
      return folders.size > 1
        ? [`${album.id}: assets are spread across ${folders.size} folders`]
        : [];
    });

    expect(issues, issues.join("\n")).toEqual([]);
  });

  it("gives every track a lyrics or transcript fallback", () => {
    const issues = albums.flatMap((album) =>
      (album.data.songs || []).flatMap((song, index) =>
        song.lyricsUrl || song.isInstrumental || song.transcriptUnavailableReason
          ? []
          : [
              `${album.id}: track ${song.trackNumber ?? index + 1} has no accessible fallback`,
            ]
      )
    );

    expect(issues, issues.join("\n")).toEqual([]);
  });

  it("does not reuse audio URLs within an album", () => {
    const issues = albums.flatMap((album) => {
      const audioUrls = (album.data.songs || [])
        .map((song) => song.audioUrl)
        .filter((url): url is string => Boolean(url));
      return new Set(audioUrls).size === audioUrls.length
        ? []
        : [`${album.id}: duplicates in audioUrl values`];
    });

    expect(issues, issues.join("\n")).toEqual([]);
  });

  it("has a parseable publish date", () => {
    const issues = albums.flatMap((album) => {
      const publishedAt = album.data.publishedAt;
      const value = publishedAt instanceof Date ? publishedAt.toISOString() : publishedAt;
      return value && !Number.isNaN(Date.parse(value))
        ? []
        : [`${album.id}: publishedAt is missing or unparseable`];
    });

    expect(issues, issues.join("\n")).toEqual([]);
  });
});
