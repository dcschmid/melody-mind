import { getCollection, type CollectionEntry } from "astro:content";

import type { AlbumData } from "../types/album";
import type {
  RadioAlbumSource,
  RadioCatalogPayload,
  RadioLane,
  RadioStation,
} from "../types/radio";

import { getAvailableAlbums } from "./albums";
import { getAlbumCoverImagePath } from "./musicImages";

type SeriesEntry = CollectionEntry<"series">;

interface StationBlueprint {
  id: string;
  title: string;
  description: string;
  selectionSummary: string;
  fallbackTransition: string;
  lanes: Array<{
    id: string;
    title: string;
    matches: (
      album: AlbumData,
      context: {
        seriesAlbumIds: ReadonlyMap<string, ReadonlySet<string>>;
        claimedAlbumIds: ReadonlySet<string>;
      }
    ) => boolean;
  }>;
  alternating?: boolean;
}

const MINIMUM_ALBUMS = 4;
const MINIMUM_TRACKS = 40;
const REQUIRED_INTROS_PER_STATION = 3;

const normalize = (value: string): string => value.trim().toLocaleLowerCase("en");
const normalizeId = (value: string): string => normalize(value);
const includesAny = (value: string, terms: string[]): boolean =>
  terms.some((term) => value.includes(term));
const getAlbumSearchText = (album: AlbumData): string =>
  normalize(
    [album.genre, album.mainGenre, album.language, ...(album.moods || [])]
      .filter(Boolean)
      .join(" ")
  );
const isInSeries = (
  album: AlbumData,
  seriesId: string,
  seriesAlbumIds: ReadonlyMap<string, ReadonlySet<string>>
): boolean => seriesAlbumIds.get(seriesId)?.has(normalizeId(album.id)) === true;

const stationBlueprints: StationBlueprint[] = [
  {
    id: "midnight-metal",
    title: "Midnight Metal",
    description:
      "Metal for late hours, chosen for shadowed arrangements, nocturnal tension, and sustained weight.",
    selectionSummary:
      "Metal albums with medium or high energy and dark, nocturnal, haunting, ominous, or mysterious moods.",
    fallbackTransition:
      "Next, another late-night metal record pushes further into the dark.",
    lanes: [
      {
        id: "midnight",
        title: "Midnight rotation",
        matches: (album) => {
          const text = getAlbumSearchText(album);
          return (
            album.mainGenre === "Metal" &&
            album.energy !== "low" &&
            includesAny(text, ["dark", "nocturnal", "haunting", "ominous", "mysterious"])
          );
        },
      },
    ],
  },
  {
    id: "stories-from-the-north",
    title: "Stories from the North",
    description:
      "Northern voices and folk records alternate with metal sagas about prophecy, winter, memory, and old gods.",
    selectionSummary:
      "A one-for-one rotation between northern-language or folk records and Viking or Nordic metal.",
    fallbackTransition:
      "Next, the station turns to another northern story shaped by memory, myth, or exile.",
    alternating: true,
    lanes: [
      {
        id: "northern-voices",
        title: "Northern voices and folk",
        matches: (album) => {
          if (["Swedish", "Finnish", "Norwegian"].includes(album.language || "")) {
            return true;
          }
          const text = getAlbumSearchText(album);
          return (
            album.mainGenre === "Folk" &&
            includesAny(text, ["nordic", "viking", "pagan", "icy", "mystical"])
          );
        },
      },
      {
        id: "saga-metal",
        title: "Saga metal",
        matches: (album, { seriesAlbumIds, claimedAlbumIds }) => {
          if (claimedAlbumIds.has(normalizeId(album.id))) {
            return false;
          }
          const text = getAlbumSearchText(album);
          return (
            album.mainGenre === "Metal" &&
            (isInSeries(album, "the-nine-worlds-of-the-allfather", seriesAlbumIds) ||
              includesAny(text, ["viking", "nordic", "norse", "pagan"]))
          );
        },
      },
    ],
  },
  {
    id: "french-after-dark",
    title: "French After Dark",
    description:
      "French-language pop, rock, punk, and cabaret for the point where romance gives way to unrest.",
    selectionSummary:
      "French-language albums with low or medium energy and reflective, romantic, nocturnal, or darker moods.",
    fallbackTransition:
      "Next, a French-language record keeps the room dim and the mood unsettled.",
    lanes: [
      {
        id: "french-night",
        title: "French after dark",
        matches: (album) => {
          const text = getAlbumSearchText(album);
          return (
            album.language === "French" &&
            album.energy !== "high" &&
            includesAny(text, [
              "dark",
              "melancholic",
              "nocturnal",
              "romantic",
              "mysterious",
              "intimate",
              "reflective",
              "theatrical",
            ])
          );
        },
      },
    ],
  },
  {
    id: "instrumental-horizons",
    title: "Instrumental Horizons",
    description:
      "Scores, piano records, and orchestral journeys with no lead vocal to fix the boundaries of the scene.",
    selectionSummary:
      "Albums marked as instrumental, or albums whose complete track list is instrumental.",
    fallbackTransition:
      "Next, an instrumental record opens a different landscape without words.",
    lanes: [
      {
        id: "instrumental",
        title: "Instrumental rotation",
        matches: (album) =>
          album.language === "Instrumental" ||
          album.songs.every((song) => song.isInstrumental === true),
      },
    ],
  },
  {
    id: "office-apocalypse",
    title: "Office Apocalypse",
    description:
      "Infinite Loop Solutions is failing again. Deployments, tickets, audits, and meetings become connected rock and metal disasters.",
    selectionSummary:
      "Every available album in the Code, Chaos & Coffee series, played as a mixed office chronicle.",
    fallbackTransition:
      "Next, another department at Infinite Loop Solutions inherits the problem.",
    lanes: [
      {
        id: "infinite-loop-solutions",
        title: "Code, Chaos & Coffee",
        matches: (album, { seriesAlbumIds }) =>
          isInSeries(album, "code-chaos-and-coffee", seriesAlbumIds),
      },
    ],
  },
];

const toRadioAlbum = (album: AlbumData): RadioAlbumSource => ({
  album: {
    id: album.id,
    title: album.title,
    url: `/${album.id}/`,
    artworkUrl: getAlbumCoverImagePath(album.coverImage),
  },
  publishedAt: new Date(album.publishedAt).toISOString(),
  genre: album.genre || "",
  mainGenre: album.mainGenre || "",
  language: album.language || "",
  moods: album.moods,
  energy: album.energy,
  ...(album.radioIntro ? { radioIntro: album.radioIntro } : {}),
  tracks: [...album.songs]
    .sort((a, b) => a.trackNumber - b.trackNumber || a.title.localeCompare(b.title, "en"))
    .map((song) => ({
      trackNumber: song.trackNumber,
      title: song.title,
      audioUrl: song.audioUrl,
      ...(song.durationSeconds ? { durationSeconds: song.durationSeconds } : {}),
    })),
});

const getUniqueAlbums = (lanes: RadioLane[]): RadioAlbumSource[] => {
  const albums = new Map<string, RadioAlbumSource>();
  lanes.forEach((lane) => {
    lane.albums.forEach((album) => albums.set(normalizeId(album.album.id), album));
  });
  return [...albums.values()];
};

const validateStation = (station: RadioStation): void => {
  if (station.albumCount < MINIMUM_ALBUMS) {
    throw new Error(
      `Radio station ${station.id} has ${station.albumCount} albums; at least ${MINIMUM_ALBUMS} are required.`
    );
  }
  if (station.trackCount < MINIMUM_TRACKS) {
    throw new Error(
      `Radio station ${station.id} has ${station.trackCount} tracks; at least ${MINIMUM_TRACKS} are required.`
    );
  }
  if (!station.fallbackTransition.trim()) {
    throw new Error(`Radio station ${station.id} is missing a fallback transition.`);
  }
  if (station.rotation.kind === "alternating-pools") {
    station.lanes.forEach((lane) => {
      if (lane.albums.length < MINIMUM_ALBUMS) {
        throw new Error(
          `Radio lane ${station.id}/${lane.id} has ${lane.albums.length} albums; at least ${MINIMUM_ALBUMS} are required.`
        );
      }
    });
  }

  const newestAlbums = getUniqueAlbums(station.lanes)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() ||
        a.album.title.localeCompare(b.album.title, "en")
    )
    .slice(0, REQUIRED_INTROS_PER_STATION);
  const missingIntros = newestAlbums
    .filter((album) => !album.radioIntro)
    .map((album) => album.album.id);
  if (missingIntros.length > 0) {
    throw new Error(
      `Radio station ${station.id} needs radioIntro copy for: ${missingIntros.join(", ")}.`
    );
  }
};

const buildSeriesAlbumIds = (
  entries: SeriesEntry[]
): ReadonlyMap<string, ReadonlySet<string>> =>
  new Map(
    entries.map((entry) => [
      normalizeId(entry.id),
      new Set(entry.data.albumIds.map(normalizeId)),
    ])
  );

const buildStation = (
  blueprint: StationBlueprint,
  albums: AlbumData[],
  seriesAlbumIds: ReadonlyMap<string, ReadonlySet<string>>
): RadioStation => {
  const claimedAlbumIds = new Set<string>();
  const lanes = blueprint.lanes.map<RadioLane>((lane) => {
    const matchedAlbums = albums
      .filter((album) =>
        lane.matches(album, {
          seriesAlbumIds,
          claimedAlbumIds,
        })
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() ||
          a.title.localeCompare(b.title, "en")
      )
      .map(toRadioAlbum);
    matchedAlbums.forEach((album) => claimedAlbumIds.add(normalizeId(album.album.id)));
    return {
      id: lane.id,
      title: lane.title,
      albums: matchedAlbums,
    };
  });
  const uniqueAlbums = getUniqueAlbums(lanes);
  const previewAlbum = uniqueAlbums[0]?.album;
  if (!previewAlbum) {
    throw new Error(`Radio station ${blueprint.id} has no preview album.`);
  }
  const station: RadioStation = {
    id: blueprint.id,
    title: blueprint.title,
    description: blueprint.description,
    selectionSummary: blueprint.selectionSummary,
    fallbackTransition: blueprint.fallbackTransition,
    rotation: blueprint.alternating
      ? {
          kind: "alternating-pools",
          laneIds: [lanes[0]!.id, lanes[1]!.id],
        }
      : {
          kind: "single-pool",
          laneId: lanes[0]!.id,
        },
    lanes,
    albumCount: uniqueAlbums.length,
    trackCount: uniqueAlbums.reduce((total, album) => total + album.tracks.length, 0),
    durationSeconds: uniqueAlbums.reduce(
      (total, album) =>
        total +
        album.tracks.reduce(
          (albumTotal, track) => albumTotal + (track.durationSeconds || 0),
          0
        ),
      0
    ),
    previewAlbum,
  };
  validateStation(station);
  return station;
};

let catalogPromise: Promise<RadioCatalogPayload> | undefined;

export const getRadioCatalog = (): Promise<RadioCatalogPayload> => {
  catalogPromise ??= Promise.all([
    getAvailableAlbums(),
    getCollection("series") as Promise<SeriesEntry[]>,
  ]).then(([albums, seriesEntries]) => {
    if (albums.length === 0) {
      throw new Error("Radio catalog cannot be built without available albums.");
    }
    const missingEnergy = albums
      .filter((album) => !album.energy)
      .map((album) => album.id);
    if (missingEnergy.length > 0) {
      throw new Error(
        `Radio catalog needs energy metadata for: ${missingEnergy.join(", ")}.`
      );
    }
    const seriesAlbumIds = buildSeriesAlbumIds(seriesEntries);
    return {
      generatedAt: new Date().toISOString(),
      stations: stationBlueprints.map((blueprint) =>
        buildStation(blueprint, albums, seriesAlbumIds)
      ),
    };
  });

  return catalogPromise;
};
