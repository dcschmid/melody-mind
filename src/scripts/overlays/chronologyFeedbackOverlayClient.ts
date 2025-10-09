/**
 * Chronology feedback overlay client logic.
 * Attaches event listeners and renders round feedback (accuracy, gained score, item order correctness).
 */
interface ChronologyItem { isCorrectPosition: boolean; position: number; artist: string; title: string; year: string | number; }
interface ShowDetail { userOrder: ChronologyItem[]; accuracy: number; scoreGained: number; isLastRound?: boolean; }

/**
 * Bootstraps the chronology feedback overlay on the current page.
 * Safe to call multiple times (listeners will just re-bind once per load cycle).
 */
export function initChronologyFeedbackOverlay(): void {
  const overlay = document.getElementById("chronology-feedback-overlay");
  if (!overlay) { return; }
  const refs = collectRefs();
  const translations = parseTranslations(overlay);
  let previousFocus: HTMLElement | null = null;

  const hideOverlay = (): void => {
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
    previousFocus?.focus?.();
  };
  const dispatch = (name: string): void => { window.dispatchEvent(new CustomEvent(name)); };
  const renderResults = (items: ChronologyItem[]): void => {
    if (!refs.resultsList) { return; }
    refs.resultsList.innerHTML = "";
    for (const item of items) {
      const container = document.createElement("div");
      container.className = `flex items-center justify-between rounded-lg border p-4 transition-all duration-200 ${item.isCorrectPosition ? "border-green-500/50 bg-green-500/10 text-green-100" : "border-red-500/50 bg-red-500/10 text-red-100"}`;
      container.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold ${item.isCorrectPosition ? "border-green-500 bg-green-500/20 text-green-400" : "border-red-500 bg-red-500/20 text-red-400"}">${item.position}</div>
          <div class="flex flex-col">
            <div class="font-semibold text-white">${item.artist}</div>
            <div class="text-sm text-gray-300">${item.title}</div>
            <div class="text-xs text-gray-400">${item.year}</div>
          </div>
        </div>
        <div class="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold ${item.isCorrectPosition ? "text-green-400" : "text-red-400"}">${item.isCorrectPosition ? "✓" : "✗"}</div>`;
      refs.resultsList.appendChild(container);
    }
  };
  const updateStats = (accuracy: number, scoreGained: number): void => {
    if (refs.accuracyElement) { refs.accuracyElement.textContent = `${accuracy}%`; }
    if (refs.scoreElement) { refs.scoreElement.textContent = `+${scoreGained}`; }
  };
  const toggleButtons = (isLastRound: boolean): void => {
    if (!refs.nextButton || !refs.endButton) { return; }
    refs.nextButton.style.display = isLastRound ? "none" : "flex";
    refs.endButton.style.display = isLastRound ? "flex" : "none";
  };
  const announce = (message: string): void => {
    if (!refs.statusAnnouncer || !message) { return; }
    refs.statusAnnouncer.textContent = "";
    refs.statusAnnouncer.textContent = message;
  };
  const handleShow = (ev: Event): void => {
    const detail = (ev as CustomEvent<ShowDetail>).detail;
    if (!detail || !Array.isArray(detail.userOrder)) { return; }
    renderResults(detail.userOrder);
    updateStats(detail.accuracy, detail.scoreGained);
    toggleButtons(Boolean(detail.isLastRound));
    const key = detail.isLastRound ? "game.chronology.stats.total_points" : "game.chronology.stats.round_points";
    announce(translations[key] || "");
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
    refs.closeButton?.focus?.();
  };
  refs.closeButton?.addEventListener("click", hideOverlay);
  refs.backdrop?.addEventListener("click", hideOverlay);
  refs.nextButton?.addEventListener("click", () => { hideOverlay(); dispatch("chronologyNextRound"); });
  refs.endButton?.addEventListener("click", () => { hideOverlay(); dispatch("chronologyEndGame"); });
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
      e.preventDefault();
      hideOverlay();
    }
  });
  window.addEventListener("showChronologyFeedback", handleShow as EventListener);
  window.addEventListener("unload", () => window.removeEventListener("showChronologyFeedback", handleShow as EventListener));
}

function collectRefs(): {
  closeButton: HTMLElement | null;
  backdrop: HTMLElement | null;
  nextButton: HTMLElement | null;
  endButton: HTMLElement | null;
  accuracyElement: HTMLElement | null;
  scoreElement: HTMLElement | null;
  resultsList: HTMLElement | null;
  statusAnnouncer: HTMLElement | null;
} {
  return {
    closeButton: document.getElementById("chronology-close-button") as HTMLElement | null,
    backdrop: document.getElementById("chronology-feedback-backdrop") as HTMLElement | null,
    nextButton: document.getElementById("chronology-next-button") as HTMLElement | null,
    endButton: document.getElementById("chronology-end-button") as HTMLElement | null,
    accuracyElement: document.getElementById("chronology-accuracy") as HTMLElement | null,
    scoreElement: document.getElementById("chronology-score") as HTMLElement | null,
    resultsList: document.getElementById("chronology-results-list") as HTMLElement | null,
    statusAnnouncer: document.getElementById("feedback-status") as HTMLElement | null,
  } as const;
}

function parseTranslations(overlay: HTMLElement): Record<string, string> {
  try {
    const raw = overlay.getAttribute("data-translations");
    if (raw) {
      return { ...JSON.parse(raw) };
    }
  } catch {/* ignore */}
  return {};
}
