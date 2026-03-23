import type { ImageMetadata } from "astro";

const RASTER_IMAGE_EXT_PATTERN = /\.(jpg|jpeg|png|webp|avif)$/iu;

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

const getAssetByFileName = (fileNames: string[]): ImageMetadata => {
  for (const fileName of fileNames) {
    const assetEntry = Object.entries(knowledgeAssetModules).find(
      ([path]) => path.split("/").pop() === fileName
    );

    if (assetEntry) {
      return assetEntry[1].default;
    }
  }

  throw new Error(`Missing knowledge asset. Tried: ${fileNames.join(", ")}`);
};

const buildImageMap = (
  modules: Record<string, { default: ImageMetadata }>
): Record<string, ImageMetadata> =>
  Object.fromEntries(
    Object.entries(modules).map(([path, module]) => {
      const fileName = path.split("/").pop() ?? "";
      const slug = fileName.replace(RASTER_IMAGE_EXT_PATTERN, "");
      return [slug, module.default];
    })
  ) as Record<string, ImageMetadata>;

const knowledgeCategoryImages = buildImageMap(knowledgeCategoryModules);
const knowledgeTaxonomyImages = buildImageMap(knowledgeTaxonomyModules);

const normalizeImageKey = (imagePathOrSlug: string): string =>
  imagePathOrSlug
    .trim()
    .split("/")
    .pop()
    ?.replace(/\?.*$/u, "")
    .replace(/\.(jpg|jpeg|png|webp|avif)$/iu, "") || "";

const toAssetSrc = (asset: ImageMetadata): string => asset.src.split("?")[0] || asset.src;

const toAbsoluteAssetUrl = (asset: ImageMetadata, baseUrl: string): string =>
  new URL(toAssetSrc(asset), baseUrl).toString();

const knowledgeBrandLogo = getAssetByFileName([
  "melody-mind.png",
  "melody-mind.webp",
  "melody-mind.avif",
  "melody-mind.jpg",
  "melody-mind.jpeg",
]);
const knowledgeHeroImage = getAssetByFileName([
  "melody-mind.jpg",
  "melody-mind.jpeg",
  "melody-mind.webp",
  "melody-mind.avif",
  "melody-mind.png",
]);

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
  return image ? toAssetSrc(image) : undefined;
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
  return image ? toAssetSrc(image) : undefined;
};

export const getKnowledgeTaxonomyImageUrl = (
  imagePathOrSlug: string | undefined,
  baseUrl: string
): string | undefined => {
  const image = getKnowledgeTaxonomyImage(imagePathOrSlug);
  return image ? toAbsoluteAssetUrl(image, baseUrl) : undefined;
};

export const knowledgeHeroImageSrc = toAssetSrc(knowledgeHeroImage);

export const knowledgeHeroImageUrl = (baseUrl: string): string =>
  toAbsoluteAssetUrl(knowledgeHeroImage, baseUrl);

export const knowledgeBrandLogoUrl = (baseUrl: string): string =>
  toAbsoluteAssetUrl(knowledgeBrandLogo, baseUrl);

export { knowledgeBrandLogo, knowledgeHeroImage };
