import type { ContentCardMetaItem } from "@shared-ui/components/cards/contentCard";

export interface RelatedContentCardItem {
  id: string;
  title: string;
  description: string;
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  metaItems?: ContentCardMetaItem[];
  ctaSrText?: string;
}
