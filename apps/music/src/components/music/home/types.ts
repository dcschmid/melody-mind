import type { ImageMetadata } from "astro";

export type CoverImage = string | ImageMetadata;

export interface Entry {
  id: string;
  title: string;
  description: string;
  imageSrc: CoverImage;
  imageUrl: string;
  imageWidth: number | undefined;
  imageHeight: number | undefined;
  publishedAt: string;
  publishedAtTime: number;
  genre: string | undefined;
  mainGenre: string | undefined;
  trackCount: number;
  totalDurationSeconds: number;
  totalDurationLabel: string;
  isVisible: boolean;
}

export interface HeroItem {
  id: string;
  title: string;
  imageSrc: CoverImage;
  imageUrl: string;
  imageWidth: number | undefined;
  imageHeight: number | undefined;
}
