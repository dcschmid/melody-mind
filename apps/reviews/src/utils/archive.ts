import { getCollection, type CollectionEntry } from "astro:content";

export const getPublishedReviews = async (): Promise<CollectionEntry<"reviews">[]> =>
  (await getCollection("reviews", ({ data }) => !data.draft)).toSorted(
    (left, right) =>
      right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf() ||
      left.id.localeCompare(right.id)
  );

export const getReviewGenres = (reviews: CollectionEntry<"reviews">[]) =>
  [...new Set(reviews.flatMap((review) => review.data.album.genres))].toSorted(
    (left, right) => left.localeCompare(right)
  );
