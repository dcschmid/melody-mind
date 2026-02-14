/**
 * Consistent logging utility for the application.
 *
 * Provides a structured way to log messages with module prefixes,
 * making it easier to filter and identify log sources.
 *
 * @module utils/logging
 */

type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Log levels in order of severity.
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Current minimum log level (can be adjusted at runtime).
 * Defaults to 'warn' in production, 'debug' in development.
 */
let currentLogLevel: LogLevel =
  typeof process !== "undefined" && process.env.NODE_ENV === "production"
    ? "warn"
    : "debug";

/**
 * Set the minimum log level.
 * Messages below this level will be suppressed.
 */
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

/**
 * Get the current log level.
 */
export function getLogLevel(): LogLevel {
  return currentLogLevel;
}

/**
 * Check if a log level should be displayed.
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLogLevel];
}

/**
 * Format a log message with module prefix.
 */
function formatMessage(module: string, message: string): string {
  return `[${module}] ${message}`;
}

/**
 * Create a logger for a specific module.
 *
 * @example
 * ```typescript
 * const logger = createLogger("bookmarks");
 *
 * logger.info("Bookmark added", { slug: "article-1" });
 * logger.warn("Storage quota exceeded");
 * logger.error("Failed to save", new Error("..."));
 * ```
 */
export function createLogger(module: string) {
  return {
    /**
     * Log a debug message (development only).
     */
    debug(message: string, data?: unknown): void {
      if (!shouldLog("debug")) return;
      console.debug(formatMessage(module, message), data ?? "");
    },

    /**
     * Log an informational message.
     */
    info(message: string, data?: unknown): void {
      if (!shouldLog("info")) return;
      console.info(formatMessage(module, message), data ?? "");
    },

    /**
     * Log a warning message.
     */
    warn(message: string, data?: unknown): void {
      if (!shouldLog("warn")) return;
      console.warn(formatMessage(module, message), data ?? "");
    },

    /**
     * Log an error message.
     */
    error(message: string, error?: unknown): void {
      if (!shouldLog("error")) return;

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
     * Log a deprecation warning.
     */
    deprecated(feature: string, replacement?: string): void {
      if (!shouldLog("warn")) return;

      const msg = replacement
        ? `${feature} is deprecated. Use ${replacement} instead.`
        : `${feature} is deprecated and will be removed.`;

      console.warn(formatMessage(module, msg));
    },

    /**
     * Log a performance timing.
     */
    timing(operation: string, durationMs: number): void {
      if (!shouldLog("debug")) return;
      console.debug(
        formatMessage(module, `[timing] ${operation}: ${durationMs.toFixed(2)}ms`)
      );
    },
  };
}

/**
 * Pre-defined loggers for common modules.
 */
export const loggers = {
  analytics: createLogger("analytics"),
  bookmarks: createLogger("bookmarks"),
  content: createLogger("content"),
  seo: createLogger("seo"),
  theme: createLogger("theme"),
  storage: createLogger("storage"),
  cache: createLogger("cache"),
} as const;
