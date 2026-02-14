/**
 * Auto-init for lightweight search panels used on landing and category pages.
 * Reads ids/labels from the SearchPanel component markup and wires up filtering +
 * ARIA status/no-results handling.
 */
import { SEARCH_EVENTS } from "@constants/events";

type SearchElements = {
  root: HTMLElement;
  input: HTMLInputElement;
  genreInput: HTMLInputElement | HTMLSelectElement | null;
  clearBtn: HTMLButtonElement | null;
  resetBtn: HTMLButtonElement | null;
  statusEl: HTMLElement | null;
  noResultsEl: HTMLElement | null;
  listItems: HTMLElement[];
  ariaControlsId: string;
};

type SearchTelemetryDetail = {
  hasQuery: boolean;
  resultsCount: number;
  queryLength: number;
  tokenCount: number;
};

type SearchResultClickDetail = {
  surface: string;
  positionBucket: "1-3" | "4-6" | "7+" | "unknown";
};

const dispatchSearchTelemetry = (detail: SearchTelemetryDetail): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.dispatchEvent(
      new CustomEvent<SearchTelemetryDetail>(SEARCH_EVENTS.PERFORMED, {
        detail,
      })
    );
  } catch {
    // Search remains functional even when telemetry dispatch fails.
  }
};

const dispatchSearchResultClick = (detail: SearchResultClickDetail): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.dispatchEvent(
      new CustomEvent<SearchResultClickDetail>(SEARCH_EVENTS.RESULT_CLICK, {
        detail,
      })
    );
  } catch {
    // Search remains functional even when telemetry dispatch fails.
  }
};

const getPositionBucket = (
  position: number
): SearchResultClickDetail["positionBucket"] => {
  if (!Number.isFinite(position) || position <= 0) {
    return "unknown";
  }

  if (position <= 3) {
    return "1-3";
  }

  if (position <= 6) {
    return "4-6";
  }

  return "7+";
};

const getElements = (root: HTMLElement): SearchElements | null => {
  const input = root.querySelector<HTMLInputElement>("[data-search-input]");
  if (!input) return null;

  const ariaControlsId = input.getAttribute("aria-controls") || "";
  const list = ariaControlsId
    ? (document.getElementById(ariaControlsId) as HTMLElement | null)
    : null;
  const listItems = list ? (Array.from(list.children) as HTMLElement[]) : [];

  if (!listItems.length) return null;

  const externalGenreInput = ariaControlsId
    ? document.querySelector<HTMLInputElement | HTMLSelectElement>(
        `[data-search-genre-filter-for="${ariaControlsId}"]`
      )
    : null;

  return {
    root,
    input,
    genreInput:
      root.querySelector<HTMLInputElement | HTMLSelectElement>(
        "[data-search-genre-filter]"
      ) || externalGenreInput,
    clearBtn: root.querySelector<HTMLButtonElement>("[data-search-clear]"),
    resetBtn: root.querySelector<HTMLButtonElement>("[data-search-reset]"),
    statusEl: root.querySelector<HTMLElement>("[data-search-status]"),
    noResultsEl: root.querySelector<HTMLElement>("[data-search-no-results]"),
    listItems,
    ariaControlsId,
  };
};

const getStatusText = (
  el: HTMLElement | null,
  hasQuery: boolean,
  count: number
): string => {
  const allText =
    el?.dataset.searchStatusAll ||
    el?.getAttribute("data-search-status-all") ||
    "Showing all";
  const tpl =
    el?.dataset.searchStatusCount ||
    el?.getAttribute("data-search-status-count") ||
    "{count} results";

  return hasQuery ? tpl.replace("{count}", String(count)) : allText;
};

const getNoResultsText = (el: HTMLElement | null, term: string): string => {
  const tpl =
    el?.dataset.searchNoResultsTpl ||
    el?.getAttribute("data-search-no-results-tpl") ||
    'No results for "{term}"';
  return tpl.replace("{term}", term);
};

const getSearchIndex = (item: HTMLElement): string => {
  const cached = item.dataset.searchIndex;
  if (cached) {
    return cached;
  }

  const normalized =
    item.dataset.searchText?.toLowerCase() || item.textContent?.toLowerCase() || "";
  item.dataset.searchIndex = normalized;
  return normalized;
};

const getGenreIndex = (item: HTMLElement): string[] => {
  const cached = item.dataset.searchGenresIndex;
  if (cached) {
    return cached.split("||").filter(Boolean);
  }

  const normalized = (item.dataset.searchGenres || "")
    .toLowerCase()
    .split("||")
    .map((genre) => genre.trim())
    .filter(Boolean);

  item.dataset.searchGenresIndex = normalized.join("||");
  return normalized;
};

function initSearchPanel(elements: SearchElements): void {
  const { input, genreInput, clearBtn, resetBtn, statusEl, noResultsEl, listItems } =
    elements;

  if ((elements.root as any).__searchInitialized) return;
  (elements.root as any).__searchInitialized = true;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let lastStatusAnnouncement = "";

  const updateStatus = (count: number, term: string, genreTerm: string): void => {
    const hasQuery = term.trim().length > 0 || genreTerm.trim().length > 0;
    if (statusEl) {
      const nextStatus = getStatusText(statusEl, hasQuery, count);
      if (nextStatus !== lastStatusAnnouncement) {
        statusEl.textContent = nextStatus;
        lastStatusAnnouncement = nextStatus;
      }
    }
    if (noResultsEl) {
      const showEmpty = hasQuery && count === 0;
      noResultsEl.hidden = !showEmpty;
      if (showEmpty) {
        const emptyTerm = term.trim() || `genre: ${genreTerm.trim()}`;
        noResultsEl.textContent = getNoResultsText(noResultsEl, emptyTerm);
      }
    }
    if (clearBtn) {
      clearBtn.hidden = !hasQuery;
      clearBtn.setAttribute("aria-hidden", hasQuery ? "false" : "true");
      clearBtn.tabIndex = hasQuery ? 0 : -1;
    }
  };

  const performSearch = (term: string, genreTerm: string): void => {
    const q = term.trim().toLowerCase();
    const genreQuery = genreTerm.trim().toLowerCase();
    const hasQuery = q.length > 0 || genreQuery.length > 0;
    let count = 0;

    elements.root.dataset.searchActive = hasQuery ? "true" : "false";

    controlledList?.setAttribute("aria-busy", "true");
    listItems.forEach((item) => {
      const haystack = getSearchIndex(item);
      const textMatch = q === "" || haystack.includes(q);
      const genreIndex = getGenreIndex(item);
      const genreMatch =
        genreQuery === "" || genreIndex.some((genre) => genre.includes(genreQuery));
      const match = textMatch && genreMatch;
      item.hidden = !match;

      if (match) {
        count += 1;
        item.dataset.searchVisibleIndex = String(count);
      } else {
        delete item.dataset.searchVisibleIndex;
      }
    });
    updateStatus(count, term, genreTerm);

    const normalizedTerm = term.trim();
    dispatchSearchTelemetry({
      hasQuery: normalizedTerm.length > 0,
      resultsCount: count,
      queryLength: normalizedTerm.length,
      tokenCount: normalizedTerm.length > 0 ? normalizedTerm.split(/\s+/).length : 0,
    });

    controlledList?.setAttribute("aria-busy", "false");
  };

  const controlledList = elements.ariaControlsId
    ? (document.getElementById(elements.ariaControlsId) as HTMLElement | null)
    : null;

  controlledList?.addEventListener("click", (event) => {
    if (elements.root.dataset.searchActive !== "true") {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const clickedLink = target.closest("a");
    if (!clickedLink) {
      return;
    }

    const clickedItem = target.closest<HTMLElement>("[data-search-text], li");
    if (!clickedItem) {
      return;
    }

    const visibleIndex = Number(clickedItem.dataset.searchVisibleIndex || "0");
    const surface = elements.root.dataset.searchSurface || "unknown";

    dispatchSearchResultClick({
      surface,
      positionBucket: getPositionBucket(visibleIndex),
    });
  });

  input.addEventListener("input", (e: Event) => {
    const value = (e.target as HTMLInputElement)?.value || "";
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(value, genreInput?.value || ""), 150);
  });

  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key !== "Escape" || input.value.trim().length === 0) {
      return;
    }
    e.preventDefault();
    input.value = "";
    performSearch("", genreInput?.value || "");
  });

  const handleGenreFilterInput = (e: Event): void => {
    const value = (e.target as HTMLInputElement | HTMLSelectElement)?.value || "";
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(input.value, value), 120);
  };

  if (genreInput instanceof HTMLSelectElement) {
    genreInput.addEventListener("change", handleGenreFilterInput);
  } else {
    genreInput?.addEventListener("input", handleGenreFilterInput);
  }

  clearBtn?.addEventListener("click", () => {
    input.value = "";
    if (genreInput) {
      genreInput.value = "";
    }
    performSearch("", "");
    input.focus();
  });

  resetBtn?.addEventListener("click", () => {
    input.value = "";
    if (genreInput) {
      genreInput.value = "";
    }
    performSearch("", "");
    input.focus();
  });

  performSearch("", genreInput?.value || "");
}

export function initSearchPanelsAuto(): void {
  if (typeof window === "undefined") return;
  const roots = Array.from(document.querySelectorAll<HTMLElement>("[data-search-root]"));
  roots.forEach((root) => {
    const elements = getElements(root);
    if (!elements) return;
    initSearchPanel(elements);
  });
}
