import type { APIRoute } from "astro";
import { and, db, eq, HighscorePerCategory, User } from "astro:db";

/**
 * The POST endpoint for getting the total user points.
 * @param {Request} request - The request object.
 * @returns {Response} - The response object with the total user points as JSON.
 */
export const POST: APIRoute = async ({ request }) => {
  /**
   * The request body contains the userId.
   * The userId is used to find the user object in the database.
   */
  const { userId, categoryValue } = await request.json();

  const [currentUser, currentCategoryPoints] = await db.batch([
    db.select().from(User).where(eq(User.id, userId)),
    db
      .select()
      .from(HighscorePerCategory)
      .where(
        and(
          eq(HighscorePerCategory.userId, userId),
          eq(HighscorePerCategory.category, categoryValue),
        ),
      ),
  ]);

  /**
   * Get the total user points from the user object.
   */
  const totalUserPoints = currentUser[0].total_user_points || 0;
  const currentCategoryPointsValue = currentCategoryPoints[0]?.score || 0;

  /**
   * Return the total user points as JSON in the response.
   */
  return new Response(
    JSON.stringify({
      totalUserPoints,
      currentCategoryPointsValue,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
