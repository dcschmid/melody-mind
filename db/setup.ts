/**
 * Database Setup Script for MelodyMind
 *
 * This module handles database initialization and migration for the MelodyMind application.
 * It sets up the database schema by executing SQL migrations in order and tracks
 * applied migrations to prevent duplicate execution.
 *
 * Features:
 * - Loads environment variables from .env file
 * - Executes SQL migration files in alphabetical order
 * - Tracks applied migrations in a 'migrations' table
 * - Handles SQL statements, including multi-line statements and special constructs
 * - Executes statements in a specific order (drops, tables, indexes, triggers, others)
 */
import { config } from "dotenv";
config(); // Load environment variables from .env file

import { turso } from "../src/turso.js"; // Import the Turso database client with .js extension for ESM
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Create __dirname equivalent for ESM modules since it's not available by default
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Executes individual SQL statements from a SQL string
 *
 * This function parses a SQL file into individual statements and executes them
 * in a specific order for proper database initialization.
 *
 * Features:
 * - Handles multi-line statements
 * - Preserves SQL trigger definitions
 * - Removes SQL comments
 * - Executes statements in a logical order (drops, tables, indexes, triggers, others)
 * - Provides error handling with descriptive messages
 *
 * @param sql - SQL string containing multiple statements
 * @returns Promise that resolves when all statements have been executed
 */
async function executeSqlStatements(sql: string): Promise<void> {
  // Parse and combine multi-line statements while removing comments
  const lines = sql.split("\n");
  let combinedSql = "";
  let inTrigger = false;
  let currentStatement = "";

  for (const line of lines) {
    // Remove inline comments (but preserve comments within trigger definitions)
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

  // Split the combined SQL into individual statements for execution
  const statements = combinedSql
    .split("\n")
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0 && stmt !== ";");

  // Group statements by type for ordered execution
  const drops = statements.filter((s) => s.toUpperCase().startsWith("DROP"));
  const tables = statements.filter((s) => s.toUpperCase().startsWith("CREATE TABLE"));
  const indexes = statements.filter((s) => s.toUpperCase().startsWith("CREATE INDEX"));
  const triggers = statements.filter((s) => s.toUpperCase().startsWith("CREATE TRIGGER"));
  const others = statements.filter(
    (s) =>
      !s.toUpperCase().startsWith("DROP") &&
      !s.toUpperCase().startsWith("CREATE TABLE") &&
      !s.toUpperCase().startsWith("CREATE INDEX") &&
      !s.toUpperCase().startsWith("CREATE TRIGGER")
  );

  // Execute statements in proper order
  console.log("Dropping obsolete objects...");
  for (const stmt of drops) {
    try {
      await turso.execute({ sql: stmt });
    } catch (error: any) {
      // Ignore errors when dropping non-existent objects
      const errorMsg = error?.message || String(error);
      if (!errorMsg.includes("no such table") && !errorMsg.includes("no such index")) {
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
      const errorMsg = error?.message || String(error);
      // Ignore errors when index already exists
      if (errorMsg.includes("already exists")) {
        console.log(`Info: Index in statement "${stmt}" already exists, skipping.`);
      } else {
        console.error(`Error executing: ${stmt}`);
        console.error("Error details:", errorMsg);
        throw error;
      }
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
 * Runs all SQL migration files from the db/migrations directory
 * Tracks applied migrations in a migrations table to avoid duplicate execution
 * Executes migrations in alphabetical order (based on filename)
 *
 * @returns Promise that resolves when all migrations have been applied
 */
async function runMigrations() {
  console.log("Starting database migrations...");

  // Read all migration files
  const migrationsDir = path.join(__dirname, "migrations");
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort(); // Sort to ensure consistent order

  if (migrationFiles.length === 0) {
    console.log("No migration files found.");
    return;
  }

  // Create migrations table if it doesn't exist
  await turso.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at DATETIME NOT NULL DEFAULT (datetime('now'))
      )
    `,
  });

  // Get already applied migrations
  const result = await turso.execute({
    sql: "SELECT name FROM migrations",
  });

  const appliedMigrations = new Set(result.rows?.map((row) => row.name));

  // Execute each migration that hasn't been applied yet
  for (const file of migrationFiles) {
    if (appliedMigrations.has(file)) {
      console.log(`Migration ${file} has already been applied.`);
      continue;
    }

    console.log(`Executing migration ${file}...`);

    const migrationPath = path.join(migrationsDir, file);
    const migrationSql = fs.readFileSync(migrationPath, "utf-8");

    try {
      // Execute SQL statements individually
      await executeSqlStatements(migrationSql);

      // Mark migration as applied
      await turso.execute({
        sql: "INSERT INTO migrations (name) VALUES (?)",
        args: [file],
      });

      console.log(`Migration ${file} successfully applied.`);
    } catch (error) {
      console.error(`Error during migration ${file}:`, error);
      throw error;
    }
  }

  console.log("All migrations have been successfully applied.");
}

// Execute migrations
runMigrations()
  .then(() => {
    console.log("Database setup completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during database setup:", error);
    process.exit(1);
  });
