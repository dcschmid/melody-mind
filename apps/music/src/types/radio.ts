import type { PlayerAlbumContext, PlayerTrack } from "./player";

export type RadioEnergy = "low" | "medium" | "high";
export type RadioStationCategory = "curated" | "mood";

export interface RadioAlbumSource {
  album: PlayerAlbumContext;
  publishedAt: string;
  genre: string;
  mainGenre: string;
  language: string;
  moods: string[];
  energy: RadioEnergy;
  radioIntro?: string;
  tracks: PlayerTrack[];
}

export interface RadioLane {
  id: string;
  title: string;
  albums: RadioAlbumSource[];
}

export type RadioRotation =
  | {
      kind: "single-pool";
      laneId: string;
    }
  | {
      kind: "alternating-pools";
      laneIds: [string, string];
    };

export interface RadioStation {
  id: string;
  category: RadioStationCategory;
  title: string;
  description: string;
  selectionSummary: string;
  fallbackTransition: string;
  rotation: RadioRotation;
  lanes: RadioLane[];
  albumCount: number;
  trackCount: number;
  durationSeconds: number;
  previewAlbum: PlayerAlbumContext;
}

export interface RadioCatalogPayload {
  generatedAt: string;
  stations: RadioStation[];
}

export type RadioEventDetail =
  | {
      type: "session_started";
      stationId: string;
      queueId: string;
      queueLength: number;
      restored: boolean;
      timestamp: number;
    }
  | {
      type: "track_started";
      stationId: string;
      queueId: string;
      albumId: string;
      trackNumber: number;
      reason: "initial" | "auto" | "skip" | "previous" | "resume";
      timestamp: number;
    }
  | {
      type: "track_skipped";
      stationId: string;
      queueId: string;
      albumId: string;
      trackNumber: number;
      elapsedSeconds: number;
      timestamp: number;
    }
  | {
      type: "album_opened";
      stationId: string;
      queueId: string;
      albumId: string;
      trackNumber: number;
      timestamp: number;
    }
  | {
      type: "station_switched";
      fromStationId: string;
      toStationId: string;
      timestamp: number;
    }
  | {
      type: "session_ended";
      stationId: string;
      queueId: string;
      reason: "cleared" | "finished" | "replaced" | "switched";
      listenedSeconds: number;
      tracksStarted: number;
      skips: number;
      timestamp: number;
    };
