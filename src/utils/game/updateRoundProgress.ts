/**
 * Updates the round progress text in the game UI.
 *
 * @param roundIndex The current round index.
 * @param totalRounds The total number of rounds.
 * @param roundElement The HTML element that displays the round progress.
 */
export function updateRoundProgress(
  roundIndex: number,
  totalRounds: number,
  roundElement: HTMLElement,
): void {
  roundElement.textContent = `Runde ${roundIndex + 1}/${totalRounds}`;
}
