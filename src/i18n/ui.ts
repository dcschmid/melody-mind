/**
 * @file ui.ts
 * @description Main internationalization (i18n) configuration file for MelodyMind.
 * This file centralizes all language imports and exports the necessary objects
 * for the application's internationalization system.
 */

// Import all language locale files
import { FALLBACK_LANGUAGE } from "@constants/i18n";

import de from "./locales/de"; // German
import en from "./locales/en"; // English
import es from "./locales/es"; // Spanish
import fr from "./locales/fr"; // French
import it from "./locales/it"; // Italian
import pt from "./locales/pt"; // Portuguese

/**
 * Internationalization Key Notes (Playlists Images)
 * ---------------------------------------------------------------------------
 * Recently added keys for playlist cover accessibility & SEO context:
 *
 *  - "playlist.image.alt"
 *    Short, user-facing alt text for the playlist cover image. Should remain
 *    concise (roughly <110 chars) and include enough context to distinguish
 *    between similarly named playlists.
 *
 *  - "playlist.image.description"
 *    (Optional) Longer descriptive text when richer context is needed
 *    (e.g., for meta descriptions, figure captions, or future structured
 *    data generation). Some locales intentionally still have this empty while
 *    translators provide accurate phrasing. Empty values are acceptable and
 *    should gracefully fallback to the alt text where a description is
 *    requested.
 *
 * Placeholder variables used in both keys:
 *  - {headline}: Primary playlist title/headline (string)
 *  - {introSubline}: Secondary subtitle or tagline (string, may be empty)
 *  - {decade}: Localized decade / era label (string, e.g. "1990s")
 *
 * Implementation Guidance:
 *  - Always pass all placeholder variables when calling t("playlist.image.alt", { ... }).
 *  - Do NOT embed raw quotation marks around placeholders in translations; translators
 *    should treat them as natural sentence components.
 *  - If a language does not naturally use an en-dash (–) keep consistent punctuation style.
 *  - Keep alt text purely descriptive; avoid marketing adjectives.
 *
 * Accessibility:
 *  - Alt text MUST exist for non-decorative covers. If for any reason a cover
 *    becomes decorative, the consuming component should render `alt=""` and
 *    not invoke the translation key.
 *
 * Fallback Behavior:
 *  - Missing or empty description should not break rendering; callers can
 *    fallback to the alt key or omit extended description blocks.
 */

/**
 * @constant languages
 * @description Object containing all supported languages with their native display names.
 * Used in language selection UI components and for display purposes.
 * @type {Record<string, string>}
 */
export const languages: Record<string, string> = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
};

/**
 * @constant defaultLang
 * @description The default language code to fall back to if a user's preferred language is not available.
 * Used when initializing the application and when no language preference is detected.
 * @type {string}
 */
export const defaultLang: string = FALLBACK_LANGUAGE;

/**
 * @constant ui
 * @description Object containing all UI translation dictionaries indexed by language code.
 * Each language object contains key-value pairs of translation keys and their corresponding
 * translated text for that language.
 * @type {Record<string, Record<string, string>>}
 */
export const ui: Record<string, Record<string, string>> = {
  de,
  en,
  es,
  fr,
  it,
  pt,
};
