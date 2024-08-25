import type { APIRoute } from "astro";
import { db, eq, User } from "astro:db";

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
  const { userId } = await request.json();

  /**
   * Find the user object in the database using the userId.
   */
  const currentUser = await db.select().from(User).where(eq(User.id, userId));

  /**
   * Get the total user points from the user object.
   */
  const totalUserPoints = currentUser[0].total_user_points;

  /**
   * Return the total user points as JSON in the response.
   */
  return new Response(JSON.stringify(totalUserPoints), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
