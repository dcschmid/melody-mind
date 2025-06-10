# MusicButtons Translation Keys Documentation

## Overview

This document provides comprehensive documentation for all translation keys used by the MusicButtons
component. These keys must be present in all supported language files for proper
internationalization.

## Required Translation Keys

### Namespace: `musicPlatforms`

All MusicButtons translation keys are organized under the `musicPlatforms` namespace to avoid
conflicts with other components.

### Key Definitions

#### `musicPlatforms.heading`

**Purpose**: Screen reader heading for the music platforms button group  
**Type**: Simple string  
**Context**: Used as an accessible heading for the group of platform buttons  
**Visibility**: Hidden visually, announced by screen readers

**English Template**: `"Music Platforms"`

**Translation Guidelines**:

- Keep it concise and descriptive
- Should clearly indicate this is a group of music service options
- No special formatting or punctuation needed

**Language Implementations**:

```json
{
  "en": "Music Platforms",
  "de": "Musik-Plattformen",
  "es": "Plataformas de Música",
  "fr": "Plateformes Musicales",
  "it": "Piattaforme Musicali",
  "pt": "Plataformas de Música"
}
```

#### `musicPlatforms.listenOn`

**Purpose**: Aria label template for individual platform buttons  
**Type**: Template string with interpolation  
**Context**: Provides accessible description for each platform button  
**Visibility**: Hidden visually, announced by screen readers

**Template Variables**:

- `{title}` - The playlist/collection title (string)
- `{platform}` - The platform name (Spotify/Deezer/Apple)

**English Template**: `"Listen to {title} on {platform}"`

**Translation Guidelines**:

- Maintain the template variable placeholders exactly as shown
- Use natural language structure for the target language
- Consider verb conjugation and grammar rules
- Platform names should remain in English (Spotify, Deezer, Apple)

**Language Implementations**:

```json
{
  "en": "Listen to {title} on {platform}",
  "de": "Höre {title} auf {platform}",
  "es": "Escucha {title} en {platform}",
  "fr": "Écouter {title} sur {platform}",
  "it": "Ascolta {title} su {platform}",
  "pt": "Ouça {title} no {platform}"
}
```

**Usage Examples**:

```
English: "Listen to Rock Hits on Spotify"
German: "Höre Rock Hits auf Spotify"
Spanish: "Escucha Rock Hits en Spotify"
French: "Écouter Rock Hits sur Spotify"
```

#### `musicPlatforms.keyboardInstructions`

**Purpose**: Provides keyboard navigation instructions for screen reader users  
**Type**: Descriptive string  
**Context**: Explains how to navigate and activate platform buttons  
**Visibility**: Hidden visually, announced by screen readers with aria-live

**English Template**:
`"Use arrow keys to navigate between music platform buttons. Press Enter or Space to open playlist in new tab."`

**Translation Guidelines**:

- Explain keyboard navigation clearly
- Mention that links open in new tabs
- Use terminology appropriate for the target language
- Keep instructions concise but complete

**Language Implementations**:

```json
{
  "en": "Use arrow keys to navigate between music platform buttons. Press Enter or Space to open playlist in new tab.",
  "de": "Verwenden Sie die Pfeiltasten, um zwischen den Musik-Plattform-Schaltflächen zu navigieren. Drücken Sie die Eingabetaste oder die Leertaste, um die Wiedergabeliste in einem neuen Tab zu öffnen.",
  "es": "Use las teclas de flecha para navegar entre los botones de plataforma musical. Presione Enter o Espacio para abrir la lista de reproducción en una nueva pestaña.",
  "fr": "Utilisez les touches fléchées pour naviguer entre les boutons de plateforme musicale. Appuyez sur Entrée ou Espace pour ouvrir la playlist dans un nouvel onglet.",
  "it": "Usa i tasti freccia per navigare tra i pulsanti della piattaforma musicale. Premi Invio o Spazio per aprire la playlist in una nuova scheda.",
  "pt": "Use as teclas de seta para navegar entre os botões da plataforma musical. Pressione Enter ou Espaço para abrir a playlist em uma nova aba."
}
```

#### `musicPlatforms.externalNotice`

**Purpose**: Informs users that platform links open externally  
**Type**: Notice/warning string  
**Context**: Accessibility notice for external link behavior  
**Visibility**: Hidden visually, announced by screen readers via aria-describedby

**English Template**: `"External links will open in a new tab"`

**Translation Guidelines**:

- Clearly state that links are external
- Mention new tab/window behavior
- Use standard terminology for external links in the target language
- Keep it brief and informative

**Language Implementations**:

```json
{
  "en": "External links will open in a new tab",
  "de": "Externe Links öffnen sich in einem neuen Tab",
  "es": "Los enlaces externos se abrirán en una nueva pestaña",
  "fr": "Les liens externes s'ouvriront dans un nouvel onglet",
  "it": "I link esterni si apriranno in una nuova scheda",
  "pt": "Links externos abrirão em uma nova aba"
}
```

## Implementation Guidelines

### File Structure

Translation keys should be organized in language-specific JSON files:

```
src/
  i18n/
    en/
      musicPlatforms.json
    de/
      musicPlatforms.json
    es/
      musicPlatforms.json
    fr/
      musicPlatforms.json
    it/
      musicPlatforms.json
    pt/
      musicPlatforms.json
```

### File Format

Each language file should contain all required keys:

```json
{
  "heading": "Music Platforms",
  "listenOn": "Listen to {title} on {platform}",
  "keyboardInstructions": "Use arrow keys to navigate between music platform buttons. Press Enter or Space to open playlist in new tab.",
  "externalNotice": "External links will open in a new tab"
}
```

### Usage in Component

The component accesses translations through the i18n utility:

```typescript
// Get current language and translations
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(String(lang));

// Usage examples
const heading = t("musicPlatforms.heading");
const ariaLabel = t("musicPlatforms.listenOn", { title, platform: label });
const instructions = t("musicPlatforms.keyboardInstructions");
const notice = t("musicPlatforms.externalNotice");
```

## Quality Assurance

### Translation Validation

Before releasing translations, validate:

1. **Template Variables**: Ensure `{title}` and `{platform}` placeholders are preserved
2. **Grammar**: Check verb conjugations and sentence structure
3. **Length**: Ensure translations fit within UI constraints
4. **Context**: Verify translations make sense in the music/playlist context
5. **Accessibility**: Confirm screen reader pronunciation is natural

### Testing Checklist

For each language:

- [ ] All four translation keys are present
- [ ] Template variables are correctly preserved
- [ ] Grammar and spelling are correct
- [ ] Translations are contextually appropriate
- [ ] Screen reader testing confirms natural pronunciation
- [ ] No special characters cause encoding issues

### Validation Script

```javascript
// validate-musicbuttons-translations.js
const fs = require("fs");
const path = require("path");

const requiredKeys = ["heading", "listenOn", "keyboardInstructions", "externalNotice"];

const languages = ["en", "de", "es", "fr", "it", "pt"];

function validateTranslations() {
  languages.forEach((lang) => {
    const filePath = path.join("src/i18n", lang, "musicPlatforms.json");

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing translation file: ${filePath}`);
      return;
    }

    const translations = JSON.parse(fs.readFileSync(filePath, "utf8"));

    requiredKeys.forEach((key) => {
      if (!translations[key]) {
        console.error(`❌ Missing key "${key}" in ${lang}`);
      } else {
        console.log(`✅ Key "${key}" found in ${lang}`);
      }
    });

    // Validate template variables in listenOn
    if (translations.listenOn) {
      if (
        !translations.listenOn.includes("{title}") ||
        !translations.listenOn.includes("{platform}")
      ) {
        console.error(`❌ Missing template variables in ${lang} listenOn`);
      }
    }
  });
}

validateTranslations();
```

## Translation Guidelines by Language

### German (de)

- Use formal pronouns (Sie) for instructions
- Compound words are common: "Musik-Plattformen"
- Verb placement follows German grammar rules

### Spanish (es)

- Use formal/neutral tone appropriate for international audience
- Consider Latin American vs. Iberian Spanish terminology
- Gender agreement may affect certain translations

### French (fr)

- Use standard French terminology
- Consider Canadian French variants if applicable
- Maintain formal tone for accessibility instructions

### Italian (it)

- Use standard Italian terminology
- Consider regional variations minimally
- Maintain clear, professional tone

### Portuguese (pt)

- Use Brazilian Portuguese as primary variant
- Consider European Portuguese if needed
- Use gender-neutral language where possible

## Accessibility Considerations

### Screen Reader Compatibility

Translations should consider:

1. **Natural Flow**: Text should read naturally when announced by screen readers
2. **Pronunciation**: Avoid abbreviations that may be mispronounced
3. **Clarity**: Ensure meaning is clear when heard, not just read
4. **Context**: Provide sufficient context for non-visual users

### Cultural Sensitivity

Consider cultural aspects:

1. **Music Terminology**: Use locally appropriate music-related terms
2. **Technology Terms**: Adapt technology vocabulary to local usage
3. **Accessibility Language**: Use respectful, person-first language
4. **Platform Recognition**: Ensure platform names are recognizable

## Maintenance and Updates

### Version Control

Track translation changes:

```markdown
# Translation Change Log

## Version 3.0.0

- Added comprehensive keyboard instructions
- Enhanced aria-label templates
- Improved external link notices

## Version 2.5.0

- Added Apple Music platform support
- Updated heading terminology

## Version 2.0.0

- Added Deezer platform support
- Restructured translation namespace
```

### Regular Review

Schedule regular translation reviews:

1. **Quarterly**: Review for accuracy and relevance
2. **With New Features**: Update when component functionality changes
3. **Community Feedback**: Incorporate user suggestions
4. **Platform Changes**: Update when music platforms change branding

This comprehensive translation documentation ensures the MusicButtons component provides a
consistent, accessible experience across all supported languages while maintaining cultural
appropriateness and accessibility standards.
