#!/usr/bin/env node

/**
 * Code Deduplication Refactoring Script
 *
 * This script identifies and refactors common code duplication patterns
 * across the codebase to use the new centralized utilities.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

// Patterns to replace
const patterns = [
  // DOM Ready Pattern
  {
    name: "DOM Ready Pattern",
    search:
      /if \(document\.readyState === "loading"\) \{\s*document\.addEventListener\("DOMContentLoaded", ([^}]+)\);\s*\} else \{\s*\1\(\);\s*\}/gs,
    replace: "onDOMReady($1);",
    addImport: 'import { onDOMReady } from "../utils/init/domInitUtils";',
  },

  // Console Error Pattern
  {
    name: "Console Error Pattern",
    search: /console\.error\("([^"]+):", ([^)]+)\)/g,
    replace: 'logger.error("$1", $2);',
    addImport: 'import { logger } from "../utils/logging/logger";',
  },

  // Console Warn Pattern
  {
    name: "Console Warn Pattern",
    search: /console\.warn\("([^"]+)"(?:, ([^)]+))?\)/g,
    replace: (match, message, data) => {
      return data
        ? `logger.warn("${message}", undefined, { data: ${data} });`
        : `logger.warn("${message}");`;
    },
    addImport: 'import { logger } from "../utils/logging/logger";',
  },

  // URL Parsing Pattern
  {
    name: "URL Path Parsing",
    search:
      /const pathParts = document\.location\.pathname\.split\("\/"\);\s*const lang = pathParts\[1\];\s*const categoryPart = pathParts\[2\];/g,
    replace: 'const { lang, category } = parseGameRoute() || { lang: "en", category: "unknown" };',
    addImport: 'import { parseGameRoute } from "../utils/routing/urlUtils";',
  },
];

// File extensions to process
const extensions = [".ts", ".tsx", ".astro"];

// Directories to process
const directories = ["src/utils/components", "src/utils/game", "src/pages"];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;
  const imports = new Set();

  patterns.forEach((pattern) => {
    if (typeof pattern.replace === "function") {
      const newContent = content.replace(pattern.search, pattern.replace);
      if (newContent !== content) {
        content = newContent;
        modified = true;
        if (pattern.addImport) {
          imports.add(pattern.addImport);
        }
        console.log(`  ✓ Applied ${pattern.name}`);
      }
    } else {
      if (pattern.search.test(content)) {
        content = content.replace(pattern.search, pattern.replace);
        modified = true;
        if (pattern.addImport) {
          imports.add(pattern.addImport);
        }
        console.log(`  ✓ Applied ${pattern.name}`);
      }
    }
  });

  // Add imports at the top of the file
  if (imports.size > 0) {
    const importStatements = Array.from(imports).join("\n");
    const firstImportMatch = content.match(/^import .+;/m);

    if (firstImportMatch) {
      content = content.replace(firstImportMatch[0], `${importStatements}\n${firstImportMatch[0]}`);
    } else {
      content = `${importStatements}\n\n${content}`;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }

  return false;
}

function walkDirectory(dir) {
  const items = fs.readdirSync(dir);
  const processedFiles = [];

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processedFiles.push(...walkDirectory(fullPath));
    } else if (extensions.some((ext) => item.endsWith(ext))) {
      processedFiles.push(fullPath);
    }
  });

  return processedFiles;
}

function main() {
  console.log("🔄 Starting code deduplication refactoring...\n");

  let totalFilesProcessed = 0;
  let totalFilesModified = 0;

  directories.forEach((dir) => {
    const fullDirPath = path.join(projectRoot, dir);

    if (!fs.existsSync(fullDirPath)) {
      console.log(`⚠️  Directory not found: ${dir}`);
      return;
    }

    console.log(`📁 Processing directory: ${dir}`);
    const files = walkDirectory(fullDirPath);

    files.forEach((file) => {
      const relativePath = path.relative(projectRoot, file);
      console.log(`📄 Processing: ${relativePath}`);

      totalFilesProcessed++;
      if (processFile(file)) {
        totalFilesModified++;
        console.log(`  ✅ Modified`);
      } else {
        console.log(`  ⚪ No changes`);
      }
    });

    console.log("");
  });

  console.log("✨ Refactoring completed!");
  console.log(`📊 Files processed: ${totalFilesProcessed}`);
  console.log(`📝 Files modified: ${totalFilesModified}`);

  if (totalFilesModified > 0) {
    console.log("\n🔧 Run the following to check for issues:");
    console.log("npm run lint:all");
    console.log("npm run type-check");
  }
}

main();
