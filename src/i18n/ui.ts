/**
 * @file ui.ts
 * @description Main internationalization (i18n) configuration file for MelodyMind.
 * This file centralizes all language imports and exports the necessary objects
 * for the application's internationalization system.
 */

// Import all language locale files
import cn from "./locales/cn"; // Chinese
import da from "./locales/da"; // Danish
import de from "./locales/de"; // German
import en from "./locales/en"; // English
import es from "./locales/es"; // Spanish
import fi from "./locales/fi"; // Finnish
import fr from "./locales/fr"; // French
import it from "./locales/it"; // Italian
import jp from "./locales/jp"; // Japanese
import nl from "./locales/nl"; // Dutch
import pt from "./locales/pt"; // Portuguese
import ru from "./locales/ru"; // Russian
import sv from "./locales/sv"; // Swedish
import uk from "./locales/uk"; // Ukrainian

/**
 * @constant languages
 * @description Object containing all supported languages with their native display names.
 * Used in language selection UI components and for display purposes.
 * @type {Record<string, string>}
 */
export const languages = {
  cn: "中文",
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  jp: "日本語",
  nl: "Nederlands",
  pt: "Português",
  ru: "Русский",
  da: "Dansk",
  fi: "Suomi",
  sv: "Svenska",
  uk: "Українська",
};

/**
 * @constant defaultLang
 * @description The default language code to fall back to if a user's preferred language is not available.
 * Used when initializing the application and when no language preference is detected.
 * @type {string}
 */
export const defaultLang = "en";

/**
 * @constant ui
 * @description Object containing all UI translation dictionaries indexed by language code.
 * Each language object contains key-value pairs of translation keys and their corresponding
 * translated text for that language.
 * @type {Record<string, Record<string, string>>}
 */
export const ui = {
  cn,
  da,
  de,
  en,
  es,
  fi,
  fr,
  it,
  jp,
  nl,
  pt,
  ru,
  sv,
  uk,
};
