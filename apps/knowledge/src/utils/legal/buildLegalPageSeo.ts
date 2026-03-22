import {
  buildPageSeo,
  type PageSeoResult,
  type StructuredData,
} from "@shared-utils/utils/seo/buildPageSeo";
import { resolvePageUrl } from "@shared-utils/utils/siteUrls";

type BuildLegalPageSeoArgs = {
  site: URL | undefined;
  path: string;
  title: string;
  description: string;
  imageAlt: string;
  fallbackKeywords: string[];
  maxDescription: number;
  modifiedDate?: Date;
};

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
    fallbackKeywords,
    keywordLimit: 24,
    maxDescription,
    image: "/knowledge.png",
    imageAlt,
    index: false,
    follow: true,
    autoSocialImage: false,
    authorName: "Melody Mind",
    ...(modifiedDate ? { modifiedDate } : {}),
  });
};
