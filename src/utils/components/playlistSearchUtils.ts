import { safeGetElementById } from "../dom/domUtils";

interface PlaylistSearchElements {
  searchInput: HTMLInputElement | null;
  clearButton: HTMLButtonElement | null;
  playlistItems: NodeListOf<Element> | null;
  searchExamples: HTMLElement | null;
  searchExampleButtons: NodeListOf<HTMLButtonElement> | null;
}

/**
 *
 */
export class PlaylistSearchUtils {
  private elements: PlaylistSearchElements;

  /**
   *
   */
  constructor() {
    this.elements = {
      searchInput: safeGetElementById<HTMLInputElement>("playlist-search"),
      clearButton: safeGetElementById<HTMLButtonElement>("clear-search"),
      playlistItems: document.querySelectorAll(".playlist-item"),
      searchExamples: safeGetElementById<HTMLElement>("search-examples"),
      searchExampleButtons: document.querySelectorAll(
        ".search-example"
      ) as NodeListOf<HTMLButtonElement>,
    };

    this.init();
  }

  private init(): void {
    if (!this.validateElements()) {
      return;
    }

    this.setupEventListeners();
    this.setupSearchExamples();
  }

  private validateElements(): boolean {
    const { searchInput, clearButton } = this.elements;
    return !!(searchInput && clearButton);
  }

  private setupEventListeners(): void {
    const { searchInput, clearButton } = this.elements;

    // Show/hide clear button based on input
    searchInput?.addEventListener("input", () => this.toggleClearButton());

    // Clear search functionality
    clearButton?.addEventListener("click", () => this.clearSearch());

    // Search input event
    searchInput?.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      this.performSearch(target.value);
    });
  }

  private setupSearchExamples(): void {
    const { searchExampleButtons, searchInput } = this.elements;

    searchExampleButtons?.forEach((button) => {
      button.addEventListener("click", () => {
        const example = button.textContent?.trim();
        if (example && searchInput) {
          searchInput.value = example;
          searchInput.focus();
          this.performSearch(example);
          this.toggleClearButton();
        }
      });
    });
  }

  private toggleClearButton(): void {
    const { searchInput, clearButton } = this.elements;
    if (!searchInput || !clearButton) {
      return;
    }

    if (searchInput.value.trim()) {
      clearButton.classList.remove("opacity-0", "pointer-events-none");
      clearButton.classList.add("opacity-100", "pointer-events-auto");
    } else {
      clearButton.classList.add("opacity-0", "pointer-events-none");
      clearButton.classList.remove("opacity-100", "pointer-events-auto");
    }
  }

  private updateSearchStatus(message: string): void {
    if (this.elements.searchStatus) {
      this.elements.searchStatus.textContent = message;
    }
  }

  private clearSearch(): void {
    if (this.elements.searchInput) {
      this.elements.searchInput.value = "";
    }
    if (this.elements.clearButton) {
      this.elements.clearButton.style.display = "none";
    }
    this.showAllItems();
    this.updateSearchStatus(this.translations.showingAll);
  }

  private showAllItems(): void {
    if (this.elements.playlistItems) {
      this.elements.playlistItems.forEach((item) => {
        (item as HTMLElement).style.display = "";
      });
    }
  }

  private hideAllItems(): void {
    if (this.elements.playlistItems) {
      this.elements.playlistItems.forEach((item) => {
        (item as HTMLElement).style.display = "none";
      });
    }
  }

  private calculateScore(element: HTMLElement, searchWords: string[], searchTerm: string): number {
    const searchText = element.getAttribute("data-search-text") || "";
    const headline = element.querySelector('[itemprop="name"]')?.getAttribute("content") || "";
    const description =
      element.querySelector('[itemprop="description"]')?.getAttribute("content") || "";
    const genre = element.querySelector('[itemprop="genre"]')?.getAttribute("content") || "";

    let score = 0;
    const fullText = `${headline} ${description} ${genre} ${searchText}`.toLowerCase();

    searchWords.forEach((word) => {
      if (headline.toLowerCase().includes(word)) {
        score += 10;
      }
      if (description.toLowerCase().includes(word)) {
        score += 8;
      }
      if (genre.toLowerCase().includes(word)) {
        score += 6;
      }
      if (searchText.toLowerCase().includes(word)) {
        score += 4;
      }
      if (fullText.includes(word)) {
        score += 2;
      }

      const wordBoundaryRegex = new RegExp(`\\b${word}`, "i");
      if (wordBoundaryRegex.test(fullText)) {
        score += 3;
      }
    });

    if (headline.toLowerCase().startsWith(searchTerm.toLowerCase())) {
      score += 5;
    }
    if (genre.toLowerCase() === searchTerm.toLowerCase()) {
      score += 8;
    }

    return score;
  }

  private performSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.showAllPlaylists();
      this.showSearchExamples();
      return;
    }

    const searchWords = searchTerm
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    let hasResults = false;
    const { playlistItems } = this.elements;

    if (!playlistItems) {
      return;
    }

    playlistItems.forEach((item) => {
      const element = item as HTMLElement;
      const score = this.calculateScore(element, searchWords, searchTerm);

      if (score > 0) {
        element.style.display = "";
        element.style.order = (1000 - score).toString();
        hasResults = true;
      } else {
        element.style.display = "none";
      }
    });

    this.hideSearchExamples();
    this.toggleClearButton();

    if (!hasResults) {
      this.showNoResultsMessage();
    }
  }

  private showAllPlaylists(): void {
    const { playlistItems } = this.elements;
    if (!playlistItems) {
      return;
    }

    playlistItems.forEach((item) => {
      const element = item as HTMLElement;
      element.style.display = "";
      element.style.order = "";
    });
  }

  private showSearchExamples(): void {
    const { searchExamples } = this.elements;
    if (searchExamples) {
      searchExamples.classList.remove("hidden");
    }
  }

  private hideSearchExamples(): void {
    const { searchExamples } = this.elements;
    if (searchExamples) {
      searchExamples.classList.add("hidden");
    }
  }

  private showNoResultsMessage(): void {
    // This could be enhanced to show a proper no results message
  }

  /**
   *
   */
  public cleanup(): void {
    // Cleanup if needed
  }
}

/**
 *
 */
export function initPlaylistSearch(): PlaylistSearchUtils {
  return new PlaylistSearchUtils();
}

/**
 *
 */
export function initPlaylistSearchAuto(): PlaylistSearchUtils | null {
  try {
    return new PlaylistSearchUtils();
  } catch (error) {
    return null;
  }
}
