interface BackToTopConfig {
  buttonId: string;
  scrollThreshold?: number;
  focusTargetId?: string;
}

export function initBackToTop(config: BackToTopConfig): void {
  if (typeof window === "undefined") {
    return;
  }

  const button = document.getElementById(config.buttonId) as HTMLButtonElement | null;
  if (!button) {
    return;
  }

  initBackToTopButton(button, config);
}

export function initBackToTopControls(): void {
  if (typeof window === "undefined") {
    return;
  }

  document
    .querySelectorAll<HTMLButtonElement>("[data-back-to-top]")
    .forEach((button) => initBackToTopButton(button));
}

function initBackToTopButton(
  button: HTMLButtonElement,
  config: Partial<BackToTopConfig> = {}
): void {
  if (button.dataset.backToTopBound === "true") {
    return;
  }

  button.dataset.backToTopBound = "true";

  const configuredThreshold = Number.parseInt(button.dataset.scrollThreshold || "", 10);
  const scrollThreshold =
    config.scrollThreshold ??
    (Number.isFinite(configuredThreshold) ? configuredThreshold : 300);
  const focusTargetId =
    config.focusTargetId || button.dataset.focusTargetId || "main-content";
  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  let ticking = false;

  const updateVisibility = () => {
    const shouldShow = window.scrollY > scrollThreshold;
    button.classList.toggle("is-visible", shouldShow);
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
    const focusTarget = document.getElementById(focusTargetId);

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    if (focusTarget instanceof HTMLElement && document.activeElement === button) {
      focusTarget.focus({ preventScroll: true });
    }

    button.classList.remove("is-visible");
    button.setAttribute("aria-hidden", "true");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  button.addEventListener("click", handleClick);

  updateVisibility();
}

export function initDefaultBackToTop(): void {
  initBackToTopControls();
}
