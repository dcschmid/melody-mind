# Headline Component

## Overview

The Headline component is a versatile and accessible heading component that supports different
heading levels (h1-h6), custom styling, and proper semantic hierarchy. It follows WCAG AAA
accessibility standards and performance best practices for the MelodyMind project.

![Headline Component Example](../../public/docs/headline-component.png)

## Features

- **Semantic HTML**: Proper heading hierarchy with h1-h6 support
- **WCAG AAA Compliance**: Meets highest accessibility standards
- **Responsive Typography**: Optimized for all screen sizes
- **Interactive States**: Supports clickable headlines with proper focus management
- **Skip Navigation**: Built-in support for skip-to-content functionality
- **Multiple Variants**: Different sizes and styling options
- **High Contrast Support**: Works with system accessibility preferences
- **Reduced Motion Support**: Respects user motion preferences
- **Enhanced Text Spacing**: Supports WCAG 2.2 text spacing requirements
- **Gradient Text Support**: Primary variant with animated gradient effects

## Properties

| Property        | Type                                                  | Required | Description                                           | Default  |
| --------------- | ----------------------------------------------------- | -------- | ----------------------------------------------------- | -------- |
| title           | string                                                | No       | Text content of the heading (can use slot instead)    | -        |
| level           | "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"          | No       | HTML heading level for proper document hierarchy      | "h1"     |
| className       | string                                                | No       | Additional CSS classes to apply                       | ""       |
| id              | string                                                | No       | Optional ID for direct linking and document structure | -        |
| focusable       | boolean                                               | No       | Makes heading programmatically focusable              | false    |
| ariaLabel       | string                                                | No       | Optional ARIA label for improved screen reader        | -        |
| ariaDescribedBy | string                                                | No       | ARIA describedby for additional context               | -        |
| wrapper         | "section" \| "header" \| "article" \| "div" \| "none" | No       | Semantic wrapper element                              | "none"   |
| variant         | "small" \| "medium" \| "large" \| "primary"           | No       | Size variant for consistent typography scale          | "medium" |
| textAlign       | "left" \| "center" \| "right"                         | No       | Text alignment option                                 | "left"   |
| skipTarget      | boolean                                               | No       | Indicates this heading is a skip navigation target    | false    |
| interactive     | boolean                                               | No       | Makes the heading clickable with button semantics     | false    |
| onClick         | string                                                | No       | Click handler for interactive headlines               | -        |

## Usage Examples

### Basic Usage

```astro
---
import Headline from "../components/Headline.astro";
---

<Headline level="h1" title="Welcome to MelodyMind" />
```

### With Slot Content

```astro
---
import Headline from "../components/Headline.astro";
---

<Headline level="h2" variant="primary">
  Your <em>Musical</em> Journey Starts Here
</Headline>
```

### Interactive Headline

```astro
---
import Headline from "../components/Headline.astro";
---

<Headline
  level="h2"
  title="Start Game"
  interactive={true}
  focusable={true}
  onClick="startNewGame()"
  variant="primary"
/>
```

### Skip Navigation Target

```astro
---
import Headline from "../components/Headline.astro";
---

<Headline level="h1" id="main-content" title="Main Content" skipTarget={true} wrapper="header" />
```

### Different Variants

```astro
---
import Headline from "../components/Headline.astro";
---

<!-- Small variant -->
<Headline level="h3" variant="small" title="Game Statistics" />

<!-- Medium variant (default) -->
<Headline level="h2" variant="medium" title="Choose Category" />

<!-- Large variant -->
<Headline level="h1" variant="large" title="MelodyMind Trivia" />

<!-- Primary variant with gradient -->
<Headline level="h1" variant="primary" title="Welcome Player!" />
```

### Advanced Accessibility Features

```astro
---
import Headline from "../components/Headline.astro";
---

<!-- Full accessibility example -->
<Headline
  level="h2"
  id="quiz-section"
  title="Music Quiz Section"
  ariaLabel="Interactive music quiz with 20 questions"
  ariaDescribedBy="quiz-description"
  focusable={true}
  skipTarget={true}
  wrapper="section"
/>
```

## Variants

### Size Variants

- **Small**: Responsive typography from 18px to 32px
- **Medium**: Default size, responsive from 24px to 36px
- **Large**: Large headings, responsive from 30px to 45px
- **Primary**: Special variant with gradient styling and animations

### Accessibility Features

- **Focus Management**: Programmatic focus support with `-1` tabindex
- **Skip Navigation**: Built-in target highlighting for skip links
- **Screen Reader**: Proper ARIA labeling and semantic structure
- **High Contrast**: Adapts to system contrast preferences
- **Reduced Motion**: Disables animations for motion-sensitive users

## Styling

The component uses CSS custom properties from the global design system:

### Typography Variables Used

```css
/* Font sizes */
--text-lg, --text-xl, --text-2xl, --text-3xl, --text-4xl

/* Font weights */
--font-medium, --font-semibold, --font-bold

/* Line heights */
--leading-tight, --leading-normal

/* Letter spacing */
--letter-spacing-base, --letter-spacing-enhanced
```

### Color Variables Used

```css
/* Text colors */
--text-primary

/* Interactive colors */
--interactive-primary

/* Focus styles */
--focus-outline, --focus-ring, --focus-bg-overlay

/* Gradient colors */
--color-primary-500, --color-secondary-500
```

### Spacing Variables Used

```css
--space-xs, --space-sm, --space-md, --space-lg, --space-xl
```

## Accessibility

### WCAG AAA Compliance

- **Color Contrast**: Maintains 7:1 ratio for normal text, 4.5:1 for large text
- **Focus Indicators**: Clear, 3px outline with sufficient contrast
- **Keyboard Navigation**: Full keyboard accessibility with proper focus management
- **Screen Readers**: Semantic HTML with proper ARIA attributes
- **Text Spacing**: Supports enhanced text spacing up to 200% letter spacing
- **Touch Targets**: Minimum 44×44px touch targets for interactive elements

### Implementation Notes

#### Performance Optimizations

- Uses CSS custom properties for consistent theming
- Implements efficient CSS animations with `will-change`
- Supports CSS `contain` for better rendering performance
- Uses `text-wrap: balance` for improved typography

#### Browser Support

- Modern browsers with CSS Grid and custom properties support
- Graceful fallbacks for `background-clip: text`
- High contrast mode support
- Forced colors mode compatibility

#### Responsive Behavior

The component uses mobile-first responsive design:

```css
/* Base: Mobile (320px+) */
font-size: var(--text-2xl);

/* Tablet (768px+) */
@media (min-width: var(--breakpoint-md)) {
  font-size: var(--text-3xl);
}

/* Desktop (1024px+) */
@media (min-width: var(--breakpoint-lg)) {
  font-size: var(--text-4xl);
}
```

## Advanced Usage

### With TypeScript Interface

```typescript
// Component props with full typing
interface HeadlineProps {
  title?: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: "small" | "medium" | "large" | "primary";
  interactive?: boolean;
  skipTarget?: boolean;
  // ... other props
}
```

### Integration with Game Components

```astro
---
import Headline from "../components/Headline.astro";
import ScoreDisplay from "../components/Game/ScoreDisplay.astro";
---

<section class="game-header">
  <Headline level="h1" variant="primary" title="MelodyMind Quiz" id="game-title" wrapper="header" />

  <ScoreDisplay currentScore={score} />
</section>
```

## Related Components

- [Navigation](./Navigation.md) - Main site navigation with skip links
- [Modal](./Modal.md) - Modal dialogs with proper heading hierarchy
- [GameCard](./GameCard.md) - Game cards with headline elements
- [ScoreDisplay](./ScoreDisplay.md) - Score components with heading structure

## Testing

### Accessibility Testing

```bash
# Run accessibility tests
npm run test:a11y

# Test with screen readers
npm run test:screenreader

# Validate heading hierarchy
npm run test:headings
```

### Manual Testing Checklist

- [ ] Proper heading hierarchy (h1 → h2 → h3, etc.)
- [ ] Keyboard navigation works correctly
- [ ] Focus indicators are visible and high contrast
- [ ] Screen reader announces content properly
- [ ] Skip navigation targets work correctly
- [ ] Reduced motion preferences are respected
- [ ] High contrast mode displays correctly

## Changelog

### v3.2.0 - Latest

- Added enhanced text spacing support (WCAG 2.2)
- Improved gradient fallbacks for better browser support
- Added forced colors mode compatibility
- Enhanced focus management for interactive headlines
- Added wrapper element support for semantic structure

### v3.1.0

- Added skip navigation target functionality
- Improved responsive typography scaling
- Enhanced ARIA attribute support
- Added interactive headline functionality

### v3.0.0

- Complete rewrite with WCAG AAA compliance
- Added variant system for consistent typography
- Implemented CSS custom properties integration
- Enhanced focus management and keyboard navigation
- Added comprehensive TypeScript prop definitions

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
