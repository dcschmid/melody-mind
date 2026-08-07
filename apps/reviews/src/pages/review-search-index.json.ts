import type { APIRoute } from "astro";
import { getImage } from "astro:assets";

import { getPublishedReviews } from "@utils/archive";
import { getReviewCoverImage } from "@utils/reviewImages";
import { getReviewMainGenres, type ReviewSearchRecord } from "@utils/reviewSearch";

export const GET: APIRoute = async () => {
  const reviews = await getPublishedReviews();
  const records: ReviewSearchRecord[] = await Promise.all(
    reviews.map(async (review) => {
      const coverAsset =
        review.data.cover.mode === "original"
          ? getReviewCoverImage(review.data.cover.src)
          : undefined;
      const coverImage = coverAsset
        ? await getImage({ src: coverAsset, width: 640, height: 640 })
        : undefined;

      return {
        id: review.id,
        url: `/reviews/${review.id}/`,
        title: review.data.album.title,
        artist: review.data.album.artist,
        genres: review.data.album.genres,
        mainGenres: getReviewMainGenres(review.data.album.genres),
        thesis: review.data.thesis,
        publishedAt: review.data.publishedAt.toISOString(),
        cover:
          review.data.cover.mode === "original" && coverImage
            ? { mode: "original", src: coverImage.src }
            : { mode: "typographic" },
      };
    })
  );

  return new Response(JSON.stringify(records), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
