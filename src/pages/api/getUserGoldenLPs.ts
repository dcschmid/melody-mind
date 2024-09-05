import { getGoldenLPs } from "@utils/db/getGoldenLPs";
import type { APIRoute } from "astro";

/**
 * Returns the golden LPs for the given user ID.
 *
 * @param {Object} request - The request object.
 * @param {string} request.userId - The ID of the user.
 * @returns {Response} A Response object with a JSON response containing the golden LPs.
 */
export const POST: APIRoute = async ({ request }) => {
  const { userId } = await request.json();

  /**
   * Get the golden LPs for the user ID.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Object>} A Promise object that resolves with the golden LPs.
   */
  const goldenLPs = await getGoldenLPs(userId);

  return new Response(
    JSON.stringify({
      goldenLPs,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
