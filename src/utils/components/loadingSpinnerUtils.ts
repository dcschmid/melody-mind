/**
 * Simple Loading Spinner
 * Replaces the over-engineered approach
 */

/**
 * Show a loading spinner
 */
export function showSpinner(id: string = "loading-spinner"): void {
  const spinner = document.getElementById(id);
  if (spinner) {
    spinner.classList.remove("hidden");
    spinner.setAttribute("aria-busy", "true");
  }
}

/**
 * Hide a loading spinner
 */
export function hideSpinner(id: string = "loading-spinner"): void {
  const spinner = document.getElementById(id);
  if (spinner) {
    spinner.classList.add("hidden");
    spinner.setAttribute("aria-busy", "false");
  }
}

/**
 * Update progress for determinate spinners
 */
export function updateProgress(
  id: string = "loading-spinner",
  progress: number = 0
): void {
  const spinner = document.getElementById(id);
  if (spinner && spinner.dataset.type === "determinate") {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    spinner.setAttribute("aria-valuenow", clampedProgress.toString());

    const progressBar = spinner.querySelector(".h-full") as HTMLElement;
    if (progressBar) {
      progressBar.style.width = `${clampedProgress}%`;
    }

    const label = spinner.querySelector(".text-xl");
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
  const spinner = document.getElementById(id);
  if (spinner) {
    spinner.classList.remove("border-yellow-600", "bg-yellow-50", "border-yellow-200");
    spinner.classList.add("border-red-600", "bg-red-50", "border-red-200");
    spinner.setAttribute("role", "alert");
    spinner.setAttribute("aria-busy", "false");
  }
}

/**
 * Set timeout state
 */
export function setTimeoutState(id: string = "loading-spinner"): void {
  const spinner = document.getElementById(id);
  if (spinner) {
    spinner.classList.remove("border-red-600", "bg-red-50", "border-red-200");
    spinner.classList.add("border-yellow-600", "bg-yellow-50", "border-yellow-200");
    spinner.setAttribute("role", "alert");
    spinner.setAttribute("aria-busy", "false");
  }
}

/**
 * Reset to normal state
 */
export function resetState(id: string = "loading-spinner"): void {
  const spinner = document.getElementById(id);
  if (spinner) {
    spinner.classList.remove(
      "border-red-600",
      "bg-red-50",
      "border-red-200",
      "border-yellow-600",
      "bg-yellow-50",
      "border-yellow-200"
    );
    spinner.classList.add("border-blue-600", "bg-blue-50", "border-blue-200");
    spinner.removeAttribute("role");
    spinner.setAttribute("aria-busy", "true");
  }
}

/**
 * Auto-initialize loading spinner
 */
export function initLoadingSpinnerAuto(): void {
  const spinners = document.querySelectorAll("[data-loading-spinner]");

  spinners.forEach((spinner) => {
    const id = spinner.id || "loading-spinner";
    const type = spinner.getAttribute("data-type") || "indeterminate";

    if (type === "determinate") {
      updateProgress(id, 0);
    }
  });
}
