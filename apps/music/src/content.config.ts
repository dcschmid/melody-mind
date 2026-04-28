import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const songBaseSchema = z.object({
  title: z.string(),
  audioUrl: z.string(),
  durationSeconds: z.number().optional(),
  trackNumber: z.number(),
});

const songSchema = z.union([
  songBaseSchema.extend({
    lyricsUrl: z.string(),
    isInstrumental: z.boolean().optional(),
    transcriptUnavailableReason: z.string().optional(),
  }),
  songBaseSchema.extend({
    lyricsUrl: z.string().optional(),
    isInstrumental: z.literal(true),
    transcriptUnavailableReason: z.string().optional(),
  }),
  songBaseSchema.extend({
    lyricsUrl: z.string().optional(),
    isInstrumental: z.boolean().optional(),
    transcriptUnavailableReason: z.string().min(1),
  }),
]);

const albums = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/albums",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coverImage: z.string(),
    coverImageWidth: z.number().optional(),
    coverImageHeight: z.number().optional(),
    publishedAt: z.coerce.date(),
    genre: z.string().optional(),
    artist: z.string().default("MelodyMind AI"),
    isAvailable: z.boolean().default(true),
    songs: z.array(songSchema),
    metaDescription: z.string().optional(),
  }),
});

export const collections = {
  albums,
};
