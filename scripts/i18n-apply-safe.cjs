#!/usr/bin/env node
/**
 * melody-mind/scripts/i18n-apply-safe.cjs
 *
 * Safe i18n apply (dry-run by default)
 *
 * Purpose:
 * - Applies i18n replacements only for HTML text nodes inside .astro body (NOT frontmatter or <script> blocks).
 * - Conservative: only replaces occurrences that match `> ...value... <` patterns (text between tags).
 * - Uses a previously generated `i18n-scan-report.json` (same format produced by scripts/i18n-scan.cjs).
 * - Default mode is a dry-run: shows planned replacements without modifying files.
 * - Use --apply to actually write changes. Backups are created before writing.
 *
 * Usage:
 *   node scripts/i18n-apply-safe.cjs [--report path] [--batch N] [--offset M] [--apply]
 *
 * Examples:
 *   # Dry run first 50 suggestions:
 *   node scripts/i18n-apply-safe.cjs --report i18n-scan-report.json --batch 50
 *
 *   # Apply batch 0..49:
 *   node scripts/i18n-apply-safe.cjs --report i18n-scan-report.json --batch 50 --offset 0 --apply
 *
 * Notes:
 * - This script intentionally errs on the side of caution. It will not touch .ts/.js files
 *   and will not replace anything inside frontmatter or inside <script>...</script> blocks.
 * - Always review dry-run output before using --apply.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_REPORT = path.join(ROOT, "i18n-scan-report.json");
const BACKUP_DIR_BASE = path.join(ROOT, ".i18n-backups-safe");

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
  } catch {
    return false;
  }
}

function readJsonSync(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits an .astro file into frontmatter and body.
 * Frontmatter is the first top-of-file block delimited by `---` on its own line.
 * Returns { frontmatter, body, frontmatterRange: {start, end} } where indices are 0-based.
 */
function splitFrontmatter(content) {
  // Look for a frontmatter block at the very start
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
 * Returns an array of script block ranges in the provided HTML/body content.
 * Each range: { start, end }
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

/**
 * Check if an index (offset inside body) is inside any of the provided ranges.
 */
function indexInsideRanges(index, ranges) {
  for (const r of ranges) {
    if (index >= r.start && index < r.end) return true;
  }
  return false;
}

/**
 * Conservative search for text nodes in body: find occurrences where the value appears
 * between closing and opening tag tokens, e.g. `>  Some text  <`
 *
 * Returns an array of match objects: { index, match, beforeSnippet, afterSnippet }
 *
 * Only returns matches that are NOT inside script blocks.
 */
function findTextNodeMatches(body, value, maxContext = 80) {
  const results = [];
  if (!value || typeof value !== "string") return results;
  const valEsc = escapeRegExp(value.trim());
  // Match > ...value... <
  const pattern = new RegExp(`>\\s*(${valEsc})\\s*<`, "g");
  let m;
  const scriptRanges = findScriptBlocks(body);
  while ((m = pattern.exec(body))) {
    const matchIndex = m.index;
    // ensure the captured group's index (start of the value) is not inside a script block
    // compute start of captured group:
    const fullMatch = m[0];
    const beforeLen = fullMatch.indexOf(m[1]);
    const valueStart = matchIndex + beforeLen;
    if (indexInsideRanges(valueStart, scriptRanges)) {
      continue;
    }
    const beforeSnippet = body.slice(Math.max(0, matchIndex - maxContext), matchIndex).replace(/\n/g, "\\n");
    const afterSnippet = body.slice(matchIndex, Math.min(body.length, matchIndex + fullMatch.length + maxContext)).replace(/\n/g, "\\n");
    results.push({ index: matchIndex, match: fullMatch, value: m[1], beforeSnippet, afterSnippet, length: m[1].length });
  }
  return results;
}

/**
 * Replace only the first exact `> ...value... <` occurrence in body with `>{t("key")}<`.
 * Returns { newBody, replaced }.
 */
function replaceFirstTextNodeOccurrence(body, value, key) {
  const valEsc = escapeRegExp(value.trim());
  const pattern = new RegExp(`>\\s*(${valEsc})\\s*<`, "g");
  let replaced = 0;
  const newBody = body.replace(pattern, function (m, g1) {
    if (replaced === 0) {
      replaced++;
      return `>{t("${key}")}<`;
    }
    return m;
  });
  return { newBody, replaced };
}

function ensureDir(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function writeBackupAndFile(absPath, newContent, backupBase) {
  const rel = path.relative(ROOT, absPath);
  const backupPath = path.join(backupBase, rel);
  ensureDir(path.dirname(backupPath));
  fs.writeFileSync(backupPath, fs.readFileSync(absPath, "utf8"), "utf8");
  ensureDir(path.dirname(absPath));
  fs.writeFileSync(absPath, newContent, "utf8");
  return backupPath;
}

function summaryLine(tr) {
  return `${tr.file}:${tr.line} -> "${tr.value.length > 60 ? tr.value.slice(0, 57) + '...' : tr.value}" => ${tr.key}`;
}

function exitWith(msg, code = 0) {
  if (msg) console.log(msg);
  process.exit(code);
}

// -------------------- Main --------------------

(function main() {
  const args = parseArgs();
  const reportPath = path.resolve(ROOT, args.report || DEFAULT_REPORT);
  const batch = parseInt(args.batch || "50", 10);
  const offset = parseInt(args.offset || "0", 10);
  const doApply = args.apply === "true" || args.apply === true || args.apply === "1";
  const backupBase = path.join(BACKUP_DIR_BASE, String(Date.now()));

  if (!fileExistsSync(reportPath)) {
    console.error(`Scan report not found at ${reportPath}`);
    process.exit(2);
  }

  let report;
  try {
    report = readJsonSync(reportPath);
  } catch (err) {
    console.error(`Failed to read or parse report: ${err.message}`);
    process.exit(3);
  }

  const results = Array.isArray(report.results) ? report.results : [];
  if (results.length === 0) {
    exitWith("No suggestions found in the scan report. Nothing to do.", 0);
  }

  // Filter for conservative candidates:
  // - type 'textnode'
  // - file ends with .astro
  // - short single-line values (no newline), <= 80 chars
  // - value contains at least one letter (avoid emojis only)
  const candidates = results.filter((r) => {
    if (!r || r.type !== "textnode") return false;
    if (!r.file || !r.file.endsWith(".astro")) return false;
    if (!r.value || typeof r.value !== "string") return false;
    if (r.value.includes("\n")) return false;
    const trimmed = r.value.trim();
    if (trimmed.length === 0 || trimmed.length > 80) return false;
    if (!/[\p{L}0-9]/u.test(trimmed)) return false;
    return true;
  });

  if (candidates.length === 0) {
    exitWith("No suitable .astro textnode candidates found for safe replacement.", 0);
  }

  const slice = candidates.slice(offset, offset + batch);
  console.log(`Safe i18n apply (dry-run default). Report: ${reportPath}`);
  console.log(`Total candidates in report: ${results.length}`);
  console.log(`Filtered safe candidates: ${candidates.length}`);
  console.log(`Processing slice: offset=${offset} batch=${batch} -> ${slice.length} items`);
  console.log(`Apply mode: ${doApply ? "WRITE (backups will be created)" : "DRY-RUN (no files modified)"}`);
  console.log("");

  const planned = [];
  const filesToModify = new Map();

  for (const r of slice) {
    const rel = r.file;
    const abs = path.join(ROOT, rel);
    if (!fileExistsSync(abs)) {
      console.warn(`File not found: ${rel} (skipping)`);
      continue;
    }
    // Read file and split frontmatter/body
    const raw = fs.readFileSync(abs, "utf8");
    const { frontmatter, body, frontmatterRange } = splitFrontmatter(raw);
    // Search matches in body
    const matches = findTextNodeMatches(body, r.value);
    if (!matches || matches.length === 0) {
      // No safe match found in body; skip
      // (we do not log as error to avoid noise)
      continue;
    }
    // For safety, only replace the first match found in body for this candidate
    const chosen = matches[0];
    // Build preview: show small context (beforeSnippet/afterSnippet)
    planned.push({
      file: rel,
      abs,
      line: r.line || chosen.line || null,
      value: r.value,
      key: r.suggestedKey || r.suggested_replacement || `auto.${path.basename(rel).replace(/\.[^.]+$/, "")}.${r.line || "n"}`,
      contextBefore: chosen.beforeSnippet,
      contextAfter: chosen.afterSnippet,
    });

    // Prepare file modification data
    if (!filesToModify.has(rel)) {
      filesToModify.set(rel, { abs, raw, frontmatter, body, replacements: [] });
    }
    filesToModify.get(rel).replacements.push({ value: r.value, key: r.suggestedKey });
  }

  if (planned.length === 0) {
    exitWith("No safe replacements planned after scanning candidates (nothing to do).", 0);
  }

  console.log("Planned replacements (preview):");
  planned.forEach((p, i) => {
    console.log(`${i + 1}. ${summaryLine(p)}`);
    console.log(`   context before: ...${p.contextBefore}...`);
    console.log(`   context after:  ...${p.contextAfter}...`);
  });

  console.log("");
  console.log(`Files with planned modifications: ${filesToModify.size}`);
  for (const [rel, info] of filesToModify.entries()) {
    console.log(` - ${rel}: ${info.replacements.length} replacement(s)`);
  }

  if (!doApply) {
    console.log("");
    console.log("DRY-RUN complete. No files were modified.");
    console.log(`To apply these changes, re-run with --apply. Backups will be written under ${BACKUP_DIR_BASE}/<timestamp>/`);
    process.exit(0);
  }

  // Apply changes (write files) with backups
  ensureDir(BACKUP_DIR_BASE);
  ensureDir(backupBase); // NOTE: backupBase was defined earlier if apply true; ensureDir here to be safe
  const applied = [];
  for (const [rel, info] of filesToModify.entries()) {
    const absPath = info.abs;
    let newRaw = info.raw;
    // We need to replace inside body only. Compute split again to be safe.
    const split = splitFrontmatter(newRaw);
    const pre = split.frontmatter ? newRaw.slice(0, split.frontmatter.length) : "";
    const bodyContent = split.frontmatter ? newRaw.slice(split.frontmatter.length) : newRaw;
    let updatedBody = bodyContent;
    let anyReplacedForFile = 0;

    for (const rep of info.replacements) {
      const { value, key } = rep;
      const { newBody, replaced } = replaceFirstTextNodeOccurrence(updatedBody, value, key);
      if (replaced && replaced > 0) {
        updatedBody = newBody;
        anyReplacedForFile += replaced;
      } else {
        // If the first attempt failed (maybe whitespace differences), try a permissive match trimmed
        const trimmedVal = value.trim();
        if (trimmedVal !== value) {
          const rr = replaceFirstTextNodeOccurrence(updatedBody, trimmedVal, key);
          if (rr.replaced && rr.replaced > 0) {
            updatedBody = rr.newBody;
            anyReplacedForFile += rr.replaced;
            continue;
          }
        }
        console.warn(`Could not replace '${value}' in ${rel} using safe pattern (skipping this occurrence).`);
      }
    }

    if (anyReplacedForFile > 0) {
      const finalContent = pre + updatedBody;
      // backup original and write new content
      ensureDir(path.join(BACKUP_DIR_BASE, String(Date.now()), path.dirname(rel)));
      const finalBackupBase = path.join(BACKUP_DIR_BASE, String(Date.now()));
      try {
        const backupPath = writeBackupAndFile(absPath, finalContent, finalBackupBase);
        applied.push({ file: rel, backups: backupPath, replacements: info.replacements.length });
        console.log(`Applied ${anyReplacedForFile} replacements in ${rel}. Backup: ${backupPath}`);
      } catch (err) {
        console.error(`Failed to write modified file ${rel}: ${err.message}`);
      }
    } else {
      console.log(`No safe replacements performed in ${rel}.`);
    }
  }

  console.log("");
  console.log("Apply complete.");
  console.log(`Backups are stored under ${BACKUP_DIR_BASE}/<timestamp>/`);
  console.log(`Files modified: ${applied.length}`);
  applied.forEach((a) => {
    console.log(` - ${a.file}: ${a.replacements} replacement(s), backup: ${a.backups}`);
  });

  process.exit(0);
})();
