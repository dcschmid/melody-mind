export const AUDIO_CONFIG = {
  SKIP_SECONDS: 10,
  SKIP_LARGE_SECONDS: 15,
  TIME_UPDATE_THROTTLE_MS: 250,
} as const;

export const PAGINATION_CONFIG = {
  EPISODES_PER_PAGE: 30,
} as const;

export const SEARCH_CONFIG = {
  DEBOUNCE_MS: 180,
} as const;

export const TRANSCRIPT_CONFIG = {
  MIN_CUES_FOR_VIRTUAL_SCROLL: 500,
} as const;
