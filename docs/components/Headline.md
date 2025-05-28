# Headline Component

## Overview

The Headline component is a versatile and accessible heading component that supports different
heading levels, custom styling, and proper semantic hierarchy. It provides the foundation for all
headings throughout the MelodyMind application while maintaining consistent typography and
accessibility standards.

![Headline Component](../../public/docs/headline-component.png)

## Features

- **Semantic HTML**: Dynamic heading levels (h1-h6) for proper document structure
- **Accessibility Focused**: WCAG AAA compliant with proper focus management
- **Skip Navigation**: Programmatically focusable for screen reader navigation
- **Responsive Typography**: Adaptive sizing across different screen sizes
- **Flexible Content**: Supports both prop-based and slot-based content
- **Custom Styling**: Extensible with additional CSS classes
- **Text Wrapping**: Intelligent text wrapping with `text-wrap: balance`
- **Screen Reader Support**: Enhanced with ARIA labels and semantic markup

## Properties

| Property    | Type                                           | Required | Description                                              | Default     |
| ----------- | ---------------------------------------------- | -------- | -------------------------------------------------------- | ----------- |
| `title`     | `string`                                       | No       | Text content of the heading (alternative to slots)       | `undefined` |
| `level`     | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | No       | HTML heading level for semantic hierarchy                | `"h1"`      |
| `className` | `string`                                       | No       | Additional CSS classes for customization                 | `""`        |
| `id`        | `string`                                       | No       | Optional ID for direct linking and document structure    | `undefined` |
| `focusable` | `boolean`                                      | No       | Makes heading programmatically focusable (tabindex="-1") | `false`     |
| `ariaLabel` | `string`                                       | No       | Optional ARIA label for improved screen reader context   | `undefined` |

## Usage Examples

### Basic Usage

```astro
---
import Headline from "../components/Headline.astro";
---

<!-- Simple heading with default h1 level -->
<Headline title="Welcome to MelodyMind" />

<!-- Using slots for more flexibility -->
<Headline level="h2">
  Choose Your <em>Music Category</em>
</Headline>
```

### Semantic Document Structure

```astro
---
import Headline from "../components/Headline.astro";
---

<!-- Page title (h1) -->
<Headline level="h1" title="Music Trivia Game" />

<!-- Section headings (h2) -->
<Headline level="h2" title="Game Categories" />
<Headline level="h2" title="Difficulty Levels" />

<!-- Subsection headings (h3) -->
<Headline level="h3" title="Rock & Pop" />
<Headline level="h3" title="Classical Music" />
```

### Accessibility Features

```astro
---
import Headline from "../components/Headline.astro";
---

<!-- Skip navigation target -->
<Headline level="h1" id="main-content" focusable={true} title="Game Results" />

<!-- Enhanced screen reader context -->
<Headline
  level="h2"
  ariaLabel="Current quiz question out of 20 total questions"
  title="Question 5 of 20"
/>
```

### Custom Styling

```astro
---
import Headline from "../components/Headline.astro";
---

<!-- Small headline variant -->
<Headline level="h3" className="headline--small" title="Quick Stats" />

<!-- Large headline variant -->
<Headline level="h1" className="headline--large" title="Congratulations!" />
```

### Direct Linking and Navigation

```astro
---
import Headline from "../components/Headline.astro";
---

<!-- Linkable section headers -->
<Headline level="h2" id="game-rules" title="Game Rules" />

<Headline level="h2" id="scoring-system" title="Scoring System" />
```

## CSS Architecture

The component follows the BEM (Block-Element-Modifier) methodology with semantic class naming.

### Base Classes

- `.headline` - Base headline styles
- `.headline--focusable` - Focus management for skip navigation
- `.headline--small` - Smaller text size variant
- `.headline--large` - Larger text size variant

### ⚠️ Current Implementation Status

**Note**: The current implementation uses some hardcoded values that should be migrated to CSS
custom properties from `global.css` for full compliance with MelodyMind standards.

#### Current CSS (Needs Migration)

```css
/* ❌ Hardcoded values - should be migrated */
.headline {
  font-size: 2rem; /* Should use: var(--text-2xl) */
  margin-bottom: 1.5rem; /* Should use: var(--space-lg) */
  color: var(--color-sky-500, #0ea5e9); /* Should use: var(--text-primary) */
}
```

#### Target CSS (Future Implementation)

```css
/* ✅ Recommended implementation with CSS variables */
.headline {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
  line-height: var(--leading-tight);
  font-weight: var(--font-bold);
}
```

## Semantic HTML Structure

The component generates proper semantic HTML based on the `level` prop:

```html
<!-- level="h1" -->
<h1 class="headline">Welcome to MelodyMind</h1>

<!-- level="h2" with ID -->
<h2 id="game-rules" class="headline">Game Rules</h2>

<!-- level="h3" with focusable -->
<h3 tabindex="-1" class="headline headline--focusable">Skip Navigation Target</h3>
```

## Accessibility Compliance

### Current WCAG Support

#### Document Structure (SC 1.3.1)

- **Semantic heading levels**: Proper h1-h6 hierarchy
- **Logical flow**: Supports proper document outline
- **Screen reader navigation**: Heading navigation landmarks

#### Focus Management (SC 2.4.3)

- **Skip navigation**: Programmatically focusable headlines
- **Focus indicators**: Visible focus styles (needs CSS variable migration)
- **Keyboard navigation**: Tab order preservation

#### Text Alternatives (SC 1.1.1)

- **ARIA labels**: Enhanced context for screen readers
- **Semantic markup**: Meaningful heading structure

### ⚠️ Accessibility Improvements Needed

To achieve full WCAG AAA 2.2 compliance, the following enhancements are recommended:

1. **Color Contrast**: Migrate to CSS variables ensuring 7:1 contrast ratio
2. **Focus Appearance**: Use `var(--focus-outline)` for consistent focus indicators
3. **Text Spacing**: Support enhanced text spacing with CSS variables
4. **High Contrast Mode**: Add Windows High Contrast Mode support

```css
/* Recommended accessibility enhancements */
.headline {
  color: var(--text-primary); /* Ensures 7:1 contrast */
}

.headline--focusable:focus {
  outline: var(--focus-outline); /* Consistent focus styling */
  outline-offset: var(--focus-ring-offset);
}

/* High contrast mode support */
@media (forced-colors: active) {
  .headline {
    color: CanvasText;
    forced-color-adjust: none;
  }
}
```

## Performance Considerations

### Current Optimizations

- **Static generation**: Component is SSG-optimized
- **Minimal JavaScript**: Pure CSS implementation
- **Dynamic tag generation**: Efficient HTML output
- **Text wrapping**: Native `text-wrap: balance` support

### Recommended Improvements

- **CSS Variables**: Reduce CSS bundle size through variable reuse
- **Font Loading**: Optimize with system font stack
- **Critical CSS**: Inline critical heading styles

## Browser Support

### Current Support

- **Modern browsers**: Full support for CSS features
- **Text wrap balance**: Chrome 114+, Firefox 121+, Safari 16.4+
- **CSS nesting**: Chrome 112+, Firefox 117+, Safari 16.5+

### Accessibility APIs

- **Screen readers**: Full ARIA and semantic support
- **Keyboard navigation**: Universal keyboard support
- **High contrast**: Needs enhancement for full support

## Related Components

- **[Paragraph Component](./Paragraph.md)**: For body text content with WCAG AAA compliance
- **[Navigation Component](./Navigation.md)**: For structural navigation elements
- **[Skip Link Component](./SkipLink.md)**: For accessibility navigation helpers

## Migration Roadmap

### Phase 1: CSS Variables Migration

```astro
<!-- Current implementation -->
<style>
  .headline {
    font-size: 2rem;
    color: var(--color-sky-500, #0ea5e9);
  }
</style>

<!-- Target implementation -->
<style>
  .headline {
    font-size: var(--text-2xl);
    color: var(--text-primary);
  }
</style>
```

### Phase 2: Enhanced Accessibility

- Add support for `enhancedSpacing` prop
- Implement `highContrast` mode
- Add reduced motion support
- Enhance focus management

### Phase 3: Advanced Features

- Typography scale integration
- Component size variants
- Theme-aware styling
- Print optimization

## Testing

### Accessibility Testing

```bash
# Test heading hierarchy
npm run test:headings

# Validate WCAG compliance
npm run test:wcag

# Screen reader testing
npm run test:screenreader
```

### Component Testing

```bash
# Visual regression tests
npm run test:visual:headline

# Interactive behavior
npm run test:interaction
```

## Contributing

When contributing to the Headline component:

1. **Prioritize CSS Variables**: Migrate hardcoded values to `global.css` variables
2. **Maintain Semantic HTML**: Preserve proper heading hierarchy
3. **Enhance Accessibility**: Follow WCAG AAA 2.2 standards
4. **Test Comprehensively**: Verify heading navigation and screen reader support
5. **Document Changes**: Update this documentation for any modifications

## Future Enhancements

### Planned Features

- **Size Variants**: Semantic size props (small, medium, large)
- **Theme Integration**: Full CSS variable compliance
- **Enhanced Spacing**: WCAG 2.2 text spacing support
- **Motion Preferences**: Reduced motion animation support

### API Evolution

```astro
<!-- Future enhanced API -->
<Headline level="h1" size="large" highContrast={true} enhancedSpacing={true} theme="primary" />
```

## Examples Repository

For comprehensive examples and usage patterns, see:

- [Headline Examples](../../src/components/examples/HeadlineExamples.astro)
- [Document Structure Demo](../../src/pages/examples/document-structure.astro)
- [Accessibility Showcase](../../src/pages/examples/headline-accessibility.astro)
