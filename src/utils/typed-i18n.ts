/**
 * Type-safe internationalization utilities for MelodyMind
 *
 * Provides enhanced type safety for translations, ensuring that
 * all used keys are valid and parameters are correctly provided.
 *
 * @since 1.0.0
 * @category Internationalization
 */
import { useTranslations as baseUseTranslations } from "./i18n";

/**
 * Base translation key pattern
 * Extended by specific application domains
 */
type BaseTranslationKey = `common.${string}` | `validation.${string}` | `errors.${string}`;

/**
 * Authentication-related translation keys
 */
type AuthTranslationKey =
  | "auth.service.unauthorized"
  | "auth.service.invalidCredentials"
  | "auth.login.success"
  | "auth.login.failure"
  | "auth.register.success"
  | "auth.register.failure"
  | "auth.logout.success"
  | "auth.resetPassword.emailSent"
  | "auth.resetPassword.success"
  | "auth.resetPassword.expired"
  | "auth.verify.success"
  | "auth.verify.expired"
  | `auth.${string}`;

/**
 * User profile-related translation keys
 */
type ProfileTranslationKey =
  | "profile.stats.title"
  | "profile.stats.gamesPlayed"
  | "profile.stats.totalScore"
  | "profile.stats.highestScore"
  | "profile.recent.title"
  | "profile.recent.noGames"
  | "profile.settings.title"
  | "profile.edit.success"
  | "profile.edit.failure"
  | `profile.${string}`;

/**
 * Game-related translation keys
 */
type GameTranslationKey =
  | "game.difficulty.easy"
  | "game.difficulty.medium"
  | "game.difficulty.hard"
  | "game.score.result"
  | "game.score.newHighScore"
  | "game.score.total"
  | "game.quiz.correct"
  | "game.quiz.incorrect"
  | "game.quiz.timeBonus"
  | "game.chronology.correct"
  | "game.chronology.incorrect"
  | "game.joker.used"
  | "game.joker.remaining"
  | "game.feedback.audio.failed"
  | "game.feedback.audio.paused"
  | "game.feedback.next.starting"
  | "game.end.defaultMotivation"
  | "game.end.announcement.gameOver"
  | "game.end.level.genius"
  | "game.end.level.pro"
  | "game.end.level.enthusiast"
  | "game.end.level.lover"
  | "game.end.level.explorer"
  | "game.end.motivation.genius"
  | "game.end.motivation.pro"
  | "game.end.motivation.enthusiast"
  | "game.end.motivation.lover"
  | "game.end.motivation.explorer"
  | `game.${string}`;

/**
 * Achievement-related translation keys
 */
type AchievementTranslationKey =
  | "achievements.badge.new"
  | "achievements.badge.count"
  | "achievements.unlock.first"
  | "achievements.unlock.perfectScore"
  | "achievements.unlock.speedDemon"
  | "achievements.unlock.explorer"
  | "achievements.unlock.veteran"
  | `achievements.${string}`;

/**
 * All valid translation keys for the application
 */
export type TranslationKey =
  | BaseTranslationKey
  | AuthTranslationKey
  | ProfileTranslationKey
  | GameTranslationKey
  | AchievementTranslationKey;

/**
 * Translation parameter types based on translation key
 */
export type TranslationParams<K extends TranslationKey> = K extends "game.score.result"
  ? { points: number; total: number }
  : K extends "game.score.newHighScore"
    ? { score: number }
    : K extends "achievements.badge.count"
      ? { count: number }
      : K extends "auth.resetPassword.emailSent"
        ? { email: string }
        : K extends "game.joker.remaining"
          ? { count: number }
          : K extends "game.end.announcement.gameOver"
            ? { score: number; level: string }
            : K extends "profile.edit.success"
              ? { username?: string }
              : Record<string, never>;

/**
 * Type-safe translation function
 *
 * @param {string} lang - The current language code
 * @returns {<K extends TranslationKey>(key: K, params?: TranslationParams<K>) => string}
 *    A translation function with type-safe parameters
 *
 * @example
 * const t = useTypedTranslations("en");
 *
 * // Simple translation without parameters
 * const easyText = t("game.difficulty.easy");
 *
 * // Translation with type-checked parameters
 * const scoreText = t("game.score.result", { points: 450, total: 500 });
 *
 * // TypeScript will error on incorrect parameters
 * // This would cause a compile error:
 * // t("game.score.result", { incorrectParam: "value" });
 */
export function useTypedTranslations(lang: string) {
  const translate = baseUseTranslations(lang);

  return <K extends TranslationKey>(key: K, params?: TranslationParams<K>): string => {
    // Use the base translation function but with improved type safety
    return translate(key, params as Record<string, string | number>);
  };
}
