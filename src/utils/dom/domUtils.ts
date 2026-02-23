/**
 * DOM manipulation utilities.
 *
 * Provides type-safe wrappers around common DOM operations with
 * null-safety and consistent return types.
 *
 * @module utils/dom/domUtils
 */

/**
 * Safely get an element by ID with type inference.
 *
 * @typeParam T - The expected element type (default: HTMLElement)
 * @param id - The element ID to search for
 * @returns The element if found, or null
 *
 * @example
 * ```typescript
 * const button = safeGetElementById<HTMLButtonElement>("submit-btn");
 * if (button) {
 *   button.disabled = true;
 * }
 * ```
 */
export function safeGetElementById<T extends HTMLElement = HTMLElement>(
  id: string
): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Safely query for a single element with type inference.
 *
 * @typeParam T - The expected element type (default: Element)
 * @param selector - CSS selector string
 * @param parent - Parent node to search within (default: document)
 * @returns The first matching element, or null if not found
 *
 * @example
 * ```typescript
 * const activeTab = safeQuerySelector<HTMLButtonElement>("[data-active='true']");
 * const navItem = safeQuerySelector<HTMLAnchorElement>("a", navElement);
 * ```
 */
export function safeQuerySelector<T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T | null {
  return parent.querySelector(selector) as T | null;
}

/**
 * Safely query for all matching elements with type inference.
 *
 * @typeParam T - The expected element type (default: Element)
 * @param selector - CSS selector string
 * @param parent - Parent node to search within (default: document)
 * @returns Array of matching elements (empty array if none found)
 *
 * @example
 * ```typescript
 * const buttons = safeQuerySelectorAll<HTMLButtonElement>(".btn");
 * buttons.forEach(btn => btn.classList.add("processed"));
 * ```
 */
export function safeQuerySelectorAll<T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T[] {
  return Array.from(parent.querySelectorAll<T>(selector));
}

/**
 * Safely set innerHTML on an element (no-op if element is null).
 *
 * @param element - The target element (or null)
 * @param html - The HTML string to set
 *
 * @example
 * ```typescript
 * safeSetInnerHTML(document.getElementById("content"), "<p>Updated</p>");
 * ```
 */
export function safeSetInnerHTML(element: HTMLElement | null, html: string): void {
  if (element) {
    element.innerHTML = html;
  }
}
