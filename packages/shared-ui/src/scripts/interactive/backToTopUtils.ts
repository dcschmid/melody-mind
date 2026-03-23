import { isServer } from "@shared-utils/utils/environment";

interface BackToTopConfig {
  buttonId: string;
  scrollThreshold?: number;
}

export function initBackToTop(config: BackToTopConfig): void {
  if (isServer) {
    return;
  }

  const button = document.getElementById(config.buttonId) as HTMLButtonElement | null;
  const scrollThreshold = config.scrollThreshold ?? 400;
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  if (!button) {
    return;
  }

  const updateVisibility = () => {
    const shouldShow = window.scrollY > scrollThreshold;
    button.style.display = shouldShow ? "block" : "none";
    button.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  window.addEventListener("scroll", updateVisibility);
  button.addEventListener("click", handleClick);

  updateVisibility();
}

export function initBackToTopAuto(): void {
  if (isServer) {
    return;
  }

  const button = document.querySelector("[data-back-to-top]") as HTMLButtonElement | null;

  if (!button) {
    return;
  }

  const buttonId = button.id || "back-to-top";
  const threshold = parseInt(button.dataset.scrollThreshold || "400", 10);

  initBackToTop({ buttonId, scrollThreshold: threshold });
}

export function initDefaultBackToTop(): void {
  initBackToTop({ buttonId: "back-to-top" });
}
