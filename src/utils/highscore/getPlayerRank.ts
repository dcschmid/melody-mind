import { db, sql } from "astro:db";

/**
 * Function to get the rank of the current user in a specific category.
 * It uses window functions to calculate the rank of the user.
 * @param {string} userId - The ID of the user.
 * @param {any} category - The category.
 * @returns {Promise<number | null>} The rank of the user, or null if the user is not in the top 10.
 */
export async function getPlayerRank(
  userId: string,
  category: any,
): Promise<number | null> {
  const result = await db.run(
    sql`
      SELECT RANK() OVER (ORDER BY score DESC) AS rank
      FROM HighscorePerCategory
      WHERE category = ${sql.param(category)} AND userId = ${sql.param(userId)}
      LIMIT 1
    `,
  );

  return result.rows.length ? (result.rows[0].rank as number) : null;
}
