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
 */
import type { APIRoute } from "astro";

import { turso } from "../../../../turso.ts";
import { useTranslations } from "../../../../utils/i18n.ts";

/**
 * Highscore Entry Interface
 *
 * Defines the structure of a highscore entry returned by the API
 */
interface HighscoreEntry {
  /** Unique identifier for the highscore entry */
  id: string;
  /** Username of the player who achieved this score */
  username: string;
  /** Type of game played (quiz or chronology) */
  gameMode: "quiz" | "chronology";
  /** Total points earned in this game */
  score: number;
  /** Music category or genre played */
  category: string;
  /** ISO 8601 formatted date when the score was achieved */
  createdAt: string;
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
 */
export const GET: APIRoute = async ({ request, params }) => {
  // Extract language from URL parameters for localized messages
  const lang = params.lang as string;
  const t = useTranslations(lang);

  try {
    // Extract query parameters
    const url = new URL(request.url);
    const gameMode = url.searchParams.get("gameMode");
    const category = url.searchParams.get("category");
    const limitParam = url.searchParams.get("limit");

    // Default limit to 10 if not specified or invalid
    const limit = limitParam && !isNaN(parseInt(limitParam)) ? parseInt(limitParam) : 10;

    // Build the SQL query based on filters
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
    const whereConditions = [];
    const args = [];

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
    args.push(limit);

    // Execute the query
    const result = await turso.execute({
      sql,
      args,
    });

    // Transform database results into the required format
    const highscores: HighscoreEntry[] = result.rows
      ? result.rows.map((row) => ({
          id: row.id as string,
          username: row.username as string,
          gameMode: row.game_mode as "quiz" | "chronology",
          score: Number(row.score),
          category: row.category as string,
          createdAt: row.created_at as string,
        }))
      : [];

    // Return the highscores with 200 status
    return new Response(
      JSON.stringify({
        success: true,
        highscores,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Log error for debugging and return 500 response
    console.error("Error retrieving highscores:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Error retrieving highscores",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
