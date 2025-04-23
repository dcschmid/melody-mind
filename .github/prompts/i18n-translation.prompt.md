# Generate i18n Translations

Your goal is to generate or update translations for the MelodyMind music trivia game.

## Translation Requirements

If not specified, ask for:

- The source language content to translate
- The target language(s) needed
- Any specific terminology that should be maintained
- Context about where the text will appear in the UI

## Technical Approach

- Follow the existing i18n structure in src/i18n/ui.ts
- Maintain consistent key naming conventions
- Use natural, conversational language appropriate for a gaming audience
- Preserve formatting placeholders (like {0}, {count}, etc.)
- Consider cultural nuances for the target language
- Ensure translations fit within UI constraints

## Example Implementation

For translating game difficulty levels:

```typescript
// English (source)
{
  "game.difficulty.easy": "Easy",
  "game.difficulty.easy.description": "10 questions, perfect for beginners",
  "game.difficulty.medium": "Medium",
  "game.difficulty.medium.description": "15 questions for those who know their music",
  "game.difficulty.hard": "Hard",
  "game.difficulty.hard.description": "20 questions for true music experts"
}

// German (target)
{
  "game.difficulty.easy": "Leicht",
  "game.difficulty.easy.description": "10 Fragen, perfekt für Anfänger",
  "game.difficulty.medium": "Mittel",
  "game.difficulty.medium.description": "15 Fragen für diejenigen, die ihre Musik kennen",
  "game.difficulty.hard": "Schwer",
  "game.difficulty.hard.description": "20 Fragen für echte Musikexperten"
}

// French (target)
{
  "game.difficulty.easy": "Facile",
  "game.difficulty.easy.description": "10 questions, parfait pour les débutants",
  "game.difficulty.medium": "Moyen",
  "game.difficulty.medium.description": "15 questions pour ceux qui connaissent leur musique",
  "game.difficulty.hard": "Difficile",
  "game.difficulty.hard.description": "20 questions pour les vrais experts en musique"
}
```

## Linguistic Considerations

- Keep tone consistent with the game's casual, engaging style
- Use appropriate musical terminology for the target culture
- Consider readability and scan-ability for quick reading during gameplay
- Maintain the excitement and fun of the original text
- Ensure accessibility in all languages
