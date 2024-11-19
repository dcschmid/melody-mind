import { stopAudio } from "../audio/audioControls";

/**
 * Interface representing media elements in the DOM
 * @interface MediaElements
 */
export interface MediaElements {
  /** Audio preview element for playing song snippets */
  audioPreview: HTMLAudioElement;
  /** Source element for the audio preview */
  audioPreviewSource: HTMLSourceElement;
  /** Image element for album cover display */
  overlayCover: HTMLImageElement;
  /** Collection of streaming service links */
  streamingLinks: Partial<Record<StreamingService, HTMLAnchorElement>>;
}

/**
 * Interface representing an album with its media links
 * @interface Album
 */
interface Album {
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
}

/**
 * Enum for supported streaming services
 * @enum {string}
 */
export enum StreamingService {
  SPOTIFY = "spotify",
  DEEZER = "deezer",
  APPLE = "apple",
}

/**
 * Updates all media elements based on album data
 * @param {Album} album - Album data containing links and cover
 * @param {MediaElements} elements - DOM elements for media display
 * @throws {Error} If media update fails
 */
export function updateMedia(album: Album, elements: MediaElements): void {
  if (!elements) {
    console.error("Keine Media-Elemente übergeben");
    return;
  }

  try {
    stopAudio(elements.audioPreview);

    updateAudioAndCover(album, elements);
    updateAllStreamingLinks(album, elements.streamingLinks);
  } catch (error: unknown) {
    console.error("Fehler beim Aktualisieren der Medien:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Medienaktualisierung fehlgeschlagen: ${errorMessage}`);
  }
}

/**
 * Updates audio preview and cover image elements
 * @param {Album} album - Album data containing preview and cover links
 * @param {MediaElements} elements - DOM elements for media display
 */
function updateAudioAndCover(album: Album, elements: MediaElements): void {
  const { preview_link, coverSrc } = album;
  const { audioPreview, audioPreviewSource, overlayCover } = elements;

  if (preview_link) {
    audioPreviewSource.src = preview_link;
    audioPreview.load();
    audioPreview.classList.remove("hidden");
    overlayCover.classList.add("hidden");
  } else if (coverSrc) {
    overlayCover.src = coverSrc;
    overlayCover.classList.remove("hidden");
    audioPreview.classList.add("hidden");
  }
}

/**
 * Updates all streaming service links
 * @param {Album} album - Album data containing streaming links
 * @param {MediaElements['streamingLinks']} streamingLinks - Collection of streaming link elements
 */
function updateAllStreamingLinks(
  album: Album,
  streamingLinks: MediaElements["streamingLinks"],
): void {
  const linkMap = {
    [StreamingService.SPOTIFY]: album.spotify_link,
    [StreamingService.DEEZER]: album.deezer_link,
    [StreamingService.APPLE]: album.apple_music_link,
  };

  Object.entries(linkMap).forEach(([service, url]) => {
    updateStreamingLink(streamingLinks[service as StreamingService], url);
  });
}

/**
 * Updates a single streaming service link
 * @param {HTMLAnchorElement} [linkElement] - The link element to update
 * @param {string} [url] - The new URL for the streaming service
 */
function updateStreamingLink(
  linkElement?: HTMLAnchorElement,
  url?: string,
): void {
  if (!linkElement) return;

  if (url) {
    linkElement.href = url;
    linkElement.style.display = "inline-block";
  } else {
    linkElement.style.display = "none";
  }
}

/**
 * Initializes and collects all media elements from the DOM
 * @returns {MediaElements | null} Collection of media elements or null if initialization fails
 * @throws {Error} If required elements are not found in the DOM
 */
export function initializeMediaElements(): MediaElements | null {
  try {
    const audioPreview = document.getElementById(
      "audio-preview",
    ) as HTMLAudioElement;
    const audioPreviewSource = document.getElementById(
      "audio-preview-source",
    ) as HTMLSourceElement;
    const overlayCover = document.getElementById(
      "overlay-cover",
    ) as HTMLImageElement;
    const spotifyLink = document.getElementById(
      "spotify-link",
    ) as HTMLAnchorElement;
    const deezerLink = document.getElementById(
      "deezer-link",
    ) as HTMLAnchorElement;
    const appleLink = document.getElementById(
      "apple-link",
    ) as HTMLAnchorElement;

    if (!audioPreview || !audioPreviewSource || !overlayCover) {
      throw new Error("Erforderliche Media-Elemente nicht gefunden");
    }

    return {
      audioPreview,
      audioPreviewSource,
      overlayCover,
      streamingLinks: {
        spotify: spotifyLink,
        deezer: deezerLink,
        apple: appleLink,
      },
    };
  } catch (error) {
    console.error("Fehler beim Initialisieren der Media-Elemente:", error);
    return null;
  }
}
