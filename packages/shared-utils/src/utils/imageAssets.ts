import type { ImageMetadata } from "astro";

export const RASTER_IMAGE_EXT_PATTERN = /\.(jpg|jpeg|png|webp|avif)$/iu;

type ImageModule = { default: ImageMetadata };

export const stripAssetQuery = (src: string): string => src.split("?")[0] || src;

export const stripImageExtension = (fileName: string): string =>
  fileName.replace(RASTER_IMAGE_EXT_PATTERN, "");

export const normalizeImageKey = (imagePathOrSlug: string): string =>
  imagePathOrSlug
    .trim()
    .split("/")
    .pop()
    ?.replace(/\?.*$/u, "")
    .replace(RASTER_IMAGE_EXT_PATTERN, "") || "";

export const buildImageMap = (
  modules: Record<string, ImageModule>
): Record<string, ImageMetadata> =>
  Object.fromEntries(
    Object.entries(modules).map(([path, module]) => {
      const fileName = path.split("/").pop() ?? "";
      return [stripImageExtension(fileName), module.default];
    })
  ) as Record<string, ImageMetadata>;

export const findAssetByFileName = (
  modules: Record<string, ImageModule>,
  fileNames: string[],
  errorPrefix = "Missing image asset"
): ImageMetadata => {
  for (const fileName of fileNames) {
    const assetEntry = Object.entries(modules).find(
      ([path]) => path.split("/").pop() === fileName
    );

    if (assetEntry) {
      return assetEntry[1].default;
    }
  }

  throw new Error(`${errorPrefix}. Tried: ${fileNames.join(", ")}`);
};

export const toAbsoluteAssetUrl = (asset: ImageMetadata, baseUrl: string): string =>
  new URL(stripAssetQuery(asset.src), baseUrl).toString();
