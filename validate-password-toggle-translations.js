#!/usr/bin/env node

/**
 * Validate PasswordToggleButton translation keys across all language files
 */

import fs from "fs";
import path from "path";

// Required translation keys for PasswordToggleButton component
const requiredKeys = [
  "auth.accessibility.password_toggle_empty",
  "auth.accessibility.password.visible",
  "auth.accessibility.password.hidden",
  "auth.accessibility.password.visible_status",
  "auth.accessibility.password.hidden_status",
  "auth.accessibility.password_toggle_help",
];

// Get all locale files
const localesDir = "/home/daniel/projects/melody-mind/src/i18n/locales";
const localeFiles = fs.readdirSync(localesDir).filter((file) => file.endsWith(".ts"));

console.log("🔍 Validating PasswordToggleButton translation keys...\n");

let allValid = true;

localeFiles.forEach((file) => {
  const filePath = path.join(localesDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const locale = file.replace(".ts", "");

  console.log(`📁 ${locale.toUpperCase()}:`);

  const missingKeys = requiredKeys.filter((key) => !content.includes(`"${key}"`));

  if (missingKeys.length === 0) {
    console.log("   ✅ All required keys present");
  } else {
    console.log(`   ❌ Missing ${missingKeys.length} keys:`);
    missingKeys.forEach((key) => {
      console.log(`      - ${key}`);
    });
    allValid = false;
  }
  console.log("");
});

if (allValid) {
  console.log("🎉 All PasswordToggleButton translation keys are present in all language files!");
} else {
  console.log(
    "❌ Some translation keys are missing. Please add them to ensure proper internationalization."
  );
  process.exit(1);
}
