import { createLogger } from "@shared-utils/utils/logging";

const logger = createLogger("autoInit");

type IdleCallback = (deadline: {
  didTimeout: boolean;
  timeRemaining: () => number;
}) => void;
type IdleRequest = (callback: IdleCallback, options?: { timeout?: number }) => number;

type InitEntry = {
  test: () => boolean | Element | null;
  init: () => Promise<void>;
};

let hasInitialized = false;

const runWhenIdle = (cb: () => void): void => {
  const idle = (window as typeof window & { requestIdleCallback?: IdleRequest })
    .requestIdleCallback;

  if (typeof idle === "function") {
    idle(
      () => {
        cb();
      },
      { timeout: 500 }
    );
    return;
  }

  window.setTimeout(cb, 1);
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
  {
    test: (): HTMLElement | null => document.getElementById("toc-toggle"),
    init: async (): Promise<void> => {
      const { initDefaultTableOfContents } = await import("./tableOfContentsUtils");
      void initDefaultTableOfContents();
    },
  },
  {
    test: (): Element | null => document.querySelector("[data-search-root]"),
    init: async (): Promise<void> => {
      const { initSearchPanelsAuto } = await import("./searchPanelUtils");
      initSearchPanelsAuto();
    },
  },
];

export function initInteractiveComponents(): void {
  if (typeof window === "undefined" || hasInitialized) {
    return;
  }

  hasInitialized = true;

  INIT_TARGETS.forEach(({ test, init }) => {
    let shouldInit = false;

    try {
      shouldInit = Boolean(test());
    } catch (error) {
      logger.error("Test failed", error);
    }

    if (!shouldInit) {
      return;
    }

    runWhenIdle(() => {
      init().catch((error) => {
        logger.error("Init failed", error);
      });
    });
  });
}
