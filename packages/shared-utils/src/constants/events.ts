/**
 * Centralized custom DOM event names shared across client-side scripts and UI components.
 *
 * These constants define the lightweight event contract used for browser-only
 * communication between otherwise decoupled modules, for example:
 * - interactive UI components notifying analytics code,
 * - footer or consent controls opening shared overlays,
 * - theme and bookmark changes propagating across the page.
 *
 * Keeping event names here avoids string drift, makes cross-package event usage
 * easier to grep, and provides a single place to document naming intent.
 *
 * @module constants/events
 */

import { isServer } from "../utils/environment";

/**
 * Bookmark lifecycle events emitted when bookmark state changes on the client.
 *
 * Consumers typically use these to refresh bookmark-dependent UI or trigger
 * analytics side effects without tightly coupling to bookmark storage internals.
 */
export const BOOKMARK_EVENTS = {
  /** Fired after bookmark state changes, regardless of whether the action was add, remove, or edit. */
  CHANGED: "mm:bookmarks:changed",
  /** Fired when the UI offers an undo path for a recent bookmark removal. */
  UNDO_REMOVE: "mm:bookmarks:undo-remove",
} as const;

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
 * Cookie-consent workflow events used by the consent banner and footer controls.
 *
 * They allow any part of the UI to request opening the consent dialog or react
 * when the effective preference set changes.
 */
export const CONSENT_EVENTS = {
  /** Fired when the consent UI should open or regain focus. */
  OPEN: "cookie-consent:open",
  /** Fired after consent preferences are saved or updated. */
  CHANGED: "cookie-consent:change",
} as const;

/**
 * Search interaction events emitted by shared search UI components.
 *
 * These events are intentionally coarse-grained so analytics and surrounding UI
 * can react to search usage without receiving the entire component internals.
 */
export const SEARCH_EVENTS = {
  /** Fired when a search query is submitted or updated into a tracked result set. */
  PERFORMED: "search:performed",
  /** Fired when a user activates a search result. */
  RESULT_CLICK: "search:result-click",
} as const;

/**
 * Table-of-contents interaction events.
 *
 * Currently used to signal that a section link in the TOC was activated, which is
 * useful for analytics and reading-behavior instrumentation.
 */
export const TOC_EVENTS = {
  /** Fired when a TOC entry is activated. */
  CLICK: "toc:click",
} as const;

type EventValues<T extends Record<string, string>> = T[keyof T];

/**
 * Union of all supported shared event names.
 *
 * Useful for typed helpers and for constraining callers to the curated event
 * contract defined in this module.
 */
export type EventName =
  | EventValues<typeof BOOKMARK_EVENTS>
  | EventValues<typeof THEME_EVENTS>
  | EventValues<typeof CONSENT_EVENTS>
  | EventValues<typeof SEARCH_EVENTS>
  | EventValues<typeof TOC_EVENTS>;

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
