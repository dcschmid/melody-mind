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

/**
 * Exported small translation bundle type so it can be imported by other modules
 * when necessary (avoids triple-slash references and makes types explicitly importable).
 */
export interface KnowledgeSearchTranslations {
  showingAll?: string;
  articlesFound?: string;
  [key: string]: unknown;
}

export interface KnowledgeTranslations {
  search?: KnowledgeSearchTranslations;
  [key: string]: unknown;
}

/**
 * Export the GenericSearchInstance interface so that other modules can `import type`
 * this contract when they need to reference the instance shape (e.g. for global
 * helpers exposed on window).
 */
export interface GenericSearchInstance {
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

/**
 * Also augment the global Window interface so legacy inline scripts/pages that
 * set `window.__lastSearchInstance` still have a correct type available.
 * The exported types above can be imported elsewhere via `import type`.
 */
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
     *
     * The concrete shape is exported above as `GenericSearchInstance` so other
     * modules may `import type { GenericSearchInstance } from "../types/global";`
     * if they need to reference the interface directly.
     */
    __lastSearchInstance?: GenericSearchInstance | null;
  }
}

/**
 * Ensure this file is treated as a module and its augmentations are applied.
 * Export an empty object so TypeScript treats this file as a module and the
 * global augmentation above is correctly merged into the global scope.
 */
export {};
