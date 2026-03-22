import type { ImageMetadata } from "astro";
import { PODCAST_SITE_URL } from "../constants/podcastLinks";
import podcastHeroImage from "../assets/the-melody-mind-podcast.jpg";

const podcastCoverModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/podcast-images/*.jpg",
  { eager: true }
);

const podcastCoverImages = Object.fromEntries(
  Object.entries(podcastCoverModules).map(([path, module]) => {
    const fileName = path.split("/").pop() ?? "";
    const slug = fileName.replace(/\.jpg$/u, "");
    return [slug, module.default];
  })
) as Record<string, ImageMetadata>;

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
