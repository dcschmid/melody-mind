import type { ImageMetadata } from "astro";

const RASTER_IMAGE_EXT_PATTERN = /\.(jpg|jpeg|png|webp|avif)$/iu;

const reviewCoverModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/review-covers/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const reviewCoverImages: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(reviewCoverModules).map(([modulePath, module]) => [
    modulePath.split("/").pop()?.replace(RASTER_IMAGE_EXT_PATTERN, "") ?? modulePath,
    module.default,
  ])
);

/* Frontmatter keeps public-style paths ("/covers/<slug>.jpg"); covers are
   resolved by extensionless stem so optimized astro:assets images can be
   used without editing content files. */
export const getReviewCoverImage = (src: string): ImageMetadata | undefined => {
  const stem = src.trim().split("/").pop()?.replace(RASTER_IMAGE_EXT_PATTERN, "");
  return stem ? reviewCoverImages[stem] : undefined;
};

export const toAbsoluteAssetUrl = (asset: ImageMetadata, baseUrl: URL | string): string =>
  new URL(asset.src.split("?")[0] || asset.src, baseUrl).toString();
