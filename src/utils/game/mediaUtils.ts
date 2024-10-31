import { stopAudio } from "../audio/audioControls";

export interface MediaElements {
  audioPreview: HTMLAudioElement;
  audioPreviewSource: HTMLSourceElement;
  overlayCover: HTMLImageElement;
  streamingLinks: {
    spotify?: HTMLAnchorElement;
    deezer?: HTMLAnchorElement;
    apple?: HTMLAnchorElement;
  };
}

interface Album {
  preview_link?: string;
  coverSrc?: string;
  spotify_link?: string;
  deezer_link?: string;
  apple_music_link?: string;
}

/**
 * Aktualisiert die Medienelemente (Audio/Cover und Streaming-Links) basierend auf den Album-Daten
 * @param album - Album-Daten mit Links und Cover
 * @param elements - DOM-Elemente für Media-Anzeige
 */
export function updateMedia(album: Album, elements: MediaElements): void {
  try {
    // Stoppe zuerst die Audio-Wiedergabe
    stopAudio(elements.audioPreview);

    // Aktualisiere Audio/Cover
    if (album.preview_link) {
      elements.audioPreviewSource.src = album.preview_link;
      elements.audioPreview.load();
      elements.audioPreview.classList.remove("hidden");
      elements.overlayCover.classList.add("hidden");
    } else if (album.coverSrc) {
      elements.overlayCover.src = album.coverSrc;
      elements.overlayCover.classList.remove("hidden");
      elements.audioPreview.classList.add("hidden");
    }

    // Aktualisiere Streaming-Links
    updateStreamingLink(elements.streamingLinks.spotify, album.spotify_link);
    updateStreamingLink(elements.streamingLinks.deezer, album.deezer_link);
    updateStreamingLink(elements.streamingLinks.apple, album.apple_music_link);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Medien:", error);
  }
}

/**
 * Aktualisiert einen einzelnen Streaming-Link
 * @param linkElement - Das Link-Element
 * @param url - Die neue URL
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
 * Initialisiert die Media-Elements-Sammlung
 * @returns MediaElements-Objekt oder null bei Fehler
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
