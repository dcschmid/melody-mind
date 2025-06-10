# ButtonLink Component

## Overview

The ButtonLink component is a versatile and WCAG AAA 2.2 compliant interactive element that can
render either as a button or a link (anchor) with consistent styling. It serves as the foundation
for all clickable elements in the MelodyMind application, providing maximum accessibility and
performance optimization.

![ButtonLink Component Examples](../assets/buttonlink-examples.png)

## Features

- **WCAG AAA 2.2 Compliance**: 7:1 contrast ratios for all variants
- **Performance Optimized**: GPU acceleration and minimal repaints
- **Full Keyboard Navigation**: Complete keyboard support with proper focus management
- **Screen Reader Friendly**: Comprehensive ARIA attributes and semantic markup
- **High Contrast Mode Support**: Adapts to Windows High Contrast and forced colors mode
- **Reduced Motion Support**: Respects user's motion preferences
- **CSS Variables Only**: Zero hardcoded values - complete DRY optimization
- **Touch Optimized**: Minimum 44px touch targets for mobile accessibility
- **Internationalization**: Full i18n support with external link indicators
- **Icon Support**: Optional Astro Icon integration

## Properties

| Property  | Type                                            | Required | Description                                      | Default   |
| --------- | ----------------------------------------------- | -------- | ------------------------------------------------ | --------- |
| href      | string                                          | No       | URL for the link. If omitted, renders as button  | undefined |
| type      | "button" \| "submit" \| "reset"                 | No       | Button type attribute (only for button elements) | "button"  |
| disabled  | boolean                                         | No       | Whether the element is disabled                  | false     |
| ariaLabel | string                                          | No       | Accessible label for screen readers              | undefined |
| className | string                                          | No       | Additional CSS classes to apply                  | ""        |
| target    | "\_blank" \| "\_self" \| "\_parent" \| "\_top"  | No       | Target attribute for links                       | "\_self"  |
| rel       | string                                          | No       | Relationship attribute for links                 | undefined |
| variant   | "primary" \| "secondary" \| "outline" \| "text" | No       | Visual variant style (all WCAG AAA compliant)    | "primary" |
| size      | "sm" \| "md" \| "lg"                            | No       | Size with minimum touch targets                  | "md"      |
| style     | string                                          | No       | Inline styles using CSS variables                | undefined |
| icon      | string                                          | No       | Icon name for astro-icon (e.g., "mdi:home")      | undefined |

## Usage

### Basic Button

```astro
---
import ButtonLink from "@components/ButtonLink.astro";
---

<ButtonLink type="button" variant="primary" size="md"> Start Game </ButtonLink>
```

### Navigation Link

```astro
---
import ButtonLink from "@components/ButtonLink.astro";
---

<ButtonLink href="/game" variant="secondary"> Go to Game </ButtonLink>
```

### External Link with Icon

```astro
---
import ButtonLink from "@components/ButtonLink.astro";
---

<ButtonLink
  href="https://github.com/melodymind"
  target="_blank"
  variant="outline"
  icon="mdi:github"
  ariaLabel="Visit MelodyMind on GitHub"
>
  GitHub Repository
</ButtonLink>
```

### Icon-Only Button

```astro
---
import ButtonLink from "@components/ButtonLink.astro";
---

<ButtonLink type="button" variant="text" icon="mdi:close" ariaLabel="Close modal" size="sm" />
```

### Disabled State

```astro
---
import ButtonLink from "@components/ButtonLink.astro";
---

<ButtonLink
  type="submit"
  variant="primary"
  disabled={true}
  ariaLabel="Submit form (currently disabled)"
>
  Submit
</ButtonLink>
```

### Dynamic Styling with CSS Variables

```astro
---
import ButtonLink from "@components/ButtonLink.astro";

const customStyle = `
  background: var(--color-gradient-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
`;
---

<ButtonLink href="/premium" variant="primary" style={customStyle}> Upgrade to Premium </ButtonLink>
```

## TypeScript Interface

```typescript
interface Props {
  /** URL for the link. If omitted, a button element is rendered instead */
  href?: string;
  /** Button type attribute, only used when rendering as a button */
  type?: "button" | "submit" | "reset";
  /** Whether the button/link is disabled */
  disabled?: boolean;
  /** Accessible label for the button/link (important for screen readers) */
  ariaLabel?: string;
  /** Additional CSS classes to apply */
  className?: string;
  /** Target attribute for links */
  target?: "_blank" | "_self" | "_parent" | "_top";
  /** Relationship attribute for links */
  rel?: string;
  /** Visual variant style - all WCAG AAA compliant */
  variant?: "primary" | "secondary" | "outline" | "text";
  /** Size with minimum touch targets for accessibility */
  size?: "sm" | "md" | "lg";
  /** Inline style attribute for dynamic styling with CSS variables */
  style?: string;
  /** Optional icon name for astro-icon (e.g., "mdi:home", "heroicons:star") */
  icon?: string;
}
```

## Accessibility

### WCAG AAA 2.2 Compliance

The ButtonLink component meets the highest accessibility standards:

- **Color Contrast**: 7:1 ratio for normal text, 4.5:1 for large text
- **Focus Management**: 3px solid focus indicators with high contrast
- **Keyboard Navigation**: Full keyboard support with proper tab order
- **Screen Reader Support**: Comprehensive ARIA attributes and semantic markup
- **Touch Targets**: Minimum 44×44px for all interactive elements
- **Motion Sensitivity**: Respects `prefers-reduced-motion` preferences

### Screen Reader Features

- Automatic external link indicators with translated text
- Proper ARIA labels for icon-only buttons
- Disabled state communicated via `aria-disabled`
- Icon descriptions integrated with text content

### Keyboard Navigation

- **Tab**: Navigate to the button/link
- **Space/Enter**: Activate the element
- **Escape**: Remove focus (when appropriate)

### High Contrast Mode Support

The component automatically adapts to:

- Windows High Contrast mode
- Forced colors mode
- Custom user stylesheets

## Internationalization

### Supported Languages

The component supports all MelodyMind languages through the i18n system:

```typescript
// Translation keys used by ButtonLink
const i18nKeys = {
  "nav.openNewWindow": "Opens in new window", // External link indicator
};
```

### External Link Handling

For external links (`target="_blank"`), the component automatically:

- Adds `noopener noreferrer` to the `rel` attribute for security
- Provides translated screen reader text indicating the link opens in a new window
- Includes visual indicators for external links

### Usage with Different Languages

```astro
---
import ButtonLink from "@components/ButtonLink.astro";
// Language is automatically detected from URL
---

<!-- English: "Visit GitHub (Opens in new window)" --><!-- German: "GitHub besuchen (Öffnet in neuem Fenster)" --><!-- Spanish: "Visitar GitHub (Se abre en nueva ventana)" -->
<ButtonLink href="https://github.com" target="_blank" ariaLabel="Visit GitHub"> GitHub </ButtonLink>
```

## Styling

### CSS Variables Usage

The component exclusively uses CSS variables from `global.css`:

```css
/* Color variants */
--btn-primary-bg, --btn-primary-hover, --btn-primary-text
--btn-secondary-bg, --btn-secondary-hover, --btn-secondary-text
--btn-outline-bg, --btn-outline-hover, --btn-outline-text
--btn-text-bg, --btn-text-hover, --btn-text-text

/* Sizing */
--space-sm, --space-md, --space-lg
--text-sm, --text-base, --text-lg
--radius-sm, --radius-md, --radius-lg

/* Focus and interaction */
--focus-ring, --focus-outline
--transition-fast, --transition-normal
```

### BEM Methodology

The component follows BEM (Block-Element-Modifier) naming conventions:

```css
.button-link              /* Block */
.button-link__icon        /* Element */
.button-link--primary     /* Modifier */
.button-link--disabled    /* Modifier */
.button-link--sm          /* Modifier */
```

### Custom Styling

For dynamic styles, always use CSS variables:

```astro
---
const customStyle = `
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
`;
---

<ButtonLink style={customStyle}>Custom Button</ButtonLink>
```

## Performance Considerations

### Optimizations

- **GPU Acceleration**: Uses `transform` and `opacity` for animations
- **Minimal Repaints**: Efficient CSS properties for state changes
- **Tree Shaking**: Only loads required Astro Icon components
- **Zero JavaScript**: Pure CSS/HTML implementation
- **Preload Hints**: Automatic for critical navigation links

### Bundle Impact

- **CSS**: ~2KB (compressed)
- **JavaScript**: 0KB (server-side only)
- **Icons**: Loaded on-demand via Astro Icon

## Browser Support

### Modern Browsers (Fully Supported)

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Legacy Support

- Graceful degradation for older browsers
- Fallback styles for unsupported CSS features
- Progressive enhancement approach

## Implementation Notes

### Security

- Automatic `noopener noreferrer` for external links
- XSS protection through proper HTML escaping
- CSRF protection for form submissions

### SEO Considerations

- Proper semantic markup for search engines
- Meaningful link text for crawlers
- Structured data compatibility

### Performance Best Practices

- Minimal DOM manipulation
- Efficient CSS selectors
- Optimized for Critical Rendering Path
- Lazy loading for non-critical icons

## Related Components

- [Icon](./Icon.md) - Icon component for visual elements
- [Form](./Form.md) - Form components using ButtonLink for submissions
- [Navigation](./Navigation.md) - Navigation components built with ButtonLink
- [Modal](./Modal.md) - Modal components using ButtonLink for actions

## Troubleshooting

### Common Issues

#### External Link Not Working

```astro
<!-- ❌ Wrong -->
<ButtonLink href="https://example.com">External Link</ButtonLink>

<!-- ✅ Correct -->
<ButtonLink href="https://example.com" target="_blank">External Link</ButtonLink>
```

#### Icon Not Displaying

```astro
<!-- ❌ Wrong -->
<ButtonLink icon="home">Home</ButtonLink>

<!-- ✅ Correct -->
<ButtonLink icon="mdi:home">Home</ButtonLink>
```

#### Accessibility Issues

```astro
<!-- ❌ Wrong -->
<ButtonLink icon="mdi:close" />

<!-- ✅ Correct -->
<ButtonLink icon="mdi:close" ariaLabel="Close dialog" />
```

### Debugging

Enable debugging in development:

```astro
---
// Add to frontmatter for debugging
if (import.meta.env.DEV) {
  console.log("ButtonLink props:", Astro.props);
}
---
```

## Migration Guide

### From v2.x to v3.x

#### Breaking Changes

1. **CSS Variables**: All hardcoded values removed
2. **Icon Integration**: Now uses Astro Icon instead of custom icons
3. **Accessibility**: Enhanced ARIA support requires updated markup

#### Migration Steps

```astro
<!-- v2.x -->
<ButtonLink color="#6366f1" icon="close.svg">Close</ButtonLink>

<!-- v3.x -->
<ButtonLink variant="primary" icon="mdi:close" ariaLabel="Close">Close</ButtonLink>
```

## Changelog

- **v3.2.0** - Added reduced motion support and forced colors compatibility
- **v3.1.0** - Enhanced external link handling with security improvements
- **v3.0.0** - Complete WCAG AAA 2.2 compliance and CSS variables migration
- **v2.5.0** - Added icon support and size variants
- **v2.0.0** - Redesigned with Astro components and TypeScript support
- **v1.0.0** - Initial release with basic button/link functionality

## Contributing

When contributing to the ButtonLink component:

1. Maintain WCAG AAA 2.2 compliance
2. Use only CSS variables from `global.css`
3. Add comprehensive JSDoc comments
4. Include accessibility testing
5. Update this documentation for any changes
6. Follow the established TypeScript patterns

## License

This component is part of the MelodyMind project and follows the project's licensing terms.
