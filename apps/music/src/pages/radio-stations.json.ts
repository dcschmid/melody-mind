import type { APIRoute } from "astro";

import { getRadioCatalog } from "../utils/radioCatalog";

export const GET: APIRoute = async () => {
  const catalog = await getRadioCatalog();

  return new Response(JSON.stringify(catalog), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate, stale-while-revalidate=86400",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
