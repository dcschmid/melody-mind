#!/usr/bin/env node

// Test script to verify new languages are working correctly
import fs from "fs";
import path from "path";

console.log("🌍 Testing language configuration...\n");

// Read the languages files directly
const localesDir = "./src/i18n/locales";
const localeFiles = fs.readdirSync(localesDir).filter((f) => f.endsWith(".ts"));

console.log("📋 Available locale files:");
console.log(localeFiles.map((f) => f.replace(".ts", "")).join(", "));

const newLanguages = ["cn", "jp", "ru", "uk"];

console.log("\n🔍 Testing new languages:");
for (const lang of newLanguages) {
  const filename = `${lang}.ts`;
  const filePath = path.join(localesDir, filename);

  console.log(`\n${lang.toUpperCase()}:`);

  if (fs.existsSync(filePath)) {
    console.log(`  ✅ Locale file exists: ${filename}`);

    // Read the file content to check for key translations
    const content = fs.readFileSync(filePath, "utf8");

    // Check for key translations
    const testKeys = [
      "language.picker.label",
      "language.change.success",
      "language.cn",
      "language.jp",
      "language.ru",
      "language.uk",
    ];

    for (const key of testKeys) {
      if (content.includes(`"${key}"`)) {
        console.log(`    ✅ Has key: ${key}`);
      } else {
        console.log(`    ❌ Missing key: ${key}`);
      }
    }
  } else {
    console.log(`  ❌ Locale file missing: ${filename}`);
  }
}

// Check ui.ts file
console.log("\n📂 Checking ui.ts configuration:");
const uiPath = "./src/i18n/ui.ts";
const uiContent = fs.readFileSync(uiPath, "utf8");

for (const lang of newLanguages) {
  if (uiContent.includes(`import ${lang} from "./locales/${lang}"`)) {
    console.log(`  ✅ ${lang} is imported in ui.ts`);
  } else {
    console.log(`  ❌ ${lang} is NOT imported in ui.ts`);
  }

  if (uiContent.includes(`${lang}:`)) {
    console.log(`  ✅ ${lang} is exported in ui object`);
  } else {
    console.log(`  ❌ ${lang} is NOT exported in ui object`);
  }
}

console.log("\n🎯 Language configuration test completed!");
