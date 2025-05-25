import fs from "fs";
import path from "path";

function extractKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const keys = new Map();

  // Split into lines and process each line
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    // Match translation key pattern: "key.name": "value"
    const match = trimmed.match(/^["']([^"']+)["']\s*:\s*["'](.*)["'],?$/);
    if (match && !trimmed.startsWith("//") && !trimmed.startsWith("*")) {
      keys.set(match[1], match[2]);
    }
  }

  return keys;
}

// Read English file as reference (it's complete)
const englishKeys = extractKeysFromFile("./src/i18n/locales/en.ts");
console.log(`English reference has ${englishKeys.size} keys`);

// Read all locale files
const localesDir = "./src/i18n/locales";
const localeFiles = fs.readdirSync(localesDir).filter((f) => f.endsWith(".ts"));

const missingTranslations = new Map();

for (const file of localeFiles) {
  if (file === "en.ts") {
    continue;
  } // Skip English as it's the reference

  const lang = file.replace(".ts", "");
  const filePath = path.join(localesDir, file);

  try {
    const langKeys = extractKeysFromFile(filePath);
    const missing = [];

    for (const [key, englishValue] of englishKeys) {
      if (!langKeys.has(key)) {
        missing.push({ key, englishValue });
      }
    }

    if (missing.length > 0) {
      missingTranslations.set(lang, missing);
      console.log(`${lang}: ${missing.length} missing keys`);
    }
  } catch (error) {
    console.error(`Error reading ${file}:`, error.message);
  }
}

// Output the missing translations for manual addition
console.log(`\n${"=".repeat(60)}`);
console.log("MISSING TRANSLATIONS TO ADD:");
console.log("=".repeat(60));

for (const [lang, missing] of missingTranslations) {
  console.log(`\n--- ${lang.toUpperCase()} ---`);
  missing.forEach(({ key, englishValue }) => {
    console.log(`"${key}": "${englishValue}",`);
  });
}
