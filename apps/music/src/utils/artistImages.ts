import type { ImageMetadata } from "astro";
import { buildImageMap, normalizeImageKey, toAbsoluteAssetUrl } from "@utils/imageAssets";
import { MUSIC_SITE_URL } from "@utils/appShell";

const artistPortraitModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/singers/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const artistPortraitImages = buildImageMap(artistPortraitModules);

/* Portraits are one-to-one identity images: never substitute a fallback when
   content and assets diverge, fail the build instead. */
export function getArtistImage(portrait: string): ImageMetadata {
  const image = artistPortraitImages[normalizeImageKey(portrait)];
  if (!image) {
    throw new Error(`Unknown artist portrait: ${portrait}`);
  }
  return image;
}

export function getArtistImageUrl(portrait: string): string {
  return toAbsoluteAssetUrl(getArtistImage(portrait), MUSIC_SITE_URL);
}
