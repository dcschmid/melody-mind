/**
 * Generates 1200x630 social images used for og:image / twitter:image and the
 * image sitemap. Card rendering lives in the shared module
 * scripts/social-images.mjs; this script only collects story items.
 *
 * - Per story: full-bleed hero image with a dark gradient and the story title.
 * - Stories without a hero image are skipped.
 * - Default: brand background with the site name.
 *
 * Output is a build artifact under public/og/ (gitignored) and is regenerated
 * by the dev/build scripts.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DRAFT_PATTERN,
  FRONTMATTER_PATTERN,
  generateBrandCard,
  generateHeroCard,
  normalizeSlug,
  readFrontmatterTitle,
  runSocialImageBuild,
} from "../../../scripts/social-images.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const storiesDirectory = join(appRoot, "src/content/stories");
const outputDirectory = join(appRoot, "public/og");

const BRAND_LINE = "MelodyMind Stories";

const HERO_BLOCK_PATTERN = /^hero:[^\n]*\n((?:[ \t]+[^\n]*\n?)+)/m;
const HERO_IMAGE_PATTERN = /^[ \t]+image:\s*(.+)$/m;

const collectStories = () => {
  const stories = [];

  for (const entry of readdirSync(storiesDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || extname(entry.name) !== ".md") {
      continue;
    }

    const filePath = join(storiesDirectory, entry.name);
    const source = readFileSync(filePath, "utf8");
    const frontmatter = source.match(FRONTMATTER_PATTERN)?.[1];
    if (!frontmatter || DRAFT_PATTERN.test(frontmatter)) {
      continue;
    }

    const heroBlock = frontmatter.match(HERO_BLOCK_PATTERN)?.[1];
    const heroImageValue = heroBlock?.match(HERO_IMAGE_PATTERN)?.[1]?.trim();
    const imagePath = heroImageValue
      ? resolve(dirname(filePath), heroImageValue)
      : undefined;
    if (!imagePath || !existsSync(imagePath)) {
      console.warn(
        `[social-images] ${entry.name}: hero image not found, skipping story card`
      );
      continue;
    }

    stories.push({
      slug: normalizeSlug(entry.name.slice(0, -extname(entry.name).length)),
      title: readFrontmatterTitle(frontmatter) || entry.name,
      imagePath,
    });
  }

  return stories;
};

const main = async () => {
  const stories = collectStories();

  await runSocialImageBuild({
    outputDirectory,
    itemLabel: "story",
    items: stories,
    generateCard: (item, outputPath) =>
      generateHeroCard({ ...item, brandLine: BRAND_LINE }, outputPath),
    generateDefaultCard: (outputPath) =>
      generateBrandCard(
        { brandLine: BRAND_LINE, tagline: "Sourced long-form music journalism" },
        outputPath
      ),
  });
};

main().catch((error) => {
  console.error("[social-images] Failed to generate social images");
  console.error(error);
  process.exit(1);
});
