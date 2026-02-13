export interface CareerTimelineItem {
  year: string;
  event: string;
}

export interface KeySong {
  title: string;
  spotifyId?: string;
  deezerId?: string;
}

export interface ArtistData {
  name: string;
  photo?: string;
  biography: string;
  born?: string;
  died?: string;
  origin: string;
  genres: string[];
  influencedBy: string[];
  influenced: string[];
  keyAlbums: string[];
  keySongs: (string | KeySong)[];
  relatedArticles: string[];
  discographyOverview?: string;
  careerTimeline: CareerTimelineItem[];
}

export interface ArtistEntry {
  id: string;
  slug?: string;
  data: ArtistData;
}
