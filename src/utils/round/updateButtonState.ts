/**
 * Updates the state of the up and down buttons based on the currently selected cover.
 *
 * @param {HTMLElement} selectedCover - The currently selected cover element.
 * @param {HTMLElement} upButton - The up button element.
 * @param {HTMLElement} downButton - The down button element.
 */
export function updateButtonState(selectedCover: HTMLElement, upButton: HTMLElement, downButton: HTMLElement): void {
  // Get the parent element of the selected cover
  const parent = selectedCover.parentElement!;

  // Get the index of the selected cover within its parent
  const index = Array.from(parent.children).indexOf(selectedCover);

  // Toggle the "disabled" class on the up button based on whether the selected cover is the first child
  // If the selected cover is the first child, add the "disabled" class to the up button
  // Otherwise, remove the "disabled" class from the up button
  upButton.classList.toggle("disabled", index === 0);

  // Toggle the "disabled" class on the down button based on whether the selected cover is within the last three children
  // If the selected cover is within the last three children, add the "disabled" class to the down button
  // Otherwise, remove the "disabled" class from the down button
  downButton.classList.toggle("disabled", index >= parent.children.length - 2);
}
