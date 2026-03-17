import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Podcast Collection Schema
 *
 * Each podcast episode is an MDX file with frontmatter for metadata
 * and body content for show notes (Markdown).
 */
const podcasts = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/podcasts',
  }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    audioUrl: z.string().url(),
    imageUrl: z.string(),
    publishedAt: z.coerce.date(),
    language: z.string().default('en'),
    isAvailable: z.boolean().default(true),
    durationSeconds: z.number().optional(),
    episodeNumber: z.number().optional(),
    knowledgeUrl: z.string().url().optional(),
    subtitleUrl: z.string().url().optional(),
    metaDescription: z.string().optional(),
    seriesName: z.string().optional(),
    fileSizeBytes: z.number().optional(),
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
  }),
});

export const collections = {
  podcasts,
};
