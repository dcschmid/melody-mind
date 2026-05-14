import type { AlbumData } from "../types/album";

interface AlbumDiscoveryMeta {
  moods: string[];
  tags: string[];
  language?: string;
  era?: string;
  energy: "low" | "medium" | "high";
}

const normalizeToken = (value?: string) => value?.trim().toLowerCase() || "";

const unique = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

const GENRE_MOOD_MAP: Record<string, string[]> = {
  "dark cabaret": ["dark", "theatrical", "nocturnal"],
  "dream pop": ["dreamy", "melancholic", "atmospheric"],
  gothic: ["dark", "melancholic", "dramatic"],
  "j-metal": ["energetic", "dramatic", "heavy"],
  "k-pop": ["energetic", "romantic", "neon"],
  "metal opera": ["dramatic", "cinematic", "heavy"],
  "neo-classical": ["cinematic", "reflective", "atmospheric"],
  punk: ["energetic", "raw", "rebellious"],
  "rock opera": ["dramatic", "cinematic", "anthemic"],
  soundtrack: ["cinematic", "atmospheric", "epic"],
  "synth-pop": ["neon", "futuristic", "melancholic"],
  "viking metal": ["epic", "heavy", "cinematic"],
};

const GENRE_ENERGY_MAP: Record<string, "low" | "medium" | "high"> = {
  "dark cabaret": "medium",
  "dream pop": "low",
  gothic: "medium",
  "j-metal": "high",
  "k-pop": "high",
  "metal opera": "high",
  "neo-classical": "low",
  punk: "high",
  "rock opera": "high",
  soundtrack: "medium",
  "synth-pop": "medium",
  "viking metal": "high",
};

const LANGUAGE_BY_GENRE: Record<string, string> = {
  "afro-cuban jazz": "Spanish",
  "chanson-pop": "French",
  "german rap": "German",
  "j-metal": "Japanese",
  "k-pop": "Korean",
  "mariachi-pop": "Spanish",
};

export function getAlbumDiscoveryMeta(album: AlbumData): AlbumDiscoveryMeta {
  const genreKey = normalizeToken(album.genre);
  const titleAndDescription = `${album.title} ${album.description}`.toLowerCase();
  const inferredMoods = [...(GENRE_MOOD_MAP[genreKey] || [])];
  const inferredTags = [album.genre || ""];

  if (titleAndDescription.includes("midnight") || titleAndDescription.includes("night")) {
    inferredMoods.push("nocturnal");
  }

  if (titleAndDescription.includes("city") || titleAndDescription.includes("neon")) {
    inferredMoods.push("neon");
    inferredTags.push("city");
  }

  if (titleAndDescription.includes("war") || titleAndDescription.includes("collapse")) {
    inferredMoods.push("dramatic");
    inferredTags.push("conflict");
  }

  if (titleAndDescription.includes("romance") || titleAndDescription.includes("heart")) {
    inferredMoods.push("romantic");
  }

  const language = album.language || LANGUAGE_BY_GENRE[genreKey];

  return {
    moods: unique([...(album.moods || []), ...inferredMoods]),
    tags: unique([...(album.tags || []), ...inferredTags]),
    ...(language ? { language } : {}),
    ...(album.era ? { era: album.era } : {}),
    energy: album.energy || GENRE_ENERGY_MAP[genreKey] || "medium",
  };
}

function scoreRelatedAlbum(currentAlbum: AlbumData, candidate: AlbumData): number {
  const current = getAlbumDiscoveryMeta(currentAlbum);
  const next = getAlbumDiscoveryMeta(candidate);
  let score = 0;

  if (currentAlbum.genre && candidate.genre === currentAlbum.genre) {
    score += 8;
  }

  score += next.moods.filter((mood) => current.moods.includes(mood)).length * 4;
  score += next.tags.filter((tag) => current.tags.includes(tag)).length * 2;

  if (current.energy === next.energy) {
    score += 2;
  }

  if (current.language && current.language === next.language) {
    score += 2;
  }

  if (currentAlbum.artist && currentAlbum.artist === candidate.artist) {
    score += 1;
  }

  const trackDelta = Math.abs(currentAlbum.songs.length - candidate.songs.length);
  if (trackDelta <= 2) {
    score += 1;
  }

  return score;
}

export function getRelatedAlbums(
  currentAlbum: AlbumData,
  albums: AlbumData[],
  limit = 4
): AlbumData[] {
  const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

  return albums
    .filter((album) => album.id !== currentAlbum.id)
    .map((album) => ({
      album,
      score: scoreRelatedAlbum(currentAlbum, album),
    }))
    .sort((a, b) => {
      const scoreDiff = b.score - a.score;
      const dateDiff =
        new Date(b.album.publishedAt).getTime() - new Date(a.album.publishedAt).getTime();

      return (
        scoreDiff ||
        dateDiff ||
        collator.compare(a.album.title, b.album.title) ||
        collator.compare(a.album.id, b.album.id)
      );
    })
    .slice(0, limit)
    .map(({ album }) => album);
}
