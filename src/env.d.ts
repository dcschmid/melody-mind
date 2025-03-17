/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    // No authentication needed anymore
  }
}

declare module 'astro:content' {
  interface Render {
    '.md': Promise<{
      Content: import('astro').MarkdownComponent;
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }

  type BaseSchema = import('astro/zod').z.infer<typeof import('./content/config').baseKnowledgeSchema>;
  
  export type KnowledgeLanguage = 'de' | 'en' | 'es' | 'fr' | 'it' | 'pt' | 'da' | 'nl' | 'sv' | 'fi';
  export type KnowledgeCollectionKey = `knowledge-${KnowledgeLanguage}`;

  export type CollectionEntry<C extends KnowledgeCollectionKey> = {
    id: string;
    collection: C;
    data: BaseSchema;
    body: string;
    slug: string;
    render(): Promise<Render['.md']>;
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
