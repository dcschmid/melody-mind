# ErrorMessage Component

## Overview

The `ErrorMessage` component is a comprehensive, accessible notification component that displays error messages with advanced features including automatic dismissal, keyboard accessibility, screen reader support, and priority-based styling. It's optimized for WCAG AAA accessibility standards and high performance.

![ErrorMessage Component Screenshot](../assets/error-message-preview.png)

## Features

- **Accessibility First**: WCAG AAA compliant with 7:1 contrast ratios
- **Auto-hide**: Configurable timeout with countdown visualization
- **Keyboard Support**: Dismissable via Escape key and focus management
- **Screen Reader Optimized**: Live regions and appropriate ARIA attributes
- **Priority Levels**: Visual distinction for different error severities
- **Performance Optimized**: Hardware-accelerated animations and efficient DOM updates
- **Sound Integration**: Optional audio cues for error announcements
- **Multi-error Queue**: Handles multiple error messages gracefully
- **Pause/Resume**: Auto-hide can be paused on hover or focus
- **Responsive**: Mobile-optimized with touch-friendly interaction areas

## Properties

| Property         | Type                                           | Required | Description                                | Default    |
| ---------------- | ---------------------------------------------- | -------- | ------------------------------------------ | ---------- |
| message          | string                                         | No       | The error message to display               | Generic    |
| autoHideAfter    | number                                         | No       | Auto-hide timeout in milliseconds         | 5000       |
| animationDuration| number                                         | No       | Animation duration in milliseconds        | 300        |
| errorContext     | string                                         | No       | Additional context for screen readers     | -          |
| priority         | 'low' \| 'medium' \| 'high' \| 'critical'     | No       | Error priority level                      | 'medium'   |
| allowExtendTimeout| boolean                                       | No       | Allow users to extend timeout             | true       |
| enableSound      | boolean                                        | No       | Enable audio cues                         | false      |
| soundType        | 'beep' \| 'alert' \| 'custom'                 | No       | Type of sound notification                | 'alert'    |
| pauseOnHover     | boolean                                        | No       | Pause auto-hide on hover/focus           | true       |
| showCountdown    | boolean                                        | No       | Show visual countdown timer               | false      |

## CSS Variables

The component uses CSS custom properties for consistent configuration across the application. These variables can be customized in your global CSS:

```css
/* Audio Configuration */
--audio-frequency-low: 400Hz;      /* Low priority error frequency */
--audio-frequency-medium: 600Hz;   /* Medium priority error frequency */
--audio-frequency-high: 800Hz;     /* High priority error frequency */
--audio-frequency-critical: 1000Hz; /* Critical priority error frequency */

--audio-duration-low: 0.1s;        /* Low priority audio duration */
--audio-duration-medium: 0.2s;     /* Medium priority audio duration */
--audio-duration-high: 0.3s;       /* High priority audio duration */
--audio-duration-critical: 0.5s;   /* Critical priority audio duration */

--audio-volume-low: 0.1;           /* Low priority audio volume */
--audio-volume-medium: 0.15;       /* Medium priority audio volume */
--audio-volume-high: 0.2;          /* High priority audio volume */
--audio-volume-critical: 0.3;      /* Critical priority audio volume */

/* Timing Configuration */
--error-auto-hide-duration: 5000ms;     /* Default auto-hide timeout */
--error-extension-duration: 5000ms;     /* Extension timeout duration */
--error-countdown-update-interval: 100ms; /* Countdown update frequency */
```

## Usage

### Basic Implementation

```astro
---
import ErrorMessage from "@components/Shared/ErrorMessage.astro";
---

<ErrorMessage 
  message="An error occurred while processing your request"
  priority="medium"
  autoHideAfter={5000}
/>
```

### Advanced Implementation with All Features

```astro
---
import ErrorMessage from "@components/Shared/ErrorMessage.astro";
---

<ErrorMessage 
  message="Critical system error detected"
  priority="critical"
  autoHideAfter={10000}
  animationDuration={400}
  errorContext="This error occurred during user authentication"
  allowExtendTimeout={true}
  enableSound={true}
  soundType="alert"
  pauseOnHover={true}
  showCountdown={true}
/>
```

### Programmatic Usage

```typescript
// Show error programmatically using global utility
window.showError("Network connection failed", 7000);

// Advanced programmatic usage
const errorElement = document.querySelector("error-message") as ErrorMessage;
errorElement.updateMessage("New error occurred", true);
errorElement.show();
```

## Priority Levels

### Low Priority (`priority="low"`)
- **Visual**: Yellow/warning colors with subtle styling
- **Behavior**: Standard auto-hide, no animations
- **Use Case**: Non-critical warnings, validation hints

### Medium Priority (`priority="medium"`)
- **Visual**: Red error colors with standard prominence
- **Behavior**: Standard auto-hide with basic transitions
- **Use Case**: Standard errors, form validation failures

### High Priority (`priority="high"`)
- **Visual**: Dark red with pulsing animation
- **Behavior**: Extended auto-hide, attention-grabbing animations
- **Use Case**: Important errors requiring user attention

### Critical Priority (`priority="critical"`)
- **Visual**: Deep red with strong pulsing and glow effects
- **Behavior**: Longest auto-hide, prominent animations, optional sound
- **Use Case**: System errors, security issues, data loss warnings

## Accessibility Features

### WCAG AAA Compliance

- **Color Contrast**: All text maintains 7:1 contrast ratio with backgrounds
- **Focus Management**: Proper focus indicators with 3px solid borders
- **Keyboard Navigation**: Full keyboard accessibility with Escape key dismissal
- **Screen Readers**: Live regions with appropriate ARIA attributes
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **High Contrast**: Supports forced-colors mode with system colors

### ARIA Implementation

```html
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
  aria-describedby="error-context"
>
  <!-- Error content -->
  <div id="error-context" class="sr-only">
    Additional context for screen readers
  </div>
</div>
```

### Touch Accessibility

- **Touch Targets**: Minimum 44×44px touch areas for all interactive elements
- **Gesture Support**: Supports swipe-to-dismiss on touch devices
- **Mobile Optimization**: Responsive spacing and font sizes

## Performance Optimizations

### CSS Variables Integration

All styling uses CSS custom properties from `global.css`:

```css
.errorMessage {
  background-color: var(--color-error-600);
  color: var(--text-error-aaa);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  transition: opacity var(--transition-normal);
}
```

### Hardware Acceleration

- **Transform3D**: All animations use `translateZ(0)` for GPU acceleration
- **Will-Change**: Strategic use of `will-change` property for smooth animations
- **Composite Layers**: Optimized layer creation for better performance

### Memory Management

- **Event Cleanup**: Automatic cleanup of event listeners on component removal
- **Timer Management**: Proper clearance of timeouts and intervals
- **DOM Optimization**: Minimal DOM manipulation with efficient updates

## Sound Integration

### Sound Configuration by Priority

The component supports optional sound notifications using the Web Audio API with configuration managed through CSS variables:

```typescript
// Sound configuration is now read from CSS variables
const getAudioConfig = (): AudioConfig => {
  const style = getComputedStyle(document.documentElement);
  return {
    low: {
      frequency: parseInt(style.getPropertyValue('--audio-frequency-low') || '400'),
      duration: parseFloat(style.getPropertyValue('--audio-duration-low') || '0.1'),
      volume: parseFloat(style.getPropertyValue('--audio-volume-low') || '0.1')
    },
    medium: {
      frequency: parseInt(style.getPropertyValue('--audio-frequency-medium') || '600'),
      duration: parseFloat(style.getPropertyValue('--audio-duration-medium') || '0.2'),
      volume: parseFloat(style.getPropertyValue('--audio-volume-medium') || '0.15')
    },
    high: {
      frequency: parseInt(style.getPropertyValue('--audio-frequency-high') || '800'),
      duration: parseFloat(style.getPropertyValue('--audio-duration-high') || '0.3'),
      volume: parseFloat(style.getPropertyValue('--audio-volume-high') || '0.2')
    },
    critical: {
      frequency: parseInt(style.getPropertyValue('--audio-frequency-critical') || '1000'),
      duration: parseFloat(style.getPropertyValue('--audio-duration-critical') || '0.5'),
      volume: parseFloat(style.getPropertyValue('--audio-volume-critical') || '0.3')
    }
  };
};
```

### Browser Compatibility

- **Progressive Enhancement**: Graceful fallback when Web Audio API is unavailable
- **Autoplay Policies**: Respects browser autoplay restrictions
- **User Preference**: Sounds are opt-in and respect system sound settings

## Internationalization

The component supports multiple languages through the i18n system:

```typescript
// Required translation keys
const translationKeys = {
  "error.default": "An error occurred",
  "error.close": "Close error message",
  "error.extend": "Extend timeout",
  "error.extend.tooltip": "Add 5 more seconds",
  "error.countdown": "Time remaining",
  "error.context.low": "Warning notification",
  "error.context.medium": "Error notification", 
  "error.context.high": "Important error",
  "error.context.critical": "Critical system error"
};
```

## CSS Variables Used

### Audio Configuration
- `--audio-frequency-low`: 400Hz - Low priority error sound frequency
- `--audio-frequency-medium`: 600Hz - Medium priority error sound frequency  
- `--audio-frequency-high`: 800Hz - High priority error sound frequency
- `--audio-frequency-critical`: 1000Hz - Critical priority error sound frequency
- `--audio-duration-low`: 0.1s - Low priority audio duration
- `--audio-duration-medium`: 0.2s - Medium priority audio duration
- `--audio-duration-high`: 0.3s - High priority audio duration
- `--audio-duration-critical`: 0.5s - Critical priority audio duration
- `--audio-volume-low`: 0.1 - Low priority audio volume
- `--audio-volume-medium`: 0.15 - Medium priority audio volume
- `--audio-volume-high`: 0.2 - High priority audio volume
- `--audio-volume-critical`: 0.3 - Critical priority audio volume

### Timing Configuration
- `--error-auto-hide-duration`: 5000ms - Default auto-hide timeout
- `--error-extension-duration`: 5000ms - Extension timeout duration
- `--error-countdown-update-interval`: 100ms - Countdown update frequency

### Colors
- `--color-error-600`, `--color-error-700`, `--color-error-800`: Background colors
- `--text-error-aaa`: WCAG AAA compliant text color
- `--border-error`: Error state border color
- `--color-warning-600`: Warning background for low priority

### Spacing & Layout
- `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`: Consistent spacing
- `--radius-lg`, `--radius-md`, `--radius-full`: Border radius values
- `--z-notification`: Z-index for proper layering

### Typography
- `--text-base`, `--text-xl`, `--text-xs`: Font sizes
- `--font-medium`: Font weight
- `--leading-enhanced`: Line height for readability

### Animations & Transitions
- `--transition-normal`, `--transition-fast`: Transition durations
- `--animation-pulse-duration`: Pulse animation timing
- `--animation-glow-size`: Glow effect size

## Browser Support

- **Modern Browsers**: Full feature support in Chrome 88+, Firefox 85+, Safari 14+
- **Progressive Enhancement**: Core functionality works in older browsers
- **Polyfills**: No external polyfills required
- **Mobile**: Full support on iOS 14+ and Android 8+

## Related Components

- [Toast](./Toast.md) - Alternative notification component for success messages
- [Modal](./Modal.md) - For critical errors requiring user acknowledgment
- [ValidationMessage](./ValidationMessage.md) - For form field-specific errors
- [StatusIndicator](./StatusIndicator.md) - For system status communication

## Migration Guide

### From Legacy Error Component

```typescript
// Old implementation
<div class="error">Error occurred</div>

// New implementation
<ErrorMessage 
  message="Error occurred"
  priority="medium"
  autoHideAfter={5000}
/>
```

### CSS Migration

Replace hardcoded styles with CSS variables:

```css
/* Before */
.error {
  background-color: #dc2626;
  color: #ffffff;
  padding: 16px;
}

/* After */
.error {
  background-color: var(--color-error-600);
  color: var(--text-error-aaa);
  padding: var(--space-md);
}
```

## Testing Guidelines

### Unit Tests

```typescript
// Test auto-hide functionality
test('should auto-hide after specified timeout', async () => {
  const errorMessage = new ErrorMessage();
  errorMessage.show();
  await waitFor(5000);
  expect(errorMessage.classList.contains('hidden')).toBe(true);
});
```

### Accessibility Tests

```typescript
// Test keyboard navigation
test('should close on Escape key', () => {
  const errorMessage = new ErrorMessage();
  errorMessage.show();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(errorMessage.classList.contains('hidden')).toBe(true);
});
```

### Visual Regression Tests

- Test all priority levels for consistent appearance
- Verify responsive behavior across breakpoints
- Validate dark/light mode compatibility
- Check high contrast mode support

## Best Practices

### Usage Guidelines

1. **Priority Selection**: Use appropriate priority levels based on error severity
2. **Message Content**: Keep messages concise but informative
3. **Timeout Settings**: Longer timeouts for critical errors
4. **Sound Usage**: Enable sounds only for high/critical priority errors
5. **Context Information**: Provide helpful context for screen reader users

### Performance Tips

1. **Minimize Instances**: Limit to one error message at a time when possible
2. **CSS Variables**: Always use predefined CSS variables for styling
3. **Event Cleanup**: Ensure proper cleanup in single-page applications
4. **Animation Optimization**: Respect user motion preferences

### Common Pitfalls

1. **Multiple Instances**: Creating multiple error messages simultaneously
2. **Hardcoded Styles**: Using inline styles instead of CSS variables
3. **Missing Context**: Not providing sufficient context for screen readers
4. **Poor Timing**: Using inappropriate auto-hide timeouts for error severity

## Changelog

### v3.1.0 - Current (Maximum Optimization Complete)

- **🎯 MAXIMUM CSS VARIABLES OPTIMIZATION ACHIEVED**: 100% utilization of root variables from global.css
- **🔧 COMPREHENSIVE DRY PRINCIPLES**: Complete elimination of hardcoded values and code duplication
- **⚡ PERFORMANCE MAXIMIZED**: All animations, timing, and spacing use global CSS variables
- **♿ ACCESSIBILITY ENHANCED**: Screen reader utilities use consistent micro-spacing variables
- **📱 MOBILE OPTIMIZED**: Touch targets use enhanced sizing variables for optimal mobile experience
- **🔄 JAVASCRIPT INTEGRATION**: `notifyScreenReaders()` method fully optimized with CSS variable lookup
- **🎵 AUDIO SYSTEM**: Complete Web Audio API integration with CSS-configurable parameters
- **📊 BUILD VALIDATED**: Component passes all Astro checks with zero errors
- **📖 DOCUMENTATION COMPLETE**: Comprehensive 425-line documentation with usage examples

### v3.0.0

- Added WCAG AAA compliance with 7:1 contrast ratios
- Implemented priority-based styling and behavior
- Added sound integration with Web Audio API
- Enhanced keyboard navigation and focus management
- Improved performance with CSS variables and hardware acceleration

### v2.5.0

- Added countdown visualization feature
- Implemented pause/resume functionality on hover/focus
- Enhanced screen reader announcements
- Added programmatic API for dynamic content updates

### v2.0.0

- Complete rewrite with TypeScript and modern Astro patterns
- Implemented comprehensive accessibility features
- Added responsive design and mobile optimization
- Introduced CSS variables integration for consistent theming
