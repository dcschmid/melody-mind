export type VisualsMode = "cover" | "lyrics" | "timeline" | "visualizer";

export type VisualsMotionPreference = "system" | "reduced" | "standard";

export interface VisualTrackMeta {
  trackNumber: number;
  title: string;
  durationSeconds?: number;
  lyricsUrl?: string;
  isInstrumental: boolean;
}

export interface VisualAlbumManifest {
  albumId: string;
  title: string;
  url: string;
  artworkUrl: string;
  language: string;
  ambientColor: string;
  tracks: VisualTrackMeta[];
}

export interface VisualsPreferences {
  mode: VisualsMode;
  motion: VisualsMotionPreference;
}
