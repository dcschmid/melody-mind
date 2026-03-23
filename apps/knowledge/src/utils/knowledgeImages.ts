import type { ImageMetadata } from "astro";
import {
  buildImageMap,
  findAssetByFileName,
  normalizeImageKey,
  stripAssetQuery,
  toAbsoluteAssetUrl,
} from "@shared-utils/utils/imageAssets";

const knowledgeAssetModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const knowledgeCategoryModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/category/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const knowledgeTaxonomyModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/taxonomy/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const knowledgeCategoryImages = buildImageMap(knowledgeCategoryModules);
const knowledgeTaxonomyImages = buildImageMap(knowledgeTaxonomyModules);

const knowledgeBrandLogo = findAssetByFileName(
  knowledgeAssetModules,
  [
    "melody-mind.png",
    "melody-mind.webp",
    "melody-mind.avif",
    "melody-mind.jpg",
    "melody-mind.jpeg",
  ],
  "Missing knowledge asset"
);
const knowledgeHeroImage = findAssetByFileName(
  knowledgeAssetModules,
  [
    "melody-mind.webp",
    "melody-mind.avif",
    "melody-mind.jpg",
    "melody-mind.jpeg",
    "melody-mind.png",
  ],
  "Missing knowledge asset"
);

export const getKnowledgeCategoryImage = (
  imagePathOrSlug: string | undefined
): ImageMetadata | undefined => {
  if (!imagePathOrSlug) {
    return undefined;
  }

  return knowledgeCategoryImages[normalizeImageKey(imagePathOrSlug)];
};

export const getKnowledgeCategoryImageSrc = (
  imagePathOrSlug: string | undefined
): string | undefined => {
  const image = getKnowledgeCategoryImage(imagePathOrSlug);
  return image ? stripAssetQuery(image.src) : undefined;
};

export const getKnowledgeCategoryImageUrl = (
  imagePathOrSlug: string | undefined,
  baseUrl: string
): string | undefined => {
  const image = getKnowledgeCategoryImage(imagePathOrSlug);
  return image ? toAbsoluteAssetUrl(image, baseUrl) : undefined;
};

export const getKnowledgeTaxonomyImage = (
  imagePathOrSlug: string | undefined
): ImageMetadata | undefined => {
  if (!imagePathOrSlug) {
    return undefined;
  }

  return knowledgeTaxonomyImages[normalizeImageKey(imagePathOrSlug)];
};

export const getKnowledgeTaxonomyImageSrc = (
  imagePathOrSlug: string | undefined
): string | undefined => {
  const image = getKnowledgeTaxonomyImage(imagePathOrSlug);
  return image ? stripAssetQuery(image.src) : undefined;
};

export const getKnowledgeTaxonomyImageUrl = (
  imagePathOrSlug: string | undefined,
  baseUrl: string
): string | undefined => {
  const image = getKnowledgeTaxonomyImage(imagePathOrSlug);
  return image ? toAbsoluteAssetUrl(image, baseUrl) : undefined;
};

export const knowledgeHeroImageSrc = stripAssetQuery(knowledgeHeroImage.src);

export const knowledgeHeroImageUrl = (baseUrl: string): string =>
  toAbsoluteAssetUrl(knowledgeHeroImage, baseUrl);

export const knowledgeBrandLogoUrl = (baseUrl: string): string =>
  toAbsoluteAssetUrl(knowledgeBrandLogo, baseUrl);

export { knowledgeBrandLogo, knowledgeHeroImage };
