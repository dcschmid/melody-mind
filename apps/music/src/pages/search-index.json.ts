import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildSearchIndex } from "@freshjuice/astro-search-plugin/build";

import type { Song } from "../types/album";
import type { CollectionEntry } from "astro:content";

type AlbumEntry = CollectionEntry<"albums">;

const trimSearchText = (value: string) => value.replace(/\s+/g, " ").trim();

export const GET: APIRoute = async () => {
  const albums = await getCollection(
    "albums",
    (entry: AlbumEntry) => entry.data.isAvailable
  );

  const index = await buildSearchIndex({
    schema: {
      type: "string",
      title: "string",
      desc: "string",
      url: "string",
      genre: "string",
      artist: "string",
      songTitles: "string[]",
      body: "string",
    },
    documents: albums.map((entry: AlbumEntry) => ({
      id: entry.id,
      type: "Album",
      title: entry.data.title,
      desc: entry.data.metaDescription || entry.data.description,
      url: `/${entry.id}/`,
      genre: entry.data.genre || "",
      artist: entry.data.artist,
      songTitles: entry.data.songs.map((song: Song) => song.title),
      body: trimSearchText(entry.body || ""),
    })),
    language: "english",
  });

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
