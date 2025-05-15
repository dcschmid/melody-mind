# Datenbankeinrichtung für Melody Mind

Diese Dokumentation beschreibt die Datenbankeinrichtung für das Melody Mind-Projekt, einschließlich
der Architektur, Best Practices für Migrationen und Troubleshooting-Tipps.

## 1. Überblick über die neue Datenbankeinrichtungsarchitektur

Die Datenbankeinrichtung von Melody Mind verwendet eine modulare Architektur, die sowohl in Node.js-
als auch in Astro-Kontexten funktioniert. Diese Architektur besteht aus mehreren
Schlüsselkomponenten, die zusammenarbeiten, um eine robuste und wartbare Datenbankinfrastruktur zu
gewährleisten.

### 1.1 Umgebungsvariablen-Handling in Node.js und Astro

Ein zentrales Feature der Architektur ist die einheitliche Behandlung von Umgebungsvariablen über
verschiedene Ausführungskontexte hinweg:

```js
// Aus src/config/database.ts
function detectEnvironment() {
  try {
    // Prüfen, ob wir uns in einem Astro-Kontext befinden
    const isAstroContext = typeof import.meta !== 'undefined' &&
                          import.meta &&
                          typeof (import.meta as any).env !== 'undefined';

    return isAstroContext;
  } catch (error) {
    // Wenn import.meta nicht verfügbar ist, sind wir in einem Node.js-Kontext
    return false;
  }
}

export function getDatabaseConfig(): DatabaseConfig {
  const isAstroContext = detectEnvironment();

  if (isAstroContext) {
    // Astro-Kontext: Verwende import.meta.env
    const env = (import.meta as any).env;
    return {
      url: env.TURSO_DATABASE_URL ?? "",
      authToken: env.TURSO_AUTH_TOKEN,
    };
  } else {
    // Node.js-Kontext: Verwende process.env
    return {
      url: process.env.TURSO_DATABASE_URL ?? "",
      authToken: process.env.TURSO_AUTH_TOKEN,
    };
  }
}
```

Diese Implementierung ermöglicht es, dieselbe Konfigurationslogik sowohl in serverseitigen
Node.js-Skripten als auch in Astro-Komponenten zu verwenden, was die Codeduplizierung reduziert und
die Wartbarkeit verbessert.

### 1.2 Verwendung von db-setup-wrapper.mjs

Der `db-setup-wrapper.mjs` dient als Einstiegspunkt für die Datenbankeinrichtung und löst mehrere
Herausforderungen:

```js
// Wrapper-Skript, das die neuere register()-API verwendet
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { config } from "dotenv";

// Lade Umgebungsvariablen
config();

// Registriere ts-node für ESM
register("ts-node/esm", pathToFileURL("./"));

// Importiere und führe das Setup-Skript aus
import("./db/setup.ts").catch((err) => {
  console.error("Fehler beim Ausführen des Setup-Skripts:", err);
  process.exit(1);
});
```

Dieser Wrapper:

- Lädt Umgebungsvariablen aus der `.env`-Datei
- Registriert ts-node für ESM, um TypeScript-Dateien direkt ausführen zu können
- Importiert und führt das eigentliche Setup-Skript aus
- Behandelt Fehler und beendet den Prozess mit einem entsprechenden Exit-Code

### 1.3 Konfigurationsdateistruktur

Die Konfigurationsdateien sind wie folgt strukturiert:

- **db-setup-wrapper.mjs**: Einstiegspunkt für die Datenbankeinrichtung
- **db/setup.ts**: Hauptskript für die Ausführung von Migrationen
- **src/config/database.ts**: Einheitliche Konfigurationsschnittstelle
- **src/turso.ts**: Datenbankverbindungskonfiguration
- **db/migrations/**: Verzeichnis mit SQL-Migrationsdateien

Diese Struktur trennt Bedenken und ermöglicht eine einfache Wartung und Erweiterung der
Datenbankfunktionalität.

## 2. Best Practices für zukünftige Migrationen

### 2.1 SQL-Statement-Formatierungsrichtlinien

Bei der Erstellung neuer Migrationen sollten folgende Formatierungsrichtlinien beachtet werden:

1. **Klare Kommentare am Anfang jeder Migration**:

```
-- Migration: Beschreibender Name
-- Description: Detaillierte Beschreibung der Migration
```

2. **Gruppierung von Anweisungen nach Typ**:

   - DROP-Anweisungen zuerst
   - CREATE TABLE-Anweisungen
   - CREATE INDEX-Anweisungen
   - CREATE TRIGGER-Anweisungen
   - Andere Anweisungen (INSERT, UPDATE, etc.)

3. **Verwendung von IF NOT EXISTS / ON CONFLICT**:

```
CREATE TABLE IF NOT EXISTS table_name (...);

INSERT INTO table_name (column1, column2) VALUES ('value1', 'value2')
ON CONFLICT (column1) DO NOTHING;
```

4. **Konsistente Einrückung und Formatierung**:

```
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,

  CONSTRAINT valid_email CHECK (email LIKE '%@%.%')
);
```

5. **Explizite Fremdschlüsselbeziehungen**:

```
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

### 2.2 Organisationsstruktur für Migrationsdateien

Migrationsdateien sollten nach folgendem Schema organisiert werden:

1. **Dateinamenkonvention**:

   - Numerisches Präfix für die Reihenfolge (z.B. `001_`, `002_`)
   - Beschreibender Name in Kleinbuchstaben mit Unterstrichen
   - `.sql`-Erweiterung
   - Beispiel: `003_add_user_preferences.sql`

2. **Inhaltliche Struktur**:

   - Kommentarheader mit Beschreibung
   - DROP-Anweisungen (falls erforderlich)
   - Schema-Änderungen (CREATE/ALTER TABLE)
   - Index-Erstellung
   - Trigger-Definitionen
   - Datenmanipulation (INSERT/UPDATE)
   - Übersetzungen und lokalisierte Inhalte

3. **Atomare Migrationen**:

   - Jede Migration sollte einen einzelnen, zusammenhängenden Zweck erfüllen
   - Komplexe Änderungen sollten in mehrere Migrationen aufgeteilt werden

4. **Idempotenz**:
   - Migrationen sollten idempotent sein (mehrfache Ausführung führt zum gleichen Ergebnis)
   - Verwenden Sie `IF NOT EXISTS` und `ON CONFLICT`-Klauseln

Beispiel für eine gut strukturierte Migration:

```
-- Migration: Add user preferences
-- Description: Adds user preferences table and related indexes

-- Create user_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'light',
  language TEXT NOT NULL DEFAULT 'en',
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,

  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_user_preferences_theme ON user_preferences(theme);
CREATE INDEX IF NOT EXISTS idx_user_preferences_language ON user_preferences(language);

-- Insert default preferences for existing users
INSERT INTO user_preferences (user_id, theme, language)
SELECT id, 'light', 'en'
FROM users
WHERE id NOT IN (SELECT user_id FROM user_preferences)
ON CONFLICT (user_id) DO NOTHING;
```

## 3. Troubleshooting-Guide

### 3.1 Häufige Probleme und ihre Lösungen

#### Problem: Fehlende Umgebungsvariablen

**Symptom**: Fehlermeldung "Fehler: TURSO_DATABASE_URL ist nicht konfiguriert"

**Lösung**:

1. Überprüfen Sie, ob eine `.env`-Datei im Projektroot existiert
2. Stellen Sie sicher, dass die Datei die folgenden Variablen enthält:

```
TURSO_DATABASE_URL=libsql://your-database-url
TURSO_AUTH_TOKEN=your-auth-token
```

3. Starten Sie den Entwicklungsserver neu, um die Änderungen zu übernehmen

#### Problem: Migrationsfehler

**Symptom**: Fehlermeldung "Error executing: [SQL statement]"

**Lösung**:

1. Überprüfen Sie die SQL-Syntax in der Migrationsdatei
2. Stellen Sie sicher, dass alle referenzierten Tabellen und Spalten existieren
3. Prüfen Sie, ob die Migration bereits teilweise angewendet wurde
4. Bei Bedarf können Sie die Migration manuell aus der `migrations`-Tabelle entfernen:

```
DELETE FROM migrations WHERE name = 'problematic_migration.sql';
```

#### Problem: Kontexterkennungsfehler

**Symptom**: Fehlermeldung "Cannot read properties of undefined (reading 'env')"

**Lösung**:

1. Überprüfen Sie, ob die Datei nur serverseitig importiert wird
2. Fügen Sie eine Prüfung hinzu, um clientseitige Importe zu verhindern:

```js
if (typeof window !== "undefined") {
  console.error("Diese Datei sollte nur auf der Serverseite importiert werden!");
}
```

#### Problem: TypeScript-Kompilierungsfehler

**Symptom**: Fehlermeldung "Cannot find module" oder "TS2307"

**Lösung**:

1. Überprüfen Sie die `tsconfig.json`-Konfiguration
2. Stellen Sie sicher, dass alle Pfade korrekt sind
3. Verwenden Sie die richtige Erweiterung beim Import (.js für ESM)
4. Führen Sie `npm install` aus, um fehlende Abhängigkeiten zu installieren

### 3.2 Überprüfung einer erfolgreichen Einrichtung

Um zu überprüfen, ob die Datenbankeinrichtung erfolgreich war, können Sie folgende Schritte
durchführen:

1. **Überprüfen der Migrationstabelle**:

```
SELECT * FROM migrations ORDER BY applied_at;
```

Diese Abfrage sollte alle angewendeten Migrationen mit ihren Anwendungszeitpunkten anzeigen.

2. **Überprüfen der Tabellenstruktur**:

```
.tables
```

(in der SQLite-Befehlszeile) oder

```
SELECT name FROM sqlite_master WHERE type='table';
```

Diese Abfrage sollte alle erwarteten Tabellen anzeigen.

3. **Überprüfen der Datenbankverbindung im Anwendungskontext**:

```js
import { turso } from "../src/turso.js";

async function testConnection() {
  try {
    const result = await turso.execute({ sql: "SELECT 1 AS test" });
    console.log("Datenbankverbindung erfolgreich:", result);
    return true;
  } catch (error) {
    console.error("Datenbankverbindungsfehler:", error);
    return false;
  }
}

testConnection();
```

4. **Überprüfen der Anwendungsfunktionalität**:
   - Führen Sie die Anwendung aus und testen Sie Funktionen, die auf die Datenbank zugreifen
   - Überprüfen Sie die Serverprotokolle auf Datenbankfehler
   - Verwenden Sie die Entwicklertools des Browsers, um API-Anfragen zu überwachen

Wenn alle diese Überprüfungen erfolgreich sind, wurde die Datenbankeinrichtung korrekt durchgeführt.

## Zusammenfassung

Die neue Datenbankeinrichtungsarchitektur von Melody Mind bietet eine robuste, wartbare und
kontextübergreifende Lösung für die Datenbankverbindung und -migration. Durch die Befolgung der
beschriebenen Best Practices und Troubleshooting-Tipps können zukünftige Datenbankänderungen
effizient und zuverlässig implementiert werden.
