import type { RenderedContent } from "astro:content";
import type { IconName } from "@shared-ui/components/visual/Icon.astro";

export interface ArticleHeroLink {
  href?: string | null;
  label: string;
  icon?: IconName;
  variant?: "primary" | "secondary";
  ariaLabel?: string;
}

export interface KnowledgeArticleLike {
  id?: string;
  slug?: string;
  body?: string;
  data?: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    keywords?: unknown[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
    readingTime?: number;
    taxonomySubsection?: string;
    taxonomyGroup?: string;
    takeaways?: string[];
    author?: string;
    aiGenerated?: boolean;
    aiTools?: string[];
    playlists?: {
      spotifyPlaylist?: string;
      deezerPlaylist?: string;
    };
    podcastSlug?: string;
    podcast?: string;
    podcastUrl?: string;
  };
}

export interface ResolvedKnowledgeEntry extends KnowledgeArticleLike {
  collection: "knowledge-en";
  filePath?: string;
  rendered?: RenderedContent;
  id: string;
  body?: string;
  data: NonNullable<KnowledgeArticleLike["data"]> & {
    title: string;
    description: string;
  };
}

export interface RelatedKnowledgeArticle {
  id: string;
  title: string;
  description: string;
  image?: string | import("astro").ImageMetadata;
  createdAt: Date;
  readingTime: number;
}
