
/**
 * Updates the state of the up and down buttons based on the currently selected cover.
 *
 * @param selectedCover - The currently selected cover element.
 * @param upButton - The up button element.
 * @param downButton - The down button element.
 */
export function updateButtonState(selectedCover: HTMLElement, upButton: HTMLElement, downButton: HTMLElement) {
  // Get the parent element of the selected cover
  const parent = selectedCover.parentElement!;
  // Get the index of the selected cover within its parent
  const index = Array.from(parent.children).indexOf(selectedCover);

  // Toggle the "disabled" class on the up button based on whether the selected cover is the first child
  upButton.classList.toggle("disabled", index === 0);
  // Toggle the "disabled" class on the down button based on whether the selected cover is within the last three children
  downButton.classList.toggle("disabled", index >= parent.children.length - 3);
}
