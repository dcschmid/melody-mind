#!/usr/bin/env node
/**
 * generate-i18n-template-from-usage.ts
 *
 * Purpose:
 * - Walk the project tree and extract all used translation keys (usage-based).
 * - Produce a clean `template.ts` file (canonical key list) containing the union of used keys.
 * - Preserve existing translations from an existing `template.ts` where possible.
 *
 * Behavior:
 * - Scans files with configurable extensions for common translation usage patterns.
 * - Supports patterns like: t('key'), t("key"), i18n.t('key'), $t('key'), translate('key'), useTranslation('key') usages,
 *   and JSX/HTML attributes like data-i18n="key" or <T k="key" />.
 * - Skips specified directories (node_modules, .git, dist, public, build).
 * - Writes output to `src/i18n/locales/template.ts` by default and creates a `.bak` backup if an existing file is present.
 *
 * Usage examples:
 *   ts-node melody-mind/scripts/generate-i18n-template-from-usage.ts
 *   node ./dist/scripts/generate-i18n-template-from-usage.js --out src/i18n/locales/template.ts --include-auto
 *
 * CLI flags:
 *   --root <dir>         project root to scan (default: process.cwd())
 *   --out <file>         output template path (default: src/i18n/locales/template.ts)
 *   --dry-run            don't write file, only print summary
 *   --include-auto       include keys that start with `auto.` (by default excluded)
 *   --extensions <list>  comma-separated extensions to scan (default: ts,tsx,js,jsx,astro,vue,md,mdx)
 *
 * Note:
 * - This script is best-effort; it cannot statically guarantee every dynamic usage is captured.
 * - Run it locally in the repository root.
 */

import fsSync from "fs";
import fs from "fs/promises";
import path from "path";

type Options = {
  rootDir: string;
  outPath: string;
  dryRun: boolean;
  includeAuto: boolean;
  exts: string[];
  verbose: boolean;
};

const DEFAULT_OUT = "src/i18n/locales/template.ts";
const DEFAULT_EXTS = ["ts", "tsx", "js", "jsx", "astro", "vue", "md", "mdx", "html", "svelte"];

function parseArgs(): Options {
  const argv = process.argv.slice(2);
  const opts: Partial<Options> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--root":
        opts.rootDir = argv[++i];
        break;
      case "--out":
        opts.outPath = argv[++i];
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "--include-auto":
        opts.includeAuto = true;
        break;
      case "--extensions":
      case "--ext":
        opts.exts = (argv[++i] || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "--verbose":
        opts.verbose = true;
        break;
      default:
        if (a.startsWith("--")) {
          console.warn("Unknown arg:", a);
        }
    }
  }
  return {
    rootDir: path.resolve(opts.rootDir ?? process.cwd()),
    outPath: path.resolve(opts.outPath ?? path.join(process.cwd(), DEFAULT_OUT)),
    dryRun: Boolean(opts.dryRun ?? false),
    includeAuto: Boolean(opts.includeAuto ?? false),
    exts: opts.exts && opts.exts.length > 0 ? opts.exts : DEFAULT_EXTS,
    verbose: Boolean(opts.verbose ?? false),
  };
}

/**
 * Recursively walks a directory collecting file paths with given extensions.
 * Skips node_modules, .git, dist, build, public by default.
 */
async function collectFiles(dir: string, exts: Set<string>): Promise<string[]> {
  const results: string[] = [];
  const skipNames = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    "public",
    "out",
    ".next",
    ".vercel",
  ]);
  async function walk(current: string) {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (skipNames.has(entry.name)) {continue;}
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile()) {
        const ext = entry.name.split(".").pop() || "";
        if (exts.has(ext.toLowerCase())) {
          results.push(full);
        }
      }
    }
  }
  await walk(dir);
  return results;
}

/**
 * Extract translation keys from file text using multiple heuristics / regex patterns
 */
function extractKeysFromText(text: string): Set<string> {
  const keys = new Set<string>();

  // Common function call patterns: t('key'), t("key"), i18n.t('key'), $t('key'), translate('key'), translate("key")
  // Also: i18n.translate('key') etc.
  const funcCallRegexes: RegExp[] = [
    /(?:\b|[^A-Za-z0-9_$])(?:t|_t|\$t|translate|i18n\.t|i18n\.translate)\s*\(\s*['"`]([^'"`]+)['"`]\s*[),]/g,
    /\buseTranslation\(\)\.t\s*\(\s*['"`]([^'"`]+)['"`]\s*[),]/g,
    /\btranslations?\(\s*['"`]([^'"`]+)['"`]\s*[),]/g,
  ];

  // JSX / component prop patterns: <T k="key" />, <Trans i18nKey="key">, data-i18n="key"
  const attrRegexes: RegExp[] = [
    /\b(?:i18nKey|k|key|data-i18n)\s*=\s*['"`]([^'"`]+)['"`]/g,
    /<T\b[^>]*?k\s*=\s*['"`]([^'"`]+)['"`]/g,
    /<Trans\b[^>]*?i18nKey\s*=\s*['"`]([^'"`]+)['"`]/g,
  ];

  // Generic: strings passed to a `t`-like function extracted more loosely (e.g. i18n['some.key'])
  const bracketAccessRegex = /(?:i18n|translations|t)\s*\[\s*['"`]([^'"`]+)['"`]\s*\]/g;

  // Also catch keys appearing in literal attributes or data attributes: data-translate="key"
  const dataAttrRegex = /data-(?:i18n|translate|intl)[\s=]*['"`]?([^'"`\s>]+)['"`]?/g;

  const allRegexes = [...funcCallRegexes, ...attrRegexes, bracketAccessRegex, dataAttrRegex];

  for (const rx of allRegexes) {
    let m: RegExpExecArray | null;
    while ((m = rx.exec(text))) {
      if (m[1]) {
        keys.add(m[1]);
      }
    }
  }

  // Also try to heuristically gather dotted keys in templates like 'error.404.title' used in string literals
  // We try to find string literals that look like translation keys (contain dots and only allowed chars)
  const candidateKeyRegex = /['"`]([a-z0-9_.\-:]+?\.[a-z0-9_.\-:]+?)['"`]/gi;
  let m: RegExpExecArray | null;
  while ((m = candidateKeyRegex.exec(text))) {
    const candidate = m[1];
    // Basic heuristics: must contain a letter and a dot and not be a URL or file path
    if (candidate.includes(".") && !candidate.includes("/") && !candidate.includes("http")) {
      // avoid false positives like version numbers 1.2.3 - require at least one alphabetic char before dot
      if (/[a-zA-Z]/.test(candidate)) {
        keys.add(candidate);
      }
    }
  }

  return keys;
}

/**
 * Read a file and extract keys, with simple file-size safety.
 */
async function extractKeysFromFile(filePath: string): Promise<Set<string>> {
  try {
    const stat = await fs.stat(filePath);
    // Skip huge files (e.g. > 2MB)
    if (stat.size > 2_000_000) {
      return new Set();
    }
    const content = await fs.readFile(filePath, "utf8");
    return extractKeysFromText(content);
  } catch {
    return new Set();
  }
}

/**
 * Read existing template.ts and extract values to preserve translations.
 */
function extractKeysAndValuesFromTemplate(content: string): Record<string, string> {
  const map: Record<string, string> = {};
  // Try to extract the content of export default { ... }
  const m = /export\s+default\s*{([\s\S]*?)}\s*;?\s*$/.exec(content);
  const body = m ? m[1] : content;

  // Match key: value pairs where value is a string (single/double/backtick)
  const kvRegex = /["']([^"']+)["']\s*:\s*(`[\s\S]*?`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")\s*,?/g;
  let mm: RegExpExecArray | null;
  while ((mm = kvRegex.exec(body))) {
    const k = mm[1];
    const raw = mm[2];
    let val = raw;
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1).replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'");
      val = val.replace(/\\\\/g, "\\");
    } else if (val.startsWith("`") && val.endsWith("`")) {
      val = val.slice(1, -1);
    }
    map[k] = val;
  }
  return map;
}

/**
 * Compose the template.ts content with keys sorted, using provided existing values where available.
 */
function composeTemplate(keys: string[], existingValues: Record<string, string>): string {
  const lines: string[] = [];
  lines.push(
    "// THIS FILE IS GENERATED BY melody-mind/scripts/generate-i18n-template-from-usage.ts"
  );
  lines.push("// It lists translation keys that are actually used across the codebase.");
  lines.push(
    "// Keep translations in per-locale files. This template contains canonical keys and default texts."
  );
  lines.push("");
  lines.push("export default {");
  for (const k of keys) {
    const v = existingValues[k] ?? "";
    // Use JSON.stringify to ensure proper escaping
    const serialized = JSON.stringify(v);
    lines.push(`  "${k}": ${serialized},`);
  }
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

/**
 * Main runner
 */
async function main() {
  const opts = parseArgs();
  if (opts.verbose) {
    console.log("Options:", opts);
  }

  // Collect files
  const extsSet = new Set(opts.exts.map((e) => e.replace(/^\./, "").toLowerCase()));
  if (opts.verbose) {
    console.log(`Scanning for extensions: ${Array.from(extsSet).join(", ")}`);
  }

  const files = await collectFiles(opts.rootDir, extsSet);
  if (opts.verbose) {
    console.log(`Collected ${files.length} candidate files`);
  }

  const usedKeys = new Set<string>();
  for (const f of files) {
    // Skip locale files themselves to avoid mixing template keys with usages
    const rel = path.relative(opts.rootDir, f);
    if (rel.startsWith("src/i18n/locales") || rel.includes("/src/i18n/locales/")) {
      continue;
    }
    const keys = await extractKeysFromFile(f);
    for (const k of keys) {
      usedKeys.add(k);
    }
  }

  // Filter out empty and obviously invalid keys
  const filtered = Array.from(usedKeys).filter((k) => typeof k === "string" && k.trim().length > 0);

  // Optionally filter out auto.* keys unless includeAuto is true
  const finalKeys = filtered.filter((k) => {
    if (!opts.includeAuto && k.startsWith("auto.")) {return false;}
    return true;
  });

  finalKeys.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

  // Read existing template to preserve values
  let existingValues: Record<string, string> = {};
  try {
    const old = await fs.readFile(opts.outPath, "utf8");
    existingValues = extractKeysAndValuesFromTemplate(old);
  } catch {
    // If no existing template, we'll use empty strings
    existingValues = {};
  }

  // For any key not present in existingValues, try to find a non-empty value from other locale files (optional)
  // We'll attempt to look up first value in src/i18n/locales/*.ts
  try {
    const localesDir = path.join(opts.rootDir, "src", "i18n", "locales");
    if (fsSync.existsSync(localesDir)) {
      const localeFiles = await fs.readdir(localesDir);
      for (const lf of localeFiles) {
        if (!lf.endsWith(".ts")) {continue;}
        const full = path.join(localesDir, lf);
        try {
          const content = await fs.readFile(full, "utf8");
          const parsed = extractKeysAndValuesFromTemplate(content);
          for (const k of finalKeys) {
            if (!existingValues[k] && parsed[k]) {
              existingValues[k] = parsed[k];
            }
          }
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }

  // Compose final template content
  const tmpl = composeTemplate(finalKeys, existingValues);

  console.log("");
  console.log("i18n template-from-usage summary");
  console.log("================================");
  console.log(`Root scanned: ${opts.rootDir}`);
  console.log(`Files scanned: ${files.length}`);
  console.log(`Unique used keys found: ${usedKeys.size}`);
  console.log(`Final keys written: ${finalKeys.length}`);
  console.log(`Output file: ${opts.outPath}`);
  console.log(`Include auto.* keys: ${opts.includeAuto}`);
  console.log(`Dry run: ${opts.dryRun}`);
  console.log("");

  if (opts.dryRun) {
    console.log("Dry run - file not written. Preview (first 2000 chars):");
    console.log("----------------------------------------------------------------");
    console.log(tmpl.slice(0, 2000));
    console.log("----------------------------------------------------------------");
    return;
  }

  // Backup existing output if present
  try {
    await fs.access(opts.outPath);
    const backupPath = `${opts.outPath}.bak`;
    await fs.copyFile(opts.outPath, backupPath);
    console.log(`Existing template backed up to ${backupPath}`);
  } catch {
    // no existing file, ok
  }

  // Ensure output dir exists
  await fs.mkdir(path.dirname(opts.outPath), { recursive: true });
  await fs.writeFile(opts.outPath, tmpl, "utf8");
  console.log(`Wrote template to ${opts.outPath}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
