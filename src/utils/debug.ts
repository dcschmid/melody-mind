/**
 * Debug utility for development logging
 * Only active in development mode
 */

const isDev = import.meta.env?.DEV ?? false;

/**
 * Debug logging function
 * @param args - Arguments to log
 */
export function debug(...args: any[]): void {
  if (isDev && typeof console !== 'undefined') {
    console.log('[MelodyMind Debug]', ...args);
  }
}

/**
 * Debug warning function
 * @param args - Arguments to warn
 */
export function debugWarn(...args: any[]): void {
  if (isDev && typeof console !== 'undefined') {
    console.warn('[MelodyMind Debug]', ...args);
  }
}

/**
 * Debug error function
 * @param args - Arguments to error
 */
export function debugError(...args: any[]): void {
  if (isDev && typeof console !== 'undefined') {
    console.error('[MelodyMind Debug]', ...args);
  }
}

export default debug;
