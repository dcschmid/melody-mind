import fs from "node:fs/promises";
import path from "node:path";

import { load as loadYaml } from "js-yaml";

const CONTENT_DIRECTORY = new URL("../src/content/reviews/", import.meta.url);
const WORD_RANGES = {
  "full-review": [650, 2200],
  "album-of-the-week": [650, 1100],
  reappraisal: [1000, 2300],
};

export function countEditorialWords(markdown) {
  return markdown
    .replace(/<!--[\s\S]*?-->/gu, " ")
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/[#*_>`~]/gu, " ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean).length;
}

export function extractHeadingIds(markdown) {
  return new Set(
    [...markdown.matchAll(/^<h2\s+id="([a-z0-9]+(?:-[a-z0-9]+)*)">.+<\/h2>$/gmu)].map(
      (match) => match[1]
    )
  );
}

function parseReview(source, fileName) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/u);
  if (!match) throw new Error(`${fileName}: missing or malformed frontmatter.`);
  return { data: loadYaml(match[1]), body: match[2] };
}

async function main() {
  const files = (await fs.readdir(CONTENT_DIRECTORY)).filter((file) =>
    file.endsWith(".mdx")
  );
  const failures = [];
  let currentAlbumOfTheWeek = 0;
  const formatCounts = { "full-review": 0, "album-of-the-week": 0, reappraisal: 0 };

  for (const file of files) {
    const source = await fs.readFile(new URL(file, CONTENT_DIRECTORY), "utf8");
    const { data, body } = parseReview(source, file);
    const [minimum, maximum] = WORD_RANGES[data.format] ?? [0, 0];
    const words = countEditorialWords(body);
    const headings = extractHeadingIds(body);

    if (words < minimum || words > maximum) {
      failures.push(`${file}: body has ${words} words; expected ${minimum}-${maximum}.`);
    }
    for (const point of data.reviewMap ?? []) {
      if (!headings.has(point.target)) {
        failures.push(`${file}: Review Map target "${point.target}" has no heading.`);
      }
    }
    if ((data.sources ?? []).length < 2) {
      failures.push(`${file}: at least two sources are required.`);
    }
    if (data.currentAlbumOfTheWeek) currentAlbumOfTheWeek += 1;
    if (data.format in formatCounts) formatCounts[data.format] += 1;
  }

  if (files.length !== 7) failures.push(`expected 7 reviews, found ${files.length}.`);
  if (formatCounts["full-review"] !== 5) failures.push("expected 5 full reviews.");
  if (formatCounts["album-of-the-week"] !== 1)
    failures.push("expected 1 Album of the Week.");
  if (formatCounts.reappraisal !== 1) failures.push("expected 1 reappraisal.");
  if (currentAlbumOfTheWeek !== 1)
    failures.push("expected exactly one current Album of the Week.");

  if (failures.length) {
    throw new Error(`Content validation failed:\n${failures.join("\n")}`);
  }
  console.log("Validated 7 reviews, their formats, maps, and editorial metadata.");
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isDirectRun) await main();
