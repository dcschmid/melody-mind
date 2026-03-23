import type { ImageMetadata } from "astro";
import {
  buildImageMap,
  findAssetByFileName,
  stripAssetQuery,
  toAbsoluteAssetUrl,
} from "@shared-utils/utils/imageAssets";
import { PODCAST_SITE_URL } from "../constants/podcastLinks";

const podcastAssetModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const podcastCoverModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/podcast-images/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const podcastCoverImages = buildImageMap(podcastCoverModules);

const podcastHeroImage = findAssetByFileName(
  podcastAssetModules,
  [
    "the-melody-mind-podcast.jpg",
    "the-melody-mind-podcast.jpeg",
    "the-melody-mind-podcast.webp",
    "the-melody-mind-podcast.avif",
    "the-melody-mind-podcast.png",
  ],
  "Missing podcast asset"
);

export const getPodcastCoverImage = (imageSlug: string): ImageMetadata | undefined =>
  podcastCoverImages[imageSlug];

const toPodcastAssetUrl = (asset: ImageMetadata): string =>
  toAbsoluteAssetUrl(asset, PODCAST_SITE_URL);

export const getPodcastCoverImageUrl = (imageSlug: string): string | undefined => {
  const image = getPodcastCoverImage(imageSlug);
  return image ? toPodcastAssetUrl(image) : undefined;
};

export const podcastHeroImageSrc = stripAssetQuery(podcastHeroImage.src);
export const podcastHeroImageUrl = toPodcastAssetUrl(podcastHeroImage);

export { podcastHeroImage };
