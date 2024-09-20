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
  const spotifyLink = document.querySelector(
    "#overlay .music-links .spotifyUrl",
  ) as HTMLAnchorElement;
  const appleMusicLink = document.querySelector(
    "#overlay .music-links .appleMusicUrl",
  ) as HTMLAnchorElement;
  const deezerLink = document.querySelector(
    "#overlay .music-links .deezerUrl",
  ) as HTMLAnchorElement;

  // Update the overlay elements
  overlayCover.src = album.coverSrc || "";
  document.getElementById("overlay-artist")!.textContent = album.artist || "";
  document.getElementById("overlay-album")!.textContent = album.album || "";
  document.getElementById("overlay-funfact")!.textContent =
    question.trivia || "";
  document.getElementById("overlay-year")!.textContent = album.year || "";

  // Update the music links
  updateMusicLink(spotifyLink, album.spotifyUrl);
  updateMusicLink(appleMusicLink, album.appleMusicUrl);
  updateMusicLink(deezerLink, album.deezerUrl);

  // Show the overlay
  document.getElementById("overlay")!.classList.remove("hidden");
}
