import fs from "node:fs/promises";
import path from "node:path";
import { load as loadYaml } from "js-yaml";

const articleDirectory = new URL("../src/content/articles/", import.meta.url);
export const EXPECTED_ARTICLE_IDS = [
  "how-dub-made-the-studio-an-instrument",
  "why-bass-and-versions-hold-a-dub-mix-together",
  "how-to-hear-space-in-a-mix",
  "how-rock-rhythm-sections-create-motion",
  "gothic-rock-is-not-gothic-metal",
  "how-metal-riffs-organize-rhythm",
  "punk-before-and-after-1977",
  "what-double-tracking-does-to-a-guitar",
];
const parse = (source, file) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/u);
  if (!match) throw new Error(`${file}: malformed frontmatter`);
  return { data: loadYaml(match[1]), body: match[2] };
};
export const articleProse = (body) =>
  body
    .replace(/^import\s.+?;\s*$/gmu, "")
    .replace(/<Endnotes\s*\/>[\s\S]*$/u, "")
    .replace(/<[^>]+>/gu, " ")
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/gu, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/\[#(?:[a-z0-9-]+)\]/gu, " ")
    .replace(/[#{|}*_>`~]/gu, " ");
export const countWords = (body) =>
  articleProse(body).trim().split(/\s+/u).filter(Boolean).length;

export const validateSource = (source) =>
  source.type === "website" && (!source.url || !source.accessedAt)
    ? `${source.id}: online sources require URL and access date`
    : undefined;

export const validateEntry = ({ id, data, body }, allIds) => {
  const failures = [];
  const words = countWords(body);
  if (words < 5000 || words > 7500)
    failures.push(`${id}: ${words} editorial words; expected 5000-7500`);
  const expectedReadingMinutes = Math.ceil(words / 225);
  if (data.readingMinutes !== expectedReadingMinutes)
    failures.push(
      `${id}: readingMinutes ${data.readingMinutes}; expected ${expectedReadingMinutes}`
    );
  const sourceIds = (data.sources ?? []).map((source) => source.id);
  if (sourceIds.length < 15)
    failures.push(`${id}: ${sourceIds.length} sources; expected at least 15`);
  const cited = [
    ...body.matchAll(/(?:\[#([a-z0-9-]+)\]|\]\(#source-([a-z0-9-]+)\))/gu),
  ].map((match) => match[1] ?? match[2]);
  for (const sourceId of sourceIds)
    if (!cited.includes(sourceId)) failures.push(`${id}: unused source ${sourceId}`);
  for (const sourceId of cited)
    if (!sourceIds.includes(sourceId)) failures.push(`${id}: unknown source ${sourceId}`);
  for (const source of data.sources ?? []) {
    const sourceFailure = validateSource(source);
    if (sourceFailure) failures.push(`${id}: ${sourceFailure}`);
  }
  if (!body.includes("<Endnotes")) failures.push(`${id}: missing Endnotes component`);
  for (const relation of data.related ?? [])
    if (relation.id === id || !allIds.has(relation.id))
      failures.push(`${id}: invalid relation ${relation.id}`);
  return failures;
};

export async function validateContent(directory = articleDirectory) {
  const failures = [];
  const files = (await fs.readdir(directory)).filter((file) => file.endsWith(".mdx"));
  const entries = [];
  for (const file of files) {
    const { data, body } = parse(
      await fs.readFile(new URL(file, directory), "utf8"),
      file
    );
    entries.push({ id: file.replace(/\.mdx$/u, ""), data, body });
  }
  if (files.length !== 8)
    failures.push(`expected exactly 8 MDX articles, found ${files.length}`);
  const ids = new Set(entries.map((entry) => entry.id));
  for (const expected of EXPECTED_ARTICLE_IDS)
    if (!ids.has(expected)) failures.push(`missing article ${expected}`);
  for (const entry of entries) failures.push(...validateEntry(entry, ids));
  if (failures.length)
    throw new Error(`Knowledge validation failed:\n${failures.join("\n")}`);
  return entries.map(({ id, body }) => ({ id, words: countWords(body) }));
}
const direct =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (direct) {
  const result = await validateContent();
  console.log(
    `Validated ${result.length} long-form articles (${result.reduce((sum, item) => sum + item.words, 0)} editorial words).`
  );
}
