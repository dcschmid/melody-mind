/**
 * Simple Category Filter
 * Replaces the over-engineered class-based approach
 */

interface CategoryFilterConfig {
  filterId: string;
  targetSelector: string;
}

/**
 * Initialize category filter with simple functionality
 */
export function initCategoryFilter(config: CategoryFilterConfig): void {
  const filterSelect = document.getElementById(
    config.filterId,
  ) as HTMLSelectElement;
  const categoryGroups = document.querySelectorAll<HTMLElement>(
    config.targetSelector,
  );

  if (!filterSelect || categoryGroups.length === 0) {
    return;
  }

  // Add change event listener
  filterSelect.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    filterCategories(selectedValue);
  });

  // Set initial state
  const initialValue = filterSelect.getAttribute("data-selected") || "all";
  filterSelect.value = initialValue;
  filterCategories(initialValue);

  function filterCategories(selectedType: string): void {
    categoryGroups.forEach((group) => {
      if (selectedType === "all") {
        group.style.display = "";
        group.setAttribute("aria-hidden", "false");
      } else {
        const groupCategoryType = group.getAttribute("data-category-type");
        const shouldShow = groupCategoryType === selectedType;

        group.style.display = shouldShow ? "" : "none";
        group.setAttribute("aria-hidden", (!shouldShow).toString());
      }
    });
  }
}

/**
 * Auto-initialize category filter
 */
export function initCategoryFilterAuto(): void {
  const filterElements = document.querySelectorAll("[data-category-filter]");

  filterElements.forEach((element) => {
    const filterId = element.getAttribute("data-category-filter");
    const targetSelector = element.getAttribute("data-target-selector");

    if (filterId && targetSelector) {
      initCategoryFilter({ filterId, targetSelector });
    }
  });
}

/**
 * Default category filter initialization
 */
export function initDefaultCategoryFilter(): void {
  initCategoryFilter({
    filterId: "category-filter",
    targetSelector: ".category-group",
  });
}
