/**
 * Lightweight debug utilities (dev-only output)
 * ---------------------------------------------------------------------------
 * A minimal namespaced logging helper used across client & inline scripts.
 *
 * Goals:
 *  - Provide consistent, easily filterable development logging.
 *  - Zero output in production builds (guarded by import.meta.env.DEV).
 *  - Avoid heavy deps or overly clever formatting.
 *  - Allow inline classic scripts (non-module) to hook in via the global
 *    bridge (`window.__mmDebug`) established in `Layout.astro` (dev only).
 *
 * Pattern:
 *  debug('namespace', 'message', optionalData)
 *  debug.enable('namespace')   // Restrict output to specific namespaces
 *  debug.disable('namespace')
 *  debug.isEnabled('namespace')
 *
 * If no namespaces have been explicitly enabled, all are treated as enabled
 * to reduce configuration friction during early development.
 *
 * Example:
 *  debug('shareOverlay', 'Initialization started');
 *  if (configError) warn('config', 'Invalid config', configError);
 *
 * NOTE: We intentionally use `console.warn` (instead of `console.debug`) to
 * conform to the project ESLint allowlist while still visually distinguishing
 * logs in the console. Errors use `console.error`.
 */

/**
 * DebugFn
 * Public function type for the debug logger with namespace controls.
 */
interface DebugFn {
  (namespace: string, ...args: unknown[]): void;
  enable(ns: string): void;
  disable(ns: string): void;
  isEnabled(ns: string): boolean;
}

const enabledNamespaces: Set<string> = new Set();

function matches(namespace: string): boolean {
  if (!enabledNamespaces.size) {
    return true; // default: all enabled until user restricts
  }
  return enabledNamespaces.has(namespace);
}

/**
 * debug
 * Core logging function (DEV only). No-ops in production builds.
 *
 * @param {string} namespace A short identifier grouping related logs (e.g. 'endOverlay')
 * @param {...unknown} args Variadic payload forwarded to console output when active
 */
export const debug: DebugFn = ((namespace: string, ...args: unknown[]) => {
  try {
    const env = (import.meta as unknown as { env?: Record<string, unknown> }).env;
    if (!env?.DEV) {
      return;
    }
    if (!matches(namespace)) {
      return;
    }
    // Using console.warn instead of debug to comply with lint allowlist (warn, error)
    console.warn(`[${namespace}]`, ...args);
  } catch {
    /* swallow */
  }
}) as DebugFn;

/** Enable logging for a specific namespace (implicit allow-all if none set). */
debug.enable = (ns: string): void => {
  enabledNamespaces.add(ns);
};

/** Disable logging for a previously enabled namespace. */
debug.disable = (ns: string): void => {
  enabledNamespaces.delete(ns);
};

/** Returns true if the namespace is explicitly enabled. */
debug.isEnabled = (ns: string): boolean => enabledNamespaces.has(ns);

/**
 * Dev-only warning logger (namespace-scoped)
 */
/**
 * warn
 * Development-only namespaced warning logger.
 * @param {string} namespace Logical feature group (e.g. 'i18n', 'shareOverlay')
 * @param {...unknown} args Additional payload for context
 */
export function warn(namespace: string, ...args: unknown[]): void {
  try {
    const env = (import.meta as unknown as { env?: Record<string, unknown> }).env;
    if (!env?.DEV) {
      return;
    }
    if (!matches(namespace)) {
      return;
    }
    console.warn(`[${namespace}]`, ...args);
  } catch {
    /* swallow */
  }
}

/**
 * Dev-only error logger (namespace-scoped)
 */
/**
 * error
 * Development-only namespaced error logger.
 * @param {string} namespace Logical feature group (e.g. 'endOverlay')
 * @param {...unknown} args Additional payload for context (Error objects, metadata)
 */
export function error(namespace: string, ...args: unknown[]): void {
  try {
    const env = (import.meta as unknown as { env?: Record<string, unknown> }).env;
    if (!env?.DEV) {
      return;
    }
    if (!matches(namespace)) {
      return;
    }
    console.error(`[${namespace}]`, ...args);
  } catch {
    /* swallow */
  }
}
