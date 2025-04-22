# CSS Rules for MelodyMind

## Styling Approach

- Use a mobile-first responsive design approach
- Implement CSS custom properties for theme colors and values
- Use semantic class names
- Follow BEM naming convention where appropriate
- Implement dark mode with prefers-color-scheme
- Ensure sufficient color contrast for accessibility

## Design System

### Colors

- Primary: Purple (#8c52ff) - Used for primary actions and key UI elements
- Secondary: Pink (#ff52b4) - Used for highlights and accents
- Background: Dark (#18181b) - Main background color
- Text: White (#ffffff) - Main text color
- Accent: Gold (#ffd700) - Used for achievements and special elements

### Typography

- Headings: 'Montserrat', sans-serif
- Body: 'Open Sans', sans-serif
- Game elements: 'Press Start 2P', cursive (for retro game feeling)

### Spacing

- Base unit: 0.25rem (4px)
- Use multiples of the base unit for consistent spacing

## Animation Guidelines

- Use subtle animations for transitions
- Keep animations under 300ms for UI responsiveness
- Implement reduced motion option for accessibility
- Use keyframe animations for more complex animations

## Example CSS Pattern

```css
.game-card {
  background-color: var(--card-bg);
  border-radius: 0.5rem;
  padding: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.game-card__title {
  font-family: "Montserrat", sans-serif;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .game-card {
    padding: 0.75rem;
  }
}
```

## Accessibility Considerations

- Ensure text has sufficient contrast (minimum 4.5:1 for normal text)
- Use appropriate focus styles for interactive elements
- Implement responsive designs that work at various zoom levels
- Support keyboard navigation
