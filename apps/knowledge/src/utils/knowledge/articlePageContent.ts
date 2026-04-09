import { getCollection } from "astro:content";
import { getCollectionCached } from "@shared-utils/utils/content/getCollectionCached";
import { getReadingTime } from "@shared-utils/utils/readingTime";
import { loggers } from "@shared-utils/utils/logging";
import type { ResolvedKnowledgeEntry } from "./articlePageTypes";

export async function getKnowledgeArticleStaticPaths() {
  const entries: any[] = await getCollectionCached("knowledge-en", {
    getCollection,
  }).catch((e) => {
    loggers.pages.warn("knowledge article: collection load issue (paths)", {
      error: (e as Error)?.message || e,
    });
    return [];
  });
  const paths: Array<{ params: { slug: string }; props: { entry: any } }> = [];

  for (const entry of entries) {
    const slug = entry?.slug || entry?.id;
    if (!slug) {
      continue;
    }

    paths.push({ params: { slug }, props: { entry } });
  }

  return paths;
}

export async function resolveKnowledgeArticleEntry(params: {
  entry?: any;
  slug: string | undefined;
  lang: string;
}): Promise<ResolvedKnowledgeEntry | null> {
  const { entry: initialEntry, slug, lang } = params;
  let entry = initialEntry;

  if (!entry) {
    try {
      const articles: any[] = await getCollectionCached("knowledge-en", {
        getCollection,
      }).catch((e) => {
        loggers.pages.warn("knowledge article: collection load issue (resolve)", {
          error: (e as Error)?.message || e,
        });
        return [];
      });
      if (slug) {
        entry = articles.find((article) => article.slug === slug || article.id === slug);
      }
    } catch (e) {
      loggers.pages.warn("knowledge article: collection load issue (fallback)", {
        error: (e as Error)?.message || e,
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
