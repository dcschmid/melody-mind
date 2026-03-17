import { z } from 'zod';

export const EpisodeEntrySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  imageUrl: z.string().min(1),
  durationSeconds: z.number().optional(),
  publishedAt: z.string().min(1),
  publishedLabel: z.string().min(1),
  isLatest: z.boolean(),
  searchText: z.string().optional(),
});

export const EpisodeArraySchema = z.array(EpisodeEntrySchema);

export type EpisodeEntry = z.infer<typeof EpisodeEntrySchema>;
