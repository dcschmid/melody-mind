# Joker Component Documentation

## Overview

The Joker component provides a 50:50 elimination feature for the MelodyMind trivia game. It allows
players to eliminate two incorrect answer options, making it easier to select the correct answer.
The component follows WCAG AAA accessibility standards and implements performance optimizations for
a smooth user experience.

## Features

- **50:50 Elimination**: Removes two wrong answers from multiple-choice questions
- **Usage Limits**: Configurable number of uses based on difficulty level
- **Visual Feedback**: Clear indication of remaining uses and disabled state
- **Accessibility**: Full WCAG AAA compliance with screen reader support
- **Performance**: GPU-accelerated animations with reduced motion support
- **Responsive Design**: Optimized for desktop and mobile devices

## Props

| Prop       | Type       | Default | Description                          |
| ---------- | ---------- | ------- | ------------------------------------ |
| `usesLeft` | `number`   | `3`     | Number of joker uses remaining       |
| `disabled` | `boolean`  | `false` | Whether the joker is disabled        |
| `onUse`    | `function` | -       | Callback function when joker is used |

## Usage

```astro
---
import Joker from "../components/Game/Joker.astro";
---

<Joker usesLeft={3} disabled={false} onUse={() => console.log("Joker used!")} />
```

## Accessibility Features

### WCAG AAA Compliance

- **Minimum Touch Target Size**: 44px minimum for all interactive elements
- **Color Contrast**: 7:1 ratio for normal text, 4.5:1 for large text
- **Focus Indicators**: Clear visual focus indicators with 3px outline
- **Screen Reader Support**: Comprehensive ARIA attributes and labels
- **Keyboard Navigation**: Full keyboard accessibility

### ARIA Attributes

- `aria-label`: Descriptive label for the joker button
- `aria-describedby`: Links to helper text explaining the feature
- `aria-disabled`: Indicates when the joker is unavailable
- `aria-live`: Announces changes in remaining uses

### Screen Reader Support

```html
<div class="sr-only" aria-live="polite" id="joker-announcements">
  <!-- Screen reader announcements -->
</div>
```

## Performance Optimizations

### CSS Optimizations

- **GPU Acceleration**: Uses `will-change` property for smooth animations
- **Hardware Acceleration**: Transform and opacity animations
- **Reduced Motion**: Respects `prefers-reduced-motion` user preference
- **Efficient Selectors**: Optimized CSS selectors for better performance

### Animation Performance

```css
.joker-button {
  will-change: transform, background-color;
  transition: var(--transition-normal);
}

@media (prefers-reduced-motion: reduce) {
  .joker-button,
  .joker-ripple,
  .joker-count {
    transition-duration: var(--transition-instant) !important;
    animation-duration: var(--animation-instant) !important;
  }
}
```

## Styling System

### CSS Variables Used

The component extensively uses CSS variables from `global.css` for consistency:

#### Layout & Spacing

- `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`
- `--min-touch-size`
- `--radius-lg`, `--radius-xl`, `--radius-full`

#### Typography

- `--text-base`, `--text-lg`, `--text-sm`
- `--font-medium`, `--font-semibold`
- `--leading-normal`, `--leading-relaxed`

#### Colors

- `--interactive-primary`, `--interactive-primary-hover`
- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`
- `--border-primary`

#### Effects & Animations

- `--shadow-lg`, `--shadow-hover`
- `--transition-normal`, `--transition-instant`
- `--opacity-disabled`, `--opacity-medium`, `--opacity-high`
- `--scale-default`, `--scale-focus`, `--scale-pressed`

### Component Structure

```astro
<div class="joker-container">
  <button class="joker-button" aria-label="Use 50:50 Joker">
    <div class="joker-button-content">
      <Icon name="fifty-fifty" class="joker-icon" />
      <span class="joker-text">50:50</span>
    </div>
    <div class="joker-button-effect"></div>
    <div class="joker-ripple"></div>
  </button>

  <div class="joker-count-container">
    <div class="joker-count">3</div>
    <span class="joker-count-label">uses left</span>
  </div>

  <p class="joker-description">Eliminates two wrong answers</p>
</div>
```

## Game Integration

### Usage in Game Logic

```typescript
// Game controller integration
const jokerManager = new JokerManager({
  maxUses: difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 10,
});

// Handle joker activation
function handleJokerUse() {
  if (jokerManager.canUse()) {
    const eliminatedOptions = jokerManager.use(currentQuestion);
    updateQuestionDisplay(eliminatedOptions);
  }
}
```

### State Management

The component manages its state through the `JokerManager` utility:

- **Uses Tracking**: Monitors remaining uses
- **Cooldown Management**: Prevents rapid successive uses
- **Question Integration**: Eliminates incorrect options
- **Visual Updates**: Updates UI to reflect current state

## Browser Support

- **Modern Browsers**: Full support for Chrome, Firefox, Safari, Edge
- **Progressive Enhancement**: Graceful degradation for older browsers
- **CSS Grid/Flexbox**: Modern layout techniques with fallbacks
- **Animation API**: Uses Web Animations API with CSS fallbacks

## Testing

### Manual Testing Checklist

- [ ] Click joker button to eliminate two wrong answers
- [ ] Verify uses counter decrements correctly
- [ ] Test disabled state when no uses remaining
- [ ] Confirm keyboard navigation works properly
- [ ] Validate screen reader announcements
- [ ] Test with reduced motion preference enabled
- [ ] Verify high contrast mode compatibility

### Accessibility Testing

- [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation
- [ ] High contrast mode verification
- [ ] Color contrast ratio validation (WebAIM)
- [ ] Focus indicator visibility testing

## Related Components

- **QuestionCard**: Displays questions and integrates with joker elimination
- **GameController**: Manages overall game state and joker interactions
- **Timer**: May pause during joker activation for better UX

## Implementation Notes

### Performance Considerations

1. **Animation Timing**: Animations are optimized for 60fps performance
2. **Memory Management**: Event listeners are properly cleaned up
3. **DOM Queries**: Cached selectors to reduce repeated DOM access
4. **CSS Containment**: Uses `contain` property where appropriate

### Accessibility Considerations

1. **Focus Management**: Proper focus handling during state changes
2. **Announcements**: Live regions for dynamic content updates
3. **Contrast**: All colors meet WCAG AAA contrast requirements
4. **Touch Targets**: Minimum 44px touch targets on mobile devices

### Browser Compatibility

- **CSS Custom Properties**: Supported in all modern browsers
- **CSS Grid**: Graceful fallback to Flexbox where needed
- **Animation API**: Progressive enhancement with CSS fallbacks
- **Touch Events**: Proper handling for touch and mouse interactions

## Code Examples

### Basic Implementation

```astro
---
import Joker from "../components/Game/Joker.astro";
import { jokerManager } from "../utils/game/jokerManager";

const usesLeft = jokerManager.getUsesLeft();
const isDisabled = !jokerManager.canUse();
---

<Joker usesLeft={usesLeft} disabled={isDisabled} onUse={jokerManager.use.bind(jokerManager)} />
```

### Advanced Usage with Game State

```astro
---
import Joker from "../components/Game/Joker.astro";
import { gameState } from "../utils/game/gameState";

const { jokers, currentQuestion } = gameState;
---

<Joker
  usesLeft={jokers.fiftyFifty.remaining}
  disabled={!jokers.fiftyFifty.canUse || !currentQuestion}
  onUse={() => gameState.useJoker("fiftyFifty")}
/>
```

## Maintenance

### Regular Updates

- Monitor performance metrics for animation smoothness
- Update accessibility features as WCAG standards evolve
- Test with new browser versions and assistive technologies
- Review and optimize CSS variables usage

### Known Issues

- None currently identified

### Future Enhancements

- Additional joker types (audience poll, expert advice)
- Animation customization options
- Enhanced visual feedback
- Integration with game analytics
