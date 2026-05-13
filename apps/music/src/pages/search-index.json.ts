import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildSearchIndex } from "@freshjuice/astro-search-plugin/build";

import type { Song } from "../types/album";
import type { CollectionEntry } from "astro:content";
import { formatDuration } from "../utils/albumPresentation";
import { getAlbumDiscoveryMeta } from "../utils/albumDiscovery";

type AlbumEntry = CollectionEntry<"albums">;

const trimSearchText = (value: string) => value.replace(/\s+/g, " ").trim();

export const GET: APIRoute = async () => {
  const albums = await getCollection(
    "albums",
    (entry: AlbumEntry) => entry.data.isAvailable
  );

  const albumDocuments = albums.map((entry: AlbumEntry) => {
    const discoveryMeta = getAlbumDiscoveryMeta({
      id: entry.id,
      ...entry.data,
      body: entry.body,
    });
    const songTitles = entry.data.songs.map((song: Song) => song.title);
    const trackSearchText = entry.data.songs
      .map((song: Song) => {
        const duration = song.durationSeconds ? formatDuration(song.durationSeconds) : "";

        return [
          `Track ${song.trackNumber}`,
          song.title,
          duration,
          song.isInstrumental ? "instrumental" : "",
          song.transcriptUnavailableReason || "",
        ]
          .filter(Boolean)
          .join(" ");
      })
      .join(" ");

    return {
      id: entry.id,
      type: "Album",
      title: entry.data.title,
      desc: trimSearchText(
        [
          entry.data.metaDescription || entry.data.description,
          entry.data.genre ? `Genre: ${entry.data.genre}.` : "",
          discoveryMeta.moods.length ? `Moods: ${discoveryMeta.moods.join(", ")}.` : "",
          discoveryMeta.tags.length ? `Tags: ${discoveryMeta.tags.join(", ")}.` : "",
          discoveryMeta.language ? `Language: ${discoveryMeta.language}.` : "",
          `Energy: ${discoveryMeta.energy}.`,
          `${entry.data.songs.length} tracks.`,
        ]
          .filter(Boolean)
          .join(" ")
      ),
      url: `/${entry.id}/`,
      genre: entry.data.genre || "",
      artist: entry.data.artist,
      songTitles,
      body: trimSearchText(
        [
          entry.body || "",
          trackSearchText,
          discoveryMeta.moods.join(" "),
          discoveryMeta.tags.join(" "),
          discoveryMeta.language || "",
          discoveryMeta.energy,
        ].join(" ")
      ),
    };
  });

  const trackDocuments = albums.flatMap((entry: AlbumEntry) =>
    entry.data.songs.map((song: Song) => {
      const discoveryMeta = getAlbumDiscoveryMeta({
        id: entry.id,
        ...entry.data,
        body: entry.body,
      });
      const duration = song.durationSeconds ? formatDuration(song.durationSeconds) : "";

      return {
        id: `${entry.id}-track-${song.trackNumber}`,
        type: "Track",
        title: song.title,
        desc: trimSearchText(
          [
            `Track ${song.trackNumber} from ${entry.data.title}.`,
            entry.data.genre ? `Genre: ${entry.data.genre}.` : "",
            discoveryMeta.moods.length ? `Moods: ${discoveryMeta.moods.join(", ")}.` : "",
            duration ? `Length ${duration}.` : "",
            song.isInstrumental ? "Instrumental." : "",
            song.description || "",
            song.transcriptUnavailableReason || "",
          ]
            .filter(Boolean)
            .join(" ")
        ),
        url: `/${entry.id}/#album-playlist-${entry.id}`,
        genre: entry.data.genre || "",
        artist: entry.data.artist,
        songTitles: [song.title, entry.data.title],
        body: trimSearchText([entry.body || "", entry.data.description].join(" ")),
      };
    })
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
    documents: [...albumDocuments, ...trackDocuments],
    language: "english",
  });

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
