/**
 * Loading Spinner Utilities
 * 
 * Centralized utilities for managing loading spinner components.
 * Eliminates code duplication in component script tags.
 */

import { safeGetElementById, safeQuerySelector, safeAddClasses, safeRemoveClasses } from "../dom/domUtils";

/**
 * Loading spinner utility interface
 */
export interface LoadingSpinnerUtils {
  show: (id?: string) => void;
  hide: (id?: string) => void;
  updateProgress: (id?: string, progress?: number) => void;
  setErrorState: (id?: string) => void;
  setTimeoutState: (id?: string) => void;
  resetState: (id?: string) => void;
}

/**
 * Show a loading spinner
 */
export function showSpinner(id: string = "loading-spinner"): void {
  const spinner = safeGetElementById(id);
  if (spinner) {
    safeRemoveClasses(spinner, ["hidden"]);
    spinner.setAttribute("aria-busy", "true");
  }
}

/**
 * Hide a loading spinner
 */
export function hideSpinner(id: string = "loading-spinner"): void {
  const spinner = safeGetElementById(id);
  if (spinner) {
    safeAddClasses(spinner, ["hidden"]);
    spinner.setAttribute("aria-busy", "false");
  }
}

/**
 * Update progress for determinate spinners
 */
export function updateProgress(id: string = "loading-spinner", progress: number = 0): void {
  const spinner = safeGetElementById(id);
  if (spinner && spinner.dataset.type === "determinate") {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    spinner.setAttribute("aria-valuenow", clampedProgress.toString());

    const progressBar = safeQuerySelector<HTMLElement>(".h-full", spinner);
    if (progressBar) {
      progressBar.style.width = `${clampedProgress}%`;
    }

    const label = safeQuerySelector(".text-xl", spinner);
    if (label) {
      const baseText = label.textContent?.split(" (")[0] || "Loading";
      label.textContent = `${baseText} (${clampedProgress}%)`;
    }
  }
}

/**
 * Set error state
 */
export function setErrorState(id: string = "loading-spinner"): void {
  const spinner = safeGetElementById(id);
  if (spinner) {
    safeRemoveClasses(spinner, ["border-yellow-600", "bg-yellow-50", "border-yellow-200"]);
    safeAddClasses(spinner, ["border-red-600", "bg-red-50", "border-red-200"]);
    spinner.setAttribute("role", "alert");
    spinner.setAttribute("aria-busy", "false");
  }
}

/**
 * Set timeout state
 */
export function setTimeoutState(id: string = "loading-spinner"): void {
  const spinner = safeGetElementById(id);
  if (spinner) {
    safeRemoveClasses(spinner, ["border-red-600", "bg-red-50", "border-red-200"]);
    safeAddClasses(spinner, ["border-yellow-600", "bg-yellow-50", "border-yellow-200"]);
    spinner.setAttribute("role", "alert");
    spinner.setAttribute("aria-busy", "false");
  }
}

/**
 * Reset to normal state
 */
export function resetState(id: string = "loading-spinner"): void {
  const spinner = safeGetElementById(id);
  if (spinner) {
    safeRemoveClasses(spinner, [
      "border-red-600",
      "bg-red-50", 
      "border-red-200",
      "border-yellow-600",
      "bg-yellow-50",
      "border-yellow-200"
    ]);
    const role = spinner.dataset.type === "determinate" ? "progressbar" : "status";
    spinner.setAttribute("role", role);
  }
}

/**
 * Initialize loading spinner utilities and make them globally available
 */
export function initLoadingSpinnerUtils(): LoadingSpinnerUtils {
  const utils: LoadingSpinnerUtils = {
    show: showSpinner,
    hide: hideSpinner,
    updateProgress,
    setErrorState,
    setTimeoutState,
    resetState,
  };

  // Make functions globally available
  if (typeof window !== "undefined") {
    (window as Window & { LoadingSpinnerUtils?: LoadingSpinnerUtils }).LoadingSpinnerUtils = utils;
  }

  return utils;
}

/**
 * Auto-hide spinners on page load
 */
export function autoHideSpinners(): void {
  const spinners = document.querySelectorAll('[role="status"][aria-busy="true"]');
  spinners.forEach((el) => {
    const id = (el as HTMLElement).id;
    if (id) {
      hideSpinner(id);
    }
  });
}
