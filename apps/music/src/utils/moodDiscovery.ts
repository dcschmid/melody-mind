import type { AlbumData } from "../types/album";

export const MOOD_FAMILIES = [
  {
    id: "dark",
    label: "Dark",
    tokens: [
      "dark",
      "dystopian",
      "haunting",
      "menacing",
      "mysterious",
      "nocturnal",
      "ominous",
      "oppressive",
      "paranoid",
      "threatening",
    ],
  },
  {
    id: "calm",
    label: "Calm",
    tokens: [
      "atmospheric",
      "dreamy",
      "intimate",
      "introspective",
      "reflective",
      "solemn",
      "spiritual",
      "warm",
    ],
  },
  {
    id: "defiant",
    label: "Defiant",
    tokens: [
      "angry",
      "confrontational",
      "defiant",
      "determined",
      "empowering",
      "rebellious",
    ],
  },
  {
    id: "melancholic",
    label: "Melancholic",
    tokens: [
      "bittersweet",
      "emotional",
      "melancholic",
      "mournful",
      "nostalgic",
      "tragic",
    ],
  },
  {
    id: "triumphant",
    label: "Triumphant",
    tokens: [
      "epic",
      "euphoric",
      "heroic",
      "hopeful",
      "majestic",
      "triumphant",
      "uplifting",
    ],
  },
] as const;

export type MoodFamilyId = (typeof MOOD_FAMILIES)[number]["id"];
export type AlbumVoiceType = "instrumental" | "mixed" | "vocal";

const normalizeMood = (mood: string): string =>
  mood.trim().toLocaleLowerCase("en").replaceAll("-", " ");

export function getAlbumMoodFamilies(moods: string[]): MoodFamilyId[] {
  const normalizedMoods = moods.map(normalizeMood);

  return MOOD_FAMILIES.filter((family) =>
    family.tokens.some((token) =>
      normalizedMoods.some((mood) => mood.includes(normalizeMood(token)))
    )
  ).map((family) => family.id);
}

export function getAlbumVoiceType(album: AlbumData): AlbumVoiceType {
  const instrumentalTracks = album.songs.filter(
    (song) => song.isInstrumental === true
  ).length;

  if (
    instrumentalTracks === album.songs.length ||
    album.language?.toLocaleLowerCase("en") === "instrumental"
  ) {
    return "instrumental";
  }

  return instrumentalTracks > 0 ? "mixed" : "vocal";
}

export function getAlbumDurationSeconds(album: AlbumData): number {
  return album.songs.reduce((total, song) => total + (song.durationSeconds ?? 0), 0);
}

export function formatMoodName(mood: string): string {
  const normalized = mood.replaceAll("-", " ").trim();
  return normalized
    ? `${normalized.charAt(0).toLocaleUpperCase("en")}${normalized.slice(1)}`
    : "";
}
