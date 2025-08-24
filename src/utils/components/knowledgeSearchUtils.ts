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
 *
 */
export class KnowledgeSearchUtils {
  private elements: KnowledgeSearchElements;
  private allArticles: HTMLElement[] = [];
  private currentSearchQuery = "";
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /**
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

  private getTranslations() {
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
    this.currentSearchQuery = searchTerm;

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
    this.currentSearchQuery = "";
    this.performSearch("");
    searchInput.focus();
  }

  /**
   *
   */
  public cleanup(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}

/**
 *
 */
export function initKnowledgeSearch(): KnowledgeSearchUtils {
  return new KnowledgeSearchUtils();
}

/**
 *
 */
export function initKnowledgeSearchAuto(): KnowledgeSearchUtils | null {
  try {
    return new KnowledgeSearchUtils();
  } catch (error) {
    return null;
  }
}
