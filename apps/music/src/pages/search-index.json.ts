import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildSearchIndex } from "@freshjuice/astro-search-plugin/build";

import type { Song } from "../types/album";
import type { CollectionEntry } from "astro:content";
import { formatDuration } from "../utils/albumPresentation";
import { getAlbumDiscoveryMeta } from "../utils/albumDiscovery";
import { getAlbumCoverImageUrl } from "../utils/musicImages";

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
    const coverImageUrl = getAlbumCoverImageUrl(entry.data.coverImage);
    const albumDurationSeconds = entry.data.songs.reduce(
      (acc: number, song: Song) => acc + (song.durationSeconds || 0),
      0
    );
    const albumDuration = albumDurationSeconds
      ? formatDuration(albumDurationSeconds)
      : "";
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
      desc: trimSearchText(entry.data.metaDescription || entry.data.description),
      url: `/${entry.id}/`,
      imageUrl: coverImageUrl,
      imageAlt: `Cover art for the album ${entry.data.title}`,
      albumTitle: entry.data.title,
      displayMeta: trimSearchText(
        [entry.data.genre || "", `${entry.data.songs.length} tracks`, albumDuration || ""]
          .filter(Boolean)
          .join(" · ")
      ),
      trackNumber: "",
      duration: albumDuration,
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
      const duration = song.durationSeconds ? formatDuration(song.durationSeconds) : "";

      return {
        id: `${entry.id}-track-${song.trackNumber}`,
        type: "Track",
        title: song.title,
        desc: trimSearchText(
          [
            song.description || "",
            song.isInstrumental ? "Instrumental." : "",
            !song.description && !song.isInstrumental ? entry.data.description : "",
          ]
            .filter(Boolean)
            .join(" ")
        ),
        url: `/${entry.id}/#album-playlist-${entry.id}`,
        imageUrl: getAlbumCoverImageUrl(entry.data.coverImage),
        imageAlt: `Cover art for the album ${entry.data.title}`,
        albumTitle: entry.data.title,
        displayMeta: trimSearchText(
          [
            `Track ${song.trackNumber}`,
            entry.data.title,
            entry.data.genre || "",
            duration || "",
          ]
            .filter(Boolean)
            .join(" · ")
        ),
        trackNumber: String(song.trackNumber),
        duration,
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
      imageUrl: "string",
      imageAlt: "string",
      albumTitle: "string",
      displayMeta: "string",
      trackNumber: "string",
      duration: "string",
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
      "Cache-Control": "no-cache, must-revalidate",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
