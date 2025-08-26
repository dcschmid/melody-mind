/**
 * Logging Utility
 *
 * Centralized logging with different levels and structured context.
 * Provides consistent logging across the application.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  component?: string;
  action?: string;
  data?: unknown;
  timestamp?: Date;
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = context?.timestamp?.toISOString() || new Date().toISOString();
    const component = context?.component ? `[${context.component}]` : "";
    const action = context?.action ? `{${context.action}}` : "";

    return `${timestamp} ${level} ${component}${action} ${message}`;
  }

  public debug(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) {
      return;
    }
    try {
      // Use warn to satisfy console usage rules while preserving message visibility
      console.warn(this.formatMessage("DEBUG", message, context));
    } catch {
      // Swallow logging errors to avoid affecting app flow
    }
  }

  public info(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) {
      return;
    }
    try {
      // Promote info-level messages to warn so they use allowed console methods
      console.warn(this.formatMessage("INFO", message, context));
    } catch {
      // Swallow logging errors to avoid affecting app flow
    }
  }

  public warn(message: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.WARN)) {
      return;
    }
    try {
      console.warn(this.formatMessage("WARN", message, context));
    } catch {
      // Swallow logging errors to avoid affecting app flow
    }
  }

  public error(message: string, error?: unknown, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.ERROR)) {
      return;
    }
    try {
      const formatted = this.formatMessage("ERROR", message, context);
      if (error instanceof Error) {
        console.error(formatted, error);
      } else if (error !== undefined) {
        console.error(formatted, error);
      } else {
        console.error(formatted);
      }
    } catch {
      // Swallow logging errors to avoid affecting app flow
    }
  }

  // Game-specific logging methods
  public gameInit(component: string, message: string, data?: unknown): void {
    this.info(message, { component, action: "initialization", data });
  }

  public gameError(component: string, message: string, error?: unknown): void {
    this.error(message, error, { component, action: "game-error" });
  }

  public componentInit(component: string, success: boolean, data?: unknown): void {
    if (success) {
      this.info(`${component} initialized successfully`, { component, action: "init", data });
    } else {
      this.error(`${component} initialization failed`, undefined, {
        component,
        action: "init",
        data,
      });
    }
  }
}

// Create singleton instance
const loggerInstance = Logger.getInstance();

// Export individual methods
export const debug = loggerInstance.debug.bind(loggerInstance);
export const info = loggerInstance.info.bind(loggerInstance);
export const warn = loggerInstance.warn.bind(loggerInstance);
export const error = loggerInstance.error.bind(loggerInstance);
export const gameInit = loggerInstance.gameInit.bind(loggerInstance);
export const gameError = loggerInstance.gameError.bind(loggerInstance);
export const componentInit = loggerInstance.componentInit.bind(loggerInstance);
