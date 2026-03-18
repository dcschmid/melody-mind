/**
 * Simplified interactive component initialization for quiz app.
 */
import { isServer } from "@shared-utils/utils/environment";

let hasInitialized = false;

const runWhenIdle = (cb: () => void): void => {
  if (typeof window === "undefined") {
    return;
  }

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(
      () => {
        cb();
      },
      { timeout: 500 }
    );
    return;
  }
  setTimeout(cb, 1);
};

type InitEntry = {
  test: () => Element | null;
  init: () => void | Promise<void>;
};

const INIT_TARGETS: InitEntry[] = [
  {
    test: (): Element | null =>
      document.getElementById("back-to-top") ||
      document.querySelector("[data-back-to-top]"),
    init: async (): Promise<void> => {
      const { initDefaultBackToTop } = await import("./backToTopUtils");
      initDefaultBackToTop();
    },
  },
];

/**
 * Initialize all interactive components present on the current page.
 */
export function initInteractiveComponents(): void {
  if (isServer || hasInitialized) {
    return;
  }

  hasInitialized = true;

  INIT_TARGETS.forEach(({ test, init }) => {
    let shouldInit = false;

    try {
      shouldInit = Boolean(test());
    } catch {
      // Ignore test failures
    }

    if (!shouldInit) {
      return;
    }

    runWhenIdle(() => {
      const result = init();
      if (result instanceof Promise) {
        result.catch(() => {
          // Ignore init failures
        });
      }
    });
  });
}
