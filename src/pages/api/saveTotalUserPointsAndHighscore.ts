import type { APIRoute } from "astro";
import {
  and,
  db,
  eq,
  HighscorePerCategory,
  TotalHighscore,
  User,
} from "astro:db";
import { generateIdFromEntropySize } from "lucia";

/**
 * The POST endpoint for saving the total user points.
 * @param {Request} request - The request object.
 * @returns {Response} - The response object with the body "User points saved".
 */
export const POST: APIRoute = async ({ request }) => {
  /**
   * Extract the userId, userPoints, and category from the request body.
   * The userId is used to find the user object in the database.
   * The userPoints is the new value of the user's total points.
   * The category is used to insert a new record into the HighscorePerCategory table.
   */
  const { userId, totalUserPoints, category, categoryPoints, language } =
    await request.json();

  // Check if the user is already in the TotalHighscore table
  // The condition is based on the userId column in the TotalHighscore table
  // The userId is used to find a record in the TotalHighscore table
  // The result is stored in the isUserInHighscore variable
  const isUserInHighscore = await db
    .select()
    .from(TotalHighscore)
    .where(eq(TotalHighscore.userId, userId));

  // Check if the user is already in the HighscorePerCategory table for a specific category
  // The condition is based on the combination of userId and category columns in the HighscorePerCategory table
  // The userId and category are used to find a record in the HighscorePerCategory table
  // The result is stored in the isUserInHighScoreInCategory variable
  const isUserInHighScoreInCategory = await db
    .select()
    .from(HighscorePerCategory)
    .where(
      and(
        eq(HighscorePerCategory.userId, userId),
        eq(HighscorePerCategory.category, category),
      ),
    );

  await db.batch([
    /**
     * Update the total user points of the user in the User table.
     */
    db
      .update(User)
      .set({ total_user_points: totalUserPoints })
      .where(eq(User.id, userId)),
    /**
     * Insert a new record into the TotalHighscore table with the userId and userPoints.
     */
    isUserInHighscore.length > 0
      ? db
          .update(TotalHighscore)
          .set({ score: totalUserPoints, language })
          .where(eq(TotalHighscore.userId, userId))
      : db.insert(TotalHighscore).values({
          id: generateIdFromEntropySize(10),
          userId,
          score: totalUserPoints,
          language,
        }),
    /**
     * Insert a new record into the HighscorePerCategory table with the userId, category, and userPoints.
     */
    isUserInHighScoreInCategory.length > 0
      ? db
          .update(HighscorePerCategory)
          .set({ score: categoryPoints })
          .where(
            and(
              eq(HighscorePerCategory.userId, userId),
              eq(HighscorePerCategory.category, category),
            ),
          )
      : db.insert(HighscorePerCategory).values({
          id: generateIdFromEntropySize(10),
          userId,
          category: category,
          language,
          score: categoryPoints,
        }),
  ]);

  /**
   * Return the response object with the body "User points saved".
   */
  return new Response("User points saved", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
