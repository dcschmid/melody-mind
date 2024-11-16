import { db, sql } from "astro:db";

/**
 * Retrieves the player's rank for a specific category from the highscore table.
 *
 * @param {string} userId - The unique identifier of the player
 * @param {string} category - The category name to get the rank for
 *
 * @returns {Promise<number | null>} Returns the player's rank as a number (starting from 1),
 *                                  or null if the player has no rank or an error occurs
 *
 * @example
 * ```typescript
 * // Get player's rank in the 'weekly' category
 * const rank = await getPlayerRank('user123', 'weekly');
 * if (rank) {
 *   console.log(`Player is ranked #${rank}`);
 * }
 * ```
 *
 * @throws {Error} If database connection fails
 */
export async function getPlayerRank(
  userId: string,
  category: string,
): Promise<number | null> {
  try {
    const result = await db.run(
      sql`
        WITH RankedScores AS (
          SELECT
            userId,
            RANK() OVER (ORDER BY score DESC) AS rank
          FROM HighscorePerCategory
          WHERE category = ${sql.param(category)}
        )
        SELECT rank
        FROM RankedScores
        WHERE userId = ${sql.param(userId)}
        LIMIT 1
      `,
    );

    return result.rows.length ? (result.rows[0].rank as number) : null;
  } catch (error) {
    console.error("Error fetching player rank:", error);
    return null;
  }
}
