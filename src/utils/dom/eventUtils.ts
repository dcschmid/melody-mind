/**
 * DOM Event Utilities
 *
 * Centralized utilities for common DOM event handling patterns.
 * Eliminates code duplication across different components.
 */

/**
 * Safely adds a click event listener with error handling.
 *
 * @param {HTMLElement | null} element - The element to attach the event listener to.
 * @param {(event: MouseEvent) => void} handler - The event handler function.
 * @param {AddEventListenerOptions} [options] - Optional event listener options.
 * @returns {boolean} True if the event listener was added successfully.
 */
export function addSafeClickListener(
  element: HTMLElement | null,
  handler: (event: MouseEvent) => void,
  options?: AddEventListenerOptions
): boolean {
  if (!element) {
    return false;
  }

  try {
    element.addEventListener("click", handler, options);
    return true;
  } catch (err: unknown) {
    // Ignore errors but keep them available for future diagnostics if needed
    void err;
    return false;
  }
}

/**
 * Safely adds multiple event listeners to an element.
 *
 * @param {HTMLElement | null} element - The element to attach event listeners to.
 * @param {Record<string, EventListenerOrEventListenerObject>} events - Object mapping event types to handlers.
 * @param {AddEventListenerOptions} [options] - Optional event listener options.
 * @returns {boolean} True if all event listeners were added successfully.
 */
export function addMultipleEventListeners(
  element: HTMLElement | null,
  events: Record<string, EventListenerOrEventListenerObject>,
  options?: AddEventListenerOptions
): boolean {
  if (!element) {
    return false;
  }

  try {
    Object.entries(events).forEach(([eventType, handler]) => {
      element.addEventListener(eventType, handler as EventListener, options);
    });
    return true;
  } catch (err: unknown) {
    void err;
    return false;
  }
}

/**
 * Removes all event listeners from an element.
 *
 * NOTE: Removing all listeners exactly is not possible in the DOM without tracking
 * them; this helper provides two strategies:
 * - If no eventTypes are provided, it replaces the element with a cloned node,
 *   which effectively removes listeners attached directly to the element.
 * - If eventTypes are provided, it attempts to remove the listeners by calling
 *   removeEventListener with a noop handler (best-effort).
 *
 * @param {HTMLElement | null} element - The element to remove event listeners from.
 * @param {string[]} [eventTypes=[]] - Array of event types to remove (if empty, replaces the node).
 * @returns {boolean} True if event listeners were removed successfully or operation was attempted.
 */
export function removeAllEventListeners(
  element: HTMLElement | null,
  eventTypes: string[] = []
): boolean {
  if (!element) {
    return false;
  }

  try {
    if (eventTypes.length === 0) {
      // Clone the element to remove all event listeners
      const newElement = element.cloneNode(true) as HTMLElement;
      element.parentNode?.replaceChild(newElement, element);
    } else {
      const noop = (): void => {};
      eventTypes.forEach((eventType) => {
        try {
          element.removeEventListener(eventType, noop as EventListener);
        } catch (err: unknown) {
          void err;
        }
      });
    }
    return true;
  } catch (err: unknown) {
    void err;
    return false;
  }
}

/**
 * Creates a debounced event handler.
 *
 * The returned handler will postpone execution of the provided handler until after
 * `delay` milliseconds have elapsed since the last time it was invoked.
 *
 * @template T
 * @param {(event: T) => void} handler - The original event handler to debounce.
 * @param {number} delay - Debounce delay in milliseconds.
 * @returns {(event: T) => void} Debounced event handler.
 */
export function createDebouncedHandler<T extends Event>(
  handler: (event: T) => void,
  delay: number
): (event: T) => void {
  let timeoutId: number | undefined;

  return (event: T): void => {
    if (typeof timeoutId !== "undefined") {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      try {
        handler(event);
      } catch {
        // Swallow handler errors to avoid breaking the debounced pipeline
      }
    }, delay) as unknown as number;
  };
}

/**
 * Creates a throttled event handler.
 *
 * The returned handler will call the original handler at most once per `delay`
 * milliseconds.
 *
 * @template T
 * @param {(event: T) => void} handler - The original event handler to throttle.
 * @param {number} delay - Throttle interval in milliseconds.
 * @returns {(event: T) => void} Throttled event handler.
 */
export function createThrottledHandler<T extends Event>(
  handler: (event: T) => void,
  delay: number
): (event: T) => void {
  let lastCall = 0;

  return (event: T): void => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      try {
        handler(event);
      } catch {
        // Swallow handler errors to avoid breaking the throttled pipeline
      }
    }
  };
}
