
/**
 * DOM Manipulation Utilities
 *
 * Centralized utilities for common DOM manipulation patterns.
 * Eliminates code duplication across different components.
 */

/**
 * Safely gets an element by ID with type safety
 *
 * @param id - The element ID
 * @param parent - Optional parent element (defaults to document)
 * @returns The element or null if not found
 */
export function safeGetElementById<T extends HTMLElement>(
  id: string,
  parent: Document | Element = document
): T | null {
  try {
    const element = parent.getElementById(id);
    return element as T | null;
  } catch (error) {
    return null;
  }
}

/**
 * Safely queries for elements with type safety
 *
 * @param selector - The CSS selector
 * @param parent - Optional parent element (defaults to document)
 * @returns The first matching element or null if not found
 */
export function safeQuerySelector<T extends HTMLElement>(
  selector: string,
  parent: Document | Element = document
): T | null {
  try {
    const element = parent.querySelector(selector);
    return element as T | null;
  } catch (error) {
    return null;
  }
}

/**
 * Safely queries for all elements matching a selector
 *
 * @param selector - The CSS selector
 * @param parent - Optional parent element (defaults to document)
 * @returns Array of matching elements
 */
export function safeQuerySelectorAll<T extends HTMLElement>(
  selector: string,
  parent: Document | Element = document
): T[] {
  try {
    const elements = parent.querySelectorAll(selector);
    return Array.from(elements) as T[];
  } catch (error) {
    return [];
  }
}

/**
 * Safely sets text content with error handling
 *
 * @param element - The element to set text content for
 * @param text - The text content to set
 * @returns boolean - True if successful
 */
export function safeSetTextContent(element: HTMLElement | null, text: string): boolean {
  if (!element) {
    return false;
  }

  try {
    element.textContent = text;
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Safely sets inner HTML with error handling
 *
 * @param element - The element to set inner HTML for
 * @param html - The HTML content to set
 * @returns boolean - True if successful
 */
export function safeSetInnerHTML(element: HTMLElement | null, html: string): boolean {
  if (!element) {
    return false;
  }

  try {
    element.innerHTML = html;
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Safely adds CSS classes with error handling
 *
 * @param element - The element to add classes to
 * @param classes - Array of CSS classes to add
 * @returns boolean - True if successful
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
  } catch (error) {
    return false;
  }
}

/**
 * Safely removes CSS classes with error handling
 *
 * @param element - The element to remove classes from
 * @param classes - Array of CSS classes to remove
 * @returns boolean - True if successful
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
  } catch (error) {
    return false;
  }
}

/**
 * Safely sets data attributes with error handling
 *
 * @param element - The element to set data attributes for
 * @param attributes - Object mapping attribute names to values
 * @returns boolean - True if successful
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
  } catch (error) {
    return false;
  }
}

/**
 * Safely removes an element from the DOM
 *
 * @param element - The element to remove
 * @returns boolean - True if successful
 */
export function safeRemoveElement(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  try {
    element.remove();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Safely appends a child element
 *
 * @param parent - The parent element
 * @param child - The child element to append
 * @returns boolean - True if successful
 */
export function safeAppendChild(parent: HTMLElement | null, child: HTMLElement | null): boolean {
  if (!parent || !child) {
    return false;
  }

  try {
    parent.appendChild(child);
    return true;
  } catch (error) {
    return false;
  }
}
