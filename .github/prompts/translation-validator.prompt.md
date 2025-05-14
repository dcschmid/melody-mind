# Translation Validator

This prompt is designed to help validate the correct usage of translated strings in code. Always look for hardcoded strings that should be internationalized using translation functions.

## Problematic Example (Hardcoded Strings)

```javascript
function announceToScreenReaders() {
  screenReader.speak("New achievement unlocked!");
}
```

## Correct Example (Using Translation Keys)

```javascript
function announceToScreenReaders() {
  screenReader.speak(t("achievements.badge.new"));
}
```

## Guidelines for Translation

1. All user-facing text should use the translation function (often `t()` or similar).
2. Never hardcode text strings that will be displayed to users.
3. Use semantic translation keys that follow a hierarchy (e.g., `component.action.state`).
4. Ensure placeholders are properly passed for dynamic content: `t("welcome.message", { username: user.name })`.

## Common Issues to Watch For

- Text in notification messages
- Button labels and form placeholders
- Error messages and validation texts
- Screen reader announcements
- Modal and dialog content
- Status messages and tooltips

When reviewing code, always replace hardcoded strings with appropriate translation keys to ensure proper internationalization.

# Translation Key Finder and Validator

This prompt file helps identify static text in code and ensures that all translation keys are correctly present in all language files.

## Purpose and Functions

The prompt file:

1. Searches for hardcoded, static texts in code that should be translated
2. Verifies existing translation keys in all language files (`src/i18n/locales/*.ts`)
3. Adds missing translation keys to all supported languages
4. Converts hardcoded texts into translation keys and adds them to all language files

## Usage Instructions

The Translation Key Finder can be used in the following situations:

- **New Components**: After creating new components, to ensure all texts are translated
- **Code Review**: Before commit or pull request, to identify missing translations
- **Refactoring**: When revising older code areas to identify hardcoded texts
- **Localization**: When adding new languages to ensure complete translation coverage

## Common Areas for Static Text

- **UI Labels**: Labels for buttons, input fields, etc.
- **Error Messages**: Texts that display errors or warnings to the user
- **Notifications**: Pop-up texts or status messages
- **ARIA Labels**: Accessibility text for screen readers
- **Placeholders**: Placeholder text in input fields
- **Status Texts**: "Loading", "Completed", etc.
- **JavaScript Notifications**: Text in alert dialogs or console messages

## Translation Process

### 1. Identification of Need

```astro
<!-- Before: Hardcoded text in an Astro component -->
<button aria-label="New achievement unlocked">
  <span class="sr-only">You now have {count} new achievements</span>
</button>
```

// Hardcoded text in JavaScript

```javascript
function announceToScreenReaders() {
  screenReader.speak("New achievement unlocked!");
}
```

### 2. Extraction and Definition

For these texts, translation keys are created:

```typescript
// src/i18n/locales/en.ts
{
  // Existing translations...
  "achievements.badge.new": "New achievement unlocked",
  "achievements.badge.count": "You now have {count} new achievements"
}

// src/i18n/locales/de.ts
{
  // Existing translations...
  "achievements.badge.new": "Neue Errungenschaft freigeschaltet",
  "achievements.badge.count": "Du hast jetzt {count} neue Errungenschaften"
}
```

### 3. Implementation

```astro
<!-- After: Translated text with t() function -->
<button aria-label={t("achievements.badge.new")}>
  <span class="sr-only">{t("achievements.badge.count", { count })}</span>
</button>
```

## Naming Conventions for Translation Keys

- Use hierarchical keys with dot notation
- Start with the functional area (e.g., `game`, `user`, `achievements`)
- Add the context or component (e.g., `game.difficulty`, `achievements.badge`)
- End with the specific text function (e.g., `game.difficulty.easy`, `achievements.badge.new`)
- Avoid generic names like `title`, `text`, or `message` without context

## Handling Variables

For texts with variables:

```typescript
// In the translation file
{
  "game.score.result": "You have achieved {points} out of {total} points"
}

// In the code
t("game.score.result", { points: score, total: maxScore })
```

## Language Support Verification

The following languages should always be fully translated:

- German (de)
- English (en)
- Spanish (es)
- French (fr)
- Italian (it)
- Portuguese (pt)
- Danish (da)
- Dutch (nl)
- Swedish (sv)
- Finnish (fi)

## Translation Guidelines

- **Consistency**: Use uniform terms for the same concepts
- **Context**: Consider the usage context in translation
- **Cultural Adaptation**: Consider cultural differences, not just linguistic ones
- **Length**: Note that translations can vary in length across different languages
- **Formality**: Pay attention to the correct level of formality (informal/formal address) depending on the target audience

## Automatic Resolution of Translation Issues

The Translation Validator should automatically identify and resolve the following issues:

- **Missing Keys**: All keys must be present in all language files
- **Untranslated Texts**: Values must not remain in the source language
- **Inconsistent Formatting**: Formatting (e.g., capitalization) must be consistent across all languages
- **Missing Placeholders**: All variables must be present in all translations
- **Context Inconsistency**: A key must not be used for different contexts

When identifying these issues, they should be immediately corrected without requiring separate troubleshooting.

## Validating Translation Key Usage

The Translation Validator should systematically verify all translation keys used in the codebase:

### 1. Finding Translation Function Calls

- Scan all code files for translation function calls such as `t()`, `useTranslations()`, or any other translation utilities
- Extract the translation keys from these function calls
- Also identify dynamic key construction patterns (e.g., `t(\`game.${difficulty}.title\`)`)

### 2. Validating Key Existence

For each identified translation key, verify its existence in all supported language files:

- `/src/i18n/locales/de.ts`
- `/src/i18n/locales/en.ts`
- `/src/i18n/locales/es.ts`
- `/src/i18n/locales/fr.ts`
- `/src/i18n/locales/it.ts`
- `/src/i18n/locales/pt.ts`
- `/src/i18n/locales/da.ts`
- `/src/i18n/locales/nl.ts`
- `/src/i18n/locales/sv.ts`
- `/src/i18n/locales/fi.ts`

### 3. Key Validation Process

1. For each found translation key:

   - Check if the key exists in all language files
   - Verify that the translation value is not empty
   - Ensure the translation is not in the wrong language (e.g., English text in German file)
   - Confirm all variable placeholders are consistent across all translations

2. For dynamically constructed keys:
   - Generate all possible key combinations based on the code context
   - Validate each potential key against all language files
   - Flag any potential runtime issues with dynamic key construction

### 4. Automatic Fix Actions

When validation issues are found:

- Add missing keys to all language files
- Flag untranslated values for human review
- Suggest corrections for inconsistent variable placeholders
- Document all identified issues and resolutions

## Identifying and Migrating Local Translation Objects

The Translation Validator should identify local translation objects in components and migrate them to the global translation system:

### 1. Identifying Local Translation Patterns

Look for code patterns such as:

```javascript
const translations = {
  en: { key: "English text" },
  de: { key: "German text" },
};
```

Or alternative forms:

```javascript
const messages = {
  greeting: {
    en: "Welcome to MelodyMind",
    de: "Willkommen bei MelodyMind",
  },
};
```

### 2. Migration Process

When local translation objects are found:

1. Generate appropriate global translation keys using the naming conventions
2. Add all translations to the global language files (`src/i18n/locales/*.ts`)
3. Replace local usage with the global translation function
4. Ensure all supported languages have the translations (not just those in the local object)

### 3. Example Migration

**Before (with local translations):**

```javascript
// In AchievementBadge.astro
const translations = {
  en: {
    achievement_unlocked:
      "New achievement unlocked! You now have {count} new achievements.",
  },
  de: {
    achievement_unlocked:
      "Neue Errungenschaft freigeschaltet! Du hast jetzt {count} neue Errungenschaften.",
  },
};

return (
  <div class="badge">
    {lang === "en"
      ? translations.en.achievement_unlocked.replace("{count}", count)
      : translations.de.achievement_unlocked.replace("{count}", count)}
  </div>
);
```

**After (with global translations):**

```javascript
// In AchievementBadge.astro
import { t } from "../i18n";

return (
  <div class="badge">{t("achievements.notification.unlocked", { count })}</div>
);
```

**Added to global translation files:**

```typescript
// src/i18n/locales/en.ts
{
  // ...existing translations
  "achievements.notification.unlocked": "New achievement unlocked! You now have {count} new achievements."
}

// src/i18n/locales/de.ts and all other language files
{
  // ...existing translations
  "achievements.notification.unlocked": "Neue Errungenschaft freigeschaltet! Du hast jetzt {count} neue Errungenschaften."
}
```

## Example of a Complete Scan

The Translation Key Finder scans the code and identifies:

```javascript
// In AchievementBadge.astro
const translations = {
  en: {
    achievement_unlocked:
      "New achievement unlocked! You now have {count} new achievements.",
    achievements_viewed: "Achievement notifications cleared.",
  },
  de: {
    achievement_unlocked:
      "Neue Errungenschaft freigeschaltet! Du hast jetzt {count} neue Errungenschaften.",
    achievements_viewed: "Errungenschaftsbenachrichtigungen gelöscht.",
  },
};
```

The validator would then:

1. Identify these hardcoded texts
2. Suggest appropriate translation keys (`achievements.notification.unlocked` and `achievements.notification.cleared`)
3. Check the keys in all language files
4. Add missing translations for all languages
5. Suggest code changes to replace hardcoded texts with translation functions
