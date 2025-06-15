#!/usr/bin/env node

// Test script to verify new languages are working correctly
import { ui, languages } from "./src/i18n/ui.ts";

console.log("🌍 Testing language configuration...\n");

console.log("📋 Available languages:");
console.log(JSON.stringify(languages, null, 2));

console.log("\n🗂️ Available UI translations:");
console.log("Languages with UI translations:", Object.keys(ui));

console.log("\n🔍 Testing new languages:");
const newLanguages = ["cn", "jp", "ru", "uk"];

for (const lang of newLanguages) {
  console.log(`\n${lang.toUpperCase()}:`);

  if (languages[lang]) {
    console.log(`  ✅ Language display name: ${languages[lang]}`);
  } else {
    console.log(`  ❌ Missing language display name`);
  }

  if (ui[lang]) {
    console.log(`  ✅ UI translations available`);
    // Test a few key translations
    const testKeys = ["language.picker.label", "language.change.success"];
    for (const key of testKeys) {
      if (ui[lang][key]) {
        console.log(`    ✅ ${key}: "${ui[lang][key]}"`);
      } else {
        console.log(`    ❌ Missing key: ${key}`);
      }
    }
  } else {
    console.log(`  ❌ UI translations missing`);
  }
}

console.log("\n🎯 Language configuration test completed!");
