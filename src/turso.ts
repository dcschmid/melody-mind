/**
 * Database client configuration for Turso
 * This module sets up and exports the Turso database client
 * for server-side database operations.
 */
import { createClient } from "@libsql/client";
import {
  getDatabaseConfig,
  validateDatabaseConfig,
} from "./config/database.js";

// This file is only used server-side
// Uses the unified database configuration that works in both Node.js and Astro
const dbConfig = getDatabaseConfig();

// Validate the configuration
if (!validateDatabaseConfig(dbConfig)) {
  console.error(
    "Invalid database configuration. Please check your environment variables.",
  );
}

/**
 * Turso database client instance
 * Used for executing SQL queries against the Turso database
 */
export const turso = createClient({
  url: dbConfig.url,
  authToken: dbConfig.authToken,
});

// Add a check to ensure this code is only executed server-side
if (typeof window !== "undefined") {
  console.error("turso.js should only be imported on the server side!");
}
