import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { validateStoryRelationships } from "@utils/contentValidation";

const httpsUrl = z.url().refine((url) => url.startsWith("https://"), {
  message: "URLs must use HTTPS.",
});

const imageRightsSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  image: z.any(),
  alt: z.string().trim().min(20),
  caption: z.string().trim().min(20),
  creator: z.string().trim().min(2),
  sourceName: z.string().trim().min(2),
  sourceUrl: httpsUrl,
  license: z.string().trim().min(2),
  licenseUrl: httpsUrl,
  alterations: z.string().trim().min(2),
});

const sourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(5),
  publisher: z.string().trim().min(2),
  url: httpsUrl,
  accessedAt: z.coerce.date(),
});

const artifactSchema = z.object({
  type: z.literal("annotated-artifact"),
  imageId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().trim().min(10),
  markers: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        number: z.number().int().min(1).max(5),
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
        title: z.string().trim().min(3),
        text: z.string().trim().min(30),
        sourceRefs: z.array(z.string()).min(1),
      })
    )
    .length(5),
});

const stories = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/stories",
  }),
  schema: ({ image }) =>
    z
      .object({
        format: z.enum([
          "artist-portrait",
          "scene-report",
          "cover-story",
          "technology-story",
          "instrument-story",
        ]),
        title: z.string().trim().min(12),
        dek: z.string().trim().min(60).max(240),
        seoDescription: z.string().trim().min(100).max(165),
        publishedAt: z.coerce.date(),
        topics: z.array(z.string().trim().min(2)).min(2).max(6),
        byline: z.literal("MelodyMind Editorial"),
        draft: z.boolean().default(false),
        hero: imageRightsSchema.extend({ image: image() }),
        figures: z
          .array(imageRightsSchema.extend({ image: image() }))
          .min(5)
          .max(7),
        sources: z.array(sourceSchema).min(3),
        artifact: artifactSchema.optional(),
      })
      .superRefine((story, ctx) => {
        for (const issue of validateStoryRelationships(story)) {
          ctx.addIssue({
            code: "custom",
            path: issue.path,
            message: issue.message,
          });
        }

        if (story.artifact) {
          const numbers = story.artifact.markers.map((marker) => marker.number);
          if (new Set(numbers).size !== 5) {
            ctx.addIssue({
              code: "custom",
              path: ["artifact", "markers"],
              message: "Artifact marker numbers must be unique from 1 through 5.",
            });
          }
        }
      }),
});

export const collections = { stories };
