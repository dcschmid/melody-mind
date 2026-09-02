import { getCollection, type CollectionEntry } from "astro:content";

export const getPublishedStories = async (): Promise<CollectionEntry<"stories">[]> =>
  (await getCollection("stories", ({ data }) => !data.draft)).toSorted(
    (left, right) =>
      right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf() ||
      left.id.localeCompare(right.id)
  );
