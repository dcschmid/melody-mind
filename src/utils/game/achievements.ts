/**
 * Achievement tier evaluation utility.
 * Centralizes score thresholds and fallback labels used across overlays & sharing.
 */
export interface AchievementTier {
  id: string;
  minScore: number;
  /** Default (English) fallback label with emojis */
  fallback: string;
}

export const ACHIEVEMENT_TIERS: readonly AchievementTier[] = [
  { id: "genius", minScore: 800, fallback: "🎵 Music Genius! 🎵" },
  { id: "pro", minScore: 600, fallback: "🎧 Music Pro! 🎧" },
  { id: "enthusiast", minScore: 400, fallback: "🎸 Music Enthusiast! 🎸" },
  { id: "lover", minScore: 200, fallback: "🎹 Music Lover! 🎹" },
  { id: "explorer", minScore: 0, fallback: "🎼 Music Explorer! 🎼" },
] as const;

export type AchievementId = (typeof ACHIEVEMENT_TIERS)[number]["id"];

/** Lookup map for quick tier resolution */
const sorted = [...ACHIEVEMENT_TIERS].sort((a, b) => b.minScore - a.minScore);

/**
 * Resolve achievement tier by numeric score.
 * @param {number} score Player's numeric score
 * @returns {AchievementTier} tier object
 */
export function resolveAchievement(score: number): AchievementTier {
  for (const tier of sorted) {
    if (score >= tier.minScore) {
      return tier;
    }
  }
  return sorted[sorted.length - 1];
}

/**
 * Convenience: get localized label via translation function; fallback to tier default.
 */
export function getAchievementLabel(
  score: number,
  t?: (key: string) => string | undefined
): string {
  const tier = resolveAchievement(score);
  if (t) {
    const key = `share.achievement.${tier.id}`;
    const translated = t(key);
    if (translated) {
      return translated;
    }
  }
  return tier.fallback;
}

export default {
  ACHIEVEMENT_TIERS,
  resolveAchievement,
  getAchievementLabel,
};
