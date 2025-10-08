/**
 * Lazy interactive component initialization.
 *
 * Detects the presence of client-side widgets and loads their helpers only when needed.
 * Keeps hydration costs low by deferring work to idle time and avoiding duplicate inline scripts.
 */

type IdleCallback = (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void;
type IdleRequest = (callback: IdleCallback, options?: { timeout?: number }) => number;

type InitEntry = {
  /** Predicate that returns truthy when corresponding component elements are present */
  test: () => boolean | Element | null;
  /** Async initializer that will be invoked when `test` passes */
  init: () => Promise<void>;
};

let hasInitialized = false;

/**
 * Schedule a callback using `requestIdleCallback` when available to avoid main-thread contention.
 */
const runWhenIdle = (cb: () => void): void => {
  const idle = (window as typeof window & { requestIdleCallback?: IdleRequest }).requestIdleCallback;

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
    test: (): HTMLElement | null => document.getElementById("menu-toggle"),
    init: async (): Promise<void> => {
      const { initDefaultNavigation } = await import("./navigationUtils");
      initDefaultNavigation();
    },
  },
  {
    test: (): Element | null =>
      document.getElementById("back-to-top") || document.querySelector("[data-back-to-top]"),
    init: async (): Promise<void> => {
      const { initDefaultBackToTop } = await import("./backToTopUtils");
      initDefaultBackToTop();
    },
  },
  {
    test: (): HTMLElement | null => document.getElementById("language-select"),
    init: async (): Promise<void> => {
      const { initDefaultLanguagePicker } = await import("./languagePickerUtils");
      void initDefaultLanguagePicker();
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
    test: (): Element | null =>
      document.querySelector(".playlist-card") ||
      document.querySelector("[data-content-type='playlist']"),
    init: async (): Promise<void> => {
      const { initPlaylistCardsAuto } = await import("./playlistCardUtils");
      void initPlaylistCardsAuto();
    },
  },
  {
    test: (): HTMLElement | null => document.getElementById("category-filter"),
    init: async (): Promise<void> => {
      const { initCategoryFilterAuto } = await import("./categoryFilterUtils");
      initCategoryFilterAuto();
    },
  },
  {
    test: (): Element | null =>
      document.querySelector("[data-testid='loading-spinner']") ||
      document.querySelector("[data-testid='loading-progress']"),
    init: async (): Promise<void> => {
      const { initLoadingSpinnerAuto } = await import("./loadingSpinnerUtils");
      initLoadingSpinnerAuto();
    },
  },
  {
    test: (): Element | null => document.querySelector("[data-testid='joker-container']"),
    init: async (): Promise<void> => {
      const { initJokerAuto } = await import("./jokerUtils");
      initJokerAuto();
    },
  },
];

/**
 * Initialize all interactive components present on the current page.
 */
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
      if (import.meta.env?.DEV) {
        console.error("[autoInit] test failed", error);
      }
    }

    if (!shouldInit) {
      return;
    }

    runWhenIdle(() => {
      init().catch((error) => {
        if (import.meta.env?.DEV) {
          console.error("[autoInit] init failed", error);
        }
      });
    });
  });
}
