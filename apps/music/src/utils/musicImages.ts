import type { ImageMetadata } from "astro";
import {
  buildImageMap,
  normalizeImageKey,
  toAbsoluteAssetUrl,
} from "@shared-utils/utils/imageAssets";
import { MUSIC_SITE_URL } from "@shared-utils/utils/appShell";
import musicHeroSvg from "../assets/music-hero.webp";

const musicHeroImage: ImageMetadata = musicHeroSvg;
const musicHeroImageUrl = `${MUSIC_SITE_URL}${musicHeroSvg.src}`;

const albumCoverModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/album-covers/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const albumCoverImages = buildImageMap(albumCoverModules);

export function getAlbumCoverImage(coverImage: string): string | ImageMetadata {
  if (!coverImage) {
    return musicHeroImage;
  }
  const key = normalizeImageKey(coverImage);
  const image = albumCoverImages[key];
  return image ?? musicHeroImage;
}

export function getAlbumCoverImageUrl(coverImage: string): string {
  if (!coverImage) {
    return musicHeroImageUrl;
  }
  const key = normalizeImageKey(coverImage);
  const image = albumCoverImages[key];
  if (!image) {
    return musicHeroImageUrl;
  }
  return toAbsoluteAssetUrl(image, MUSIC_SITE_URL);
}

export { musicHeroImage, musicHeroImageUrl };
