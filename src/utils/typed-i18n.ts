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
  | "game.start.title"
  | "game.start.description"
  | "game.score.result"
  | "game.score.bonus"
  | "game.round.current"
  | "game.round.total"
  | "game.end.title"
  | "game.end.description"
  | "game.end.motivation.excellent"
  | "game.end.motivation.good"
  | "game.end.motivation.average"
  | "game.end.motivation.beginner"
  | "game.end.defaultMotivation"
  | "game.end.shareTemplate"
  | "game.end.shareResults"
  | `game.${string}`;

/**
 * Share-related translation keys
 */
type ShareTranslationKey =
  | "share.title"
  | "share.buttons.group.label"
  | "share.facebook"
  | "share.whatsapp"
  | "share.native"
  | "share.native.label"
  | "share.twitter"
  | "share.email"
  | "share.email.label"
  | "share.copy"
  | "share.copy.label"
  | "share.fallback.message"
  | "share.fallback.retry.label"
  | "share.fallback.retry.text"
  | "share.fallback.manual.label"
  | "share.fallback.manual.text"
  | "share.accessibility.data_unavailable"
  | "share.accessibility.retrying"
  | "share.accessibility.data_found"
  | "share.accessibility.data_still_unavailable"
  | "share.accessibility.retry_failed"
  | "share.accessibility.link_copied"
  | "share.accessibility.link_copied_fallback"
  | "share.accessibility.copy_failed_manual"
  | "share.accessibility.score_shared"
  | "share.accessibility.sharing_cancelled"
  | "share.accessibility.platform_share_failed"
  | "share.accessibility.try_alternative_methods"
  | "share.accessibility.score_copied"
  | "share.accessibility.native_share_failed"
  | "share.accessibility.try_platform_buttons"
  | "share.accessibility.platform_opened"
  | `share.${string}`;

/**
 * Knowledge-related translation keys
 */
type KnowledgeTranslationKey =
  | "knowledge.title"
  | "knowledge.intro"
  | "knowledge.articles.heading"
  | "knowledge.search.heading"
  | "knowledge.search.label"
  | "knowledge.search.placeholder"
  | "knowledge.search.description"
  | "knowledge.search.reset"
  | "knowledge.search.reset.text"
  | "knowledge.search.initial"
  | "knowledge.no.results"
  | "knowledge.no.results.help"
  | "knowledge.search.no.articles"
  | "knowledge.search.one.article"
  | "knowledge.search.all.articles"
  | "knowledge.search.count.articles"
  | "knowledge.search.results.format"
  | "knowledge.search.no.results.format"
  | "knowledge.search.showing.all"
  | "knowledge.reset.search.button"
  | "knowledge.keyboard.instructions"
  | "knowledge.animations.on"
  | "knowledge.animations.off"
  | "knowledge.animations.enabled"
  | "knowledge.animations.disabled"
  | "knowledge.animations.auto.disabled"
  | "knowledge.animations.toggle"
  | "knowledge.empty"
  | `knowledge.${string}`;

/**
 * Highscores-related translation keys
 */
type HighscoresTranslationKey =
  | "highscores.filters"
  | "highscores.allModes"
  | "highscores.allCategories"
  | "highscores.results"
  | "highscores.noResults"
  | "highscores.points"
  | "highscores.rank"
  | "highscores.gameMode"
  | "highscores.category"
  | "highscores.date"
  | "highscores.tableLabel"
  | "highscores.scoreEntry"
  | `highscores.${string}`;

/**
 * Playlist-related translation keys
 */
type PlaylistTranslationKey =
  | "playlist.page.title"
  | "playlist.page.heading"
  | "playlist.page.description"
  | "playlist.search.label"
  | "playlist.search.heading"
  | "playlist.search.placeholder"
  | "playlist.search.aria.label"
  | "playlist.filter.all"
  | "playlist.no.results"
  | "playlist.no.results.heading"
  | "playlist.reset.search"
  | "playlist.grid.heading"
  | "playlist.listen.on"
  | "playlist.listen.spotify"
  | "playlist.listen.deezer"
  | "playlist.listen.apple"
  | "playlist.decade.filter"
  | "playlist.priority.loading"
  | "playlist.music.from.decade"
  | "playlist.streaming.services"
  | "playlist.item.unavailable"
  | "playlist.item.status"
  | "playlist.item.coming.soon"
  | "playlist.item.status.changed.disabled"
  | "playlist.item.status.changed.available"
  | "playlist.accessibility.instruction"
  | "playlist.accessibility.info"
  | "playlist.accessibility.public"
  | "playlist.accessibility.selected"
  | "playlist.accessibility.focus"
  | "playlist.accessibility.opened"
  | "playlist.open.spotify"
  | "playlist.open.deezer"
  | "playlist.open.apple"
  | "playlist.activation.focused"
  | "playlist.activation.no_links"
  | "playlist.exit"
  | "playlist.visible"
  | "playlist.image.alt"
  | "playlist.image.description"
  | `playlist.${string}`;

/**
 * All valid translation keys for the application
 */
export type TranslationKey =
  | BaseTranslationKey
  | AuthTranslationKey
  | ProfileTranslationKey
  | GameTranslationKey
  | ShareTranslationKey
  | KnowledgeTranslationKey
  | HighscoresTranslationKey
  | PlaylistTranslationKey;

/**
 * Translation parameter types based on translation key
 */
export type TranslationParams<K extends TranslationKey> = K extends "game.score.result"
  ? { points: number; total: number }
  : K extends "game.score.newHighScore"
    ? { score: number }
    : K extends "auth.resetPassword.emailSent"
      ? { email: string }
      : K extends "game.joker.remaining"
        ? { count: number }
        : K extends "game.end.announcement.gameOver"
          ? { score: number; level: string }
          : K extends "profile.edit.success"
            ? { username?: string }
            : K extends "share.accessibility.platform_share_failed"
              ? { platform: string; errorMessage: string; recoveryMessage: string }
              : K extends "share.accessibility.native_share_failed"
                ? { errorMessage: string; recoveryMessage: string }
                : K extends "share.accessibility.platform_opened"
                  ? { platform: string }
                  : K extends "highscores.scoreEntry"
                    ? { rank: number; username: string }
                    : K extends "playlist.grid.heading"
                      ? { count: number }
                      : Record<string, never>;

/**
 * Type-safe translation function
 *
 * @param lang The current language code
 * @returns The translation function with type-safe parameters
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
 * // t("game.score.result", { incorrectParam: "value" });
 */
export function useTypedTranslations(lang: string) {
  const translate = baseUseTranslations(lang);

  return <K extends TranslationKey>(key: K, params?: TranslationParams<K>): string => {
    // Use the base translation function but with improved type safety
    return translate(key, params as Record<string, string | number>);
  };
}
