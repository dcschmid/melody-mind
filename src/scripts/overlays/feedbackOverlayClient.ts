/**
 * Feedback Overlay Client Script (extracted from FeedbackOverlay.astro)
 * Provides accessible modal feedback interactions after each round.
 */

/**
 * Initialize the feedback overlay behaviors.
 * @param {string} buttonId ID of the next-round button inside the overlay.
 */
export function initFeedbackOverlay(buttonId: string): void {
  const overlay = document.getElementById("overlay");
  const closeButton = document.getElementById("close-overlay-button");
  const backdrop = document.getElementById("overlay-backdrop");
  const nextButton = document.getElementById(buttonId);

  function hideOverlay(): void {
    overlay?.classList.add("hidden");
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && overlay && !overlay.classList.contains("hidden")) {
      event.preventDefault();
      hideOverlay();
    }
  }

  function focusWhenVisible(): void {
    if (!overlay || overlay.classList.contains("hidden")) {
      return;
    }
    window.requestAnimationFrame(() => {
      (closeButton as HTMLElement | null)?.focus?.();
    });
  }

  closeButton?.addEventListener("click", hideOverlay);
  backdrop?.addEventListener("click", hideOverlay);
  nextButton?.addEventListener("click", () => hideOverlay());

  document.addEventListener("keydown", handleKeydown);

  if (overlay) {
    const observer = new MutationObserver(() => focusWhenVisible());
    observer.observe(overlay, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("unload", () => {
      document.removeEventListener("keydown", handleKeydown);
      observer.disconnect();
    });
  }
}
