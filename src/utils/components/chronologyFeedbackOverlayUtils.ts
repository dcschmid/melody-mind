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
 */
export function initChronologyFeedbackOverlay(): void {
  const overlay = document.getElementById("chronology-feedback-overlay");
  const backdrop = document.getElementById("chronology-feedback-backdrop");
  const closeButton = document.getElementById("chronology-close-button");
  const nextButton = document.getElementById("chronology-next-button");
  const endButton = document.getElementById("chronology-end-button");
  const resultsList = document.getElementById("chronology-results-list");

  if (!overlay || !resultsList) {
    console.warn("Chronology feedback overlay elements not found");
    return;
  }

  // Simple event listeners
  closeButton?.addEventListener("click", () => hideOverlay());
  backdrop?.addEventListener("click", () => hideOverlay());
  nextButton?.addEventListener("click", handleNextRound);
  endButton?.addEventListener("click", handleEndGame);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("hidden") && e.key === "Escape") {
      e.preventDefault();
      hideOverlay();
    }
  });

  // Listen for feedback events
  window.addEventListener("showChronologyFeedback", ((e: Event) => {
    const customEvent = e as CustomEvent;
    showFeedback(customEvent.detail);
  }) as EventListener);

  // Add event listeners for buttons
  if (nextButton) {
    nextButton.addEventListener("click", handleNextRound);
  }

  if (endButton) {
    endButton.addEventListener("click", handleEndGame);
  }

  if (closeButton) {
    closeButton.addEventListener("click", hideOverlay);
  }

  function showOverlay(): void {
    if (!overlay) {
      return;
    }
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
    closeButton?.focus();
  }

  function hideOverlay(): void {
    if (!overlay) {
      return;
    }
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
  }

  function showFeedback(detail: FeedbackData): void {
    if (import.meta.env?.DEV) {
      console.log("showFeedback called with detail:", detail);
    }

    if (!detail.userOrder || !resultsList) {
      if (import.meta.env?.DEV) {
        console.error("Missing userOrder or resultsList:", {
          userOrder: detail.userOrder,
          resultsList,
        });
      }
      return;
    }

    // Clear previous results
    resultsList.innerHTML = "";

    // Add results
    detail.userOrder.forEach((item: UserOrderItem) => {
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

    // Update stats if available
    if (!overlay) {
      return;
    }

    const accuracyElement = overlay.querySelector("#chronology-accuracy");
    const scoreElement = overlay.querySelector("#chronology-score");

    if (accuracyElement && detail.accuracy !== undefined) {
      accuracyElement.textContent = `${detail.accuracy}%`;
    }

    if (scoreElement && detail.scoreGained !== undefined) {
      scoreElement.textContent = `+${detail.scoreGained}`;
    }

    // Show/hide buttons based on round status
    if (import.meta.env?.DEV) {
      console.log("Button visibility check:", {
        nextButton: !!nextButton,
        endButton: !!endButton,
        isLastRound: detail.isLastRound,
      });
    }

    if (nextButton && endButton) {
      if (detail.isLastRound) {
        if (import.meta.env?.DEV) {
          console.log("Hiding next button, showing end button");
        }
        nextButton.style.display = "none";
        endButton.style.display = "flex";
      } else {
        if (import.meta.env?.DEV) {
          console.log("Showing next button, hiding end button");
        }
        nextButton.style.display = "flex";
        endButton.style.display = "none";
      }
    }

    showOverlay();
  }

  function handleNextRound(): void {
    if (import.meta.env?.DEV) {
      console.log("Next round button clicked - dispatching chronologyNextRound event");
    }
    hideOverlay();
    window.dispatchEvent(new CustomEvent("chronologyNextRound"));
  }

  function handleEndGame(): void {
    if (import.meta.env?.DEV) {
      console.log("End game button clicked - dispatching chronologyEndGame event");
    }
    hideOverlay();
    window.dispatchEvent(new CustomEvent("chronologyEndGame"));
  }
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
