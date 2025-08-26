/**
 * Simple Chronology Feedback Overlay
 * Replaces the over-engineered class-based approach
 */

interface UserOrderItem {
  position: number;
  artist: string;
  title: string;
  year: number;
  isCorrectPosition: boolean;
}

interface FeedbackData {
  userOrder: UserOrderItem[];
  accuracy?: number;
  scoreGained?: number;
  isLastRound?: boolean;
}

/**
 * Initialize the feedback overlay with simple event handling
 *
 * This refactor extracts smaller helpers to reduce the cognitive complexity of
 * the main initializer while preserving behavior. Helpers are declared at the
 * module level so they are easy to test and keep the exported initializer short.
 */

// Helper: safely get element by id
function getEl(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function bindControlEvents(overlayId: string, onNext: () => void, onEnd: () => void): void {
  const overlay = getEl(overlayId);
  if (!overlay) {return;}

  const backdrop = getEl("chronology-feedback-backdrop");
  const closeButton = getEl("chronology-close-button");
  const nextButton = getEl("chronology-next-button");
  const endButton = getEl("chronology-end-button");

  closeButton?.addEventListener("click", hideOverlay);
  backdrop?.addEventListener("click", hideOverlay);
  nextButton?.addEventListener("click", onNext);
  endButton?.addEventListener("click", onEnd);
}

function attachKeyboardNav(overlay: HTMLElement | null): void {
  if (!overlay) {return;}
  document.addEventListener("keydown", (ev) => {
    try {
      if (!overlay.classList.contains("hidden") && ev.key === "Escape") {
        ev.preventDefault();
        hideOverlay();
      }
    } catch (err) {
      void err;
    }
  });
}

function renderResults(resultsListId: string, userOrder: UserOrderItem[]): void {
  const resultsList = getEl(resultsListId);
  if (!resultsList) {return;}
  resultsList.innerHTML = "";

  userOrder.forEach((item) => {
    const resultItem = document.createElement("div");
    resultItem.className = `flex items-center justify-between rounded-lg border p-4 transition-all duration-200 ${
      item.isCorrectPosition
        ? "border-green-500/50 bg-green-500/10 text-green-100"
        : "border-red-500/50 bg-red-500/10 text-red-100"
    }`;

    resultItem.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold ${
          item.isCorrectPosition
            ? "border-green-500 bg-green-500/20 text-green-400"
            : "border-red-500 bg-red-500/20 text-red-400"
        }">${item.position}</div>
        <div class="flex flex-col">
          <div class="font-semibold text-white">${item.artist}</div>
          <div class="text-sm text-gray-300">${item.title}</div>
          <div class="text-xs text-gray-400">${item.year}</div>
        </div>
      </div>
      <div class="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold ${
        item.isCorrectPosition ? "text-green-400" : "text-red-400"
      }">${item.isCorrectPosition ? "✓" : "✗"}</div>
    `;

    resultsList.appendChild(resultItem);
  });
}

function updateStatsInOverlay(overlayId: string, accuracy?: number, scoreGained?: number): void {
  const overlay = getEl(overlayId);
  if (!overlay) {return;}
  const accuracyElement = overlay.querySelector("#chronology-accuracy");
  const scoreElement = overlay.querySelector("#chronology-score");
  if (accuracyElement && accuracy !== undefined) {
    accuracyElement.textContent = `${accuracy}%`;
  }
  if (scoreElement && scoreGained !== undefined) {
    scoreElement.textContent = `+${scoreGained}`;
  }
}

function setButtonVisibility(
  nextButtonId: string,
  endButtonId: string,
  isLastRound?: boolean
): void {
  const nextButton = getEl(nextButtonId);
  const endButton = getEl(endButtonId);
  if (!nextButton || !endButton) {return;}
  if (isLastRound) {
    nextButton.style.display = "none";
    endButton.style.display = "flex";
  } else {
    nextButton.style.display = "flex";
    endButton.style.display = "none";
  }
}

function showOverlayById(overlayId: string, focusButtonId?: string): void {
  const overlay = getEl(overlayId);
  const focusButton = focusButtonId ? getEl(focusButtonId) : null;
  if (!overlay) {return;}
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  focusButton?.focus();
}

function hideOverlayById(overlayId: string): void {
  const overlay = getEl(overlayId);
  if (!overlay) {return;}
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

/**
 *
 */
export function initChronologyFeedbackOverlay(): void {
  const overlayId = "chronology-feedback-overlay";
  const resultsListId = "chronology-results-list";
  const nextButtonId = "chronology-next-button";
  const endButtonId = "chronology-end-button";
  const closeButtonId = "chronology-close-button";

  const overlay = getEl(overlayId);
  const resultsList = getEl(resultsListId);
  if (!overlay || !resultsList) {
    console.warn("Chronology feedback overlay elements not found");
    return;
  }

  // Bind controls and keyboard
  bindControlEvents(
    overlayId,
    () => {
      hideOverlayById(overlayId);
      window.dispatchEvent(new CustomEvent("chronologyNextRound"));
    },
    () => {
      hideOverlayById(overlayId);
      window.dispatchEvent(new CustomEvent("chronologyEndGame"));
    }
  );
  attachKeyboardNav(overlay);

  // Event delegation for overlay show events
  window.addEventListener("showChronologyFeedback", ((ev: Event) => {
    try {
      const customEvent = ev as CustomEvent<FeedbackData>;
      const detail = customEvent.detail;
      if (!detail?.userOrder || !resultsList) {
        if (import.meta.env?.DEV) {
          console.error("Missing userOrder or resultsList:", {
            userOrder: detail?.userOrder,
            resultsList,
          });
        }
        return;
      }

      // Render and update
      renderResults(resultsListId, detail.userOrder);
      updateStatsInOverlay(overlayId, detail.accuracy, detail.scoreGained);
      setButtonVisibility(nextButtonId, endButtonId, detail.isLastRound);
      showOverlayById(overlayId, closeButtonId);
    } catch (err) {
      void err;
    }
  }) as EventListener);
}

// Simple initialization function
/**
 *
 */
export function initChronologyFeedbackOverlayAuto(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChronologyFeedbackOverlay);
  } else {
    initChronologyFeedbackOverlay();
  }
}
