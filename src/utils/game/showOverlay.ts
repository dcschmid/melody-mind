import { updateMusicLink } from "./updateMusicLink";

/**
 * Shows the overlay with information about the album.
 *
 * @param {object} question - The question object.
 * @param {object} album - The album object.
 */
export function showOverlay(question: any, album: any) {
  // Get the overlay elements
  const overlayCover = document.getElementById(
    "overlay-cover",
  ) as HTMLImageElement;

  // Update the overlay elements
  overlayCover.src = album.coverSrc || "";
  document.getElementById("overlay-artist")!.textContent = album.artist || "";
  document.getElementById("overlay-album")!.textContent = album.album || "";
  document.getElementById("overlay-funfact")!.textContent =
    question.trivia || "";
  document.getElementById("overlay-year")!.textContent = album.year || "";

  // Show the overlay
  document.getElementById("overlay")!.classList.remove("hidden");
}
