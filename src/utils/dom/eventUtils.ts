/**
 * DOM Event Utilities
 *
 * Centralized utilities for common DOM event handling patterns.
 * Eliminates code duplication across different components.
 */

/**
 * Safely adds a click event listener with error handling
 *
 * @param element - The element to attach the event listener to
 * @param handler - The event handler function
 * @param options - Optional event listener options
 * @returns boolean - True if the event listener was added successfully
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
  } catch (error) {
    return false;
  }
}

/**
 * Safely adds multiple event listeners to an element
 *
 * @param element - The element to attach event listeners to
 * @param events - Object mapping event types to handlers
 * @param options - Optional event listener options
 * @returns boolean - True if all event listeners were added successfully
 */
export function addMultipleEventListeners(
  element: HTMLElement | null,
  events: Record<string, EventListener>,
  options?: AddEventListenerOptions
): boolean {
  if (!element) {
    return false;
  }

  try {
    Object.entries(events).forEach(([eventType, handler]) => {
      element.addEventListener(eventType, handler, options);
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Removes all event listeners from an element
 *
 * @param element - The element to remove event listeners from
 * @param eventTypes - Array of event types to remove (if empty, removes all)
 * @returns boolean - True if event listeners were removed successfully
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
      eventTypes.forEach((eventType) => {
        element.removeEventListener(eventType, () => {});
      });
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Creates a debounced event handler
 *
 * @param handler - The original event handler
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced event handler
 */
export function createDebouncedHandler<T extends Event>(
  handler: (event: T) => void,
  delay: number
): (event: T) => void {
  let timeoutId: number | null = null;

  return (event: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      handler(event);
    }, delay);
  };
}

/**
 * Creates a throttled event handler
 *
 * @param handler - The original event handler
 * @param delay - Throttle delay in milliseconds
 * @returns Throttled event handler
 */
export function createThrottledHandler<T extends Event>(
  handler: (event: T) => void,
  delay: number
): (event: T) => void {
  let lastCall = 0;

  return (event: T) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      handler(event);
    }
  };
}
