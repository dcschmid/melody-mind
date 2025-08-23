/**
 * BackToTop Utilities
 * 
 * Centralized utilities for managing back-to-top button functionality.
 * Eliminates code duplication in component script tags.
 */

import { safeGetElementById, safeQuerySelector } from "../dom/domUtils";

/**
 * BackToTop configuration interface
 */
interface BackToTopConfig {
  buttonId: string;
  scrollThreshold?: number;
  prefersReducedMotion?: boolean;
}

/**
 * BackToTop utility class
 */
export class BackToTopUtils {
  private button: HTMLButtonElement | null;
  private scrollThreshold: number;
  private prefersReducedMotion: boolean;

  /**
   *
   */
  constructor(config: BackToTopConfig) {
    this.button = safeGetElementById<HTMLButtonElement>(config.buttonId);
    this.scrollThreshold = config.scrollThreshold || this.getDefaultScrollThreshold();
    this.prefersReducedMotion = config.prefersReducedMotion || this.getReducedMotionPreference();
    
    this.init();
  }

  /**
   * Initialize back-to-top functionality
   */
  private init(): void {
    if (!this.button) {
      return;
    }

    // Add scroll event listener
    window.addEventListener("scroll", () => this.handleScroll());
    
    // Add click event listener
    this.button.addEventListener("click", () => this.handleBackToTop());
    
    // Initial scroll check
    this.handleScroll();
  }

  /**
   * Get default scroll threshold from CSS variable or fallback
   */
  private getDefaultScrollThreshold(): number {
    const thresholdFromData = this.button?.dataset.scrollThreshold;
    if (thresholdFromData) {
      return parseInt(thresholdFromData, 10);
    }
    
    const cssThreshold = getComputedStyle(document.documentElement)
      .getPropertyValue("--scroll-threshold");
    
    return parseInt(cssThreshold) || 400;
  }

  /**
   * Check for reduced motion preference
   */
  private getReducedMotionPreference(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /**
   * Handle scroll visibility
   */
  private handleScroll(): void {
    if (!this.button) {
      return;
    }

    const shouldShow = window.scrollY > this.scrollThreshold;

    if (shouldShow) {
      this.button.style.display = "block";
      this.button.setAttribute("aria-hidden", "false");
    } else {
      this.button.style.display = "none";
      this.button.setAttribute("aria-hidden", "true");
    }
  }

  /**
   * Handle back to top click with accessibility features
   */
  private handleBackToTop(): void {
    // Scroll behavior based on motion preference
    const scrollOptions: ScrollToOptions = {
      top: 0,
      behavior: this.prefersReducedMotion ? "auto" : "smooth",
    };

    window.scrollTo(scrollOptions);

    // Focus management for accessibility
    this.focusMainHeading();
  }

  /**
   * Focus management for accessibility
   */
  private focusMainHeading(): void {
    const mainHeading = safeQuerySelector<HTMLElement>("h1");
    if (mainHeading) {
      mainHeading.focus();
    }
  }

  /**
   * Update scroll threshold dynamically
   */
  public updateScrollThreshold(newThreshold: number): void {
    this.scrollThreshold = newThreshold;
    this.handleScroll();
  }

  /**
   * Destroy event listeners
   */
  public destroy(): void {
    if (this.button) {
      this.button.removeEventListener("click", () => this.handleBackToTop());
    }
    window.removeEventListener("scroll", () => this.handleScroll());
  }
}

/**
 * Initialize back-to-top functionality
 */
export function initBackToTop(config: BackToTopConfig): BackToTopUtils {
  return new BackToTopUtils(config);
}

/**
 * Default back-to-top initialization
 */
export function initDefaultBackToTop(): BackToTopUtils {
  return initBackToTop({
    buttonId: "back-to-top"
  });
}
