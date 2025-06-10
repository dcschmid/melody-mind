#!/usr/bin/env node

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Required navigation keys from Navigation.astro component
const requiredNavKeys = [
  "nav.ariaLabel",
  "nav.menu.open",
  "nav.menu.text",
  "nav.menu.close",
  "nav.title",
  "nav.menu.home",
  "knowledge.title",
  "playlist.page.heading",
  "nav.menu.rules",
  "nav.menu.highscores",
  "achievements.nav.aria",
  "achievements.nav.link",
  "profile.nav.aria",
  "profile.nav.link",
  "nav.logout.label",
  "nav.menu.logout",
  "nav.donate.heading",
  "nav.donate.paypal",
  "nav.openNewWindow",
  "nav.donate.coffee",

  // Accessibility keys
  "nav.menu.opened",
  "nav.menu.closed",
  "nav.menu.moved_to_first",
  "nav.menu.moved_to_last",
  "nav.menu.focused_on",
  "nav.menu.long_press_detected",
];

const locales = ["de", "en", "es", "fr", "it", "pt", "da", "nl", "sv", "fi"];

function validateNavigationKeys() {
  console.log("🔍 Validating navigation keys across all locales...\n");

  let allValid = true;
  const results = {};

  for (const locale of locales) {
    const filePath = join(__dirname, "src", "i18n", "locales", `${locale}.ts`);

    try {
      const content = readFileSync(filePath, "utf8");

      // Extract all keys from the file
      const keyMatches = content.match(/"([^"]+)":/g) || [];
      const extractedKeys = keyMatches.map((match) => match.slice(1, -2));

      // Check for required keys
      const missingKeys = requiredNavKeys.filter((key) => !extractedKeys.includes(key));

      // Check for duplicate keys
      const keyCount = {};
      extractedKeys.forEach((key) => {
        keyCount[key] = (keyCount[key] || 0) + 1;
      });
      const duplicateKeys = Object.entries(keyCount)
        .filter(([_, count]) => count > 1)
        .map(([key, count]) => `${key} (${count}x)`);

      results[locale] = {
        missingKeys,
        duplicateKeys,
        hasAllNavKeys: missingKeys.length === 0,
        hasDuplicates: duplicateKeys.length > 0,
      };

      if (missingKeys.length > 0 || duplicateKeys.length > 0) {
        allValid = false;
      }
    } catch (error) {
      console.error(`❌ Error reading ${locale}.ts:`, error.message);
      results[locale] = {
        error: error.message,
        hasAllNavKeys: false,
        hasDuplicates: false,
      };
      allValid = false;
    }
  }

  // Print results
  for (const locale of locales) {
    const result = results[locale];

    if (result.error) {
      console.log(`❌ ${locale.toUpperCase()}: ERROR - ${result.error}`);
      continue;
    }

    if (result.hasAllNavKeys && !result.hasDuplicates) {
      console.log(`✅ ${locale.toUpperCase()}: All navigation keys present, no duplicates`);
    } else {
      console.log(`⚠️  ${locale.toUpperCase()}:`);

      if (result.missingKeys.length > 0) {
        console.log(`   Missing keys (${result.missingKeys.length}):`);
        result.missingKeys.forEach((key) => console.log(`     - ${key}`));
      }

      if (result.hasDuplicates) {
        console.log(`   Duplicate keys (${result.duplicateKeys.length}):`);
        result.duplicateKeys.forEach((key) => console.log(`     - ${key}`));
      }
    }
    console.log("");
  }

  // Summary
  const validLocales = Object.entries(results).filter(
    ([_, result]) => result.hasAllNavKeys && !result.hasDuplicates && !result.error
  ).length;

  console.log(`\n📊 SUMMARY:`);
  console.log(`✅ Valid locales: ${validLocales}/${locales.length}`);
  console.log(`🔑 Required navigation keys: ${requiredNavKeys.length}`);

  if (allValid) {
    console.log(`\n🎉 SUCCESS: All navigation keys are present in all locale files!`);
  } else {
    console.log(`\n❌ ISSUES FOUND: Some locales are missing keys or have duplicates.`);
  }

  return allValid;
}

// Run validation
validateNavigationKeys();
