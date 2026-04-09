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

  let ticking = false;

  const updateVisibility = () => {
    const shouldShow = window.scrollY > scrollThreshold;
    button.style.display = shouldShow ? "block" : "none";
    button.setAttribute("aria-hidden", shouldShow ? "false" : "true");
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateVisibility);
    }
  };

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  button.addEventListener("click", handleClick);

  updateVisibility();
}

export function initDefaultBackToTop(): void {
  initBackToTop({ buttonId: "back-to-top" });
}
