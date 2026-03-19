const LOG_PREFIX = "[shared-ui]";

export const logError = (error: unknown, context?: string): void => {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : "Unknown error";
  const contextSuffix = context ? ` (${context})` : "";
  console.error(`${LOG_PREFIX}${contextSuffix}: ${message}`);
};
