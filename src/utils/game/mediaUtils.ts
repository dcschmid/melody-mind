/**
 * Media Utilities for the Music Quiz Game
 *
 * This module provides utilities for managing media elements in the music quiz game,
 * including audio previews, album covers, and streaming service links. It handles
 * the initialization, updating, and management of all media-related functionality.
 *
 * @module mediaUtils
 */

import { stopAudio } from "../audio/audioControls";

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
 * and controlling media in the game interface.
 *
 * @interface MediaElements
 */
export interface MediaElements {
  /** Audio element for playing song previews */
  audioPreview: HTMLAudioElement;
  /** Source element for the audio preview */
  audioPreviewSource: HTMLSourceElement;
  /** Image element for album cover display */
  overlayCover: HTMLImageElement;
  /** Collection of streaming service links (accessible buttons) */
  streamingLinks: Partial<Record<StreamingService, HTMLButtonElement>>;
}

/**
 * Interface representing an album with its media links
 *
 * Contains all the media-related information for an album, including
 * preview audio, cover image, and streaming service links.
 *
 * @interface Album
 */
export interface Album {
  /** URL for the audio preview snippet */
  preview_link?: string;
  /** URL for the album cover image */
  coverSrc?: string;
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
  [key: string]: any;
}

/**
 * Updates all media elements based on album data
 *
 * This function updates the audio preview, cover image, and streaming links
 * for a given album. It first stops any currently playing audio, then updates
 * each element with the appropriate content.
 *
 * @param {Album} album - Album data containing links and cover
 * @param {MediaElements} elements - DOM elements for media display
 * @throws {Error} If media update fails
 */
export function updateMedia(album: Album, elements: MediaElements): void {
  if (!elements) {
    console.error("No media elements provided");
    return;
  }

  try {
    // Stop any currently playing audio
    stopAudio(elements.audioPreview);

    // Update audio preview and cover image
    updateAudioAndCover(album, elements);

    // Update all streaming service links
    updateAllStreamingLinks(album, elements.streamingLinks);

    // Set accessibility attributes
    setAccessibilityAttributes(album, elements);
  } catch (error: unknown) {
    console.error("Error updating media:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Media update failed: ${errorMessage}`);
  }
}

/**
 * Updates audio preview and cover image elements
 *
 * This function handles updating the audio and image elements based on
 * the available media in the album object. It shows/hides elements as needed.
 *
 * @param {Album} album - Album data containing preview and cover links
 * @param {MediaElements} elements - DOM elements for media display
 * @private
 */
function updateAudioAndCover(album: Album, elements: MediaElements): void {
  const { preview_link, coverSrc } = album;
  const { audioPreview, audioPreviewSource, overlayCover } = elements;

  // First reset all elements
  audioPreview.classList.add("hidden");
  overlayCover.classList.add("hidden");

  // Update and show audio preview if available
  if (preview_link) {
    audioPreviewSource.src = preview_link;
    audioPreview.load();
    audioPreview.classList.remove("hidden");
  }

  // Update and show cover image if available
  if (coverSrc) {
    overlayCover.src = coverSrc;
    overlayCover.classList.remove("hidden");

    // Set alt text if artist and album info are available
    if (album.artist && album.album) {
      overlayCover.alt = `Album cover for ${album.album} by ${album.artist}`;
    } else {
      overlayCover.alt = "Album cover";
    }
  }
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
function updateAllStreamingLinks(
  album: Album,
  streamingLinks: MediaElements["streamingLinks"]
): void {
  // Create a mapping of services to their URLs
  const linkMap = {
    [StreamingService.SPOTIFY]: album.spotify_link,
    [StreamingService.DEEZER]: album.deezer_link,
    [StreamingService.APPLE]: album.apple_music_link,
  };

  // Update each service link
  Object.entries(linkMap).forEach(([service, url]) => {
    updateStreamingLink(streamingLinks[service as StreamingService], url, album);
  });
}

/**
 * Sets accessibility attributes for media elements
 *
 * Adds appropriate ARIA attributes and labels to media elements
 * to improve accessibility for screen readers.
 *
 * @param {Album} album - Album data with title and artist information
 * @param {MediaElements} elements - DOM elements to update
 * @private
 */
function setAccessibilityAttributes(album: Album, elements: MediaElements): void {
  const { audioPreview, overlayCover } = elements;
  const artistAndAlbum =
    album.artist && album.album ? `${album.album} by ${album.artist}` : "this album";

  // Add accessibility attributes to audio player
  if (!audioPreview.hasAttribute("aria-label")) {
    audioPreview.setAttribute("aria-label", `Audio preview for ${artistAndAlbum}`);
  }

  audioPreview.setAttribute("data-artist", album.artist || "");
  audioPreview.setAttribute("data-album", album.album || "");

  // Add accessibility attributes to cover image
  if (overlayCover && !overlayCover.classList.contains("hidden")) {
    overlayCover.setAttribute("role", "img");
    overlayCover.setAttribute("aria-label", `Album cover for ${artistAndAlbum}`);
  }
}

/**
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
function updateStreamingLink(linkElement?: HTMLButtonElement, url?: string, album?: Album): void {
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

/**
 * Initializes and collects all media elements from the DOM
 *
 * This function finds and initializes all media-related elements in the DOM
 * and returns them as a MediaElements object for use in the game.
 *
 * @returns {MediaElements | null} Collection of media elements or null if initialization fails
 * @throws {Error} If required elements are not found in the DOM
 */
export function initializeMediaElements(): MediaElements | null {
  try {
    // Find all required elements in the DOM
    const audioPreview = document.getElementById("audio-preview") as HTMLAudioElement;
    const audioPreviewSource = document.getElementById("audio-preview-source") as HTMLSourceElement;
    const overlayCover = document.getElementById("overlay-cover") as HTMLImageElement;

    // Find streaming link elements (converted to buttons for accessibility)
    const spotifyLink = document.getElementById("spotify-link") as HTMLButtonElement;
    const deezerLink = document.getElementById("deezer-link") as HTMLButtonElement;
    const appleLink = document.getElementById("apple-link") as HTMLButtonElement;

    // Validate required elements
    if (!audioPreview || !audioPreviewSource || !overlayCover) {
      throw new Error("Required media elements not found");
    }

    // Set initial accessibility attributes
    audioPreview.setAttribute("aria-label", "Audio preview");
    overlayCover.setAttribute("role", "img");
    overlayCover.setAttribute("aria-label", "Album cover");

    // Configure audio element
    audioPreview.preload = "metadata";

    // Return initialized media elements
    return {
      audioPreview,
      audioPreviewSource,
      overlayCover,
      streamingLinks: {
        [StreamingService.SPOTIFY]: spotifyLink,
        [StreamingService.DEEZER]: deezerLink,
        [StreamingService.APPLE]: appleLink,
      },
    };
  } catch (error) {
    console.error("Error initializing media elements:", error);
    return null;
  }
}

/**
 * Updates the AudioPlayer component with album data
 *
 * This function finds the AudioPlayer component and updates its audio source
 * and cover image to match the current album being displayed.
 *
 * @param {Album} album - Album data containing preview link and cover
 */
export function updateAudioPlayer(album: Album): void {
  try {
    // Find the AudioPlayer component container
    const audioPlayerContainer = document.querySelector(".audio-container .audio-player");
    if (!audioPlayerContainer) {
      return;
    }

    // Find the controls container with data attributes
    const controlsContainer = audioPlayerContainer.querySelector("[data-audio-src]");
    if (controlsContainer && album.preview_link) {
      controlsContainer.setAttribute("data-audio-src", album.preview_link);
    }

    // Find and update the actual audio element
    const audioElement = audioPlayerContainer.querySelector("audio") as HTMLAudioElement;
    if (audioElement && album.preview_link) {
      // Update source if available
      const audioSource = audioElement.querySelector("source") as HTMLSourceElement;
      if (audioSource) {
        audioSource.src = album.preview_link;
        audioSource.type = "audio/mpeg";
      } else {
        // Create source element if it doesn't exist
        const newSource = document.createElement("source");
        newSource.src = album.preview_link;
        newSource.type = "audio/mpeg";
        audioElement.appendChild(newSource);
      }

      // Reload audio with new source
      audioElement.load();
    }

    // Find and update the cover image
    const coverImage = audioPlayerContainer.querySelector(
      ".audio-player__cover"
    ) as HTMLImageElement;
    if (coverImage && album.coverSrc) {
      coverImage.src = album.coverSrc;

      // Set appropriate alt text
      if (album.artist && album.album) {
        coverImage.alt = `Album cover for ${album.album} by ${album.artist}`;
      } else {
        coverImage.alt = "Album cover";
      }
    }
  } catch (error: unknown) {
    console.error("Failed to update AudioPlayer:", error);
  }
}
