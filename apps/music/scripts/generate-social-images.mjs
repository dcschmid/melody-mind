/**
 * Generates 1200x630 social images used for og:image / twitter:image and the
 * image sitemap. Card rendering lives in the shared module
 * scripts/social-images.mjs; this script only collects album items.
 *
 * - Per album: cover card from the album cover artwork.
 * - Albums without cover artwork get a typographic title card.
 * - Default: brand background with the MelodyMind logo.
 *
 * Output is a build artifact under public/og/ (gitignored) and is regenerated
 * by the dev/build scripts.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load as loadYaml } from "js-yaml";
import {
  FRONTMATTER_PATTERN,
  buildImageIndex,
  generateCoverCard,
  generateLogoCard,
  generateTitleCard,
  normalizeSlug,
  runSocialImageBuild,
} from "../../../scripts/social-images.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const albumsDirectory = join(appRoot, "src/content/albums");
const coversDirectory = join(appRoot, "src/assets/album-covers");
const logoPath = join(appRoot, "src/assets/melody-mind-logo.webp");
const outputDirectory = join(appRoot, "public/og");

const BRAND_LINE = "MelodyMind Music";

const collectAlbums = (coverIndex) => {
  const albums = [];

  for (const entry of readdirSync(albumsDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || extname(entry.name) !== ".mdx") {
      continue;
    }

    const source = readFileSync(join(albumsDirectory, entry.name), "utf8");
    const frontmatter = source.match(FRONTMATTER_PATTERN)?.[1];
    if (!frontmatter) {
      continue;
    }

    let data;
    try {
      data = loadYaml(frontmatter);
    } catch (error) {
      console.warn(`[social-images] Skipping ${entry.name}: invalid frontmatter`);
      console.warn(error instanceof Error ? error.message : error);
      continue;
    }

    if (!data || data.draft === true) {
      continue;
    }

    const coverStem = data.coverImage
      ? String(data.coverImage)
          .trim()
          .split("/")
          .pop()
          ?.replace(/\?.*$/u, "")
          .replace(/\.(jpg|jpeg|png|webp|avif)$/iu, "")
      : null;
    const imagePath = coverStem ? coverIndex.get(coverStem) : undefined;
    if (!imagePath) {
      console.warn(
        `[social-images] ${entry.name}: cover not found, generating title card`
      );
    }

    albums.push({
      slug: normalizeSlug(entry.name.slice(0, -extname(entry.name).length)),
      title: data.title || entry.name,
      imagePath,
    });
  }

  return albums;
};

const main = async () => {
  const albums = collectAlbums(buildImageIndex(coversDirectory));

  await runSocialImageBuild({
    outputDirectory,
    itemLabel: "album",
    items: albums,
    generateCard: (item, outputPath) =>
      generateCoverCard({ ...item, brandLine: BRAND_LINE }, outputPath),
    generateFallbackCard: (item, outputPath) =>
      generateTitleCard({ ...item, brandLine: BRAND_LINE }, outputPath),
    generateDefaultCard: (outputPath) => generateLogoCard(logoPath, outputPath),
  });
};

main().catch((error) => {
  console.error("[social-images] Failed to generate social images");
  console.error(error);
  process.exit(1);
});
