/**
 * Lightweight helper for announcing dynamic status messages via a shared aria-live region.
 * Avoids duplicating multiple invisible nodes when a simple global announcer suffices.
 *
 * Usage:
 * import { announceStatus } from "@utils/accessibility/liveRegion";
 * announceStatus("Playlist loaded");
 *
 * The helper will lazily create a single <div id="app-live-region" aria-live="polite" aria-atomic="true" class="sr-only"></div>
 * and reuse it. For urgent messages pass { assertive: true }.
 */
export interface AnnounceOptions {
  /** Use assertive politeness (default polite) */
  assertive?: boolean;
  /** Force reflow technique to retrigger screen reader announcement (default true) */
  refresh?: boolean;
}

const REGION_ID = "app-live-region";

function getOrCreateRegion(assertive: boolean): HTMLElement {
  let node = document.getElementById(REGION_ID);
  if (!node) {
    node = document.createElement("div");
    node.id = REGION_ID;
    node.className = "sr-only";
    node.setAttribute("aria-atomic", "true");
    document.body.appendChild(node);
  }
  node.setAttribute("aria-live", assertive ? "assertive" : "polite");
  return node;
}

/**
 * Announce a message to assistive technology.
 * Gracefully no-ops on server / non-DOM environments.
 */
export function announceStatus(message: string, options: AnnounceOptions = {}): void {
  if (typeof document === "undefined") {
    return;
  }
  const { assertive = false, refresh = true } = options;
  const region = getOrCreateRegion(assertive);
  if (refresh) {
    // Clear then force reflow to ensure repeated identical messages are announced
    region.textContent = "";
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    region.offsetHeight; // force reflow
  }
  region.textContent = message;
}

export default announceStatus;
