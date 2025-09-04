/**
 * Type definitions for the MusicButtons component
 *
 * @fileoverview Provides comprehensive TypeScript interfaces and types for the MusicButtons component,
 * including props validation, platform variants, and accessibility configurations.
 *
 * @version 3.0.0
 * @since 3.0.0
 * @author MelodyMind Development Team
 *
 * @example
 * ```typescript
 * import type { MusicButtonsProps, MusicPlatform, CategoryWithPlaylists } from '@types/MusicButtons';
 *
 * const category: CategoryWithPlaylists = {
 *   spotifyPlaylist: "https://open.spotify.com/playlist/...",
 *   deezerPlaylist: "https://www.deezer.com/playlist/...",
 *   appleMusicPlaylist: "https://music.apple.com/playlist/..."
 * };
 * ```
 */

/**
 * Supported music streaming platforms
 *
 * @description Defines the available music platforms that can be integrated
 * with the MusicButtons component. Each platform has specific branding and URL patterns.
 *
 * @see {@link https://developer.spotify.com/documentation/web-api/} Spotify Web API
 * @see {@link https://developers.deezer.com/api} Deezer API
 * @see {@link https://developer.apple.com/documentation/applemusicapi} Apple Music API
 */
export type MusicPlatform = "spotify" | "deezer" | "apple";

/**
 * Platform-specific color variants for styling
 *
 * @description Each platform uses distinct CSS class modifiers for branding consistency
 * while maintaining WCAG AAA accessibility standards.
 */
export type PlatformVariant = "spotify" | "deezer" | "apple";

/**
 * Category object containing optional playlist URLs for different music platforms
 *
 * @description Represents a music category (genre) with optional playlist links for each platform.
 * Only platforms with valid URLs will render buttons in the UI.
 *
 * @example
 * ```typescript
 * // Complete category with all platforms
 * const fullCategory: CategoryWithPlaylists = {
 *   spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
 *   deezerPlaylist: "https://www.deezer.com/playlist/908622995",
 *   appleMusicPlaylist: "https://music.apple.com/playlist/pl.2b0e6e332fdf4b7a91164da3162127b5"
 * };
 *
 * // Partial category (only Spotify available)
 * const partialCategory: CategoryWithPlaylists = {
 *   spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd"
 *   // Other platforms undefined - buttons won't render
 * };
 * ```
 */
export interface CategoryWithPlaylists {
  /**
   * Spotify playlist URL
   *
   * @description Valid Spotify playlist URL. If provided, the Spotify button will be displayed.
   * Should follow the pattern: https://open.spotify.com/playlist/{playlist_id}
   *
   * @pattern ^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+$
   * @example "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd"
   */
  spotifyPlaylist?: string;

  /**
   * Deezer playlist URL
   *
   * @description Valid Deezer playlist URL. If provided, the Deezer button will be displayed.
   * Should follow the pattern: https://www.deezer.com/playlist/{playlist_id}
   *
   * @pattern ^https:\/\/www\.deezer\.com\/playlist\/[0-9]+$
   * @example "https://www.deezer.com/playlist/908622995"
   */
  deezerPlaylist?: string;

  /**
   * Apple Music playlist URL
   *
   * @description Valid Apple Music playlist URL. If provided, the Apple Music button will be displayed.
   * Should follow the pattern: https://music.apple.com/playlist/{playlist_id}
   *
   * @pattern ^https:\/\/music\.apple\.com\/playlist\/pl\.[a-zA-Z0-9]+$
   * @example "https://music.apple.com/playlist/pl.2b0e6e332fdf4b7a91164da3162127b5"
   */
  appleMusicPlaylist?: string;
}

/**
 * Props interface for the MusicButtons Astro component
 *
 * @description Defines the required and optional properties for the MusicButtons component.
 * Ensures type safety and provides clear documentation for component usage.
 *
 * @accessibility All props are designed with accessibility in mind, particularly the title
 * which is used for screen reader labels and ARIA descriptions.
 *
 * @i18n The title prop works with the i18n system to provide localized accessibility labels.
 */
export interface MusicButtonsProps {
  /**
   * Category object containing optional playlist URLs for different platforms
   *
   * @description Object with optional playlist URLs for each supported platform.
   * Only platforms with valid URLs will render buttons. The component gracefully
   * handles missing URLs by not rendering buttons for unavailable platforms.
   *
   * @required
   * @accessibility Used to determine which buttons to render and their target URLs
   * @validation URLs should be valid HTTPS links to the respective platforms
   */
  category: CategoryWithPlaylists;

  /**
   * Title of the music collection/playlist
   *
   * @description Human-readable title used for accessibility labels and descriptions.
   * This title appears in aria-label attributes to provide context for screen readers
   * and assistive technologies. Should be descriptive and localized.
   *
   * @required
   * @accessibility Critical for screen reader users - provides context for button purpose
   * @i18n Should be localized content, not a translation key
   * @example "Rock Music Playlist", "Jazz Standards Collection", "Pop Hits 2024"
   */
  title: string;
}

/**
 * Internal button configuration interface
 *
 * @description Used internally by the component to configure each platform button.
 * Not exported as it's an implementation detail.
 *
 * @internal
 */
// interface MusicButtonConfig {
//   /** Platform type for icon selection */
//   type: MusicPlatform;
//   /** Platform URL (may be undefined) */
//   url?: string;
//   /** Platform display label */
//   label: string;
//   /** CSS variant class modifier */
//   variant: PlatformVariant;
// }

/**
 * Translation keys used by the MusicButtons component
 *
 * @description Defines the i18n translation keys required by the component.
 * All keys must be present in the language files for proper internationalization.
 *
 * @i18n These keys must be available in all supported languages
 * @namespace musicPlatforms
 */
export interface MusicButtonsTranslationKeys {
  /**
   * Heading for the music platforms section
   *
   * @key musicPlatforms.heading
   * @example "Music Platforms"
   * @usage Screen reader heading for the button group
   */
  "musicPlatforms.heading": string;

  /**
   * Aria label template for platform buttons
   *
   * @key musicPlatforms.listenOn
   * @template {title} - The playlist/collection title
   * @template {platform} - The platform name (Spotify, Deezer, Apple)
   * @example "Listen to {title} on {platform}"
   * @usage "Listen to Rock Hits on Spotify"
   */
  "musicPlatforms.listenOn": string;

  /**
   * Keyboard navigation instructions for screen readers
   *
   * @key musicPlatforms.keyboardInstructions
   * @example "Use arrow keys to navigate between music platform buttons. Press Enter or Space to open playlist in new tab."
   * @usage Provides keyboard navigation context
   */
  "musicPlatforms.keyboardInstructions": string;

  /**
   * External link notice for screen readers
   *
   * @key musicPlatforms.externalNotice
   * @example "External links will open in a new tab"
   * @usage Informs users that links open externally
   */
  "musicPlatforms.externalNotice": string;
}

/**
 * CSS class names used by the component
 *
 * @description Defines the CSS classes applied by the component for styling.
 * Useful for testing, custom styling, and integration with other components.
 *
 * @css All classes use CSS variables from global.css for consistency
 */
export interface MusicButtonsCSSClasses {
  /** Main container class */
  container: "music-buttons";
  /** Screen reader only content */
  srOnly: "sr-only";
  /** Keyboard instructions container */
  instructions: "music-buttons-instructions";
  /** Base button class (global) */
  button: "music-button";
  /** Spotify variant modifier */
  spotifyVariant: "music-button--spotify";
  /** Deezer variant modifier */
  deezerVariant: "music-button--deezer";
  /** Apple Music variant modifier */
  appleVariant: "music-button--apple";
  /** Button icon class */
  buttonIcon: "music-button__icon";
  /** Button label class */
  buttonLabel: "music-button__label";
}

/**
 * Accessibility configuration for the component
 *
 * @description Defines accessibility-related configuration and requirements.
 * Used for testing and validation of accessibility compliance.
 *
 * @wcag Ensures WCAG AAA 2.2 compliance
 */
export interface MusicButtonsAccessibilityConfig {
  /** WCAG compliance level */
  wcagLevel: "AAA";
  /** Required color contrast ratio */
  contrastRatio: "7:1";
  /** Minimum touch target size in pixels */
  minTouchTarget: 44;
  /** Supported input methods */
  inputMethods: ["keyboard", "mouse", "touch", "screen-reader"];
  /** Required ARIA attributes */
  requiredAria: ["aria-label", "aria-describedby", "aria-labelledby"];
  /** Keyboard navigation support */
  keyboardNavigation: true;
  /** Screen reader optimization */
  screenReaderOptimized: true;
  /** Reduced motion support */
  reducedMotionSupport: true;
  /** High contrast mode support */
  highContrastSupport: true;
}

/**
 * Performance metrics and requirements
 *
 * @description Defines performance expectations and optimizations for the component.
 * Used for monitoring and testing performance compliance.
 *
 * @performance Optimized for Core Web Vitals
 */
export interface MusicButtonsPerformanceConfig {
  /** CSS containment enabled */
  cssContainment: true;
  /** Hardware acceleration enabled */
  hardwareAcceleration: true;
  /** JavaScript bundle impact */
  javascriptImpact: "minimal";
  /** Rendering optimization */
  renderingOptimization: "static-generation";
  /** Core Web Vitals target metrics */
  coreWebVitals: {
    /** Largest Contentful Paint target (ms) */
    lcp: 2500;
    /** First Input Delay target (ms) */
    fid: 100;
    /** Cumulative Layout Shift target */
    cls: 0.1;
  };
}

/**
 * Component version and compatibility information
 *
 * @description Tracks component version history and compatibility requirements.
 * Used for migration guides and backward compatibility checks.
 */
export interface MusicButtonsVersionInfo {
  /** Current component version */
  version: "3.0.0";
  /** Minimum Astro version required */
  minAstroVersion: "4.0.0";
  /** Minimum TypeScript version required */
  minTypeScriptVersion: "5.0.0";
  /** Breaking changes from previous versions */
  breakingChanges: {
    /** Version that introduced breaking changes */
    fromVersion: "2.x";
    /** List of breaking changes */
    changes: [
      "Migrated from Tailwind to CSS variables",
      "Updated Props interface structure",
      "Enhanced accessibility attributes",
      "Improved internationalization support",
    ];
  };
  /** Deprecated features */
  deprecated: string[];
  /** Planned future changes */
  roadmap: [
    "Enhanced platform support (YouTube Music, Tidal)",
    "Dynamic playlist detection",
    "Advanced keyboard shortcuts",
    "Playlist preview integration",
  ];
}

/**
 * Type guard to check if an object is a valid CategoryWithPlaylists
 *
 * @param obj - Object to validate
 * @returns True if object is a valid CategoryWithPlaylists
 *
 * @example
 * ```typescript
 * if (isCategoryWithPlaylists(userInput)) {
 *   // userInput is now typed as CategoryWithPlaylists
 * }
 * ```
 */
export function isCategoryWithPlaylists(obj: unknown): obj is CategoryWithPlaylists {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const o = obj as Partial<Record<string, unknown>>;
  const spotifyOk = typeof o.spotifyPlaylist === "string" || o.spotifyPlaylist === undefined;
  const deezerOk = typeof o.deezerPlaylist === "string" || o.deezerPlaylist === undefined;
  const appleOk = typeof o.appleMusicPlaylist === "string" || o.appleMusicPlaylist === undefined;
  return spotifyOk && deezerOk && appleOk;
}

/**
 * Validates if a URL is a valid platform playlist URL
 *
 * @param url - URL to validate
 * @param platform - Platform to validate against
 * @returns True if URL is valid for the specified platform
 *
 * @example
 * ```typescript
 * const isValid = isValidPlaylistUrl(
 *   "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
 *   "spotify"
 * ); // returns true
 * ```
 */
export function isValidPlaylistUrl(url: string, platform: MusicPlatform): boolean {
  const patterns = {
    spotify: /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+$/,
    deezer: /^https:\/\/www\.deezer\.com\/playlist\/[0-9]+$/,
    apple: /^https:\/\/music\.apple\.com\/playlist\/pl\.[a-zA-Z0-9]+$/,
  };

  return patterns[platform].test(url);
}

/**
 * Gets the available platforms for a category
 *
 * @param category - Category to analyze
 * @returns Array of available platform names
 *
 * @example
 * ```typescript
 * const platforms = getAvailablePlatforms({
 *   spotifyPlaylist: "https://spotify.com/...",
 *   deezerPlaylist: undefined,
 *   appleMusicPlaylist: "https://music.apple.com/..."
 * }); // returns ['spotify', 'apple']
 * ```
 */
export function getAvailablePlatforms(category: CategoryWithPlaylists): MusicPlatform[] {
  const platforms: MusicPlatform[] = [];

  if (category.spotifyPlaylist) {
    platforms.push("spotify");
  }
  if (category.deezerPlaylist) {
    platforms.push("deezer");
  }
  if (category.appleMusicPlaylist) {
    platforms.push("apple");
  }

  return platforms;
}

/**
 * Type export for backward compatibility
 * @deprecated Use MusicButtonsProps instead
 */
export type Props = MusicButtonsProps;
