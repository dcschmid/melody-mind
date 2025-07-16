/**
 * Achievement Badge Utilities
 * Modern TypeScript utilities for achievement badge functionality
 *
 * @performance Optimized with requestAnimationFrame and efficient DOM operations
 * @accessibility WCAG AAA compliant with enhanced keyboard navigation
 */

import type { AchievementEvent } from "../../types/achievement.ts";
import { subscribeToAchievementEvents } from "./achievementEvents.ts";

// Badge state interface
interface BadgeState {
  count: number;
  isVisible: boolean;
  element: HTMLElement | null;
}

// Badge configuration from data attributes
interface BadgeConfig {
  newLabel: string;
  newLabelWithCount: string;
  fallbackLabel: string;
  contextDescription: string;
  keyboardInstructions: string;
}

// Performance optimized badge manager with modern TypeScript
export class AchievementBadgeManager {
  private state: BadgeState = {
    count: 0,
    isVisible: false,
    element: null,
  };

  private config: BadgeConfig;
  private unsubscribe: (() => void) | null = null;
  private animationFrameId: number | null = null;

  constructor(badgeElementId: string = "achievement-badge") {
    this.state.element = document.getElementById(badgeElementId);
    this.config = this.extractConfig();
    this.initialize();
  }

  // Extract configuration from data attributes
  private extractConfig(): BadgeConfig {
    const element = this.state.element;
    return {
      newLabel: element?.getAttribute("data-new-label") ?? "",
      newLabelWithCount: element?.getAttribute("data-new-label-with-count") ?? "",
      fallbackLabel: element?.getAttribute("data-fallback-label") ?? "New achievements",
      contextDescription: element?.getAttribute("data-context-description") ?? "",
      keyboardInstructions: element?.getAttribute("data-keyboard-instructions") ?? "",
    };
  }

  // Initialize badge with stored count and event listeners
  private initialize(): void {
    if (!this.state.element) return;

    this.loadStoredCount();
    this.updateBadge();
    this.setupEventListeners();
    this.setupKeyboardInteraction();
  }

  // Load count from localStorage with error handling
  private loadStoredCount(): void {
    try {
      const storedCount = localStorage.getItem("new-achievements-count");
      const parsedCount = parseInt(storedCount ?? "0", 10);
      this.state.count = Number.isNaN(parsedCount) ? 0 : parsedCount;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      this.state.count = 0;
    }
  }

  // Save count to localStorage with error handling
  private saveCount(): void {
    try {
      localStorage.setItem("new-achievements-count", this.state.count.toString());
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  // Update badge display with performance optimization
  private updateBadge(): void {
    if (!this.state.element) return;

    // Cancel any pending animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Use requestAnimationFrame for smooth visual updates
    this.animationFrameId = requestAnimationFrame(() => {
      this.renderBadge();
    });
  }

  // Render badge with WCAG AAA compliance
  private renderBadge(): void {
    if (!this.state.element) return;

    const countElement = this.state.element.querySelector(".achievement-badge__count");
    if (countElement) {
      countElement.textContent = this.state.count.toString();
    }

    const isVisible = this.state.count > 0;
    this.state.isVisible = isVisible;

    if (isVisible) {
      this.showBadge();
    } else {
      this.hideBadge();
    }
  }

  // Show badge with accessibility attributes
  private showBadge(): void {
    if (!this.state.element) return;

    this.state.element.classList.add("visible");
    this.state.element.setAttribute("aria-hidden", "false");
    this.state.element.setAttribute("tabindex", "0");

    // Format aria-label with count
    const formattedLabel = this.config.newLabelWithCount
      ? this.config.newLabelWithCount.replace("{count}", this.state.count.toString())
      : `${this.config.newLabel || this.config.fallbackLabel}: ${this.state.count}`;

    this.state.element.setAttribute("aria-label", formattedLabel);

    // Enhanced context for screen readers
    const contextualDescription =
      `${this.config.contextDescription} ${this.config.keyboardInstructions}`.trim();
    if (contextualDescription) {
      this.state.element.setAttribute("aria-description", contextualDescription);
    }

    // Alert role for first achievement only
    if (this.state.count === 1) {
      this.state.element.setAttribute("role", "alert");
      setTimeout(() => {
        this.state.element?.setAttribute("role", "status");
      }, 3000);
    }
  }

  // Hide badge with proper cleanup
  private hideBadge(): void {
    if (!this.state.element) return;

    this.state.element.classList.remove("visible");
    this.state.element.setAttribute("aria-hidden", "true");
    this.state.element.setAttribute(
      "aria-label",
      this.config.newLabel || this.config.fallbackLabel
    );
    this.state.element.setAttribute("role", "status");
    this.state.element.removeAttribute("tabindex");
    this.state.element.removeAttribute("aria-description");
  }

  // Setup achievement event listeners
  private setupEventListeners(): void {
    this.unsubscribe = subscribeToAchievementEvents((event: AchievementEvent): void => {
      if (event.type === "achievement_unlocked") {
        this.incrementCount();
      }
    });
  }

  // Increment achievement count
  private incrementCount(): void {
    this.state.count++;
    this.saveCount();
    this.updateBadge();
  }

  // Reset badge count (used when visiting achievements page)
  public resetCount(): void {
    this.state.count = 0;
    this.saveCount();
    this.updateBadge();
  }

  // Enhanced keyboard interaction with modern event handling
  private setupKeyboardInteraction(): void {
    if (!this.state.element) return;

    const handleKeydown = (event: KeyboardEvent): void => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.navigateToAchievements();
      }
    };

    const handleFocus = (): void => {
      if (this.state.count > 0) {
        const detailedInfo = `Achievement badge focused. ${this.state.count} new achievements available. Press Enter or Space to view achievements page.`;
        this.state.element?.setAttribute("aria-label", detailedInfo);
      }
    };

    const handleBlur = (): void => {
      const standardLabel = this.config.newLabelWithCount
        ? this.config.newLabelWithCount.replace("{count}", this.state.count.toString())
        : `${this.config.newLabel || this.config.fallbackLabel}: ${this.state.count}`;
      this.state.element?.setAttribute("aria-label", standardLabel);
    };

    this.state.element.addEventListener("keydown", handleKeydown);
    this.state.element.addEventListener("focus", handleFocus);
    this.state.element.addEventListener("blur", handleBlur);
  }

  // Navigate to achievements page with accessibility announcement
  private navigateToAchievements(): void {
    const currentPath = window.location.pathname;
    const langMatch = currentPath.match(/^\/([a-z]{2})\//);
    const lang = langMatch?.[1] ?? "en";
    const achievementsUrl = `/${lang}/achievements`;

    // Announce navigation intent
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = `Navigating to achievements page with ${this.state.count} new achievements`;
    document.body.appendChild(announcement);

    // Navigate after brief delay for announcement
    setTimeout(() => {
      window.location.href = achievementsUrl;
      document.body.removeChild(announcement);
    }, 100);
  }

  // Cleanup method
  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.unsubscribe?.();
  }
}

// Factory function for easier usage
export const createAchievementBadge = (elementId?: string): AchievementBadgeManager => {
  return new AchievementBadgeManager(elementId);
};

// Auto-initialization helper
export const initializeAchievementBadge = (): void => {
  // Check if we're on the achievements page to reset count
  const isAchievementPage = window.location.pathname.includes("/achievements");

  const badge = createAchievementBadge();

  if (isAchievementPage) {
    badge.resetCount();
  }

  // Cleanup on page unload
  document.addEventListener("beforeunload", () => {
    badge.destroy();
  });
};
