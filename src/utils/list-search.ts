/**
 * Reusable search functionality for list filtering
 * Provides type-safe search capabilities with accessibility features
 */

export interface SearchTranslations {
  search: {
    placeholder: string;
    showingAll: string;
    resultsFound: string;
    noResults: string;
    clear: string;
  };
  accessibility: {
    skipToContent: string;
    searchLabel: string;
  };
}

export interface SearchConfig {
  searchInputId: string;
  clearButtonSelector: string;
  gridContainerId: string;
  resultsInfoSelector: string;
  itemsSelector: string;
  translations: SearchTranslations;
}

/**
 * Generic search functionality class for filtering list items
 * Provides accessibility features and progressive enhancement
 */
export class ListSearchManager {
  private searchInput: HTMLInputElement | null;
  private clearButton: HTMLButtonElement | null;
  private gridContainer: HTMLElement | null;
  private resultsInfo: HTMLElement | null;
  private allItems: NodeListOf<Element>;
  private config: SearchConfig;

  /**
   *
   */
  constructor(config: SearchConfig) {
    this.config = config;
    this.searchInput = document.getElementById(config.searchInputId) as HTMLInputElement;
    this.clearButton = document.querySelector(config.clearButtonSelector) as HTMLButtonElement;
    this.gridContainer = document.getElementById(config.gridContainerId);
    this.resultsInfo = document.querySelector(config.resultsInfoSelector);
    this.allItems = document.querySelectorAll(config.itemsSelector);

    this.init();
  }

  private init(): void {
    if (!this.searchInput || !this.gridContainer) {
      return;
    }

    this.searchInput.addEventListener("input", this.handleSearch.bind(this));
    this.searchInput.addEventListener("keydown", this.handleKeydown.bind(this));

    if (this.clearButton) {
      this.clearButton.addEventListener("click", this.clearSearch.bind(this));
    }

    // Initial state
    this.updateResultsInfo(this.allItems.length, "");
  }

  private handleSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value.toLowerCase().trim();

    this.filterItems(query);
    this.updateClearButton(query);
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      this.clearSearch();
    }
  }

  private filterItems(query: string): void {
    let visibleCount = 0;

    this.allItems.forEach((item) => {
      const textContent = item.textContent?.toLowerCase() || "";
      const isVisible = query === "" || textContent.includes(query);

      if (item instanceof HTMLElement) {
        item.style.display = isVisible ? "" : "none";
        item.setAttribute("aria-hidden", (!isVisible).toString());
      }

      if (isVisible) {
        visibleCount++;
      }
    });

    this.updateResultsInfo(visibleCount, query);
  }

  private updateResultsInfo(count: number, query: string): void {
    if (!this.resultsInfo) {
      return;
    }

    let message = "";
    if (query === "") {
      message = `${this.config.translations.search.showingAll} (${count})`;
    } else if (count === 0) {
      message = this.config.translations.search.noResults;
    } else {
      message = `${count} ${this.config.translations.search.resultsFound}`;
    }

    this.resultsInfo.textContent = message;
  }

  private updateClearButton(query: string): void {
    if (!this.clearButton) {
      return;
    }

    if (query.length > 0) {
      this.clearButton.removeAttribute("hidden");
    } else {
      this.clearButton.setAttribute("hidden", "");
    }
  }

  private clearSearch(): void {
    if (!this.searchInput) {
      return;
    }

    this.searchInput.value = "";
    this.filterItems("");
    this.updateClearButton("");
    this.searchInput.focus();
  }

  /**
   * Public method to programmatically clear search
   */
  public clear(): void {
    this.clearSearch();
  }

  /**
   * Public method to programmatically set search query
   */
  public setQuery(query: string): void {
    if (this.searchInput) {
      this.searchInput.value = query;
      this.filterItems(query);
      this.updateClearButton(query);
    }
  }

  /**
   * Public method to get current search query
   */
  public getQuery(): string {
    return this.searchInput?.value || "";
  }
}

/**
 * Initializes search functionality when DOM is ready
 */
export function initializeSearch(config: SearchConfig): ListSearchManager | null {
  if (document.readyState === "loading") {
    return new Promise<ListSearchManager>((resolve) => {
      document.addEventListener("DOMContentLoaded", () => {
        resolve(new ListSearchManager(config));
      });
    }) as Promise<ListSearchManager>;
  } else {
    return new ListSearchManager(config);
  }
}
