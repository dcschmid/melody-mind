import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const songBaseSchema = z.object({
  title: z.string(),
  audioUrl: z.string(),
  durationSeconds: z.number().optional(),
  trackNumber: z.number(),
  description: z.string().optional(),
});

const songSchema = songBaseSchema
  .extend({
    lyricsUrl: z.string().optional(),
    isInstrumental: z.boolean().optional(),
    transcriptUnavailableReason: z.string().trim().min(1).optional(),
  })
  .superRefine((song, ctx) => {
    if (song.lyricsUrl || song.isInstrumental || song.transcriptUnavailableReason) {
      return;
    }

    ctx.addIssue({
      code: "custom",
      message:
        "Each playable track requires lyricsUrl, isInstrumental, or transcriptUnavailableReason.",
      path: ["lyricsUrl"],
    });
  });

const albums = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/albums",
  }),
  schema: z.object({
    title: z.string(),
    description: z
      .string()
      .trim()
      .min(80, "Album descriptions must contain at least 80 characters."),
    coverImage: z.string(),
    coverImageWidth: z.number().optional(),
    coverImageHeight: z.number().optional(),
    publishedAt: z.coerce.date(),
    genre: z.string().optional(),
    mainGenre: z.string().optional(),
    moods: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    language: z.string().optional(),
    era: z.string().optional(),
    energy: z.enum(["low", "medium", "high"]).optional(),
    artist: z.string().default("MelodyMind AI"),
    isAvailable: z.boolean().default(true),
    songs: z.array(songSchema),
    zipUrl: z.url().optional(),
  }),
});

const genres = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/genres",
  }),
  schema: z.object({
    order: z.number(),
    mainGenre: z.string(),
    title: z.string(),
    eyebrow: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).default([]),
  }),
});

const series = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/series",
  }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    eyebrow: z.string(),
    shortDescription: z.string(),
    keywords: z.array(z.string()).default([]),
    albumIds: z.array(z.string()).min(1),
  }),
});

export const collections = {
  albums,
  genres,
  series,
};
