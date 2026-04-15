import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const songSchema = z.object({
  title: z.string(),
  audioUrl: z.string(),
  lyricsUrl: z.string().optional(),
  durationSeconds: z.number().optional(),
  trackNumber: z.number(),
});

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
