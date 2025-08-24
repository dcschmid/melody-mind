import { safeQuerySelector, safeGetElementById } from "../dom/domUtils";

/**
 * Simple animation manager for index page
 * Focus on essential functionality without over-engineering
 */
export class SimpleAnimationManager {
  private observer: IntersectionObserver | null = null;

  /**
   *
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
   *
   */
  public initialize(): void {
    const animatableElements = document.querySelectorAll(".animate-on-view");
    animatableElements.forEach((element) => {
      this.observer?.observe(element);
    });
  }

  /**
   *
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
  const skipLink = safeQuerySelector<HTMLAnchorElement>('[href="#main-content"]');

  if (skipLink) {
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      const mainContent = safeGetElementById<HTMLElement>("main-content");
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
  } catch (error) {
  }
};
