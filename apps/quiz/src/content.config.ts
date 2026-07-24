import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { QUESTION_DIFFICULTIES, QUESTION_TYPES } from "./types/quiz";

const sourceSchema = z.object({
  publisher: z.string().trim().min(2),
  title: z.string().trim().min(3),
  url: z.url().refine((url) => url.startsWith("https://"), {
    message: "Quiz sources must use HTTPS.",
  }),
  checkedAt: z.coerce.date(),
});

const questionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    question: z.string().trim().min(12),
    type: z.enum(QUESTION_TYPES),
    difficulty: z.enum(QUESTION_DIFFICULTIES),
    options: z.array(z.string().trim().min(1)).min(2).max(6),
    correct: z.union([z.number().int().nonnegative(), z.array(z.number()), z.boolean()]),
    explanation: z.string().trim().min(20),
    sources: z.array(sourceSchema).min(1),
  })
  .superRefine((question, ctx) => {
    const optionCount = question.type === "true-false" ? 2 : question.options.length;
    const correctIndexes =
      typeof question.correct === "boolean"
        ? [question.correct ? 0 : 1]
        : Array.isArray(question.correct)
          ? question.correct
          : [question.correct];

    if (question.type === "true-false" && typeof question.correct !== "boolean") {
      ctx.addIssue({
        code: "custom",
        path: ["correct"],
        message: "True/false questions require a boolean answer.",
      });
    }

    if (question.type === "single-choice" && typeof question.correct !== "number") {
      ctx.addIssue({
        code: "custom",
        path: ["correct"],
        message: "Single-choice questions require one answer index.",
      });
    }

    if (question.type === "multi-choice" && !Array.isArray(question.correct)) {
      ctx.addIssue({
        code: "custom",
        path: ["correct"],
        message: "Multi-choice questions require an array of answer indexes.",
      });
    }

    if (new Set(correctIndexes).size !== correctIndexes.length) {
      ctx.addIssue({
        code: "custom",
        path: ["correct"],
        message: "Correct answer indexes must be unique.",
      });
    }

    if (correctIndexes.some((index) => index < 0 || index >= optionCount)) {
      ctx.addIssue({
        code: "custom",
        path: ["correct"],
        message: "A correct answer index is outside the available options.",
      });
    }
  });

const quizzes = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/quizzes",
  }),
  schema: z
    .object({
      title: z.string().trim().min(3),
      description: z.string().trim().min(80),
      seoTitle: z.string().trim().optional(),
      seoDescription: z.string().trim().optional(),
      featuredTopics: z.array(z.string()).min(3).max(6),
      category: z.enum(["decade", "genre-evolution"]),
      questions: z.array(questionSchema).length(40),
      draft: z.boolean().default(false),
    })
    .superRefine((quiz, ctx) => {
      const ids = quiz.questions.map((question) => question.id);

      if (new Set(ids).size !== ids.length) {
        ctx.addIssue({
          code: "custom",
          path: ["questions"],
          message: "Question IDs must be unique within a quiz.",
        });
      }

      const requiredCounts = { easy: 4, medium: 4, hard: 2 } as const;
      for (const [difficulty, minimum] of Object.entries(requiredCounts)) {
        const count = quiz.questions.filter(
          (question) => question.difficulty === difficulty
        ).length;
        if (count < minimum) {
          ctx.addIssue({
            code: "custom",
            path: ["questions"],
            message: `Quiz needs at least ${minimum} ${difficulty} questions.`,
          });
        }
      }
    }),
});

export const collections = { quizzes };
