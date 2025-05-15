// Test-Skript für die /api/game/save-result API
console.log("🧪 Starte API-Test für /api/game/save-result");

// Testdaten vorbereiten
const testData = {
  userId: "test-user",
  categoryName: "rock", // Beachte: API erwartet categoryName, nicht category
  score: 100,
  difficulty: "easy",
  correctAnswers: 5, // Optional, aber im Interface definiert
  totalRounds: 10, // Optional, aber im Interface definiert
};

console.log("📤 Testdaten:", JSON.stringify(testData, null, 2));

// API-Anfrage senden
console.log("\n🚀 Sende POST-Anfrage an http://localhost:4321/api/game/save-result...");

fetch("http://localhost:4321/api/game/save-result", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(testData),
})
  .then((response) => {
    console.log(`📥 Status: ${response.status} ${response.statusText}`);
    return response.json();
  })
  .then((data) => {
    console.log("📥 Antwort:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log("\n✅ API-Test erfolgreich!");
      console.log(`🎮 Spielmodus: ${data.gameMode}`);
      console.log(`🆔 Ergebnis-ID: ${data.id}`);
    } else {
      console.log("\n❌ API-Test fehlgeschlagen!");
      console.log(`⚠️ Fehlermeldung: ${data.message}`);
    }
  })
  .catch((error) => {
    console.error("\n❌ API-Test fehlgeschlagen mit Fehler:", error);
  })
  .finally(() => {
    console.log("\n📊 Für einen manuellen Datenbank-Check:");
    console.log(`
-- Prüfe game_results Tabelle
SELECT * FROM game_results WHERE user_id = 'test-user' ORDER BY created_at DESC LIMIT 1;

-- Prüfe user_mode_stats Tabelle
SELECT * FROM user_mode_stats WHERE user_id = 'test-user' AND game_mode = 'quiz';

-- Prüfe highscores Tabelle
SELECT * FROM highscores WHERE user_id = 'test-user' ORDER BY created_at DESC LIMIT 1;
`);
  });
