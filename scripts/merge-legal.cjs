#!/usr/bin/env node
/**
 * merge-legal.cjs
 *
 * CommonJS script to:
 *  - Backup main locale files to `backups/locales/<filename>.bak.ts`
 *  - Merge keys from `*.legal.ts` into corresponding main `*.ts` files
 *    (only keys starting with pages.privacy., pages.imprint., pages.legal.)
 *  - Overwrite duplicates with values from the legal file
 *  - Write merged main files back to disk
 *  - Print a short summary and a simple line-by-line diff for each changed file
 *
 * Usage:
 *   node scripts/merge-legal.cjs
 *
 * Notes:
 *  - Run this from the project root (where `src` is located).
 *  - The script parses the object literal from `export default { ... }` and
 *    evaluates it in a sandboxed VM to safely get the object.
 *
 * Caution:
 *  - The stringify step emits keys in sorted order for determinism; the output
 *    formatting will differ from the original file even if the content is
 *    semantically the same.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const LOCALES_DIR = path.join(ROOT, "src", "i18n", "locales");
const BACKUP_DIR = path.join(ROOT, "backups", "locales");

function log(...args) {
  console.log("[merge-legal]", ...args);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function listLegalFiles() {
  if (!fs.existsSync(LOCALES_DIR)) {
    throw new Error(`Locales directory not found: ${LOCALES_DIR}`);
  }
  return fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith(".legal.ts"));
}

/**
 * Find the object literal after `export default` and return it as a JS object.
 * This function is tolerant to braces that appear inside strings or comments.
 *
 * Enhancement: If the file contains default imports that point to `*.legal` modules
 * (e.g. `import esLegal from "./es.legal";`) we will attempt to load and parse those
 * legal files and provide the imported variable(s) in the VM context so spread
 * expressions like `...esLegal` evaluate successfully.
 *
 * The function accepts an optional `seenFiles` Set to avoid infinite recursion when
 * resolving imported legal files.
 */
function parseExportDefaultObject(tsContent, filePath, seenFiles = new Set()) {
  const exportIndex = tsContent.indexOf("export default");
  if (exportIndex === -1) {
    throw new Error(`No "export default" found in ${filePath}`);
  }

  // Find the opening brace for the object literal
  let i = tsContent.indexOf("{", exportIndex);
  if (i === -1) {
    throw new Error(`No opening "{" found after export default in ${filePath}`);
  }

  // Scan to find the matching closing brace while respecting strings and comments
  let depth = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let escape = false;
  let inLineComment = false;
  let inBlockComment = false;
  let endIndex = -1;

  for (let idx = i; idx < tsContent.length; idx++) {
    const ch = tsContent[idx];
    const prev = tsContent[idx - 1];

    // Handle comment states
    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
      }
      continue;
    }
    if (inBlockComment) {
      if (prev === "*" && ch === "/") {
        inBlockComment = false;
      }
      continue;
    }

    // Start of comments (only if not in a string)
    if (!inSingleQuote && !inDoubleQuote && !inBacktick) {
      if (ch === "/" && tsContent[idx + 1] === "/") {
        inLineComment = true;
        idx++; // skip next char
        continue;
      }
      if (ch === "/" && tsContent[idx + 1] === "*") {
        inBlockComment = true;
        idx++; // skip next char
        continue;
      }
    }

    // String handling
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      // Enter escape mode but only if inside a string
      if (inSingleQuote || inDoubleQuote || inBacktick) {
        escape = true;
        continue;
      } else {
        // backslash outside strings is harmless
        continue;
      }
    }
    if (!inSingleQuote && !inDoubleQuote && ch === "`") {
      inBacktick = !inBacktick;
      continue;
    }
    if (!inSingleQuote && !inBacktick && ch === '"') {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }
    if (!inDoubleQuote && !inBacktick && ch === "'") {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    // If inside a string, skip brace counting
    if (inSingleQuote || inDoubleQuote || inBacktick) {
      continue;
    }

    // Count braces
    if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        endIndex = idx;
        break;
      }
    }
  }

  if (endIndex === -1) {
    throw new Error(`Could not find matching closing "}" in ${filePath}`);
  }

  const objectText = tsContent.slice(i, endIndex + 1);
  const code = "(" + objectText + ")";

  // Prepare a context object that includes any imported legal objects referenced
  const contextVars = {};

  try {
    // Look for default imports that reference .legal modules above export default.
    // Examples:
    //   import esLegal from "./es.legal";
    //   import someLegal from "../locales/pt.legal";
    // We support paths with or without the .ts extension in the import.
    const importRegex = /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"](.+?\.legal(?:\.ts)?)['"]/g;
    const fileDir = path.dirname(filePath);
    let match;
    while ((match = importRegex.exec(tsContent)) !== null) {
      const importName = match[1];
      let importPathRaw = match[2];

      // Resolve to an absolute file path, try as given and also with .ts if missing
      let candidate = path.resolve(fileDir, importPathRaw);
      if (!candidate.endsWith(".ts")) {
        // if the import used "./es.legal" (no .ts), try adding .ts
        const withTs = candidate + ".ts";
        if (fs.existsSync(withTs)) candidate = withTs;
      }
      if (!fs.existsSync(candidate)) {
        // If the path doesn't exist, attempt to append ".ts" to the raw import and resolve again
        const alt = path.resolve(fileDir, importPathRaw + ".ts");
        if (fs.existsSync(alt)) candidate = alt;
      }

      if (fs.existsSync(candidate)) {
        const resolved = candidate;
        // Prevent potential recursion loops
        if (!seenFiles.has(resolved)) {
          try {
            seenFiles.add(resolved);
            const impContent = fs.readFileSync(resolved, "utf8");
            // Parse the legal file's export default object. Pass along seenFiles to avoid recursion.
            const impObj = parseExportDefaultObject(impContent, resolved, seenFiles);
            contextVars[importName] = impObj;
          } catch (e) {
            // If parsing the imported legal file fails, continue without providing the variable.
            // The VM will then error in a controlled way if the variable is required.
            // Log the problem for visibility.
            // We do not throw here to allow best-effort parsing of main files that don't strictly need the import.
            // (Higher-level code will handle failures.)
            // eslint-disable-next-line no-console
            console.warn(
              `[parseExportDefaultObject] Warning: could not load imported legal file ${candidate}: ${e.message}`
            );
          }
        }
      }
    }

    // Create VM context populated with any imported legal objects
    const script = new vm.Script(code, { filename: filePath });
    const context = vm.createContext(contextVars);
    const result = script.runInContext(context, { timeout: 2000 });
    if (typeof result !== "object" || result === null) {
      throw new Error("Parsed export is not an object");
    }
    return result;
  } catch (err) {
    throw new Error(`Failed to parse object in ${filePath}: ${err.message}`);
  }
}

function stableStringifyObject(obj) {
  const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
  const lines = [];
  for (const k of keys) {
    const v = obj[k];
    // Ensure undefined values are written as null (unlikely) to avoid invalid JSON
    const safe = typeof v === "undefined" ? null : v;
    lines.push(`  ${JSON.stringify(k)}: ${JSON.stringify(safe)},`);
  }
  return "export default {\n" + lines.join("\n") + "\n};\n";
}

function simpleLineDiff(a, b) {
  const linesA = a.split(/\r?\n/);
  const linesB = b.split(/\r?\n/);
  const maxLen = Math.max(linesA.length, linesB.length);
  const out = [];
  for (let i = 0; i < maxLen; i++) {
    const la = linesA[i];
    const lb = linesB[i];
    if (la === lb) {
      out.push("  " + (la === undefined ? "" : la));
    } else {
      if (la !== undefined) out.push("- " + la);
      if (lb !== undefined) out.push("+ " + lb);
    }
  }
  return out.join("\n");
}

function run() {
  try {
    ensureDir(BACKUP_DIR);
    const legalFiles = listLegalFiles();
    if (legalFiles.length === 0) {
      log("No .legal.ts files found in", LOCALES_DIR);
      return;
    }

    const changedFiles = [];

    for (const legalFile of legalFiles) {
      const legalPath = path.join(LOCALES_DIR, legalFile);
      const baseName = legalFile.replace(/\.legal\.ts$/, "");
      const mainFile = baseName + ".ts";
      const mainPath = path.join(LOCALES_DIR, mainFile);

      if (!fs.existsSync(mainPath)) {
        log(`Main locale file not found for ${legalFile}: expected ${mainFile}. Skipping.`);
        continue;
      }

      log(`Processing pair: ${mainFile} ← ${legalFile}`);

      const mainContent = fs.readFileSync(mainPath, "utf8");
      const legalContent = fs.readFileSync(legalPath, "utf8");

      let mainObj, legalObj;
      try {
        mainObj = parseExportDefaultObject(mainContent, mainPath);
      } catch (err) {
        log(`Error parsing main file ${mainFile}: ${err.message}. Skipping this file.`);
        continue;
      }
      try {
        legalObj = parseExportDefaultObject(legalContent, legalPath);
      } catch (err) {
        log(`Error parsing legal file ${legalFile}: ${err.message}. Skipping this file.`);
        continue;
      }

      // Filter legal keys we want to merge
      const legalKeys = Object.keys(legalObj).filter(
        (k) =>
          k.startsWith("pages.privacy.") ||
          k.startsWith("pages.imprint.") ||
          k.startsWith("pages.legal.")
      );

      if (legalKeys.length === 0) {
        log(`No legal keys (pages.privacy/imprint/legal) found in ${legalFile}. Skipping.`);
        continue;
      }

      // Create backup
      const backupPath = path.join(BACKUP_DIR, mainFile + ".bak.ts");
      fs.copyFileSync(mainPath, backupPath);

      // Merge: overwrite mainObj keys with legal values
      for (const k of legalKeys) {
        mainObj[k] = legalObj[k];
      }

      // Re-stringify and write back main file
      const newMainContent = stableStringifyObject(mainObj);
      if (newMainContent === mainContent) {
        log(`No changes required for ${mainFile} (content identical after merge).`);
        try {
          fs.unlinkSync(backupPath);
        } catch (e) {
          // ignore
        }
        continue;
      }
      fs.writeFileSync(mainPath, newMainContent, "utf8");
      changedFiles.push({ mainPath, backupPath });
      log(`Merged ${legalKeys.length} keys into ${mainFile} and created backup at ${backupPath}`);
    }

    // Summary
    if (changedFiles.length === 0) {
      log("No files were changed.");
      return;
    }

    log("\nSummary of changed files:");
    for (const f of changedFiles) {
      console.log("-", path.relative(ROOT, f.mainPath));
    }

    // Show diffs
    log("\nDiffs (naive line-by-line):\n");
    for (const f of changedFiles) {
      const before = fs.readFileSync(f.backupPath, "utf8");
      const after = fs.readFileSync(f.mainPath, "utf8");
      console.log("---", path.relative(ROOT, f.backupPath));
      console.log("+++", path.relative(ROOT, f.mainPath));
      console.log(simpleLineDiff(before, after));
      console.log("\n");
    }

    log("Done. Backups are in:", BACKUP_DIR);
    log("If everything looks good, you can commit the updated locale files.");
  } catch (err) {
    console.error("[merge-legal] Fatal error:", err && err.stack ? err.stack : err);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  run();
}
