#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sprachcodes für alle unterstützten Sprachen
const LANGUAGES = {
  cn: "cn",
  da: "da",
  de: "de",
  en: "en",
  es: "es",
  fi: "fi",
  fr: "fr",
  it: "it",
  jp: "jp",
  nl: "nl",
  pt: "pt",
  ru: "ru",
  sv: "sv",
  uk: "uk",
};

// Pfad zu den JSON-Dateien
const JSON_DIR = path.join(__dirname, "..", "src", "json");
const ENGLISH_TEMPLATE = path.join(JSON_DIR, "en_categories.json");

/**
 * Synchronisiert die Playlist-URLs und Knowledge-URLs für alle Sprachen
 */
async function syncCategories() {
  try {
    console.log("🚀 Starte Synchronisation der Kategorien...");

    // Lade die englische Vorlage
    if (!fs.existsSync(ENGLISH_TEMPLATE)) {
      throw new Error(`Englische Vorlage nicht gefunden: ${ENGLISH_TEMPLATE}`);
    }

    const englishData = JSON.parse(fs.readFileSync(ENGLISH_TEMPLATE, "utf8"));
    console.log(`✅ Englische Vorlage geladen mit ${englishData.length} Kategorien`);

    // Erstelle eine Map der englischen Daten für schnellen Zugriff
    const englishMap = new Map();
    englishData.forEach((category) => {
      englishMap.set(category.slug, category);
    });

    // Verarbeite jede Sprachdatei
    for (const [langCode, langName] of Object.entries(LANGUAGES)) {
      if (langCode === "en") {continue;} // Überspringe Englisch

      const langFile = path.join(JSON_DIR, `${langCode}_categories.json`);

      if (!fs.existsSync(langFile)) {
        console.log(`⚠️  Überspringe ${langName} (${langCode}): Datei nicht gefunden`);
        continue;
      }

      console.log(`\n🔄 Verarbeite ${langName} (${langCode})...`);

      // Lade die Sprachdatei
      const langData = JSON.parse(fs.readFileSync(langFile, "utf8"));
      let updatedCount = 0;

      // Aktualisiere jede Kategorie
      langData.forEach((category) => {
        const englishCategory = englishMap.get(category.slug);

        if (englishCategory) {
          // Synchronisiere Playlist-URLs
          if (englishCategory.spotifyPlaylist !== category.spotifyPlaylist) {
            category.spotifyPlaylist = englishCategory.spotifyPlaylist;
            updatedCount++;
          }

          if (englishCategory.deezerPlaylist !== category.deezerPlaylist) {
            category.deezerPlaylist = englishCategory.deezerPlaylist;
            updatedCount++;
          }

          if (englishCategory.appleMusicPlaylist !== category.appleMusicPlaylist) {
            category.appleMusicPlaylist = englishCategory.appleMusicPlaylist;
            updatedCount++;
          }

          // Aktualisiere Knowledge-URL mit korrektem Sprachcode
          const expectedKnowledgeUrl = `/${langCode}/knowledge/${category.slug}`;
          if (category.knowledgeUrl !== expectedKnowledgeUrl) {
            category.knowledgeUrl = expectedKnowledgeUrl;
            updatedCount++;
          }
        }
      });

      // Speichere die aktualisierte Datei
      fs.writeFileSync(langFile, JSON.stringify(langData, null, 2), "utf8");

      if (updatedCount > 0) {
        console.log(`✅ ${langName} (${langCode}): ${updatedCount} Felder aktualisiert`);
      } else {
        console.log(`✅ ${langName} (${langCode}): Bereits synchronisiert`);
      }
    }

    console.log("\n🎉 Synchronisation abgeschlossen!");
  } catch (error) {
    console.error("❌ Fehler bei der Synchronisation:", error.message);
    process.exit(1);
  }
}

/**
 * Zeigt eine Zusammenfassung der Änderungen
 */
function showSummary() {
  console.log("\n📋 Zusammenfassung der Synchronisation:");
  console.log("Die folgenden Felder wurden für alle Sprachen synchronisiert:");
  console.log("  • spotifyPlaylist");
  console.log("  • deezerPlaylist");
  console.log("  • appleMusicPlaylist");
  console.log("  • knowledgeUrl (mit korrektem Sprachcode)");
  console.log("\nDie englische categories.json diente als Vorlage.");
}

// Führe das Script aus
if (import.meta.url === `file://${process.argv[1]}`) {
  syncCategories()
    .then(() => {
      showSummary();
    })
    .catch((error) => {
      console.error("❌ Fehler beim Ausführen des Scripts:", error.message);
      process.exit(1);
    });
}

export { syncCategories };
