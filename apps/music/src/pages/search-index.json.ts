import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { create, insertMultiple, save } from "@orama/orama";

import type { Song } from "../types/album";
import type { CollectionEntry } from "astro:content";
import { formatDuration } from "../utils/albumPresentation";
import { getAlbumDiscoveryMeta } from "../utils/albumDiscovery";
import { getAlbumCoverImageUrl } from "../utils/musicImages";

type AlbumEntry = CollectionEntry<"albums">;
type GenreEntry = CollectionEntry<"genres">;
type SeriesEntry = CollectionEntry<"series">;

const trimSearchText = (value: string) => value.replace(/\s+/g, " ").trim();

export const GET: APIRoute = async () => {
  const albums = (await getCollection(
    "albums",
    (entry: AlbumEntry) => entry.data.isAvailable
  )) as AlbumEntry[];
  const genres = ((await getCollection("genres")) as GenreEntry[]).sort(
    (a, b) => a.data.order - b.data.order
  );
  const series = ((await getCollection("series")) as SeriesEntry[]).sort(
    (a, b) => a.data.order - b.data.order
  );
  const albumsById = new Map(
    albums.map((entry) => [entry.id.toLocaleLowerCase("en"), entry])
  );
  const albumCountByGenre = albums.reduce<Map<string, number>>((counts, entry) => {
    const genre = entry.data.mainGenre;
    if (genre) {
      counts.set(genre, (counts.get(genre) || 0) + 1);
    }
    return counts;
  }, new Map());

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
      displayMeta: trimSearchText(
        [entry.data.genre || "", `${entry.data.songs.length} tracks`, albumDuration || ""]
          .filter(Boolean)
          .join(" · ")
      ),
      searchText: trimSearchText(
        [
          entry.data.description,
          entry.data.genre || "",
          songTitles.join(" "),
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
    entry.data.songs.map((song: Song, trackIndex: number) => {
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
        albumId: entry.id,
        trackIndex,
        searchText: trimSearchText(
          [
            entry.data.title,
            entry.data.genre || "",
            song.description || "",
            song.isInstrumental ? "instrumental" : "",
          ].join(" ")
        ),
      };
    })
  );

  const genreDocuments = genres.map((entry) => {
    const albumCount = albumCountByGenre.get(entry.data.mainGenre) || 0;

    return {
      id: `genre-${entry.id}`,
      type: "Genre",
      title: entry.data.title,
      desc: trimSearchText(entry.data.description),
      url: `/genre/${entry.id}/`,
      displayMeta: `${albumCount} ${albumCount === 1 ? "album" : "albums"} in the catalog`,
      searchText: trimSearchText(
        [
          entry.data.description,
          entry.data.mainGenre,
          entry.data.keywords.join(" "),
        ].join(" ")
      ),
    };
  });

  const seriesDocuments = series.map((entry) => {
    const availableSeriesAlbums = entry.data.albumIds
      .map((albumId: string) => albumsById.get(albumId.toLocaleLowerCase("en")))
      .filter((album: AlbumEntry | undefined): album is AlbumEntry => Boolean(album));
    const firstAlbum = availableSeriesAlbums[0];
    const albumCount = availableSeriesAlbums.length;

    return {
      id: `series-${entry.id}`,
      type: "Series",
      title: entry.data.title,
      desc: trimSearchText(entry.data.shortDescription),
      url: `/series/${entry.id}/`,
      ...(firstAlbum
        ? {
            imageUrl: getAlbumCoverImageUrl(firstAlbum.data.coverImage),
            imageAlt: `Cover art from the album series ${entry.data.title}`,
          }
        : {}),
      displayMeta: `${albumCount} ${albumCount === 1 ? "album" : "albums"} · ${entry.data.eyebrow}`,
      searchText: trimSearchText(
        [
          entry.data.shortDescription,
          entry.data.eyebrow,
          entry.data.keywords.join(" "),
          availableSeriesAlbums.map((album: AlbumEntry) => album.data.title).join(" "),
        ].join(" ")
      ),
    };
  });

  // Direct Orama calls instead of the plugin's buildSearchIndex helper so the
  // sorter can be disabled — the palette never sorts, and the serialized sort
  // structures alone cost ~500 KB of raw index size.
  const db = create({
    // Keep one consolidated discovery field so Orama serializes fewer indexes.
    // Display and navigation data remain stored on each result document.
    schema: {
      type: "string",
      title: "string",
      searchText: "string",
    } as const,
    sort: { enabled: false },
    components: { tokenizer: { language: "english" } },
  });
  await insertMultiple(db, [
    ...genreDocuments,
    ...seriesDocuments,
    ...albumDocuments,
    ...trackDocuments,
  ]);
  const index = save(db);

  return new Response(JSON.stringify(index), {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate, stale-while-revalidate=86400",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
