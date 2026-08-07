/**
 * Generates 1200x630 social images used for og:image / twitter:image and the
 * image sitemap.
 *
 * - Per review: cover artwork on a blurred, darkened copy of itself plus the
 *   review title (SVG text layer, best-effort). Reviews without cover artwork
 *   get a brand title card.
 * - Default: brand background with the site name, used by non-review pages.
 *
 * Output is a build artifact under public/og/ (gitignored) and is regenerated
 * by the dev/build scripts.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const reviewsDirectory = join(appRoot, "src/content/reviews");
const coversDirectory = join(appRoot, "src/assets/review-covers");
const outputDirectory = join(appRoot, "public/og");

const WIDTH = 1200;
const HEIGHT = 630;
const COVER_SIZE = 500;
const COVER_LEFT = 64;
const TEXT_LEFT = 628;
const BRAND_LINE = "MelodyMind Reviews";
/* System fonts available on common Linux build hosts (Render, CI). */
const FONT_STACK = "DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const TITLE_PATTERN = /^title:\s*(.+)$/m;
const DRAFT_PATTERN = /^draft:\s*true\s*$/m;
const RASTER_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const normalizeSlug = (slug) => slug.toLocaleLowerCase("en").replaceAll(" ", "-");

const buildCoverIndex = () => {
  const index = new Map();

  for (const entry of readdirSync(coversDirectory, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const extension = extname(entry.name).toLowerCase();
    if (!RASTER_IMAGE_EXTENSIONS.has(extension)) continue;
    index.set(entry.name.slice(0, -extension.length), join(coversDirectory, entry.name));
  }

  return index;
};

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const wrapTitle = (title, maxCharsPerLine = 18, maxLines = 4) => {
  const words = String(title).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].slice(0, maxCharsPerLine - 1).trimEnd()}…`;
    return kept;
  }

  return lines;
};

const buildTitleSvg = (title) => {
  const lines = wrapTitle(title);
  const fontSize = 54;
  const lineHeight = 70;
  const startY = Math.round((HEIGHT - lines.length * lineHeight) / 2) + fontSize;

  const textMarkup = lines
    .map(
      (line, index) =>
        `<text x="${TEXT_LEFT}" y="${startY + index * lineHeight}" font-family="${FONT_STACK}" font-size="${fontSize}" font-weight="bold" fill="#f5f2fa">${escapeXml(line)}</text>`
    )
    .join("");

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">${textMarkup}<text x="${TEXT_LEFT}" y="${HEIGHT - 48}" font-family="${FONT_STACK}" font-size="30" fill="#9a93ad">${escapeXml(BRAND_LINE)}</text></svg>`;
};

const generateReviewImage = async ({ title, coverPath }, outputPath) => {
  const coverBuffer = readFileSync(coverPath);

  const background = await sharp(coverBuffer)
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .blur(28)
    .composite([
      {
        input: {
          create: {
            width: WIDTH,
            height: HEIGHT,
            channels: 4,
            background: { r: 12, g: 10, b: 18, alpha: 0.55 },
          },
        },
        blend: "over",
      },
    ])
    .toBuffer();

  const cover = await sharp(coverBuffer)
    .resize(COVER_SIZE, COVER_SIZE, { fit: "cover" })
    .toBuffer();

  const layers = [
    { input: background },
    {
      input: cover,
      top: Math.round((HEIGHT - COVER_SIZE) / 2),
      left: COVER_LEFT,
    },
  ];

  try {
    const titleSvg = Buffer.from(buildTitleSvg(title));
    await sharp(titleSvg).metadata();
    layers.push({ input: titleSvg, top: 0, left: 0 });
  } catch {
    /* The text layer is best-effort; the card still works without it. */
  }

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: "#14101c" },
  })
    .composite(layers)
    .jpeg({ quality: 82 })
    .toFile(outputPath);
};

const generateDefaultImage = async (outputPath) => {
  const fontSize = 64;
  const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg"><text x="${WIDTH / 2}" y="${HEIGHT / 2 + fontSize / 3}" text-anchor="middle" font-family="${FONT_STACK}" font-size="${fontSize}" font-weight="bold" fill="#f5f2fa">${escapeXml(BRAND_LINE)}</text><text x="${WIDTH / 2}" y="${HEIGHT / 2 + 56}" text-anchor="middle" font-family="${FONT_STACK}" font-size="30" fill="#9a93ad">Sourced album criticism without scores</text></svg>`;

  const layers = [];
  try {
    const svgBuffer = Buffer.from(svg);
    await sharp(svgBuffer).metadata();
    layers.push({ input: svgBuffer, top: 0, left: 0 });
  } catch {
    /* The text layer is best-effort; the card still works without it. */
  }

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: "#14101c" },
  })
    .composite(layers)
    .jpeg({ quality: 85 })
    .toFile(outputPath);
};

/* Title card for reviews without cover artwork (typographic cover mode). */
const generateTitleCardImage = async ({ title }, outputPath) => {
  const lines = wrapTitle(title, 24, 5);
  const fontSize = 56;
  const lineHeight = 74;
  const startY = Math.round((HEIGHT - lines.length * lineHeight) / 2) + fontSize;

  const textMarkup = lines
    .map(
      (line, index) =>
        `<text x="${WIDTH / 2}" y="${startY + index * lineHeight}" text-anchor="middle" font-family="${FONT_STACK}" font-size="${fontSize}" font-weight="bold" fill="#f5f2fa">${escapeXml(line)}</text>`
    )
    .join("");

  const layers = [];
  try {
    const titleSvg = Buffer.from(
      `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">${textMarkup}<text x="${WIDTH / 2}" y="${HEIGHT - 48}" text-anchor="middle" font-family="${FONT_STACK}" font-size="30" fill="#9a93ad">${escapeXml(BRAND_LINE)}</text></svg>`
    );
    await sharp(titleSvg).metadata();
    layers.push({ input: titleSvg, top: 0, left: 0 });
  } catch {
    /* The text layer is best-effort; the card still works without it. */
  }

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: "#14101c" },
  })
    .composite(layers)
    .jpeg({ quality: 85 })
    .toFile(outputPath);
};

const readFrontmatterTitle = (frontmatter) => {
  const match = frontmatter.match(TITLE_PATTERN);
  if (!match) return undefined;
  return match[1].trim().replace(/^["']|["']$/g, "");
};

const collectReviews = (coverIndex) => {
  const reviews = [];

  for (const entry of readdirSync(reviewsDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || extname(entry.name) !== ".mdx") continue;

    const source = readFileSync(join(reviewsDirectory, entry.name), "utf8");
    const frontmatter = source.match(FRONTMATTER_PATTERN)?.[1];
    if (!frontmatter || DRAFT_PATTERN.test(frontmatter)) continue;

    const slug = normalizeSlug(entry.name.slice(0, -extname(entry.name).length));
    const coverPath = coverIndex.get(slug);

    reviews.push({
      slug,
      title: readFrontmatterTitle(frontmatter) || entry.name,
      coverPath,
    });
  }

  return reviews;
};

const main = async () => {
  rmSync(outputDirectory, { recursive: true, force: true });
  mkdirSync(outputDirectory, { recursive: true });

  const reviews = collectReviews(buildCoverIndex());
  for (const review of reviews) {
    const outputPath = join(outputDirectory, `${review.slug}.jpg`);
    if (review.coverPath) {
      await generateReviewImage(review, outputPath);
    } else {
      await generateTitleCardImage(review, outputPath);
    }
  }
  await generateDefaultImage(join(outputDirectory, "default.jpg"));

  console.log(
    `[social-images] Generated ${reviews.length} review images + default.jpg in ${outputDirectory}`
  );
};

main().catch((error) => {
  console.error("[social-images] Failed to generate social images");
  console.error(error);
  process.exit(1);
});
