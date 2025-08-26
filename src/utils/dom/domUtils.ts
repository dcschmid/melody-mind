/**
 * DOM Manipulation Utilities
 *
 * Centralized utilities for common DOM manipulation patterns.
 * Eliminates code duplication across different components.
 */

/**
 * Safely gets an element by ID with type safety.
 *
 * This helper tolerates being called with either a `Document` or an `Element`
 * parent. The runtime implementation uses `getElementById` for Documents and
 * `querySelector` for Element parents.
 *
 * @param {string} id - The element ID to look up (without the leading '#')
 * @param {Document|Element} [parent=document] - Optional parent root to search within.
 *        When omitted the global `document` is used.
 * @returns {T | null} The found element cast to the requested generic type, or `null`
 *          when no matching element exists or an error occurs during lookup.
 */
export function safeGetElementById<T extends HTMLElement>(
  id: string,
  parent: Document | Element = document
): T | null {
  try {
    // Narrow the parent at runtime: Document has getElementById, Element does not.
    if (parent instanceof Document) {
      const element = parent.getElementById(id);
      return element as T | null;
    }
    // Fallback for Element parents: use querySelector to find by id.
    const el = (parent as Element).querySelector(`#${id}`);
    return el as T | null;
  } catch {
    return null;
  }
}

/**
 * Safely queries for elements with type safety.
 *
 * Wrapper around `querySelector` that performs a try/catch and returns
 * `null` on error to avoid throwing in client code.
 *
 * @param {string} selector - CSS selector used to find the first matching element
 * @param {Document|Element} [parent=document] - Root element to query within (defaults to document)
 * @returns {T | null} The first matching element cast to the requested generic type, or `null`
 *          when none is found or an error occurs.
 */
export function safeQuerySelector<T extends HTMLElement>(
  selector: string,
  parent: Document | Element = document
): T | null {
  try {
    const element = parent.querySelector(selector);
    return element as T | null;
  } catch {
    return null;
  }
}

/**
 * Safely queries for all elements matching a selector.
 *
 * Returns an empty array on error. This normalizes the return value so callers
 * can always iterate over the result without additional null checks.
 *
 * @param {string} selector - CSS selector for matching elements
 * @param {Document|Element} [parent=document] - Root element to query within (defaults to document)
 * @returns {T[]} Array of matching elements cast to the requested generic type.
 */
export function safeQuerySelectorAll<T extends HTMLElement>(
  selector: string,
  parent: Document | Element = document
): T[] {
  try {
    const elements = parent.querySelectorAll(selector);
    return Array.from(elements) as T[];
  } catch {
    return [];
  }
}

/**
 * Safely sets text content with error handling.
 *
 * Sets `.textContent` on the provided element inside a try/catch and returns
 * a boolean indicating success. Useful when working with elements that may
 * not be present in all runtime contexts.
 *
 * @param {HTMLElement | null} element - The target element (or `null`)
 * @param {string} text - Text content to assign to the element
 * @returns {boolean} True if the operation succeeded, false otherwise
 */
export function safeSetTextContent(element: HTMLElement | null, text: string): boolean {
  if (!element) {
    return false;
  }

  try {
    element.textContent = text;
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely sets inner HTML with error handling.
 *
 * Uses `innerHTML` inside a try/catch and returns a boolean success flag.
 * Be careful using this helper with untrusted HTML to avoid XSS.
 *
 * @param {HTMLElement | null} element - The element to update (or `null`)
 * @param {string} html - HTML string to set as the element's content
 * @returns {boolean} True when the assignment succeeded, false on error or if `element` is null
 */
export function safeSetInnerHTML(element: HTMLElement | null, html: string): boolean {
  if (!element) {
    return false;
  }

  try {
    element.innerHTML = html;
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely adds CSS classes with error handling.
 *
 * Trims supplied class names and adds them via `classList.add`. Invalid or
 * empty class names are ignored. Returns a boolean indicating success.
 *
 * @param {HTMLElement | null} element - Target element to receive classes (or `null`)
 * @param {string[]} classes - Array of CSS class names to add
 * @returns {boolean} True if classes were successfully added, false otherwise
 */
export function safeAddClasses(element: HTMLElement | null, classes: string[]): boolean {
  if (!element) {
    return false;
  }

  try {
    classes.forEach((className) => {
      if (className.trim()) {
        element.classList.add(className.trim());
      }
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely removes CSS classes with error handling.
 *
 * Trims supplied class names and removes them via `classList.remove`. Invalid
 * or empty class names are ignored. Returns a boolean indicating success.
 *
 * @param {HTMLElement | null} element - Target element to remove classes from (or `null`)
 * @param {string[]} classes - Array of CSS class names to remove
 * @returns {boolean} True if classes were successfully removed, false otherwise
 */
export function safeRemoveClasses(element: HTMLElement | null, classes: string[]): boolean {
  if (!element) {
    return false;
  }

  try {
    classes.forEach((className) => {
      if (className.trim()) {
        element.classList.remove(className.trim());
      }
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely sets data attributes with error handling.
 *
 * Each entry in the `attributes` object is written as a `data-<key>` attribute
 * on the element. Keys and values are used verbatim; callers should ensure
 * keys are valid HTML data attribute names.
 *
 * @param {HTMLElement | null} element - Element to set data attributes on (or `null`)
 * @param {Record<string, string>} attributes - Map of attributeName => value (e.g. { lang: 'en' })
 * @returns {boolean} True if all attributes were set successfully, false otherwise
 */
export function safeSetDataAttributes(
  element: HTMLElement | null,
  attributes: Record<string, string>
): boolean {
  if (!element) {
    return false;
  }

  try {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(`data-${key}`, value);
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely removes an element from the DOM.
 *
 * Uses `Element.remove()` in a try/catch and returns whether the call succeeded.
 *
 * @param {HTMLElement | null} element - Element to remove (or `null`)
 * @returns {boolean} True when the element was removed, false when the element is null or an error occurred
 */
export function safeRemoveElement(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  try {
    element.remove();
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely appends a child element.
 *
 * Appends `child` to `parent` using `appendChild` inside a try/catch and returns
 * a boolean indicating success. Both parameters must be non-null HTMLElement
 * instances.
 *
 * @param {HTMLElement | null} parent - Parent element to append into (or `null`)
 * @param {HTMLElement | null} child - Child element to append (or `null`)
 * @returns {boolean} True if append succeeded, false otherwise
 */
export function safeAppendChild(parent: HTMLElement | null, child: HTMLElement | null): boolean {
  if (!parent || !child) {
    return false;
  }

  try {
    parent.appendChild(child);
    return true;
  } catch {
    return false;
  }
}
