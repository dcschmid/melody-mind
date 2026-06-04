#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_SITE_URL = "https://melody-mind.de";
const DEFAULT_INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const DEFAULT_INDEXNOW_KEY =
  "9eda49e5fe0da697d03be0e0182261f6220da2066439bd6ae66018671155d83a";

const args = process.argv.slice(2);

const usage = `Usage:
  pnpm indexnow:submit -- /album-slug/
  pnpm indexnow:submit -- https://melody-mind.de/album-slug/
  pnpm indexnow:submit -- apps/music/src/content/albums/album-slug.mdx
  pnpm indexnow:submit -- --file changed-urls.txt
  pnpm indexnow:submit -- --git HEAD~1..HEAD

Options:
  --dry-run          Print the payload without sending it.
  --file <path>     Read URLs, paths, or album content file paths from a text file.
  --git [range]     Read changed files from git diff. Defaults to HEAD~1..HEAD.
  --help            Show this help.

Environment:
  INDEXNOW_SITE_URL   Defaults to ${DEFAULT_SITE_URL}
  INDEXNOW_ENDPOINT   Defaults to ${DEFAULT_INDEXNOW_ENDPOINT}
  INDEXNOW_KEY        Defaults to the checked-in public key file value
`;

const options = {
  dryRun: false,
  files: [],
  gitRanges: [],
  values: [],
};

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];

  if (arg === "--") {
    continue;
  }

  if (arg === "--help" || arg === "-h") {
    console.log(usage);
    process.exit(0);
  }

  if (arg === "--dry-run") {
    options.dryRun = true;
    continue;
  }

  if (arg === "--file") {
    const file = args[i + 1];
    if (!file) {
      throw new Error("--file requires a path.");
    }
    options.files.push(file);
    i += 1;
    continue;
  }

  if (arg === "--git") {
    const next = args[i + 1];
    if (next && !next.startsWith("-")) {
      options.gitRanges.push(next);
      i += 1;
    } else {
      options.gitRanges.push("HEAD~1..HEAD");
    }
    continue;
  }

  options.values.push(arg);
}

const siteUrl = new URL(process.env.INDEXNOW_SITE_URL || DEFAULT_SITE_URL);
const endpoint = process.env.INDEXNOW_ENDPOINT || DEFAULT_INDEXNOW_ENDPOINT;
const key = process.env.INDEXNOW_KEY || DEFAULT_INDEXNOW_KEY;
const keyLocation = new URL(`/${key}.txt`, siteUrl).toString();

function readLines(filePath) {
  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function readGitChangedFiles(range) {
  const output = execFileSync(
    "git",
    ["diff", "--name-only", "--diff-filter=ACMRT", range],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }
  );
  return output.split(/\r?\n/).filter(Boolean);
}

function albumPathToUrl(value) {
  const normalized = value.replaceAll(path.sep, "/");
  const match = normalized.match(
    /(?:^|\/)apps\/music\/src\/content\/albums\/([^/]+)\.mdx$/i
  );

  if (!match) {
    return null;
  }

  return new URL(`/${match[1]}/`, siteUrl).toString();
}

function normalizeUrl(value) {
  const fromAlbumPath = albumPathToUrl(value);
  if (fromAlbumPath) {
    return fromAlbumPath;
  }

  const url = new URL(value, siteUrl);
  if (url.hostname !== siteUrl.hostname) {
    throw new Error(`IndexNow URL belongs to a different host: ${url.toString()}`);
  }

  if (!url.pathname.endsWith("/") && !path.extname(url.pathname)) {
    url.pathname = `${url.pathname}/`;
  }

  return url.toString();
}

const submittedValues = [
  ...options.values,
  ...options.files.flatMap(readLines),
  ...options.gitRanges.flatMap(readGitChangedFiles),
];
const urlList = [...new Set(submittedValues.map(normalizeUrl))];

if (urlList.length === 0) {
  console.error("No IndexNow URLs to submit.");
  console.error(usage);
  process.exit(1);
}

if (urlList.length > 10_000) {
  throw new Error("IndexNow accepts up to 10,000 URLs per request.");
}

const payload = {
  host: siteUrl.hostname,
  key,
  keyLocation,
  urlList,
};

if (options.dryRun) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(payload),
});

if (!response.ok && response.status !== 202) {
  const body = await response.text();
  throw new Error(
    `IndexNow submission failed with ${response.status} ${response.statusText}: ${body}`
  );
}

console.log(
  `Submitted ${urlList.length} URL${urlList.length === 1 ? "" : "s"} to IndexNow.`
);
console.log(`Response: ${response.status} ${response.statusText}`);
