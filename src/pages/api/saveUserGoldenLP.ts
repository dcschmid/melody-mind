import { saveGoldenLP } from "@utils/db/saveGoldenLP";
import type { APIRoute } from "astro";

/**
 * Handles the POST request to the /api/saveUserGoldenLP endpoint.
 * It saves the golden LP for the given user ID and genre.
 * @param {Request} request The request object.
 * @returns {Response} The response object with a JSON body containing the message "User points saved".
 */
export const POST: APIRoute = async ({ request }) => {
  const { userId, genre, difficulty } = await request.json();

  // Save the golden LP for the given user ID and genre
  await saveGoldenLP(userId, genre, difficulty);

  // Return the response with a JSON body containing the message "Golden LP saved"
  return new Response("Golden LP saved", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
