#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

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

// Pfade zu den Dateien
const PLAYLIST_FILE = path.join(__dirname, "..", "public", "json", "playlist", "en_playlist.json");
const KNOWLEDGE_DIR = path.join(__dirname, "..", "src", "content");

/**
 * Extrahiert den Kategorienamen aus dem imageUrl Pfad
 * z.B. "/category/1950s.jpg" -> "1950s"
 */
function extractCategoryFromImageUrl(imageUrl) {
  const match = imageUrl.match(/\/category\/([^\/]+)\.jpg$/);
  return match ? match[1] : null;
}

/**
 * Findet die entsprechende Knowledge-Datei für eine Kategorie und Sprache
 */
function findKnowledgeFile(category, langCode) {
  const knowledgeDir = path.join(KNOWLEDGE_DIR, `knowledge-${langCode}`);

  if (!fs.existsSync(knowledgeDir)) {
    return null;
  }

  // Suche nach der Markdown-Datei mit dem Kategorienamen
  const files = fs.readdirSync(knowledgeDir);
  const knowledgeFile = files.find(
    (file) => file.endsWith(".md") && file.replace(".md", "") === category
  );

  return knowledgeFile ? path.join(knowledgeDir, knowledgeFile) : null;
}

/**
 * Aktualisiert die Playlist-URLs in einer Knowledge-Datei
 */
function updateKnowledgeFile(filePath, spotifyPlaylist, deezerPlaylist, appleMusicPlaylist) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;

    // Suche nach dem category Block und aktualisiere die Playlist-URLs
    const categoryBlockRegex =
      /category:\s*\n\s*spotifyPlaylist:\s*"[^"]*"\s*\n\s*deezerPlaylist:\s*"[^"]*"\s*\n\s*appleMusicPlaylist:\s*"[^"]*"/g;

    if (categoryBlockRegex.test(content)) {
      content = content.replace(
        categoryBlockRegex,
        `category:
  spotifyPlaylist: "${spotifyPlaylist}"
  deezerPlaylist: "${deezerPlaylist}"
  appleMusicPlaylist: "${appleMusicPlaylist}"`
      );
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content, "utf8");
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Fehler beim Aktualisieren von ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Synchronisiert die Playlist-URLs für alle Knowledge-Dateien
 */
async function syncKnowledgePlaylists() {
  try {
    console.log("🚀 Starte Synchronisation der Knowledge-Playlists...");

    // Lade die englische Playlist-Vorlage
    if (!fs.existsSync(PLAYLIST_FILE)) {
      throw new Error(`Englische Playlist-Vorlage nicht gefunden: ${PLAYLIST_FILE}`);
    }

    const playlistData = JSON.parse(fs.readFileSync(PLAYLIST_FILE, "utf8"));
    console.log(`✅ Englische Playlist-Vorlage geladen mit ${playlistData.length} Kategorien`);

    // Erstelle eine Map der Playlist-Daten für schnellen Zugriff
    const playlistMap = new Map();
    playlistData.forEach((item) => {
      const category = extractCategoryFromImageUrl(item.imageUrl);
      if (category) {
        playlistMap.set(category, {
          spotifyPlaylist: item.spotifyPlaylist,
          deezerPlaylist: item.deezerPlaylist,
          appleMusicPlaylist: item.appleMusicPlaylist,
        });
      }
    });

    console.log(`✅ ${playlistMap.size} Kategorien für Synchronisation vorbereitet`);

    // Verarbeite jede Sprache
    for (const [langCode, langName] of Object.entries(LANGUAGES)) {
      console.log(`\n🔄 Verarbeite ${langName} (${langCode})...`);

      let updatedCount = 0;
      let totalCount = 0;

      // Verarbeite jede Kategorie
      for (const [category, playlists] of playlistMap) {
        const knowledgeFile = findKnowledgeFile(category, langCode);

        if (knowledgeFile) {
          totalCount++;
          const success = updateKnowledgeFile(
            knowledgeFile,
            playlists.spotifyPlaylist,
            playlists.deezerPlaylist,
            playlists.appleMusicPlaylist
          );

          if (success) {
            updatedCount++;
          }
        }
      }

      if (totalCount > 0) {
        console.log(
          `✅ ${langName} (${langCode}): ${updatedCount}/${totalCount} Knowledge-Dateien aktualisiert`
        );
      } else {
        console.log(`⚠️  ${langName} (${langCode}): Keine Knowledge-Dateien gefunden`);
      }
    }

    console.log("\n🎉 Synchronisation der Knowledge-Playlists abgeschlossen!");
  } catch (error) {
    console.error("❌ Fehler bei der Synchronisation:", error.message);
    process.exit(1);
  }
}

/**
 * Zeigt eine Zusammenfassung der Änderungen
 */
function showSummary() {
  console.log("\n📋 Zusammenfassung der Knowledge-Playlist-Synchronisation:");
  console.log("Die folgenden Felder wurden in allen Knowledge-Dateien aktualisiert:");
  console.log("  • spotifyPlaylist");
  console.log("  • deezerPlaylist");
  console.log("  • appleMusicPlaylist");
  console.log("\nDie englische en_playlist.json diente als Vorlage.");
  console.log(
    "Der imageUrl Pfad wurde verwendet, um die entsprechenden Knowledge-Dateien zu finden."
  );
}

// Führe das Script aus
if (require.main === module) {
  syncKnowledgePlaylists()
    .then(() => {
      showSummary();
    })
    .catch((error) => {
      console.error("❌ Fehler beim Ausführen des Scripts:", error.message);
      process.exit(1);
    });
}

module.exports = { syncKnowledgePlaylists };
