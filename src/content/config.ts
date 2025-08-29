import { defineCollection, type SchemaContext, z } from "astro:content";

export const difficultyEnum = ["easy", "medium", "hard"] as const;

const getKnowledgeSchema = (_ctx: SchemaContext): z.ZodObject<z.ZodRawShape> =>
  z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).default([]),
    image: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    readingTime: z.number().optional(),
    author: z.string().optional(),
    locale: z.string().optional(),
    category: z
      .object({
        spotifyPlaylist: z.string().optional(),
        deezerPlaylist: z.string().optional(),
        appleMusicPlaylist: z.string().optional(),
      })
      .optional(),
    isPlayable: z.boolean().default(false),
    draft: z.boolean().default(false),
  });

const knowledgeCollection = defineCollection({
  type: "content",
  schema: getKnowledgeSchema,
});

// Define collections
export const collections = {
  "knowledge-cn": knowledgeCollection,
  "knowledge-jp": knowledgeCollection,
  "knowledge-de": knowledgeCollection,
  "knowledge-en": knowledgeCollection,
  "knowledge-es": knowledgeCollection,
  "knowledge-fr": knowledgeCollection,
  "knowledge-it": knowledgeCollection,
  "knowledge-pt": knowledgeCollection,
  "knowledge-da": knowledgeCollection,
  "knowledge-nl": knowledgeCollection,
  "knowledge-sv": knowledgeCollection,
  "knowledge-fi": knowledgeCollection,
  "knowledge-ru": knowledgeCollection,
} as const;

// Type definitions
export type KnowledgeData = z.infer<ReturnType<typeof getKnowledgeSchema>>;
export type CollectionKey = keyof typeof collections;
export type Difficulty = (typeof difficultyEnum)[number];

// Helper type for knowledge-specific collection keys
export type KnowledgeCollectionKey = Extract<CollectionKey, `knowledge-${string}`>;
