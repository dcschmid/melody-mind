#!/usr/bin/env node
/**
 * melody-mind/scripts/i18n-apply-medium.cjs
 *
 * Medium-safety i18n apply script (dry-run by default).
 *
 * Purpose:
 * - Targets larger .astro text nodes (multi-line or length > 60 chars) that are likely UI/paragraph content.
 * - Uses a previously generated i18n scan report: i18n-scan-report.json (same format produced by scripts/i18n-scan.cjs).
 * - Creates suggested i18n keys and inserts them into `src/i18n/locales/en.ts`.
 * - Optionally populates other locale files with machine-translated placeholders (MT: prefix).
 * - Performs replacements only inside .astro body (not in frontmatter or <script> blocks).
 * - Default behavior: dry-run (no files changed). Use --apply to write files.
 *
 * Usage:
 *   node scripts/i18n-apply-medium.cjs [--report path] [--batch N] [--offset M] [--apply] [--translate] [--locales lang1,lang2,...] [--commit]
 *
 * Examples:
 *   # Dry run medium batch of 50 candidates:
 *   node scripts/i18n-apply-medium.cjs --report i18n-scan-report.json --batch 50 --offset 0
 *
 *   # Apply and populate other locales (MT:) for default languages:
 *   node scripts/i18n-apply-medium.cjs --report i18n-scan-report.json --batch 50 --offset 0 --apply --translate
 *
 * Notes:
 * - This script is more permissive than the "safe" variant: it will consider multi-line paragraphs and longer texts.
 * - It still avoids replacements in frontmatter and script blocks and avoids obvious code-like candidates.
 * - Always inspect dry-run output before using --apply. Backups will be created under `.i18n-backups-medium/<timestamp>/`.
 */

const fs = require("fs");
const path = require("path");
const util = require("util");
const child_process = require("child_process");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const stat = util.promisify(fs.stat);

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_REPORT = path.join(ROOT, "i18n-scan-report.json");
const LOCALES_DIR = path.join(ROOT, "src", "i18n", "locales");
const EN_LOCALE = path.join(LOCALES_DIR, "en.ts");
const BACKUP_BASE = path.join(ROOT, ".i18n-backups-medium");

const DEFAULT_LANG_LIST = [
  "de",
  "en",
  "es",
  "fr",
  "it",
  "pt",
  "da",
  "nl",
  "sv",
  "fi",
  "cn",
  "jp",
  "ru",
  "uk",
];

/**
 * Simple CLI args parser.
 */
function parseArgs() {
  const argv = process.argv.slice(2);
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.replace(/^--/, "");
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
      args[key] = val;
    }
  }
  return args;
}

function fileExistsSync(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Split frontmatter and body from an .astro file.
 * Returns { frontmatter: string|null, body: string, frontmatterRange: {start,end}|null }
 */
function splitFrontmatter(content) {
  const fmRegex = /^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  const m = fmRegex.exec(content);
  if (!m) {
    return { frontmatter: null, body: content, frontmatterRange: null };
  }
  const frontmatter = m[0];
  const start = m.index;
  const end = m.index + frontmatter.length;
  const body = content.slice(end);
  return { frontmatter, body, frontmatterRange: { start, end } };
}

/**
 * Find <script>...</script> blocks in body and return ranges.
 */
function findScriptBlocks(body) {
  const ranges = [];
  const regex = /<script\b[\s\S]*?>[\s\S]*?<\/script\s*>/gi;
  let m;
  while ((m = regex.exec(body))) {
    ranges.push({ start: m.index, end: m.index + m[0].length });
  }
  return ranges;
}

function indexInsideRanges(index, ranges) {
  for (const r of ranges) {
    if (index >= r.start && index < r.end) return true;
  }
  return false;
}

/**
 * Medium-safety candidate filter.
 * - type must be 'textnode'
 * - file must end with .astro
 * - value must be multi-line OR length > 60
 * - value must not contain obvious code markers only
 * - max length threshold to avoid extremely large code blocks (e.g. > 3000 chars)
 */
function isMediumCandidate(r) {
  if (!r || r.type !== "textnode") return false;
  if (!r.file || !r.file.endsWith(".astro")) return false;
  if (!r.value || typeof r.value !== "string") return false;
  const val = r.value.trim();
  if (val.length < 20) return false; // avoid very short items
  if (val.length > 3000) return false; // skip ridiculously large contents (avoid entire files)
  // multi-line or longer than 60 chars
  if (!(val.includes("\n") || val.length > 60)) return false;
  // avoid obvious code-likes
  if (/{.*\}|\$\{.*\}|<%|\/\/|\/\*|\*\/|import\s+|export\s+|function\s+/i.test(val)) return false;
  // must contain at least some letters
  if (!/[\p{L}]/u.test(val)) return false;
  return true;
}

/**
 * Generate a suggested key based on file path and the text value.
 */
function generateSuggestedKey(rootDir, filePath, value, existingKeys) {
  const rel = path.relative(rootDir, filePath).replace(/\\/g, "/");
  const parts = rel.split("/").filter(Boolean);
  const suffixParts = parts.slice(-3).map((p) => p.replace(/\.[^/.]+$/, ""));
  // sanitize value: pick first 6 words, lowercase, alphanumeric and underscore
  const words = value
    .replace(/[\n\r]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .map((w) => w.toLowerCase());
  const tail = words.join("_") || "text";
  let baseKey = [...suffixParts, tail].join(".").replace(/[^a-z0-9_.]/gi, "_");
  baseKey = baseKey.replace(/_+/g, "_").replace(/\.+/g, ".");
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
 * Insert new keys into en.ts (before the final closing `};`).
 * It will not duplicate keys already present.
 */
function insertKeysIntoEnTsSync(enPath, entries, dryRun = true) {
  if (!fs.existsSync(enPath)) {
    throw new Error(`English locale file not found at ${enPath}`);
  }
  const content = fs.readFileSync(enPath, "utf8");
  const closing = "};";
  const idx = content.lastIndexOf(closing);
  if (idx === -1) {
    throw new Error("Could not find closing `};` in en.ts");
  }

  // detect existing keys
  const existing = new Set();
  const keyRegex = /["']([\w\.\-:]+)["']\s*:/g;
  let m;
  while ((m = keyRegex.exec(content))) {
    existing.add(m[1]);
  }

  const toAdd = entries.filter((e) => !existing.has(e.key));
  if (toAdd.length === 0) {
    return { changed: false, added: 0 };
  }

  const blockHeader = `\n  // AUTO-GENERATED (medium) - inserted ${new Date().toISOString()}\n`;
  const lines = toAdd.map((e) => {
    const jsonVal = JSON.stringify(String(e.value));
    return `  ${JSON.stringify(e.key)}: ${jsonVal},`;
  });

  const before = content.slice(0, idx);
  const after = content.slice(idx); // includes closing

  const newContent = before + (before.trim().endsWith(",") ? "\n" : ",\n") + blockHeader + lines.join("\n") + "\n" + after;

  if (!dryRun) {
    fs.writeFileSync(enPath, newContent, "utf8");
  }

  return { changed: true, added: toAdd.length };
}

/**
 * Insert MT placeholders into other locale files (only for keys that don't exist).
 */
function insertPlaceholdersIntoLocalesSync(localesDir, additions, dryRun = true, languages = []) {
  // if languages provided, map to files else pick all .ts files
  const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".ts"));
  const selected = files.filter((f) => {
    if (!languages || languages.length === 0) return true;
    const lang = f.replace(/\.ts$/, "");
    return languages.includes(lang);
  });

  const results = [];
  selected.forEach((file) => {
    const full = path.join(localesDir, file);
    const content = fs.readFileSync(full, "utf8");
    // find existing keys
    const existing = new Set();
    const keyRegex = /["']([\w\.\-:]+)["']\s*:/g;
    let m;
    while ((m = keyRegex.exec(content))) {
      existing.add(m[1]);
    }

    const toAdd = additions.filter((a) => !existing.has(a.key));
    if (toAdd.length === 0) {
      results.push({ file, added: 0 });
      return;
    }

    const closing = "};";
    const idx = content.lastIndexOf(closing);
    if (idx === -1) {
      results.push({ file, added: 0, error: "no-closing" });
      return;
    }

    const blockHeader = `\n  // AUTO-TRANSLATED (MT) placeholders - inserted ${new Date().toISOString()}\n`;
    const lines = toAdd.map((e) => {
      const placeholder = `MT: ${e.value}`;
      return `  ${JSON.stringify(e.key)}: ${JSON.stringify(placeholder)},`;
    });

    const before = content.slice(0, idx);
    const after = content.slice(idx);
    const newContent = before + (before.trim().endsWith(",") ? "\n" : ",\n") + blockHeader + lines.join("\n") + "\n" + after;

    if (!dryRun) {
      fs.writeFileSync(full, newContent, "utf8");
    }

    results.push({ file, added: toAdd.length });
  });

  return results;
}

/**
 * Replace the first matching text node occurrence in the body with t("key").
 * This supports multi-line matches and is conservative.
 */
function replaceFirstTextNodeInBody(body, value, key) {
  // build a regex that matches > ...value... < with whitespace tolerant, dotAll
  const v = value.trim();
  const esc = escapeRegExp(v);
  const pattern = new RegExp(`>\\s*(${esc})\\s*<`, "s");
  const m = pattern.exec(body);
  if (m) {
    const replaced = body.replace(pattern, `>{t("${key}")}<`);
    return { replaced, count: 1 };
  }
  // fallback: try a trimmed value (collapse multiple spaces/newlines)
  const collapsed = v.replace(/\s+/g, "\\s+");
  const pattern2 = new RegExp(`>\\s*(${collapsed})\\s*<`, "si");
  const m2 = pattern2.exec(body);
  if (m2) {
    const replaced = body.replace(pattern2, `>{t("${key}")}<`);
    return { replaced, count: 1 };
  }
  return { replaced: body, count: 0 };
}

/**
 * Create a unique backup folder.
 */
async function ensureBackupDir() {
  const ts = String(Date.now());
  const dir = path.join(BACKUP_BASE, ts);
  await mkdir(dir, { recursive: true });
  return dir;
}

/**
 * High-level processing:
 * - Load report
 * - Filter medium candidates
 * - For slice (offset/batch): plan insertion keys and replacements
 * - Dry-run: print planned replacements
 * - Apply: write en.ts, write placeholders to other locales, perform replacements in files (backups).
 */
(async function main() {
  try {
    const args = parseArgs();
    const reportPath = path.resolve(ROOT, args.report || DEFAULT_REPORT);
    const batch = parseInt(args.batch || "50", 10);
    const offset = parseInt(args.offset || "0", 10);
    const doApply = args.apply === "true" || args.apply === true || args.apply === "1";
    const doTranslate = args.translate === "true" || args.translate === true || args.translate === "1";
    const commitAfter = args.commit === "true" || args.commit === true || args.commit === "1";
    const localesArg = args.locales || "";
    const languages = localesArg ? String(localesArg).split(",").map((s) => s.trim()) : DEFAULT_LANG_LIST;

    if (!fileExistsSync(reportPath)) {
      console.error("Scan report not found at", reportPath);
      process.exit(1);
    }

    const rawReport = JSON.parse(fs.readFileSync(reportPath, "utf8"));
    const results = Array.isArray(rawReport.results) ? rawReport.results : [];

    const candidates = results.filter(isMediumCandidate);
    if (candidates.length === 0) {
      console.log("No medium candidates found in report. Nothing to do.");
      process.exit(0);
    }

    const slice = candidates.slice(offset, offset + batch);
    console.log(`Medium-safety apply (dry-run by default)`);
    console.log(`Report: ${reportPath}`);
    console.log(`Total candidates: ${candidates.length}`);
    console.log(`Processing slice offset=${offset} batch=${batch} -> ${slice.length} items`);
    console.log(`Apply mode: ${doApply ? "WRITE (backups will be created)" : "DRY-RUN (no files changed)"}`);
    console.log(`Populate other locales: ${doTranslate ? "YES" : "NO"}`);
    console.log(`Target languages for placeholders: ${languages.join(", ")}`);
    console.log("");

    // prepare existing keys set by scanning en.ts
    const existingKeys = new Set();
    if (fileExistsSync(EN_LOCALE)) {
      const enContent = fs.readFileSync(EN_LOCALE, "utf8");
      const keyRegex = /["']([\w\.\-:]+)["']\s*:/g;
      let m;
      while ((m = keyRegex.exec(enContent))) {
        existingKeys.add(m[1]);
      }
    }

    // Prepare additions
    const additions = [];
    const replacementsByFile = new Map();

    for (const r of slice) {
      const fileRel = path.relative(ROOT, path.resolve(ROOT, r.file));
      const absPath = path.join(ROOT, r.file);
      const key = generateSuggestedKey(ROOT, absPath, r.value, existingKeys);
      additions.push({ key, value: r.value, file: r.file });
      if (!replacementsByFile.has(r.file)) replacementsByFile.set(r.file, []);
      replacementsByFile.get(r.file).push({ candidate: r, key });
    }

    // Dry-run: list planned replacements
    console.log("Planned replacements (preview):");
    let idx = 0;
    for (const a of additions) {
      idx++;
      const short = a.value.length > 120 ? a.value.slice(0, 117) + "..." : a.value;
      console.log(`${idx}. ${a.file} -> "${short}"  => ${a.key}`);
    }
    console.log("");

    if (!doApply) {
      console.log("DRY-RUN complete. No files were modified.");
      console.log("To apply these changes re-run with --apply --translate (optional).");
      process.exit(0);
    }

    // Apply flow
    const backupDir = await ensureBackupDir();
    console.log("Applying changes. Backups will be created under:", backupDir);

    // 1) Insert into en.ts
    const enAddResult = insertKeysIntoEnTsSync(EN_LOCALE, additions, false);
    console.log(`English locale updated: added keys = ${enAddResult.added || 0}`);

    // 2) Insert placeholders into other locales (if requested)
    if (doTranslate) {
      const localeResults = insertPlaceholdersIntoLocalesSync(LOCALES_DIR, additions, false, languages);
      localeResults.forEach((r) => {
        if (r.error) {
          console.warn(`Locale ${r.file}: skipped due to ${r.error}`);
        } else {
          console.log(`Locale ${r.file}: added ${r.added} placeholders`);
        }
      });
    } else {
      console.log("Skipping automatic population of other locales (--translate not set).");
    }

    // 3) Replace occurrences in files (only body, first match per candidate)
    const modifiedFiles = [];
    for (const [relPath, list] of replacementsByFile.entries()) {
      const abs = path.join(ROOT, relPath);
      if (!(await fileExists(abs))) {
        console.warn(`File missing (skip): ${relPath}`);
        continue;
      }
      const raw = await readFile(abs, "utf8");
      const { frontmatter, body } = splitFrontmatter(raw);
      const scriptRanges = findScriptBlocks(body);
      let updatedBody = body;
      let anyReplaced = 0;

      for (const item of list) {
        const cand = item.candidate;
        const key = item.key;
        // find safe matches not inside scripts
        const v = cand.value.trim();
        const esc = escapeRegExp(v);
        const pattern = new RegExp(`>\\s*(${esc})\\s*<`, "s");
        const m = pattern.exec(updatedBody);
        if (m) {
          const valueStartIndex = m.index + m[0].indexOf(m[1]);
          if (indexInsideRanges(valueStartIndex, scriptRanges)) {
            // skip if inside script block
            continue;
          }
          const result = replaceFirstTextNodeInBody(updatedBody, v, key);
          if (result.count > 0) {
            updatedBody = result.replaced;
            anyReplaced += result.count;
          }
        } else {
          // attempt looser match: collapse whitespace
          const collapsed = v.replace(/\s+/g, "\\s+");
          const pattern2 = new RegExp(`>\\s*(${collapsed})\\s*<`, "si");
          const m2 = pattern2.exec(updatedBody);
          if (m2) {
            const valueStartIndex = m2.index + m2[0].indexOf(m2[1]);
            if (indexInsideRanges(valueStartIndex, scriptRanges)) {
              continue;
            }
            const result = replaceFirstTextNodeInBody(updatedBody, v, key);
            if (result.count > 0) {
              updatedBody = result.replaced;
              anyReplaced += result.count;
            }
          } else {
            // no match found; skip
            continue;
          }
        }
      }

      if (anyReplaced > 0) {
        // write backup and file
        const backupPath = path.join(backupDir, relPath);
        const backupDirPath = path.dirname(backupPath);
        fs.mkdirSync(backupDirPath, { recursive: true });
        fs.writeFileSync(backupPath, raw, "utf8");

        // write new content
        const newContent = (frontmatter ? frontmatter : "") + updatedBody;
        fs.writeFileSync(abs, newContent, "utf8");
        modifiedFiles.push({ file: relPath, replacements: anyReplaced, backup: backupPath });
        console.log(`Modified ${relPath}: replacements=${anyReplaced} backup=${backupPath}`);
      }
    }

    // 4) Optionally commit the changes (if user asked)
    if (commitAfter) {
      try {
        child_process.execSync("git add -A", { cwd: ROOT, stdio: "inherit" });
        const commitMsg = `i18n(auto-medium): apply batch ${offset}..${offset + slice.length - 1}`;
        child_process.execSync(`git commit -m "${commitMsg}" --no-verify`, { cwd: ROOT, stdio: "inherit" });
        console.log("Committed changes to git.");
      } catch (err) {
        console.warn("Git commit failed or was skipped:", err && err.message ? err.message : err);
      }
    }

    console.log("");
    console.log("Apply complete.");
    console.log(`Backups are under ${backupDir}`);
    console.log(`Files modified: ${modifiedFiles.length}`);
    modifiedFiles.forEach((f) => {
      console.log(` - ${f.file}: ${f.replacements} replacement(s), backup: ${f.backup}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err && err.message ? err.message : String(err));
    process.exit(1);
  }
})();
