# Adding Translations for New Features

This guide outlines the process for adding new translations to the MelodyMind application when
developing new features or modifying existing ones.

## Overview

Adding proper internationalization support for new features requires several steps:

1. Defining translation keys
2. Adding type information
3. Adding translations for all supported languages
4. Using the translations in your components

## Step 1: Define Translation Keys

Translation keys should follow the established hierarchical pattern:

```
domain.feature.specific_text
```

For example, if you're adding a new feature for playlist management:

```
playlist.create.title
playlist.create.description
playlist.create.button
playlist.error.duplicate
```

## Step 2: Add Type Information

Update the type definitions in `src/utils/typed-i18n.ts`:

1. If this is a new domain, create a new type:

```typescript
/**
 * Playlist-related translation keys
 */
type PlaylistTranslationKey =
  | "playlist.create.title"
  | "playlist.create.description"
  | "playlist.create.button"
  | "playlist.error.duplicate"
  | `playlist.${string}`; // Catch-all for future additions
```

2. Add the new type to the union of all translation keys:

```typescript
export type TranslationKey =
  | BaseTranslationKey
  | AuthTranslationKey
  | ProfileTranslationKey
  | GameTranslationKey
  | AchievementTranslationKey
  | PlaylistTranslationKey; // Add the new type here
```

3. If any keys require parameters, update the `TranslationParams` type:

```typescript
export type TranslationParams<K extends TranslationKey> = K extends "game.score.result"
  ? { points: number; total: number }
  : K extends "playlist.error.duplicate"
    ? { name: string } // Add parameter definitions here
    : Record<string, never>;
```

## Step 3: Add Translations for All Languages

For each supported language, add the translations to the corresponding file in `src/i18n/locales/`:

### English (`en.ts`)

```typescript
// Add to the existing export
export default {
  // Existing translations...

  // New translations
  "playlist.create.title": "Create Playlist",
  "playlist.create.description":
    "Create a new playlist to organize your favorite music trivia categories",
  "playlist.create.button": "Create Playlist",
  "playlist.error.duplicate": 'A playlist named "{name}" already exists',
};
```

### German (`de.ts`)

```typescript
// Add to the existing export
export default {
  // Existing translations...

  // New translations
  "playlist.create.title": "Playlist erstellen",
  "playlist.create.description":
    "Erstelle eine neue Playlist, um deine Lieblings-Musiktrivia-Kategorien zu organisieren",
  "playlist.create.button": "Playlist erstellen",
  "playlist.error.duplicate": 'Eine Playlist mit dem Namen "{name}" existiert bereits',
};
```

### Add to all other supported languages

Repeat the process for all other supported languages in the application.

## Step 4: Use the Translations in Components

### In Astro Components

```astro
---
import { getLangFromUrl, useTranslations } from "../utils/i18n";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<div class="playlist-creator">
  <h2>{t("playlist.create.title")}</h2>
  <p>{t("playlist.create.description")}</p>
  <button>{t("playlist.create.button")}</button>
</div>
```

### In API Routes

```typescript
import { tTyped } from "../lib/i18n-utils";

export async function POST(request: Request) {
  const data = await request.json();

  // Check for duplicate playlists
  if (playlistExists(data.name)) {
    return new Response(
      JSON.stringify({
        error: tTyped(request, "playlist.error.duplicate", { name: data.name }),
      }),
      { status: 400 }
    );
  }

  // Create playlist logic...
}
```

## Step 5: Test Your Translations

### Manual Testing

1. Switch between languages in the UI
2. Verify that all new text is properly translated
3. Test parameter replacement in translations that use parameters

### Automated Testing

Create tests to check for consistency across languages:

```typescript
import { ui } from "../i18n/ui";
import { describe, it, expect } from "vitest";

describe("Playlist Translations", () => {
  it("should have all required keys in all languages", () => {
    const requiredKeys = [
      "playlist.create.title",
      "playlist.create.description",
      "playlist.create.button",
      "playlist.error.duplicate",
    ];

    for (const lang of Object.keys(ui)) {
      for (const key of requiredKeys) {
        expect(ui[lang][key]).toBeDefined();
      }
    }
  });
});
```

## Best Practices

### Do's

✅ Use semantic, hierarchical key names  
✅ Add translations for all supported languages  
✅ Use parameters for dynamic content  
✅ Add type information for new keys  
✅ Document the purpose of each key with comments  
✅ Test translations in the UI

### Don'ts

❌ Hardcode text strings in components  
❌ Use generic key names like "title" or "button"  
❌ Forget to update the type definitions  
❌ Add translations for only some languages  
❌ Use inconsistent terminology across translations

## Example Translation Files

### Full Example: Adding a Quiz Results Feature

#### Type Definitions (`typed-i18n.ts`)

```typescript
// Add to existing types
type QuizResultsTranslationKey =
  | "quiz.results.title"
  | "quiz.results.summary"
  | "quiz.results.correct"
  | "quiz.results.incorrect"
  | "quiz.results.newHighScore"
  | "quiz.results.sharePrompt"
  | `quiz.results.${string}`;

export type TranslationKey =
  | BaseTranslationKey
  | AuthTranslationKey
  // Existing types...
  | QuizResultsTranslationKey;

export type TranslationParams<K extends TranslationKey> = K extends "game.score.result"
  ? { points: number; total: number }
  : K extends "quiz.results.summary"
    ? { correct: number; total: number; percentage: number }
    : K extends "quiz.results.newHighScore"
      ? { score: number; oldScore: number }
      : // Other parameters...
        Record<string, never>;
```

#### English Translations (`en.ts`)

```typescript
export default {
  // Existing translations...

  // Quiz Results
  "quiz.results.title": "Quiz Results",
  "quiz.results.summary": "You got {correct} out of {total} questions right ({percentage}%)",
  "quiz.results.correct": "Correct Answers",
  "quiz.results.incorrect": "Incorrect Answers",
  "quiz.results.newHighScore":
    "New high score! You beat your previous record by {score - oldScore} points",
  "quiz.results.sharePrompt": "Share your results",
};
```

#### German Translations (`de.ts`)

```typescript
export default {
  // Existing translations...

  // Quiz Results
  "quiz.results.title": "Quizergebnisse",
  "quiz.results.summary":
    "Du hast {correct} von {total} Fragen richtig beantwortet ({percentage}%)",
  "quiz.results.correct": "Richtige Antworten",
  "quiz.results.incorrect": "Falsche Antworten",
  "quiz.results.newHighScore":
    "Neuer Highscore! Du hast deinen bisherigen Rekord um {score - oldScore} Punkte übertroffen",
  "quiz.results.sharePrompt": "Teile deine Ergebnisse",
};
```

#### Component Usage

```astro
---
import { getLangFromUrl, useTranslations } from "../utils/i18n";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const { correct, total, score, previousHighScore } = Astro.props;
const percentage = Math.round((correct / total) * 100);
const isNewHighScore = score > previousHighScore;
---

<div class="results-container">
  <h1>{t("quiz.results.title")}</h1>

  <p class="summary">
    {t("quiz.results.summary", { correct, total, percentage })}
  </p>

  <div class="stats">
    <div class="stat">
      <h3>{t("quiz.results.correct")}</h3>
      <p>{correct}</p>
    </div>
    <div class="stat">
      <h3>{t("quiz.results.incorrect")}</h3>
      <p>{total - correct}</p>
    </div>
  </div>

  {
    isNewHighScore && (
      <div class="high-score-alert">
        {t("quiz.results.newHighScore", { score, oldScore: previousHighScore })}
      </div>
    )
  }

  <button class="share-button">
    {t("quiz.results.sharePrompt")}
  </button>
</div>
```

## Conclusion

Following these guidelines ensures that new features in MelodyMind are properly internationalized
and maintain the high standards of type safety and user experience established in the project.
Remember that proper internationalization is not just about translating text but about providing a
consistent and culturally appropriate experience for users across different languages.
