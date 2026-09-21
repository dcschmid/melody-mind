import type { ImageMetadata } from "astro";
import type { IconName } from "@components/visual/Icon.astro";

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
  imageWidth?: number;
  imageHeight?: number;
  metaItems?: ContentCardMetaItem[];
  ctaSrText?: string;
}
