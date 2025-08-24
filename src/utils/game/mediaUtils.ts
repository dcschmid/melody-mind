import { handleGameError } from "../error/errorHandlingUtils";

/**
 * Media Utilities for the Music Quiz Game
 *
 * This module provides utilities for managing media elements in the music quiz game,
 * including streaming service links. Audio previews and album covers are optional
 * for legal compliance. It handles the initialization, updating, and management
 * of all media-related functionality.
 *
 * @module mediaUtils
 */

/**
 * Supported streaming services that can be linked to in the game
 *
 * @enum {string}
 */
export enum StreamingService {
  /** Spotify streaming service */
  SPOTIFY = "spotify",
  /** Deezer streaming service */
  DEEZER = "deezer",
  /** Apple Music streaming service */
  APPLE = "apple",
}

/**
 * Interface representing media elements in the DOM
 *
 * Contains references to all the HTML elements needed for displaying
 * streaming service links in the game interface.
 *
 * @interface MediaElements
 */
export interface MediaElements {
  /** Collection of streaming service links (accessible buttons) */
  streamingLinks: Partial<Record<StreamingService, HTMLButtonElement>>;
}

/**
 * Interface representing an album with its streaming links
 *
 * Contains all the media-related information for an album, including
 * streaming service links.
 *
 * @interface Album
 */
export interface Album {
  /** Spotify streaming link */
  spotify_link?: string;
  /** Deezer streaming link */
  deezer_link?: string;
  /** Apple Music streaming link */
  apple_music_link?: string;
  /** Artist name (for accessibility) */
  artist?: string;
  /** Album title (for accessibility) */
  album?: string;
  /** Any additional properties */
  [key: string]: unknown;
}

/**
 * Updates all media elements based on album data
 *
 * This function updates the streaming links for a given album.
 * Since streaming links have been removed for legal compliance, this function
 * now performs no operations.
 *
 * @param {Album} album - Album data containing links
 * @param {MediaElements} elements - DOM elements for media display
 */
export function updateMedia(album: Album, elements: MediaElements): void {
  if (!elements) {
    return;
  }

  // No operations needed since streaming links have been removed for legal compliance
}

/**
 * Updates all streaming service links
 *
 * Maps each streaming service to its link in the album data and updates
 * the corresponding DOM elements.
 *
 * @param {Album} album - Album data containing streaming links
 * @param {MediaElements['streamingLinks']} streamingLinks - Collection of streaming link elements
 * @private
 */
// function updateAllStreamingLinks(
//   album: Album,
//   streamingLinks: MediaElements["streamingLinks"]
// ): void {
//   // Create a mapping of services to their URLs
//   const linkMap = {
//     [StreamingService.SPOTIFY]: album.spotify_link,
//   [StreamingService.DEEZER]: album.deezer_link,
//   [StreamingService.APPLE]: album.apple_music_link,
// };

//   // Update each service link
//   Object.entries(linkMap).forEach(([service, url]) => {
//     updateStreamingLink(streamingLinks[service as StreamingService], url, album);
//   });
// }

/*
 * Updates a single streaming service button
 *
 * Sets the URL and visibility of a streaming service button element based
 * on whether a URL is available.
 *
 * @param {HTMLButtonElement} [linkElement] - The button element to update
 * @param {string} [url] - The new URL for the streaming service
 * @param {Album} album - Album data for accessibility information
 * @private
 */
/*
function _updateStreamingLink(linkElement?: HTMLButtonElement, url?: string, album?: Album): void {
  if (!linkElement) {
    return;
  }

  if (url) {
    // Store URL in data attribute for click handling
    linkElement.setAttribute("data-url", url);

    // Add click handler to open URL in new tab
    linkElement.onclick = (): void => {
      window.open(url, "_blank", "noopener,noreferrer");
    };

    // Add accessibility attributes
    if (album?.artist && album?.album) {
      const serviceName = linkElement.id.replace("-link", "");
      linkElement.setAttribute(
        "aria-label",
        `Listen to ${album.album} by ${album.artist} on ${serviceName}`
      );
    }

    // Ensure button is visible and accessible
    linkElement.style.display = "";
    linkElement.removeAttribute("aria-hidden");
  } else {
    linkElement.style.display = "none";
    linkElement.setAttribute("aria-hidden", "true");
    linkElement.removeAttribute("data-url");
    linkElement.onclick = null;
  }
}
*/

/**
 * Initializes and collects all media elements from the DOM
 *
 * This function finds and initializes all streaming service link elements in the DOM
 * and returns them as a MediaElements object for use in the game.
 * Since streaming links have been removed for legal compliance, this function
 * returns an empty MediaElements object.
 *
 * @returns {MediaElements | null} Collection of media elements (empty for legal compliance)
 */
export function initializeMediaElements(): MediaElements | null {
  try {
    // Return empty media elements since streaming links have been removed for legal compliance
    return {
      streamingLinks: {},
    };
  } catch (error) {
    handleGameError(error, "media elements initialization");
    return null;
  }
}
