#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
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

function cleanupLocaleFile(locale) {
  const filePath = join(__dirname, "src", "i18n", "locales", `${locale}.ts`);

  try {
    const content = readFileSync(filePath, "utf8");

    // Find all navigation-related sections and remove duplicates
    const lines = content.split("\n");
    const cleanedLines = [];
    const seenKeys = new Set();
    let insideNavSection = false;
    let navSectionStarted = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check if we're starting a navigation section
      if (line.includes("// Navigation") && !navSectionStarted) {
        navSectionStarted = true;
        insideNavSection = true;
        cleanedLines.push(line);
        continue;
      }

      // Skip duplicate navigation section headers
      if (line.includes("// Navigation") && navSectionStarted) {
        continue;
      }

      // Check if we're at the end of the file
      if (line.trim() === "};" && insideNavSection) {
        cleanedLines.push(line);
        break;
      }

      // If we're inside navigation section, handle keys
      if (insideNavSection) {
        const keyMatch = line.match(/"([^"]+)":/);
        if (keyMatch) {
          const key = keyMatch[1];

          // Only keep required navigation keys and avoid duplicates
          if (requiredNavKeys.includes(key)) {
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              cleanedLines.push(line);
            }
            // Skip duplicates
          } else {
            // Non-navigation key in navigation section, skip
          }
        } else {
          // Comments or other lines
          if (line.includes("// Navigation accessibility") && !seenKeys.has("nav.menu.opened")) {
            cleanedLines.push(line);
          } else if (!line.includes("// Navigation accessibility")) {
            cleanedLines.push(line);
          }
        }
      } else {
        // We're not in navigation section yet
        cleanedLines.push(line);
      }
    }

    // Write the cleaned content back
    const cleanedContent = cleanedLines.join("\n");
    writeFileSync(filePath, cleanedContent, "utf8");

    console.log(
      `✅ Cleaned up ${locale}.ts - removed duplicates and kept only required navigation keys`
    );
    return true;
  } catch (error) {
    console.error(`❌ Error cleaning up ${locale}.ts:`, error.message);
    return false;
  }
}

// Clean up all locales except Italian (which is already correct)
const locales = ["de", "en", "es", "fr", "pt", "da", "nl", "sv", "fi"];

console.log("🧹 Cleaning up navigation key duplicates in locale files...\n");

for (const locale of locales) {
  cleanupLocaleFile(locale);
}

console.log("\n🎉 Cleanup completed! Running validation...\n");

// Run validation after cleanup
import("./validate-navigation-keys.js");
