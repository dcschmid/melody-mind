# MelodyMind Reusable Prompts

This directory contains reusable prompt files for common tasks in the MelodyMind project. These prompts provide standardized instructions for generating code and performing other routine tasks with GitHub Copilot.

## Available Prompts

### Component Development

- `component-astro.prompt.md`: Generate an Astro component using project standards
- `component-react.prompt.md`: Generate a React component with Tailwind styling for interactive elements

### Game Features

- `game-feature.prompt.md`: Create game logic for a specific feature
- `question-generation.prompt.md`: Generate trivia questions for different genres and difficulty levels

### Testing & Quality

- `test-component.prompt.md`: Generate comprehensive tests for a component
- `accessibility-check.prompt.md`: Perform an accessibility review on a component
- `performance-optimization.prompt.md`: Analyze and improve code performance

### Internationalization

- `i18n-translation.prompt.md`: Generate or update translations for multiple languages

## How to Use

1. In Copilot Chat, click the "Attach Context" icon or press Ctrl+/
2. Select "Prompt..."
3. Choose the appropriate prompt file
4. Provide any additional context in your message

## Examples

### Generating a New Component

```
@workspace /component-astro
Create a ScoreDisplay component that shows current score,
streak, and remaining questions. It should update in real-time
and include animations for score increases.
```

### Creating Trivia Questions

```
@workspace /question-generation
Generate 5 hard difficulty questions about classical music,
focusing on composers and symphonies from the Romantic era.
```

### Performing an Accessibility Review

```
@workspace /accessibility-check
Review the QuestionCard component in src/components/QuestionCard.astro
for WCAG AAA compliance and recommend improvements.
```
