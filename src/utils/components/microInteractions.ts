const INTERACTIVE_SELECTOR =
  'a[href], button, [role="button"], summary, input[type="button"], input[type="submit"], input[type="reset"]';

const CONTROL_SELECTOR =
  'button, [role="button"], summary, input[type="button"], input[type="submit"], input[type="reset"], .button-link';

let hasInitialized = false;
const activeControlsByPointerId = new Map<number, HTMLElement>();

const prefersReducedMotion = (): boolean =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const usesCoarsePointer = (): boolean =>
  window.matchMedia?.("(pointer: coarse)").matches ?? false;

const markInteractiveElements = (): void => {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR)
  );

  elements.forEach((element) => {
    if (element.matches(CONTROL_SELECTOR)) {
      element.dataset.uiInteractive = "control";
      return;
    }

    element.dataset.uiInteractive = "link";
  });
};

const createRipple = (target: HTMLElement, event: PointerEvent): void => {
  if (prefersReducedMotion()) {
    return;
  }

  const coarsePointer = usesCoarsePointer();
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * (coarsePointer ? 0.82 : 1.1);
  const ripple = document.createElement("span");

  ripple.className = "ui-ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  ripple.dataset.pointer = coarsePointer ? "coarse" : "fine";

  target.classList.add("ui-ripple-target");
  target.append(ripple);

  window.setTimeout(() => {
    ripple.remove();
  }, 480);
};

const bindPressEffects = (): void => {
  const clearPressStateForPointer = (pointerId: number): void => {
    const control = activeControlsByPointerId.get(pointerId);
    if (!control) {
      return;
    }

    control.dataset.uiInteractive = "control";
    control.dataset.uiPressing = "false";
    activeControlsByPointerId.delete(pointerId);
  };

  const clearAllPressStates = (): void => {
    activeControlsByPointerId.forEach((control) => {
      control.dataset.uiInteractive = "control";
      control.dataset.uiPressing = "false";
    });
    activeControlsByPointerId.clear();
  };

  document.addEventListener("pointerdown", (event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      CONTROL_SELECTOR
    );

    if (!target) {
      return;
    }

    target.dataset.uiInteractive = "control";
    target.dataset.uiPressing = "true";
    activeControlsByPointerId.set(event.pointerId, target);
    createRipple(target, event);
  });

  document.addEventListener(
    "pointerup",
    (event) => {
      clearPressStateForPointer(event.pointerId);
    },
    true
  );
  document.addEventListener(
    "pointercancel",
    (event) => {
      clearPressStateForPointer(event.pointerId);
    },
    true
  );

  window.addEventListener("blur", clearAllPressStates);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      clearAllPressStates();
    }
  });
};

const bindAnchorScroll = (): void => {
  document.addEventListener("click", (event) => {
    const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
      'a[href^="#"]'
    );

    if (!link) {
      return;
    }

    const href = link.getAttribute("href");
    if (!href || href.length < 2) {
      return;
    }

    const targetId = href.slice(1);
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });

    if (history.pushState) {
      history.pushState(null, "", href);
    }
  });
};

export function initMicroInteractions(): void {
  if (typeof window === "undefined" || hasInitialized) {
    return;
  }

  hasInitialized = true;
  markInteractiveElements();
  bindPressEffects();
  bindAnchorScroll();
}
