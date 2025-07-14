/**
 * Achievement Filter Utilities
 * Modern TypeScript utilities for achievement filtering functionality
 * 
 * @performance Optimized with efficient DOM manipulation and event handling
 * @accessibility WCAG AAA compliant with enhanced keyboard navigation
 */

// Filter state interface
interface FilterState {
  status: string;
  category: string;
}

// Filter configuration interface
interface FilterConfig {
  statusSelector: string;
  categorySelector: string;
  resetSelector: string;
  helpSelector: string;
  keyboardPanelSelector: string;
  announcementSelector: string;
  statusCountSelector: string;
  categoryCountSelector: string;
  cardSelector: string;
  gridSelector: string;
  sectionSelector: string;
}

// Translation strings interface
interface FilterTranslations {
  changed: string;
  noResults: string;
  results: string;
  reset: string;
  countAll: string;
  countCategoryAll: string;
  countGeneric: string;
}

// Card data interface
interface CardData {
  element: HTMLElement;
  status: string;
  category: string;
}

// Default configuration
const DEFAULT_CONFIG: FilterConfig = {
  statusSelector: '#status-filter',
  categorySelector: '#category-filter',
  resetSelector: '.achievement-filter__reset',
  helpSelector: '.achievement-filter__help-button',
  keyboardPanelSelector: '#keyboard-shortcuts-panel',
  announcementSelector: '#filter-announcements',
  statusCountSelector: '#status-count',
  categoryCountSelector: '#category-count',
  cardSelector: '[data-testid^="achievement-card-"]',
  gridSelector: '.achievements__grid',
  sectionSelector: '.achievements__category'
};

/**
 * Modern Achievement Filter Controller with TypeScript
 * Handles filtering, keyboard shortcuts, and accessibility
 */
export class AchievementFilterController {
  private config: FilterConfig;
  private elements: {
    statusSelect: HTMLSelectElement | null;
    categorySelect: HTMLSelectElement | null;
    resetButton: HTMLButtonElement | null;
    helpButton: HTMLButtonElement | null;
    keyboardPanel: HTMLElement | null;
    announcements: HTMLElement | null;
    statusCount: HTMLElement | null;
    categoryCount: HTMLElement | null;
  };
  private translations: FilterTranslations;
  private originalCards = new Map<string, CardData[]>();
  private currentVisibleCount = 0;
  private abortController: AbortController;

  constructor(config: Partial<FilterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.abortController = new AbortController();
    this.elements = this.initializeElements();
    this.translations = this.loadTranslations();
    this.initializeOriginalCards();
    this.bindEvents();
    this.setupKeyboardShortcuts();
    this.applyFilters();
  }

  // Initialize DOM elements with type safety
  private initializeElements() {
    const statusSelect = document.querySelector(this.config.statusSelector) as HTMLSelectElement | null;
    const categorySelect = document.querySelector(this.config.categorySelector) as HTMLSelectElement | null;
    const resetButton = document.querySelector(this.config.resetSelector) as HTMLButtonElement | null;
    const helpButton = document.querySelector(this.config.helpSelector) as HTMLButtonElement | null;
    const keyboardPanel = document.querySelector(this.config.keyboardPanelSelector) as HTMLElement | null;
    const announcements = document.querySelector(this.config.announcementSelector) as HTMLElement | null;
    const statusCount = document.querySelector(this.config.statusCountSelector) as HTMLElement | null;
    const categoryCount = document.querySelector(this.config.categoryCountSelector) as HTMLElement | null;

    // Initialize ARIA attributes for help button
    if (helpButton) {
      helpButton.setAttribute('aria-expanded', 'false');
      helpButton.setAttribute('aria-controls', 'keyboard-shortcuts-panel');
      helpButton.setAttribute('id', 'help-button-label');
    }

    return {
      statusSelect,
      categorySelect,
      resetButton,
      helpButton,
      keyboardPanel,
      announcements,
      statusCount,
      categoryCount
    };
  }

  // Load translations from data attributes
  private loadTranslations(): FilterTranslations {
    const filterContainer = document.querySelector('.achievement-filter') as HTMLElement;
    const defaultTranslations: FilterTranslations = {
      changed: 'Filter changed',
      noResults: 'No results found',
      results: 'Showing {visibleCards} result{cardPlural}',
      reset: 'Filters reset',
      countAll: 'All ({count})',
      countCategoryAll: 'All categories ({count})',
      countGeneric: '{value} ({count})'
    };

    if (!filterContainer?.dataset) {
      return defaultTranslations;
    }

    const { dataset } = filterContainer;
    return {
      changed: dataset.announcementChanged || defaultTranslations.changed,
      noResults: dataset.announcementNoResults || defaultTranslations.noResults,
      results: dataset.announcementResults || defaultTranslations.results,
      reset: dataset.announcementReset || defaultTranslations.reset,
      countAll: dataset.countAll || defaultTranslations.countAll,
      countCategoryAll: dataset.countCategoryAll || defaultTranslations.countCategoryAll,
      countGeneric: dataset.countGeneric || defaultTranslations.countGeneric
    };
  }

  // Initialize original card data for filtering
  private initializeOriginalCards(): void {
    const sections = document.querySelectorAll(this.config.sectionSelector);

    sections.forEach((section, index) => {
      const grid = section.querySelector(this.config.gridSelector);
      if (!grid) return;

      const sectionId = this.getSectionId(section as HTMLElement, index);
      const cards = this.extractCardData(grid);

      this.originalCards.set(sectionId, cards);
    });
  }

  // Get unique section identifier
  private getSectionId(section: HTMLElement, index: number): string {
    return section.dataset.sectionId ||
           section.querySelector('h2, h3')?.textContent?.trim() ||
           section.classList[0] ||
           `section-${index}`;
  }

  // Extract card data from grid
  private extractCardData(grid: Element): CardData[] {
    return Array.from(grid.querySelectorAll(this.config.cardSelector))
      .map(card => ({
        element: card.cloneNode(true) as HTMLElement,
        status: (card as HTMLElement).dataset.status || '',
        category: (card as HTMLElement).dataset.category || ''
      }));
  }

  // Bind event listeners with modern approach
  private bindEvents(): void {
    const { signal } = this.abortController;

    this.elements.statusSelect?.addEventListener('change', 
      () => this.handleFilterChange('status'), { signal });

    this.elements.categorySelect?.addEventListener('change', 
      () => this.handleFilterChange('category'), { signal });

    this.elements.resetButton?.addEventListener('click', 
      () => this.resetFilters(), { signal });

    this.elements.helpButton?.addEventListener('click', 
      () => this.toggleKeyboardHelp(), { signal });
  }

  // Handle filter change events
  private handleFilterChange(filterType: string): void {
    const filterValue = filterType === 'status' 
      ? this.elements.statusSelect?.value || 'all'
      : this.elements.categorySelect?.value || 'all';

    this.applyFilters();
    this.updateFilterCounts();
    this.announceFilterChange(filterType, filterValue);
  }

  // Apply filters to achievement cards
  private applyFilters(): void {
    const statusFilter = this.elements.statusSelect?.value || 'all';
    const categoryFilter = this.elements.categorySelect?.value || 'all';
    const sections = document.querySelectorAll(this.config.sectionSelector);

    let visibleCards = 0;
    let visibleSections = 0;

    sections.forEach((section, index) => {
      const grid = section.querySelector(this.config.gridSelector);
      if (!grid) return;

      const sectionId = this.getSectionId(section as HTMLElement, index);
      const cards = this.originalCards.get(sectionId) || [];
      let visibleCardsInSection = 0;

      // Clear grid
      grid.innerHTML = '';

      // Filter and render cards
      cards.forEach(({ element, status, category }) => {
        const statusMatch = statusFilter === 'all' || status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || category === categoryFilter;

        if (statusMatch && categoryMatch) {
          this.renderCard(element, grid);
          visibleCards++;
          visibleCardsInSection++;
        }
      });

      // Update section visibility
      this.updateSectionVisibility(section as HTMLElement, visibleCardsInSection > 0);
      
      if (visibleCardsInSection > 0) {
        visibleSections++;
      }
    });

    this.updateFilterResultsAnnouncement(visibleCards, visibleSections);
    this.currentVisibleCount = visibleCards;
  }

  // Render individual card with animation
  private renderCard(element: HTMLElement, grid: Element): void {
    element.classList.add('achievement-card-entering');
    element.setAttribute('aria-hidden', 'false');
    element.removeAttribute('tabindex');

    grid.appendChild(element);

    // Remove animation class after animation completes
    setTimeout(() => {
      element.classList.remove('achievement-card-entering');
    }, this.getAnimationTimeout());
  }

  // Update section visibility based on content
  private updateSectionVisibility(section: HTMLElement, hasVisibleCards: boolean): void {
    section.classList.toggle('section-empty', !hasVisibleCards);
    section.setAttribute('aria-hidden', String(!hasVisibleCards));
    section.style.display = hasVisibleCards ? '' : 'none';
  }

  // Reset all filters to default state
  public resetFilters(): void {
    if (this.elements.statusSelect) {
      this.elements.statusSelect.value = 'all';
    }
    if (this.elements.categorySelect) {
      this.elements.categorySelect.value = 'all';
    }

    this.applyFilters();
    this.updateFilterCounts();
    this.announceFilterReset();

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('achievementFilterReset'));
  }

  // Toggle keyboard shortcuts help panel
  private toggleKeyboardHelp(): void {
    const { keyboardPanel, helpButton } = this.elements;
    if (!keyboardPanel || !helpButton) return;

    const isHidden = keyboardPanel.hasAttribute('hidden');
    keyboardPanel.toggleAttribute('hidden', !isHidden);
    helpButton.setAttribute('aria-expanded', String(isHidden));
  }

  // Setup keyboard shortcuts
  private setupKeyboardShortcuts(): void {
    const shortcuts = {
      'r': () => {
        this.resetFilters();
        this.elements.resetButton?.focus();
      },
      'h': () => this.toggleKeyboardHelp(),
      's': () => this.elements.statusSelect?.focus(),
      'c': () => this.elements.categorySelect?.focus()
    };

    document.addEventListener('keydown', (event) => {
      if (event.altKey && shortcuts[event.key as keyof typeof shortcuts]) {
        event.preventDefault();
        shortcuts[event.key as keyof typeof shortcuts]();
      }
    }, { signal: this.abortController.signal });
  }

  // Update filter count displays
  private updateFilterCounts(): void {
    const statusValue = this.elements.statusSelect?.value || 'all';
    const categoryValue = this.elements.categorySelect?.value || 'all';
    const currentCount = this.currentVisibleCount;

    // Update status count
    if (this.elements.statusCount) {
      const statusText = statusValue === 'all'
        ? this.translations.countAll.replace('{count}', String(currentCount))
        : this.translations.countGeneric
            .replace('{value}', statusValue)
            .replace('{count}', String(currentCount));
      this.elements.statusCount.textContent = statusText;
    }

    // Update category count
    if (this.elements.categoryCount) {
      const categoryText = categoryValue === 'all'
        ? this.translations.countCategoryAll.replace('{count}', String(currentCount))
        : this.translations.countGeneric
            .replace('{value}', categoryValue)
            .replace('{count}', String(currentCount));
      this.elements.categoryCount.textContent = categoryText;
    }
  }

  // Announce filter changes for screen readers
  private announceFilterChange(filterType: string, filterValue: string): void {
    if (!this.elements.announcements) return;

    const message = this.translations.changed
      .replace('{filterType}', filterType)
      .replace('{filterValue}', filterValue);

    this.announce(message);
  }

  // Announce filter reset
  private announceFilterReset(): void {
    if (!this.elements.announcements) return;
    this.announce(this.translations.reset);
  }

  // Announce filter results
  private updateFilterResultsAnnouncement(visibleCards: number, visibleSections: number): void {
    if (!this.elements.announcements) return;

    const message = visibleCards === 0
      ? this.translations.noResults
      : this.translations.results
          .replace('{visibleCards}', String(visibleCards))
          .replace('{cardPlural}', visibleCards !== 1 ? 's' : '')
          .replace('{visibleSections}', String(visibleSections))
          .replace('{sectionPlural}', visibleSections !== 1 ? 's' : '');

    this.announce(message);
  }

  // Helper method for announcements
  private announce(message: string): void {
    if (!this.elements.announcements) return;

    this.elements.announcements.textContent = message;
    setTimeout(() => {
      if (this.elements.announcements) {
        this.elements.announcements.textContent = '';
      }
    }, this.getAnnouncementTimeout());
  }

  // Get animation timeout from CSS variables
  private getAnimationTimeout(): number {
    return parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--timeout-animation')
    ) || 300;
  }

  // Get announcement timeout from CSS variables
  private getAnnouncementTimeout(): number {
    return parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--timeout-announcement')
    ) || 3000;
  }

  // Public API methods
  public getCurrentState(): FilterState {
    return {
      status: this.elements.statusSelect?.value || 'all',
      category: this.elements.categorySelect?.value || 'all'
    };
  }

  public setFilters(state: Partial<FilterState>): void {
    if (state.status && this.elements.statusSelect) {
      this.elements.statusSelect.value = state.status;
    }
    if (state.category && this.elements.categorySelect) {
      this.elements.categorySelect.value = state.category;
    }
    this.applyFilters();
    this.updateFilterCounts();
  }

  public getVisibleCount(): number {
    return this.currentVisibleCount;
  }

  // Cleanup method
  public destroy(): void {
    this.abortController.abort();
  }
}

// Factory function for easier usage
export const createAchievementFilter = (config?: Partial<FilterConfig>): AchievementFilterController => {
  return new AchievementFilterController(config);
};

// Auto-initialization helper
export const initializeAchievementFilter = (): AchievementFilterController => {
  const controller = createAchievementFilter();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    controller.destroy();
  }, { once: true });

  return controller;
};

// Enhanced utility functions
export const achievementFilterUtils = {
  // Get all visible cards
  getVisibleCards(): HTMLElement[] {
    return Array.from(document.querySelectorAll(`${DEFAULT_CONFIG.cardSelector}:not(.filtered-hidden)`));
  },

  // Get cards by status
  getCardsByStatus(status: string): HTMLElement[] {
    return Array.from(document.querySelectorAll(`${DEFAULT_CONFIG.cardSelector}[data-status="${status}"]`));
  },

  // Get cards by category
  getCardsByCategory(category: string): HTMLElement[] {
    return Array.from(document.querySelectorAll(`${DEFAULT_CONFIG.cardSelector}[data-category="${category}"]`));
  },

  // Get filter statistics
  getFilterStats(): { total: number; unlocked: number; inProgress: number; locked: number } {
    const allCards = document.querySelectorAll(DEFAULT_CONFIG.cardSelector);
    const unlocked = this.getCardsByStatus('unlocked').length;
    const inProgress = this.getCardsByStatus('in-progress').length;
    const locked = this.getCardsByStatus('locked').length;

    return {
      total: allCards.length,
      unlocked,
      inProgress,
      locked
    };
  }
};