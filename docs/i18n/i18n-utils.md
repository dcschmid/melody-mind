# Internationalization (i18n) Utilities

## Overview

The MelodyMind Internationalization (i18n) System provides comprehensive utilities for translating
content across multiple languages throughout the application. It implements type-safe translation
functions with efficient caching, smart error handling, and seamless fallback mechanisms.

This documentation covers the server-side translation utilities in the `i18n-utils.ts` module, which
is designed to handle language detection from HTTP requests and deliver translations with proper
type safety.

![Internationalization Flow](../public/docs/i18n-flow-diagram.png)

## Key Features

- **Type-Safe Translations**: Enforces correct translation keys and parameters at compile time
- **Intelligent Caching**: Optimizes performance with an LRU-like caching system
- **Language Detection**: Automatically detects user language preferences from HTTP headers
- **Robust Fallback Strategy**: Multi-level fallback mechanism (requested language → default
  language → key)
- **Parameter Interpolation**: Efficient and type-safe replacement of variables in translation
  strings

## Usage Examples

### Basic Translation

```typescript
import { getTranslation } from "../lib/i18n-utils";

// Simple translation without parameters
const welcomeText = getTranslation("auth.login.welcome", "de");

// Translation with parameters
const scoreText = getTranslation("game.score.result", "en", {
  points: 450,
  total: 500,
});
```

### Type-Safe Translation

```typescript
import { getTypedTranslation } from "../lib/i18n-utils";

// Simple translation with type checking
const welcomeText = getTypedTranslation("auth.login.welcome", "de");

// With type-checked parameters
const scoreText = getTypedTranslation("game.score.result", "en", {
  points: 450,
  total: 500,
});

// This would cause a TypeScript error:
// const error = getTypedTranslation("game.score.result", "en", {
//   wrongParam: 123  // Error: Type '{ wrongParam: number; }' is not assignable...
// });
```

### HTTP Request-Based Translation

```typescript
import { t, tTyped } from "../lib/i18n-utils";

// In an API route or server component:
export function GET(request: Request) {
  // Regular version
  const welcomeMessage = t(request, "common.welcome");
  const scoreMessage = t(request, "game.score.result", { points: 450, total: 500 });

  // Type-safe version with parameter validation
  const typedMessage = tTyped(request, "game.score.result", { points: 450, total: 500 });

  return new Response(JSON.stringify({ welcomeMessage, scoreMessage, typedMessage }));
}
```

## API Reference

### Types and Interfaces

#### `LanguageCode`

A branded type for language codes that ensures type safety by preventing regular strings from being
used where language codes are expected.

```typescript
export type LanguageCode = string & { readonly __brand: typeof LANGUAGE_CODE_BRAND };
```

#### `SupportedLanguage`

Type representing the currently supported languages in the application.

```typescript
export type SupportedLanguage = keyof typeof languages;
```

#### `TranslationKey`

Type representing all valid translation keys in the application (imported from `typed-i18n.ts`).

#### `TranslationParams<K>`

Conditional type that provides the correct parameter structure based on the translation key.

```typescript
// Example from typed-i18n.ts
export type TranslationParams<K extends TranslationKey> = K extends "game.score.result"
  ? { points: number; total: number }
  : K extends "game.score.newHighScore"
    ? { score: number }
    : K extends "achievements.badge.count"
      ? { count: number }
      : // ...more key-specific parameter types
        Record<string, never>;
```

### Exception Classes

#### `TranslationError`

Custom error class for translation-related errors.

```typescript
export class TranslationError extends Error {
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

### Functions

#### `createCacheKey`

Creates a unique cache key for storing and retrieving translations.

```typescript
function createCacheKey(
  key: string,
  lang: string,
  params?: Record<string, string | number>
): string;
```

**Parameters:**

- `key: string` - The translation key
- `lang: string` - The language code
- `params?: Record<string, string | number>` - Optional parameters for the translation

**Returns:** A unique string to use as a cache key

#### `getTypedTranslation`

Returns a translation for a specific key with type-safe parameters.

```typescript
export function getTypedTranslation<K extends TranslationKey>(
  key: K,
  lang: string = defaultLang,
  params?: TranslationParams<K>
): string;
```

**Parameters:**

- `key: K` - The translation key (type-safe)
- `lang: string` - The language code (defaults to defaultLang)
- `params?: TranslationParams<K>` - Type-safe parameters for the translation

**Returns:** The translated string

**Throws:** `TranslationError` when the key is missing and strict error checking is enabled

#### `getTranslation`

Legacy version of the translation function maintained for backwards compatibility.

```typescript
export function getTranslation(
  key: string,
  lang: string = defaultLang,
  params?: Record<string, string | number>
): string;
```

**Parameters:**

- `key: string` - The translation key
- `lang: string` - The language code (defaults to defaultLang)
- `params?: Record<string, string | number>` - Parameters for the translation

**Returns:** The translated string

#### `getPreferredLanguage`

Extracts the preferred language from the Accept-Language header of an HTTP request.

```typescript
export function getPreferredLanguage(request: Request): string;
```

**Parameters:**

- `request: Request` - The HTTP request object

**Returns:** The preferred language code or the default language

#### `t`

Returns a translation based on the language detected from an HTTP request.

```typescript
export function t(request: Request, key: string, params?: Record<string, string | number>): string;
```

**Parameters:**

- `request: Request` - The HTTP request object
- `key: string` - The translation key
- `params?: Record<string, string | number>` - Parameters for the translation

**Returns:** The translated string

#### `tTyped`

Type-safe version of the request-based translation function.

```typescript
export function tTyped<K extends TranslationKey>(
  request: Request,
  key: K,
  params?: TranslationParams<K>
): string;
```

**Parameters:**

- `request: Request` - The HTTP request object
- `key: K` - The translation key (type-safe)
- `params?: TranslationParams<K>` - Type-safe parameters for the translation

**Returns:** The translated string

## Implementation Details

### Translation Cache

The module implements an efficient caching system to improve performance for frequently used
translations:

```typescript
const translationCache = new Map<string, string>();
const MAX_CACHE_SIZE = 500;
```

When the cache reaches its maximum size, half of the oldest entries are removed to prevent memory
leaks while maintaining good performance.

### Fallback Strategy

The module implements a multi-level fallback strategy for translations:

1. Try to find the translation in the requested language
2. If not found, try to find it in the default language
3. If still not found, use the key itself as the translation

This ensures that the application always displays something meaningful to the user, even if a
translation is missing.

### Parameter Interpolation

Translation strings can include placeholders in the format `{paramName}` that are replaced with
actual values:

```typescript
// Translation string: "You scored {points} out of {total} points!"
getTypedTranslation("game.score.result", "en", { points: 450, total: 500 });
// Result: "You scored 450 out of 500 points!"
```

The implementation uses an efficient single-pass replacement algorithm to handle multiple
parameters.

## Accessibility Considerations

The internationalization system supports accessibility best practices by:

- Providing consistent translations for screen readers
- Supporting proper language attributes for HTML elements
- Enabling cultural adaptations beyond just text translation
- Maintaining consistent terminology across the application

## Internationalization Beyond Text

While this module focuses on text translation, the MelodyMind i18n system also supports:

- Date and time formatting based on locale
- Number formatting based on locale
- Right-to-left (RTL) languages
- Cultural adaptations (colors, imagery, etc.)

## Related Modules

- [typed-i18n.ts](./typed-i18n.md) - Type definitions for translation keys and parameters
- [i18n/ui.ts](./ui.md) - Central configuration for all supported languages
- [i18n/locales/\*.ts](./locales.md) - Language-specific translation files

## Changelog

### Version 3.0.0

- Added `tTyped` function for type-safe request-based translations
- Improved translation caching with LRU-like eviction strategy
- Enhanced error handling with dedicated `TranslationError` class

### Version 2.5.0

- Added support for branded language code types
- Improved parameter interpolation performance
- Added JSDoc documentation for all public API functions

### Version 2.0.0

- Introduced type-safe translations with `getTypedTranslation`
- Added support for conditional parameter types
- Implemented caching for translation strings

### Version 1.0.0

- Initial release with basic translation functionality
- Support for language detection from HTTP headers
- Simple parameter replacement in translation strings
