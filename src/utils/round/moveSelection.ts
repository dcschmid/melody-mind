import { updateButtonState } from "./updateButtonState";

/**
 * Moves the selected cover element in the specified direction.
 * If the move is valid, the selected cover is inserted before the reference node.
 * The up and down buttons are updated accordingly.
 *
 * @param {number} direction - The direction to move the selected cover.
 * Negative for up, positive for down.
 * @param {HTMLElement | null} selectedCover - The currently selected cover element.
 * @param {HTMLElement} upButton - The up button element.
 * @param {HTMLElement} downButton - The down button element.
 */
export function moveSelection(
  direction: number,
  selectedCover: HTMLElement | null,
  upButton: HTMLElement,
  downButton: HTMLElement,
) {
  // If no cover is selected, return early
  if (!selectedCover) return;

  // Get the parent element of the selected cover
  const parent = selectedCover.parentElement!;

  // Get the index of the selected cover within its parent
  const index = Array.from(parent.children).indexOf(selectedCover);

  // Calculate the new index after moving in the specified direction
  const newIndex = index + direction;

  // If the new index is within the valid range, move the selected cover
  if (newIndex >= 0 && newIndex < parent.children.length) {
    // Determine the reference node based on the direction
    const referenceNode =
      direction === -1
        ? parent.children[newIndex] // Use the new index as the reference node if moving up
        : parent.children[newIndex].nextSibling; // Use the next sibling of the new index as the reference node if moving down

    // Insert the selected cover before the reference node
    parent.insertBefore(selectedCover, referenceNode);

    // Update the index of the selected cover
    selectedCover.dataset.index = index as unknown as string;

    // Update the state of the up and down buttons
    updateButtonState(selectedCover, upButton, downButton);
  }
}
