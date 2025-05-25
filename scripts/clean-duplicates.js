#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, "..", "src", "i18n", "locales");
const localeFiles = fs.readdirSync(localesDir).filter((file) => file.endsWith(".ts"));

function cleanDuplicates(filePath) {
  console.log(`Cleaning duplicates in ${filePath}...`);

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  const seenKeys = new Set();
  const cleanedLines = [];
  let inObject = false;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Count braces to track if we're inside the main object
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceCount += openBraces - closeBraces;

    if (braceCount > 0) {
      inObject = true;
    }

    if (inObject && braceCount === 0) {
      inObject = false;
    }

    // Skip comments and non-key lines
    if (
      line.trim().startsWith("//") ||
      line.trim().startsWith("/*") ||
      line.trim() === "" ||
      line.trim() === "export default {" ||
      line.trim() === "}" ||
      line.trim() === "};"
    ) {
      cleanedLines.push(line);
      continue;
    }

    // Extract key from line (handle both "key": and key: formats)
    const keyMatch = line.match(/^\s*["']([^"']+)["']\s*:/);
    if (keyMatch && inObject) {
      const key = keyMatch[1];

      if (seenKeys.has(key)) {
        console.log(`  Removing duplicate key: ${key}`);
        continue; // Skip this duplicate line
      }

      seenKeys.add(key);
    }

    cleanedLines.push(line);
  }

  fs.writeFileSync(filePath, cleanedLines.join("\n"));
  console.log(`  Cleaned ${filePath}`);
}

// Clean all locale files
for (const file of localeFiles) {
  const filePath = path.join(localesDir, file);
  try {
    cleanDuplicates(filePath);
  } catch (error) {
    console.error(`Error cleaning ${file}:`, error.message);
  }
}

console.log("Duplicate cleaning completed!");
