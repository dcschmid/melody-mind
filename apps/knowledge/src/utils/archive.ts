import { getCollection, type CollectionEntry } from "astro:content";

export const getPublishedArticles = async (): Promise<CollectionEntry<"articles">[]> =>
  (await getCollection("articles", ({ data }) => !data.draft)).toSorted(
    (left, right) =>
      left.data.featuredOrder - right.data.featuredOrder ||
      left.id.localeCompare(right.id)
  );
