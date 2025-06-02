# LoadingSpinner Component

## Overview

The `LoadingSpinner` component is a comprehensive, accessibility-first loading indicator designed
for the MelodyMind trivia game. It provides both indeterminate and determinate progress feedback
with full WCAG AAA compliance, enhanced screen reader support, and performance-optimized animations.

![LoadingSpinner Component Example](../../public/docs/loading-spinner.png)

## Features

- **Dual Loading Types**: Supports both indeterminate (spinning) and determinate (progress bar)
  loading indicators
- **WCAG AAA Compliance**: 7:1 contrast ratios, keyboard navigation, and comprehensive screen reader
  support
- **Error State Management**: Built-in error and timeout states with appropriate visual and auditory
  feedback
- **Performance Optimized**: GPU-accelerated animations with CSS containment and hardware
  acceleration
- **Responsive Design**: Mobile-first approach with touch-friendly minimum sizes
- **Motion Accessibility**: Respects `prefers-reduced-motion` and provides alternative visual
  feedback
- **Contextual Announcements**: Enhanced screen reader experience with context-specific messages
- **Singleton Pattern**: Efficient instance management to prevent memory leaks

## Properties

| Property           | Type                               | Required | Description                                             | Default                           |
| ------------------ | ---------------------------------- | -------- | ------------------------------------------------------- | --------------------------------- |
| `size`             | `'small' \| 'medium' \| 'large'`   | No       | Size variant for the spinner                            | `'large'`                         |
| `label`            | `string`                           | No       | Text label displayed next to the spinner                | `t("loading.content")`            |
| `id`               | `string`                           | No       | Unique identifier for this spinner instance             | `'loading-spinner'`               |
| `loadingStartText` | `string`                           | No       | Text announced to screen readers when loading starts    | `t("loading.started")`            |
| `loadingEndText`   | `string`                           | No       | Text announced to screen readers when loading completes | `t("loading.completed")`          |
| `ariaLabel`        | `string`                           | No       | Enhanced ARIA label for the loading indicator           | `t("loading.progress.indicator")` |
| `type`             | `'indeterminate' \| 'determinate'` | No       | Progress type                                           | `'indeterminate'`                 |
| `progress`         | `number`                           | No       | Progress value (0-100) for determinate type             | `0`                               |
| `state`            | `'normal' \| 'error' \| 'timeout'` | No       | Loading state                                           | `'normal'`                        |
| `context`          | `string`                           | No       | Context for more descriptive announcements              | `''`                              |

## Usage

### Basic Implementation

```astro
---
import LoadingSpinner from "@components/Game/LoadingSpinner.astro";
---

<!-- Simple indeterminate spinner -->
<LoadingSpinner label="Loading questions..." size="medium" />
```

### Progress Bar Implementation

```astro
---
import LoadingSpinner from "@components/Game/LoadingSpinner.astro";
---

<!-- Determinate progress bar -->
<LoadingSpinner type="determinate" progress={75} label="Processing results" size="large" />
```

### Contextual Loading

```astro
---
import LoadingSpinner from "@components/Game/LoadingSpinner.astro";
---

<!-- Context-aware spinner with enhanced announcements -->
<LoadingSpinner context="gameLoading" label="Loading game content" id="game-loader" />
```

### Error State Implementation

```astro
---
import LoadingSpinner from "@components/Game/LoadingSpinner.astro";
---

<!-- Spinner with error state -->
<LoadingSpinner state="error" label="Failed to load" size="medium" />
```

## JavaScript API

The component includes a comprehensive JavaScript class for dynamic interaction:

### Basic Methods

```typescript
// Get spinner instance (singleton pattern)
const spinner = LoadingSpinner.getInstance("my-spinner");

// Show/hide spinner
spinner.show();
spinner.hide();
spinner.toggle();

// Check visibility
const isVisible = spinner.isVisible();

// Show for specific duration
await spinner.showFor(3000); // Show for 3 seconds
```

### Enhanced Methods

```typescript
// Show with focus for screen readers
spinner.showWithFocus(true);

// Update progress for determinate spinners
spinner.updateProgress(75, "Processing step 3 of 4");

// Set error state
spinner.setErrorState("Connection failed. Please try again.");

// Set timeout state
spinner.setTimeoutState("Request timed out. Please check your connection.");

// Reset to normal state
spinner.resetState();

// Set contextual announcements
spinner.setContextualAnnouncement("gameLoading", "Loading game data...");
```

### State Management

```typescript
// Get current state
const currentState = spinner.getState(); // 'normal' | 'error' | 'timeout'

// Check state
if (spinner.getState() === "error") {
  // Handle error state
}
```

## Size Variants

The component supports three size variants using CSS custom properties:

- **Small**: 36px × 36px - For inline loading indicators
- **Medium**: 48px × 48px - For form submissions and modal content
- **Large**: 64px × 64px - For page-level loading and major operations

## Context Types

Predefined context types for enhanced screen reader announcements:

| Context           | Announcement                        | Use Case             |
| ----------------- | ----------------------------------- | -------------------- |
| `gameLoading`     | "Loading game content, please wait" | Game initialization  |
| `questionLoading` | "Loading next question"             | Question transitions |
| `resultsLoading`  | "Calculating results"               | Score processing     |
| `default`         | "Loading content"                   | General loading      |

## Accessibility Features

### WCAG AAA Compliance

- **Color Contrast**: 7:1 contrast ratio for all text and visual elements
- **Focus Management**: Proper focus indicators and keyboard navigation support
- **Screen Reader Support**: Comprehensive ARIA attributes and live region announcements
- **Motion Preferences**: Respects `prefers-reduced-motion` with alternative visual feedback

### ARIA Attributes

```html
<!-- Indeterminate spinner -->
<div role="status" aria-live="polite" aria-busy="true" aria-label="Loading game content">
  <!-- Determinate progress bar -->
  <div
    role="progressbar"
    aria-valuenow="75"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Processing results - 75%"
  ></div>
</div>
```

### Screen Reader Announcements

- Loading start announcements with contextual information
- Progress updates for determinate loading
- Error and timeout state announcements
- Completion notifications

## Performance Optimizations

### CSS Optimizations

- **Hardware Acceleration**: Uses `transform3d` and `translateZ(0)` for GPU acceleration
- **CSS Containment**: `contain: layout style` for optimized rendering
- **Animation Performance**: Only animates `transform` properties for smooth 60fps animations
- **Content Visibility**: Uses `content-visibility: auto` for viewport-based optimization

### JavaScript Optimizations

- **Singleton Pattern**: Prevents memory leaks with instance management
- **Event Delegation**: Efficient event handling for multiple spinners
- **DOM Queries**: Cached element references for improved performance

## CSS Variables Used

The component uses the following CSS custom properties from `global.css`:

### Colors

```css
--interactive-primary          /* Primary spinner color */
--interactive-primary-hover    /* Progress bar gradient */
--text-secondary              /* Label text color */
--border-primary              /* Border colors */
--color-error-*               /* Error state colors */
--color-warning-*             /* Timeout state colors */
```

### Spacing and Layout

```css
--space-sm, --space-md, --space-lg    /* Spacing values */
--min-touch-size                      /* Minimum touch target size */
--radius-md, --radius-full            /* Border radius values */
```

### Typography

```css
--text-lg, --text-xl                  /* Font sizes */
--font-medium, --font-semibold        /* Font weights */
--leading-normal                      /* Line height */
```

### Transitions and Borders

```css
--transition-normal, --transition-slow  /* Animation durations */
--border-width-thin, --border-width-enhanced  /* Border widths */
```

## Error Handling

The component includes comprehensive error state management:

### Error State Features

- Visual error indicators with enhanced contrast
- Screen reader error announcements
- Role change to `alert` for immediate attention
- Custom error message support

### Timeout State Features

- Distinct timeout visual styling
- Timeout-specific announcements
- Automatic state management
- Recovery suggestions

## Browser Support

- **Modern Browsers**: Full feature support with optimized animations
- **Legacy Browsers**: Graceful degradation with fallback animations
- **High Contrast Mode**: Enhanced visibility with forced colors support
- **Reduced Motion**: Alternative visual feedback respecting user preferences

## Related Components

- [Timer](./Timer.md) - Countdown timer component
- [ProgressBar](./ProgressBar.md) - Standalone progress indicator
- [Modal](../Overlays/Modal.md) - Modal dialogs with loading states
- [QuestionCard](./QuestionCard.md) - Question display with loading states

## Testing

### Automated Testing

The component includes data test IDs for automated testing:

```html
<!-- Test selectors -->
data-testid="loading-spinner"
<!-- For indeterminate spinners -->
data-testid="loading-progress"
<!-- For determinate progress bars -->
```

### Manual Testing Checklist

- [ ] Spinner shows/hides correctly
- [ ] Progress updates work smoothly
- [ ] Error states display properly
- [ ] Screen reader announcements are clear
- [ ] Keyboard navigation functions
- [ ] High contrast mode works
- [ ] Reduced motion is respected
- [ ] Touch targets meet minimum size requirements

## Implementation Notes

### Performance Considerations

- Component uses CSS containment for optimized rendering
- Animations are limited to `transform` properties for best performance
- Instance management prevents memory leaks in single-page applications
- GPU acceleration is enabled for smooth animations on all devices

### Internationalization

The component fully supports the MelodyMind i18n system:

```typescript
// Translation keys used by this component
const i18nKeys = [
  "loading.content", // Default label text
  "loading.started", // Loading start announcement
  "loading.completed", // Loading completion announcement
  "loading.progress.indicator", // ARIA label
  "loading.context.game", // Game loading context
  "loading.context.question", // Question loading context
  "loading.context.results", // Results loading context
  "loading.context.default", // Default context
];
```

### Best Practices

1. **Always provide meaningful labels** for screen reader users
2. **Use appropriate size variants** based on UI context
3. **Set proper context** for enhanced announcements
4. **Handle error states** gracefully with clear messaging
5. **Test with screen readers** to ensure proper accessibility
6. **Use singleton pattern** to prevent multiple instances of the same spinner

## Changelog

- **v3.2.0** - Added contextual announcements and enhanced error handling
- **v3.1.0** - Implemented determinate progress bar support
- **v3.0.0** - Complete rewrite with WCAG AAA compliance and CSS variables
- **v2.5.0** - Added error and timeout state management
- **v2.0.0** - Redesigned with performance optimizations and modern CSS
- **v1.0.0** - Initial release with basic spinning animation
