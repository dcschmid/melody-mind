/**
 * Centralized custom DOM event names shared across client-side scripts and UI components.
 *
 * These constants define the lightweight event contract used for browser-only
 * communication between otherwise decoupled modules, for example:
 * - interactive UI components notifying surrounding code,
 * - theme and search changes propagating across the page.
 *
 * Keeping event names here avoids string drift, makes cross-package event usage
 * easier to grep, and provides a single place to document naming intent.
 *
 * @module constants/events
 */

import { isServer } from "../utils/environment";

/**
 * Theme synchronization events for propagating light/dark preference changes.
 *
 * This event is emitted by theme initialization and manual theme toggles so
 * listeners can respond without directly depending on storage implementation.
 */
export const THEME_EVENTS = {
  /** Fired whenever the active theme changes, including system-driven and manual changes. */
  CHANGED: "theme:change",
} as const;

/**
 * Search interaction events emitted by shared search UI components.
 *
 * These events are intentionally coarse-grained so surrounding UI can react to
 * search usage without receiving the entire component internals.
 */
export const SEARCH_EVENTS = {
  /** Fired when a search query is submitted or updated into a tracked result set. */
  PERFORMED: "search:performed",
  /** Fired when a user activates a search result. */
  RESULT_CLICK: "search:result-click",
} as const;

type EventValues<T extends Record<string, string>> = T[keyof T];

/**
 * Union of all supported shared event names.
 *
 * Useful for typed helpers and for constraining callers to the curated event
 * contract defined in this module.
 */
type EventName = EventValues<typeof THEME_EVENTS> | EventValues<typeof SEARCH_EVENTS>;

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
  if (isServer) {
    return;
  }

  window.dispatchEvent(new CustomEvent<T>(eventName, { detail }));
}
