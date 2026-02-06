export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
}

export const TOAST_EVENT_NAME = "melodymind:toast";

const DEFAULT_DURATION_MS = 3400;

export function emitToast(options: ToastOptions): void {
  if (typeof window === "undefined" || !options.message.trim()) {
    return;
  }

  const detail: Required<ToastOptions> = {
    message: options.message,
    variant: options.variant ?? "info",
    durationMs: options.durationMs ?? DEFAULT_DURATION_MS,
  };

  window.dispatchEvent(new CustomEvent(TOAST_EVENT_NAME, { detail }));
}
