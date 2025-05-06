import { config } from "dotenv";
config(); // Load .env file

import { turso } from "../src/turso.js"; // Note the .js extension for ESM
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Use import.meta.url for __dirname equivalent in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Führt einzelne SQL-Anweisungen aus einem SQL-String aus
 * @param sql SQL-String mit mehreren Anweisungen
 */
async function executeSqlStatements(sql: string): Promise<void> {
  // First combine multi-line statements and remove comments
  const lines = sql.split("\n");
  let combinedSql = "";
  let inTrigger = false;
  let currentStatement = "";

  for (const line of lines) {
    // Remove inline comments (but keep -- in trigger definitions)
    const cleanedLine = !inTrigger ? line.replace(/--.*$/, "") : line;

    if (cleanedLine.trim().toUpperCase().startsWith("CREATE TRIGGER")) {
      inTrigger = true;
    }

    if (cleanedLine.trim()) {
      currentStatement += cleanedLine + " ";

      if (inTrigger && cleanedLine.trim().toUpperCase() === "END;") {
        combinedSql += currentStatement + "\n";
        currentStatement = "";
        inTrigger = false;
      } else if (!inTrigger && cleanedLine.trim().endsWith(";")) {
        combinedSql += currentStatement + "\n";
        currentStatement = "";
      }
    }
  }

  // Add any remaining statement
  if (currentStatement.trim()) {
    combinedSql += currentStatement + "\n";
  }

  // Split into statements
  const statements = combinedSql
    .split("\n")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && stmt !== ";");

  // Group statements by type
  const drops = statements.filter((s) => s.toUpperCase().startsWith("DROP"));
  const tables = statements.filter((s) =>
    s.toUpperCase().startsWith("CREATE TABLE"),
  );
  const indexes = statements.filter((s) =>
    s.toUpperCase().startsWith("CREATE INDEX"),
  );
  const triggers = statements.filter((s) =>
    s.toUpperCase().startsWith("CREATE TRIGGER"),
  );
  const others = statements.filter(
    (s) =>
      !s.toUpperCase().startsWith("DROP") &&
      !s.toUpperCase().startsWith("CREATE TABLE") &&
      !s.toUpperCase().startsWith("CREATE INDEX") &&
      !s.toUpperCase().startsWith("CREATE TRIGGER"),
  );

  // Execute in order: drops, tables, indexes, triggers, others
  console.log("Dropping existing objects...");
  for (const stmt of drops) {
    try {
      await turso.execute({ sql: stmt });
    } catch (error: any) {
      // Ignore errors when dropping non-existent objects
      const errorMsg = error?.message || String(error);
      if (
        !errorMsg.includes("no such table") &&
        !errorMsg.includes("no such index")
      ) {
        console.error(`Error executing: ${stmt}`);
        console.error("Error details:", errorMsg);
        throw error;
      }
    }
  }

  console.log("Creating tables...");
  for (const stmt of tables) {
    try {
      await turso.execute({ sql: stmt });
    } catch (error: any) {
      console.error(`Error executing: ${stmt}`);
      console.error("Error details:", error?.message || String(error));
      throw error;
    }
  }

  console.log("Creating indexes...");
  for (const stmt of indexes) {
    try {
      await turso.execute({ sql: stmt });
    } catch (error: any) {
      console.error(`Error executing: ${stmt}`);
      console.error("Error details:", error?.message || String(error));
      throw error;
    }
  }

  console.log("Creating triggers...");
  for (const stmt of triggers) {
    try {
      await turso.execute({ sql: stmt });
    } catch (error: any) {
      console.error(`Error executing: ${stmt}`);
      console.error("Error details:", error?.message || String(error));
      throw error;
    }
  }

  console.log("Executing remaining statements...");
  for (const stmt of others) {
    try {
      await turso.execute({ sql: stmt });
    } catch (error: any) {
      console.error(`Error executing: ${stmt}`);
      console.error("Error details:", error?.message || String(error));
      throw error;
    }
  }
}

/**
 * Führt alle SQL-Migrationsdateien im Verzeichnis db/migrations aus
 */
async function runMigrations() {
  console.log("Starte Datenbankmigrationen...");

  // Lese alle Migrationsdateien
  const migrationsDir = path.join(__dirname, "migrations");
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort(); // Sortieren, um die Reihenfolge sicherzustellen

  if (migrationFiles.length === 0) {
    console.log("Keine Migrationsdateien gefunden.");
    return;
  }

  // Erstelle migrations-Tabelle, falls sie nicht existiert
  await turso.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at DATETIME NOT NULL DEFAULT (datetime('now'))
      )
    `,
  });

  // Hole bereits angewendete Migrationen
  const result = await turso.execute({
    sql: "SELECT name FROM migrations",
  });

  const appliedMigrations = new Set(result.rows?.map((row) => row.name));

  // Führe jede Migration aus, die noch nicht angewendet wurde
  for (const file of migrationFiles) {
    if (appliedMigrations.has(file)) {
      console.log(`Migration ${file} wurde bereits angewendet.`);
      continue;
    }

    console.log(`Führe Migration ${file} aus...`);

    const migrationPath = path.join(migrationsDir, file);
    const migrationSql = fs.readFileSync(migrationPath, "utf-8");

    try {
      // Führe die SQL-Anweisungen einzeln aus
      await executeSqlStatements(migrationSql);

      // Speichere die Migration als angewendet
      await turso.execute({
        sql: "INSERT INTO migrations (name) VALUES (?)",
        args: [file],
      });

      console.log(`Migration ${file} erfolgreich angewendet.`);
    } catch (error) {
      console.error(`Fehler bei Migration ${file}:`, error);
      throw error;
    }
  }

  console.log("Alle Migrationen wurden erfolgreich angewendet.");
}

// Führe die Migrationen aus
runMigrations()
  .then(() => {
    console.log("Datenbanksetup abgeschlossen.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fehler beim Datenbanksetup:", error);
    process.exit(1);
  });
