/**
 * Generates 1200x630 social images used for og:image / twitter:image and the
 * image sitemap.
 *
 * - Per story: full-bleed hero image with a dark gradient and the story title
 *   (SVG text layer, best-effort).
 * - Default: brand background with the site name, used by pages without a
 *   story hero.
 *
 * Output is a build artifact under public/og/ (gitignored) and is regenerated
 * by the dev/build scripts.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const storiesDirectory = join(appRoot, "src/content/stories");
const outputDirectory = join(appRoot, "public/og");

const WIDTH = 1200;
const HEIGHT = 630;
const TEXT_LEFT = 64;
const BRAND_LINE = "MelodyMind Stories";
/* System fonts available on common Linux build hosts (Render, CI). */
const FONT_STACK = "DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const TITLE_PATTERN = /^title:\s*(.+)$/m;
const DRAFT_PATTERN = /^draft:\s*true\s*$/m;
const HERO_BLOCK_PATTERN = /^hero:[^\n]*\n((?:[ \t]+[^\n]*\n?)+)/m;
const HERO_IMAGE_PATTERN = /^[ \t]+image:\s*(.+)$/m;

const normalizeSlug = (slug) => slug.toLocaleLowerCase("en").replaceAll(" ", "-");

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const wrapTitle = (title, maxCharsPerLine = 40, maxLines = 3) => {
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

/* Darkens the lower half so light hero images keep title text readable. */
const buildGradientSvg = () =>
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.3" stop-color="#0c0a12" stop-opacity="0"/><stop offset="1" stop-color="#0c0a12" stop-opacity="0.9"/></linearGradient></defs><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade)"/></svg>`;

const buildTitleSvg = (title) => {
  const lines = wrapTitle(title, 30, 3);
  const fontSize = 50;
  const lineHeight = 64;
  const brandY = HEIGHT - 40;
  const startY = brandY - 24 - (lines.length - 1) * lineHeight - fontSize * 0.3;

  const textMarkup = lines
    .map(
      (line, index) =>
        `<text x="${TEXT_LEFT}" y="${Math.round(startY + index * lineHeight)}" font-family="${FONT_STACK}" font-size="${fontSize}" font-weight="bold" fill="#f5f2fa">${escapeXml(line)}</text>`
    )
    .join("");

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">${textMarkup}<text x="${TEXT_LEFT}" y="${brandY}" font-family="${FONT_STACK}" font-size="28" fill="#b9b3c6">${escapeXml(BRAND_LINE)}</text></svg>`;
};

const generateStoryImage = async ({ title, heroPath }, outputPath) => {
  const background = await sharp(heroPath)
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .toBuffer();

  const layers = [{ input: background }, { input: Buffer.from(buildGradientSvg()) }];

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
  const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg"><text x="${WIDTH / 2}" y="${HEIGHT / 2 + fontSize / 3}" text-anchor="middle" font-family="${FONT_STACK}" font-size="${fontSize}" font-weight="bold" fill="#f5f2fa">${escapeXml(BRAND_LINE)}</text><text x="${WIDTH / 2}" y="${HEIGHT / 2 + 56}" text-anchor="middle" font-family="${FONT_STACK}" font-size="30" fill="#9a93ad">Sourced long-form music journalism</text></svg>`;

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

const readFrontmatterTitle = (frontmatter) => {
  const match = frontmatter.match(TITLE_PATTERN);
  if (!match) return undefined;
  return match[1].trim().replace(/^["']|["']$/g, "");
};

const collectStories = () => {
  const stories = [];

  for (const entry of readdirSync(storiesDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || extname(entry.name) !== ".md") continue;

    const filePath = join(storiesDirectory, entry.name);
    const source = readFileSync(filePath, "utf8");
    const frontmatter = source.match(FRONTMATTER_PATTERN)?.[1];
    if (!frontmatter || DRAFT_PATTERN.test(frontmatter)) continue;

    const slug = normalizeSlug(entry.name.slice(0, -extname(entry.name).length));
    const heroBlock = frontmatter.match(HERO_BLOCK_PATTERN)?.[1];
    const heroImageValue = heroBlock?.match(HERO_IMAGE_PATTERN)?.[1]?.trim();
    const heroPath = heroImageValue
      ? resolve(dirname(filePath), heroImageValue)
      : undefined;
    if (!heroPath || !existsSync(heroPath)) {
      console.warn(
        `[social-images] ${entry.name}: hero image not found, skipping story card`
      );
      continue;
    }

    stories.push({
      slug,
      title: readFrontmatterTitle(frontmatter) || entry.name,
      heroPath,
    });
  }

  return stories;
};

const main = async () => {
  rmSync(outputDirectory, { recursive: true, force: true });
  mkdirSync(outputDirectory, { recursive: true });

  const stories = collectStories();
  for (const story of stories) {
    await generateStoryImage(story, join(outputDirectory, `${story.slug}.jpg`));
  }
  await generateDefaultImage(join(outputDirectory, "default.jpg"));

  console.log(
    `[social-images] Generated ${stories.length} story images + default.jpg in ${outputDirectory}`
  );
};

main().catch((error) => {
  console.error("[social-images] Failed to generate social images");
  console.error(error);
  process.exit(1);
});
