# LanguagePicker Component - Comprehensive Documentation

## Overview

The LanguagePicker component is a fully accessible, interactive language selection component that
allows users to switch between multiple languages throughout the MelodyMind application. This
component maintains the user's language preference across sessions and provides a seamless
multilingual experience.

![LanguagePicker Component Screenshot](../public/docs/language-picker.png)

## Key Features

- **WCAG AAA Compliant**: 7:1 contrast ratio and comprehensive accessibility features
- **Keyboard Accessibility**: Full keyboard navigation with proper focus management
- **Screen Reader Support**: Proper ARIA attributes and live region announcements
- **Native Select Element**: Maximum compatibility across all devices and browsers
- **Visual Feedback**: Enhanced interaction states with smooth animations
- **Language Persistence**: Stores user preference via localStorage
- **Performance Optimized**: Uses TypeScript utility class for enhanced functionality
- **Responsive Design**: Adaptive layout for all screen sizes
- **Multi-language Support**: Currently supports 10 languages

## Supported Languages

| Code | Language   | Flag | Localized Name |
| ---- | ---------- | ---- | -------------- |
| `da` | Danish     | 🇩🇰   | Dansk          |
| `de` | German     | 🇩🇪   | Deutsch        |
| `en` | English    | 🇬🇧   | English        |
| `es` | Spanish    | 🇪🇸   | Español        |
| `fi` | Finnish    | 🇫🇮   | Suomi          |
| `fr` | French     | 🇫🇷   | Français       |
| `it` | Italian    | 🇮🇹   | Italiano       |
| `nl` | Dutch      | 🇳🇱   | Nederlands     |
| `pt` | Portuguese | 🇵🇹   | Português      |
| `sv` | Swedish    | 🇸🇪   | Svenska        |

## Properties

The component uses Astro's server-side rendering capabilities and doesn't accept external props.
Instead, it automatically detects the current language from the URL and provides all necessary
functionality internally.

### Internal Configuration

| Property    | Type     | Description                          | Default         |
| ----------- | -------- | ------------------------------------ | --------------- |
| `lang`      | `string` | Current language detected from URL   | Auto-detected   |
| `cleanPath` | `string` | Current path without language prefix | Auto-calculated |
| `languages` | `object` | Sorted language configuration object | Auto-generated  |

## Usage

### Basic Implementation

```astro
---
// In your Astro component or layout
import LanguagePicker from "@components/LanguagePicker.astro";
---

<nav aria-label="Main navigation">
  <LanguagePicker />
</nav>
```

### Integration with Navigation

```astro
---
// src/components/Header/Navigation.astro
import LanguagePicker from "@components/LanguagePicker.astro";
import { useTranslations } from "@utils/i18n";

const t = useTranslations();
---

<header class="header">
  <nav class="navigation" aria-label={t("navigation.main")}>
    <div class="navigation__content">
      <!-- Other navigation items -->

      <div class="navigation__language">
        <LanguagePicker />
      </div>
    </div>
  </nav>
</header>
```

### Layout Integration

```astro
---
// src/layouts/Layout.astro
import LanguagePicker from "@components/LanguagePicker.astro";
---

<html lang={lang}>
  <head>
    <!-- Head content -->
  </head>
  <body>
    <header>
      <LanguagePicker />
    </header>

    <main>
      <slot />
    </main>
  </body>
</html>
```

## API Reference

### Component Structure

```astro
<div class="language-picker" role="navigation" aria-label="Language Picker">
  <div class="language-picker__select-container">
    <select class="language-picker__select" * ... *>
      <!-- Language options -->
    </select>

    <div class="language-picker__arrow-container">
      <!-- Dropdown arrow SVG -->
    </div>
  </div>

  <div class="language-picker__status" aria-live="polite">
    <!-- Screen reader announcements -->
  </div>
</div>
```

### Key Elements

#### Select Element

- **ID**: `language-select`
- **Role**: Native select functionality
- **Attributes**: Comprehensive ARIA attributes for accessibility
- **Event**: `onchange` triggers language switch and localStorage update

#### Arrow Indicator

- **Purpose**: Visual feedback for dropdown state
- **Animation**: Rotates 180° on focus/active states
- **Accessibility**: `aria-hidden="true"` to avoid screen reader noise

#### Status Element

- **Purpose**: Live region for screen reader announcements
- **Visibility**: Hidden visually but available to assistive technology
- **Updates**: Announces current language selection

### TypeScript Integration

The component uses an external TypeScript utility for enhanced functionality:

```typescript
// src/utils/languagePicker.ts
import { LanguagePicker } from "@utils/languagePicker";

// Initialize with default configuration
const picker = LanguagePicker.init();

// Initialize with custom configuration
const picker = LanguagePicker.init({
  selectElementId: "custom-language-select",
  arrowElementId: "custom-arrow",
  arrowContainerId: "custom-container",
  statusElementId: "custom-status",
});
```

## Accessibility Features

### WCAG AAA Compliance

The component meets WCAG AAA standards with the following features:

#### Color Contrast

- **7:1 ratio** for normal text
- **4.5:1 ratio** for large text
- **High contrast mode** support via CSS media queries
- **Forced colors mode** support for Windows High Contrast

#### Keyboard Navigation

- **Tab navigation** to focus the select element
- **Arrow keys** for navigating language options
- **Enter/Space** to open/close dropdown
- **Escape** to close dropdown (native select behavior)

#### Touch Accessibility

- **Minimum 44×44px** touch targets
- **Touch-friendly** spacing and layout
- **Mobile-optimized** interaction areas

#### Screen Reader Support

- **Proper ARIA attributes** for enhanced screen reader experience
- **Live region announcements** for language changes
- **Semantic HTML structure** with role attributes
- **Descriptive labels** for all interactive elements

### ARIA Attributes

```html
<div role="navigation" aria-label="Language Picker">
  <select
    aria-label="Select your preferred language"
    aria-expanded="false"
    data-focus-announce="Language selector focused..."
  >
    <option aria-label="View website in English">🇬🇧 English</option>
    <!-- More options -->
  </select>
</div>

<div aria-live="polite">Current language: English</div>
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .language-picker__select,
  .language-picker__arrow {
    transition-duration: var(--transition-fast) !important;
  }

  .language-picker__select:hover {
    transform: none;
  }
}
```

## Internationalization

### Translation Keys

The component uses the following i18n keys:

```typescript
// Required translation keys for each language
const i18nKeys = {
  "language.picker.label": "Language Picker",
  "language.select.label": "Select your preferred language",
  "language.dropdown.arrow": "Dropdown Arrow",
  "language.focus.announce": "Language selector focused. Use arrow keys to navigate options.",
  "language.change.success": "Language changed to {language}",
  "language.change.error": "Language change failed. Please try again.",
  "language.preference.restored": "Language preference restored: {language}",
  "language.selected": "Current language: {language}",

  // Language names
  "language.en": "English",
  "language.de": "German",
  "language.es": "Spanish",
  "language.fr": "French",
  "language.it": "Italian",
  "language.pt": "Portuguese",
  "language.da": "Danish",
  "language.nl": "Dutch",
  "language.sv": "Swedish",
  "language.fi": "Finnish",

  // Accessibility labels
  "language.en.label": "View website in English",
  "language.de.label": "View website in German",
  // ... other language labels
};
```

### Language Detection

The component automatically:

1. **Detects current language** from the URL path
2. **Removes language prefix** from the current path
3. **Generates relative URLs** for language switching
4. **Sorts languages alphabetically** by localized names

## Styling and CSS Architecture

### CSS Variables Integration

The component uses **100% CSS custom properties** from `global.css`:

```css
/* Layout variables */
.language-picker__select {
  min-height: var(--min-touch-size); /* 44px minimum */
  padding: var(--space-sm) var(--space-md); /* 8px 16px */
  border-radius: var(--radius-lg); /* Consistent radius */

  /* Colors using semantic variables */
  background-color: var(--interactive-primary);
  color: var(--btn-primary-text);

  /* Typography */
  font-size: var(--text-base); /* 16px */
  font-weight: var(--font-medium); /* 500 */

  /* Transitions */
  transition: var(--transition-normal); /* 0.2s ease */
}
```

### BEM Methodology

The component follows BEM (Block-Element-Modifier) naming:

```css
/* Block */
.language-picker {
}

/* Elements */
.language-picker__select-container {
}
.language-picker__select {
}
.language-picker__option {
}
.language-picker__arrow-container {
}
.language-picker__arrow {
}
.language-picker__status {
}

/* Modifiers (state-based) */
.language-picker__select:hover {
}
.language-picker__select:focus {
}
.language-picker__select:disabled {
}
```

### Responsive Design

```css
/* Mobile-first approach with CSS variables */
.language-picker__select {
  min-width: var(--min-touch-size);
}

/* Larger screens */
@media (min-width: var(--breakpoint-sm)) {
  .language-picker__select {
    min-width: calc(var(--min-touch-size) * 2.5);
  }
}
```

### Enhanced Accessibility Modes

```css
/* High contrast mode */
@media (prefers-contrast: high) {
  .language-picker__select {
    border: var(--border-width-thick) solid var(--text-primary);
  }
}

/* Forced colors mode (Windows High Contrast) */
@media (forced-colors: active) {
  .language-picker__select {
    background-color: ButtonFace;
    color: ButtonText;
    border: var(--border-width-thin) solid ButtonText;
  }
}

/* Enhanced text spacing support (WCAG 2.2) */
.enhanced-text-spacing .language-picker__select {
  letter-spacing: var(--letter-spacing-enhanced);
  word-spacing: var(--word-spacing-enhanced);
  line-height: var(--line-height-enhanced);
}
```

## Performance Optimizations

### TypeScript Utility Class

The component leverages an external TypeScript utility for:

- **Memory management** with AbortController
- **Performance monitoring** with built-in metrics
- **Event delegation** for efficient event handling
- **DOM caching** for optimized references
- **Automatic cleanup** to prevent memory leaks

### Initialization Performance

```typescript
// Performance monitoring example
const picker = LanguagePicker.init();
const metrics = picker.getPerformanceMetrics();

console.log({
  eventListenerCount: metrics.eventListenerCount,
  memoryUsage: metrics.memoryUsage,
  initializationTime: "< 50ms target",
});
```

### CSS Performance

- **CSS containment** for layout optimization
- **Transform optimizations** using CSS variables
- **Efficient selectors** avoiding deep nesting
- **Minimal reflows** with optimized transitions

## Browser Compatibility

### Supported Browsers

| Browser        | Version | Notes        |
| -------------- | ------- | ------------ |
| Chrome         | 90+     | Full support |
| Firefox        | 88+     | Full support |
| Safari         | 14+     | Full support |
| Edge           | 90+     | Full support |
| iOS Safari     | 14+     | Full support |
| Android Chrome | 90+     | Full support |

### Progressive Enhancement

The component provides graceful degradation:

1. **Native select** functionality works in all browsers
2. **CSS enhancements** progressively enhance the experience
3. **JavaScript features** enhance but don't break core functionality
4. **Accessibility features** maintain compatibility across assistive technologies

## Testing and Validation

### Accessibility Testing

- ✅ **Screen reader compatibility** (NVDA, JAWS, VoiceOver)
- ✅ **Keyboard-only navigation** testing
- ✅ **Color contrast validation** (7:1 ratio achieved)
- ✅ **Focus management** testing
- ✅ **Touch target size** validation (44×44px minimum)

### Functional Testing

- ✅ **Language switching** works correctly across all supported languages
- ✅ **URL generation** maintains current page context
- ✅ **localStorage persistence** saves and restores preferences
- ✅ **Visual feedback** (arrow rotation) functions properly
- ✅ **Error handling** gracefully manages failed language switches

### Performance Testing

- ✅ **Initialization time** < 50ms
- ✅ **Memory usage** optimized with cleanup
- ✅ **Event listener management** efficient with AbortController
- ✅ **CSS rendering** optimized with containment

### Cross-Platform Testing

- ✅ **Desktop browsers** (Windows, macOS, Linux)
- ✅ **Mobile devices** (iOS, Android)
- ✅ **Tablet devices** (iPad, Android tablets)
- ✅ **High-DPI displays** (Retina, 4K)

## Implementation Notes

### Server-Side Rendering

The component is optimized for Astro's SSR capabilities:

- **Language detection** happens at build/request time
- **URL generation** uses Astro's i18n utilities
- **Translation loading** occurs server-side
- **Client-side hydration** only adds interactivity

### Memory Management

```typescript
// Automatic cleanup with AbortController
const abortController = new AbortController();

// All event listeners use the same controller
element.addEventListener("change", handler, {
  signal: abortController.signal,
});

// Cleanup when component unmounts
abortController.abort();
```

### Error Handling

The component includes comprehensive error handling:

```typescript
try {
  // Language switching logic
} catch (error) {
  console.error("Language switch failed:", error);
  // Fallback to current language
  // Show user-friendly error message
}
```

## Related Components

- **[Navigation.astro](./Navigation.md)** - Main navigation component that includes LanguagePicker
- **[Layout.astro](../Layout/Layout.md)** - Base layout that can integrate LanguagePicker
- **[Header.astro](./Header.md)** - Header component for LanguagePicker placement

## Dependencies

### Astro Dependencies

```typescript
import { getRelativeLocaleUrl } from "astro:i18n";
```

### Utility Dependencies

```typescript
import { getLangFromUrl, useTranslations } from "@utils/i18n";
import { LanguagePicker } from "@utils/languagePicker";
```

### No External Dependencies

The component uses only:

- Native HTML `<select>` element
- CSS custom properties
- TypeScript for enhanced functionality
- No external CSS frameworks or JavaScript libraries

## Changelog

### Version 3.0.0 (Current)

- ✅ **WCAG AAA compliance** implementation
- ✅ **TypeScript utility integration** for enhanced performance
- ✅ **CSS variables migration** (100% compliance)
- ✅ **BEM methodology** implementation
- ✅ **Enhanced keyboard navigation**
- ✅ **Performance optimizations** with AbortController
- ✅ **Memory leak prevention**
- ✅ **Responsive design improvements**

### Version 2.5.0

- Added language preference persistence
- Enhanced screen reader support
- Improved focus management

### Version 2.0.0

- Complete redesign with Astro.js
- Multi-language support
- Accessibility improvements

### Version 1.0.0

- Initial implementation
- Basic language switching functionality

## Migration Guide

### From Version 2.x to 3.0

No breaking changes in the component API. The component maintains full backward compatibility while
adding enhanced features.

### CSS Custom Properties Migration

If you have custom styling, update to use CSS variables:

```css
/* Before (v2.x) */
.custom-language-picker {
  background-color: #8b5cf6;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 8px;
}

/* After (v3.0) */
.custom-language-picker {
  background-color: var(--interactive-primary);
  color: var(--btn-primary-text);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
}
```

## Best Practices

### Placement Recommendations

1. **Header/Navigation**: Most common and accessible placement
2. **Footer**: Secondary option for less prominent placement
3. **Settings Panel**: For applications with dedicated settings areas

### Avoid These Patterns

❌ **Don't place in modal dialogs** - Language changes should be available globally ❌ **Don't hide
behind hover states** - Must be accessible to keyboard users ❌ **Don't use custom dropdown
implementations** - Native select is most accessible

### Recommended Patterns

✅ **Use in persistent navigation** - Always available to users ✅ **Combine with visual
indicators** - Flags help visual identification ✅ **Provide clear labels** - Accessibility labels
enhance understanding ✅ **Maintain language context** - Preserve current page when switching

## Advanced Usage

### Custom Configuration

```typescript
// Initialize with custom element IDs
const picker = LanguagePicker.init({
  selectElementId: "my-language-select",
  arrowElementId: "my-dropdown-arrow",
  arrowContainerId: "my-arrow-container",
  statusElementId: "my-status-region",
});
```

### Performance Monitoring

```typescript
// Get real-time performance metrics
const metrics = picker.getPerformanceMetrics();

if (metrics.memoryUsage > threshold) {
  console.warn("Memory usage high, consider cleanup");
  picker.cleanup();
}
```

### Manual Cleanup

```typescript
// Manual cleanup when component is no longer needed
picker.cleanup();

// Verify cleanup was successful
const postCleanupMetrics = picker.getPerformanceMetrics();
console.log("Event listeners remaining:", postCleanupMetrics.eventListenerCount);
```

## Troubleshooting

### Common Issues

#### Language Not Switching

- **Check URL structure**: Ensure language codes are in URL path
- **Verify translations**: Confirm all required translation keys exist
- **Check browser storage**: Clear localStorage if preferences are corrupted

#### Accessibility Issues

- **Test with screen readers**: Verify ARIA attributes are working
- **Check color contrast**: Ensure sufficient contrast ratios
- **Validate keyboard navigation**: Test with keyboard-only interaction

#### Performance Issues

- **Monitor initialization time**: Should be < 50ms
- **Check memory usage**: Use performance monitoring methods
- **Verify cleanup**: Ensure proper event listener cleanup

### Debug Mode

```typescript
// Enable debug logging
const picker = LanguagePicker.init();
picker.enableDebugMode();

// Monitor performance in real-time
setInterval(() => {
  const metrics = picker.getPerformanceMetrics();
  console.log("Performance:", metrics);
}, 5000);
```

## Future Enhancements

### Planned Features

- **Automatic language detection** based on browser preferences
- **Keyboard shortcuts** for quick language switching
- **Language search/filter** for installations with many languages
- **Visual language preview** with flag animations
- **Integration with user profiles** for persistent preferences across devices

### Accessibility Improvements

- **Enhanced screen reader** announcements with language codes
- **Improved high contrast** mode support
- **Better touch interaction** feedback
- **Voice control** compatibility improvements

## Contributing

When contributing to the LanguagePicker component:

1. **Follow MelodyMind standards** - Use CSS variables, maintain WCAG AAA compliance
2. **Test accessibility** - Verify with multiple screen readers and keyboard navigation
3. **Performance testing** - Ensure < 50ms initialization time
4. **Update documentation** - Keep this documentation current with changes
5. **Translation support** - Add translation keys for new languages

## References

- [WCAG 2.2 AAA Guidelines](https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2&levels=aaa)
- [Astro Internationalization](https://docs.astro.build/en/guides/internationalization/)
- [MDN Select Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
