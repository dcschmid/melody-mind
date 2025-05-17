# TypeScript Dokumentation - i18n-utils.ts

## Überblick

Die Datei `i18n-utils.ts` enthält die grundlegenden Internationalisierungs-Utilities für die
MelodyMind-Anwendung. Diese ermöglichen die typsichere Übersetzung von Texten, Erkennung von
Benutzersprachen aus HTTP-Anfragen und optimierte Übersetzungsfunktionen mit Caching-Mechanismen.

```typescript
/**
 * Internationalization utilities for MelodyMind
 *
 * @since 1.0.0
 * @category Internationalization
 */
```

## Typen

### `LanguageCode`

Eine Branded Type für Sprachcodes, die zusätzliche Typensicherheit bietet.

```typescript
export type LanguageCode = string & { readonly __brand: typeof LANGUAGE_CODE_BRAND };
```

### `SupportedLanguage`

Ein Typalias, das direkt an die unterstützten Sprachen gebunden ist.

```typescript
export type SupportedLanguage = keyof typeof languages;
```

### `TranslationDictionary`

Ein einfaches Key-Value-Dictionary für Übersetzungen.

```typescript
type TranslationDictionary = Record<string, string>;
```

## Klassen

### `TranslationError`

Eine spezialisierte Fehlerklasse für Übersetzungsprobleme.

```typescript
/**
 * Possible errors that can occur during translation
 *
 * @since 1.0.0
 * @category Internationalization
 */
export class TranslationError extends Error {
  /**
   * Creates a new TranslationError instance
   *
   * @param {string} message - Error message describing the issue
   * @param {string} key - The translation key that caused the error
   * @param {string} lang - The language code that was being used
   */
  constructor(
    message: string,
    public readonly key: string,
    public readonly lang: string
  ) {
    super(message);
    this.name = "TranslationError";
  }
}
```

## Funktionen

### `createCacheKey`

Erzeugt einen eindeutigen Cache-Schlüssel für Übersetzungen.

```typescript
/**
 * Creates a cache key from translation parameters
 *
 * @since 1.0.0
 * @category Internationalization
 *
 * @param {string} key - The translation key
 * @param {string} lang - The language code
 * @param {Record<string, string | number>} [params] - Optional translation parameters
 * @returns {string} A unique cache key string
 */
function createCacheKey(
  key: string,
  lang: string,
  params?: Record<string, string | number>
): string {
  return params ? `${lang}:${key}:${JSON.stringify(params)}` : `${lang}:${key}`;
}
```

### `getTypedTranslation`

Die Hauptfunktion für typsichere Übersetzungen mit Parameterprüfung zur Kompilierzeit.

```typescript
/**
 * Returns a translation for a specific key with type-safe parameters
 *
 * @since 1.0.0
 * @category Internationalization
 *
 * @template K - Translation key type constraint
 * @param {K} key - The translation key
 * @param {string} lang - The language (optional, defaults to defaultLang)
 * @param {TranslationParams<K>} [params] - Type-safe parameters for the translation
 * @returns {string} The translated string
 *
 * @throws {TranslationError} When the translation key is missing and no fallback is available
 */
export function getTypedTranslation<K extends TranslationKey>(
  key: K,
  lang: string = defaultLang,
  params?: TranslationParams<K>
): string {
  // Implementation details...
}
```

### `getTranslation`

Eine Legacy-Funktion für Rückwärtskompatibilität, delegiert intern an `getTypedTranslation`.

```typescript
/**
 * Returns a translation for a specific key (compatibility version)
 *
 * @since 1.0.0
 * @category Internationalization
 * @deprecated Use getTypedTranslation for better type safety
 *
 * @param {string} key - The translation key
 * @param {string} lang - The language (optional, defaults to defaultLang)
 * @param {Record<string, string | number>} [params] - Parameters for the translation
 * @returns {string} The translated string
 */
export function getTranslation(
  key: string,
  lang: string = defaultLang,
  params?: Record<string, string | number>
): string {
  return getTypedTranslation(
    key as TranslationKey,
    lang,
    params as TranslationParams<TranslationKey>
  );
}
```

### `getPreferredLanguage`

Extrahiert die bevorzugte Sprache aus dem Accept-Language Header einer HTTP-Anfrage.

```typescript
/**
 * Extracts the preferred language from the Accept-Language header
 *
 * @since 1.0.0
 * @category Internationalization
 *
 * @param {Request} request - The HTTP request object
 * @returns {string} The preferred language code or the default language
 */
export function getPreferredLanguage(request: Request): string {
  // Implementation details...
}
```

### `t`

Eine vereinfachte Funktion zur Übersetzung basierend auf HTTP-Anfragen.

```typescript
/**
 * Returns a translation based on the request
 *
 * @since 1.0.0
 * @category Internationalization
 *
 * @param {Request} request - The HTTP request object
 * @param {string} key - The translation key
 * @param {Record<string, string | number>} [params] - Parameters for the translation
 * @returns {string} The translated string
 */
export function t(request: Request, key: string, params?: Record<string, string | number>): string {
  const lang = getPreferredLanguage(request);
  return getTranslation(key, lang, params);
}
```

### `tTyped`

Die typsichere Version der anfragenbasierten Übersetzungsfunktion.

```typescript
/**
 * Type-safe version of the request-based translation function
 *
 * @since 1.0.0
 * @category Internationalization
 *
 * @template K - Translation key type constraint
 * @param {Request} request - The HTTP request object
 * @param {K} key - The translation key with type checking
 * @param {TranslationParams<K>} [params] - Type-safe parameters for the translation
 * @returns {string} The translated string
 */
export function tTyped<K extends TranslationKey>(
  request: Request,
  key: K,
  params?: TranslationParams<K>
): string {
  const lang = getPreferredLanguage(request);
  return getTypedTranslation(key, lang, params);
}
```

## Implementierungsdetails

### Caching-Mechanismus

Das Modul implementiert einen effizienten Cache für häufig verwendete Übersetzungen, um die Leistung
zu optimieren.

```typescript
const translationCache = new Map<string, string>();
const MAX_CACHE_SIZE = 500;
```

### Fallback-Strategie

Die Implementierung verwendet eine mehrstufige Fallback-Strategie:

1. Versuche, die Übersetzung in der angeforderten Sprache zu finden
2. Falls nicht gefunden, versuche die Standardsprache
3. Falls noch immer nicht gefunden, verwende den Schlüssel selbst

## Beispiele

### Einfache Übersetzung

```typescript
import { getTypedTranslation } from "../lib/i18n-utils";

// Einfache Übersetzung ohne Parameter
const welcomeText = getTypedTranslation("auth.login.welcome", "de");

// Mit Parameter-Ersetzung
const scoreText = getTypedTranslation("game.score.result", "en", {
  points: 450,
  total: 500,
});
```

### Verwendung in API-Routen

```typescript
import { tTyped } from "../lib/i18n-utils";

export function GET(request: Request) {
  const welcomeMessage = tTyped(request, "common.welcome");
  const scoreMessage = tTyped(request, "game.score.result", {
    points: 450,
    total: 500,
  });

  return new Response(
    JSON.stringify({
      message: welcomeMessage,
      score: scoreMessage,
    })
  );
}
```

## Weitere Informationen

Für vollständige Details der TypeScript-Implementierung und der Übersetzungsschlüssel siehe:

- `src/utils/typed-i18n.ts` - Typdefinitionen für Übersetzungsschlüssel
- `src/i18n/ui.ts` - Zentrale Konfiguration für alle unterstützten Sprachen
- `src/i18n/locales/*.ts` - Sprachspezifische Übersetzungsdateien
