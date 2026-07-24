export const SERIES_MARATHON_STORAGE_KEY = "melodymind:series-marathon-progress:v1";

export type SeriesMarathonPhase = "listening" | "intermission" | "completed";

export interface SeriesMarathonProgress {
  seriesId: string;
  albumId: string;
  trackNumber: number;
  currentTime: number;
  phase: SeriesMarathonPhase;
  nextAlbumId?: string;
  updatedAt: number;
}

interface StoredSeriesMarathons {
  version: 1;
  progress: Record<string, SeriesMarathonProgress>;
}

const isProgress = (value: unknown): value is SeriesMarathonProgress => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const progress = value as Partial<SeriesMarathonProgress>;
  return (
    typeof progress.seriesId === "string" &&
    typeof progress.albumId === "string" &&
    typeof progress.trackNumber === "number" &&
    typeof progress.currentTime === "number" &&
    ["listening", "intermission", "completed"].includes(progress.phase || "") &&
    typeof progress.updatedAt === "number" &&
    (progress.nextAlbumId === undefined || typeof progress.nextAlbumId === "string")
  );
};

const readStore = (): StoredSeriesMarathons => {
  try {
    const raw = window.localStorage.getItem(SERIES_MARATHON_STORAGE_KEY);
    if (!raw) {
      return { version: 1, progress: {} };
    }

    const parsed = JSON.parse(raw) as Partial<StoredSeriesMarathons>;
    if (parsed.version !== 1 || !parsed.progress || typeof parsed.progress !== "object") {
      return { version: 1, progress: {} };
    }

    const progress = Object.fromEntries(
      Object.entries(parsed.progress).filter(
        ([seriesId, value]) => isProgress(value) && seriesId === value.seriesId
      )
    );
    return { version: 1, progress };
  } catch {
    return { version: 1, progress: {} };
  }
};

export const readSeriesMarathonProgress = (
  seriesId: string
): SeriesMarathonProgress | null => readStore().progress[seriesId] || null;

export const writeSeriesMarathonProgress = (progress: SeriesMarathonProgress): void => {
  try {
    const stored = readStore();
    stored.progress[progress.seriesId] = progress;
    window.localStorage.setItem(SERIES_MARATHON_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Playback remains available when local storage is blocked.
  }
};

export const clearSeriesMarathonProgress = (seriesId: string): void => {
  try {
    const stored = readStore();
    delete stored.progress[seriesId];
    window.localStorage.setItem(SERIES_MARATHON_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Starting over still works for the current session when storage is blocked.
  }
};
