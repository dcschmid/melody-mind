import type { APIRoute } from "astro";
import { getImage } from "astro:assets";

import { getAlbumArchiveItems } from "../utils/albumArchive";
import { getAlbumCoverImageUrl } from "../utils/musicImages";
import type { AlbumSearchRecord } from "../utils/albumSearch";

export const GET: APIRoute = async () => {
  const items = await getAlbumArchiveItems();
  const records: AlbumSearchRecord[] = await Promise.all(
    items.map(async (item) => {
      let imageSrc = getAlbumCoverImageUrl(item.album.coverImage);
      if (typeof item.imageSrc !== "string") {
        try {
          imageSrc = (
            await getImage({
              src: item.imageSrc,
              width: 640,
              height: 640,
              format: "webp",
            })
          ).src;
        } catch {
          // Keep the full-size cover URL when the compact rendition cannot be generated.
        }
      }

      return {
        id: item.album.id,
        url: `/${item.album.id}/`,
        title: item.title,
        description: item.description,
        genre: item.genre,
        trackCount: item.trackCount,
        seriesTitle: item.seriesTitles[0],
        searchText: item.searchText,
        imageSrc,
      };
    })
  );

  return new Response(JSON.stringify(records), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
