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
      desc: trimSearchText(entry.data.description),
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
      // Indexed full-text. Deliberately excludes the long-form MDX body to keep
      // the served index small (~1-2MB vs 22MB). Albums stay findable via title,
      // description, genre, track titles, moods, tags, language, and energy.
      body: trimSearchText(
        [
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
        // Track-specific text only; the album body is no longer duplicated per track.
        body: trimSearchText(song.description || ""),
      };
    })
  );

  const index = await buildSearchIndex({
    // Only genuinely searchable fields are indexed. Display/navigation-only
    // fields (url, imageUrl, imageAlt, displayMeta, trackNumber, duration,
    // artist) are still stored in every document — and thus available for
    // rendering, navigation, and result enrichment — but are not full-text
    // indexed, which keeps the served index small.
    schema: {
      type: "string",
      title: "string",
      desc: "string",
      albumTitle: "string",
      genre: "string",
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
