/**
 * Simplified SEO Page Builder for Quiz App
 * Returns a pageSeo object compatible with Layout.astro
 */

export type StructuredData = Record<string, unknown>;

export interface BuildPageSeoParams {
  title: string;
  description: string;
  url: string;
  contentKind?: "generic" | "quiz";
  breadcrumbs?: Array<{ name: string; url: string }>;
  structuredData?: StructuredData[];
  fallbackKeywords?: string[];
  index?: boolean;
  follow?: boolean;
  image?: string;
}

export interface PageSeoResult {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  image?: string;
  type: "website" | "article" | "music" | "game" | "podcastEpisode";
  robots: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
    image?: string;
    locale?: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image?: string;
    creator?: string;
  };
  structuredData: StructuredData[];
  publishDate?: Date;
  modifiedDate?: Date;
  ogLocale?: string;
  alternateLocales?: string[];
  authorName?: string;
  imageAlt?: string;
}

const BRAND_SUFFIX = " - MelodyMind Quiz";

function ensureBrandSuffix(title: string): string {
  return title.endsWith(BRAND_SUFFIX) ? title : `${title}${BRAND_SUFFIX}`;
}

export function buildPageSeo(params: BuildPageSeoParams): PageSeoResult {
  const {
    title,
    description,
    url,
    structuredData = [],
    fallbackKeywords = [],
    index = true,
    follow = true,
    image,
  } = params;

  const brandedTitle = ensureBrandSuffix(title);
  const keywords = fallbackKeywords.join(", ");
  const robots = [index ? "index" : "noindex", follow ? "follow" : "nofollow"].join(", ");

  return {
    title: brandedTitle,
    description,
    keywords,
    canonical: url,
    image: image || "/melody-mind.png",
    type: "website",
    robots,
    openGraph: {
      title: brandedTitle,
      description,
      type: "website",
      url,
      image: image || "/melody-mind.png",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      image: image || "/melody-mind.png",
    },
    structuredData,
  };
}

export type { BuildPageSeoParams as PageSeoParams };
