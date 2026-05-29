import type { ImageMetadata } from "astro";
import { buildImageMap, normalizeImageKey, toAbsoluteAssetUrl } from "@utils/imageAssets";
import { MUSIC_SITE_URL } from "@utils/appShell";
import musicDefaultOgSvg from "../assets/music-default-og.webp";

const musicDefaultOgImage: ImageMetadata = musicDefaultOgSvg;
const musicDefaultOgImageUrl = `${MUSIC_SITE_URL}${musicDefaultOgSvg.src}`;

const albumCoverModules = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/album-covers/*.{jpg,jpeg,png,webp,avif}",
  { eager: true }
);

const albumCoverImages = buildImageMap(albumCoverModules);

export function getAlbumCoverImage(coverImage: string): string | ImageMetadata {
  if (!coverImage) {
    return musicDefaultOgImage;
  }
  const key = normalizeImageKey(coverImage);
  const image = albumCoverImages[key];
  return image ?? musicDefaultOgImage;
}

export function getAlbumCoverImageUrl(coverImage: string): string {
  if (!coverImage) {
    return musicDefaultOgImageUrl;
  }
  const key = normalizeImageKey(coverImage);
  const image = albumCoverImages[key];
  if (!image) {
    return musicDefaultOgImageUrl;
  }
  return toAbsoluteAssetUrl(image, MUSIC_SITE_URL);
}

export { musicDefaultOgImageUrl };
