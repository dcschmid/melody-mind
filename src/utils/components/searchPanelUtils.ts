/**
 * Auto-init for lightweight search panels used on landing and category pages.
 * Reads ids/labels from the SearchPanel component markup and wires up filtering +
 * ARIA status/no-results handling.
 */
type SearchElements = {
  root: HTMLElement;
  input: HTMLInputElement;
  clearBtn: HTMLButtonElement | null;
  resetBtn: HTMLButtonElement | null;
  statusEl: HTMLElement | null;
  noResultsEl: HTMLElement | null;
  listItems: HTMLElement[];
  ariaControlsId: string;
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

  return {
    root,
    input,
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
  count: number,
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

function initSearchPanel(elements: SearchElements): void {
  const { input, clearBtn, resetBtn, statusEl, noResultsEl, listItems } =
    elements;

  if ((elements.root as any).__searchInitialized) return;
  (elements.root as any).__searchInitialized = true;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const updateStatus = (count: number, term: string): void => {
    const hasQuery = term.trim().length > 0;
    if (statusEl) {
      statusEl.textContent = getStatusText(statusEl, hasQuery, count);
    }
    if (noResultsEl) {
      const showEmpty = hasQuery && count === 0;
      noResultsEl.hidden = !showEmpty;
      if (showEmpty) {
        noResultsEl.textContent = getNoResultsText(noResultsEl, term);
      }
    }
    if (clearBtn) {
      clearBtn.hidden = !hasQuery;
      clearBtn.setAttribute("aria-hidden", hasQuery ? "false" : "true");
      clearBtn.tabIndex = hasQuery ? 0 : -1;
    }
  };

  const performSearch = (term: string): void => {
    const q = term.trim().toLowerCase();
    let count = 0;
    listItems.forEach((item) => {
      const haystack =
        item.dataset.searchText?.toLowerCase() ||
        item.textContent?.toLowerCase() ||
        "";
      const match = q === "" || haystack.includes(q);
      item.style.display = match ? "" : "none";
      if (match) count += 1;
    });
    updateStatus(count, term);
  };

  input.addEventListener("input", (e: Event) => {
    const value = (e.target as HTMLInputElement)?.value || "";
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => performSearch(value), 150);
  });

  clearBtn?.addEventListener("click", () => {
    input.value = "";
    performSearch("");
    input.focus();
  });

  resetBtn?.addEventListener("click", () => {
    input.value = "";
    performSearch("");
    input.focus();
  });

  performSearch("");
}

export function initSearchPanelsAuto(): void {
  if (typeof window === "undefined") return;
  const roots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-search-root]"),
  );
  roots.forEach((root) => {
    const elements = getElements(root);
    if (!elements) return;
    initSearchPanel(elements);
  });
}
