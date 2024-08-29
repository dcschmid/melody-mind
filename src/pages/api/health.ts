import type { APIRoute } from "astro";

/**
 * A simple health check API route.
 *
 * Responds with a 200 status code and the string "OK" if the API is running.
 *
 * @return {Response} A Response object with a 200 status code and the string "OK".
 */
export const GET: APIRoute = async (): Promise<Response> => {
  return new Response("OK", {
    status: 200,
  });
};
