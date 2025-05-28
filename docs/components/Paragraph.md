# Paragraph Component

## Overview

The Paragraph component is a fully accessible, performance-optimized text display component for the
MelodyMind application. It serves as the foundation for all paragraph text content throughout the
application, ensuring consistent typography, accessibility compliance, and optimal user experience
across all devices and assistive technologies.

![Paragraph Component](../../public/docs/paragraph-component.png)

## Features

- **WCAG AAA 2.2 Compliant**: 7:1 contrast ratio with enhanced accessibility features
- **Text Spacing Support**: Configurable 2x letter spacing, 1.5x line height, and 2x paragraph
  spacing
- **Text Resizing**: Support up to 400% zoom without loss of functionality or horizontal scrolling
- **Enhanced Focus**: 4.5:1 contrast ratio focus indicators for WCAG 2.2 compliance
- **Touch Accessibility**: Minimum 44x44px touch targets for mobile accessibility
- **Responsive Typography**: Adaptive text sizing using CSS custom properties
- **Screen Reader Optimized**: Proper ARIA attributes and semantic markup
- **Multi-language Support**: Language attribute support for proper pronunciation
- **High Contrast Mode**: Windows High Contrast Mode compatibility
- **Motion Preferences**: Respects user's reduced motion preferences
- **Pure CSS Variables**: Uses only CSS custom properties from global.css design system

## Properties

| Property          | Type                                                                | Required | Description                                              | Default     |
| ----------------- | ------------------------------------------------------------------- | -------- | -------------------------------------------------------- | ----------- |
| `description`     | `string`                                                            | No       | Text content as an alternative to using slots            | `undefined` |
| `textSize`        | `"xs" \| "sm" \| "base" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl"` | No       | Text size variant using semantic sizing scale            | `"xl"`      |
| `className`       | `string`                                                            | No       | Additional CSS classes for customization                 | `""`        |
| `id`              | `string`                                                            | No       | Optional ID for ARIA references and anchor links         | `undefined` |
| `align`           | `"start" \| "center" \| "end"`                                      | No       | Text alignment within the paragraph                      | `"start"`   |
| `lang`            | `string`                                                            | No       | Language attribute for screen readers and pronunciation  | `undefined` |
| `ariaLabel`       | `string`                                                            | No       | Optional ARIA label for improved screen reader support   | `undefined` |
| `ariaLive`        | `"off" \| "polite" \| "assertive"`                                  | No       | ARIA live setting for dynamic content announcements      | `undefined` |
| `highContrast`    | `boolean`                                                           | No       | Enables high-contrast mode (WCAG AAA 7:1 ratio)          | `false`     |
| `enhancedSpacing` | `boolean`                                                           | No       | Enables enhanced text spacing (WCAG 2.2 AAA requirement) | `false`     |
| `interactive`     | `boolean`                                                           | No       | Makes paragraph interactive with focus management        | `false`     |

## Usage Examples

### Basic Usage

```astro
---
import Paragraph from "../components/Paragraph.astro";
---

<Paragraph description="This is a basic paragraph with default styling." />

<!-- Or using slots -->
<Paragraph> This is paragraph content using slots for more flexibility. </Paragraph>
```

### Text Sizing and Alignment

```astro
---
import Paragraph from "../components/Paragraph.astro";
---

<!-- Large centered heading paragraph -->
<Paragraph textSize="3xl" align="center" description="Welcome to MelodyMind!" />

<!-- Small left-aligned description -->
<Paragraph
  textSize="sm"
  align="start"
  description="Choose your music category to begin the quiz."
/>
```

### Accessibility Features

```astro
---
import Paragraph from "../components/Paragraph.astro";
---

<!-- High contrast paragraph for visually impaired users -->
<Paragraph highContrast={true} description="Important information displayed with high contrast." />

<!-- Enhanced spacing for users with dyslexia -->
<Paragraph
  enhancedSpacing={true}
  description="Text with enhanced spacing for improved readability."
/>

<!-- Interactive paragraph with proper focus management -->
<Paragraph
  interactive={true}
  ariaLabel="Click to expand details"
  description="This paragraph responds to user interaction."
/>
```

### Multilingual Support

```astro
---Auflauf
import Paragraph from "../components/Paragraph.astro";
---

<!-- German text with proper language attribute -->
<Paragraph lang="de" description="Willkommen bei MelodyMind, dem ultimativen Musik-Quiz!" />

<!-- Spanish text with language attribute -->
<Paragraph lang="es" description="¡Bienvenido a MelodyMind, el quiz de música definitivo!" />
```

### Dynamic Content with ARIA Live

```astro
---
import Paragraph from "../components/Paragraph.astro";
---

<!-- Status updates announced to screen readers -->
<Paragraph id="game-status" ariaLive="polite" description="Game starting in 3 seconds..." />

<!-- Critical announcements -->
<Paragraph ariaLive="assertive" description="Time's up! Your final score is 850 points." />
```

## CSS Architecture

The component follows the BEM (Block-Element-Modifier) methodology and uses only CSS custom
properties from the global design system.

### Base Classes

- `.paragraph` - Base paragraph styles
- `.paragraph--size-{size}` - Size modifiers (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
- `.paragraph--align-{alignment}` - Alignment modifiers (start, center, end)
- `.paragraph--high-contrast` - High contrast mode styling
- `.paragraph--enhanced-spacing` - Enhanced text spacing for accessibility
- `.paragraph--interactive` - Interactive paragraph styling

### CSS Custom Properties Used

The component leverages the following CSS variables from `global.css`:

#### Typography

```css
--text-xs, --text-sm, --text-base, --text-lg
--text-xl, --text-2xl, --text-3xl, --text-4xl
--font-medium, --leading-relaxed
```

#### Colors

```css
--text-primary, --text-secondary
--bg-glass, --color-black
```

#### Spacing

```css
--space-sm, --space-md, --space-xl
```

#### Layout

```css
--radius-sm, --min-touch-size
--transition-normal
```

#### Focus System

```css
--focus-outline, --focus-ring-offset
```

#### Responsive Breakpoints

```css
--breakpoint-sm, --breakpoint-md
```

## Accessibility Compliance

### WCAG AAA 2.2 Features

#### Text Spacing (SC 1.4.12)

- **Letter spacing**: 2x normal spacing (0.12em)
- **Line height**: 1.5x relaxed line height (2.4)
- **Paragraph spacing**: 2x normal spacing

#### Text Resize (SC 1.4.4)

- **Support up to 400%** text zoom without horizontal scrolling
- **Optimal line length**: Maximum 80 characters for readability
- **Responsive breakpoints**: Adaptive sizing across devices

#### Enhanced Focus (SC 2.4.12)

- **4.5:1 contrast ratio** for focus indicators
- **3px solid outline** with 2px offset
- **Keyboard navigation** support for interactive paragraphs

#### Touch Targets (SC 2.5.5)

- **Minimum 44x44px** touch targets for interactive elements
- **Adequate spacing** between interactive elements

### Screen Reader Support

```astro
<!-- Proper language identification -->
<Paragraph lang="en" description="English content" />

<!-- Dynamic content announcements -->
<Paragraph ariaLive="polite" description="Status update" />

<!-- Additional context for screen readers -->
<Paragraph ariaLabel="Navigation instructions" description="Use arrow keys to navigate" />
```

### High Contrast Mode

The component automatically adapts to:

- **Windows High Contrast Mode** using `forced-colors: active`
- **User preference for high contrast** via the `highContrast` prop
- **Semantic color usage** beyond color alone

## Performance Optimizations

### CSS Optimizations

- **CSS Custom Properties**: Efficient browser-native theming
- **Minimal Specificity**: Low CSS specificity for better performance
- **No JavaScript**: Pure CSS implementation for optimal performance
- **Responsive Units**: Em-based breakpoints for accessibility

### Rendering Optimizations

- **Static Generation**: Component is SSG-optimized
- **Font Optimization**: Uses system fonts with optimized rendering
- **Text Rendering**: Optimized with `text-rendering: optimizeLegibility`

## Browser Support

### Modern Features

- **CSS Custom Properties**: IE11+ (with fallbacks)
- **CSS Grid & Flexbox**: All modern browsers
- **Focus-visible**: Polyfill included for older browsers
- **Forced Colors**: Edge 79+, Safari 15.4+

### Accessibility APIs

- **ARIA Support**: All browsers with screen reader support
- **High Contrast**: Windows 10+, macOS 10.14+
- **Reduced Motion**: All modern browsers

## Related Components

- **[Headline Component](./Headline.md)**: For heading text with semantic hierarchy
- **[Button Component](./Button.md)**: For interactive call-to-action elements
- **[Card Component](./Card.md)**: For structured content containers

## Migration Guide

### From Tailwind Implementation

If migrating from a Tailwind-based implementation:

```astro
<!-- OLD: Tailwind classes -->
<p class="mb-8 text-xl leading-relaxed text-gray-300">Content here</p>

<!-- NEW: Paragraph component -->
<Paragraph textSize="xl" description="Content here" />
```

### Breaking Changes

**Version 2.0.0+**

- `textSize` prop now uses semantic values instead of Tailwind classes
- Removed `color` prop in favor of `highContrast` boolean
- Added required CSS custom properties dependency

## Testing

### Accessibility Testing

```bash
# Run accessibility tests
npm run test:accessibility

# Test with screen readers
npm run test:screenreader

# Validate WCAG compliance
npm run test:wcag
```

### Visual Regression Testing

```bash
# Test component appearance
npm run test:visual

# Test responsive behavior
npm run test:responsive
```

## Contributing

When contributing to the Paragraph component:

1. **Maintain CSS Variables**: Always use variables from `global.css`
2. **Follow BEM Methodology**: Consistent class naming conventions
3. **Test Accessibility**: Verify WCAG AAA compliance
4. **Document Changes**: Update this documentation for any new features
5. **Performance**: Ensure no performance regressions

## Examples Repository

For more comprehensive examples and usage patterns, see:

- [Component Examples](../../src/components/examples/ParagraphExamples.astro)
- [Accessibility Demos](../../src/pages/examples/accessibility.astro)
- [Typography Showcase](../../src/pages/examples/typography.astro)
