export function safeGetElementById<T extends HTMLElement = HTMLElement>(
  id: string
): T | null {
  return document.getElementById(id) as T | null;
}

export function safeQuerySelector<T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T | null {
  return parent.querySelector(selector) as T | null;
}

export function safeQuerySelectorAll<T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T[] {
  return Array.from(parent.querySelectorAll<T>(selector));
}

/**
 * Sets innerHTML for pre-sanitized, trusted content only.
 */
export function safeSetInnerHTML(element: HTMLElement | null, html: string): void {
  if (element) {
    element.innerHTML = html;
  }
}
