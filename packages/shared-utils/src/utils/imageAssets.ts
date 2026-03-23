import type { ImageMetadata } from "astro";

export const RASTER_IMAGE_EXT_PATTERN = /\.(jpg|jpeg|png|webp|avif)$/iu;
const DEFAULT_PREFERRED_EXTENSIONS = ["webp", "avif", "jpg", "jpeg", "png"] as const;

type ImageModule = { default: ImageMetadata };
type RasterImageExtension = (typeof DEFAULT_PREFERRED_EXTENSIONS)[number];

const getImageExtension = (fileName: string): RasterImageExtension | undefined => {
  const match = fileName.match(RASTER_IMAGE_EXT_PATTERN);
  return match?.[1]?.toLowerCase() as RasterImageExtension | undefined;
};

const comparePreferredExtensions = (
  leftFileName: string,
  rightFileName: string,
  preferredExtensions: readonly string[]
): number => {
  const leftExtension = getImageExtension(leftFileName) ?? "";
  const rightExtension = getImageExtension(rightFileName) ?? "";
  const leftIndex = preferredExtensions.indexOf(leftExtension);
  const rightIndex = preferredExtensions.indexOf(rightExtension);
  const normalizedLeftIndex = leftIndex === -1 ? preferredExtensions.length : leftIndex;
  const normalizedRightIndex = rightIndex === -1 ? preferredExtensions.length : rightIndex;

  return normalizedLeftIndex - normalizedRightIndex || leftFileName.localeCompare(rightFileName);
};

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
  modules: Record<string, ImageModule>,
  preferredExtensions: readonly string[] = DEFAULT_PREFERRED_EXTENSIONS
): Record<string, ImageMetadata> =>
  Array.from(
    Object.entries(modules).reduce(
      (map, [path, module]) => {
        const fileName = path.split("/").pop() ?? "";
        const normalizedKey = stripImageExtension(fileName);
        const existingEntry = map.get(normalizedKey);

        if (
          !existingEntry ||
          comparePreferredExtensions(
            fileName,
            existingEntry.fileName,
            preferredExtensions
          ) < 0
        ) {
          map.set(normalizedKey, { fileName, image: module.default });
        }

        return map;
      },
      new Map<string, { fileName: string; image: ImageMetadata }>()
    )
  ).reduce(
    (record, [key, entry]) => {
      record[key] = entry.image;
      return record;
    },
    {} as Record<string, ImageMetadata>
  );

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
