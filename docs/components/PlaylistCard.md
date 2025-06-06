# PlaylistCard Component

## Overview

The PlaylistCard component is a comprehensive, accessibility-first playlist display component designed for the MelodyMind music trivia application. It provides a streamlined interface for showcasing music playlists with direct links to streaming platforms while maintaining WCAG AAA 2.2 compliance and performance optimization.

![PlaylistCard Screenshot](../public/docs/playlist-card.png)

## Features

- **WCAG AAA 2.2 Compliant** - Full accessibility support with screen readers, keyboard navigation, and high contrast modes
- **Streaming Platform Integration** - Support for Spotify, Deezer, and Apple Music
- **Performance Optimized** - Intelligent image loading, containment, and prioritization
- **Internationalization Ready** - Full i18n support with client-side translations
- **Responsive Design** - Mobile-first design with optimized touch targets
- **Schema.org Integration** - Structured data for enhanced SEO

## Properties

| Property             | Type     | Required | Description                                          | Default |
| -------------------- | -------- | -------- | ---------------------------------------------------- | ------- |
| headline             | string   | Yes      | Main title of the playlist                           | -       |
| imageUrl             | string   | Yes      | URL to the playlist cover image                      | -       |
| introSubline         | string   | Yes      | Short description of the playlist                    | -       |
| spotifyPlaylist      | string   | No       | Spotify playlist URL                                 | -       |
| deezerPlaylist       | string   | No       | Deezer playlist URL                                  | -       |
| appleMusicPlaylist   | string   | No       | Apple Music playlist URL                             | -       |
| index                | number   | Yes      | Index of the playlist (used for priority and IDs)   | -       |
| lang                 | string   | Yes      | Language code for translations                       | -       |

## TypeScript Interface

```typescript
export interface PlaylistCardProps {
  /** Main title of the playlist */
  headline: string;
  /** URL to the playlist cover image */
  imageUrl: string;
  /** Short description of the playlist */
  introSubline: string;
  /** Optional Spotify playlist URL */
  spotifyPlaylist?: string;
  /** Optional Deezer playlist URL */
  deezerPlaylist?: string;
  /** Optional Apple Music playlist URL */
  appleMusicPlaylist?: string;
  /** Index of the playlist in the list (used for animation and loading priority) */
  index: number;
  /** Language code for translations */
  lang: string;
}
```

## Usage

### Basic Implementation

```astro
---
import PlaylistCard from "../components/PlaylistCard.astro";

const playlist = {
  headline: "80s Rock Classics",
  imageUrl: "/images/80s-rock-cover.jpg",
  introSubline: "The best rock anthems from the 1980s",
  spotifyPlaylist: "https://open.spotify.com/playlist/example",
  deezerPlaylist: "https://deezer.com/playlist/example",
  appleMusicPlaylist: "https://music.apple.com/playlist/example",
  index: 0,
  lang: "en"
};
---

<PlaylistCard {...playlist} />
```

### Multiple Playlists with Performance Optimization

```astro
---
import PlaylistCard from "../components/PlaylistCard.astro";

const playlists = [
  {
    headline: "90s Pop Hits",
    imageUrl: "/images/90s-pop.jpg",
    introSubline: "Chart-topping pop songs from the 1990s",
    spotifyPlaylist: "https://open.spotify.com/playlist/90s-pop",
    index: 0, // Priority loading
    lang: "en"
  },
  {
    headline: "Jazz Essentials",
    imageUrl: "/images/jazz-essentials.jpg",
    introSubline: "Timeless jazz standards and classics",
    deezerPlaylist: "https://deezer.com/playlist/jazz",
    appleMusicPlaylist: "https://music.apple.com/playlist/jazz",
    index: 1, // Priority loading
    lang: "en"
  }
];
---

<div class="playlist-grid">
  {playlists.map((playlist) => (
    <PlaylistCard {...playlist} />
  ))}
</div>
```

## Accessibility Features

### WCAG AAA 2.2 Compliance

- **Color Contrast**: Maintains 7:1 contrast ratio for all text elements
- **Keyboard Navigation**: Full keyboard support with arrow key navigation between cards
- **Screen Reader Support**: Comprehensive ARIA labels and live regions
- **Touch Targets**: Minimum 44×44px touch targets for mobile accessibility
- **Focus Management**: Enhanced focus indicators and logical tab order

### Keyboard Interactions

| Key                        | Action                                               |
| -------------------------- | ---------------------------------------------------- |
| Enter / Space              | Activates card and focuses first streaming link     |
| Escape                     | Exits card interaction and resets focus             |
| Arrow Up/Down/Left/Right   | Navigates between playlist cards                     |
| Tab                        | Standard tab navigation through streaming links     |

### Screen Reader Announcements

The component provides comprehensive screen reader support:

```typescript
// Live region announcements
"playlist.activation.focused": "Focused on playlist {title}"
"playlist.activation.no_links": "Playlist {title} has no streaming links available"
"playlist.priority.loading": "Priority playlist {title} is loading"
"playlist.image.error": "Image failed to load for playlist {title}"
```

## Performance Optimization

### Image Loading Strategy

- **Priority Loading**: First 2 playlists use `loading="eager"` and `fetchpriority="high"`
- **Lazy Loading**: Subsequent playlists use `loading="lazy"`
- **Responsive Images**: Multiple widths (320px to 1280px) with optimized formats (AVIF, WebP, JPG)
- **Proper Sizing**: Responsive `sizes` attribute for optimal bandwidth usage

### CSS Performance

- **CSS Containment**: Uses `contain: layout style` for better rendering performance
- **Content Visibility**: Implements `content-visibility: auto` for viewport-based rendering
- **GPU Acceleration**: Uses `transform: translateZ(0)` for hardware acceleration
- **Optimized Transitions**: Only animates GPU-friendly properties

## Internationalization

### Required Translation Keys

```typescript
// Core playlist translations
"playlist.open.spotify": "Open on Spotify"
"playlist.open.deezer": "Open on Deezer"  
"playlist.open.apple": "Open on Apple Music"
"playlist.accessibility.instruction": "Use Enter to activate streaming links"
"playlist.accessibility.info": "Playlist information"
"playlist.accessibility.public": "This is a publicly available playlist"

// Interactive feedback
"playlist.activation.focused": "Focused on playlist {title}"
"playlist.activation.no_links": "Playlist {title} has no streaming links available"
"playlist.exit": "Exited playlist {title}"
"playlist.visible": "Playlist {title} is now visible"

// Priority and loading
"playlist.priority.loading": "Priority playlist {title} is loading"
"playlist.music.from.decade": "Music from {decade}"

// Error handling
"playlist.image.error": "Image failed to load for playlist {title}"
"playlist.title.unknown": "Unknown playlist"
```

### Usage with Different Languages

```astro
---
import PlaylistCard from "../components/PlaylistCard.astro";

// German language example
const germanPlaylist = {
  headline: "80er Rock Klassiker",
  imageUrl: "/images/80s-rock-de.jpg",
  introSubline: "Die besten Rock-Hymnen der 1980er Jahre",
  spotifyPlaylist: "https://open.spotify.com/playlist/80s-rock-de",
  index: 0,
  lang: "de" // German translations will be used
};
---

<PlaylistCard {...germanPlaylist} />
```

## Structured Data Integration

The component automatically generates Schema.org structured data:

```html
<article
  itemscope
  itemtype="https://schema.org/MusicPlaylist"
  aria-labelledby="playlist-title-0"
>
  <h2 itemprop="name">80s Rock Classics</h2>
  <p itemprop="description">The best rock anthems from the 1980s</p>
  <img itemprop="image" src="/images/80s-rock.jpg" alt="..." />
  
  <!-- Additional metadata -->
  <meta itemprop="numTracks" content="10+" />
  <meta itemprop="genre" content="1980s" />
  <meta itemprop="datePublished" content="2025-06-05" />
  <meta itemprop="author" content="Melody Mind" />
</article>
```

## Styling Guidelines

### CSS Custom Properties Usage

The component exclusively uses CSS custom properties from `global.css`:

```css
/* ✅ CORRECT - Using CSS variables */
.playlist-card {
  background-color: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  color: var(--text-primary);
}

/* ❌ INCORRECT - Hardcoded values */
.playlist-card {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  color: #ffffff;
}
```

### Available Design Tokens

- **Colors**: `--card-bg`, `--text-primary`, `--border-primary`, `--interactive-primary`
- **Spacing**: `--space-xs` through `--space-3xl`
- **Typography**: `--text-base`, `--font-bold`, `--leading-relaxed`
- **Effects**: `--card-shadow`, `--focus-ring`, `--transition-normal`

## Implementation Notes

### Loading Priority Logic

```typescript
// Priority playlists (first 2) get optimized loading
const isPriority = index < 2;
const loadingStrategy = isPriority ? "eager" : "lazy";
const fetchPriority = isPriority ? "high" : "auto";
```

### Decade Extraction

The component automatically extracts decade information from playlist titles:

```typescript
const decadeMatch = headline.match(/\d{4}/);
const decade = decadeMatch ? `${decadeMatch[0].substring(0, 3)}0s` : "Other";
```

### Error Handling

- **Image Loading Errors**: Automatic fallback to default cover image
- **Missing Translations**: Graceful degradation with fallback text
- **Screen Reader Announcements**: Error states communicated via live regions

## Browser Support

- **Modern Browsers**: Full feature support in Chrome 90+, Firefox 88+, Safari 14+
- **Legacy Support**: Graceful degradation for older browsers
- **Mobile**: Optimized for iOS Safari and Android Chrome
- **Assistive Technology**: Tested with NVDA, JAWS, and VoiceOver

## Related Components

- [StreamingLink](./StreamingLink.md) - Individual streaming service links
- [ImageCard](./ImageCard.md) - Base image display component
- [LoadingSpinner](./LoadingSpinner.md) - Loading state indicators

## Testing

### Accessibility Testing

```bash
# Run accessibility tests
npm run test:a11y

# Test with screen readers
npm run test:screen-reader

# Validate WCAG AAA compliance
npm run test:wcag
```

### Performance Testing

```bash
# Lighthouse performance audit
npm run test:lighthouse

# Image optimization validation
npm run test:images

# CSS performance analysis
npm run test:css-perf
```

## Changelog

### v3.2.0 - Current
- Added WCAG 2.2 AAA compliance features
- Implemented enhanced text spacing support
- Added forced colors mode support
- Improved touch target accessibility

### v3.1.0
- Added priority loading for first 2 playlists
- Enhanced error handling with live regions
- Implemented decade extraction from titles
- Added comprehensive keyboard navigation

### v3.0.0
- Complete TypeScript migration
- CSS custom properties integration
- Performance optimization with containment
- Enhanced internationalization support

### v2.5.0
- Added Schema.org structured data
- Implemented responsive image optimization
- Enhanced streaming platform styling
- Added intersection observer for loading

## Migration Guide

### From v2.x to v3.x

**Breaking Changes:**
- Props now require TypeScript interface compliance
- CSS classes renamed to BEM methodology
- Language prop is now required for i18n support

**Migration Steps:**

1. Update prop structure:
```astro
<!-- v2.x -->
<PlaylistCard 
  title="80s Rock"
  image="/image.jpg"
  description="Description"
/>

<!-- v3.x -->
<PlaylistCard 
  headline="80s Rock"
  imageUrl="/image.jpg"
  introSubline="Description"
  index={0}
  lang="en"
/>
```

2. Update CSS references:
```css
/* v2.x */
.playlist-item { }
.playlist-image { }

/* v3.x */
.playlist-card { }
.playlist-card__image { }
```

3. Add required translation keys to your i18n files as listed in the Internationalization section.

## Best Practices

1. **Always provide meaningful alt text** for playlist cover images
2. **Use descriptive headlines** that include decade or genre information
3. **Provide at least one streaming link** for better user experience
4. **Test with screen readers** to ensure accessibility compliance
5. **Optimize images** before using as cover art
6. **Use semantic order** for index values to maintain proper priority loading
