import type { APIRoute } from "astro";

import { getPublishedReviews } from "@utils/archive";
import type { ReviewSearchRecord } from "@utils/reviewSearch";

export const GET: APIRoute = async () => {
  const reviews = await getPublishedReviews();
  const records: ReviewSearchRecord[] = reviews.map((review) => ({
    id: review.id,
    url: `/reviews/${review.id}/`,
    title: review.data.album.title,
    artist: review.data.album.artist,
    genres: review.data.album.genres,
    thesis: review.data.thesis,
    publishedAt: review.data.publishedAt.toISOString(),
    cover:
      review.data.cover.mode === "original"
        ? { mode: "original", src: review.data.cover.src }
        : { mode: "typographic" },
  }));

  return new Response(JSON.stringify(records), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
