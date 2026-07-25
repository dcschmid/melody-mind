import fs from "node:fs/promises";
import path from "node:path";

import { load as loadYaml } from "js-yaml";

const CONTENT_DIRECTORY = new URL("../src/content/stories/", import.meta.url);
const MIN_WORDS = 1800;
const MAX_WORDS = 2500;

function parseStory(source, fileName) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/u);
  if (!match) {
    throw new Error(`${fileName}: missing or malformed YAML frontmatter.`);
  }

  return {
    data: loadYaml(match[1]),
    body: match[2],
  };
}

export function countEditorialWords(markdown) {
  return markdown
    .replace(/<!--[\s\S]*?-->/gu, " ")
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/[#*_>`~]/gu, " ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean).length;
}

export function validateFrontmatterRelationships(data) {
  const errors = [];
  const sources = Array.isArray(data.sources) ? data.sources : [];
  const figures = Array.isArray(data.figures) ? data.figures : [];
  const sourceIds = sources.map((source) => source.id);
  const imageIds = [data.hero?.id, ...figures.map((figure) => figure.id)].filter(Boolean);

  if (new Set(sourceIds).size !== sourceIds.length) {
    errors.push("source IDs must be unique");
  }
  if (new Set(imageIds).size !== imageIds.length) {
    errors.push("hero and figure IDs must be unique");
  }

  for (const image of [data.hero, ...figures]) {
    const required = [
      "id",
      "image",
      "alt",
      "caption",
      "creator",
      "sourceName",
      "sourceUrl",
      "license",
      "licenseUrl",
      "alterations",
    ];
    for (const field of required) {
      if (!image?.[field]) {
        errors.push(`image "${image?.id ?? "unknown"}" is missing ${field}`);
      }
    }
  }

  for (const source of sources) {
    if (!source.url?.startsWith("https://")) {
      errors.push(`source "${source.id}" must use HTTPS`);
    }
  }

  if (data.artifact) {
    if (!imageIds.includes(data.artifact.imageId)) {
      errors.push("artifact imageId does not match a story image");
    }
    if (data.artifact.markers?.length !== 5) {
      errors.push("annotated artifact must contain exactly five markers");
    }
    const markerIds = data.artifact.markers?.map((marker) => marker.id) ?? [];
    if (new Set(markerIds).size !== markerIds.length) {
      errors.push("annotation marker IDs must be unique");
    }
    for (const marker of data.artifact.markers ?? []) {
      for (const sourceRef of marker.sourceRefs ?? []) {
        if (!sourceIds.includes(sourceRef)) {
          errors.push(
            `annotation "${marker.id}" references unknown source "${sourceRef}"`
          );
        }
      }
    }
  }

  return errors;
}

async function main() {
  const files = (await fs.readdir(CONTENT_DIRECTORY)).filter((file) =>
    file.endsWith(".md")
  );
  const failures = [];

  for (const file of files) {
    const source = await fs.readFile(new URL(file, CONTENT_DIRECTORY), "utf8");
    const { data, body } = parseStory(source, file);
    const words = countEditorialWords(body);

    if (words < MIN_WORDS || words > MAX_WORDS) {
      failures.push(
        `${file}: body has ${words} words; expected ${MIN_WORDS}-${MAX_WORDS}.`
      );
    }

    for (const error of validateFrontmatterRelationships(data)) {
      failures.push(`${file}: ${error}.`);
    }
  }

  if (files.length !== 10) {
    failures.push(`expected exactly 10 published stories, found ${files.length}.`);
  }

  if (failures.length > 0) {
    throw new Error(`Content validation failed:\n${failures.join("\n")}`);
  }

  console.log(`Validated ${files.length} stories and their editorial metadata.`);
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isDirectRun) {
  await main();
}
