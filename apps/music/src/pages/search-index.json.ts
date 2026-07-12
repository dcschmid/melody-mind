import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { create, insertMultiple, save } from "@orama/orama";

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
    const hasInstrumentalTrack = entry.data.songs.some(
      (song: Song) => song.isInstrumental
    );

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
      // Indexed full-text. Deliberately excludes the long-form MDX body and the
      // per-track titles (already indexed via songTitles) to keep the served
      // index small. Albums stay findable via title, description, genre, track
      // titles, moods, tags, language, and energy.
      body: trimSearchText(
        [
          discoveryMeta.moods.join(" "),
          discoveryMeta.tags.join(" "),
          discoveryMeta.language || "",
          discoveryMeta.energy,
          hasInstrumentalTrack ? "instrumental" : "",
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
        // Track-specific text only; the album description is findable via the
        // album document and would otherwise be duplicated ~1,200 times here.
        desc: trimSearchText(
          [song.description || "", song.isInstrumental ? "Instrumental." : ""]
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
        // Covered by the indexed title/albumTitle fields; repeating them here
        // only inflates the index.
        songTitles: [],
        // The song description is already indexed via desc above.
        body: "",
      };
    })
  );

  // Direct Orama calls instead of the plugin's buildSearchIndex helper so the
  // sorter can be disabled — the palette never sorts, and the serialized sort
  // structures alone cost ~500 KB of raw index size.
  const db = create({
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
    } as const,
    sort: { enabled: false },
    components: { tokenizer: { language: "english" } },
  });
  await insertMultiple(db, [...albumDocuments, ...trackDocuments]);
  const index = await save(db);

  return new Response(JSON.stringify(index), {
    headers: {
      "Cache-Control": "no-cache, must-revalidate",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
