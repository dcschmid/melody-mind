import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const httpsUrl = z.url().refine((url) => url.startsWith("https://"), "Use HTTPS.");
export const sourceSchema = z
  .object({
    id: slug,
    title: z.string().min(4),
    type: z
      .enum(["book", "journal", "interview", "archive", "website"])
      .default("website"),
    author: z.string().min(2).optional(),
    publisher: z.string().min(2),
    publishedAt: z.string().min(4).optional(),
    url: httpsUrl.optional(),
    accessedAt: z.coerce.date().optional(),
  })
  .superRefine((entry, context) => {
    if (entry.type === "website" && !entry.url) {
      context.addIssue({ code: "custom", message: "Online sources require a URL." });
    }
    if (entry.type === "website" && !entry.accessedAt) {
      context.addIssue({
        code: "custom",
        message: "Online sources require an access date.",
      });
    }
  });
const related = z.object({
  id: slug,
  reason: z.string().min(25).max(180),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/articles" }),
  schema: ({ image }) =>
    z.object({
      section: z.enum(["production", "listening", "rhythm", "genre-history"]),
      title: z.string().min(3),
      dek: z.string().min(60).max(260),
      seoDescription: z.string().min(100).max(165),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      byline: z.literal("MelodyMind Editorial"),
      featuredOrder: z.number().int().min(1).max(8),
      topics: z.array(z.string().min(2)).min(2).max(8),
      learningGoals: z.array(z.string().min(20)).min(2).max(5),
      hero: z
        .object({
          image: image(),
          alt: z.string().min(20).max(180),
          caption: z.string().min(20).max(260),
          rights: z.string().min(20).max(260),
        })
        .optional(),
      readingMinutes: z.number().int().min(20).max(35),
      related: z.array(related).max(5).default([]),
      sources: z.array(sourceSchema).min(15),
      draft: z.boolean().default(false),
    }),
});

export const collections = { articles };
