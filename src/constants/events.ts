/**
 * Centralized custom event names used across the application.
 *
 * Using centralized event names prevents typos and makes it easier to
 * track event usage across the codebase.
 *
 * @module constants/events
 */

import { isServer } from "@utils/environment";

/**
 * Bookmark-related events.
 */
export const BOOKMARK_EVENTS = {
  /** Fired when bookmarks are added, removed, or modified */
  CHANGED: "mm:bookmarks:changed",
  /** Fired when a bookmark removal can be undone */
  UNDO_REMOVE: "mm:bookmarks:undo-remove",
} as const;

/**
 * Theme-related events.
 */
export const THEME_EVENTS = {
  /** Fired when the theme changes (light/dark) */
  CHANGED: "theme:change",
} as const;

/**
 * Cookie consent events.
 */
export const CONSENT_EVENTS = {
  /** Fired when the consent banner should open */
  OPEN: "cookie-consent:open",
  /** Fired when consent preferences change */
  CHANGED: "cookie-consent:change",
} as const;

/**
 * Reading preferences events.
 */
export const READING_EVENTS = {
  /** Fired when reading settings panel should open */
  OPEN: "reading-settings:open",
  /** Fired when reading preferences change */
  CHANGED: "reading-preferences:change",
} as const;

/**
 * Search-related events.
 */
export const SEARCH_EVENTS = {
  /** Fired when a search is performed */
  PERFORMED: "search:performed",
  /** Fired when a search result is clicked */
  RESULT_CLICK: "search:result-click",
} as const;

/**
 * Table of contents events.
 */
export const TOC_EVENTS = {
  /** Fired when a TOC link is clicked */
  CLICK: "toc:click",
} as const;

/**
 * Toast/notification events.
 */
export const TOAST_EVENTS = {
  /** Fired when a toast should be shown */
  SHOW: "melodymind:toast",
} as const;

/**
 * All custom event names combined.
 */
export const EVENTS = {
  ...BOOKMARK_EVENTS,
  ...THEME_EVENTS,
  ...CONSENT_EVENTS,
  ...READING_EVENTS,
  ...SEARCH_EVENTS,
  ...TOC_EVENTS,
  ...TOAST_EVENTS,
} as const;

/**
 * Type for all event names.
 */
export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/**
 * Helper to dispatch a typed custom event.
 */
export function dispatchCustomEvent<T = unknown>(eventName: EventName, detail?: T): void {
  if (isServer) {
    return;
  }

  window.dispatchEvent(new CustomEvent<T>(eventName, { detail }));
}
