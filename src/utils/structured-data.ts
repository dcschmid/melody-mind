/**
 * @fileoverview Utility functions for generating structured data objects
 * @description This module provides reusable functions to create Schema.org
 * structured data for SEO optimization, particularly for audio playlists
 * and educational content.
 */

/**
 * Platform configuration for music streaming services
 */
interface MusicPlatform {
  name: string;
  domain: string;
  encodingFormat: string;
}

/**
 * Supported music streaming platforms
 */
const MUSIC_PLATFORMS: Record<string, MusicPlatform> = {
  spotify: {
    name: "Spotify",
    domain: "https://spotify.com",
    encodingFormat: "audio/mpeg",
  },
  deezer: {
    name: "Deezer",
    domain: "https://deezer.com",
    encodingFormat: "audio/mpeg",
  },
  appleMusic: {
    name: "Apple Music",
    domain: "https://music.apple.com",
    encodingFormat: "audio/mpeg",
  },
} as const;

/**
 * Educational level mapping for structured data
 */
const EDUCATIONAL_LEVELS: Record<string, string> = {
  easy: "beginner",
  medium: "intermediate",
  hard: "advanced",
} as const;

/**
 * Creates a ListenAction structured data object for a music platform
 *
 * @param {string} playlistUrl - The URL of the playlist
 * @param {string} title - The title for the action
 * @param {keyof typeof MUSIC_PLATFORMS} platformKey - The platform key (spotify, deezer, appleMusic)
 * @returns {object} Schema.org ListenAction object
 */
export function createListenAction(
  playlistUrl: string,
  title: string,
  platformKey: keyof typeof MUSIC_PLATFORMS
): object {
  const platform = MUSIC_PLATFORMS[platformKey];

  return {
    "@type": "ListenAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: playlistUrl,
      actionPlatform: platform.domain,
    },
    name: `${title} - Listen on ${platform.name}`,
  };
}

/**
 * Creates an AudioObject structured data object for a music platform
 *
 * @param {string} playlistUrl - The URL of the playlist
 * @param {string} title - The title of the content
 * @param {keyof typeof MUSIC_PLATFORMS} platformKey - The platform key (spotify, deezer, appleMusic)
 * @param {string} uploadDate - ISO string of upload date
 * @returns {object} Schema.org AudioObject
 */
export function createAudioObject(
  playlistUrl: string,
  title: string,
  platformKey: keyof typeof MUSIC_PLATFORMS,
  uploadDate: string
): object {
  const platform = MUSIC_PLATFORMS[platformKey];

  return {
    "@type": "AudioObject",
    contentUrl: playlistUrl,
    encodingFormat: platform.encodingFormat,
    name: `${title} - ${platform.name} Playlist`,
    description: `${platform.name} Playlist for ${title}`,
    uploadDate,
    duration: "PT0H0M0S", // Placeholder duration
    potentialAction: {
      "@type": "ListenAction",
      target: playlistUrl,
    },
  };
}

/**
 * Generates potential actions array for all available playlists
 *
 * @param {object} playlists - Object containing playlist URLs for different platforms
 * @param {string} title - The title for the actions
 * @returns {object[]} Array of ListenAction objects
 */
export function generatePotentialActions(
  playlists: {
    spotifyPlaylist?: string;
    deezerPlaylist?: string;
    appleMusicPlaylist?: string;
  },
  title: string
): object[] {
  const actions = [];

  if (playlists.spotifyPlaylist) {
    actions.push(createListenAction(playlists.spotifyPlaylist, title, "spotify"));
  }

  if (playlists.deezerPlaylist) {
    actions.push(createListenAction(playlists.deezerPlaylist, title, "deezer"));
  }

  if (playlists.appleMusicPlaylist) {
    actions.push(createListenAction(playlists.appleMusicPlaylist, title, "appleMusic"));
  }

  return actions;
}

/**
 * Generates audio objects array for all available playlists
 *
 * @param {object} playlists - Object containing playlist URLs for different platforms
 * @param {string} title - The title of the content
 * @param {string} uploadDate - ISO string of upload date
 * @returns {object[]} Array of AudioObject objects
 */
export function generateAudioObjects(
  playlists: {
    spotifyPlaylist?: string;
    deezerPlaylist?: string;
    appleMusicPlaylist?: string;
  },
  title: string,
  uploadDate: string
): object[] {
  const audioObjects = [];

  if (playlists.spotifyPlaylist) {
    audioObjects.push(createAudioObject(playlists.spotifyPlaylist, title, "spotify", uploadDate));
  }

  if (playlists.deezerPlaylist) {
    audioObjects.push(createAudioObject(playlists.deezerPlaylist, title, "deezer", uploadDate));
  }

  if (playlists.appleMusicPlaylist) {
    audioObjects.push(
      createAudioObject(playlists.appleMusicPlaylist, title, "appleMusic", uploadDate)
    );
  }

  return audioObjects;
}

/**
 * Converts difficulty level to educational level for structured data
 *
 * @param {string | undefined} difficulty - The difficulty level string
 * @returns {string} Educational level string suitable for Schema.org
 */
export function getEducationalLevel(difficulty?: string): string {
  if (!difficulty) {
    return "beginner";
  }

  return EDUCATIONAL_LEVELS[difficulty.toLowerCase()] || "beginner";
}

/**
 * Creates a complete breadcrumb list for knowledge articles
 *
 * @param {string} lang - Language code
 * @param {string} title - Article title
 * @param {URL} url - Current page URL
 * @param {function} translate - Translation function
 * @returns {object} Schema.org BreadcrumbList object
 */
export function createBreadcrumbList(
  lang: string,
  title: string,
  url: URL,
  translate: (key: string, fallback?: string) => string
): object {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: translate("nav.home", "Home"),
        item: new URL(`/${lang}`, url.origin).href,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: translate("knowledge.title", "Knowledge"),
        item: new URL(`/${lang}/knowledge`, url.origin).href,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url.href,
      },
    ],
  };
}
