import type { ImageMetadata } from "astro";
import {
  buildImageMap,
  findAssetByFileName,
  toAbsoluteAssetUrl,
} from "@shared-utils/utils/imageAssets";

const quizAssetModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const quizCategoryModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/category/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const quizCategoryImages = buildImageMap(quizCategoryModules);

const quizBrandLogo = findAssetByFileName(
  quizAssetModules,
  [
    "melody-mind-quiz.png",
    "melody-mind-quiz.webp",
    "melody-mind-quiz.avif",
    "melody-mind-quiz.jpg",
    "melody-mind-quiz.jpeg",
  ],
  "Missing quiz asset"
);
const quizHeroImage = findAssetByFileName(
  quizAssetModules,
  [
    "melody-mind-quiz.webp",
    "melody-mind-quiz.avif",
    "melody-mind-quiz.jpg",
    "melody-mind-quiz.jpeg",
    "melody-mind-quiz.png",
  ],
  "Missing quiz asset"
);

export const getQuizImage = (imageSlug: string): ImageMetadata | undefined =>
  quizCategoryImages[imageSlug];

export const getQuizImageUrl = (
  imageSlug: string,
  baseUrl: string
): string | undefined => {
  const image = getQuizImage(imageSlug);
  return image ? toAbsoluteAssetUrl(image, baseUrl) : undefined;
};

export const quizHeroImageUrl = (baseUrl: string): string =>
  toAbsoluteAssetUrl(quizHeroImage, baseUrl);

export const quizBrandLogoUrl = (baseUrl: string): string =>
  toAbsoluteAssetUrl(quizBrandLogo, baseUrl);

export { quizBrandLogo, quizHeroImage };
