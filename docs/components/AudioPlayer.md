# AudioPlayer Component

## Overview

The AudioPlayer component is a responsive, accessible audio player that provides comprehensive music
playback functionality with WCAG 2.2 AAA compliance. It features advanced accessibility support,
modern performance optimizations, and a beautiful user interface that seamlessly integrates with the
MelodyMind music trivia game.

![AudioPlayer Component Screenshot](../public/docs/audioplayer-component.png)

## Key Features

- **WCAG 2.2 AAA Compliance**: Full accessibility support with keyboard navigation, screen reader
  compatibility, and enhanced focus indicators
- **Advanced Keyboard Controls**: Comprehensive keyboard shortcuts for seeking, volume control, and
  playback management
- **Multilingual Support**: Full internationalization with translations for 10 languages
- **Modern Performance**: Intersection Observer lazy loading, dynamic imports, and optimized
  rendering
- **Responsive Design**: Adaptive layout with touch-friendly controls (44×44px minimum touch
  targets)
- **Audio Accessibility**: Support for captions, audio descriptions, and fallback content
- **Visual Feedback**: Real-time progress tracking with waveform visualization
- **Contextual Help**: Optional keyboard shortcut instructions

## Properties

| Property        | Type                           | Required | Description                                 | Default                    |
| --------------- | ------------------------------ | -------- | ------------------------------------------- | -------------------------- |
| audioSrc        | string                         | Yes      | URL to the audio file                       | -                          |
| imageSrc        | string                         | Yes      | URL to the cover image                      | -                          |
| imageAlt        | string                         | Yes      | Alt text for the cover image                | -                          |
| title           | string                         | No       | Title of the track                          | ""                         |
| artist          | string                         | No       | Artist name                                 | ""                         |
| waveformColor   | string                         | No       | Color for waveform visualization            | "var(--color-primary-600)" |
| accentColor     | string                         | No       | Accent color for progress elements          | "var(--color-primary-400)" |
| preload         | "none" \| "metadata" \| "auto" | No       | Audio preload strategy                      | "metadata"                 |
| captionsUrl     | string                         | No       | URL to captions/subtitles file              | undefined                  |
| descriptionsUrl | string                         | No       | URL to audio descriptions file              | undefined                  |
| showHelp        | boolean                        | No       | Show contextual help for keyboard shortcuts | false                      |

## Usage

### Basic Implementation

```astro
---
import AudioPlayer from "@components/AudioPlayer.astro";
---

<AudioPlayer
  audioSrc="/audio/track.mp3"
  imageSrc="/images/cover.jpg"
  imageAlt="Album cover for Symphony No. 9"
  title="Symphony No. 9"
  artist="Ludwig van Beethoven"
/>
```

### Advanced Configuration

```astro
---
import AudioPlayer from "@components/AudioPlayer.astro";
---

<AudioPlayer
  audioSrc="/audio/accessible-track.mp3"
  imageSrc="/images/album-cover.jpg"
  imageAlt="Album cover showing a vibrant musical score"
  title="Moonlight Sonata"
  artist="Ludwig van Beethoven"
  waveformColor="var(--color-secondary-500)"
  accentColor="var(--color-secondary-300)"
  preload="metadata"
  captionsUrl="/captions/moonlight-sonata.vtt"
  descriptionsUrl="/descriptions/moonlight-sonata.vtt"
  showHelp={true}
/>
```

### Multiple Players on One Page

```astro
---
import AudioPlayer from "@components/AudioPlayer.astro";

const tracks = [
  {
    audioSrc: "/audio/track1.mp3",
    imageSrc: "/images/cover1.jpg",
    imageAlt: "Cover for Track 1",
    title: "Classical Piece",
    artist: "Mozart",
  },
  {
    audioSrc: "/audio/track2.mp3",
    imageSrc: "/images/cover2.jpg",
    imageAlt: "Cover for Track 2",
    title: "Jazz Standard",
    artist: "Miles Davis",
  },
];
---

{
  tracks.map((track) => (
    <AudioPlayer
      audioSrc={track.audioSrc}
      imageSrc={track.imageSrc}
      imageAlt={track.imageAlt}
      title={track.title}
      artist={track.artist}
      showHelp={true}
    />
  ))
}
```

## Accessibility Features

### WCAG 2.2 AAA Compliance

The AudioPlayer component meets and exceeds WCAG 2.2 AAA standards:

- **Keyboard Navigation**: Complete keyboard control with intuitive shortcuts
- **Screen Reader Support**: Comprehensive ARIA labeling and live region announcements
- **Focus Management**: Enhanced focus indicators with 3px solid borders
- **Color Contrast**: 7:1 contrast ratio for all text elements
- **Touch Accessibility**: 44×44px minimum touch targets for mobile
- **Motion Support**: Respects `prefers-reduced-motion` settings
- **Alternative Input**: Support for alternative input methods beyond mouse/touch

### Keyboard Shortcuts

| Shortcut                 | Action                         | Context             |
| ------------------------ | ------------------------------ | ------------------- |
| Space                    | Play/Pause toggle              | Global              |
| M                        | Mute/Unmute                    | Global              |
| Arrow Left/Right         | Seek backward/forward (5s)     | Progress bar focus  |
| Shift + Arrow Left/Right | Seek backward/forward (30s)    | Progress bar focus  |
| Home                     | Jump to beginning              | Progress bar focus  |
| End                      | Jump to end                    | Progress bar focus  |
| Arrow Up/Down            | Volume up/down (5% increments) | Volume slider focus |
| Tab                      | Navigate between controls      | Global              |

### Screen Reader Announcements

- **Progress Updates**: Real-time position announcements during seeking
- **Volume Changes**: Percentage announcements during volume adjustments
- **Loading States**: Status updates for loading, loaded, and error states
- **Help Instructions**: Contextual keyboard shortcut guidance
- **Audio Descriptions**: Detailed track information for screen readers

## Technical Implementation

### File Structure

```
/src/components/
└── AudioPlayer.astro                    # Main component

/src/utils/audio/
├── audioPlayer.ts                       # TypeScript implementation
├── audioPlayerInit.ts                   # Initialization script
└── audioControls.ts                     # Audio control utilities

/test-audio-player-accessibility.html    # Comprehensive test page
```

### Architecture

- **Astro Component**: Server-side rendering with client-side hydration
- **TypeScript Utilities**: Type-safe audio player logic in `/src/utils/audio/`
- **Dynamic Loading**: Intersection Observer for performance optimization
- **CSS Variables**: Consistent design system integration
- **I18n Integration**: Seamless translation support

### Performance Optimizations

- **Lazy Loading**: Intersection Observer initialization when component becomes visible
- **Dynamic Imports**: Module loading on demand to reduce initial bundle size
- **DOM Caching**: Optimized element references for better performance
- **Hardware Acceleration**: GPU-accelerated transforms for smooth animations
- **Content Visibility**: Modern CSS containment for rendering optimization
- **Preconnect Hints**: DNS prefetching for external audio sources

### Browser Compatibility

- **Modern Browsers**: Full feature support with all accessibility enhancements
- **Legacy Browsers**: Graceful degradation with core functionality preserved
- **Screen Readers**: Tested compatibility with NVDA, JAWS, and VoiceOver
- **Mobile Devices**: Touch-optimized with appropriate gesture support

## Internationalization

The AudioPlayer component supports comprehensive internationalization with translations for all
user-facing text:

### Supported Languages

- **German (de)**: Vollständige deutsche Übersetzungen
- **Spanish (es)**: Traducciones completas en español
- **French (fr)**: Traductions complètes en français
- **Italian (it)**: Traduzioni complete in italiano
- **Portuguese (pt)**: Traduções completas em português
- **Danish (da)**: Komplette danske oversættelser
- **Dutch (nl)**: Volledige Nederlandse vertalingen
- **Swedish (sv)**: Kompletta svenska översättningar
- **Finnish (fi)**: Täydelliset suomenkieliset käännökset
- **English (en)**: Complete English translations (base language)

### Translation Keys

```typescript
// Core functionality
"audioplayer.aria.region"; // Main region label
"audioplayer.play.aria"; // Play button ARIA label
"audioplayer.progress.aria"; // Progress bar label
"audioplayer.volume.toggle.aria"; // Volume button label
"audioplayer.volume.slider.aria"; // Volume slider label

// Help and instructions
"audioplayer.progress.help"; // Keyboard navigation help
"audioplayer.volume.slider.help"; // Volume control help
"audioplayer.help.button.aria"; // Help button label

// Accessibility content
"audioplayer.description"; // Audio description with title/artist
"audioplayer.captions.english"; // English captions label
"audioplayer.fallback.unsupported"; // Unsupported browser message
```

## Styling and Design

### CSS Architecture

The component follows MelodyMind's CSS standards with proper variable usage:

```css
/* Uses semantic design tokens */
.audio-player {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-lg);
}

/* Accessibility-first focus indicators */
.audio-player__play-button:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}
```

### Responsive Breakpoints

```css
/* Mobile optimization */
@media (max-width: var(--breakpoint-sm)) {
  .audio-player__controls {
    gap: var(--space-sm);
  }

  .volume-slider-container {
    display: none; /* Hide on small screens */
  }
}
```

### Theme Support

- **Dark Mode**: Seamless dark/light theme integration
- **High Contrast**: Enhanced visibility options
- **Custom Colors**: Configurable waveform and accent colors
- **Brand Consistency**: Uses established MelodyMind design tokens

## Testing

### Manual Testing Checklist

- [ ] **Keyboard Navigation**: All controls accessible via keyboard
- [ ] **Screen Reader**: Proper announcements and descriptions
- [ ] **Volume Control**: Accessible slider with percentage feedback
- [ ] **Progress Control**: Seeking with keyboard shortcuts works
- [ ] **Help System**: Contextual help provides clear instructions
- [ ] **Loading States**: Proper status announcements during loading
- [ ] **Error Handling**: Graceful fallback for unsupported audio
- [ ] **Multiple Instances**: Multiple players work independently
- [ ] **Mobile Touch**: Touch targets meet 44×44px minimum
- [ ] **Reduced Motion**: Respects user motion preferences

### Automated Testing

```bash
# Run accessibility tests
npm run test:a11y

# Run component integration tests
npm run test:components

# Run cross-browser compatibility tests
npm run test:browsers
```

### Test Page

A comprehensive test page is available at `/test-audio-player-accessibility.html` with:

- Visual feedback for keyboard interactions
- WCAG 2.2 AAA compliance checklist
- Screen reader testing instructions
- Mock audio player with all features functional

## Error Handling

### Graceful Degradation

- **Audio Loading Errors**: Displays fallback download link
- **Network Issues**: Retry mechanism with user feedback
- **Browser Compatibility**: Progressive enhancement approach
- **Missing Elements**: Safe DOM queries with null checks
- **Invalid Audio**: Clear error messages for users

### Developer Feedback

```typescript
// Console warnings for development
console.warn(`Audio player with ID "${id}" not found in the DOM`);
console.error("Failed to load audio player:", error);
```

## Migration and Upgrade Notes

### From v2.x to v3.x

- **Breaking Change**: TypeScript implementation requires module import updates
- **New Feature**: Enhanced WCAG 2.2 AAA compliance
- **Improved**: Contextual help system with keyboard shortcuts
- **Migration**: Update import paths from `/scripts/` to `/utils/audio/`

### TypeScript Migration

The component has been migrated to TypeScript for enhanced type safety:

```typescript
// Old: JavaScript implementation
import "./scripts/audio-player-simple.js";

// New: TypeScript implementation
import { initializeAudioPlayers } from "../utils/audio/audioPlayerInit.js";
```

## Related Components

- [Timer](./Timer.md) - Displays countdown timer for timed interactions
- [VolumeControl](./VolumeControl.md) - Standalone volume control component
- [MediaOverlay](./MediaOverlay.md) - Full-screen media presentation
- [ProgressBar](./ProgressBar.md) - Reusable progress indication

## API Reference

### Initialization Function

```typescript
/**
 * Initialize the enhanced audio player with the given ID
 * @param {string} id - The unique ID of the player instance
 */
export function initializePlayer(id: string): void;

/**
 * Initialize all audio players on the page when DOM is loaded
 */
export function initializeAllPlayers(): void;
```

### Type Definitions

```typescript
interface AudioPlayerElements {
  audio: HTMLAudioElement;
  playButton: HTMLButtonElement;
  progress: {
    bar: HTMLElement;
    container: HTMLElement;
    waveform: HTMLElement;
  };
  // ... additional elements
}

interface AudioPlayerConfig {
  waveformColor: string;
  accentColor: string;
  audioSrc: string;
}
```

## Implementation Notes

### Security Considerations

- **Content Security Policy**: Properly configured for audio sources
- **CORS Headers**: Required for cross-origin audio files
- **Input Validation**: Safe handling of user-provided URLs
- **XSS Prevention**: Sanitized output for dynamic content

### Performance Considerations

- **Memory Management**: Proper cleanup of audio resources
- **Bundle Size**: Dynamic imports reduce initial load
- **Core Web Vitals**: Optimized for LCP, FID, and CLS metrics
- **Network Efficiency**: Intelligent preloading strategies

## Troubleshooting

### Common Issues

**Audio won't play**

- Check audio file format compatibility (MP3, WAV, OGG)
- Verify CORS headers for cross-origin files
- Ensure user interaction before autoplay (browser policy)

**Keyboard shortcuts not working**

- Verify element has focus (tab to progress bar)
- Check for JavaScript errors in console
- Ensure audio metadata is loaded

**Screen reader not announcing changes**

- Verify aria-live regions are present
- Check screen reader compatibility mode
- Ensure proper ARIA label associations

### Debug Mode

Enable debug mode for development:

```typescript
// Add to component for debugging
const debugMode = import.meta.env.DEV;
if (debugMode) {
  console.log("AudioPlayer debug info:", { playerId, config, elements });
}
```

## Changelog

### v3.0.0 - Latest

- ✅ **Added**: WCAG 2.2 AAA compliance with enhanced keyboard navigation
- ✅ **Added**: Comprehensive internationalization for 10 languages
- ✅ **Added**: TypeScript implementation with full type safety
- ✅ **Added**: Contextual help system with keyboard shortcuts
- ✅ **Improved**: Performance optimizations with Intersection Observer
- ✅ **Improved**: Enhanced screen reader support and announcements
- ✅ **Fixed**: Focus management and accessibility improvements

### v2.5.0

- Added explanation feature for incorrect answers
- Enhanced mobile touch support
- Improved error handling

### v2.0.0

- Redesigned with modern CSS and dark mode support
- Added waveform visualization
- Implemented responsive design patterns

## Conclusion

The AudioPlayer component represents a state-of-the-art implementation of accessible media controls,
combining modern web standards with inclusive design principles. Its comprehensive feature set makes
it suitable for a wide range of applications while maintaining the highest accessibility standards.

For additional support or feature requests, please refer to the
[project documentation](../README.md) or create an issue in the project repository.
