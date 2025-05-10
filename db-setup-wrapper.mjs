/**
 * Database Setup Wrapper Script
 *
 * This wrapper script uses Node.js ESM module system to load and execute
 * the TypeScript database setup file. It handles environment variable loading
 * and TypeScript transpilation through ts-node.
 *
 * The script serves as a bridge between Node.js ESM and TypeScript,
 * allowing database setup to be written in TypeScript while being
 * executed in a Node.js environment.
 */

// Import required Node.js modules
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Register ts-node for ESM support, enabling TypeScript execution
register("ts-node/esm", pathToFileURL("./"));

// Import and execute the TypeScript setup script
// Catches and logs any errors that occur during execution
import("./db/setup.ts").catch((err) => {
  console.error("Error executing the setup script:", err);
  process.exit(1);
});
