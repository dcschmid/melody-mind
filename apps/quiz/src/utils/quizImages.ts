import type { ImageMetadata } from "astro";
import quizBrandLogo from "../assets/melody-mind-quiz.png";
import quizHeroImage from "../assets/melody-mind-quiz.jpg";

const quizCategoryModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/category/*.jpg",
  { eager: true }
);

const quizCategoryImages = Object.fromEntries(
  Object.entries(quizCategoryModules).map(([path, module]) => {
    const fileName = path.split("/").pop() ?? "";
    const slug = fileName.replace(/\.jpg$/u, "");
    return [slug, module.default];
  })
) as Record<string, ImageMetadata>;

const toAbsoluteAssetUrl = (asset: ImageMetadata, baseUrl: string): string =>
  new URL(asset.src.split("?")[0] || asset.src, baseUrl).toString();

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
