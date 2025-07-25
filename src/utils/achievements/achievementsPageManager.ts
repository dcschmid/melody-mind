/**
 * @fileoverview Achievements Page Manager - Client-side logic for achievements page
 * @description Handles achievement loading, rendering, filtering, and UI state management
 */

// Types
export interface Achievement {
  id: string;
  isUnlocked?: boolean;
  unlockedAt?: string;
  progress?: number;
  translations?: Array<{ name?: string; description?: string }>;
  name?: string;
  description?: string;
  code?: string;
  category?: { code?: string };
}

interface AchievementElements {
  authRequiredSection: HTMLElement | null;
  achievementsContent: HTMLElement | null;
  achievementsEmptySection: HTMLElement | null;
  errorContainer: HTMLElement | null;
}

interface AuthResult {
  authenticated: boolean;
  user?: Record<string, unknown>;
}

/**
 * Achievements Page Manager Class
 */
export class AchievementsPageManager {
  private currentLang: string;

  constructor() {
    // Extract language from URL
    const currentPath = window.location.pathname;
    const langMatch = currentPath.match(/^\/([a-z]{2})\//);
    this.currentLang = langMatch ? langMatch[1] : "en";
  }

  /**
   * Initialize achievements page
   */
  async initialize(): Promise<void> {
    const authResult = await this.checkAuthStatus();
    const elements = this.getAchievementElements();

    try {
      const achievements = await this.loadAchievements();
      this.handleSuccessfulLoad(achievements, authResult, elements);
    } catch (error) {
      console.warn("Failed to load achievements:", error);
      this.handleFailedLoad(authResult, elements);
    }
  }

  /**
   * Check authentication status
   */
  private async checkAuthStatus(): Promise<AuthResult> {
    // First check if server-side auth is already handled
    const authRequiredSection = document.getElementById("auth-required-section");
    const achievementsContent = document.getElementById("achievements-content");
    
    // If auth-required is hidden and content is visible, server-side auth succeeded
    if (authRequiredSection && achievementsContent) {
      const authSectionStyle = window.getComputedStyle(authRequiredSection);
      const contentSectionStyle = window.getComputedStyle(achievementsContent);
      
      if (authSectionStyle.display === "none" && contentSectionStyle.display !== "none") {
        return { authenticated: true };
      }
    }

    // Fallback to API check for authentication
    try {
      const response = await fetch(`/${this.currentLang}/api/user/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          return { authenticated: true, user: data.profile.user };
        }
      }
    } catch (error) {
      console.warn("Auth check failed:", error);
    }

    // Final fallback to localStorage
    const authStatus = localStorage.getItem("auth_status");
    const userDataStr = localStorage.getItem("user");

    if (authStatus === "authenticated" && userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        return { authenticated: true, user: userData };
      } catch (e) {
        console.warn("Failed to parse user data:", e);
        return { authenticated: false };
      }
    }

    return { authenticated: false };
  }

  /**
   * Load achievements from API
   */
  private async loadAchievements(): Promise<Achievement[]> {
    try {
      const response = await fetch(`/${this.currentLang}/api/achievements`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.achievements) {
        return data.achievements;
      } else {
        throw new Error(data.error || "Failed to load achievements");
      }
    } catch (error) {
      console.warn("Error loading achievements:", error);
      throw error;
    }
  }

  /**
   * Get DOM elements for achievements page
   */
  private getAchievementElements(): AchievementElements {
    return {
      authRequiredSection: document.getElementById("auth-required-section"),
      achievementsContent: document.getElementById("achievements-content"),
      achievementsEmptySection: document.getElementById("achievements-empty-section"),
      errorContainer: document.getElementById("achievements-error-container"),
    };
  }

  /**
   * Show login form UI state
   */
  private showLoginFormState(elements: AchievementElements): void {
    const { authRequiredSection, achievementsContent, achievementsEmptySection, errorContainer } =
      elements;

    if (authRequiredSection) {
      authRequiredSection.style.display = "block";
    }
    if (achievementsContent) {
      achievementsContent.style.display = "none";
    }
    if (achievementsEmptySection) {
      achievementsEmptySection.style.display = "none";
    }
    if (errorContainer) {
      errorContainer.innerHTML = "";
    }
  }

  /**
   * Show authenticated user UI state
   */
  private showAuthenticatedState(elements: AchievementElements): void {
    const { authRequiredSection, errorContainer } = elements;

    if (authRequiredSection) {
      authRequiredSection.style.display = "none";
    }
    if (errorContainer) {
      errorContainer.innerHTML = "";
    }
  }

  /**
   * Show error state for authenticated users
   */
  private showErrorState(elements: AchievementElements): void {
    const { achievementsEmptySection, achievementsContent } = elements;

    this.showError("Failed to load achievements. Please try again later.");
    if (achievementsEmptySection) {
      achievementsEmptySection.style.display = "block";
    }
    if (achievementsContent) {
      achievementsContent.style.display = "none";
    }
  }

  /**
   * Handle successful achievement loading
   */
  private handleSuccessfulLoad(
    achievements: Achievement[],
    authResult: AuthResult,
    elements: AchievementElements
  ): void {
    if (!authResult.authenticated) {
      this.showLoginFormState(elements);
      return;
    }

    this.showAuthenticatedState(elements);
    this.renderAchievements(achievements);
    this.renderFilterComponent();
  }

  /**
   * Handle failed achievement loading
   */
  private handleFailedLoad(authResult: AuthResult, elements: AchievementElements): void {
    if (!authResult.authenticated) {
      this.showLoginFormState(elements);
    } else {
      this.showErrorState(elements);
    }
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    const errorContainer = document.getElementById("achievements-error-container");
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="error-message" role="alert">
          <p>${message}</p>
        </div>
      `;
    }
  }

  /**
   * Process achievements into categories
   */
  private processAchievements(achievements: Achievement[]): [string, Achievement[]][] {
    const categories = new Map();

    achievements.forEach((achievement) => {
      const categoryCode = achievement.category?.code || "bronze";
      if (!categories.has(categoryCode)) {
        categories.set(categoryCode, []);
      }
      categories.get(categoryCode).push(achievement);
    });

    return Array.from(categories.entries());
  }

  /**
   * Calculate achievement statistics
   */
  private calculateAchievementStats(achievements: Achievement[]): {
    total: number;
    unlocked: number;
    progress: number;
  } {
    const total = achievements.length;
    const unlocked = achievements.filter((a) => a.isUnlocked || a.unlockedAt).length;
    const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    return { total, unlocked, progress };
  }

  /**
   * Get achievement status and progress
   */
  private getAchievementStatus(achievement: Achievement): {
    isUnlocked: boolean;
    progress: number;
  } {
    const isUnlocked = Boolean(achievement.isUnlocked || achievement.unlockedAt);
    const progress = achievement.progress || (isUnlocked ? 100 : 0);
    return { isUnlocked, progress };
  }

  /**
   * Get achievement display content
   */
  private getAchievementContent(achievement: Achievement): {
    name: string;
    description: string;
    categoryCode: string;
  } {
    const name = achievement.translations?.[0]?.name || achievement.name || achievement.code || "";
    const description = achievement.translations?.[0]?.description || achievement.description || "";
    const categoryCode = achievement.category?.code || "bronze";
    return { name, description, categoryCode };
  }

  /**
   * Generate unlock date HTML
   */
  private generateUnlockDateHTML(achievement: Achievement, isUnlocked: boolean): string {
    if (!isUnlocked || !achievement.unlockedAt) {
      return "";
    }

    return `<time class="achievement-card__unlock-date" datetime="${achievement.unlockedAt}">
      Unlocked: ${this.formatDate(achievement.unlockedAt)}
    </time>`;
  }

  /**
   * Render achievement card
   */
  private renderAchievementCard(achievement: Achievement): string {
    const { isUnlocked, progress } = this.getAchievementStatus(achievement);
    const { name, description, categoryCode } = this.getAchievementContent(achievement);
    const unlockStatusClass = isUnlocked
      ? "achievement-card--unlocked"
      : "achievement-card--locked";
    const unlockDateHTML = this.generateUnlockDateHTML(achievement, isUnlocked);

    return `
      <div role="listitem">
        <article class="achievement-card ${unlockStatusClass}" 
                 aria-labelledby="achievement-${achievement.id}-title">
          <div class="achievement-card__content">
            <header class="achievement-card__header">
              <h4 id="achievement-${achievement.id}-title" class="achievement-card__title">${name}</h4>
              <div class="achievement-card__category achievement-card__category--${categoryCode}">
                ${categoryCode}
              </div>
            </header>
            <p class="achievement-card__description">${description}</p>
            <div class="achievement-card__progress" aria-label="Progress: ${progress} percent">
              <div class="achievement-card__progress-bar">
                <div class="achievement-card__progress-fill" style="width: ${progress}%"></div>
              </div>
              <span class="achievement-card__progress-text">${progress}%</span>
            </div>
            ${unlockDateHTML}
          </div>
        </article>
      </div>
    `;
  }

  /**
   * Get localized category title
   */
  private getCategoryTitle(categoryCode: string): string {
    const titles: Record<string, string> = {
      bronze: "Bronze Achievements",
      silver: "Silver Achievements",
      gold: "Gold Achievements",
      platinum: "Platinum Achievements",
    };
    return titles[categoryCode] || categoryCode.charAt(0).toUpperCase() + categoryCode.slice(1);
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string): string {
    if (!dateString) {
      return "";
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(this.currentLang);
    } catch {
      return dateString;
    }
  }

  /**
   * Render achievements in original format
   */
  private renderAchievements(achievements: Achievement[]): void {
    const achievementsEmptySection = document.getElementById("achievements-empty-section");
    const achievementsContent = document.getElementById("achievements-content");
    const achievementsCategoriesContainer = document.getElementById(
      "achievements-categories-container"
    );
    const achievementsStatsContainer = document.getElementById("achievements-stats-container");

    if (!achievements || achievements.length === 0) {
      if (achievementsEmptySection) {
        achievementsEmptySection.style.display = "block";
      }
      if (achievementsContent) {
        achievementsContent.style.display = "none";
      }
      return;
    }

    const sortedCategories = this.processAchievements(achievements);
    const achievementStats = this.calculateAchievementStats(achievements);

    // Render categories
    let categoriesHTML = "";
    sortedCategories.forEach(([categoryId, categoryAchievements]) => {
      const categoryCode = categoryAchievements[0]?.category?.code ?? "bronze";
      const categoryTitle = this.getCategoryTitle(categoryCode);
      const achievementCount = categoryAchievements.length;

      categoriesHTML += `
        <section class="achievements__category" data-category-id="${categoryId}" aria-labelledby="category-${categoryId}-title">
          <h3 id="category-${categoryId}-title" class="achievements__category-title achievements__category-title--${categoryCode}" aria-describedby="category-${categoryId}-count">
            ${categoryTitle}
          </h3>
          <p id="category-${categoryId}-count" class="sr-only">
            ${achievementCount} achievements in this category
          </p>
          <div class="achievements__grid" role="list" aria-labelledby="category-${categoryId}-title">
            ${categoryAchievements.map((achievement) => this.renderAchievementCard(achievement)).join("")}
          </div>
        </section>
      `;
    });

    if (achievementsCategoriesContainer) {
      achievementsCategoriesContainer.innerHTML = categoriesHTML;
    }

    // Render stats
    const statsHTML = `
      <div class="achievements__stat" role="listitem">
        <span class="achievements__stat-label">Total</span>
        <span class="achievements__stat-value" aria-label="Total ${achievementStats.total} achievements">
          ${achievementStats.total}
        </span>
      </div>
      <div class="achievements__stat" role="listitem">
        <span class="achievements__stat-label">Unlocked</span>
        <span class="achievements__stat-value" aria-label="${achievementStats.unlocked} achievements unlocked">
          ${achievementStats.unlocked}
        </span>
      </div>
      <div class="achievements__stat" role="listitem">
        <span class="achievements__stat-label">Progress</span>
        <span class="achievements__stat-value" aria-label="${achievementStats.progress} percent progress">
          ${achievementStats.progress}%
        </span>
      </div>
    `;

    if (achievementsStatsContainer) {
      achievementsStatsContainer.innerHTML = statsHTML;
    }

    // Show content
    if (achievementsContent) {
      achievementsContent.style.display = "block";
    }
    if (achievementsEmptySection) {
      achievementsEmptySection.style.display = "none";
    }
  }

  /**
   * Render filter component
   */
  private renderFilterComponent(): void {
    const achievementFilterContainer = document.getElementById("achievement-filter-container");
    if (!achievementFilterContainer) {
      return;
    }

    const filterHTML = `
      <div class="achievement-filter" data-testid="achievement-filter" role="region" aria-labelledby="filter-heading">
        <h2 id="filter-heading" class="achievement-filter__title">Filter Achievements</h2>
        
        <div class="achievement-filter__container">
          <div class="achievement-filter__field">
            <label for="status-filter" class="achievement-filter__label" id="status-filter-label">Status</label>
            <select id="status-filter" class="achievement-filter__select" aria-labelledby="filter-heading status-filter-label" aria-controls="achievement-list">
              <option value="all">All</option>
              <option value="unlocked">Unlocked</option>
              <option value="locked">Locked</option>
              <option value="in-progress">In Progress</option>
            </select>
            <span class="achievement-filter__count" id="status-count" aria-live="polite"></span>
          </div>

          <div class="achievement-filter__field">
            <label for="category-filter" class="achievement-filter__label" id="category-filter-label">Category</label>
            <select id="category-filter" class="achievement-filter__select" aria-labelledby="filter-heading category-filter-label" aria-controls="achievement-list">
              <option value="all">All Categories</option>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
            <span class="achievement-filter__count" id="category-count" aria-live="polite"></span>
          </div>
        </div>

        <div class="achievement-filter__actions">
          <button type="button" class="achievement-filter__reset" id="reset-filters">Reset Filters</button>
        </div>
      </div>
    `;

    achievementFilterContainer.innerHTML = filterHTML;
    this.initializeFilters();
  }

  /**
   * Initialize filter functionality
   */
  private initializeFilters(): void {
    const statusFilter = document.getElementById("status-filter");
    const categoryFilter = document.getElementById("category-filter");
    const resetButton = document.getElementById("reset-filters");

    if (statusFilter) {
      statusFilter.addEventListener("change", () => this.applyFilters());
    }
    if (categoryFilter) {
      categoryFilter.addEventListener("change", () => this.applyFilters());
    }
    if (resetButton) {
      resetButton.addEventListener("click", () => this.resetFilters());
    }

    // Initial filter application
    this.applyFilters();
  }

  // Filter-related methods continue in the next part...

  /**
   * Get card category from element
   */
  private getCardCategory(card: Element): string {
    const categoryElement = card.querySelector(".achievement-card__category");
    if (!categoryElement) {
      return "bronze";
    }
    const categoryText = categoryElement.textContent?.trim().toLowerCase();
    return categoryText || "bronze";
  }

  /**
   * Get card progress from element
   */
  private getCardProgress(card: Element): number {
    const progressText = card.querySelector(".achievement-card__progress-text");
    if (!progressText) {
      return 0;
    }
    const progressMatch = progressText.textContent?.match(/(\d+)%/);
    return progressMatch ? parseInt(progressMatch[1]) : 0;
  }

  /**
   * Determine card status
   */
  private getCardStatus(card: Element): string {
    const isUnlocked = card.classList.contains("achievement-card--unlocked");
    if (isUnlocked) {
      return "unlocked";
    }

    const progress = this.getCardProgress(card);
    if (progress > 0 && progress < 100) {
      return "in-progress";
    }

    return "locked";
  }

  /**
   * Check if card matches filters
   */
  private cardMatchesFilters(
    card: Element,
    selectedStatus: string,
    selectedCategory: string
  ): boolean {
    const status = this.getCardStatus(card);
    const cardCategory = this.getCardCategory(card);

    const statusMatch = selectedStatus === "all" || status === selectedStatus;
    const categoryMatch = selectedCategory === "all" || cardCategory === selectedCategory;

    return statusMatch && categoryMatch;
  }

  /**
   * Update card visibility
   */
  private updateCardVisibility(card: Element, cardElement: Element, isVisible: boolean): void {
    if (isVisible) {
      (cardElement as HTMLElement).style.display = "";
      cardElement.classList.remove("filtered-hidden");
      card.classList.remove("filtered-hidden");
    } else {
      (cardElement as HTMLElement).style.display = "none";
      cardElement.classList.add("filtered-hidden");
      card.classList.add("filtered-hidden");
    }
  }

  /**
   * Update category sections visibility
   */
  private updateCategoryVisibility(): void {
    const categories = document.querySelectorAll(".achievements__category");

    categories.forEach((category) => {
      const categoryCards = category.querySelectorAll(".achievement-card");
      const visibleCards = Array.from(categoryCards).filter(
        (card) =>
          !card.classList.contains("filtered-hidden") &&
          (card.closest('[role="listitem"]') as HTMLElement)?.style.display !== "none"
      );

      const categoryElement = category as HTMLElement;
      if (visibleCards.length === 0) {
        categoryElement.style.display = "none";
        category.classList.add("section-empty");
      } else {
        categoryElement.style.display = "block";
        category.classList.remove("section-empty");
      }
    });
  }

  /**
   * Apply filters to achievements
   */
  private applyFilters(): void {
    const statusFilter = document.getElementById("status-filter") as HTMLSelectElement;
    const categoryFilter = document.getElementById("category-filter") as HTMLSelectElement;

    if (!statusFilter || !categoryFilter) {
      return;
    }

    const selectedStatus = statusFilter.value;
    const selectedCategory = categoryFilter.value;
    const achievementCards = document.querySelectorAll(".achievement-card");

    let visibleCount = 0;

    achievementCards.forEach((card) => {
      const cardElement = card.closest('[role="listitem"]') || card.parentElement;
      if (!cardElement) {
        return;
      }

      const isVisible = this.cardMatchesFilters(card, selectedStatus, selectedCategory);
      this.updateCardVisibility(card, cardElement, isVisible);

      if (isVisible) {
        visibleCount++;
      }
    });

    this.updateCategoryVisibility();
    this.updateFilterCounts(selectedStatus, selectedCategory, visibleCount);
  }

  /**
   * Update filter counts
   */
  private updateFilterCounts(
    selectedStatus: string,
    selectedCategory: string,
    visibleCount: number
  ): void {
    const statusCount = document.getElementById("status-count");
    const categoryCount = document.getElementById("category-count");

    if (statusCount) {
      statusCount.textContent = `${visibleCount} achievements`;
    }
    if (categoryCount) {
      categoryCount.textContent = `${visibleCount} achievements`;
    }
  }

  /**
   * Reset all filters
   */
  private resetFilters(): void {
    const statusFilter = document.getElementById("status-filter") as HTMLSelectElement;
    const categoryFilter = document.getElementById("category-filter") as HTMLSelectElement;

    if (statusFilter) {
      statusFilter.value = "all";
    }
    if (categoryFilter) {
      categoryFilter.value = "all";
    }

    this.applyFilters();
  }
}

/**
 * Initialize achievements page functionality
 */
export async function initializeAchievementsPage(): Promise<void> {
  const manager = new AchievementsPageManager();
  await manager.initialize();
}

/**
 * Setup event listeners for achievements page
 */
export function setupAchievementsEventListeners(): void {
  // Listen for authentication changes
  window.addEventListener("storage", (e) => {
    if (e.key === "auth_status") {
      initializeAchievementsPage();
    }
  });

  // Initialize on DOM ready with delay to ensure server-side rendering is complete
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // Small delay to let server-side auth complete
      setTimeout(initializeAchievementsPage, 100);
    });
  } else {
    // Small delay to let server-side auth complete
    setTimeout(initializeAchievementsPage, 100);
  }

  // Astro page transition support
  document.addEventListener("astro:page-load", () => {
    setTimeout(initializeAchievementsPage, 100);
  });
}
