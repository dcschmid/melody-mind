import type { ImageMetadata } from "astro";
import { PODCAST_SITE_URL } from "../constants/podcastLinks";

const RASTER_IMAGE_EXT_PATTERN = /\.(jpg|jpeg|png|webp|avif)$/iu;

const podcastAssetModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const podcastCoverModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/podcast-images/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const getAssetByFileName = (fileNames: string[]): ImageMetadata => {
  for (const fileName of fileNames) {
    const assetEntry = Object.entries(podcastAssetModules).find(
      ([path]) => path.split("/").pop() === fileName
    );

    if (assetEntry) {
      return assetEntry[1].default;
    }
  }

  throw new Error(`Missing podcast asset. Tried: ${fileNames.join(", ")}`);
};

const podcastCoverImages = Object.fromEntries(
  Object.entries(podcastCoverModules).map(([path, module]) => {
    const fileName = path.split("/").pop() ?? "";
    const slug = fileName.replace(RASTER_IMAGE_EXT_PATTERN, "");
    return [slug, module.default];
  })
) as Record<string, ImageMetadata>;

const podcastHeroImage = getAssetByFileName([
  "the-melody-mind-podcast.jpg",
  "the-melody-mind-podcast.jpeg",
  "the-melody-mind-podcast.webp",
  "the-melody-mind-podcast.avif",
  "the-melody-mind-podcast.png",
]);

export const getPodcastCoverImage = (imageSlug: string): ImageMetadata | undefined =>
  podcastCoverImages[imageSlug];

const toAbsoluteAssetUrl = (asset: ImageMetadata): string =>
  new URL(asset.src.split("?")[0] || asset.src, PODCAST_SITE_URL).toString();

export const getPodcastCoverImageUrl = (imageSlug: string): string | undefined => {
  const image = getPodcastCoverImage(imageSlug);
  return image ? toAbsoluteAssetUrl(image) : undefined;
};

export const podcastHeroImageSrc = podcastHeroImage.src;
export const podcastHeroImageUrl = toAbsoluteAssetUrl(podcastHeroImage);

export { podcastHeroImage };
