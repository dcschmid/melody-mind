/**
 * Generates 1200x630 social images used for og:image / twitter:image and the
 * image sitemap.
 *
 * - Per album: cover artwork on a blurred, darkened copy of itself plus the
 *   album title (SVG text layer, best-effort).
 * - Default: brand background with the MelodyMind logo, used by pages without
 *   album artwork.
 *
 * Output is a build artifact under public/og/ (gitignored) and is regenerated
 * by the dev/build scripts.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load as loadYaml } from "js-yaml";
import sharp from "sharp";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const albumsDirectory = join(appRoot, "src/content/albums");
const coversDirectory = join(appRoot, "src/assets/album-covers");
const logoPath = join(appRoot, "src/assets/melody-mind-logo.webp");
const outputDirectory = join(appRoot, "public/og");

const WIDTH = 1200;
const HEIGHT = 630;
const COVER_SIZE = 500;
const COVER_LEFT = 64;
const TEXT_LEFT = 628;
const BRAND_LINE = "MelodyMind Music";
/* System fonts available on common Linux build hosts (Render, CI). */
const FONT_STACK = "DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;
const RASTER_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
/* Mirrors the extension preference used by src/utils/imageAssets.ts. */
const PREFERRED_EXTENSIONS = [".webp", ".avif", ".jpg", ".jpeg", ".png"];

/* Mirrors the Astro content id generation used for album URLs. */
const normalizeSlug = (slug) => slug.toLocaleLowerCase("en").replaceAll(" ", "-");

/*
 * Frontmatter coverImage values may reference a different extension than the
 * file on disk (e.g. .png vs .webp), so covers are resolved by extensionless
 * stem, matching how normalizeImageKey() works for pages.
 */
const buildCoverIndex = () => {
  const index = new Map();

  for (const entry of readdirSync(coversDirectory, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const extension = extname(entry.name).toLowerCase();
    if (!RASTER_IMAGE_EXTENSIONS.has(extension)) continue;

    const stem = entry.name.slice(0, -extension.length);
    const existing = index.get(stem);
    if (
      !existing ||
      PREFERRED_EXTENSIONS.indexOf(extension) <
        PREFERRED_EXTENSIONS.indexOf(extname(existing).toLowerCase())
    ) {
      index.set(stem, join(coversDirectory, entry.name));
    }
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

const generateAlbumImage = async ({ title, coverPath }, outputPath) => {
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
  const logoMetadata = await sharp(logoPath).metadata();
  const logoWidth = 560;
  const logoHeight = Math.round((logoMetadata.height * logoWidth) / logoMetadata.width);
  const logo = await sharp(logoPath).resize(logoWidth).toBuffer();

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: "#14101c" },
  })
    .composite([
      {
        input: logo,
        top: Math.round((HEIGHT - logoHeight) / 2),
        left: Math.round((WIDTH - logoWidth) / 2),
      },
    ])
    .jpeg({ quality: 85 })
    .toFile(outputPath);
};

/* Fallback card for albums without cover artwork: brand background + title. */
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

const collectAlbums = (coverIndex) => {
  const albums = [];

  for (const entry of readdirSync(albumsDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || extname(entry.name) !== ".mdx") continue;

    const source = readFileSync(join(albumsDirectory, entry.name), "utf8");
    const frontmatter = source.match(FRONTMATTER_PATTERN)?.[1];
    if (!frontmatter) continue;

    let data;
    try {
      data = loadYaml(frontmatter);
    } catch (error) {
      console.warn(`[social-images] Skipping ${entry.name}: invalid frontmatter`);
      console.warn(error instanceof Error ? error.message : error);
      continue;
    }

    if (!data || data.draft === true) continue;

    const coverStem = data.coverImage
      ? String(data.coverImage)
          .trim()
          .split("/")
          .pop()
          ?.replace(/\?.*$/u, "")
          .replace(/\.(jpg|jpeg|png|webp|avif)$/iu, "")
      : null;
    const coverPath = coverStem ? coverIndex.get(coverStem) : undefined;
    if (!coverPath) {
      console.warn(
        `[social-images] ${entry.name}: cover not found, generating title card`
      );
    }

    albums.push({
      slug: normalizeSlug(entry.name.slice(0, -extname(entry.name).length)),
      title: data.title || entry.name,
      coverPath,
    });
  }

  return albums;
};

const main = async () => {
  rmSync(outputDirectory, { recursive: true, force: true });
  mkdirSync(outputDirectory, { recursive: true });

  const albums = collectAlbums(buildCoverIndex());
  for (const album of albums) {
    const outputPath = join(outputDirectory, `${album.slug}.jpg`);
    if (album.coverPath) {
      await generateAlbumImage(album, outputPath);
    } else {
      await generateTitleCardImage(album, outputPath);
    }
  }
  await generateDefaultImage(join(outputDirectory, "default.jpg"));

  console.log(
    `[social-images] Generated ${albums.length} album images + default.jpg in ${outputDirectory}`
  );
};

main().catch((error) => {
  console.error("[social-images] Failed to generate social images");
  console.error(error);
  process.exit(1);
});
