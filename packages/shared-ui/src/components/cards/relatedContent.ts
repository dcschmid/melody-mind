import type { ImageMetadata } from "astro";
import type { IconName } from "@shared-ui/components/visual/Icon.astro";

export interface ContentCardMetaItem {
  label: string;
  iconName?: IconName;
  datetime?: string;
}

export interface RelatedContentCardItem {
  id: string;
  title: string;
  description: string;
  href: string;
  imageSrc?: string | ImageMetadata;
  imageAlt?: string;
  metaItems?: ContentCardMetaItem[];
  ctaSrText?: string;
}

export interface RelatedArticleCardInput {
  id: string;
  title: string;
  description: string;
  href: string;
  imageSrc?: string | ImageMetadata;
  imageAlt?: string;
  ctaSrText?: string;
  publishedAt: Date;
  readingTimeMinutes?: number;
  locale?: string;
}

function buildReadingDateMetaItems(params: {
  publishedAt: Date;
  readingTimeMinutes?: number;
  locale?: string;
}): ContentCardMetaItem[] {
  const { publishedAt, readingTimeMinutes, locale = "en" } = params;
  const metaItems: ContentCardMetaItem[] = [];

  if (typeof readingTimeMinutes === "number" && Number.isFinite(readingTimeMinutes)) {
    metaItems.push({
      iconName: "clock",
      label: `${readingTimeMinutes} min read`,
    });
  }

  metaItems.push({
    iconName: "calendar",
    label: publishedAt.toLocaleDateString(locale, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    datetime: publishedAt.toISOString(),
  });

  return metaItems;
}

export function buildRelatedArticleCardItem(
  input: RelatedArticleCardInput
): RelatedContentCardItem {
  const {
    id,
    title,
    description,
    href,
    imageSrc,
    imageAlt,
    ctaSrText = "Opens content",
    publishedAt,
    readingTimeMinutes,
    locale = "en",
  } = input;

  return {
    id,
    title,
    description,
    href,
    ...(imageSrc !== undefined && { imageSrc }),
    imageAlt: imageAlt ?? (title ? `Cover image for ${title}` : ""),
    ctaSrText,
    metaItems: buildReadingDateMetaItems({
      publishedAt,
      ...(typeof readingTimeMinutes === "number" && { readingTimeMinutes }),
      locale,
    }),
  };
}
