# AchievementBadge Component

## Overview

The AchievementBadge component displays a notification badge in the navigation that appears when new
achievements are unlocked. It shows a count of unread achievements and provides accessible
interaction for navigating to the achievements page.

![Achievement Badge in Navigation](../../public/docs/achievement-badge.png)

## Properties

| Property | Type   | Required | Description                    | Default |
| -------- | ------ | -------- | ------------------------------ | ------- |
| lang     | string | Yes      | Language code for translations | -       |

## Usage

```astro
---
import AchievementBadge from "../components/Achievements/AchievementBadge.astro";

// Get current language from URL or context
const lang = "en"; // or "de", "es", etc.
---

<nav class="main-navigation">
  <!-- Other navigation elements -->
  <AchievementBadge lang={lang} />
</nav>
```

## Features

### Visual Indicators

- **Hidden by default**: Badge is invisible when no new achievements exist
- **Count display**: Shows the number of new achievements (1-99+)
- **Smooth animations**: Scale and opacity transitions for appearance/disappearance
- **Theme support**: Adapts to light/dark mode with proper contrast ratios

### Accessibility Features

- **WCAG AAA Compliance**: 7:1 color contrast ratio for all text
- **Touch targets**: Minimum 44×44px touch area for mobile accessibility
- **Keyboard navigation**: Fully navigable with Tab, Enter, and Space keys
- **Screen reader support**: Comprehensive ARIA attributes and live regions
- **Reduced motion**: Respects user motion preferences
- **High contrast mode**: Adapts to forced-colors and prefers-contrast settings

### Internationalization

- **Multi-language support**: Uses translation keys for all user-facing text
- **Dynamic content**: Count and context adapt to selected language
- **Accessible announcements**: Screen reader announcements in user's language

## Behavior

### State Management

1. **Initial load**: Reads count from localStorage
2. **Achievement events**: Listens for new achievement notifications
3. **Page navigation**: Resets count when visiting achievements page
4. **Persistence**: Maintains count across browser sessions

### User Interactions

- **Visual feedback**: Badge appears/disappears based on achievement count
- **Click/tap activation**: Navigates to achievements page
- **Keyboard activation**: Enter or Space key navigation
- **Focus management**: Enhanced focus states with detailed announcements

### Event Handling

```typescript
// Subscribes to achievement events
subscribeToAchievementEvents((event: AchievementEvent) => {
  if (event.type === "achievement_unlocked") {
    // Updates badge count and display
  }
});
```

## Accessibility

### WCAG AAA Compliance

- **Color contrast**: 7:1 ratio for normal text, 4.5:1 for large text
- **Touch targets**: Minimum 44×44px for all interactive elements
- **Focus indicators**: 3px solid focus outlines with sufficient contrast
- **Text spacing**: Supports user text spacing preferences up to 200%

### Screen Reader Support

- **Role attributes**: Uses `status` role for count updates, `alert` for new achievements
- **Live regions**: `aria-live="polite"` for non-intrusive announcements
- **Descriptive labels**: Contextual information about badge purpose and interaction
- **Hidden states**: Properly hidden with `aria-hidden` when not applicable

### Keyboard Navigation

- **Tab order**: Becomes focusable only when visible
- **Activation keys**: Enter and Space for navigation
- **Focus announcements**: Detailed information on focus
- **Navigation feedback**: Announces navigation intent before redirect

### Motion and Contrast

- **Reduced motion**: Respects `prefers-reduced-motion: reduce`
- **High contrast**: Adapts to `prefers-contrast: high`
- **Forced colors**: Compatible with Windows High Contrast mode

## Implementation Details

### CSS Variables Used

```css
/* Spacing */
--space-xs, --space-sm

/* Colors */
--interactive-secondary, --interactive-secondary-hover
--text-primary, --text-inverse

/* Layout */
--min-touch-size, --radius-full
--shadow-md, --shadow-lg, --shadow-xl

/* Typography */
--text-sm, --font-bold

/* Transitions */
--transition-normal, --transition-fast

/* Focus */
--focus-outline, --focus-ring-offset, --focus-ring
```

### LocalStorage Integration

- **Key**: `new-achievements-count`
- **Format**: String representation of integer count
- **Error handling**: Graceful fallback if localStorage unavailable
- **Reset logic**: Automatically clears when achievements page visited

### Performance Optimizations

- **RequestAnimationFrame**: DOM updates use optimized timing
- **Specific transitions**: Only opacity and transform properties animate
- **Event cleanup**: Unsubscribes from events on page unload
- **Minimal reflows**: Efficient DOM manipulation patterns

## Browser Support

- **Modern browsers**: Full support in Chrome 90+, Firefox 88+, Safari 14+
- **Accessibility APIs**: Compatible with NVDA, JAWS, VoiceOver
- **Mobile devices**: Touch-optimized for iOS Safari, Chrome Mobile
- **High contrast**: Windows High Contrast Mode, macOS Increase Contrast

## Testing Considerations

### Manual Testing

- [ ] Badge appears when achievement unlocked
- [ ] Count updates correctly (1-99+)
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Screen reader announces changes appropriately
- [ ] Badge resets when visiting achievements page
- [ ] LocalStorage persistence across sessions

### Accessibility Testing

- [ ] Color contrast meets WCAG AAA (7:1 ratio)
- [ ] Touch targets minimum 44×44px
- [ ] Keyboard focus visible and logical
- [ ] Screen reader testing with NVDA/JAWS/VoiceOver
- [ ] High contrast mode compatibility
- [ ] Reduced motion preference respected

### Cross-browser Testing

- [ ] Visual consistency across browsers
- [ ] Animation performance smooth
- [ ] LocalStorage functionality
- [ ] Event handling reliability

## Related Components

- [Navigation](./Navigation.md) - Contains the achievement badge
- [AchievementCard](./AchievementCard.md) - Individual achievement display
- [AchievementModal](./AchievementModal.md) - Achievement unlock notifications

## Technical Dependencies

### Utilities

- `@utils/i18n` - Translation system integration
- `@utils/achievements/achievementEvents` - Event subscription system

### Types

- `AchievementEvent` - TypeScript interface for achievement events

### Global Styles

- CSS custom properties from `/src/styles/global.css`
- Utility classes: `.sr-only` for screen reader content

## Changelog

### v3.2.0 (Current)

- **Enhanced accessibility**: WCAG AAA compliance improvements
- **Better keyboard navigation**: Detailed focus announcements
- **Improved screen reader support**: Dynamic role switching
- **Performance optimizations**: RequestAnimationFrame usage

### v3.1.0

- **High contrast support**: prefers-contrast and forced-colors media queries
- **Text spacing adaptation**: Support for user text spacing preferences
- **Enhanced error handling**: Graceful localStorage fallbacks

### v3.0.0

- **Breaking**: Switched to CSS custom properties exclusively
- **Accessibility**: Complete WCAG AAA compliance implementation
- **TypeScript**: Full type safety with interfaces
- **i18n**: Multi-language support integration

### v2.5.0

- **Feature**: Keyboard navigation support
- **Feature**: Screen reader optimizations
- **Fix**: LocalStorage error handling

### v2.0.0

- **Breaking**: Component restructure for Astro
- **Feature**: Event-driven architecture
- **Feature**: Persistent count storage
