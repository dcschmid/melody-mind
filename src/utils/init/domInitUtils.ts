/**
 * DOM Initialization Utilities
 *
 * Centralized utilities for DOM-ready initialization patterns.
 * Eliminates code duplication across component utilities.
 */

/**
 * Execute a function when DOM is ready, handling both loaded and loading states
 */
export function onDOMReady(callback: () => void | Promise<void>): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      try {
        const result = callback();
        if (result instanceof Promise) {
          result.catch((error) => {});
        }
      } catch (error) {}
    });
  } else {
    try {
      const result = callback();
      if (result instanceof Promise) {
        result.catch((error) => {});
      }
    } catch (error) {}
  }
}

/**
 * Auto-initialization wrapper with error handling
 */
export function createAutoInit<T>(initFunction: () => T, errorContext: string): () => T | null {
  return (): T | null => {
    try {
      return initFunction();
    } catch (error) {
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
        instance.cleanup?.();
      });
    }

    return instance;
  } catch (error) {
    return null;
  }
}
