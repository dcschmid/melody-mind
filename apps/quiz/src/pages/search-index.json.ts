import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";
import { buildSearchIndex } from "@freshjuice/astro-search-plugin/build";
import { getCollectionCached } from "@shared-utils/utils/content/getCollectionCached";

import type { QuizQuestion } from "../content.config";

export const prerender = true;

type QuizEntry = CollectionEntry<"quizzes">;

const trimSearchText = (value: string) => value.replace(/\s+/g, " ").trim();

export const GET: APIRoute = async () => {
  const allEntries = await getCollectionCached("quizzes", { getCollection });
  const entries = allEntries as QuizEntry[];
  const documents = entries
    .filter((entry) => !entry.data.draft)
    .map((entry) => {
      const questions = entry.data.questions.map(
        (question: QuizQuestion) => question.question
      );
      const answers = entry.data.questions.flatMap(
        (question: QuizQuestion) => question.options
      );
      const explanations = entry.data.questions.map(
        (question: QuizQuestion) => question.explanation
      );

      return {
        id: entry.id,
        type: "Quiz",
        title: entry.data.title,
        desc: entry.data.description ?? "",
        url: `/${entry.id}`,
        category: entry.data.category,
        difficulty: Array.from(
          new Set(
            entry.data.questions.map((question: QuizQuestion) => question.difficulty)
          )
        ),
        topics: entry.data.featuredTopics,
        questions,
        answers,
        explanations: explanations.map(trimSearchText),
      };
    });

  const index = await buildSearchIndex({
    schema: {
      type: "string",
      title: "string",
      desc: "string",
      url: "string",
      category: "string",
      difficulty: "string[]",
      topics: "string[]",
      questions: "string[]",
      answers: "string[]",
      explanations: "string[]",
    },
    documents,
    language: "english",
  });

  return new Response(JSON.stringify(index), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
