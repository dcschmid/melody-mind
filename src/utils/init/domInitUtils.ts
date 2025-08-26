/**
 * DOM Initialization Utilities
 *
 * Centralized utilities for DOM-ready initialization patterns.
 * Eliminates code duplication across component utilities.
 */

import { handleGameError } from "../error/errorHandlingUtils";

/**
 * Execute a function when DOM is ready, handling both loaded and loading states
 */
export function onDOMReady(callback: () => void | Promise<void>): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      try {
        const result = callback();
        if (result instanceof Promise) {
          result.catch((err) => handleGameError(err, "onDOMReady promise"));
        }
      } catch (err) {
        handleGameError(err, "onDOMReady");
      }
    });
  } else {
    try {
      const result = callback();
      if (result instanceof Promise) {
        result.catch((err) => handleGameError(err, "onDOMReady promise"));
      }
    } catch (err) {
      handleGameError(err, "onDOMReady");
    }
  }
}

/**
 * Auto-initialization wrapper with error handling
 */
export function createAutoInit<T>(initFunction: () => T, errorContext: string): () => T | null {
  return (): T | null => {
    try {
      return initFunction();
    } catch (err) {
      handleGameError(err, `auto-init: ${errorContext}`);
      return null;
    }
  };
}

/**
 * Component initialization with cleanup
 */
export function initComponent<T extends { cleanup?: () => void }>(
  initFunction: () => T,
  componentName: string
): T | null {
  try {
    const instance = initFunction();

    // Register cleanup on page unload
    if (instance?.cleanup) {
      window.addEventListener("beforeunload", () => {
        try {
          instance.cleanup?.();
        } catch (err) {
          handleGameError(err, `cleanup: ${componentName}`);
        }
      });
    }

    return instance;
  } catch (err) {
    handleGameError(err, `initComponent: ${componentName}`);
    return null;
  }
}
