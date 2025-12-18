import { safeQuerySelector, safeGetElementById } from "../dom/domUtils";
import { handleInitializationError } from "../error/errorHandlingUtils";

/**
 * Simple animation manager for index page.
 * Focus on essential functionality without over-engineering.
 */
export class SimpleAnimationManager {
  private observer: IntersectionObserver | null = null;

  /**
   * Create a new SimpleAnimationManager and initialize observer.
   */
  constructor() {
    this.initializeObserver();
  }

  private initializeObserver(): void {
    const config = {
      rootMargin: "0px",
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          this.observer?.unobserve(entry.target);
        }
      });
    }, config);
  }

  /**
   * Initialize animation observation on index page elements.
   */
  public initialize(): void {
    const animatableElements = document.querySelectorAll(".animate-on-view");
    animatableElements.forEach((element) => {
      this.observer?.observe(element);
    });
  }

  /**
   * Destroy the intersection observer and free resources.
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * Enhanced accessibility features for index page
 */
export const enhanceAccessibility = (): void => {
  // Skip to main content functionality
  const skipLink = safeQuerySelector(
    '[href="#main-content"]'
  ) as HTMLAnchorElement | null;

  if (skipLink) {
    skipLink.addEventListener("click", (event: Event) => {
      event.preventDefault();
      const mainContent = safeGetElementById("main-content") as HTMLElement | null;
      mainContent?.focus();
      mainContent?.setAttribute("aria-live", "polite");
    });
  }

  // Enhanced keyboard navigation
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const focusedElement = document.activeElement as HTMLElement;
      focusedElement?.blur();
    }
  });
};

/**
 * Initialize index page functionality
 */
export const initializeIndexPage = (): void => {
  const animationManager = new SimpleAnimationManager();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      animationManager.initialize();
      enhanceAccessibility();
    });
  } else {
    animationManager.initialize();
    enhanceAccessibility();
  }

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    animationManager.destroy();
  });
};

/**
 * Auto-initialize index page functionality
 */
export const initIndexPageAuto = (): void => {
  try {
    initializeIndexPage();
  } catch (_error) {
    // Route non-critical initialization errors to centralized handler for visibility.
    try {
      handleInitializationError(_error);
    } catch {
      // Swallow any errors thrown by the error handler to avoid cascading failures.
    }
  }
};
