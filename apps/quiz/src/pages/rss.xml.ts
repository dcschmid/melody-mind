import rss from "@astrojs/rss";
import { getCollection, type CollectionEntry } from "astro:content";

const newestCheckedAt = (quiz: CollectionEntry<"quizzes">): number =>
  Math.max(
    ...quiz.data.questions.flatMap((question) =>
      question.sources.map((source) => source.checkedAt.valueOf())
    )
  );

export async function GET(context: { site?: URL }) {
  const quizzes = (await getCollection("quizzes", ({ data }) => !data.draft)).toSorted(
    (left, right) => newestCheckedAt(right) - newestCheckedAt(left)
  );

  return rss({
    title: "MelodyMind Quiz",
    description:
      "Sourced music history quizzes on seven decades, sixteen genre journeys, two artist spotlights, and two album stories.",
    site: context.site ?? "https://quiz.melody-mind.de",
    items: quizzes.map((quiz) => ({
      title: quiz.data.title,
      description: quiz.data.description,
      pubDate: new Date(newestCheckedAt(quiz)),
      link: `/${quiz.id}/`,
      categories: quiz.data.featuredTopics,
    })),
    customData: "<language>en</language>",
  });
}
