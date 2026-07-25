export interface PlayerTrack {
  trackNumber: number;
  title: string;
  audioUrl: string;
  durationSeconds?: number;
}

export interface PlayerAlbumContext {
  id: string;
  title: string;
  url: string;
  artworkUrl?: string;
}

export interface PlayerSeriesContext {
  id: string;
  title: string;
  url: string;
  albumCount: number;
  totalDurationSeconds?: number;
}

interface PlayerQueueBase {
  queueId: string;
  title: string;
  url: string;
  tracks: PlayerTrack[];
}

export interface AlbumPlayerQueue extends PlayerQueueBase {
  kind: "album";
  album: PlayerAlbumContext;
}

export interface RadioPlayerTrack extends PlayerTrack {
  album: PlayerAlbumContext;
  transitionText: string;
  laneId?: string;
}

export interface RadioPlayerQueue extends Omit<PlayerQueueBase, "tracks"> {
  kind: "radio";
  stationId: string;
  tracks: RadioPlayerTrack[];
}

export interface SeriesPlayerTrack extends PlayerTrack {
  album: PlayerAlbumContext;
  partNumber: number;
  albumTrackCount: number;
}

export interface SeriesPlayerTransition {
  beforeAlbumId: string;
  transitionText: string;
}

export interface SeriesPlayerQueue extends Omit<PlayerQueueBase, "tracks"> {
  kind: "series";
  series: PlayerSeriesContext;
  tracks: SeriesPlayerTrack[];
  transitions: SeriesPlayerTransition[];
}

export interface SeriesPlayerIntermission extends SeriesPlayerTransition {
  fromPartNumber: number;
  toPartNumber: number;
}

export type PlayerQueue = AlbumPlayerQueue | RadioPlayerQueue | SeriesPlayerQueue;

export type PlaybackPhase =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "buffering"
  | "intermission"
  | "finished"
  | "error";

export interface PlayerState {
  queue: PlayerQueue | null;
  currentTrackIndex: number;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  isPlaying: boolean;
  playbackPhase: PlaybackPhase;
  errorMessage: string | null;
  seriesIntermission: SeriesPlayerIntermission | null;
  updatedAt: number;
}

export type PlayerCommand =
  | { action: "toggle" }
  | { action: "play" }
  | { action: "pause" }
  | { action: "previous" }
  | { action: "next" }
  | { action: "shuffle" }
  | { action: "mute" }
  | { action: "continue-series" }
  | { action: "minimize" }
  | { action: "expand" }
  | { action: "clear" }
  | { action: "seek"; value: number };

export interface PlayerLoadDetail {
  queue: PlayerQueue;
  startIndex?: number;
  startTime?: number;
  autoplay?: boolean;
  seriesIntermission?: SeriesPlayerIntermission | null;
}

declare global {
  interface WindowEventMap {
    "melodymind:player-load": CustomEvent<PlayerLoadDetail>;
    "melodymind:player-command": CustomEvent<PlayerCommand>;
    "melodymind:playback-state": CustomEvent<PlayerState>;
    "melodymind:radio-event": CustomEvent<import("./radio").RadioEventDetail>;
  }

  interface Window {
    __melodyMindPlayer?: {
      getState: () => PlayerState;
      enableAnalyser: () => Promise<boolean>;
      readAnalyserFrame: (buffer: Uint8Array) => boolean;
      destroy: () => void;
    };
  }
}
