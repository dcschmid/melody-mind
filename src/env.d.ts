// import type { AstroGlobal } from "astro";
/// <reference types="astro/client" />

// Fathom Analytics interface
interface Fathom {
  trackEvent: (eventName: string, options?: { _value?: number }) => void;
  trackPageview: (options?: { url?: string; referrer?: string }) => void;
}

// Extend the Window interface to include Fathom
declare interface Window {
  fathom?: Fathom;
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
    | "pt"
    | "da"
    | "nl"
    | "sv"
    | "fi";
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
