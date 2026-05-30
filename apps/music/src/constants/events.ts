/**
 * Centralized custom DOM event names shared across client-side scripts and UI components.
 *
 * These constants define the lightweight event contract used for browser-only
 * communication between otherwise decoupled modules, for example:
 * - interactive UI components notifying surrounding code,
 * - search changes propagating across the page.
 *
 * Keeping event names here avoids string drift, makes cross-package event usage
 * easier to grep, and provides a single place to document naming intent.
 *
 * @module constants/events
 */

/**
 * Union of all supported shared event names.
 *
 * Useful for typed helpers and for constraining callers to the curated event
 * contract defined in this module.
 */
type EventName = "search:performed" | "search:result-click";

/**
 * Dispatches a typed browser `CustomEvent` on `window`.
 *
 * The helper is intentionally minimal:
 * - it no-ops during SSR,
 * - it enforces an event name from the shared registry,
 * - and it forwards optional `detail` payloads unchanged.
 *
 * Use this when adding new event dispatches in shared utility code. Existing
 * direct `new CustomEvent(...)` call sites can gradually migrate here.
 */
export function dispatchCustomEvent<T = unknown>(eventName: EventName, detail?: T): void {
  if (typeof window === "undefined") {
    return;
  }

  const eventInit = detail === undefined ? undefined : { detail };
  window.dispatchEvent(new CustomEvent<T>(eventName, eventInit));
}
