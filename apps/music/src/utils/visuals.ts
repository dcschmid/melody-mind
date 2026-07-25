import type {
  VisualsMode,
  VisualsMotionPreference,
  VisualsPreferences,
} from "../types/visuals";
import type { PlayerQueue } from "../types/player";

export const VISUALS_PREFERENCES_KEY = "melodymind:visuals-preferences:v1";
export const VISUALIZER_BAND_COUNT = 24;

export const DEFAULT_VISUALS_PREFERENCES: VisualsPreferences = {
  mode: "cover",
  motion: "system",
};

const VISUALS_MODES: readonly VisualsMode[] = [
  "cover",
  "lyrics",
  "timeline",
  "visualizer",
];
const MOTION_PREFERENCES: readonly VisualsMotionPreference[] = [
  "system",
  "reduced",
  "standard",
];

export const parseVisualsPreferences = (value: string | null): VisualsPreferences => {
  if (!value) {
    return { ...DEFAULT_VISUALS_PREFERENCES };
  }

  try {
    const parsed = JSON.parse(value) as Partial<VisualsPreferences>;
    return {
      mode: VISUALS_MODES.includes(parsed.mode as VisualsMode)
        ? (parsed.mode as VisualsMode)
        : DEFAULT_VISUALS_PREFERENCES.mode,
      motion: MOTION_PREFERENCES.includes(parsed.motion as VisualsMotionPreference)
        ? (parsed.motion as VisualsMotionPreference)
        : DEFAULT_VISUALS_PREFERENCES.motion,
    };
  } catch {
    return { ...DEFAULT_VISUALS_PREFERENCES };
  }
};

export const getAvailableVisualsModes = (
  queue: PlayerQueue | null,
  track: { lyricsUrl?: string; isInstrumental?: boolean } | null,
  analyserAvailable = true
): VisualsMode[] =>
  VISUALS_MODES.filter((mode) => {
    if (mode === "lyrics") {
      return Boolean(track?.lyricsUrl && !track.isInstrumental);
    }
    if (mode === "timeline") {
      return queue?.kind !== "radio";
    }
    if (mode === "visualizer") {
      return analyserAvailable;
    }
    return true;
  });

export const splitLyricsPages = (lyrics: string): string[] => {
  const normalized = lyrics.replace(/\r\n?/gu, "\n").trim();
  if (!normalized) {
    return [];
  }

  const stanzas = normalized
    .split(/\n\s*\n/gu)
    .map((stanza) => stanza.trim())
    .filter(Boolean);
  const pages: string[] = [];
  let page = "";

  stanzas.forEach((stanza) => {
    const candidate = page ? `${page}\n\n${stanza}` : stanza;
    const lineCount = candidate.split("\n").length;
    if (page && (candidate.length > 900 || lineCount > 18)) {
      pages.push(page);
      page = stanza;
    } else {
      page = candidate;
    }
  });

  if (page) {
    pages.push(page);
  }
  return pages;
};

export const mapTrackProgressToScroll = (
  currentTime: number,
  duration: number,
  scrollHeight: number,
  clientHeight: number
): number => {
  if (duration <= 0 || scrollHeight <= clientHeight) {
    return 0;
  }
  const progress = Math.min(1, Math.max(0, currentTime / duration));
  return Math.round((scrollHeight - clientHeight) * progress);
};

const clampColor = (value: number): number => Math.min(255, Math.max(0, value));

export const mixAmbientColor = (
  dominant: { r: number; g: number; b: number } | null | undefined,
  roomNight = { r: 5, g: 13, b: 27 }
): string => {
  if (!dominant) {
    return `rgb(${roomNight.r} ${roomNight.g} ${roomNight.b})`;
  }
  const mix = (channel: "r" | "g" | "b") =>
    Math.round(
      clampColor(roomNight[channel]) * 0.72 + clampColor(dominant[channel]) * 0.28
    );
  return `rgb(${mix("r")} ${mix("g")} ${mix("b")})`;
};
