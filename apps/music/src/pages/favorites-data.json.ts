import type { APIRoute } from "astro";

import { getAvailableAlbums } from "../utils/albums";
import { getAlbumCoverImagePath } from "../utils/musicImages";

export const GET: APIRoute = async () => {
  const albums = await getAvailableAlbums();
  const catalog = Object.fromEntries(
    albums.map((album) => [
      album.id,
      {
        title: album.title,
        url: `/${album.id}/`,
        ...(album.genre ? { genre: album.genre } : {}),
        trackCount: album.songs.length,
        coverImagePath: getAlbumCoverImagePath(album.coverImage),
      },
    ])
  );

  return new Response(JSON.stringify(catalog), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate, stale-while-revalidate=86400",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
