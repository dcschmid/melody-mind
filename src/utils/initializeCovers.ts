import { moveSelection } from './moveSelection';
import { updateButtonState } from './updateButtonState';

/**
 * Initializes the covers by setting up event listeners for each cover,
 * handling clicks and updating the selected cover and audio.
 *
 * @param upButton - The up button element.
 * @param downButton - The down button element.
 * @param showButtons - The show buttons element.
 * @returns {void}
 */
export function initializeCovers(upButton: HTMLElement, downButton: HTMLElement, showButtons: HTMLElement | null) {
  // The currently selected cover element
  let selectedCover: HTMLElement | null = null;
  // The currently playing audio element
  let currentAudio: HTMLAudioElement | null = null;

  // Get all cover elements
  const covers = document.querySelectorAll(".cover");

  // Add click event listener to each cover
  covers.forEach((cover) => {
    cover.addEventListener("click", () => {
      // Show the buttons
      showButtons!.style.display = "inline-flex";

      // Clear the selected class from the previously selected cover
      selectedCover?.classList.remove("selected");
      // Pause the currently playing audio
      currentAudio?.pause();

      // Set the selected cover to the clicked cover
      selectedCover = cover as HTMLElement;
      // Add the selected class to the clicked cover
      cover.classList.add("selected");

      // Get the band attribute of the clicked cover
      const band = cover.getAttribute("data-band")!;
      // Get the audio element with the corresponding id
      currentAudio = document.getElementById(`audio-${band}`) as HTMLAudioElement | null;

      // Play the audio if it exists
      if (currentAudio) {
        currentAudio.play();
      }

      // Update the state of the up and down buttons
      updateButtonState(selectedCover!, upButton, downButton);
    });
  });

  // Add click event listeners to up and down buttons
  upButton.addEventListener("click", () => moveSelection(-1, selectedCover!, upButton, downButton));
  downButton.addEventListener("click", () => moveSelection(1, selectedCover!, upButton, downButton));
}
