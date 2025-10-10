// import type { AstroGlobal } from "astro";
/// <reference types="astro/client" />

// Fathom Analytics interface
interface Fathom {
  trackEvent: (eventName: string, options?: { _value?: number }) => void;
  trackPageview: (options?: { url?: string; referrer?: string }) => void;
}

interface ShowEndOverlayConfig {
  score: number;
  maxScore?: number;
  // Allow arbitrary enhancement details without strict typing for resilience
  [key: string]: unknown;
}

type ShowEndOverlayFn = ((config: ShowEndOverlayConfig) => Promise<void> | void) &
  ((score: number, maxScore?: number) => Promise<void> | void);

// Extend the Window interface to include global analytics & overlay helpers
declare interface Window {
  fathom?: Fathom;
  showEndOverlay?: ShowEndOverlayFn;
  mmForceReflow?: (el: Element | null) => void;
  announceAssertive?: (msg: string) => void;
  __resolveAchievement?: (score: number) => { id: string; minScore: number };
  __mmDebug?: (...args: unknown[]) => void;
}

declare namespace App {
  interface Locals {
    // No authentication needed anymore
    // This empty interface is intentional for future extensibility
    _placeholder?: never;
  }
}

declare module "astro:content" {
  interface Render {
    ".md": Promise<{
      Content: import("astro").MarkdownComponent;
      headings: import("astro").MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, unknown>;
    }>;
  }

  type BaseSchema = import("astro/zod").z.infer<
    typeof import("./content/config").baseKnowledgeSchema
  >;

  export type KnowledgeLanguage =
    | "de"
    | "en"
    | "es"
    | "fr"
    | "it"
    | "pt";
  export type KnowledgeCollectionKey = `knowledge-${KnowledgeLanguage}`;

  export type CollectionEntry<C extends KnowledgeCollectionKey> = {
    id: string;
    collection: C;
    data: BaseSchema;
    body: string;
    slug: string;
    render(): Promise<Render[".md"]>;
  };

  export type CollectionEntries<C extends KnowledgeCollectionKey> = {
    [K in C]: CollectionEntry<K>;
  }[C][];

  export type AnyCollectionEntry = CollectionEntry<KnowledgeCollectionKey>;
  export type AnyCollectionEntries = CollectionEntries<KnowledgeCollectionKey>;

  export type DataEntryMap = {
    [C in KnowledgeCollectionKey]: CollectionEntry<C>;
  };
}
