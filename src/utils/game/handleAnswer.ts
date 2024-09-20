import { updateMusicLink } from "./updateMusicLink";

/**
 * Handles the user's answer to a question.
 * @param {boolean} option - The user's answer.
 * @param {any} correctAnswer - The correct answer.
 * @param {any} currentQuestion - The current question.
 * @param {any} album - The current album.
 * @param {HTMLParagraphElement} feedbackElement - The feedback element to be updated.
 * @param {number} score - The current score.
 * @param {Function} updateScoreDisplay - A function to update the score display.
 * @param {Object} overlayElements - An object with elements to be updated with additional information about the album.
 * @param {Object} links - An object with links to be updated to the album.
 */
export function handleAnswer(
  option: boolean,
  correctAnswer: any,
  currentQuestion: any,
  album: any,
  feedbackElement: HTMLParagraphElement,
  score: number,
  updateScoreDisplay: Function,
  overlayElements: {
    overlayCover: HTMLImageElement;
    artist: HTMLParagraphElement;
    album: HTMLParagraphElement;
    year: HTMLParagraphElement;
    funfact: HTMLParagraphElement;
  },
  links: {
    spotifyLink: HTMLAnchorElement;
    appleMusicLink: HTMLAnchorElement;
    deezerLink: HTMLAnchorElement;
  },
): void {
  let bonusPoints = 0;
  const endTime = Date.now();
  const timeTaken = (endTime - startTime) / 1000;

  if (option === correctAnswer) {
    // The user answered correctly
    if (timeTaken <= 10) {
      // The user answered quickly
      bonusPoints = 50;
    } else if (timeTaken <= 15) {
      // The user answered somewhat quickly
      bonusPoints = 25;
    }

    // Update the score
    score += 50 + bonusPoints;
    // Update the feedback element
    feedbackElement.classList.add("correct");
    feedbackElement.textContent = `Richtig! 50 Punkte + ${bonusPoints} Bonuspunkte`;
  } else {
    // The user answered incorrectly
    feedbackElement.classList.add("incorrect");
    feedbackElement.textContent = `Falsch! Die richtige Antwort war: ${correctAnswer}`;
  }

  // Show the feedback element
  feedbackElement.classList.add("show");
  // Hide the feedback element after 3 seconds
  setTimeout(() => {
    feedbackElement.classList.remove("show", "correct", "incorrect");
  }, 3000);

  // Update the score display
  updateScoreDisplay(score);

  // Update the overlay elements with additional information about the album
  overlayElements.overlayCover.src = album.coverSrc || "";
  overlayElements.artist.textContent = album.artist || "";
  overlayElements.album.textContent = album.album || "";
  overlayElements.year.textContent = album.year || "";
  overlayElements.funfact.textContent = currentQuestion.trivia || "";

  // Update the links with the correct URLs
  updateMusicLink(links.spotifyLink, album.spotifyUrl);
  updateMusicLink(links.appleMusicLink, album.appleMusicUrl);
  updateMusicLink(links.deezerLink, album.deezerUrl);

  // Show the overlay
  document.getElementById("overlay")!.classList.remove("hidden");
}
