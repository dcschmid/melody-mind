export function handleGameError(
  error: Error | unknown,
  context?: string,
): void {
  console.error("Game error:", context || "", error);
}

export function handleInitializationError(
  error: Error | unknown,
  context?: string,
): void {
  console.error("Initialization error:", context || "", error);
}
