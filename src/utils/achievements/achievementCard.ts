/**
 * Achievement Card Utilities
 * Modern TypeScript utilities for achievement card functionality
 *
 * @performance Optimized with event delegation and efficient DOM operations
 * @accessibility WCAG AAA compliant with enhanced keyboard navigation
 */

// Achievement card event detail interface
interface AchievementCardEventDetail {
  achievementId: string;
  category?: string;
  status?: string;
  timestamp: number;
}

// Achievement card controller configuration
interface AchievementCardConfig {
  cardSelector: string;
  imageSelector: string;
  placeholderSelector: string;
}

// Default configuration
const DEFAULT_CONFIG: AchievementCardConfig = {
  cardSelector: '.achievement-card[role="button"]',
  imageSelector: ".achievement-card__image",
  placeholderSelector: ".achievement-card__icon-placeholder",
};

/**
 * Modern Achievement Card Controller with TypeScript
 * Handles interaction, keyboard navigation, and accessibility
 */
export class AchievementCardController {
  private config: AchievementCardConfig;
  private isInitialized = false;
  private abortController: AbortController;

  constructor(config: Partial<AchievementCardConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.abortController = new AbortController();
    this.initialize();
  }

  // Initialize controller with modern event listeners
  private initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Use event delegation for better performance
    document.addEventListener("click", this.handleCardClick, {
      signal: this.abortController.signal,
    });

    document.addEventListener("keydown", this.handleCardKeydown, {
      signal: this.abortController.signal,
    });

    // Handle image loading errors
    document.addEventListener("error", this.handleImageError, {
      capture: true,
      signal: this.abortController.signal,
    });

    this.isInitialized = true;
  }

  // Handle card click with modern event handling
  private handleCardClick = (event: MouseEvent): void => {
    const card = this.findCardElement(event.target as HTMLElement);
    if (!card) {
      return;
    }

    this.triggerCardSelection(card);
  };

  // Handle keyboard navigation with enhanced accessibility
  private handleCardKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const card = this.findCardElement(event.target as HTMLElement);
    if (!card) {
      return;
    }

    event.preventDefault();
    this.triggerCardSelection(card);
  };

  // Find the closest card element with type safety
  private findCardElement(target: HTMLElement): HTMLElement | null {
    return target.closest(this.config.cardSelector) as HTMLElement;
  }

  // Trigger card selection with enhanced custom event
  private triggerCardSelection(card: HTMLElement): void {
    try {
      const eventDetail = this.extractCardData(card);

      if (!eventDetail.achievementId) {
        console.warn("Achievement card missing required data-testid attribute");
        return;
      }

      // Dispatch custom event with rich context
      const customEvent = new CustomEvent<AchievementCardEventDetail>("achievement:select", {
        bubbles: true,
        detail: eventDetail,
      });

      card.dispatchEvent(customEvent);
      this.updateCardState(card);
    } catch (error) {
      console.error("Error handling achievement card selection:", error);
    }
  }

  // Extract card data with type safety
  private extractCardData(card: HTMLElement): AchievementCardEventDetail {
    const { testid, category, status } = card.dataset;
    const achievementId = testid?.replace("achievement-card-", "") ?? "";

    return {
      achievementId,
      category,
      status,
      timestamp: Date.now(),
    };
  }

  // Update card ARIA state for accessibility
  private updateCardState(card: HTMLElement): void {
    const expanded = card.getAttribute("aria-expanded") === "true";
    card.setAttribute("aria-expanded", String(!expanded));

    // Announce state change to screen readers
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = `Achievement card ${expanded ? "collapsed" : "expanded"}`;

    document.body.appendChild(announcement);

    // Clean up announcement after screen reader processes it
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Handle image loading errors with graceful fallback
  private handleImageError = (event: Event): void => {
    const img = event.target as HTMLImageElement;

    if (!img.matches(this.config.imageSelector)) {
      return;
    }

    const placeholder = img.parentElement?.querySelector(
      this.config.placeholderSelector
    ) as HTMLElement;

    if (placeholder) {
      img.style.display = "none";
      placeholder.style.display = "flex";

      // Update accessibility attributes
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute("aria-label", "Achievement icon placeholder");
    }

    console.warn(`Failed to load achievement icon: ${img.src}`);
  };

  // Public method to manually trigger card selection
  public selectCard(achievementId: string): void {
    const card = document.querySelector(
      `[data-testid="achievement-card-${achievementId}"]`
    ) as HTMLElement;

    if (card) {
      this.triggerCardSelection(card);
    }
  }

  // Public method to get card state
  public getCardState(achievementId: string): { expanded: boolean; status?: string } | null {
    const card = document.querySelector(
      `[data-testid="achievement-card-${achievementId}"]`
    ) as HTMLElement;

    if (!card) {
      return null;
    }

    return {
      expanded: card.getAttribute("aria-expanded") === "true",
      status: card.dataset.status,
    };
  }

  // Cleanup method for proper memory management
  public destroy(): void {
    this.abortController.abort();
    this.isInitialized = false;
  }
}

// Factory function for easier usage
export const createAchievementCardController = (
  config?: Partial<AchievementCardConfig>
): AchievementCardController => {
  return new AchievementCardController(config);
};

// Auto-initialization helper
export const initializeAchievementCards = (): AchievementCardController => {
  const controller = createAchievementCardController();

  // Cleanup on page unload
  window.addEventListener(
    "beforeunload",
    () => {
      controller.destroy();
    },
    { once: true }
  );

  return controller;
};

// Enhanced utility functions for card management
export const achievementCardUtils = {
  // Find all achievement cards on page
  findAllCards(): HTMLElement[] {
    return Array.from(document.querySelectorAll(DEFAULT_CONFIG.cardSelector));
  },

  // Get cards by status
  getCardsByStatus(status: string): HTMLElement[] {
    return this.findAllCards().filter((card) => card.dataset.status === status);
  },

  // Focus first available card
  focusFirstCard(): void {
    const cards = this.findAllCards();
    const firstCard = cards.find((card) => card.getAttribute("tabindex") === "0");

    if (firstCard) {
      firstCard.focus();
    }
  },

  // Announce card count for screen readers
  announceCardCount(): void {
    const cards = this.findAllCards();
    const unlockedCount = this.getCardsByStatus("unlocked").length;
    const inProgressCount = this.getCardsByStatus("in-progress").length;
    const lockedCount = this.getCardsByStatus("locked").length;

    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = `${cards.length} achievements total. ${unlockedCount} unlocked, ${inProgressCount} in progress, ${lockedCount} locked.`;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 2000);
  },
};
