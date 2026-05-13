export interface Song {
  title: string;
  audioUrl: string;
  lyricsUrl?: string;
  isInstrumental?: boolean;
  transcriptUnavailableReason?: string;
  description?: string;
  durationSeconds?: number;
  trackNumber: number;
}

export interface AlbumData {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  coverImageWidth?: number;
  coverImageHeight?: number;
  publishedAt: string;
  genre?: string;
  moods: string[];
  tags: string[];
  language?: string;
  era?: string;
  energy?: "low" | "medium" | "high";
  artist: string;
  isAvailable: boolean;
  songs: Song[];
  metaDescription?: string;
  zipUrl?: string;
  body?: string;
}
