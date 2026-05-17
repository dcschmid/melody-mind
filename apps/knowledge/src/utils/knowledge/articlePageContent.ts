import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { getCollectionCached } from "@shared-utils/utils/content/getCollectionCached";
import { getReadingTime } from "@shared-utils/utils/readingTime";
import { loggers } from "@shared-utils/utils/logging";
import type { ResolvedKnowledgeEntry } from "./articlePageTypes";

type KnowledgeEntry = CollectionEntry<"knowledge-en">;

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export async function getKnowledgeArticleStaticPaths() {
  const entries = (await getCollectionCached("knowledge-en", {
    getCollection,
  }).catch((e: unknown) => {
    loggers.pages.warn("knowledge article: collection load issue (paths)", {
      error: getErrorMessage(e),
    });
    return [];
  })) as KnowledgeEntry[];
  const paths: Array<{ params: { slug: string }; props: { entry: KnowledgeEntry } }> = [];

  for (const entry of entries) {
    const slug = entry?.id;
    if (!slug) {
      continue;
    }
    paths.push({ params: { slug }, props: { entry } });
  }

  return paths;
}

export async function resolveKnowledgeArticleEntry(params: {
  entry?: KnowledgeEntry;
  slug: string | undefined;
  lang: string;
}): Promise<ResolvedKnowledgeEntry | null> {
  const { entry: initialEntry, slug, lang } = params;
  let entry: KnowledgeEntry | undefined = initialEntry;

  if (!entry && slug) {
    try {
      const articles = (await getCollectionCached("knowledge-en", {
        getCollection,
      })) as KnowledgeEntry[];
      entry = articles.find((article) => article.id === slug);
    } catch (e) {
      loggers.pages.warn("knowledge article: collection load issue (resolve)", {
        error: getErrorMessage(e),
      });
    }
  }

  if (!entry?.data?.title || !entry?.data?.description) {
    return null;
  }

  if (!entry.data.readingTime && entry.body) {
    try {
      entry = {
        ...entry,
        data: {
          ...entry.data,
          readingTime: getReadingTime(entry.body || "", { languageCode: lang }).minutes,
        },
      };
    } catch {
      // ignore reading time calculation errors
    }
  }

  return entry as ResolvedKnowledgeEntry;
}
