import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { musicTaxonomy } from "./data/musicTaxonomy";

const taxonomySubsectionIds = new Set(
  musicTaxonomy.flatMap((section) =>
    section.subsections.map((subsection) => subsection.id)
  )
);

const taxonomyGroupIdsBySubsection = new Map(
  musicTaxonomy.flatMap((section) =>
    section.subsections.map((subsection) => [
      subsection.id,
      new Set((subsection.groups || []).map((group) => group.id)),
    ])
  )
);

const getKnowledgeSchema = (_ctx: SchemaContext) =>
  z
    .object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()).default([]),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      readingTime: z.number().optional(),
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
      takeaways: z.array(z.string()).max(4).optional(),
      draft: z.boolean().default(false),
      aiGenerated: z.boolean().default(false),
      aiTools: z.array(z.string()).optional(),
      taxonomySubsection: z.string().optional(),
      taxonomyGroup: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.taxonomySubsection &&
        !taxonomySubsectionIds.has(data.taxonomySubsection)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["taxonomySubsection"],
          message: `Unknown taxonomySubsection "${data.taxonomySubsection}".`,
        });
      }

      if (data.taxonomyGroup && !data.taxonomySubsection) {
        ctx.addIssue({
          code: "custom",
          path: ["taxonomyGroup"],
          message: "taxonomyGroup requires a taxonomySubsection.",
        });
        return;
      }

      if (data.taxonomyGroup && data.taxonomySubsection) {
        const validGroups =
          taxonomyGroupIdsBySubsection.get(data.taxonomySubsection) || new Set();

        if (!validGroups.has(data.taxonomyGroup)) {
          ctx.addIssue({
            code: "custom",
            path: ["taxonomyGroup"],
            message: `Unknown taxonomyGroup "${data.taxonomyGroup}" for taxonomySubsection "${data.taxonomySubsection}".`,
          });
        }
      }
    });

// Knowledge collection
const knowledgeCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/knowledge-en" }),
  schema: getKnowledgeSchema,
});

// Define collections
export const collections = {
  "knowledge-en": knowledgeCollection,
} as const;

// Type definitions
export type KnowledgeData = z.infer<ReturnType<typeof getKnowledgeSchema>>;
