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

export type PlayerQueue = AlbumPlayerQueue | RadioPlayerQueue;

export interface PlayerState {
  queue: PlayerQueue | null;
  currentTrackIndex: number;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  isPlaying: boolean;
  errorMessage: string | null;
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
  | { action: "minimize" }
  | { action: "expand" }
  | { action: "clear" }
  | { action: "seek"; value: number };

export interface PlayerLoadDetail {
  queue: PlayerQueue;
  startIndex?: number;
  autoplay?: boolean;
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
      destroy: () => void;
    };
  }
}
