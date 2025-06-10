#!/usr/bin/env node

/**
 * Check for missing translation keys in PasswordResetForm component
 */

import fs from "fs";
import path from "path";

// Extract hardcoded fallback keys from PasswordResetForm.astro
const hardcodedKeys = [
  "auth.form.email_invalid_format",
  "auth.form.password_length_error",
  "auth.form.password_uppercase_error",
  "auth.form.password_lowercase_error",
  "auth.form.password_number_error",
  "auth.form.password_special_error",
  "auth.form.password_common_error",
  "auth.form.password_repeats_error",
  "auth.form.password_sequences_error",
  "auth.accessibility.focus_trapped",
  "auth.form.instructions.title",
  "auth.form.instructions.request.step1",
  "auth.form.instructions.request.step2",
  "auth.form.instructions.request.step3",
  "auth.form.instructions.confirm.step1",
  "auth.form.instructions.confirm.step2",
  "auth.form.instructions.confirm.step3",
  "auth.form.help.password_suggestions",
  "auth.form.help.password_button",
  "auth.form.help.password_title",
  "auth.form.help.tip1",
  "auth.form.help.tip2",
  "auth.form.help.tip3",
  "auth.form.help.tip4",
];

// Get all locale files
const localesDir = "/home/daniel/projects/melody-mind/src/i18n/locales";
const localeFiles = fs.readdirSync(localesDir).filter((file) => file.endsWith(".ts"));

console.log("Checking missing translation keys in PasswordResetForm component...\n");

localeFiles.forEach((file) => {
  const filePath = path.join(localesDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  const locale = file.replace(".ts", "");

  console.log(`📁 ${locale.toUpperCase()}:`);

  const missingKeys = hardcodedKeys.filter((key) => !content.includes(`"${key}"`));

  if (missingKeys.length === 0) {
    console.log("   ✅ All keys present");
  } else {
    console.log(`   ❌ Missing ${missingKeys.length} keys:`);
    missingKeys.forEach((key) => {
      console.log(`      - ${key}`);
    });
  }
  console.log("");
});
