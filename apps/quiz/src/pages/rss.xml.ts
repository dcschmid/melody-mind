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
  const count = (category: string) =>
    quizzes.filter((quiz) => quiz.data.category === category).length;
  const countLabel = (value: number, singular: string, plural: string) =>
    `${value} ${value === 1 ? singular : plural}`;

  return rss({
    title: "MelodyMind Quiz",
    description: `Sourced music history quizzes on ${countLabel(count("decade"), "decade", "decades")}, ${countLabel(count("genre-evolution"), "genre journey", "genre journeys")}, ${countLabel(count("artist"), "artist spotlight", "artist spotlights")}, and ${countLabel(count("album"), "album story", "album stories")}.`,
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
