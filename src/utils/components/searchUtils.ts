/**
 * Generic list search utility for re-usable client-side searches.
 *
 * This module provides a configurable, accessible search helper that can be
 * reused across pages/components that render lists of items. It is inspired by
 * the playlist-specific search implementation and abstracts the common parts:
 * - wiring input and clear controls
 * - showing/hiding example suggestions
 * - scoring and ranking results
 * - showing/hiding list items via CSS `display` and `order`
 *
 * Usage example:
 * import { initGenericSearchAuto, GenericSearchOptions } from './searchUtils';
 *
 * const opts: GenericSearchOptions = {
 *   inputId: 'global-search',
 *   clearButtonId: 'clear-search',
 *   itemSelector: '.search-item',
 *   examplesContainerId: 'search-examples',
 *   exampleButtonSelector: '.search-example',
 * };
 *
 * document.addEventListener('DOMContentLoaded', () => {
 *   initGenericSearchAuto(opts);
 * });
 */

import type { GenericSearchInstance } from "../../types/global";
import { safeGetElementById } from "../dom/domUtils";

export type ScoringWeights = {
  headline?: number;
  description?: number;
  tags?: number;
  dataSearchText?: number;
  fullTextMatch?: number;
  wordBoundaryBonus?: number;
  startsWithBonus?: number;
  exactGenreBonus?: number;
};

/**
 * Options to configure the generic search instance.
 */
export interface GenericSearchOptions {
  /**
   * The id of the search input element.
   */
  inputId: string;

  /**
   * The id of the clear button element. Optional; if omitted, clear button won't be wired.
   */
  clearButtonId?: string;

  /**
   * A CSS selector matching all searchable items (e.g., '.playlist-item').
   */
  itemSelector: string;

  /**
   * Optional: id of the container that holds search examples to show/hide.
   */
  examplesContainerId?: string;

  /**
   * Optional: selector for individual example buttons inside the examples container.
   */
  exampleButtonSelector?: string;

  /**
   * Optional custom scoring weights.
   */
  weights?: ScoringWeights;

  /**
   * Optional callback invoked when search yields no results.
   */
  onNoResults?: (searchTerm: string) => void;

  /**
   * Optional callback invoked after results are updated.
   * Provides count of visible results and the search term used.
   */
  onResultsUpdated?: (visibleCount: number, searchTerm: string) => void;

  /**
   * Optional debounce (milliseconds) applied to input events before performing search.
   * Helpful for large lists to reduce recalculation frequency. If 0 or undefined, no debounce.
   */
  debounceMs?: number;
}

/**
 * Default scoring weights used when none are supplied.
 */
const DEFAULT_WEIGHTS: Required<ScoringWeights> = {
  headline: 10,
  description: 8,
  tags: 6,
  dataSearchText: 4,
  fullTextMatch: 2,
  wordBoundaryBonus: 3,
  startsWithBonus: 5,
  exactGenreBonus: 8,
};

/**
 * A generic, reusable search utility for list-like content on the client.
 *
 * - Works with semantic metadata embedded in item elements (meta tags or data attributes)
 * - Ranks results using a configurable scoring system
 * - Manipulates item `display` and `order` to show/hide and sort results
 */
export type SearchFields = {
  headline: string;
  description: string;
  genre: string;
  dataSearchText: string;
  headlineLower: string;
  descriptionLower: string;
  genreLower: string;
  dataSearchTextLower: string;
  fullText: string;
};

/**
 *
 */
export class GenericSearchUtils implements GenericSearchInstance {
  private input: HTMLInputElement | null;
  private clearButton: HTMLButtonElement | null;
  private items: NodeListOf<Element>;
  private examplesContainer: HTMLElement | null;
  private exampleButtons: NodeListOf<HTMLButtonElement> | null;
  private weights: Required<ScoringWeights>;
  private options: GenericSearchOptions;
  private observer: MutationObserver | null = null;
  private refreshTimeout: number | null = null;
  private inputDebounceTimeout: number | null = null;

  // Implement index signature required by GenericSearchInstance so this class
  // can be used where the GenericSearchInstance contract is expected and so
  // window.__lastSearchInstance assignments are type compatible.
  [key: string]: unknown;

  /**
   * Create a new search instance with given configuration.
   * Does not throw if DOM nodes are missing; instead, it will be a no-op.
   */
  constructor(options: GenericSearchOptions) {
    this.options = options;
    this.input = safeGetElementById<HTMLInputElement>(options.inputId);
    this.clearButton = options.clearButtonId
      ? safeGetElementById<HTMLButtonElement>(options.clearButtonId)
      : null;
    this.items = document.querySelectorAll(options.itemSelector);
    this.examplesContainer = options.examplesContainerId
      ? safeGetElementById<HTMLElement>(options.examplesContainerId)
      : null;
    this.exampleButtons = options.exampleButtonSelector
      ? (document.querySelectorAll(
          options.exampleButtonSelector,
        ) as NodeListOf<HTMLButtonElement>)
      : null;

    this.weights = { ...DEFAULT_WEIGHTS, ...(options.weights || {}) };

    // Debug: log creation and basic element state
    try {
      console.warn("GenericSearchUtils: created", {
        inputId: options.inputId,
        clearButtonId: options.clearButtonId,
        itemSelector: options.itemSelector,
        inputExists: !!this.input,
        itemsCount: this.items ? this.items.length : 0,
      });
    } catch {
      // ignore logging errors in environments that don't support console
    }

    this.init();
  }

  /**
   * Initialize the instance by validating elements and wiring up listeners.
   */
  private init(): void {
    // If validation fails we still want to attach listeners when possible so that the search
    // can operate on dynamically added items later. Only abort fully if there is no input.
    if (!this.validate()) {
      try {
        console.warn(
          "GenericSearchUtils: initialization aborted - validation failed",
          {
            inputExists: !!this.input,
            itemsCount: this.items ? this.items.length : 0,
          },
        );
      } catch {
        // ignore
      }

      // If input exists but there are no items yet (dynamic content), wire listeners so the
      // manager can re-query items later when the user types.
      if (this.input) {
        try {
          console.warn(
            "GenericSearchUtils: input present but no items - wiring listeners for dynamic content",
          );
        } catch {
          // ignore
        }
        this.setupEventListeners();
        this.setupExampleButtons();

        // Attach a MutationObserver so dynamic content that adds matching items later
        // will be picked up automatically without requiring a page reload.
        this.attachObserver();
      }

      return;
    }

    try {
      console.warn("GenericSearchUtils: initialization succeeded");
    } catch {
      // ignore
    }

    this.setupEventListeners();
    this.setupExampleButtons();

    // If for some reason items are not present yet but may appear later, attach an observer
    // so the search can start working as soon as items are injected into the DOM.
    if (!this.items || this.items.length === 0) {
      this.attachObserver();
    }
  }

  /**
   * Basic validation: we need an input and items to operate.
   */
  private validate(): boolean {
    return !!(this.input && this.items && this.items.length > 0);
  }

  /**
   * Wire up input and clear button events.
   */
  private setupEventListeners(): void {
    if (!this.input) {
      return;
    }

    // Show/hide clear button on input changes
    this.input.addEventListener("input", () => {
      this.toggleClearButton();
    });

    // Trigger search on input with optional debounce
    this.input.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const delay = this.options.debounceMs || 0;
      if (delay > 0) {
        if (this.inputDebounceTimeout) {
          clearTimeout(this.inputDebounceTimeout);
        }
        this.inputDebounceTimeout = window.setTimeout(() => {
          this.performSearch(target.value);
          this.inputDebounceTimeout = null;
        }, delay);
      } else {
        this.performSearch(target.value);
      }
    });

    // Clear search when clear button is clicked
    if (this.clearButton) {
      this.clearButton.addEventListener("click", () => {
        this.clear();
      });
    }
  }

  /**
   * Wire search example buttons (if provided).
   */
  private setupExampleButtons(): void {
    if (!this.exampleButtons || !this.input) {
      return;
    }

    this.exampleButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const example = btn.textContent?.trim();
        if (example && this.input) {
          this.input.value = example;
          this.input.focus();
          this.performSearch(example);
          this.toggleClearButton();
        }
      });
    });
  }

  /**
   * Toggle the clear button visibility based on input value.
   */
  private toggleClearButton(): void {
    if (!this.input || !this.clearButton) {
      return;
    }

    if (this.input.value.trim()) {
      this.clearButton.classList.remove("opacity-0", "pointer-events-none");
      this.clearButton.classList.add("opacity-100", "pointer-events-auto");
    } else {
      this.clearButton.classList.add("opacity-0", "pointer-events-none");
      this.clearButton.classList.remove("opacity-100", "pointer-events-auto");
    }
  }

  /**
   * Clear the search input and restore original list state.
   */
  public clear(): void {
    if (this.input) {
      this.input.value = "";
    }
    if (this.clearButton) {
      // hide via class as the UI uses transition classes
      this.clearButton.classList.add("opacity-0", "pointer-events-none");
      this.clearButton.classList.remove("opacity-100", "pointer-events-auto");
    }
    this.showAllItems();
    this.showExamples();
    this.invokeResultsUpdated();
  }

  /**
   * Perform a search given a search term.
   * This method is safe to call even if the instance wasn't fully initialized.
   */
  public performSearch(searchTerm: string): void {
    // If items are not present at the time of calling (e.g., content was loaded dynamically),
    // attempt to refresh the NodeList from the DOM before giving up.
    if (!this.items || this.items.length === 0) {
      this.refreshItems();
      if (!this.items || this.items.length === 0) {
        return;
      }
    }

    const term = (searchTerm || "").trim();
    if (!term) {
      this.showAllItems();
      this.showExamples();
      this.invokeResultsUpdated();
      return;
    }

    this.hideExamples();

    const searchWords = term
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 0);

    let visibleCount = 0;

    this.items.forEach((item) => {
      const el = item as HTMLElement;
      const score = this.calculateScore(el, searchWords, term);

      if (score > 0) {
        el.style.display = "";
        // Use a high base (e.g., 1000) so that lower scores get larger order values (appear later)
        el.style.order = (1000 - Math.min(score, 999)).toString();
        visibleCount++;
      } else {
        el.style.display = "none";
      }
    });

    this.toggleClearButton();
    if (visibleCount === 0 && this.options.onNoResults) {
      this.options.onNoResults(term);
    }

    this.invokeResultsUpdated(visibleCount, term);
  }

  /**
   * Calculate a relevance score for a single element given the search words and full term.
   *
   * Element metadata sources (in order of preference):
   * - meta tags inside the element: meta[itemprop="name|description|genre"]
   * - attributes: data-search-text
   * - visible text content falls back to innerText when structured metadata is absent
   */
  /**
   * Small helpers to extract text fields from the element. This splits responsibilities
   * into smaller functions to reduce per-method complexity for linting.
   */
  private getHeadlineField(element: HTMLElement): {
    headline: string;
    headlineLower: string;
  } {
    const headline =
      element.querySelector('[itemprop="name"]')?.getAttribute("content") ||
      element.querySelector("h1, h2, h3, h4, [data-headline]")?.textContent ||
      "";
    const headlineLower = (headline || "").toLowerCase();
    return { headline, headlineLower };
  }

  private getDescriptionField(element: HTMLElement): {
    description: string;
    descriptionLower: string;
  } {
    const description =
      element
        .querySelector('[itemprop="description"]')
        ?.getAttribute("content") ||
      (element
        .querySelector("[data-description]")
        ?.getAttribute("data-description") as string) ||
      element.querySelector("p, [data-desc]")?.textContent ||
      "";
    const descriptionLower = (description || "").toLowerCase();
    return { description, descriptionLower };
  }

  private getGenreAndDataField(element: HTMLElement): {
    genre: string;
    dataSearchText: string;
    genreLower: string;
    dataSearchTextLower: string;
  } {
    const genre =
      element.querySelector('[itemprop="genre"]')?.getAttribute("content") ||
      element.getAttribute("data-genre") ||
      "";
    const dataSearchText = (
      element.getAttribute("data-search-text") || ""
    ).toString();
    const genreLower = (genre || "").toLowerCase();
    const dataSearchTextLower = dataSearchText.toLowerCase();
    return { genre, dataSearchText, genreLower, dataSearchTextLower };
  }

  private buildFullText(
    headline: string,
    description: string,
    genre: string,
    dataSearchText: string,
    element: HTMLElement,
  ): string {
    return `${headline} ${description} ${genre} ${dataSearchText} ${element.textContent || ""}`.toLowerCase();
  }

  /**
   * Extract commonly used text fields (and lowercase variants) from an element.
   * Delegates to smaller helpers to keep complexity per-method low.
   */
  private extractSearchFields(element: HTMLElement): {
    headline: string;
    description: string;
    genre: string;
    dataSearchText: string;
    headlineLower: string;
    descriptionLower: string;
    genreLower: string;
    dataSearchTextLower: string;
    fullText: string;
  } {
    const h = this.getHeadlineField(element);
    const d = this.getDescriptionField(element);
    const g = this.getGenreAndDataField(element);
    const fullText = this.buildFullText(
      h.headline,
      d.description,
      g.genre,
      g.dataSearchText,
      element,
    );

    return {
      headline: h.headline,
      description: d.description,
      genre: g.genre,
      dataSearchText: g.dataSearchText,
      headlineLower: h.headlineLower,
      descriptionLower: d.descriptionLower,
      genreLower: g.genreLower,
      dataSearchTextLower: g.dataSearchTextLower,
      fullText,
    };
  }

  /**
   * Score a single search word against extracted fields using configured weights.
   */
  private scoreWordAgainstFields(word: string, fields: SearchFields): number {
    let score = 0;

    if (fields.headlineLower.includes(word)) {
      score += this.weights.headline;
    }
    if (fields.descriptionLower.includes(word)) {
      score += this.weights.description;
    }
    if (fields.genreLower.includes(word)) {
      score += this.weights.tags;
    }
    if (fields.dataSearchTextLower.includes(word)) {
      score += this.weights.dataSearchText;
    }
    if (fields.fullText.includes(word)) {
      score += this.weights.fullTextMatch;
    }

    // word boundary bonus (e.g., matches at start of words)
    const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegExp(word)}`, "i");
    if (wordBoundaryRegex.test(fields.fullText)) {
      score += this.weights.wordBoundaryBonus;
    }

    return score;
  }

  /**
   * Calculate a relevance score for a single element given the search words and full term.
   * Refactored to delegate smaller responsibilities to helper methods to reduce complexity.
   */
  private calculateScore(
    element: HTMLElement,
    searchWords: string[],
    searchTerm: string,
  ): number {
    const fields = this.extractSearchFields(element);

    let score = 0;

    searchWords.forEach((word) => {
      if (!word) {
        return;
      }
      score += this.scoreWordAgainstFields(word, fields);
    });

    // Bonuses based on whole-term matches
    if (fields.headlineLower.startsWith(searchTerm.toLowerCase())) {
      score += this.weights.startsWithBonus;
    }
    if (fields.genreLower === searchTerm.toLowerCase()) {
      score += this.weights.exactGenreBonus;
    }

    return score;
  }

  /**
   * Ensure items NodeList is up to date (useful for dynamic content)
   */
  private refreshItems(): void {
    try {
      this.items = document.querySelectorAll(this.options.itemSelector);
      try {
        console.warn("GenericSearchUtils: refreshed items", {
          itemSelector: this.options.itemSelector,
          itemsCount: this.items.length,
        });
      } catch {
        // ignore logging errors
      }
    } catch {
      // ignore DOM errors
    }
  }

  /**
   * Attach a MutationObserver to watch for changes in the document that may add/remove
   * searchable items. This helps when the page loads content asynchronously.
   */
  private attachObserver(): void {
    if (this.observer) {
      // Already observing
      return;
    }

    try {
      const root = document.body;
      if (!root) {
        return;
      }

      this.observer = new MutationObserver((mutations) => {
        let shouldRefresh = false;

        for (const m of mutations) {
          if (
            m.type === "childList" &&
            (m.addedNodes?.length || m.removedNodes?.length)
          ) {
            shouldRefresh = true;
            break;
          }
        }

        if (shouldRefresh) {
          // Refresh the internal NodeList, but don't spam on every mutation - throttle via setTimeout.
          // A small debounce to allow batch DOM operations to finish.
          if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
          }
          this.refreshTimeout = window.setTimeout(() => {
            try {
              this.refreshItems();
            } catch {
              // ignore errors during refresh
            }
            // clear stored timeout handle after execution
            this.refreshTimeout = null;
          }, 80);
        }
      });

      // Observe subtree modifications to catch late-inserted list items
      this.observer.observe(root, { childList: true, subtree: true });
      try {
        console.warn(
          "GenericSearchUtils: MutationObserver attached for dynamic items",
        );
      } catch {
        // ignore
      }
    } catch {
      // ignore observer errors on unsupported environments
    }
  }

  /**
   * Show all items and reset ordering.
   */
  private showAllItems(): void {
    // Refresh items before operating so dynamic additions are included
    this.refreshItems();
    this.items.forEach((item) => {
      const el = item as HTMLElement;
      el.style.display = "";
      el.style.order = "";
    });
  }

  /**
   * Hide examples container (if provided)
   */
  private hideExamples(): void {
    if (this.examplesContainer) {
      this.examplesContainer.classList.add("hidden");
    }
  }

  /**
   * Show examples container (if provided)
   */
  private showExamples(): void {
    if (this.examplesContainer) {
      this.examplesContainer.classList.remove("hidden");
    }
  }

  /**
   * Utility: call the onResultsUpdated callback when provided.
   */
  private invokeResultsUpdated(
    visibleCount?: number,
    searchTerm?: string,
  ): void {
    if (this.options.onResultsUpdated) {
      // If visibleCount is undefined compute it
      if (typeof visibleCount === "undefined") {
        visibleCount = Array.from(this.items).filter(
          (it) => (it as HTMLElement).style.display !== "none",
        ).length;
      }
      this.options.onResultsUpdated(
        visibleCount,
        searchTerm || this.input?.value || "",
      );
    }
  }

  /**
   * Cleanup event listeners and references. After calling cleanup the instance
   * should not be used.
   */
  public cleanup(): void {
    // Disconnect observer if present to avoid memory leaks
    if (this.observer) {
      try {
        this.observer.disconnect();
      } catch {
        // ignore
      }
      this.observer = null;
    }

    if (this.input) {
      // clone the node to remove all listeners in a simple way
      const newInput = this.input.cloneNode(true) as HTMLInputElement;
      this.input.parentNode?.replaceChild(newInput, this.input);
      this.input = null;
    }
    if (this.clearButton) {
      const newBtn = this.clearButton.cloneNode(true) as HTMLButtonElement;
      this.clearButton.parentNode?.replaceChild(newBtn, this.clearButton);
      this.clearButton = null;
    }
    if (this.exampleButtons) {
      this.exampleButtons.forEach((btn) => {
        const newBtn = btn.cloneNode(true) as HTMLButtonElement;
        btn.parentNode?.replaceChild(newBtn, btn);
      });
      this.exampleButtons = null;
    }
  }

  /**
   * Escape a string to use in a RegExp.
   */
  private escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Implement GenericSearchInstance.search method
   */
  public search(query: string): any[] {
    if (this.input) {
      this.input.value = query;
    }
    this.performSearch(query);
    return [];
  }

  /**
   * Implement GenericSearchInstance.addDocuments method
   */
  public addDocuments(_docs: any[]): void {
    // No-op for DOM-based search
  }

  /**
   * Implement GenericSearchInstance.destroy method
   */
  public destroy(): void {
    this.cleanup();
  }
}

/**
 * Create and return a configured instance.
 */
export function initGenericSearch(
  options: GenericSearchOptions,
): GenericSearchUtils {
  return new GenericSearchUtils(options);
}

/**
 * Attempt to create an instance and swallow errors (useful in progressive enhancement).
 */
export function initGenericSearchAuto(
  options: GenericSearchOptions,
): GenericSearchUtils | null {
  try {
    const inst = new GenericSearchUtils(options);
    return inst;
  } catch {
    // Fail silently so pages degrade gracefully when scripts are unavailable
    return null;
  }
}

// GenericSearchInstance type imported via `import type` at top

/**
 * Expose a global initializer so pages using plain <script> (non-module) can initialize the search
 * without importing modules. Provide a typed Window extension to avoid using `any` casts.
 */
declare global {
  interface Window {
    initGenericSearchAuto?: (
      opts: GenericSearchOptions,
    ) => GenericSearchInstance | null;
    __initGenericSearchAuto?: (
      opts: GenericSearchOptions,
    ) => GenericSearchInstance | null;
    __lastSearchInstance?: GenericSearchInstance | null;
  }
}

try {
  if (typeof window !== "undefined") {
    window.__initGenericSearchAuto = initGenericSearchAuto;
    window.initGenericSearchAuto = initGenericSearchAuto;
  }
} catch {
  // ignore - not running in a browser environment
}
