import { createClient } from "@libsql/client";

import { getDatabaseConfig, validateDatabaseConfig } from "./config/database.js";
import { handleGameError } from "./utils/error/errorHandlingUtils";

// This file is only used server-side
// Uses the unified database configuration that works in both Node.js and Astro
const dbConfig = getDatabaseConfig();

// Validate the configuration
if (!validateDatabaseConfig(dbConfig)) {
  handleGameError(new Error("Invalid database configuration"), "database configuration validation");
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
  handleGameError(
    new Error("turso.js should only be imported on the server side!"),
    "server-side validation"
  );
}
