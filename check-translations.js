import fs from "fs";
import path from "path";

function extractKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const keys = new Set();

  // Split into lines and process each line
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    // Match translation key pattern: "key.name": "value"
    const match = trimmed.match(/^["']([^"']+)["']\s*:\s*["']/);
    if (match && !trimmed.startsWith("//") && !trimmed.startsWith("*")) {
      keys.add(match[1]);
    }
  }

  return keys;
}

// Read all locale files
const localesDir = "./src/i18n/locales";
const localeFiles = fs.readdirSync(localesDir).filter((f) => f.endsWith(".ts"));

console.log(`Found ${localeFiles.length} locale files:`, localeFiles);

// Extract keys from each file
const localeKeys = new Map();
const allKeys = new Set();

for (const file of localeFiles) {
  const lang = file.replace(".ts", "");
  const filePath = path.join(localesDir, file);

  try {
    const keys = extractKeysFromFile(filePath);
    localeKeys.set(lang, keys);

    // Add all keys to the master set
    keys.forEach((key) => allKeys.add(key));

    console.log(`${lang}: ${keys.size} keys`);
  } catch (error) {
    console.error(`Error reading ${file}:`, error.message);
  }
}

console.log(`\nTotal unique keys: ${allKeys.size}`);

// Find missing keys
const languages = Array.from(localeKeys.keys());
const missingKeys = new Map();

for (const key of allKeys) {
  const missingInLangs = languages.filter((lang) => !localeKeys.get(lang).has(key));
  if (missingInLangs.length > 0) {
    missingKeys.set(key, missingInLangs);
  }
}

console.log(`\n${"=".repeat(60)}`);
console.log("TRANSLATION COMPLETENESS REPORT");
console.log("=".repeat(60));

if (missingKeys.size > 0) {
  console.log("\n❌ MISSING TRANSLATIONS FOUND:");

  // Group by language
  const missingByLang = new Map();
  for (const [key, langs] of missingKeys) {
    for (const lang of langs) {
      if (!missingByLang.has(lang)) {
        missingByLang.set(lang, []);
      }
      missingByLang.get(lang).push(key);
    }
  }

  for (const lang of languages.sort()) {
    const missing = missingByLang.get(lang) || [];
    const total = allKeys.size;
    const present = total - missing.length;
    const completeness = ((present / total) * 100).toFixed(1);

    console.log(
      `\n${lang.toUpperCase()}: ${missing.length} missing keys (${completeness}% complete)`
    );

    if (missing.length > 0) {
      console.log("  Missing keys:");
      missing.slice(0, 10).forEach((key) => {
        console.log(`    - ${key}`);
      });
      if (missing.length > 10) {
        console.log(`    ... and ${missing.length - 10} more`);
      }
    }
  }

  console.log(`\nTotal: ${missingKeys.size} keys with missing translations`);
} else {
  console.log("\n✅ ALL LANGUAGES ARE COMPLETE!");
  console.log("All translation keys are present in all language files.");
}

// Summary
console.log(`\n${"-".repeat(40)}`);
console.log("SUMMARY:");
console.log("-".repeat(40));

for (const lang of languages.sort()) {
  const keyCount = localeKeys.get(lang).size;
  const completeness = ((keyCount / allKeys.size) * 100).toFixed(1);
  console.log(`${lang}: ${keyCount}/${allKeys.size} keys (${completeness}%)`);
}
