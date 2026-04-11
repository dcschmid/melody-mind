export type StructuredDataExtra = unknown[] | unknown;

export interface OpenGraphMeta {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  image?: string;
  imageType?: string;
  locale?: string;
}

export interface TwitterMeta {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
  creator?: string;
}
