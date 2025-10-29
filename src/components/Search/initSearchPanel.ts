/**
 * Initializes a SearchPanel instance by wiring it to the generic search utility.
 * Minimal abstraction over initGenericSearchAuto so markup duplication is avoided.
 */
import { resolveDebounceForCount } from "@constants/search";
import { initGenericSearchAuto } from "@utils/components/searchUtils";

export interface InitSearchPanelOptions {
  idBase: string;
  itemSelector: string;
  examplesContainerId?: string;
  exampleButtonSelector?: string;
  onNoResults?(searchTerm: string): void;
  onResultsUpdated?(visibleCount: number, term: string): void;
  /** Optional debounce (ms) forwarded to generic search */
  debounceMs?: number;
}

/**
 * Initialize a search panel instance.
 * @param {InitSearchPanelOptions} opts configuration options
 * @returns {import('@utils/components/searchUtils').GenericSearchUtils | null} search instance or null
 */
export function initSearchPanel(
  opts: InitSearchPanelOptions
): import("@utils/components/searchUtils").GenericSearchUtils | null {
  const {
    idBase,
    itemSelector,
    examplesContainerId,
    exampleButtonSelector,
    onNoResults,
    onResultsUpdated,
    debounceMs,
  } = opts;
  const inputId = `${idBase}-input`;
  const clearId = `${idBase}-clear`;
  // Detect auto-managed elements
  const statusEl = document.getElementById(`${idBase}-status`) as HTMLElement | null;
  const noResultsEl = document.getElementById(`${idBase}-no-results`) as HTMLElement | null;
  const autoStatusAll = statusEl?.getAttribute("data-search-status-all") || "Showing all";
  const autoStatusCountTpl =
    statusEl?.getAttribute("data-search-status-count") || "{count} results";
  const noResultsTpl =
    noResultsEl?.getAttribute("data-search-no-results-tpl") || 'No results for "{term}"';

  // Determine effective debounce using heuristic only if not explicitly provided
  const effectiveDebounce =
    typeof debounceMs === "number" ? debounceMs : deriveHeuristicDebounce(itemSelector);

  const instance = initGenericSearchAuto({
    inputId,
    clearButtonId: clearId,
    itemSelector,
    examplesContainerId,
    exampleButtonSelector,
    debounceMs: effectiveDebounce,
    onNoResults: (term) => {
      if (noResultsEl) {
        noResultsEl.hidden = false;
        noResultsEl.textContent = noResultsTpl.replace("{term}", term);
      }
      onNoResults?.(term);
    },
    onResultsUpdated: (visible, term) => {
      if (statusEl) {
        if (!term) {
          statusEl.textContent = autoStatusAll;
        } else {
          statusEl.textContent = autoStatusCountTpl.replace("{count}", String(visible));
        }
      }
      if (noResultsEl) {
        noResultsEl.hidden = visible > 0;
      }
      onResultsUpdated?.(visible, term);
    },
  });

  // Wire reset if present
  try {
    const resetBtn = document.getElementById(`${idBase}-reset`);
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (instance && typeof (instance as { clear?: () => void }).clear === "function") {
          (instance as { clear?: () => void }).clear?.();
        }
        const input = document.getElementById(inputId) as HTMLInputElement | null;
        if (input) {
          input.focus();
        }
      });
    }
  } catch {
    // ignore wiring errors
  }

  // Expose for debugging
  try {
    (window as unknown as { __lastSearchInstance?: unknown }).__lastSearchInstance = instance;
  } catch {
    // ignore
  }

  return instance;
}

/** Lightweight heuristic for debounce selection based on initial item count. */
function deriveHeuristicDebounce(selector: string): number | undefined {
  try {
    const cnt = document.querySelectorAll(selector).length;
    return resolveDebounceForCount(cnt);
  } catch {
    return undefined;
  }
}
