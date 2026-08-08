/**
 * Generates 1200x630 social images used for og:image / twitter:image and the
 * image sitemap. Card rendering lives in the shared module
 * scripts/social-images.mjs; this script only collects review items.
 *
 * - Per review: cover card from the review cover artwork.
 * - Reviews without cover artwork get a typographic title card
 *   (typographic cover mode).
 * - Default: brand background with the site name.
 *
 * Output is a build artifact under public/og/ (gitignored) and is regenerated
 * by the dev/build scripts.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DRAFT_PATTERN,
  FRONTMATTER_PATTERN,
  buildImageIndex,
  generateBrandCard,
  generateCoverCard,
  generateTitleCard,
  normalizeSlug,
  readFrontmatterTitle,
  runSocialImageBuild,
} from "../../../scripts/social-images.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const reviewsDirectory = join(appRoot, "src/content/reviews");
const coversDirectory = join(appRoot, "src/assets/review-covers");
const outputDirectory = join(appRoot, "public/og");

const BRAND_LINE = "MelodyMind Reviews";

const collectReviews = (coverIndex) => {
  const reviews = [];

  for (const entry of readdirSync(reviewsDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || extname(entry.name) !== ".mdx") {
      continue;
    }

    const source = readFileSync(join(reviewsDirectory, entry.name), "utf8");
    const frontmatter = source.match(FRONTMATTER_PATTERN)?.[1];
    if (!frontmatter || DRAFT_PATTERN.test(frontmatter)) {
      continue;
    }

    const slug = normalizeSlug(entry.name.slice(0, -extname(entry.name).length));
    reviews.push({
      slug,
      title: readFrontmatterTitle(frontmatter) || entry.name,
      imagePath: coverIndex.get(slug),
    });
  }

  return reviews;
};

const main = async () => {
  const reviews = collectReviews(buildImageIndex(coversDirectory));

  await runSocialImageBuild({
    outputDirectory,
    itemLabel: "review",
    items: reviews,
    generateCard: (item, outputPath) =>
      generateCoverCard({ ...item, brandLine: BRAND_LINE }, outputPath),
    generateFallbackCard: (item, outputPath) =>
      generateTitleCard({ ...item, brandLine: BRAND_LINE }, outputPath),
    generateDefaultCard: (outputPath) =>
      generateBrandCard(
        { brandLine: BRAND_LINE, tagline: "Sourced album criticism without scores" },
        outputPath
      ),
  });
};

main().catch((error) => {
  console.error("[social-images] Failed to generate social images");
  console.error(error);
  process.exit(1);
});
