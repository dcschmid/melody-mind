import { readFileSync, readdirSync } from "node:fs";
import { extname } from "node:path";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---/;

const toIsoDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date.toISOString();
};

const getNewestDate = (dates) =>
  dates.reduce((newest, date) => (!newest || date > newest ? date : newest), undefined);

export const readSitemapDates = ({
  contentDirectory,
  extensions,
  routePrefix = "",
  dateFields,
  normalizeSlug = (slug) => slug,
}) => {
  const meta = readSitemapMeta({
    contentDirectory,
    extensions,
    routePrefix,
    dateFields,
    normalizeSlug,
  });
  const datesByPath = new Map();

  for (const [path, entry] of meta) {
    if (entry.lastmod) datesByPath.set(path, entry.lastmod);
  }

  return datesByPath;
};

export const readSitemapMeta = ({
  contentDirectory,
  extensions,
  routePrefix = "",
  dateFields,
  titleFields = [],
  normalizeSlug = (slug) => slug,
}) => {
  const allowedExtensions = new Set(extensions);
  const metaByPath = new Map();

  for (const entry of readdirSync(contentDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || !allowedExtensions.has(extname(entry.name))) continue;

    const source = readFileSync(new URL(entry.name, contentDirectory), "utf8");
    const frontmatter = source.match(FRONTMATTER_PATTERN)?.[1];
    if (!frontmatter || /^\s*draft:\s*true\s*$/im.test(frontmatter)) continue;

    const dates = dateFields.flatMap((field) => {
      const pattern = new RegExp(
        `^\\s*${field}:\\s*[\"']?([^\"'\\r\\n#]+)[\"']?\\s*$`,
        "gim"
      );
      return [...frontmatter.matchAll(pattern)]
        .map((match) => toIsoDate(match[1].trim()))
        .filter(Boolean);
    });
    const newest = getNewestDate(dates);

    const title = titleFields
      .map((field) => {
        const pattern = new RegExp(
          `^\\s*${field}:\\s*[\"']?([^\"'\\r\\n#]+)[\"']?\\s*$`,
          "im"
        );
        return frontmatter.match(pattern)?.[1]?.trim();
      })
      .find(Boolean);

    const extension = extname(entry.name);
    const slug = normalizeSlug(entry.name.slice(0, -extension.length));
    const path = `/${[routePrefix, slug].filter(Boolean).join("/")}/`;
    metaByPath.set(path, { lastmod: newest, title });
  }

  return metaByPath;
};

export const getNewestSitemapDate = (datesByPath) =>
  getNewestDate([...datesByPath.values()]);
