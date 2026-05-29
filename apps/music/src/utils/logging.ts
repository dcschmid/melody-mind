/**
 * Lightweight structured logging helper shared across apps and packages.
 *
 * The module provides:
 * - a small severity model (`debug` → `error`)
 * - module-prefixed logger instances for consistent console output
 *
 * It is intentionally minimal and console-backed. This is a developer-facing utility for local
 * diagnostics and coarse production logging, not a full remote observability layer.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

/** Log levels in ascending order of severity. */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Detects production mode without requiring Node.js type definitions.
 *
 * The helper reads a process-like object from `globalThis` when available, which preserves the
 * existing runtime behavior in Node-based builds while keeping the file browser-safe to typecheck.
 */
function isProductionRuntime(): boolean {
  const processLike = (
    globalThis as {
      process?: {
        env?: {
          NODE_ENV?: string;
        };
      };
    }
  ).process;

  return processLike?.env?.NODE_ENV === "production";
}

/**
 * Current minimum log level.
 *
 * Defaults to `warn` in production and `debug` otherwise so development keeps richer output
 * while production suppresses lower-signal console noise by default.
 */
let currentLogLevel: LogLevel = isProductionRuntime() ? "warn" : "debug";

/** Returns whether a message at the given severity should currently be emitted. */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLogLevel];
}

/** Formats log output with a stable module prefix for easy scanning and filtering. */
function formatMessage(module: string, message: string): string {
  return `[${module}] ${message}`;
}

/**
 * Create a logger for a specific module.
 *
 * The returned logger mirrors common console operations plus a few convenience helpers for
 * deprecations and simple timing output. All methods honor the shared global log level.
 *
 * @example
 * ```typescript
 * const logger = createLogger("content");
 *
 * logger.info("Collection loaded", { name: "knowledge-en" });
 * logger.warn("Entry missing optional metadata");
 * logger.error("Failed to build page", new Error("..."));
 * ```
 */
export function createLogger(module: string) {
  return {
    /**
     * Emits a debug-level message when the current log level allows it.
     */
    debug(message: string, data?: unknown): void {
      if (!shouldLog("debug")) {
        return;
      }
      console.debug(formatMessage(module, message), data ?? "");
    },

    /**
     * Emits an informational message.
     */
    info(message: string, data?: unknown): void {
      if (!shouldLog("info")) {
        return;
      }
      console.info(formatMessage(module, message), data ?? "");
    },

    /**
     * Emits a warning message.
     */
    warn(message: string, data?: unknown): void {
      if (!shouldLog("warn")) {
        return;
      }
      console.warn(formatMessage(module, message), data ?? "");
    },

    /**
     * Emits an error message.
     *
     * Native `Error` objects are normalized to a small structured payload so the message and
     * stack remain visible without relying on browser-specific console formatting.
     */
    error(message: string, error?: unknown): void {
      if (!shouldLog("error")) {
        return;
      }

      const formatted = formatMessage(module, message);

      if (error instanceof Error) {
        console.error(formatted, {
          message: error.message,
          stack: error.stack,
        });
      } else {
        console.error(formatted, error ?? "");
      }
    },

    /**
     * Emits a standardized deprecation warning for renamed or legacy features.
     */
    deprecated(feature: string, replacement?: string): void {
      if (!shouldLog("warn")) {
        return;
      }

      const msg = replacement
        ? `${feature} is deprecated. Use ${replacement} instead.`
        : `${feature} is deprecated and will be removed.`;

      console.warn(formatMessage(module, msg));
    },

    /**
     * Emits a simple timing/debug line for ad-hoc performance measurements.
     */
    timing(operation: string, durationMs: number): void {
      if (!shouldLog("debug")) {
        return;
      }
      console.debug(
        formatMessage(module, `[timing] ${operation}: ${durationMs.toFixed(2)}ms`)
      );
    },
  };
}

/** Pre-created loggers for the most common module names used across the monorepo. */
export const loggers = {
  content: createLogger("content"),
  pages: createLogger("pages"),
} as const;
