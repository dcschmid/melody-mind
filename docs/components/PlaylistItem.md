# PlaylistItem Component - Comprehensive Documentation

## Overview

The `PlaylistItem` component is a fully accessible, interactive card component that displays individual music playlists/categories in the MelodyMind application. It serves as a gateway for users to enter specific music trivia game modes, featuring a sophisticated design with hover animations, disabled state handling, and comprehensive screen reader support.

![PlaylistItem Component Screenshot](../public/docs/playlist-item-preview.png)

## Table of Contents

- [Properties](#properties)
- [Usage Examples](#usage-examples)
- [Accessibility Features](#accessibility-features)
- [Internationalization](#internationalization)
- [CSS Architecture](#css-architecture)
- [Performance Optimizations](#performance-optimizations)
- [Browser Support](#browser-support)
- [Implementation Notes](#implementation-notes)
- [Related Components](#related-components)
- [Changelog](#changelog)

## Properties

| Property      | Type      | Required | Description                                              | Default     |
| ------------- | --------- | -------- | -------------------------------------------------------- | ----------- |
| `headline`    | `string`  | **Yes**  | Main title text displayed prominently on the card       | `""`        |
| `subheadline` | `string`  | No       | Optional secondary text shown below the main headline    | `""`        |
| `image`       | `string`  | **Yes**  | Path to the background image representing the playlist   | -           |
| `imageAlt`    | `string`  | **Yes**  | Accessibility description for the background image       | `""`        |
| `isDisabled`  | `boolean` | No       | Whether the item is disabled (shows "coming soon" state) | `false`     |
| `href`        | `string`  | No       | Navigation URL when the item is clicked                  | `"#"`       |
| `id`          | `string`  | No       | Unique identifier for ARIA references                   | *Generated* |

### Type Definitions

```typescript
interface Props {
  /** Title text displayed as the main heading */
  headline: string;
  /** Optional secondary text displayed below the headline */
  subheadline?: string;
  /** Path to the image representing this playlist/category */
  image: string;
  /** Whether this item is disabled/unavailable (shows "coming soon" overlay) */
  isDisabled?: boolean;
  /** Alternative text description for the image (for accessibility) */
  imageAlt: string;
  /** URL for navigation when the item is clicked (required for semantic navigation) */
  href?: string;
  /** Optional ID for ARIA references */
  id?: string;
}
```

## Usage Examples

### Basic Implementation

```astro
---
import PlaylistItem from "@components/PlaylistItem.astro";
import rockPlaylistImage from "@assets/images/rock-playlist.jpg";
---

<PlaylistItem
  headline="Rock Music Trivia"
  subheadline="Test your knowledge of rock legends"
  image={rockPlaylistImage}
  imageAlt="Electric guitar with rock concert stage in background"
  href="/en/game-rock/medium"
/>
```

### Disabled State (Coming Soon)

```astro
---
import PlaylistItem from "@components/PlaylistItem.astro";
import jazzPlaylistImage from "@assets/images/jazz-playlist.jpg";
---

<PlaylistItem
  headline="Jazz Classics"
  subheadline="From bebop to smooth jazz"
  image={jazzPlaylistImage}
  imageAlt="Jazz saxophone with musical notes background"
  isDisabled={true}
/>
```

### Grid Layout Implementation

```astro
---
import PlaylistItem from "@components/PlaylistItem.astro";

const playlists = [
  {
    headline: "Pop Hits",
    subheadline: "Chart-toppers from the last decade",
    image: "/images/pop-hits.jpg",
    imageAlt: "Colorful pop music stage with dancing crowd",
    href: "/en/game-pop/easy"
  },
  {
    headline: "Classical Masters",
    subheadline: "Orchestral masterpieces through the ages",
    image: "/images/classical.jpg",
    imageAlt: "Symphony orchestra performance in elegant concert hall",
    href: "/en/game-classical/hard"
  }
];
---

<div class="playlist-grid">
  {playlists.map((playlist) => (
    <PlaylistItem
      headline={playlist.headline}
      subheadline={playlist.subheadline}
      image={playlist.image}
      imageAlt={playlist.imageAlt}
      href={playlist.href}
    />
  ))}
</div>

<style>
  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--playlist-item-min-width, 300px), 1fr));
    gap: var(--space-lg);
    padding: var(--space-lg);
  }
</style>
```

## Accessibility Features

### WCAG AAA Compliance

The component meets **WCAG AAA 2.2** standards with the following features:

#### Visual Accessibility
- **Color Contrast**: 7:1 minimum contrast ratio for all text elements
- **Focus Indicators**: Enhanced 3px solid outlines with proper offset
- **Touch Targets**: Minimum 44×44px interactive areas for mobile devices
- **High Contrast Mode**: Full support for Windows High Contrast themes

#### Screen Reader Support
- **Semantic HTML**: Uses appropriate `<article>` for disabled items and `<a>` for interactive links
- **ARIA Labels**: Comprehensive labeling with `aria-labelledby` and `aria-describedby`
- **Live Announcements**: Status changes announced via `aria-live="polite"`
- **Context Information**: Clear indication of disabled state for assistive technologies

#### Keyboard Navigation
- **Focus Management**: Logical tab order with disabled items excluded from tab sequence
- **Visual Feedback**: Clear focus indicators that meet accessibility standards
- **Status Announcements**: Screen reader notifications for state changes

### Accessibility Code Examples

```astro
<!-- The component automatically generates appropriate ARIA attributes -->
<PlaylistItem
  headline="Electronic Music"
  subheadline="Synthesized beats and digital soundscapes"
  image="/images/electronic.jpg"
  imageAlt="DJ mixing console with colorful electronic music visualization"
  href="/en/game-electronic/medium"
/>

<!-- Results in accessible HTML structure: -->
<a 
  class="playlist-item playlist-item--interactive"
  role="link"
  aria-labelledby="playlist-title-abc123"
  aria-describedby="playlist-desc-abc123"
  href="/en/game-electronic/medium"
  tabindex="0"
>
  <h2 id="playlist-title-abc123" class="playlist-headline">
    Electronic Music
  </h2>
  <div id="playlist-desc-abc123" class="subheadline-container">
    <p class="playlist-subheadline">
      Synthesized beats and digital soundscapes
    </p>
  </div>
</a>
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .playlist-item,
  .playlist-image,
  .image-overlay,
  .bottom-accent {
    transition: none !important;
    transform: none !important;
    animation: none !important;
  }
}
```

## Internationalization

The component integrates seamlessly with the MelodyMind i18n system, supporting all 10 languages:

### Supported Languages
- **German** (de) - Deutsch
- **English** (en) - English  
- **Spanish** (es) - Español
- **French** (fr) - Français
- **Italian** (it) - Italiano
- **Portuguese** (pt) - Português
- **Danish** (da) - Dansk
- **Dutch** (nl) - Nederlands
- **Swedish** (sv) - Svenska
- **Finnish** (fi) - Suomi

### Translation Keys Used

```typescript
// Server-side translations (automatically applied)
const t = useTranslations(lang);

// Status and accessibility labels
"playlist.item.coming.soon"           // "Coming Soon" badge text
"category.play"                       // "Play" button text
"playlist.item.unavailable"           // ARIA label for disabled state
"playlist.item.status"                // Status announcement prefix

// Screen reader announcements
"playlist.item.status.changed.disabled"   // Disabled state announcement
"playlist.item.status.changed.available"  // Available state announcement
```

### Implementation Example

```astro
---
import { getLangFromUrl, useTranslations } from "@utils/i18n";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

// Localized content automatically applied
const statusText = isDisabled ? t("playlist.item.coming.soon") : t("category.play");
const ariaLabel = isDisabled ? t("playlist.item.unavailable") : undefined;
---

<PlaylistItem
  headline="Rock Music Trivia"
  subheadline="Test your knowledge of rock legends"
  image="/images/rock.jpg"
  imageAlt={t("playlist.item.alt.rock")} 
  isDisabled={false}
/>
```

## CSS Architecture

The component uses **100% CSS custom properties** from the global design system, ensuring consistency and maintainability.

### Design System Integration

#### Color Variables
```css
/* Semantic colors from global.css */
--color-primary-700         /* Primary border color */
--color-primary-500         /* Hover border color */
--color-neutral-800         /* Card background start */
--color-neutral-900         /* Card background end */
--text-primary              /* Main text color */
--bg-tertiary               /* Badge background */
--border-secondary          /* Badge border */
```

#### Spacing and Layout
```css
/* Consistent spacing system */
--space-xs, --space-sm      /* Small spacing increments */
--space-md, --space-lg      /* Standard spacing values */
--space-xl, --space-2xl     /* Large spacing values */

/* Layout variables */
--radius-xl                 /* Border radius for cards */
--radius-full               /* Circular elements */
--shadow-lg, --shadow-xl    /* Box shadow variations */
```

#### Typography System
```css
/* Responsive font scales */
--text-xs                   /* Badge text size */
--text-sm                   /* Supporting text */
--text-base                 /* Body text */
--text-lg                   /* Headline text */

/* Typography enhancement */
--font-medium               /* Badge font weight */
--font-semibold             /* Headline font weight */
--leading-enhanced          /* Improved line height */
--letter-spacing-enhanced   /* WCAG AAA letter spacing */
```

### Component Structure

```css
/* Base component with semantic variables */
.playlist-item {
  background: linear-gradient(
    to bottom, 
    var(--color-neutral-800), 
    var(--color-neutral-900)
  );
  border: var(--border-width-thick) solid var(--color-primary-700);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  transition: 
    border-color var(--transition-normal),
    box-shadow var(--transition-normal),
    transform var(--transition-normal);
}

/* Interactive states using design tokens */
.playlist-item--interactive:hover {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-xl);
  transform: translateY(calc(-1 * var(--space-xs)));
}

/* Focus management with enhanced accessibility */
.playlist-item--interactive:focus-visible {
  outline: var(--focus-enhanced-outline-dark);
  outline-offset: var(--focus-ring-offset);
  box-shadow: var(--focus-enhanced-shadow);
}
```

### Performance Optimizations

#### GPU Acceleration
```css
.playlist-item {
  /* Performance optimizations */
  contain: layout style;
  will-change: transform;
  transform: translateZ(0); /* GPU acceleration */
}
```

#### Efficient Transitions
```css
/* Specific property transitions (not 'all') */
.playlist-item {
  transition:
    border-color var(--transition-normal),
    box-shadow var(--transition-normal),
    transform var(--transition-normal);
}
```

## Performance Optimizations

### Image Optimization
- **Modern Formats**: Automatic WebP and AVIF generation
- **Responsive Loading**: Lazy loading with appropriate `fetchpriority`
- **Aspect Ratio**: Fixed 16:9 ratio prevents layout shift
- **Quality Optimization**: 85% quality balance for size vs. quality

```astro
<Picture
  class:list={["playlist-image", { "playlist-image--disabled": isDisabled }]}
  src={image}
  width={320}
  height={180}
  formats={["avif", "webp"]}
  alt={imageAlt}
  loading="lazy"
  decoding="async"
  fetchpriority={isDisabled ? "low" : "auto"}
  quality={85}
/>
```

### CSS Performance
- **CSS Containment**: `contain: layout style` for improved rendering
- **Hardware Acceleration**: `transform: translateZ(0)` for smooth animations
- **Efficient Selectors**: BEM methodology prevents deep nesting
- **Optimized Animations**: Specific property transitions instead of `all`

### Memory Management
- **Unique IDs**: `crypto.randomUUID()` prevents conflicts without memory leaks
- **Event Cleanup**: Automatic cleanup of transition event listeners
- **Conditional Rendering**: Disabled overlays only rendered when needed

## Browser Support

### Modern Browsers (Full Support)
- **Chrome/Edge**: 90+ (Chromium-based)
- **Firefox**: 88+
- **Safari**: 14+

### Features with Graceful Degradation
- **CSS Containment**: Falls back to standard rendering
- **Modern Image Formats**: Automatic fallback to JPEG/PNG
- **CSS Grid**: Flexbox fallback for older browsers
- **CSS Custom Properties**: Fallback values provided

### Accessibility Support
- **Screen Readers**: Full support for NVDA, JAWS, VoiceOver
- **High Contrast**: Windows High Contrast Mode compatible
- **Reduced Motion**: Respects user motion preferences

## Implementation Notes

### Component Architecture
- **Self-Contained**: No external dependencies beyond Astro and i18n utilities
- **Reusable**: Can be used in any layout or grid system
- **Configurable**: Extensive customization through CSS variables
- **Type-Safe**: Full TypeScript support with comprehensive interfaces

### State Management
- **Stateless**: Pure component with no internal state
- **Reactive**: Responds to prop changes without re-mounting
- **Predictable**: Clear prop-to-output mapping

### SEO Considerations
- **Semantic HTML**: Proper heading hierarchy and link structure
- **Meta Information**: Rich image alt-text for content understanding
- **Crawlable Links**: Standard `<a>` tags for proper indexing

## Related Components

### Core Components
- **[PlaylistCard](./PlaylistCard.md)** - Alternative card layout for playlists
- **[KnowledgeCard](./KnowledgeCard.md)** - Educational content cards
- **[ButtonLink](./ButtonLink.md)** - Interactive button components

### Layout Components
- **[Grid](./Grid.md)** - Responsive grid layouts for card arrangements
- **[Container](./Container.md)** - Page-level layout containers

### Game Components
- **[GameHeadline](./GameHeadline.md)** - Game mode title displays
- **[ScoreDisplay](./ScoreDisplay.md)** - Game score presentation
- **[LoadingSpinner](./LoadingSpinner.md)** - Loading state indicators

### Utility Components
- **[Icon](./Icon.md)** - SVG icon system
- **[Image](./Image.md)** - Optimized image component

## Changelog

### Version 3.2.0 (Current) - 2025-06-06
- ✅ **Enhanced WCAG AAA Compliance**: Improved color contrast and focus management
- ✅ **Advanced Text Spacing**: Support for 200% line height customization
- ✅ **Performance Optimization**: GPU acceleration and CSS containment
- ✅ **Screen Reader Enhancements**: Live announcements and status updates
- ✅ **CSS Variables Migration**: 100% usage of global design tokens

### Version 3.1.0 - 2025-05-15
- ✅ **Internationalization**: Full i18n support for all 10 languages
- ✅ **Accessibility Improvements**: Enhanced keyboard navigation
- ✅ **Image Optimization**: Modern format support with lazy loading
- ✅ **Code Deduplication**: Consolidated CSS patterns

### Version 3.0.0 - 2025-04-20
- ✅ **Major Redesign**: New visual design with gradient backgrounds
- ✅ **TypeScript Migration**: Full type safety implementation
- ✅ **Responsive Design**: Mobile-first approach with touch support
- ✅ **Dark Mode**: Enhanced dark theme compatibility

### Version 2.5.0 - 2025-03-10
- ✅ **Coming Soon State**: Disabled item functionality
- ✅ **Animation System**: Smooth hover and focus transitions
- ✅ **SEO Improvements**: Better semantic structure

### Version 2.0.0 - 2025-02-01
- ✅ **Astro Migration**: Converted from React to Astro component
- ✅ **CSS Architecture**: BEM methodology implementation
- ✅ **Accessibility Foundation**: Initial WCAG compliance

---

## Support and Contributing

For questions, bug reports, or feature requests related to the PlaylistItem component:

1. **Documentation Issues**: Update this documentation file
2. **Accessibility Concerns**: Ensure WCAG AAA compliance is maintained
3. **Performance Issues**: Profile and optimize using browser dev tools
4. **Browser Compatibility**: Test across supported browser matrix

### Code Standards
- **CSS Variables**: Always use global.css design tokens
- **Accessibility**: Maintain WCAG AAA compliance
- **Internationalization**: Support all 10 project languages
- **Performance**: Optimize for Core Web Vitals
- **Documentation**: Keep this documentation updated with changes
