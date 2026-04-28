export interface Song {
  title: string;
  audioUrl: string;
  lyricsUrl?: string;
  isInstrumental?: boolean;
  transcriptUnavailableReason?: string;
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
  artist: string;
  isAvailable: boolean;
  songs: Song[];
  metaDescription?: string;
  body?: string;
}
