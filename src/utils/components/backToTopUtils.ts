/**
 * Simple Back to Top
 * Replaces the over-engineered class-based approach
 */

interface BackToTopConfig {
  buttonId: string;
  scrollThreshold?: number;
}

/**
 * Initialize back to top functionality
 */
export function initBackToTop(config: BackToTopConfig): void {
  const button = document.getElementById(config.buttonId) as HTMLButtonElement;
  const scrollThreshold = config.scrollThreshold || 400;

  if (!button) {
    return;
  }

  // Add scroll event listener
  window.addEventListener("scroll", () => {
    const shouldShow = window.scrollY > scrollThreshold;

    if (shouldShow) {
      button.style.display = "block";
      button.setAttribute("aria-hidden", "false");
    } else {
      button.style.display = "none";
      button.setAttribute("aria-hidden", "true");
    }
  });

  // Add click event listener
  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Initial scroll check
  const shouldShow = window.scrollY > scrollThreshold;
  button.style.display = shouldShow ? "block" : "none";
  button.setAttribute("aria-hidden", (!shouldShow).toString());
}

/**
 * Auto-initialize back to top
 */
export function initBackToTopAuto(): void {
  const button = document.querySelector("[data-back-to-top]") as HTMLButtonElement;

  if (button) {
    const buttonId = button.id || "back-to-top";
    const threshold = parseInt(button.dataset.scrollThreshold || "400");

    initBackToTop({ buttonId, scrollThreshold: threshold });
  }
}

/**
 * Default back to top initialization
 */
export function initDefaultBackToTop(): void {
  initBackToTop({ buttonId: "back-to-top" });
}
