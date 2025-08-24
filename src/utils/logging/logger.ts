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
    if (this.shouldLog(LogLevel.DEBUG)) {
    }
  }

  public info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
    }
  }

  public warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
    }
  }

  public error(message: string, error?: unknown, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
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
