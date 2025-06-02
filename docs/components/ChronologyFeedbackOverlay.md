# ChronologyFeedbackOverlay Component

## Overview

The `ChronologyFeedbackOverlay` is a fully optimized, WCAG AAA compliant modal component designed
specifically for the Chronology game mode in MelodyMind. It displays feedback after each round,
showing whether the user's answer was correct or incorrect, along with the correct order when
applicable.

## Features

### Accessibility (WCAG AAA Compliant)

- **Focus Management**: Proper focus trap and restoration
- **Screen Reader Support**: Live regions and ARIA attributes
- **Keyboard Navigation**: Full keyboard support with Escape key to close
- **High Contrast**: AAA-level color contrast ratios (7:1 for normal text)
- **Reduced Motion**: Respects user's motion preferences
- **Semantic HTML**: Proper heading hierarchy and landmark roles

### Performance Optimizations

- **GPU-Accelerated Animations**: Uses transform and opacity for smooth animations
- **RequestAnimationFrame**: Optimized animation timing
- **Memory Leak Prevention**: Proper cleanup of event listeners and timeouts
- **Efficient DOM Updates**: Minimal DOM manipulation with batch updates

### Internationalization

- **Multi-language Support**: Uses i18n translation keys
- **Fallback Translations**: Graceful degradation for missing translations
- **Client-side Translation**: Optimized translation function for performance

## Usage

### Basic Implementation

The component is automatically initialized when the DOM is ready. To trigger the feedback overlay,
dispatch a custom event:

```typescript
// Show feedback overlay
window.dispatchEvent(
  new CustomEvent("showChronologyFeedback", {
    detail: {
      isCorrect: true,
      isLastRound: false,
      correctOrder: ["Song 1", "Song 2", "Song 3"],
    },
  })
);
```

### Event Listeners

The component listens for the following events:

- `showChronologyFeedback`: Shows the overlay with feedback
- `chronologyContinue`: Dispatched when user clicks continue
- `chronologyEnd`: Dispatched when user clicks end game

### CSS Variables Used

The component uses the project's CSS custom properties for consistent theming:

- `--z-modal`: Z-index for modal layering
- `--space-*`: Spacing scale (xs, sm, md, lg, xl, 2xl, 3xl)
- `--color-*`: Color palette for theming
- `--radius-*`: Border radius scale
- `--text-*`: Typography scale
- `--font-*`: Font weights
- `--btn-*`: Button styles
- `--focus-*`: Focus indicator styles
- `--transition-*`: Animation timing
- `--breakpoint-*`: Responsive breakpoints

## API Reference

### Event Detail Interface

```typescript
interface FeedbackEventDetail {
  isCorrect: boolean; // Whether the answer was correct
  isLastRound: boolean; // Whether this is the final round
  correctOrder?: string[]; // Array of correct order (optional)
}
```

### Translation Keys

The component uses the following translation keys:

- `game.chronology.correct`: "Correct!" message
- `game.chronology.incorrect`: "Incorrect!" message
- `game.chronology.correct_order`: "Correct order:" heading
- `general.close`: Close button label
- `game.next.round`: Continue button text
- `game.end.title`: End game button text

## Accessibility Features

### Focus Management

- **Focus Trap**: Keeps keyboard focus within the modal
- **Focus Restoration**: Returns focus to the element that opened the modal
- **Skip Links**: Logical tab order through interactive elements

### Screen Reader Support

- **Live Regions**: Announces feedback messages to screen readers
- **ARIA Labels**: Comprehensive labeling for all interactive elements
- **Role Attributes**: Proper semantic roles for modal dialog

### Keyboard Navigation

- **Tab Navigation**: Full keyboard access to all controls
- **Escape Key**: Closes the modal
- **Enter/Space**: Activates buttons

### Visual Accessibility

- **High Contrast**: WCAG AAA compliant color ratios
- **Focus Indicators**: Clear visual focus indicators
- **Reduced Motion**: Respects prefers-reduced-motion setting
- **Large Touch Targets**: Minimum 44px touch targets

## Performance Considerations

### Animation Optimization

- Uses `transform` and `opacity` for GPU acceleration
- Leverages `requestAnimationFrame` for smooth animations
- Provides immediate fallback for reduced-motion users

### Memory Management

- Automatic cleanup of event listeners on page unload
- Proper timeout and animation frame cleanup
- No memory leaks in long-running sessions

### Bundle Size

- Minimal JavaScript footprint
- Efficient event handling
- Optimized CSS with custom properties

## Customization

### Styling

The component can be customized by modifying CSS custom properties in your global styles:

```css
:root {
  --color-success-400: #10b981; /* Correct answer color */
  --color-error-400: #ef4444; /* Incorrect answer color */
  --bg-secondary: #1f2937; /* Modal background */
}
```

### Behavior

Event handlers can be customized by listening for the dispatched events:

```typescript
window.addEventListener("chronologyContinue", () => {
  // Custom continue logic
});

window.addEventListener("chronologyEnd", () => {
  // Custom end game logic
});
```

## Browser Support

- **Modern Browsers**: Full support for Chrome 91+, Firefox 90+, Safari 14.1+
- **Legacy Support**: Graceful degradation for older browsers
- **Mobile**: Optimized for touch interfaces
- **Assistive Technology**: Full compatibility with screen readers

## Testing

### Manual Testing Checklist

- [ ] Modal opens with correct content
- [ ] Focus is trapped within modal
- [ ] Escape key closes modal
- [ ] Screen reader announces feedback
- [ ] Animations respect reduced motion
- [ ] Keyboard navigation works properly
- [ ] Touch targets are adequate size

### Automated Testing

The component includes comprehensive accessibility testing and should pass:

- WCAG AAA compliance tests
- Keyboard navigation tests
- Screen reader compatibility tests
- Color contrast validation
- Performance benchmarks

## Maintenance

### Regular Updates

- Monitor for new accessibility standards
- Update translation keys as needed
- Performance optimization reviews
- Browser compatibility testing

### Dependencies

- Astro framework components
- Project i18n utilities
- CSS custom properties system
- Icon component system

## Related Components

- `FeedbackOverlay.astro`: Base feedback overlay for other game modes
- Game components that trigger this overlay
- Translation utility functions
- Global CSS variables and theming system
