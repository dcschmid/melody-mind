/**
 * Daily Challenge utilities (DB-free)
 *
 * Deterministically select a playable category for a given date.
 * Uses UTC date for stability across time zones and requires no persistence
 * beyond optional localStorage usage by UI components.
 */

import type { Category } from "../category/categoryLoadingUtils";

export type PlayableCategory = Category & Required<Pick<Category, "slug" | "headline" | "imageUrl" | "categoryUrl">>;

/** Return YYYY-MM-DD in UTC */

/** Simple hash for a string → positive 32-bit int */
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

/**
 * Pick a deterministic index for today given available items.
 */
export function pickIndexForToday(length: number, seed: string = "melodymind"): number {
  if (length <= 0) {
    return 0;
  }
  // Inline former dailyKeyUTC(): stable YYYY-MM-DD in UTC
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const dateKey = `${y}-${m}-${d}`;
  const key = `${seed}:${dateKey}`;
  return hashString(key) % length;
}

/**
 * Given a list of playable categories, return today’s selection.
 */
export function pickDailyCategory(categories: PlayableCategory[], seed?: string): PlayableCategory | null {
  const playable = Array.isArray(categories)
    ? categories.filter(
        (c): c is PlayableCategory => Boolean(c && c.isPlayable && c.slug && c.headline && c.imageUrl && c.categoryUrl)
      )
    : [];
  if (playable.length === 0) {
    return null;
  }
  const idx = pickIndexForToday(playable.length, seed);
  return playable[idx];
}

export type Difficulty = "easy" | "medium" | "hard";

/** Build route to game page for category + difficulty */
export function buildGameRoute(lang: string, slug: string, difficulty: Difficulty = "medium"): string {
  const safeLang = String(lang || "en").trim();
  const safeSlug = String(slug).trim();
  return `/${safeLang}/game-${safeSlug}/${difficulty}`;
}

