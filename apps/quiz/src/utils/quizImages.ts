import type { ImageMetadata } from "astro";

const RASTER_IMAGE_EXT_PATTERN = /\.(jpg|jpeg|png|webp|avif)$/iu;

const quizAssetModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const quizCategoryModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/category/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const getAssetByFileName = (fileNames: string[]): ImageMetadata => {
  for (const fileName of fileNames) {
    const assetEntry = Object.entries(quizAssetModules).find(
      ([path]) => path.split("/").pop() === fileName
    );

    if (assetEntry) {
      return assetEntry[1].default;
    }
  }

  throw new Error(`Missing quiz asset. Tried: ${fileNames.join(", ")}`);
};

const quizCategoryImages = Object.fromEntries(
  Object.entries(quizCategoryModules).map(([path, module]) => {
    const fileName = path.split("/").pop() ?? "";
    const slug = fileName.replace(RASTER_IMAGE_EXT_PATTERN, "");
    return [slug, module.default];
  })
) as Record<string, ImageMetadata>;

const quizBrandLogo = getAssetByFileName([
  "melody-mind-quiz.png",
  "melody-mind-quiz.webp",
  "melody-mind-quiz.avif",
  "melody-mind-quiz.jpg",
  "melody-mind-quiz.jpeg",
]);
const quizHeroImage = getAssetByFileName([
  "melody-mind-quiz.jpg",
  "melody-mind-quiz.jpeg",
  "melody-mind-quiz.webp",
  "melody-mind-quiz.avif",
  "melody-mind-quiz.png",
]);

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
