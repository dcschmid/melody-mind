# Footer Component

## Overview

The Footer component is a comprehensive site-wide footer that provides copyright information,
external links to the GitHub repository, and donation options. It serves as the primary navigation
area for external resources and legal information across all pages of the MelodyMind application.

![Footer Component](../assets/footer-component.png)

The component implements WCAG AAA accessibility standards, full internationalization support, and
performance optimizations for optimal user experience across all devices and assistive technologies.

## Properties

The Footer component is a standalone component with no external props. All configuration is handled
internally through:

| Configuration      | Type                | Description                                 | Source                      |
| ------------------ | ------------------- | ------------------------------------------- | --------------------------- |
| Language Detection | `string`            | Automatically detects current page language | `getLangFromUrl(Astro.url)` |
| Translations       | `Function`          | Localized strings for UI text               | `useTranslations(lang)`     |
| Link Configuration | `Array<LinkConfig>` | External links and donation options         | Internal configuration      |
| Dynamic Year       | `number`            | Current year for copyright notice           | `new Date().getFullYear()`  |

### Link Configuration Interface

```typescript
interface LinkConfig {
  href: string; // External URL
  icon: string; // Icon name from astro-icon
  label: string; // Display text
  ariaLabel: string; // Accessibility label (localized)
}
```

## Usage

### Basic Implementation

```astro
---
import Footer from "@components/Footer.astro";
---

<Footer />
```

### Layout Integration

```astro
---
// src/layouts/BaseLayout.astro
import Footer from "@components/Footer.astro";
---

<html lang={lang}>
  <body>
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### Page-Specific Implementation

```astro
---
// src/pages/[lang]/game.astro
import Layout from "@layouts/Layout.astro";
import Footer from "@components/Footer.astro";
---

<Layout title="Game">
  <!-- Page content -->
  <Footer />
</Layout>
```

## Features

### Internationalization Support

The Footer component supports all MelodyMind languages:

```typescript
// Supported languages and their translation keys
const supportedLanguages = ["en", "de", "es", "fr", "it", "pt"];

// Translation keys used by the component
const translationKeys = {
  "footer.rights": "All rights reserved",
  "footer.source_code": "View source code on GitHub",
  "footer.donate": "Support via PayPal",
  "footer.donate_aria": "Support the project with a PayPal donation",
  "footer.support_kofi": "Support via Ko-fi",
};
```

### Link Configuration

```typescript
// External links with full accessibility support
const externalLinks = [
  {
    type: "repository",
    href: "https://github.com/dcschmid/melody-mind",
    icon: "github",
    security: "noopener noreferrer",
  },
  {
    type: "donation",
    href: "https://www.paypal.me/dcschmid",
    icon: "paypal",
    security: "noopener noreferrer",
  },
  {
    type: "support",
    href: "https://www.buymeacoffee.com/dcschmid",
    icon: "kofi",
    security: "noopener noreferrer",
  },
];
```

## Accessibility Features

### WCAG AAA Compliance

The Footer component exceeds WCAG AAA standards:

- **Color Contrast**: 7:1 ratio for all text elements
- **Touch Targets**: Minimum 44×44px for all interactive elements
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: Semantic HTML with proper ARIA attributes
- **Motion Sensitivity**: Respects `prefers-reduced-motion` preference

### Accessibility Implementation

```html
<!-- Semantic structure with proper roles -->
<footer class="footer" role="contentinfo" aria-label="Site footer">
  <!-- Copyright information -->
  <div class="footer-copyright">&copy; 2025 MelodyMind - All rights reserved</div>

  <!-- Navigation with grouped links -->
  <nav aria-label="Footer links" class="footer-nav">
    <!-- Individual links with descriptive labels -->
    <a href="..." aria-label="View source code on GitHub (opens in a new tab)">
      <Icon name="github" aria-hidden="true" focusable="false" />
      <span>GitHub</span>
      <span class="sr-only">(opens in a new tab)</span>
    </a>

    <!-- Donation links grouped for clarity -->
    <div class="footer-donations" role="group" aria-label="Donation options">
      <!-- Additional donation links -->
    </div>
  </nav>
</footer>
```

### Focus Management

```css
/* Focus indicators exceed WCAG AAA requirements */
.footer-link:focus-visible {
  outline: var(--focus-outline); /* 3px solid */
  outline-offset: var(--focus-ring-offset); /* 2px offset */
  box-shadow: var(--focus-ring); /* Additional ring */
  background-color: var(--bg-tertiary); /* Background highlight */
}
```

## Performance Optimizations

### CSS Performance

```css
/* CSS containment for layout isolation */
.footer-link {
  contain: layout style; /* Isolates layout calculations */
  will-change: transform, background-color; /* GPU acceleration hint */
}

/* Responsive design with minimal reflow */
@media (min-width: 768px) {
  .footer-content {
    flex-direction: row; /* Single layout change */
  }
}
```

### JavaScript Performance

```javascript
// Passive event listeners for improved scroll performance
link.addEventListener("touchstart", () => {}, { passive: true });
link.addEventListener("touchend", () => {}, { passive: true });

// Dynamic will-change optimization
link.addEventListener("mouseenter", () => {
  link.style.willChange = "transform, background-color";
});

link.addEventListener("mouseleave", () => {
  link.style.willChange = "auto"; // Release GPU resources
});
```

### Core Web Vitals Impact

- **Largest Contentful Paint (LCP)**: Minimal impact through efficient CSS
- **First Input Delay (FID)**: Optimized with passive event listeners
- **Cumulative Layout Shift (CLS)**: Stable layout with CSS containment

## Responsive Design

### Breakpoint Behavior

| Screen Size        | Layout | Navigation Alignment | Touch Targets         |
| ------------------ | ------ | -------------------- | --------------------- |
| Mobile (< 768px)   | Column | Centered             | 44×44px minimum       |
| Tablet (≥ 768px)   | Row    | Right-aligned        | 44×44px minimum       |
| Desktop (≥ 1024px) | Row    | Right-aligned        | Enhanced hover states |

### Implementation

```css
/* Mobile-first approach */
.footer-content {
  display: flex;
  flex-direction: column; /* Stack vertically on mobile */
  align-items: center;
  gap: var(--space-lg);
}

/* Tablet and desktop enhancement */
@media (min-width: 768px) {
  .footer-content {
    flex-direction: row; /* Horizontal layout */
    justify-content: space-between; /* Copyright left, links right */
  }

  .footer-nav {
    justify-content: flex-end; /* Right-align navigation */
  }
}
```

## Styling Architecture

### CSS Variables Usage

```css
/* All styling uses global CSS variables */
.footer {
  margin-top: var(--space-3xl); /* 64px consistent spacing */
  border-top: var(--border-width-thin) solid var(--border-primary);
  padding: var(--space-xl) 0; /* 32px vertical padding */
}

.footer-link {
  color: var(--text-tertiary); /* WCAG AAA compliant color */
  font-size: var(--text-sm); /* 14px consistent typography */
  border-radius: var(--radius-md); /* 8px consistent borders */
  min-height: var(--min-touch-size); /* 44px touch targets */
}
```

### Color System

```css
/* Theme colors with WCAG AAA compliance */
:root {
  --text-primary: hsl(210, 40%, 95%); /* 7:1 contrast ratio */
  --text-secondary: hsl(210, 40%, 85%); /* 7:1 contrast ratio */
  --text-tertiary: hsl(210, 40%, 75%); /* 7:1 contrast ratio */
  --interactive-primary: hsl(270, 80%, 70%); /* Purple with sufficient contrast */
  --bg-tertiary: hsl(210, 40%, 15%); /* Hover background */
}
```

## Internationalization

### Supported Languages

```typescript
interface SupportedLanguages {
  en: "English";
  de: "Deutsch";
  es: "Español";
  fr: "Français";
  it: "Italiano";
  pt: "Português";
}
```

### Translation Keys

```json
{
  "footer": {
    "rights": "All rights reserved",
    "source_code": "View source code on GitHub",
    "donate": "Support via PayPal",
    "donate_aria": "Support the project with a PayPal donation (opens in a new tab)",
    "support_kofi": "Support via Ko-fi (opens in a new tab)"
  }
}
```

### Dynamic Language Detection

```typescript
// Automatic language detection from URL
const lang = getLangFromUrl(Astro.url); // e.g., 'de' from '/de/game'
const t = useTranslations(String(lang)); // Load appropriate translations
```

## Testing Considerations

### Accessibility Testing

```bash
# Automated accessibility testing
npm run test:a11y

# Manual testing checklist
- [ ] Screen reader navigation (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation
- [ ] High contrast mode compatibility
- [ ] Touch device testing (minimum 44px targets)
- [ ] Color blindness simulation
```

### Cross-Browser Testing

```bash
# Supported browsers for footer functionality
- Chrome 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- Edge 90+ ✓
- Mobile browsers ✓
```

### Performance Testing

```bash
# Core Web Vitals testing
npm run test:performance

# Lighthouse audit targets
- Performance: 95+ ✓
- Accessibility: 100 ✓
- Best Practices: 100 ✓
- SEO: 100 ✓
```

## Related Components

- [Header](./Header.md) - Main site navigation
- [Layout](../layouts/Layout.md) - Page layout wrapper
- [Icon](./shared/Icon.md) - Icon system implementation

## Related Utilities

- [i18n.ts](../utils/i18n.md) - Internationalization utilities
- [seo.ts](../utils/seo.md) - SEO helper functions
- [global.css](../styles/global.md) - CSS variables and design tokens

## API Reference

### Dependencies

```typescript
import { useTranslations, getLangFromUrl } from "@utils/i18n";
import { Icon } from "astro-icon/components";
```

### CSS Classes

| Class Name          | Purpose                 | Modifiers                             |
| ------------------- | ----------------------- | ------------------------------------- |
| `.footer`           | Main footer container   | None                                  |
| `.footer-container` | Responsive wrapper      | None                                  |
| `.footer-content`   | Content layout          | None                                  |
| `.footer-copyright` | Copyright text          | None                                  |
| `.footer-nav`       | Navigation container    | None                                  |
| `.footer-donations` | Donation links group    | None                                  |
| `.footer-link`      | Individual link styling | `:hover`, `:focus-visible`, `:active` |

### CSS Custom Properties

```css
/* Available CSS variables for customization */
--footer-bg: var(--bg-primary);
--footer-border: var(--border-primary);
--footer-text: var(--text-tertiary);
--footer-link-hover: var(--interactive-primary);
--footer-spacing: var(--space-xl);
```

## Changelog

### Version 3.0.0 (Current)

- ✅ Enhanced JSDoc documentation with comprehensive examples
- ✅ WCAG AAA compliance implementation
- ✅ Performance optimizations with CSS containment
- ✅ Improved keyboard navigation and focus management
- ✅ Added support for reduced motion and high contrast modes

### Version 2.5.0

- ✅ Added Ko-fi donation link
- ✅ Implemented responsive design improvements
- ✅ Enhanced touch target sizing for mobile devices

### Version 2.0.0

- ✅ Complete redesign with CSS variables
- ✅ Full internationalization support
- ✅ Accessibility improvements for WCAG AA compliance

### Version 1.0.0

- ✅ Initial footer implementation
- ✅ Basic copyright and GitHub link functionality

## Migration Notes

### From Version 2.x to 3.0

No breaking changes. The component maintains full backward compatibility while adding enhanced
accessibility and performance features.

### CSS Variable Migration

If you have custom styling, update hardcoded values to use CSS variables:

```css
/* Before (v2.x) */
.custom-footer {
  color: #9ca3af;
  padding: 32px;
}

/* After (v3.0) */
.custom-footer {
  color: var(--text-tertiary);
  padding: var(--space-xl);
}
```

## Contributing

When modifying the Footer component:

1. **Maintain WCAG AAA compliance** - Test with screen readers and automated tools
2. **Use CSS variables exclusively** - Never hardcode design tokens
3. **Update translations** - Add new keys to all language files
4. **Test performance impact** - Ensure Core Web Vitals remain optimal
5. **Document changes** - Update this documentation and JSDoc comments

### Code Standards

```typescript
// Always use TypeScript for type safety
interface FooterLink {
  href: string;
  icon: string;
  label: string;
  ariaLabel: string;
}

// Use semantic HTML with proper ARIA attributes
<nav aria-label="Footer links" class="footer-nav">

// Implement CSS with root variables only
.footer-link {
  color: var(--text-tertiary);
  padding: var(--space-sm) var(--space-md);
}
```
