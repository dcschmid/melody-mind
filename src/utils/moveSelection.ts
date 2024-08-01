import { updateButtonState } from "./updateButtonState";

/**
 * Moves the selected cover element in the specified direction.
 * If the move is valid, the selected cover is inserted before the reference node.
 * The up and down buttons are updated accordingly.
 *
 * @param direction - The direction to move the selected cover. Negative for up, positive for down.
 * @param selectedCover - The cover element to be moved.
 * @param upButton - The up button element.
 * @param downButton - The down button element.
 * @return {void}
 */
export function moveSelection(direction: number, selectedCover: HTMLElement, upButton: HTMLElement, downButton: HTMLElement) {
  if (!selectedCover) return;

  const parent = selectedCover.parentElement!;
  const children = parent.children;
  const index = selectedCover.dataset.index as unknown as number;
  const newIndex = index + direction;

  if (newIndex >= 0 && newIndex < children.length) {
    const referenceNode = children[newIndex];
    parent.insertBefore(selectedCover, referenceNode);
    selectedCover.dataset.index = newIndex.toString();

    updateButtonState(selectedCover, upButton, downButton);
  }
}
