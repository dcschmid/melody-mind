import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as yaml from "js-yaml";
import { beforeAll, describe, expect, it } from "vitest";

interface ArtistFrontmatter {
  name?: string;
  voiceId?: string;
  lead?: string;
  primaryGenre?: string;
  subgenres?: string[];
  portrait?: string;
  shortBio?: string;
}

interface LoadedArtist {
  slug: string;
  data: ArtistFrontmatter;
  body: string;
}

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const artistsDirectory = path.resolve(currentDirectory, "../../content/artists");
const singersDirectory = path.resolve(currentDirectory, "../../assets/singers");

let artists: LoadedArtist[] = [];
let portraitBasenames: string[] = [];

const parseProfile = (fileName: string, source: string): LoadedArtist => {
  const slug = fileName.replace(/\.mdx$/u, "");
  const match = source.match(/^---\n([\s\S]*?)\n---/u);
  const data = match?.[1] ? (yaml.load(match[1]) as ArtistFrontmatter) : null;
  if (!data) {
    throw new Error(`Artist profile ${fileName} has no parseable frontmatter.`);
  }
  const body = source.slice(match![0].length).trim();
  return { slug, data, body };
};

beforeAll(async () => {
  const fileNames = (await readdir(artistsDirectory)).filter((name) =>
    name.endsWith(".mdx")
  );
  artists = await Promise.all(
    fileNames.map(async (fileName) =>
      parseProfile(
        fileName,
        await readFile(path.join(artistsDirectory, fileName), "utf8")
      )
    )
  );
  const imageFiles = await readdir(singersDirectory);
  portraitBasenames = imageFiles
    .filter((name) => /\.(jpg|jpeg|png|webp|avif)$/iu.test(name))
    .map((name) => name.replace(/\.(jpg|jpeg|png|webp|avif)$/iu, ""));
});

describe("artist content integrity", () => {
  it("parses every profile with required metadata and editorial body", () => {
    expect(artists.length).toBeGreaterThan(0);

    for (const artist of artists) {
      const { data, body, slug } = artist;
      expect(data.name, slug).toBeTruthy();
      expect(data.voiceId, slug).toMatch(/^MM-[A-Z-]+-MASTER-[MF]$/u);
      expect(["Male lead", "Female lead"], slug).toContain(data.lead);
      expect(data.primaryGenre?.trim(), slug).toBeTruthy();
      expect(data.subgenres?.length ?? 0, slug).toBeGreaterThan(0);
      expect(data.portrait, slug).toBeTruthy();
      expect((data.shortBio ?? "").trim().length, slug).toBeGreaterThanOrEqual(80);
      expect(body, slug).toBeTruthy();
    }
  });

  it("keeps voice IDs and profile slugs unique", () => {
    const voiceIds = artists.map((artist) => artist.data.voiceId);
    const slugs = artists.map((artist) => artist.slug);

    expect(new Set(voiceIds).size).toBe(voiceIds.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("points every profile at a same-slug portrait asset", () => {
    for (const artist of artists) {
      expect(artist.data.portrait, artist.slug).toBe(artist.slug);
      expect(portraitBasenames, artist.slug).toContain(artist.slug);
    }
  });

  it("covers every portrait with exactly one profile and no orphans", () => {
    const profileSlugs = [...artists.map((artist) => artist.slug)].sort();
    const portraits = [...portraitBasenames].sort();

    expect(profileSlugs).toEqual(portraits);
  });
});
