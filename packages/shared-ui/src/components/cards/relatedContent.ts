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
