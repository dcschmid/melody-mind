import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { buildVisualAlbumManifest } from "../../utils/visualsManifest";

type AlbumEntry = CollectionEntry<"albums">;

export const getStaticPaths: GetStaticPaths = async () => {
  const albums = (await getCollection(
    "albums",
    (entry: AlbumEntry) => entry.data.isAvailable
  )) as AlbumEntry[];

  return Promise.all(
    albums.map(async (album) => ({
      params: { album: album.id },
      props: { manifest: await buildVisualAlbumManifest(album) },
    }))
  );
};

export const GET: APIRoute = ({ props }) =>
  new Response(JSON.stringify(props.manifest), {
    headers: {
      "Cache-Control": "public, max-age=86400, immutable",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
