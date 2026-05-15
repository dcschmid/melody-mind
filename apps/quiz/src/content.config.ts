import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const difficultyEnum = ["easy", "medium", "hard"] as const;
const quizCategoryEnum = ["decade", "genre-evolution", "mixed"] as const;
const questionTypeEnum = ["single-choice", "multi-choice", "true-false"] as const;

// Quiz question schema
const quizQuestionSchema = z.object({
  question: z.string(),
  type: z.enum(questionTypeEnum),
  difficulty: z.enum(difficultyEnum),
  options: z.array(z.string()),
  correct: z.union([z.number(), z.array(z.number()), z.boolean()]),
  explanation: z.string(),
  source: z.string(),
  sourceLine: z.number().optional(),
});

// Quiz collection schema
const getQuizSchema = (_ctx: SchemaContext) =>
  z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    featuredTopics: z.array(z.string()).default([]),
    category: z.enum(quizCategoryEnum),
    relatedArticles: z.array(z.string()).min(1),
    questions: z.array(quizQuestionSchema).min(50).max(100),
    questionsPerSession: z.number().default(20),
    passingScore: z.number().default(70),
    timeLimit: z.number().optional(),
    draft: z.boolean().default(false),
  });

// Quiz collection
const quizCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/quizzes" }),
  schema: getQuizSchema,
});

// Define collections
export const collections = {
  quizzes: quizCollection,
} as const;

// Type definitions
export type QuizData = z.infer<ReturnType<typeof getQuizSchema>>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
