/**
 * API Route: Highscores Endpoint
 *
 * This endpoint retrieves highscores from the database with filtering options:
 * - All highscores (default)
 * - Filtered by game mode (quiz or chronology)
 * - Filtered by category
 *
 * Route: GET /[lang]/api/scores/highscores
 *
 * URL Parameters:
 * - lang: The language code for i18n translations
 *
 * Query Parameters:
 * - gameMode: (optional) Filter by game mode ('quiz' or 'chronology')
 * - category: (optional) Filter by category
 * - limit: (optional) Limit the number of results (default: 10)
 *
 * Response:
 * - 200: Highscores successfully retrieved
 * - 500: Server error during data retrieval
 *
 * @since 1.0.0
 */
import type { APIRoute } from "astro";

import { turso } from "../../../../turso.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

/**
 * Branded type for entity IDs for better type safety
 * Allows TypeScript to distinguish between different string IDs
 */
type EntityId<T extends string> = string & { readonly __brand: unique symbol; readonly __type: T };

/** Highscore entry ID branded type */
type HighscoreId = EntityId<"highscore">;

/** Valid game modes as a union type */
type GameMode = "quiz" | "chronology";

/** Music category type with template literal for potential future validation */
type MusicCategory = `${string}`;

/** Known music categories - enables autocompletion while still accepting any string */
type KnownMusicCategories =
  | "rock"
  | "pop"
  | "jazz"
  | "classical"
  | "electronic"
  | "hip-hop"
  | "metal"
  | "country"
  | MusicCategory;

/** Valid parameter types for SQL queries */
type SqlParam = string | number | boolean | null;

/**
 * API query parameters interface for endpoint
 * @category API Types
 */
interface HighscoreQueryParams {
  /** Filter results by game mode */
  gameMode?: GameMode;
  /** Filter results by music category */
  category?: KnownMusicCategories;
  /** Maximum number of results to return */
  limit?: number;
}

/**
 * Highscore Entry Interface
 *
 * Defines the structure of a highscore entry returned by the API
 * @category Data Models
 */
interface HighscoreEntry {
  /** Unique identifier for the highscore entry */
  id: HighscoreId;
  /** Username of the player who achieved this score */
  username: string;
  /** Type of game played (quiz or chronology) */
  gameMode: GameMode;
  /** Total points earned in this game */
  score: number;
  /** Music category or genre played */
  category: KnownMusicCategories;
  /** ISO 8601 formatted date when the score was achieved */
  createdAt: string;
}

/**
 * API response interface
 * @category API Types
 */
interface HighscoreResponse {
  /** Whether the request was successful */
  success: boolean;
  /** Array of highscore entries */
  highscores?: HighscoreEntry[];
  /** Error message if success is false */
  error?: string;
}

/**
 * Custom error classes for more precise error handling
 */
class HighscoreApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HighscoreApiError";
  }
}

class DatabaseQueryError extends HighscoreApiError {
  constructor(
    message: string,
    public readonly query?: string,
    public readonly params?: SqlParam[]
  ) {
    super(`Database query error: ${message}`);
    this.name = "DatabaseQueryError";
  }
}

/**
 * Type guard for checking if an error is a DatabaseQueryError
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a DatabaseQueryError
 */
function isDatabaseQueryError(error: unknown): error is DatabaseQueryError {
  return error instanceof DatabaseQueryError;
}

/**
 * Parse and validate query parameters from URL
 *
 * @param {URL} url - The request URL
 * @returns {HighscoreQueryParams} The validated query parameters
 */
function parseQueryParams(url: URL): HighscoreQueryParams {
  const gameMode = url.searchParams.get("gameMode") as GameMode | null;
  const category = url.searchParams.get("category") as KnownMusicCategories | null;
  const limitParam = url.searchParams.get("limit");

  // Validate and parse limit parameter
  const limit =
    limitParam && !isNaN(parseInt(limitParam))
      ? Math.max(1, Math.min(100, parseInt(limitParam))) // Ensure limit is between 1 and 100
      : 10;

  return {
    gameMode: gameMode ?? undefined,
    category: category ?? undefined,
    limit,
  };
}

/**
 * Build SQL query for highscores based on filters
 *
 * @param {HighscoreQueryParams} params - The query parameters
 * @param {string} language - The language code for filtering
 * @returns {{ sql: string; args: SqlParam[] }} Object containing SQL query and args
 *
 * @example
 * // Build query for rock category with 5 results
 * const { sql, args } = buildHighscoreQuery({
 *   category: 'rock',
 *   limit: 5
 * }, 'en');
 */
function buildHighscoreQuery(params: HighscoreQueryParams, language: string): { sql: string; args: SqlParam[] } {
  const { gameMode, category, limit } = params;

  // Base SQL query
  let sql = `
    SELECT 
      h.id,
      u.username,
      h.game_mode,
      h.score,
      h.category,
      h.created_at
    FROM highscores h
    JOIN users u ON h.user_id = u.id
  `;

  // Add WHERE clauses based on filters
  const whereConditions: string[] = [];
  const args: SqlParam[] = [];

  // Always filter by language
  whereConditions.push("h.language = ?");
  args.push(language);

  if (gameMode) {
    whereConditions.push("h.game_mode = ?");
    args.push(gameMode);
  }

  if (category) {
    whereConditions.push("h.category = ?");
    args.push(category);
  }

  if (whereConditions.length > 0) {
    sql += ` WHERE ${whereConditions.join(" AND ")}`;
  }

  // Add ORDER BY and LIMIT clauses
  sql += " ORDER BY h.score DESC LIMIT ?";
  args.push(limit ?? 10);

  return { sql, args };
}

/**
 * Transform database result rows to typed HighscoreEntry objects
 *
 * @param {Record<string, unknown>[]} rows - Database result rows
 * @returns {HighscoreEntry[]} Array of typed highscore entries
 */
function transformHighscoreRows(rows: Record<string, unknown>[]): HighscoreEntry[] {
  return rows.map((row) => ({
    id: row.id as HighscoreId,
    username: row.username as string,
    gameMode: row.game_mode as GameMode,
    score: Number(row.score),
    category: row.category as KnownMusicCategories,
    createdAt: row.created_at as string,
  }));
}

/**
 * GET request handler for the highscores endpoint
 *
 * Retrieves highscores from the database with optional filtering
 *
 * @param {Object} context - The Astro API route context
 * @param {Request} context.request - The incoming HTTP request
 * @param {Object} context.params - URL parameters including language code
 * @returns {Response} JSON response with highscores data or error message
 *
 * @example
 * // Example API call
 * fetch('/en/api/scores/highscores?gameMode=quiz&limit=5')
 *   .then(response => response.json())
 *   .then(data => console.log(data.highscores));
 */
export const GET: APIRoute = async ({ request, params: _params }) => {
  // Extract language from URL parameters for localized messages
  const lang = _params.lang as string;
  const t = useTranslations(lang);

  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = parseQueryParams(url);

    // Build the SQL query based on filters
    const { sql, args } = buildHighscoreQuery(queryParams, lang);

    // Execute the query
    const result = await turso.execute(sql, args);

    // Transform database results into the required format
    const highscores = result.rows
      ? transformHighscoreRows(result.rows as Record<string, unknown>[])
      : [];

    // Return the highscores with 200 status
    const response: HighscoreResponse = {
      success: true,
      highscores,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    // Enhanced error logging with type checking
    if (isDatabaseQueryError(error)) {
      console.error(t("api.errors.database_error", { message: error.message }), {
        query: error.query,
        params: error.params,
      });
    } else if (error instanceof Error) {
      console.error(t("api.errors.highscores_retrieval", { message: error.message }), {
        stack: error.stack,
      });
    } else {
      console.error(t("api.errors.unknown_error"));
    }

    // Return standardized error response
    const errorResponse: HighscoreResponse = {
      success: false,
      error: t("api.errors.highscores_retrieval_message"),
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
