# MusicButtons Component

## Overview

The MusicButtons component displays interactive buttons for different music streaming platforms (Spotify, Deezer, Apple Music) with WCAG AAA 2.2 compliant styling. It provides users with quick access to playlists across multiple music services while maintaining full accessibility and internationalization support.

![MusicButtons Component Example](../assets/music-buttons-example.png)

## Features

- **Multi-platform Support**: Spotify, Deezer, and Apple Music integration
- **Conditional Rendering**: Only displays buttons for platforms with available playlist URLs
- **WCAG AAA 2.2 Compliance**: 7:1 color contrast ratio and full accessibility support
- **Internationalization**: Multi-language support through the i18n system
- **Keyboard Navigation**: Full keyboard accessibility with visible focus indicators
- **Screen Reader Optimized**: Proper ARIA attributes and semantic HTML structure
- **Performance Optimized**: CSS containment and efficient rendering
- **Responsive Design**: Mobile-first approach with touch-friendly targets

## Properties

| Property | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| `category` | `CategoryWithPlaylists` | Yes | Object containing optional playlist URLs for different platforms | - |
| `title` | `string` | Yes | Title of the music collection used for accessibility labels | - |

### CategoryWithPlaylists Interface

```typescript
interface CategoryWithPlaylists {
  /** Spotify playlist URL - if provided, Spotify button will be displayed */
  spotifyPlaylist?: string;
  /** Deezer playlist URL - if provided, Deezer button will be displayed */
  deezerPlaylist?: string;
  /** Apple Music playlist URL - if provided, Apple Music button will be displayed */
  appleMusicPlaylist?: string;
}
```

## Usage

### Basic Implementation

```astro
---
import MusicButtons from "@components/MusicButtons.astro";

const rockCategory = {
  spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
  deezerPlaylist: "https://www.deezer.com/playlist/908622995",
  appleMusicPlaylist: "https://music.apple.com/playlist/pl.2b0e6e332fdf4b7a91164da3162127b5"
};
---

<MusicButtons
  category={rockCategory}
  title="Rock Music Playlist"
/>
```

### Partial Platform Support

```astro
---
// Only Spotify available - other platforms will be automatically hidden
const limitedCategory = {
  spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd"
  // deezerPlaylist and appleMusicPlaylist are undefined
};
---

<MusicButtons
  category={limitedCategory}
  title="Spotify-Only Playlist"
/>
```

### Dynamic Categories

```astro
---
import MusicButtons from "@components/MusicButtons.astro";
import { getQuestionCategories } from "@utils/game/categories";

const categories = await getQuestionCategories();
---

{categories.map((category) => (
  category.hasPlaylists && (
    <MusicButtons
      category={category}
      title={category.name}
    />
  )
))}
```

## Accessibility Features

### WCAG AAA 2.2 Compliance

- **Color Contrast**: 7:1 ratio for all text and interactive elements
- **Focus Indicators**: 3px solid visible focus rings on all interactive elements
- **Touch Targets**: Minimum 44×44px for mobile accessibility
- **Reduced Motion**: Respects `prefers-reduced-motion` user preference

### Screen Reader Support

```html
<!-- Generated accessible structure -->
<div class="music-buttons" role="group" aria-labelledby="music-platforms-heading">
  <h3 id="music-platforms-heading" class="sr-only">
    Rock Music Playlist - Music Platforms
  </h3>
  <div class="music-buttons-instructions sr-only" aria-live="polite">
    Use arrow keys to navigate between music platform buttons. Press Enter or Space to open playlist in new tab.
  </div>
  <!-- Platform buttons with proper aria-labels -->
</div>
```

### Keyboard Navigation

- **Tab Navigation**: Moves between available platform buttons
- **Enter/Space**: Activates the selected platform button
- **Screen Reader Instructions**: Provides context for keyboard users

## Internationalization

### Supported Languages

The component supports all languages configured in the MelodyMind i18n system:

- English (en)
- German (de)
- Spanish (es)
- French (fr)
- Italian (it)
- Portuguese (pt)

### Translation Keys

```typescript
// Required translation keys in language files
const requiredKeys = {
  "musicPlatforms.heading": "Music Platforms",
  "musicPlatforms.listenOn": "Listen to {title} on {platform}",
  "musicPlatforms.keyboardInstructions": "Use arrow keys to navigate between music platform buttons...",
  "musicPlatforms.externalNotice": "External links will open in a new tab"
};
```

### Usage in Different Languages

```astro
---
// Component automatically detects language from URL
// /en/category/rock -> English
// /de/category/rock -> German
// /es/category/rock -> Spanish
---

<MusicButtons
  category={category}
  title="Rock Music" <!-- Will be translated in aria-labels -->
/>
```

## Styling and Theming

### CSS Variables

The component uses only CSS variables from `/src/styles/global.css`:

```css
/* Example of used variables */
--space-md              /* Gap between buttons */
--color-primary-600     /* Spotify brand color */
--color-secondary-500   /* Deezer brand color */
--border-radius-md      /* Button border radius */
--shadow-md            /* Button shadow */
--transition-normal    /* Hover animations */
```

### Platform-Specific Styling

```css
/* Each platform has its own variant */
.music-button--spotify {
  background-color: var(--color-spotify-bg);
  border-color: var(--color-spotify-border);
}

.music-button--deezer {
  background-color: var(--color-deezer-bg);
  border-color: var(--color-deezer-border);
}

.music-button--apple {
  background-color: var(--color-apple-bg);
  border-color: var(--color-apple-border);
}
```

### Responsive Behavior

```css
/* Mobile-first responsive design */
.music-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

/* Tablet and desktop optimizations */
@media (min-width: 768px) {
  .music-buttons {
    justify-content: center;
  }
}
```

## Performance Considerations

### Optimization Features

- **CSS Containment**: `contain: layout style` for optimal rendering
- **Lazy Icon Loading**: Icons are loaded efficiently with astro-icon
- **Minimal JavaScript**: Static rendering with no client-side JavaScript
- **Efficient Selectors**: Simple CSS selectors for fast rendering

### Core Web Vitals Impact

- **LCP (Largest Contentful Paint)**: Optimized with efficient CSS and minimal layout shifts
- **FID (First Input Delay)**: No JavaScript blocking ensures immediate interactivity
- **CLS (Cumulative Layout Shift)**: Stable layout with proper sizing prevents shifts

## Error Handling

### Missing URLs

```astro
---
// Component gracefully handles missing playlist URLs
const incompleteCategory = {
  spotifyPlaylist: "https://spotify.com/...",
  // deezerPlaylist: undefined - button won't render
  // appleMusicPlaylist: undefined - button won't render
};
---

<!-- Only Spotify button will be displayed -->
<MusicButtons category={incompleteCategory} title="Partial Playlist" />
```

### Invalid URLs

The component includes basic URL validation through the ButtonLink component and relies on the browser's native link handling for invalid URLs.

## Related Components

- **[ButtonLink](./ButtonLink.md)** - Base button component used for platform links
- **[Icon](./Icon.md)** - Icon component for platform logos
- **[CategoryCard](./CategoryCard.md)** - Often used together for music category displays

## Integration Examples

### With Game Categories

```astro
---
import MusicButtons from "@components/MusicButtons.astro";
import CategoryCard from "@components/CategoryCard.astro";

export interface Props {
  category: MusicCategory;
}

const { category } = Astro.props;
---

<CategoryCard title={category.name} description={category.description}>
  <MusicButtons 
    category={category} 
    title={`${category.name} Playlist`} 
  />
</CategoryCard>
```

### With Modal Overlays

```astro
---
import MusicButtons from "@components/MusicButtons.astro";
import Modal from "@components/Overlays/Modal.astro";
---

<Modal title="Music Playlists" id="music-modal">
  <MusicButtons 
    category={selectedCategory} 
    title={selectedCategory.name} 
  />
</Modal>
```

## Testing

### Accessibility Testing

```bash
# Run accessibility tests
npm run test:a11y -- --component=MusicButtons

# Manual testing checklist:
# ✓ Screen reader navigation
# ✓ Keyboard-only navigation
# ✓ Color contrast validation
# ✓ Focus indicator visibility
# ✓ Touch target size verification
```

### Cross-browser Testing

```bash
# Test in supported browsers
npm run test:browsers -- --include=MusicButtons

# Supported browsers:
# - Chrome 90+
# - Firefox 90+
# - Safari 14+
# - Edge 90+
```

## Changelog

### Version 3.0.0 (Current)
- **Added**: WCAG AAA 2.2 compliance with 7:1 contrast ratio
- **Added**: Enhanced keyboard navigation with arrow key support
- **Added**: Comprehensive internationalization support
- **Added**: CSS containment for performance optimization
- **Improved**: Screen reader compatibility with better ARIA implementation
- **Changed**: Migrated to CSS variables only (breaking change)

### Version 2.5.0
- **Added**: Apple Music platform support
- **Added**: Responsive design improvements
- **Fixed**: Focus indicator visibility issues

### Version 2.0.0
- **Added**: Deezer platform support
- **Changed**: Redesigned with Tailwind CSS (deprecated in v3.0.0)
- **Breaking**: Modified Props interface structure

### Version 1.0.0
- **Initial**: Basic Spotify integration
- **Initial**: Core accessibility features

## Migration Guide

### From v2.x to v3.0.0

```astro
<!-- v2.x - Tailwind classes (deprecated) -->
<MusicButtons 
  category={category} 
  title={title}
  className="custom-spacing"
/>

<!-- v3.0.0 - CSS variables only -->
<MusicButtons 
  category={category} 
  title={title}
/>

<!-- Custom styling with CSS variables -->
<style>
  .music-buttons {
    gap: var(--space-lg); /* Instead of Tailwind classes */
  }
</style>
```

## Contributing

When contributing to the MusicButtons component:

1. **Follow CSS Variable Standards**: Use only variables from `global.css`
2. **Maintain Accessibility**: Ensure WCAG AAA 2.2 compliance
3. **Update Documentation**: Include JSDoc comments and update this file
4. **Test Thoroughly**: Run accessibility and cross-browser tests
5. **Support Internationalization**: Add new translation keys as needed

## Support

For issues or questions about the MusicButtons component:

- Check the [MelodyMind Documentation](../README.md)
- Review [Accessibility Guidelines](../accessibility.md)
- Consult [CSS Variable Reference](../styling/css-variables.md)
- See [Internationalization Guide](../i18n/README.md)
