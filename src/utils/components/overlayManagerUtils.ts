/**
 * Simple Overlay Manager
 * Replaces the over-engineered class-based approach
 */

interface OverlayManagerState {
  previousFocus: Element | null;
  activeOverlay: HTMLElement | null;
}

const state: OverlayManagerState = {
  previousFocus: null,
  activeOverlay: null,
};

/**
 * Initialize overlay management
 */
export function initOverlayManager(): void {
  const overlays = document.querySelectorAll<HTMLElement>(
    '[role="dialog"], [data-overlay]',
  );

  overlays.forEach((overlay) => {
    setupOverlay(overlay);
  });

  // Add global event listener for Escape key
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && state.activeOverlay) {
      closeOverlay(state.activeOverlay);
      e.preventDefault();
    }
  });
}

function setupOverlay(_overlay: HTMLElement): void {
  // Create an array of focusable elements within the overlay
  const focusableElements = _overlay.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  // Store trigger elements that open this overlay
  const openTriggers = document.querySelectorAll(
    `[data-opens="${_overlay.id}"]`,
  );
  openTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      state.previousFocus = document.activeElement;
      state.activeOverlay = _overlay;

      // Focus the first element after overlay is visible
      setTimeout(() => {
        if (firstFocusableElement) {
          firstFocusableElement.focus();
        }
      }, 50);
    });
  });

  // Handle focus trap with keyboard navigation
  _overlay.addEventListener("keydown", (e: KeyboardEvent) => {
    // Close on Escape
    if (e.key === "Escape") {
      closeOverlay(_overlay);
      e.preventDefault();
      return;
    }

    // Only handle Tab key for trapping focus
    if (e.key !== "Tab") {
      return;
    }

    // If shift + tab and on first element, move to last element
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    }
    // If tab and on last element, move to first element
    else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  });

  // Find close buttons within overlay
  const closeButtons = _overlay.querySelectorAll("[data-closes]");
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeOverlay(_overlay);
    });
  });
}

function closeOverlay(_overlay: HTMLElement): void {
  // Restore focus to the previous element
  if (state.previousFocus && state.previousFocus instanceof HTMLElement) {
    state.previousFocus.focus();
  }

  // Reset state
  state.previousFocus = null;
  state.activeOverlay = null;
}

/**
 * Auto-initialize overlay manager
 */
export function initOverlayManagerAuto(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOverlayManager);
  } else {
    initOverlayManager();
  }
}
