import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { validateReviewRelationships } from "@utils/contentValidation";

const httpsUrl = z.url().refine((url) => url.startsWith("https://"), {
  message: "URLs must use HTTPS.",
});
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const sources = z.object({
  id: slug,
  title: z.string().trim().min(4),
  publisher: z.string().trim().min(2),
  url: httpsUrl,
  accessedAt: z.coerce.date(),
});

const reviewMapPoint = z.object({
  trackNumber: z.number().int().min(1).max(99),
  trackTitle: z.string().trim().min(1),
  label: z.string().trim().min(3).max(60),
  target: slug,
});

const listeningLink = z.object({
  provider: z.string().trim().min(2).max(30),
  url: httpsUrl,
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string().trim().min(2),
    role: z.string().trim().min(3),
    shortBio: z.string().trim().min(60).max(240),
    interests: z.array(z.string().trim().min(2)).min(2).max(6),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/reviews" }),
  schema: z
    .object({
      format: z.enum(["full-review", "album-of-the-week", "reappraisal"]),
      title: z.string().trim().min(5),
      dek: z.string().trim().min(60).max(240),
      seoDescription: z.string().trim().min(100).max(165),
      thesis: z.string().trim().min(60).max(260),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: reference("authors"),
      album: z.object({
        title: z.string().trim().min(1),
        artist: z.string().trim().min(1),
        releasedAt: z.coerce.date(),
        label: z.string().trim().min(1),
        genres: z.array(z.string().trim().min(2)).min(1).max(5),
        trackCount: z.number().int().min(1).max(99),
        runtime: z.string().regex(/^\d{1,3}:\d{2}$/),
      }),
      strengths: z.array(z.string().trim().min(15)).min(1).max(3),
      limits: z.array(z.string().trim().min(15)).min(1).max(3),
      reviewMap: z.array(reviewMapPoint).min(3).max(5),
      listeningLinks: z.array(listeningLink).min(1).max(5),
      sources: z.array(sources).min(2),
      furtherReading: z
        .object({
          label: z.string().trim().min(4),
          url: httpsUrl,
        })
        .optional(),
      cover: z.discriminatedUnion("mode", [
        z.object({
          mode: z.literal("typographic"),
          rightsNote: z.string().trim().min(30),
        }),
        z.object({
          mode: z.literal("original"),
          src: z.string().regex(/^\/covers\/[a-z0-9-]+\.jpg$/),
          alt: z.string().trim().min(20).max(160),
          sourceLabel: z.string().trim().min(2).max(80),
          sourceUrl: httpsUrl,
          rightsNote: z.string().trim().min(30),
        }),
      ]),
      draft: z.boolean().default(false),
      currentAlbumOfTheWeek: z.boolean().default(false),
    })
    .superRefine((review, ctx) => {
      for (const issue of validateReviewRelationships(review)) {
        ctx.addIssue({ code: "custom", path: issue.path, message: issue.message });
      }
    }),
});

export const collections = { authors, reviews };
