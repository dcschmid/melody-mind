/**
 * URL Parsing Utilities
 *
 * Centralized utilities for URL parsing and parameter extraction.
 * Eliminates duplicate URL parsing logic.
 */

import { handleGameError } from "../error/errorHandlingUtils";

export interface GameRouteParams {
  lang: string;
  category: string;
  difficulty?: string;
  mode?: string;
}

/**
 * Parse game route parameters from current URL
 */
export function parseGameRoute(): GameRouteParams | null {
  try {
    const pathParts = window.location.pathname.split("/").filter(Boolean);

    if (pathParts.length < 2) {
      return null;
    }

    const [lang, routePart, difficulty] = pathParts;

    // Handle time-pressure routes
    if (routePart?.startsWith("time-pressure-")) {
      return {
        lang,
        category: routePart.replace("time-pressure-", ""),
        mode: "time-pressure",
      };
    }

    // Handle chronology routes
    if (routePart?.startsWith("chronology-")) {
      return {
        lang,
        category: routePart.replace("chronology-", ""),
        difficulty: difficulty || "medium",
        mode: "chronology",
      };
    }

    // Handle regular game routes
    if (routePart?.startsWith("game-")) {
      return {
        lang,
        category: routePart.replace("game-", ""),
        difficulty: difficulty || "medium",
        mode: "regular",
      };
    }

    // Handle category routes
    return {
      lang,
      category: routePart,
    };
  } catch (err) {
    // Report error to centralized handler for diagnostics and telemetry
    handleGameError(err, "parseGameRoute");
    return null;
  }
}

/**
 * Extract language from URL path
 */
export function extractLanguageFromPath(path: string = window.location.pathname): string {
  const pathParts = path.split("/").filter(Boolean);
  return pathParts[0] || "en";
}

/**
 * Extract category from URL path (handles different route patterns)
 */
export function extractCategoryFromPath(path: string = window.location.pathname): string | null {
  const pathParts = path.split("/").filter(Boolean);

  if (pathParts.length < 2) {
    return null;
  }

  const routePart = pathParts[1];

  // Handle prefixed routes
  if (routePart?.includes("-")) {
    const prefixes = ["time-pressure-", "chronology-", "game-"];
    for (const prefix of prefixes) {
      if (routePart.startsWith(prefix)) {
        return routePart.replace(prefix, "");
      }
    }
  }

  return routePart;
}

/**
 * Check if current route is a game route
 */
export function isGameRoute(path: string = window.location.pathname): boolean {
  const pathParts = path.split("/").filter(Boolean);
  if (pathParts.length < 2) {
    return false;
  }

  const routePart = pathParts[1];
  return (
    routePart?.startsWith("game-") ||
    routePart?.startsWith("time-pressure-") ||
    routePart?.startsWith("chronology-")
  );
}
