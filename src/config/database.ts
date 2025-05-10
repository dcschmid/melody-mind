/**
 * Database configuration for Melody Mind
 *
 * This file provides a unified configuration interface that works
 * in both Node.js and Astro contexts.
 */

/**
 * Detects the execution context (Node.js or Astro) and returns
 * the appropriate environment variables.
 */
function detectEnvironment() {
  try {
    // Check if we're in an Astro context (import.meta.env available)
    const isAstroContext =
      typeof import.meta !== "undefined" &&
      import.meta &&
      typeof (import.meta as any).env !== "undefined";

    return isAstroContext;
  } catch (error) {
    // If import.meta is not available, we're in a Node.js context
    return false;
  }
}

/**
 * Database connection configuration
 */
export interface DatabaseConfig {
  url: string;
  authToken?: string;
}

/**
 * Gets the database connection configuration based on the current execution context
 */
export function getDatabaseConfig(): DatabaseConfig {
  const isAstroContext = detectEnvironment();

  if (isAstroContext) {
    // Astro context: Use import.meta.env
    const env = (import.meta as any).env;
    return {
      url: env.TURSO_DATABASE_URL ?? "",
      authToken: env.TURSO_AUTH_TOKEN,
    };
  } else {
    // Node.js context: Use process.env
    return {
      url: process.env.TURSO_DATABASE_URL ?? "",
      authToken: process.env.TURSO_AUTH_TOKEN,
    };
  }
}

/**
 * Checks if the database connection configuration is valid
 */
export function validateDatabaseConfig(config: DatabaseConfig): boolean {
  if (!config.url || config.url.trim() === "") {
    console.error("Error: TURSO_DATABASE_URL is not configured");
    return false;
  }

  if (!config.authToken || config.authToken.trim() === "") {
    console.warn("Warning: TURSO_AUTH_TOKEN is not configured");
    // We still return true as some development environments might work without a token
  }

  return true;
}

// Add a check to ensure this code is only executed server-side
if (typeof window !== "undefined") {
  console.error("database.ts should only be imported on the server side!");
}
