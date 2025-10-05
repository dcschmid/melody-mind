/**
 * getEndOverlayRoot
 * Returns the primary EndOverlay root element if present.
 * Falls back to a generic popup selector with data-score attribute.
 */
export function getEndOverlayRoot(): HTMLElement | null {
  if (typeof document === "undefined") {
    return null;
  }
  const direct = document.getElementById("endgame-popup");
  if (direct) {
    return direct;
  }
  return document.querySelector<HTMLElement>(".popup[data-score]");
}
