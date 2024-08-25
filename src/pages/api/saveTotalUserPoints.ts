import type { APIRoute } from "astro";
import { db, eq, User } from "astro:db";

/**
 * The POST endpoint for saving the total user points.
 * @param {Request} request - The request object.
 * @returns {Response} - The response object with the body "User points saved".
 */
export const POST: APIRoute = async ({ request }) => {

  /**
   * The request body contains the userId and userPoints.
   * The userId is used to find the user object in the database.
   * The userPoints is the new value of the user's total points.
   */
  const { userId, userPoints } = await request.json();

  /**
   * Find the user object in the database using the userId.
   */
  await db
    .update(User)
    .set({ total_user_points: userPoints })
    .where(eq(User.id, userId));

  /**
   * Return the response object with the body "User points saved".
   */
  return new Response("User points saved", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
