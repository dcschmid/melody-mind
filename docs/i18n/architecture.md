# MelodyMind Internationalization Architecture

## Overview

This document outlines the internationalization (i18n) architecture for the MelodyMind application,
explaining the design patterns, file structure, data flow, and best practices for multilingual
support.

## Architecture Diagram

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │                         │     │                         │
│  Translation Keys       │────▶│  Type System            │────▶│  UI Components          │
│  (Organized by domain)  │     │  (Type safety layer)    │     │  (Rendering layer)      │
│                         │     │                         │     │                         │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
           │                                │                                │
           │                                │                                │
           ▼                                ▼                                ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │                         │     │                         │
│  Language Files         │────▶│  Translation Functions  │────▶│  User Experience        │
│  (Content by language)  │     │  (Runtime utilities)    │     │  (Final rendered text)  │
│                         │     │                         │     │                         │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

## File Structure

The internationalization system spans several directories and files:

```
src/
  ├── i18n/
  │   ├── ui.ts               # Main configuration and language imports
  │   └── locales/
  │       ├── de.ts           # German translations
  │       ├── en.ts           # English translations (default)
  │       ├── es.ts           # Spanish translations
  │       └── ...             # Other supported languages
  ├── lib/
  │   └── i18n-utils.ts       # Server-side translation utilities
  └── utils/
      └── typed-i18n.ts       # Type definitions for translation keys
```

## Key Components

### 1. Translation Keys (`typed-i18n.ts`)

Defines the type-safe structure for all translation keys in the application, grouped by domain:

```typescript
type BaseTranslationKey = `common.${string}` | `validation.${string}` | `errors.${string}`;

type GameTranslationKey =
  | "game.difficulty.easy"
  | "game.difficulty.medium"
  | "game.difficulty.hard"
  | "game.score.result"
  | "game.score.newHighScore"
  | `game.${string}`;

export type TranslationKey =
  | BaseTranslationKey
  | AuthTranslationKey
  | ProfileTranslationKey
  | GameTranslationKey
  | AchievementTranslationKey;
```

### 2. Translation Parameters (`typed-i18n.ts`)

Defines the required parameters for each translation key using conditional types:

```typescript
export type TranslationParams<K extends TranslationKey> = K extends "game.score.result"
  ? { points: number; total: number }
  : K extends "game.score.newHighScore"
    ? { score: number }
    : K extends "achievements.badge.count"
      ? { count: number }
      : // ...more key-specific parameter types
        Record<string, never>;
```

### 3. Language Configuration (`ui.ts`)

Central configuration for all supported languages:

```typescript
export const languages = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  // ...more languages
};

export const defaultLang = "en";

export const ui = {
  de,
  en,
  es,
  // ...more languages
};
```

### 4. Language Files (`locales/*.ts`)

Individual language files containing all translations for a specific language:

```typescript
// en.ts (English translations)
export default {
  "auth.login.title": "Login",
  "auth.login.email": "Email Address",
  "game.score.result": "You scored {points} out of {total} points!",
  // ...more translations
};

// de.ts (German translations)
export default {
  "auth.login.title": "Anmelden",
  "auth.login.email": "E-Mail-Adresse",
  "game.score.result": "Du hast {points} von {total} Punkten erreicht!",
  // ...more translations
};
```

### 5. Translation Utilities (`i18n-utils.ts`)

Server-side utilities for translating content based on HTTP requests:

```typescript
export function getTypedTranslation<K extends TranslationKey>(
  key: K,
  lang: string = defaultLang,
  params?: TranslationParams<K>
): string {
  // Translation logic with caching, fallback, and parameter replacement
}

export function tTyped<K extends TranslationKey>(
  request: Request,
  key: K,
  params?: TranslationParams<K>
): string {
  const lang = getPreferredLanguage(request);
  return getTypedTranslation(key, lang, params);
}
```

## Data Flow

1. **Translation Key Definition**: Keys are defined and grouped by domain in `typed-i18n.ts`
2. **Parameter Type Definition**: Required parameters for each key are defined using conditional
   types
3. **Content Entry**: Translations for each language are stored in separate files in the `locales`
   directory
4. **Runtime Translation**: The `i18n-utils.ts` module provides functions to retrieve translations
5. **Language Detection**: User language preference is detected from HTTP headers
6. **Parameter Interpolation**: Translation parameters are safely inserted into the translated
   strings
7. **Rendering**: The final translated strings are displayed to the user

## Best Practices

### Key Organization

Translation keys follow a hierarchical structure:

```
domain.feature.specific_text
```

Examples:

- `auth.login.title`
- `game.score.result`
- `errors.validation.required`

### Parameter Usage

Parameters in translation strings use the format:

```
{paramName}
```

Example:

```typescript
// Translation: "You scored {points} out of {total} points!"
getTypedTranslation("game.score.result", "en", { points: 450, total: 500 });
```

### Adding New Languages

To add a new language:

1. Create a new file in the `locales` directory (e.g., `fr.ts` for French)
2. Add all translation keys and their translations
3. Update the `languages` object in `ui.ts` to include the new language
4. Add the new language import and export in `ui.ts`

### Adding New Translation Keys

To add a new translation key:

1. Add the key to the appropriate type in `typed-i18n.ts`
2. If the key requires parameters, update the `TranslationParams` type
3. Add the translation for each supported language in the corresponding files in `locales`

## Integration with UI

### In Astro Components

```astro
---
import { getLangFromUrl, useTranslations } from "../utils/i18n";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<h1>{t("auth.login.title")}</h1>
<p>{t("auth.login.welcome")}</p>
```

### In API Routes

```typescript
import { t } from "../lib/i18n-utils";

export async function GET(request: Request) {
  const welcomeMessage = t(request, "common.welcome");

  return new Response(JSON.stringify({ message: welcomeMessage }));
}
```

## Testing Translations

### Manual Testing

- Switch between languages in the application UI
- Verify that all UI elements are properly translated
- Test parameter replacement in dynamic content

### Automated Testing

- Check for missing translation keys across languages
- Verify parameter usage matches the defined types
- Test fallback mechanisms

## Performance Considerations

- Translation strings are cached for improved performance
- Cache has a maximum size to prevent memory leaks
- Parameter replacement uses efficient algorithms
- Translations are loaded only for the current language

## Accessibility and Internationalization

The i18n system supports accessibility by:

- Providing proper language attributes for HTML elements
- Supporting screen reader announcements in multiple languages
- Maintaining consistent terminology and navigation patterns
- Supporting cultural differences in UI elements

## Conclusion

The MelodyMind internationalization architecture provides a robust, type-safe, and efficient way to
support multiple languages throughout the application. By following the design patterns and best
practices outlined in this document, developers can maintain a consistent and high-quality
multilingual user experience.
