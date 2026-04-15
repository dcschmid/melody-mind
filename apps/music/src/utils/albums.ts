import { getCollection } from "astro:content";
import type { AlbumData } from "../types/album";
import type { CollectionEntry } from "astro:content";

type AlbumCollectionEntry = CollectionEntry<"albums">;

export async function getAvailableAlbums(): Promise<AlbumData[]> {
  try {
    const collection = await getCollection(
      "albums",
      (entry: AlbumCollectionEntry) => entry.data.isAvailable
    );
    return collection.map((item: AlbumCollectionEntry) => ({
      id: item.id,
      ...item.data,
      body: item.body,
    }));
  } catch (e) {
    console.warn("Failed to load albums", { error: (e as any)?.message || e });
    return [];
  }
}

export async function getAlbumById(
  id: string,
  albums: AlbumData[]
): Promise<AlbumData | undefined> {
  return albums.find((album) => album.id === id);
}

export async function getAlbumByIdFromCollection(
  id: string
): Promise<AlbumData | undefined> {
  const albums = await getAvailableAlbums();
  return getAlbumById(id, albums);
}
