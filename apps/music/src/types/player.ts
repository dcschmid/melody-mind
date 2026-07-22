export interface PlayerTrack {
  trackNumber: number;
  title: string;
  audioUrl: string;
  durationSeconds?: number;
}

export interface PlayerQueue {
  albumId: string;
  albumTitle: string;
  albumUrl: string;
  albumArtworkUrl?: string;
  tracks: PlayerTrack[];
}

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
  }

  interface Window {
    __melodyMindPlayer?: {
      getState: () => PlayerState;
      destroy: () => void;
    };
  }
}
