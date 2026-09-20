const FILTER_ROOT_SELECTOR = '[data-collection-filter="true"]';

const normalizeFilterValue = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("en");

const bindCollectionGridFilters = () => {
  document.querySelectorAll<HTMLElement>(FILTER_ROOT_SELECTOR).forEach((root) => {
    if (root.dataset.bound === "true") {
      return;
    }

    const input = root.querySelector<HTMLInputElement>("[data-collection-filter-input]");
    const status = root.querySelector<HTMLElement>("[data-collection-filter-status]");
    const empty = root.querySelector<HTMLElement>("[data-collection-filter-empty]");
    const clearButtons = root.querySelectorAll<HTMLButtonElement>(
      "[data-collection-filter-clear]"
    );
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-collection-filter-item]")
    );

    if (!input || !status || !empty || items.length === 0) {
      return;
    }

    root.dataset.bound = "true";

    const itemSingular = root.dataset.collectionFilterSingular || "item";
    const itemPlural = root.dataset.collectionFilterPlural || "items";

    const applyFilter = (value: string, updateUrl = true) => {
      const normalizedValue = normalizeFilterValue(value);
      let visibleCount = 0;

      items.forEach((item) => {
        const searchText = normalizeFilterValue(item.dataset.collectionFilterText || "");
        const isVisible = !normalizedValue || searchText.includes(normalizedValue);
        item.hidden = !isVisible;
        visibleCount += isVisible ? 1 : 0;
      });

      status.textContent = `${visibleCount} ${
        visibleCount === 1 ? itemSingular : itemPlural
      } shown`;
      status.hidden = !normalizedValue;
      empty.hidden = visibleCount > 0;
      clearButtons.forEach((button) => {
        if (!button.closest("[data-collection-filter-empty]")) {
          button.hidden = !normalizedValue;
        }
      });

      if (updateUrl) {
        const url = new URL(window.location.href);
        if (value.trim()) {
          url.searchParams.set("filter", value.trim());
        } else {
          url.searchParams.delete("filter");
        }
        window.history.replaceState(window.history.state, "", url);
      }
    };

    const initialValue = new URL(window.location.href).searchParams.get("filter") || "";
    input.value = initialValue;
    applyFilter(initialValue, false);

    input.addEventListener("input", () => applyFilter(input.value));
    clearButtons.forEach((button) => {
      button.addEventListener("click", () => {
        input.value = "";
        applyFilter("");
        input.focus();
      });
    });
  });
};

bindCollectionGridFilters();
document.addEventListener("astro:page-load", bindCollectionGridFilters);
