import { defineCollection, type SchemaContext, z } from "astro:content";
import { glob } from "astro/loaders";

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
  });

const knowledgeCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/knowledge-en" }),
  schema: getKnowledgeSchema,
});

const keySongSchema = z.union([
  z.string(),
  z.object({
    title: z.string(),
    spotifyId: z.string().optional(),
    deezerId: z.string().optional(),
  }),
]);

const artistCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artists" }),
  schema: z.object({
    name: z.string(),
    photo: z.string().optional(),
    biography: z.string(),
    born: z.string().optional(),
    died: z.string().optional(),
    origin: z.string(),
    genres: z.array(z.string()).default([]),
    influencedBy: z.array(z.string()).default([]),
    influenced: z.array(z.string()).default([]),
    keyAlbums: z.array(z.string()).default([]),
    keySongs: z.array(keySongSchema).default([]),
    relatedArticles: z.array(z.string()).default([]),
    discographyOverview: z.string().optional(),
    careerTimeline: z
      .array(
        z.object({
          year: z.string(),
          event: z.string(),
        })
      )
      .default([]),
  }),
});

// Export a concrete base schema instance for external type inference (referenced in env.d.ts)
export const baseKnowledgeSchema = getKnowledgeSchema({} as SchemaContext);

// Define collections
export const collections = {
  "knowledge-en": knowledgeCollection,
  artists: artistCollection,
} as const;

// Type definitions
export type KnowledgeData = z.infer<ReturnType<typeof getKnowledgeSchema>>;
export type CollectionKey = keyof typeof collections;
export type Difficulty = (typeof difficultyEnum)[number];

// Helper type for knowledge-specific collection keys
export type KnowledgeCollectionKey = Extract<CollectionKey, `knowledge-${string}`>;
