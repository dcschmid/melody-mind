/**
 * Global type augmentations for Melody Mind
 *
 * This file extends the global `Window` interface with properties used
 * across several pages/components:
 * - `knowledgeTranslations`: lightweight translation snippets exposed to the client
 *   for use in small inline scripts.
 * - `__lastSearchInstance`: a debug/handle reference to the last initialized
 *   generic search instance so external scripts can reset or inspect it.
 *
 * Keep this file minimal and focused to avoid polluting the global namespace.
 */

declare interface KnowledgeSearchTranslations {
  showingAll?: string;
  articlesFound?: string;
  [key: string]: unknown;
}

declare interface KnowledgeTranslations {
  search?: KnowledgeSearchTranslations;
  [key: string]: unknown;
}

declare interface GenericSearchInstance {
  /**
   * Clears current search results / resets the instance.
   */
  clear?: () => void;

  /**
   * Performs a search with the given term. Used as a fallback reset when
   * `clear` is not available.
   */
  performSearch?: (term: string) => void;

  /**
   * Allow other unknown properties/methods that some implementations may provide.
   * Use `unknown` for looser, safer typing; callers should refine before use.
   */
  [key: string]: unknown;
}

declare global {
  interface Window {
    /**
     * Small translation bundle exposed to client-side inline scripts.
     * Example usage in templates:
     *   window.knowledgeTranslations?.search?.showingAll
     */
    knowledgeTranslations?: KnowledgeTranslations;

    /**
     * A debug reference to the last created search instance.
     * Several pages set `window.__lastSearchInstance = instance;` so other
     * scripts (or tests) can call `clear()` or `performSearch("")`.
     */
    __lastSearchInstance?: GenericSearchInstance | null;
  }
}

// Ensure this file is treated as a module and its augmentations are applied.
export {};
