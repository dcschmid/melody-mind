import { SEARCH_EVENTS, dispatchCustomEvent } from "@shared-utils/constants/events";

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
    dispatchCustomEvent<SearchTelemetryDetail>(SEARCH_EVENTS.PERFORMED, detail);
  } catch (err) {
    console.error("[search] telemetry dispatch failed:", err);
  }
};

const dispatchSearchResultClick = (detail: SearchResultClickDetail): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    dispatchCustomEvent<SearchResultClickDetail>(SEARCH_EVENTS.RESULT_CLICK, detail);
  } catch (err) {
    console.error("[search] result-click dispatch failed:", err);
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
  if (!input) {
    return null;
  }

  const ariaControlsId = input.getAttribute("aria-controls") || "";
  const list = ariaControlsId
    ? (document.getElementById(ariaControlsId) as HTMLElement | null)
    : null;
  const listItems = list ? (Array.from(list.children) as HTMLElement[]) : [];

  if (!listItems.length) {
    return null;
  }

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

  // Guard against double-init using a known property on the element
  if ((elements.root as { __searchInitialized?: boolean }).__searchInitialized) {
    return;
  }
  (elements.root as { __searchInitialized: boolean }).__searchInitialized = true;

  const controller = new AbortController();
  const { signal } = controller;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let lastStatusAnnouncement = "";

  const syncClearButton = (term: string, genreTerm: string): void => {
    if (!clearBtn) {
      return;
    }

    const shouldShow = term.trim().length > 0 || genreTerm.trim().length > 0;
    clearBtn.hidden = !shouldShow;
    clearBtn.setAttribute("aria-hidden", shouldShow ? "false" : "true");

    if (shouldShow) {
      clearBtn.removeAttribute("tabindex");
      return;
    }

    clearBtn.setAttribute("tabindex", "-1");
  };

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
  };

  const updateFilteredItems = (term: string, genreTerm: string): void => {
    const normalizedTerm = term.toLowerCase();
    const normalizedGenre = genreTerm.toLowerCase();

    let matchCount = 0;

    listItems.forEach((item) => {
      const searchIndex = getSearchIndex(item);
      const genreIndex = getGenreIndex(item);
      const matchesText =
        normalizedTerm.length === 0 || searchIndex.includes(normalizedTerm);
      const matchesGenre =
        normalizedGenre.length === 0 || genreIndex.includes(normalizedGenre);

      const shouldShow = matchesText && matchesGenre;
      item.hidden = !shouldShow;
      if (shouldShow) {
        matchCount += 1;
      }
    });

    syncClearButton(term, genreTerm);
    updateStatus(matchCount, term, genreTerm);
    dispatchSearchTelemetry({
      hasQuery: term.trim().length > 0 || genreTerm.trim().length > 0,
      resultsCount: matchCount,
      queryLength: term.length,
      tokenCount: term.trim().split(/\s+/).filter(Boolean).length,
    });
  };

  const handleInput = () => {
    const term = input.value;
    const genreTerm = genreInput?.value || "";

    if (debounceTimer) {
      window.clearTimeout(debounceTimer);
    }

    debounceTimer = window.setTimeout(() => {
      updateFilteredItems(term, genreTerm);
    }, 150);
  };

  const handleClear = () => {
    input.value = "";
    if (genreInput) {
      genreInput.value = "";
    }
    updateFilteredItems("", "");
    input.focus();
    dispatchSearchTelemetry({
      hasQuery: false,
      resultsCount: listItems.length,
      queryLength: 0,
      tokenCount: 0,
    });
  };

  const handleReset = () => {
    handleClear();
    if (resetBtn) {
      resetBtn.classList.add("button--active");
      window.setTimeout(() => resetBtn.classList.remove("button--active"), 250);
    }
  };

  input.addEventListener("input", handleInput, { signal });
  clearBtn?.addEventListener("click", handleClear, { signal });
  resetBtn?.addEventListener("click", handleReset, { signal });

  listItems.forEach((item, index) => {
    item.addEventListener(
      "click",
      () => {
        dispatchSearchResultClick({
          surface: "list",
          positionBucket: getPositionBucket(index + 1),
        });
      },
      { signal }
    );
  });

  updateFilteredItems(input.value, genreInput?.value || "");
}

export function initSearchPanelsAuto(): void {
  if (typeof window === "undefined") {
    return;
  }

  const roots = Array.from(document.querySelectorAll<HTMLElement>("[data-search-root]"));
  roots.forEach((root) => {
    const elements = getElements(root);
    if (elements) {
      initSearchPanel(elements);
    }
  });
}
