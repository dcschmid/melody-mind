import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const songBaseSchema = z.object({
  title: z.string(),
  audioUrl: z.string(),
  durationSeconds: z.number().optional(),
  trackNumber: z.number(),
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
    zipUrl: z.string().url().optional(),
  }),
});

export const collections = {
  albums,
};
