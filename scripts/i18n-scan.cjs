#!/usr/bin/env node
/**
 * melody-mind/scripts/i18n-scan.js
 *
 * Scan project source files for potential hardcoded UI texts and produce a report.
 *
 * Features:
 * - Recursively walks configured source directories (default: src/{components,pages,layouts})
 * - Finds candidate text nodes in templates (text between tags)
 * - Finds quoted string literals in code (single, double, template) and heuristically filters UI strings
 * - Skips likely non-UI strings (URLs, file paths, translation keys, simple class-like tokens)
 * - Generates a suggested i18n key for each candidate and an example replacement snippet
 * - Produces JSON report and human-readable summary on stdout
 *
 * Usage:
 *   node scripts/i18n-scan.js [--root path] [--out report.json] [--include-textnodes true|false]
 *
 * Example:
 *   node scripts/i18n-scan.js --root . --out i18n-report.json --include-textnodes true
 *
 * Notes:
 * - This is a heuristic scanner. It will produce false positives/negatives.
 * - Review results and adjust keys/translations manually. Consider this a developer aid.
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_SCAN_DIRS = [
  "src/components",
  "src/pages",
  "src/layouts",
  "src/overlays",
  "src/islands",
].filter(Boolean);

const DEFAULT_EXTENSIONS = [
  ".astro",
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".html",
  ".md",
];

const IGNORED_DIRS = new Set(["node_modules", "dist", ".git", "public", "build", ".cache"]);

/**
 * Simple CLI args parser (no external deps)
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const out = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      const v = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : "true";
      out[k] = v;
    } else {
      out._.push(a);
    }
  }
  return out;
}

/**
 * Walk a directory recursively and collect files with matching extensions
 */
async function walk(root, extensions, includeDirs = DEFAULT_SCAN_DIRS) {
  const files = [];

  async function walkDir(dir) {
    let dirents;
    try {
      dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch (err) {
      return;
    }
    for (const d of dirents) {
      // skip ignored directories
      if (d.isDirectory() && IGNORED_DIRS.has(d.name)) continue;

      const full = path.join(dir, d.name);
      if (d.isDirectory()) {
        await walkDir(full);
      } else if (d.isFile()) {
        const ext = path.extname(d.name).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(full);
        }
      }
    }
  }

  // If includeDirs are absolute or relative, resolve them
  const dirs = includeDirs.map((p) => path.resolve(root, p));
  for (const d of dirs) {
    await walkDir(d);
  }

  return files;
}

/**
 * Heuristics for whether a candidate string is likely a UI string that should be translated.
 */
function isLikelyUiString(s) {
  if (!s) return false;
  const trimmed = s.trim();

  // length filters
  if (trimmed.length < 2 || trimmed.length > 300) return false;

  // exclude strings that look like URLs
  if (/https?:\/\//i.test(trimmed) || /^\//.test(trimmed) || /@?[\w.-]+\.[a-z]{2,}/i.test(trimmed)) return false;

  // exclude file names / import paths
  if (/[\\/]\w/.test(trimmed) || /\.\w{2,4}$/.test(trimmed)) return false;

  // exclude strings that look like translation keys or dot-separated tokens
  if (/^[a-z0-9_.-]+$/.test(trimmed)) return false;

  // exclude long sequences of CSS classes (heuristic: many tokens with hyphens and small words)
  const tokens = trimmed.split(/\s+/);
  const hyphenCount = tokens.filter((t) => t.includes("-")).length;
  if (tokens.length > 2 && hyphenCount / tokens.length > 0.5) return false;

  // must contain at least one letter (unicode aware)
  if (!/[\p{L}]/u.test(trimmed)) return false;

  // if it's a single short word, prefer to include only if first char is uppercase (likely a label)
  if (tokens.length === 1 && trimmed.length <= 3 && !/^[\p{Lu}]/u.test(trimmed)) return false;

  return true;
}

/**
 * Find candidate strings in file content:
 * - quoted string literals '...' "..." `...` (template strings containing ${} will be ignored)
 * - text nodes between > and < (if enabled)
 */
function scanContent(content, { includeTextNodes = true } = {}) {
  const candidates = [];

  // 1) Quoted strings
  // Using a global regex to capture single, double, template literal content.
  // Note: this is heuristic and doesn't fully parse JS/TS.
  const STRING_REGEX = /(['"`])((?:\\.|(?!\1).){1,1000})\1/gs;
  let m;
  while ((m = STRING_REGEX.exec(content)) !== null) {
    const quote = m[1];
    const raw = m[2];

    // skip template expressions
    if (quote === "`" && /\$\{/.test(raw)) continue;

    const val = raw.replace(/\\['"`nrt\\]/g, "").trim();
    if (isLikelyUiString(val)) {
      // find line/col
      const before = content.slice(0, m.index);
      const line = (before.match(/\n/g) || []).length + 1;
      const col = m.index - (before.lastIndexOf("\n") === -1 ? -1 : before.lastIndexOf("\n"));
      candidates.push({
        type: "string",
        raw: raw,
        value: val,
        line,
        col,
        index: m.index,
      });
    }
  }

  // 2) Text nodes if enabled: > some text <
  if (includeTextNodes) {
    const TEXTNODE_REGEX = />\s*([^<>{}][^<>]{0,400}?)\s*</gs;
    while ((m = TEXTNODE_REGEX.exec(content)) !== null) {
      const raw = m[1].trim();
      if (!raw) continue;
      // filter out strings that are just single punctuation or emojis
      if (raw.length < 2) continue;
      // exclude if contains templating markers
      if (/{|}/.test(raw)) continue;
      // exclude markup-only lines like comments or numeric badges
      if (!isLikelyUiString(raw)) continue;

      const before = content.slice(0, m.index);
      const line = (before.match(/\n/g) || []).length + 1;
      const col = m.index - (before.lastIndexOf("\n") === -1 ? -1 : before.lastIndexOf("\n"));
      candidates.push({
        type: "textnode",
        raw,
        value: raw,
        line,
        col,
        index: m.index,
      });
    }
  }

  return candidates;
}

/**
 * Generate a suggested i18n key based on file path and snippet
 */
function generateSuggestedKey(rootDir, filePath, value, existingKeys) {
  const rel = path.relative(rootDir, filePath).replace(/\\/g, "/");
  const parts = rel.split("/").filter(Boolean);
  // use last 2 path segments (or fewer) as prefix
  const suffixParts = parts.slice(-3).map((p) => p.replace(/\.[^/.]+$/, ""));
  // sanitize value: keep first 4 words, lowercased, alphanumeric and underscores
  const words = value
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .map((w) => w.toLowerCase());
  const tail = words.join("_") || "text";
  let baseKey = [...suffixParts, tail].join(".").replace(/[^a-z0-9_.]/gi, "_");
  baseKey = baseKey.replace(/_+/g, "_").replace(/\.+/g, ".");
  // ensure uniqueness
  let key = `auto.${baseKey}`;
  let i = 1;
  while (existingKeys.has(key)) {
    i += 1;
    key = `auto.${baseKey}_${i}`;
  }
  existingKeys.add(key);
  return key;
}

/**
 * Produce a contextual snippet for a match (few lines around)
 */
function snippetFor(content, index, contextChars = 120) {
  const start = Math.max(0, index - contextChars);
  const end = Math.min(content.length, index + contextChars);
  let s = content.slice(start, end);
  s = s.replace(/\n/g, "\\n");
  return s;
}

/**
 * Main
 */
(async function main() {
  const argv = parseArgs();
  const root = path.resolve(argv.root || process.cwd());
  const outFile = path.resolve(argv.out ? String(argv.out) : path.join(root, "i18n-scan-report.json"));
  const includeTextNodes = argv.includeTextnodes !== "false"; // default true
  const scanDirs = argv.dirs ? String(argv.dirs).split(",") : DEFAULT_SCAN_DIRS;
  const extensions = argv.ext ? String(argv.ext).split(",") : DEFAULT_EXTENSIONS;

  console.log(`i18n-scan: root=${root}`);
  console.log(`i18n-scan: scanning dirs=${scanDirs.join(", ")} extensions=${extensions.join(", ")}`);
  console.log(`i18n-scan: includeTextNodes=${includeTextNodes}`);
  console.log("");

  // gather files
  const files = await walk(root, extensions.map((e) => (e.startsWith(".") ? e : "." + e)), scanDirs);
  console.log(`Found ${files.length} files to scan.`);

  const results = [];
  const existingKeys = new Set();

  for (const file of files) {
    let content;
    try {
      content = await fs.promises.readFile(file, "utf8");
    } catch (err) {
      console.warn(`Warning: could not read ${file}: ${err.message}`);
      continue;
    }

    const candidates = scanContent(content, { includeTextNodes });
    if (candidates.length === 0) continue;

    for (const c of candidates) {
      const key = generateSuggestedKey(root, file, c.value, existingKeys);
      results.push({
        file: path.relative(root, file),
        type: c.type,
        line: c.line,
        col: c.col,
        value: c.value,
        raw: c.raw,
        snippet: snippetFor(content, c.index),
        suggestedKey: key,
        suggestedReplacement: `t("${key}")`,
      });
    }
  }

  // Save report
  const report = {
    generatedAt: new Date().toISOString(),
    root,
    scannedFiles: files.length,
    matches: results.length,
    results,
  };

  try {
    await fs.promises.writeFile(outFile, JSON.stringify(report, null, 2), "utf8");
    console.log(`Report written to ${outFile}`);
  } catch (err) {
    console.error(`Failed to write report to ${outFile}: ${err.message}`);
  }

  // Print a concise summary
  console.log("");
  console.log("Summary:");
  console.log(`  Total files scanned: ${files.length}`);
  console.log(`  Potential UI strings found: ${results.length}`);
  if (results.length > 0) {
    console.log("");
    console.log("Top 25 findings (file:line):");
    results.slice(0, 25).forEach((r, i) => {
      const truncated = r.value.length > 80 ? r.value.slice(0, 77) + "..." : r.value;
      console.log(`  ${i + 1}. ${r.file}:${r.line} -> "${truncated}"  -> suggested key: ${r.suggestedKey}`);
    });
    console.log("");
    console.log("Please review the generated report. Automated suggestions are heuristic and require manual validation.");
  }

  // Exit code
  process.exit(0);
})();
