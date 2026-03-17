import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const difficultyEnum = ["easy", "medium", "hard"] as const;
export const quizCategoryEnum = ["decade", "genre-evolution", "mixed"] as const;
export const questionTypeEnum = ["single-choice", "multi-choice", "true-false"] as const;

const getKnowledgeSchema = (_ctx: SchemaContext): z.ZodObject<z.ZodRawShape> =>
  z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).default([]),
    image: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    readingTime: z.number().optional(),
    category: z.string().optional(),
    author: z.string().optional(),
    locale: z.string().optional(),
    playlists: z
      .object({
        spotifyPlaylist: z.string().optional(),
        deezerPlaylist: z.string().optional(),
      })
      .optional(),
    podcast: z.string().optional(),
    podcastSlug: z.string().optional(),
    podcastUrl: z.string().optional(),
    takeaways: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    aiGenerated: z.boolean().default(false),
    aiTools: z.array(z.string()).optional(),
    // Taxonomy fields for hierarchical categorization
    taxonomySubsection: z.string().optional(),
    taxonomyGroup: z.string().optional(),
  });

// Quiz question schema
const quizQuestionSchema = z.object({
  question: z.string(),
  type: z.enum(questionTypeEnum),
  difficulty: z.enum(difficultyEnum), // Difficulty per question
  options: z.array(z.string()),
  correct: z.union([z.number(), z.array(z.number()), z.boolean()]),
  explanation: z.string(),
  source: z.string(), // Article slug
  sourceLine: z.number().optional(), // Line number in source article
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
    questions: z.array(quizQuestionSchema).min(20).max(100), // 20-100 questions in pool
    questionsPerSession: z.number().default(20), // Questions shown per session
    passingScore: z.number().default(70),
    timeLimit: z.number().optional(), // Seconds per question
    draft: z.boolean().default(false),
  });

// Knowledge collection
const knowledgeCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/knowledge-en" }),
  schema: getKnowledgeSchema,
});

// Quiz collection
const quizCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/quizzes" }),
  schema: getQuizSchema,
});

// Export a concrete base schema instance for external type inference (referenced in env.d.ts)
export const baseKnowledgeSchema = getKnowledgeSchema({} as SchemaContext);

// Define collections
export const collections = {
  "knowledge-en": knowledgeCollection,
  quizzes: quizCollection,
} as const;

// Type definitions
export type KnowledgeData = z.infer<ReturnType<typeof getKnowledgeSchema>>;
export type QuizData = z.infer<ReturnType<typeof getQuizSchema>>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type CollectionKey = keyof typeof collections;
export type Difficulty = (typeof difficultyEnum)[number];
export type QuizCategory = (typeof quizCategoryEnum)[number];
export type QuestionType = (typeof questionTypeEnum)[number];

// Helper type for knowledge-specific collection keys
export type KnowledgeCollectionKey = Extract<CollectionKey, `knowledge-${string}`>;
