import type { RenderedContent } from "astro:content";
import type { IconName } from "@shared-ui/components/visual/Icon.astro";

/**
 * Search-focused title overrides for specific high-value knowledge articles.
 * The visible page headline can stay editorial while the title tag stays descriptive.
 */
const KNOWLEDGE_ARTICLE_SEO_TITLE_OVERRIDES: Record<string, string> = {
  "1960s": "1960s Music History: Pop, Protest and Psychedelia",
  "1980s": "1980s Music History: MTV, Synths and Global Pop",
  "2010s": "2010s Music History: Streaming and Global Pop",
  "from-asia-pop-to-global-pop": "J-Pop and K-Pop: From Regional Scenes to Global Pop",
  "from-blues-to-breakdown": "Heavy Music History: From Blues to Metalcore",
  "from-folk-to-bedroom-pop": "Intimate Songwriting: From Folk to Bedroom Pop",
  "from-gospel-to-modern-vocal-pop-": "Gospel to Modern Vocal Pop",
  "from-hip-hop-to-trap-drill": "Hip Hop History: Block Parties, Trap and Drill",
  "from-jazz-to-neo-soul": "Jazz to Neo Soul: Fusion, Acid Jazz and Modern Soul",
  "from-latin-to-latin-trap": "Latin Music History: From Salsa to Latin Trap",
  "from-pop-to-streaming-pop": "Pop Music History: From Radio to Streaming",
  "from-post-punk-to-industrial-metal":
    "Industrial Rock History: From Post-Punk to Metal",
  "from-punk-to-indie": "Alternative Music: From Punk to Indie",
  "from-ska-to-global-bass": "Jamaican Music History: From Ska to Global Bass",
  "from-soul-to-modern-dance-music": "Dance Music History: From Soul to House and Techno",
};

export { KNOWLEDGE_ARTICLE_SEO_TITLE_OVERRIDES };

export interface LinkPanelItem {
  href: string;
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

export interface ArticleHeroLink extends Omit<LinkPanelItem, "href"> {
  href?: string | null;
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
  slug: string;
  title: string;
  description: string;
  image?: string | import("astro").ImageMetadata;
  createdAt: Date;
  readingTime: number;
}
