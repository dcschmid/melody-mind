/**
 * DOM helpers shared across interactive utilities.
 */
export function safeGetElementById<T extends HTMLElement = HTMLElement>(
  id: string
): T | null {
  return document.getElementById(id) as T | null;
}
