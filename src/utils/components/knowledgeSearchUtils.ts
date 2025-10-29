import { safeQuerySelector } from "../dom/domUtils";

// Type-safe window extension for translations
interface WindowWithTranslations extends Window {
  knowledgeTranslations: {
    search: {
      showingAll: string;
      articlesFound: string;
    };
  };
}

interface KnowledgeSearchElements {
  searchInput: HTMLInputElement | null;
  resetButton: HTMLButtonElement | null;
  clearButton: HTMLButtonElement | null;
  articlesGrid: HTMLElement | null;
  noResultsDiv: HTMLElement | null;
  searchStatus: HTMLElement | null;
}

/**
 * Knowledge search utility for the client-side knowledge/article index.
 *
 * Responsibilities:
 * - Wire up the search input element with debounced filtering of article tiles.
 * - Update visible/hidden state for articles and show a no-results indicator.
 * - Provide a lightweight cleanup method to clear timers when the instance is no longer needed.
 *
 * Example:
 * ```
 * const search = new KnowledgeSearchUtils();
 * // later
 * search.cleanup();
 * ```
 *
 * @public
 */
export class KnowledgeSearchUtils {
  private elements: KnowledgeSearchElements;
  private allArticles: HTMLElement[] = [];
  private _currentSearchQuery = "";
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Construct a KnowledgeSearchUtils instance.
   *
   * Wires up DOM references used by the search utility and performs initial
   * setup (articles indexing and event listener registration). The constructor
   * is defensive: if required DOM elements are missing, the instance will
   * gracefully become a no-op and callers may still call `cleanup()` safely.
   *
   *
   */
  constructor() {
    this.elements = {
      searchInput: safeQuerySelector<HTMLInputElement>("#searchInput"),
      resetButton: safeQuerySelector<HTMLButtonElement>("#reset-search"),
      clearButton: safeQuerySelector<HTMLButtonElement>("#clear-search"),
      articlesGrid: safeQuerySelector<HTMLElement>("#articlesGrid"),
      noResultsDiv: safeQuerySelector<HTMLElement>("#no-results"),
      searchStatus: safeQuerySelector<HTMLElement>("#search-status"),
    };

    this.init();
    // mark _currentSearchQuery as intentionally retained for future use
    void this._currentSearchQuery;
  }

  private init(): void {
    if (!this.validateElements()) {
      return;
    }

    this.setupArticles();
    this.setupEventListeners();
    this.updateSearchStatus(0, "");
  }

  private validateElements(): boolean {
    const { searchInput, articlesGrid, noResultsDiv, searchStatus } = this.elements;
    return !!(searchInput && articlesGrid && noResultsDiv && searchStatus);
  }

  private setupArticles(): void {
    const { articlesGrid } = this.elements;
    if (articlesGrid) {
      this.allArticles = Array.from(articlesGrid.children) as HTMLElement[];
    }
  }

  private setupEventListeners(): void {
    const { searchInput, clearButton, resetButton } = this.elements;

    // Search input with debouncing
    searchInput?.addEventListener("input", (e: Event) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        const target = e.target as HTMLInputElement;
        if (target) {
          this.performSearch(target.value);
        }
      }, 300);
    });

    // Clear button
    clearButton?.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        this.performSearch("");
      }
    });

    // Reset button
    resetButton?.addEventListener("click", () => {
      this.resetSearch();
    });
  }

  private getTranslations(): WindowWithTranslations["knowledgeTranslations"] {
    return (window as unknown as WindowWithTranslations).knowledgeTranslations;
  }

  private updateSearchStatus(count: number, query: string): void {
    const { searchStatus } = this.elements;
    if (!searchStatus) {
      return;
    }

    const translations = this.getTranslations();
    const statusText = query.trim()
      ? `${count} ${translations.search.articlesFound}`
      : translations.search.showingAll;
    searchStatus.textContent = statusText;
  }

  private toggleClearButton(show: boolean): void {
    const { clearButton } = this.elements;
    if (!clearButton) {
      return;
    }

    if (show) {
      clearButton.classList.remove("opacity-0", "pointer-events-none");
      clearButton.classList.add("opacity-100", "pointer-events-auto");
    } else {
      clearButton.classList.add("opacity-0", "pointer-events-none");
      clearButton.classList.remove("opacity-100", "pointer-events-auto");
    }
  }

  private performSearch(query: string): void {
    const searchTerm = query.toLowerCase().trim();
    this._currentSearchQuery = searchTerm;

    const visibleCount = this.allArticles.reduce((count, article) => {
      const title = article.querySelector("h3")?.textContent?.toLowerCase() || "";
      const description = article.querySelector("p")?.textContent?.toLowerCase() || "";

      const isVisible =
        searchTerm === "" || title.includes(searchTerm) || description.includes(searchTerm);

      article.style.display = isVisible ? "block" : "none";
      return isVisible ? count + 1 : count;
    }, 0);

    const { noResultsDiv } = this.elements;
    if (noResultsDiv) {
      noResultsDiv.style.display = visibleCount === 0 && searchTerm ? "block" : "none";
    }

    this.updateSearchStatus(visibleCount, searchTerm);
    this.toggleClearButton(searchTerm.length > 0);
  }

  private resetSearch(): void {
    const { searchInput } = this.elements;
    if (!searchInput) {
      return;
    }

    searchInput.value = "";
    this._currentSearchQuery = "";
    this.performSearch("");
    searchInput.focus();
  }

  /**
   * Clean up resources used by this instance.
   *
   * Clears any pending debounce timers to avoid memory leaks when the instance
   * is destroyed or the page is navigated away.
   *
   * @returns {void}
   */
  public cleanup(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}

/**
 * Initialize and return a KnowledgeSearchUtils instance.
 *
 * Convenience helper that creates and returns a new instance of the search
 * utility. Callers can use the returned instance to call `cleanup()` when
 * the search UI is removed.
 *
 *
 */
export function initKnowledgeSearch(): KnowledgeSearchUtils {
  return new KnowledgeSearchUtils();
}

/**
 * Auto-initialize the knowledge search utility.
 *
 * Attempts to create a KnowledgeSearchUtils instance and returns it. This helper
 * is resilient: if initialization throws for any reason (e.g. missing DOM),
 * it catches the error and returns `null` so callers can safely call this during
 * eager module initialization.
 *
 *
 */
export function initKnowledgeSearchAuto(): KnowledgeSearchUtils | null {
  try {
    return new KnowledgeSearchUtils();
  } catch (err) {
    // Avoid unused-variable lint error while preserving original behavior.
    void err;
    return null;
  }
}
