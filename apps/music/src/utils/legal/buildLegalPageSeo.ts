import {
  buildPageSeo,
  type PageSeoResult,
  type StructuredData,
} from "@utils/seo/buildPageSeo";
import { resolveBaseUrl, resolvePageUrl } from "@utils/siteUrls";

import { musicDefaultOgImageUrl } from "../musicImages";

interface BuildLegalPageSeoArgs {
  site: URL | undefined;
  path: string;
  title: string;
  description: string;
  imageAlt: string;
  fallbackKeywords: string[];
  maxDescription: number;
  modifiedDate?: Date;
}

export const buildLegalPageSeo = ({
  site,
  path,
  title,
  description,
  imageAlt,
  fallbackKeywords,
  maxDescription,
  modifiedDate,
}: BuildLegalPageSeoArgs): PageSeoResult => {
  const currentUrl = resolvePageUrl(site, path);
  const baseUrl = resolveBaseUrl(site);
  const breadcrumbs = [
    { name: "Home", url: resolvePageUrl(site, "/") },
    { name: title, url: currentUrl },
  ];

  return buildPageSeo({
    title,
    description,
    url: currentUrl,
    contentKind: "generic",
    breadcrumbs,
    structuredData: [] as StructuredData[],
    enrichedParts: [title, description],
    descriptionSource: "base",
    fallbackKeywords,
    keywordLimit: 24,
    maxDescription,
    image: new URL(musicDefaultOgImageUrl, `${baseUrl}/`).toString(),
    imageAlt,
    index: false,
    follow: true,
    autoSocialImage: false,
    authorName: "MelodyMind",
    ...(modifiedDate ? { modifiedDate } : {}),
  });
};
