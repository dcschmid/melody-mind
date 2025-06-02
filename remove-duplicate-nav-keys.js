#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Liste der Navigation-Schlüssel, die nur einmal vorkommen sollten
const navigationKeys = [
  "nav.ariaLabel",
  "nav.menu.open",
  "nav.menu.close",
  "nav.menu.opened",
  "nav.menu.closed",
  "nav.menu.moved_to_first",
  "nav.menu.moved_to_last",
  "nav.menu.focused_on",
  "nav.menu.long_press_detected",
  "nav.menu.home",
  "nav.menu.rules",
  "nav.menu.highscores",
  "nav.menu.logout",
  "nav.logout.label",
  "knowledge.title",
  "nav.donate.heading",
  "nav.donate.paypal",
  "nav.donate.coffee",
  "nav.title",
  "nav.menu.text",
  "playlist.page.heading",
  "achievements.nav.aria",
  "profile.nav.aria",
  "profile.nav.link",
  "achievements.nav.link",
  "nav.openNewWindow",
];

const localesDir = path.join(__dirname, "src", "i18n", "locales");
const localeFiles = [
  "de.ts",
  "en.ts",
  "es.ts",
  "fr.ts",
  "pt.ts",
  "da.ts",
  "nl.ts",
  "sv.ts",
  "fi.ts",
];

console.log("🧹 Removing duplicate navigation keys...\n");

for (const localeFile of localeFiles) {
  const filePath = path.join(localesDir, localeFile);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${localeFile}`);
    continue;
  }

  const content = fs.readFileSync(filePath, "utf8");
  let modifiedContent = content;
  const removedDuplicates = [];

  // Für jeden Navigation-Schlüssel
  for (const navKey of navigationKeys) {
    const regex = new RegExp(`^\\s*["']${navKey.replace(".", "\\.")}["']:\\s*.*?[,]?$`, "gm");
    const matches = content.match(regex);

    if (matches && matches.length > 1) {
      console.log(`  Found ${matches.length} occurrences of "${navKey}"`);

      // Entferne alle außer dem ersten Vorkommen
      let firstOccurrenceFound = false;
      modifiedContent = modifiedContent.replace(regex, (match) => {
        if (!firstOccurrenceFound) {
          firstOccurrenceFound = true;
          return match; // Behalte das erste Vorkommen
        } else {
          removedDuplicates.push(navKey);
          return ""; // Entferne alle anderen Vorkommen
        }
      });
    }
  }

  // Entferne leere Zeilen, die durch das Löschen entstanden sind
  modifiedContent = modifiedContent.replace(/\n\s*\n\s*\n/g, "\n\n");

  // Entferne verwaiste Kommas vor dem schließenden Objekt
  modifiedContent = modifiedContent.replace(/,\s*\n\s*};?\s*$/, "\n};");

  if (removedDuplicates.length > 0) {
    console.log(`✅ Cleaned up ${localeFile} - removed ${removedDuplicates.length} duplicates:`);
    console.log(`   ${[...new Set(removedDuplicates)].join(", ")}`);

    fs.writeFileSync(filePath, modifiedContent, "utf8");
  } else {
    console.log(`✅ ${localeFile} - no duplicates found`);
  }
}

console.log("\n🎉 Duplicate removal completed!");
