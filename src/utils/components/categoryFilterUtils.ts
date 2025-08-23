/**
 * CategoryFilter Utilities
 * 
 * Centralized utilities for managing category filter functionality.
 * Eliminates code duplication in component script tags.
 */

import { safeGetElementById, safeQuerySelectorAll } from "../dom/domUtils";

/**
 * CategoryFilter configuration interface
 */
interface CategoryFilterConfig {
  filterId: string;
  targetSelector: string;
}

/**
 * CategoryFilter utility class
 */
export class CategoryFilterUtils {
  private filterSelect: HTMLSelectElement | null;
  private categoryGroups: HTMLElement[];
  private targetSelector: string;

  /**
   *
   */
  constructor(config: CategoryFilterConfig) {
    this.filterSelect = safeGetElementById<HTMLSelectElement>(config.filterId);
    this.categoryGroups = safeQuerySelectorAll<HTMLElement>(config.targetSelector);
    this.targetSelector = config.targetSelector;
    
    this.init();
  }

  /**
   * Initialize category filter functionality
   */
  private init(): void {
    if (!this.filterSelect) {
      return;
    }

    // Add change event listener
    this.filterSelect.addEventListener("change", (event) => this.handleFilterChange(event));

    // Set initial state based on data-selected attribute
    const initialValue = this.filterSelect.getAttribute("data-selected") || "all";
    this.filterSelect.value = initialValue;
    this.filterCategories(initialValue);
  }

  /**
   * Handle filter change events
   */
  private handleFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    this.filterCategories(selectedValue);
  }

  /**
   * Filter categories based on selected value
   */
  private filterCategories(selectedType: string): void {
    this.categoryGroups.forEach((group) => {
      if (selectedType === "all") {
        // Show all category groups
        group.style.display = "";
        group.setAttribute("aria-hidden", "false");
      } else {
        // Check if this group has the matching data-category-type attribute
        const groupCategoryType = group.getAttribute("data-category-type");
        const shouldShow = groupCategoryType === selectedType;

        group.style.display = shouldShow ? "" : "none";
        group.setAttribute("aria-hidden", (!shouldShow).toString());
      }
    });
  }

  /**
   * Get current filter value
   */
  public getCurrentFilter(): string {
    return this.filterSelect?.value || "all";
  }

  /**
   * Set filter value programmatically
   */
  public setFilter(value: string): void {
    if (this.filterSelect) {
      this.filterSelect.value = value;
      this.filterCategories(value);
    }
  }

  /**
   * Get visible category count
   */
  public getVisibleCategoryCount(): number {
    return this.categoryGroups.filter(group => 
      group.style.display !== "none" && 
      group.getAttribute("aria-hidden") !== "true"
    ).length;
  }

  /**
   * Reset filter to show all categories
   */
  public resetFilter(): void {
    this.setFilter("all");
  }

  /**
   * Destroy event listeners
   */
  public destroy(): void {
    if (this.filterSelect) {
      this.filterSelect.removeEventListener("change", (event) => this.handleFilterChange(event));
    }
  }
}

/**
 * Initialize category filter functionality
 */
export function initCategoryFilter(config: CategoryFilterConfig): CategoryFilterUtils | null {
  const groups = safeQuerySelectorAll(config.targetSelector);
  if (groups.length === 0) {
    return null;
  }
  
  return new CategoryFilterUtils(config);
}

/**
 * Auto-detect and initialize category filter
 */
export function initCategoryFilterAuto(): CategoryFilterUtils | null {
  // Try different selectors to find category groups
  const selectors = [
    ".category-group",
    ".genre-content", 
    "[data-category-type]",
    ".category-section",
  ];

  for (const selector of selectors) {
    const groups = safeQuerySelectorAll(selector);
    if (groups.length > 0) {
      return initCategoryFilter({
        filterId: "category-filter",
        targetSelector: selector
      });
    }
  }

  return null;
}

/**
 * Default category filter initialization
 */
export function initDefaultCategoryFilter(): CategoryFilterUtils | null {
  return initCategoryFilter({
    filterId: "category-filter",
    targetSelector: ".category-group"
  });
}
