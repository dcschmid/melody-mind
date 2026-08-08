/**
 * Generates 1200x630 social images used for og:image / twitter:image and the
 * image sitemap. Card rendering lives in the shared module
 * scripts/social-images.mjs; this script only collects quiz items.
 *
 * - Per quiz: cover card from the quiz artwork.
 * - Quizzes without artwork get a typographic title card.
 * - Default: brand background with the MelodyMind logo.
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
  generateCoverCard,
  generateLogoCard,
  generateTitleCard,
  normalizeSlug,
  readFrontmatterTitle,
  runSocialImageBuild,
} from "../../../scripts/social-images.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const quizzesDirectory = join(appRoot, "src/content/quizzes");
const artworkDirectory = join(appRoot, "src/assets");
const logoPath = join(appRoot, "src/assets/melody-mind-logo.webp");
const outputDirectory = join(appRoot, "public/og");

const BRAND_LINE = "MelodyMind Quiz";

const collectQuizzes = (artworkIndex) => {
  const quizzes = [];

  for (const entry of readdirSync(quizzesDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || extname(entry.name) !== ".md") {
      continue;
    }

    const source = readFileSync(join(quizzesDirectory, entry.name), "utf8");
    const frontmatter = source.match(FRONTMATTER_PATTERN)?.[1];
    if (!frontmatter || DRAFT_PATTERN.test(frontmatter)) {
      continue;
    }

    const slug = normalizeSlug(entry.name.slice(0, -extname(entry.name).length));
    const imagePath = artworkIndex.get(slug);
    if (!imagePath) {
      console.warn(
        `[social-images] ${entry.name}: artwork not found, generating title card`
      );
    }

    quizzes.push({
      slug,
      title: readFrontmatterTitle(frontmatter) || entry.name,
      imagePath,
    });
  }

  return quizzes;
};

const main = async () => {
  const quizzes = collectQuizzes(buildImageIndex(artworkDirectory));

  await runSocialImageBuild({
    outputDirectory,
    itemLabel: "quiz",
    items: quizzes,
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
