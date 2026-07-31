import fs from "node:fs/promises";
import path from "node:path";

import { load as loadYaml } from "js-yaml";

const CONTENT_DIRECTORY = new URL("../src/content/reviews/", import.meta.url);
const WORD_RANGE = [650, 2300];
const EXPECTED_REVIEW_COUNT = 16;
const REQUIRED_SECTION_COUNT = 6;

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

export function extractReviewHeadings(markdown) {
  return {
    sections: [...markdown.matchAll(/^##\s+(.+)$/gmu)].map((match) => match[1].trim()),
    trackExamples: [...markdown.matchAll(/^###\s+(.+)$/gmu)].map((match) =>
      match[1].trim()
    ),
  };
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
  const sectionSequences = new Map();
  for (const file of files) {
    const source = await fs.readFile(new URL(file, CONTENT_DIRECTORY), "utf8");
    const { data, body } = parseReview(source, file);
    const [minimum, maximum] = WORD_RANGE;
    const words = countEditorialWords(body);
    const { sections, trackExamples } = extractReviewHeadings(body);

    if (words < minimum || words > maximum) {
      failures.push(`${file}: body has ${words} words; expected ${minimum}-${maximum}.`);
    }
    if (sections.length !== REQUIRED_SECTION_COUNT) {
      failures.push(
        `${file}: found ${sections.length} review sections; expected ${REQUIRED_SECTION_COUNT}.`
      );
    }
    if (trackExamples.length < 2 || trackExamples.length > 4) {
      failures.push(
        `${file}: found ${trackExamples.length} track examples; expected 2–4.`
      );
    }
    if (
      new Set([...sections, ...trackExamples]).size !==
      sections.length + trackExamples.length
    ) {
      failures.push(`${file}: review headings must be unique.`);
    }
    if ((data.sources ?? []).length < 2) {
      failures.push(`${file}: at least two sources are required.`);
    }

    const sectionSequence = sections.join("\n");
    const matchingFile = sectionSequences.get(sectionSequence);
    if (matchingFile) {
      failures.push(
        `${file}: section headings duplicate ${matchingFile}; each review needs article-specific headings.`
      );
    } else {
      sectionSequences.set(sectionSequence, file);
    }
  }

  if (files.length !== EXPECTED_REVIEW_COUNT) {
    failures.push(`expected ${EXPECTED_REVIEW_COUNT} reviews, found ${files.length}.`);
  }

  if (failures.length) {
    throw new Error(`Content validation failed:\n${failures.join("\n")}`);
  }
  console.log(
    `Validated ${EXPECTED_REVIEW_COUNT} structured full reviews and their editorial metadata.`
  );
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isDirectRun) await main();
