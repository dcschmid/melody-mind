const SEARCH_ROOT_SELECTOR = 'astro-search-palette[data-enhanced-search="true"]';
const SEARCH_BACKDROP_SELECTOR = ".astro-search-backdrop";
const SEARCH_INPUT_SELECTOR = ".astro-search-input";
const SEARCH_RESULTS_SELECTOR = ".astro-search-results";
const SEARCH_RESULT_SELECTOR = ".astro-search-result";
const SEARCH_RESULT_TITLE_SELECTOR = ".astro-search-result-title";
const SEARCH_RESULT_TYPE_SELECTOR = ".astro-search-result-type";
const SEARCH_RESULT_DESC_SELECTOR = ".astro-search-result-desc";
const SEARCH_GROUP_LABEL_SELECTOR = ".astro-search-group-label";
const SEARCH_EMPTY_SELECTOR = ".astro-search-empty";
const SEARCH_FILTERS_SELECTOR = ".astro-search-filters";
const SEARCH_FILTER_EMPTY_SELECTOR = ".astro-search-filter-empty";
const SEARCH_FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface EnhancedSearchItem {
  url: string;
  title: string;
  type?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  displayMeta?: string;
}

interface EnhancedSearchConfig {
  emptyText: string;
  emptyTextWithQuery: string;
  emptyTitle: string;
  emptyTitleWithQuery: string;
  groupLabels: Record<string, string>;
  inputLabel: string;
  items: EnhancedSearchItem[];
  resultsLabel: string;
  routeHrefs: string[];
  suggestions: string[];
}

const fallbackConfig: EnhancedSearchConfig = {
  emptyText: "Try a shorter title, topic, or one of the suggested searches.",
  emptyTextWithQuery: "Try a shorter title, topic, or one of the suggested searches.",
  emptyTitle: "Start with a title, topic, or mood.",
  emptyTitleWithQuery: "No matching result.",
  groupLabels: {},
  inputLabel: "Search",
  items: [],
  resultsLabel: "Search results",
  routeHrefs: [],
  suggestions: [],
};

let searchObserver: MutationObserver | null = null;
const configCache = new WeakMap<Element, EnhancedSearchConfig>();

interface EnrichmentMeta {
  imageUrl?: string;
  imageAlt?: string;
  displayMeta?: string;
}

/**
 * Result rows are enriched with a thumbnail + meta line sourced from the same
 * search index the web component fetches (`json.docs.docs`), keyed by normalized
 * title. This replaces the former ~425KB-per-page inline `items` payload — the
 * data already exists in the fetched index, so there is no need to ship it twice.
 */
let enrichmentMap: Map<string, EnrichmentMeta> | null = null;
let enrichmentMapPromise: Promise<Map<string, EnrichmentMeta>> | null = null;

function getIndexUrl(): string {
  const root = getSearchRoots()[0];
  return root?.getAttribute("index-url") || "/search-index.json";
}

async function loadEnrichmentMap(): Promise<Map<string, EnrichmentMeta>> {
  const map = new Map<string, EnrichmentMeta>();

  try {
    const response = await fetch(getIndexUrl());

    if (!response.ok) {
      return map;
    }

    const index = (await response.json()) as {
      docs?: { docs?: Record<string, Record<string, unknown>> };
    };
    const documents = index.docs?.docs;

    if (documents) {
      for (const document of Object.values(documents)) {
        const title =
          typeof document.title === "string" ? normalizeText(document.title) : "";

        // First-wins on duplicate titles, matching the previous array lookup.
        if (!title || map.has(title)) {
          continue;
        }

        map.set(title, {
          ...(typeof document.imageUrl === "string"
            ? { imageUrl: document.imageUrl }
            : {}),
          ...(typeof document.imageAlt === "string"
            ? { imageAlt: document.imageAlt }
            : {}),
          ...(typeof document.displayMeta === "string"
            ? { displayMeta: document.displayMeta }
            : {}),
        });
      }
    }
  } catch {
    /* Enrichment is progressive; results still render from the index without it. */
  }

  return map;
}

function ensureEnrichmentMap(): void {
  if (enrichmentMap || enrichmentMapPromise) {
    return;
  }

  enrichmentMapPromise = loadEnrichmentMap();
  void enrichmentMapPromise.then((map) => {
    enrichmentMap = map;
    enhanceSearchModals();
  });
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizePath(value: string): string {
  try {
    const url = new URL(value, window.location.origin);
    return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  } catch {
    const path = value.split("#")[0] || value;
    return path.endsWith("/") ? path : `${path}/`;
  }
}

function getSearchRoots(): HTMLElement[] {
  return Array.from(document.querySelectorAll(SEARCH_ROOT_SELECTOR)).filter(
    (root): root is HTMLElement => root instanceof HTMLElement
  );
}

function getFocusableElements(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll(SEARCH_FOCUSABLE_SELECTOR)).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.offsetParent !== null
  );
}

function readConfig(root: HTMLElement): EnhancedSearchConfig {
  const cachedConfig = configCache.get(root);

  if (cachedConfig) {
    return cachedConfig;
  }

  const configId = root.dataset.enhancedSearchConfigId;
  const configElement = configId ? document.getElementById(configId) : null;

  if (!configElement?.textContent) {
    configCache.set(root, fallbackConfig);
    return fallbackConfig;
  }

  try {
    const parsed = JSON.parse(configElement.textContent) as Partial<EnhancedSearchConfig>;
    const config = {
      ...fallbackConfig,
      ...parsed,
      groupLabels: parsed.groupLabels || {},
      items: Array.isArray(parsed.items) ? parsed.items : [],
      routeHrefs: Array.isArray(parsed.routeHrefs) ? parsed.routeHrefs : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    };
    configCache.set(root, config);
    return config;
  } catch {
    configCache.set(root, fallbackConfig);
    return fallbackConfig;
  }
}

function getResultTitle(result: HTMLElement): string {
  const title = result.querySelector(SEARCH_RESULT_TITLE_SELECTOR);

  if (!title) {
    return "";
  }

  const titleClone = title.cloneNode(true);

  if (titleClone instanceof Element) {
    titleClone.querySelector(SEARCH_RESULT_TYPE_SELECTOR)?.remove();
  }

  return normalizeText(titleClone.textContent || "");
}

function createMediaElement(meta: EnrichmentMeta, fallbackLabel: string): HTMLElement {
  const media = document.createElement("span");
  media.className = "astro-search-result-media";

  if (meta.imageUrl) {
    const image = document.createElement("img");
    image.className = "astro-search-result-media__image";
    image.src = meta.imageUrl;
    image.alt = meta.imageAlt || "";
    image.loading = "lazy";
    image.decoding = "async";
    media.append(image);
    return media;
  }

  const mark = document.createElement("span");
  mark.className = "astro-search-result-media__mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = fallbackLabel.trim().charAt(0).toUpperCase() || "S";
  media.append(mark);
  return media;
}

function getSearchGroupLabel(value: string, config: EnhancedSearchConfig): string {
  const normalized = normalizeText(value);

  return config.groupLabels[normalized] || value;
}

function enhanceSearchGroups(results: HTMLElement, config: EnhancedSearchConfig): void {
  results.querySelectorAll(SEARCH_GROUP_LABEL_SELECTOR).forEach((label) => {
    if (!(label instanceof HTMLElement)) {
      return;
    }

    const nextLabel = getSearchGroupLabel(label.textContent || "", config);
    if (label.textContent === nextLabel) {
      return;
    }

    label.textContent = nextLabel;
  });
}

function syncResultSelectionState(results: HTMLElement): void {
  results.querySelectorAll(SEARCH_RESULT_SELECTOR).forEach((result) => {
    if (!(result instanceof HTMLElement)) {
      return;
    }

    const isSelected = result.dataset.selected === "true";
    result.setAttribute("aria-selected", String(isSelected));
  });
}

function getResultType(result: HTMLElement): string {
  return normalizeText(
    result.querySelector(SEARCH_RESULT_TYPE_SELECTOR)?.textContent || ""
  ).replace(/s$/, "");
}

function getVisibleSearchResults(results: HTMLElement): HTMLElement[] {
  return Array.from(results.querySelectorAll<HTMLElement>(SEARCH_RESULT_SELECTOR)).filter(
    (result) => !result.hidden
  );
}

function selectVisibleResult(results: HTMLElement, result: HTMLElement): void {
  results.querySelectorAll<HTMLElement>(SEARCH_RESULT_SELECTOR).forEach((candidate) => {
    const isSelected = candidate === result;
    candidate.dataset.selected = String(isSelected);
    candidate.setAttribute("aria-selected", String(isSelected));
  });
  result.scrollIntoView({ block: "nearest" });
}

function applySearchFilter(results: HTMLElement): void {
  const backdrop = results.closest<HTMLElement>(SEARCH_BACKDROP_SELECTOR);
  const activeFilter = backdrop?.dataset.searchFilter || "all";
  const rows = Array.from(results.querySelectorAll<HTMLElement>(SEARCH_RESULT_SELECTOR));

  rows.forEach((result) => {
    result.hidden = activeFilter !== "all" && getResultType(result) !== activeFilter;
  });

  Array.from(results.children).forEach((group) => {
    if (
      !(group instanceof HTMLElement) ||
      !group.querySelector(SEARCH_GROUP_LABEL_SELECTOR)
    ) {
      return;
    }
    group.hidden = !Array.from(
      group.querySelectorAll<HTMLElement>(SEARCH_RESULT_SELECTOR)
    ).some((result) => !result.hidden);
  });

  const visibleResults = getVisibleSearchResults(results);
  const existingEmpty = results.querySelector<HTMLElement>(SEARCH_FILTER_EMPTY_SELECTOR);
  const needsFilteredEmpty =
    activeFilter !== "all" && rows.length > 0 && visibleResults.length === 0;

  if (!needsFilteredEmpty) {
    existingEmpty?.remove();
  } else if (!existingEmpty) {
    const empty = document.createElement("li");
    const title = document.createElement("p");
    const text = document.createElement("p");
    const filterLabel =
      backdrop
        ?.querySelector<HTMLButtonElement>(
          `.astro-search-filter[data-search-filter="${activeFilter}"]`
        )
        ?.textContent?.trim() || "results";

    empty.className = "astro-search-filter-empty";
    empty.setAttribute("role", "status");
    title.className = "astro-search-filter-empty__title";
    title.textContent = `No matching ${filterLabel.toLowerCase()}.`;
    text.className = "astro-search-filter-empty__text";
    text.textContent = "Try another search or choose All.";
    empty.append(title, text);
    results.append(empty);
  }

  if (activeFilter !== "all" && visibleResults.length > 0) {
    const selected = visibleResults.find((result) => result.dataset.selected === "true");
    const firstResult = visibleResults[0];
    if (!selected && firstResult) {
      selectVisibleResult(results, firstResult);
    }
  }
}

function enhanceSearchEmptyState(
  backdrop: HTMLElement,
  config: EnhancedSearchConfig
): void {
  const input = backdrop.querySelector(SEARCH_INPUT_SELECTOR);
  const emptyState = backdrop.querySelector(SEARCH_EMPTY_SELECTOR);

  if (!(input instanceof HTMLInputElement) || !(emptyState instanceof HTMLElement)) {
    return;
  }

  const query = input.value.trim();

  if (
    emptyState.dataset.enhancedSearchEmpty === "true" &&
    emptyState.dataset.enhancedSearchEmptyQuery === query
  ) {
    return;
  }

  emptyState.dataset.enhancedSearchEmpty = "true";
  emptyState.dataset.enhancedSearchEmptyQuery = query;
  emptyState.replaceChildren();

  const title = document.createElement("p");
  title.className = "astro-search-empty__title";
  title.textContent = query ? config.emptyTitleWithQuery : config.emptyTitle;
  emptyState.append(title);

  const text = document.createElement("p");
  text.className = "astro-search-empty__text";
  text.textContent = query ? config.emptyTextWithQuery : config.emptyText;
  emptyState.append(text);

  if (config.suggestions.length === 0) {
    return;
  }

  const suggestions = document.createElement("span");
  suggestions.className = "astro-search-empty__suggestions";

  for (const suggestion of config.suggestions) {
    const button = document.createElement("button");
    button.className = "astro-search-empty__suggestion";
    button.type = "button";
    button.textContent = suggestion;
    button.addEventListener("click", () => {
      input.value = suggestion;
      input.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          data: suggestion,
          inputType: "insertText",
        })
      );
      input.focus();
    });
    suggestions.append(button);
  }

  emptyState.append(suggestions);
}

function enhanceSearchResults(results: HTMLElement, config: EnhancedSearchConfig): void {
  enhanceSearchGroups(results, config);
  syncResultSelectionState(results);

  const rows = results.querySelectorAll(SEARCH_RESULT_SELECTOR);

  if (rows.length > 0) {
    // Load enrichment lazily once real results exist; by now the web component
    // has fetched the index, so this resolves from cache.
    ensureEnrichmentMap();
  }

  const map = enrichmentMap;

  rows.forEach((result) => {
    if (
      !(result instanceof HTMLElement) ||
      result.dataset.enhancedSearchResult === "true"
    ) {
      return;
    }

    // Map not ready yet: leave the row unmarked so a later pass can enrich it.
    if (!map) {
      return;
    }

    const titleKey = getResultTitle(result);
    const meta = titleKey ? map.get(titleKey) : undefined;

    result.dataset.enhancedSearchResult = "true";

    if (!meta) {
      return;
    }

    const title = result.querySelector(SEARCH_RESULT_TITLE_SELECTOR);
    const description = result.querySelector(SEARCH_RESULT_DESC_SELECTOR);
    const content = document.createElement("span");
    const metaElement = document.createElement("span");

    content.className = "astro-search-result-content";
    metaElement.className = "astro-search-result-meta";
    metaElement.textContent = meta.displayMeta || "";

    if (title instanceof HTMLElement) {
      content.append(title);
    }

    if (metaElement.textContent) {
      content.append(metaElement);
    }

    // Description is already rendered from the index by the web component.
    if (description instanceof HTMLElement) {
      content.append(description);
    }

    result.prepend(createMediaElement(meta, titleKey));

    if (content.childNodes.length > 0) {
      result.append(content);
    }
  });

  applySearchFilter(results);
}

function ensureSearchFilters(backdrop: HTMLElement, config: EnhancedSearchConfig): void {
  if (backdrop.querySelector(SEARCH_FILTERS_SELECTOR)) {
    return;
  }
  const inputWrap = backdrop.querySelector(SEARCH_INPUT_SELECTOR)?.parentElement;
  if (!inputWrap) {
    return;
  }

  const filters = document.createElement("div");
  filters.className = "astro-search-filters";
  filters.setAttribute("role", "group");
  filters.setAttribute("aria-label", "Filter search results");
  const options = [
    ["all", "All"],
    ["album", "Albums"],
    ["track", "Tracks"],
    ["genre", "Genres"],
  ] as const;

  options.forEach(([value, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "astro-search-filter";
    button.textContent = label;
    button.dataset.searchFilter = value;
    button.setAttribute("aria-pressed", String(value === "all"));
    button.addEventListener("click", () => {
      backdrop.dataset.searchFilter = value;
      filters.querySelectorAll<HTMLButtonElement>("button").forEach((candidate) => {
        candidate.setAttribute(
          "aria-pressed",
          String(candidate.dataset.searchFilter === value)
        );
      });
      const results = backdrop.querySelector<HTMLElement>(SEARCH_RESULTS_SELECTOR);
      if (results) {
        enhanceSearchResults(results, config);
      }
    });
    filters.append(button);
  });

  inputWrap.insertAdjacentElement("afterend", filters);
}

function enhanceSearchModal(root: HTMLElement): void {
  const config = readConfig(root);
  const backdrop = root.querySelector(SEARCH_BACKDROP_SELECTOR);

  if (!(backdrop instanceof HTMLElement)) {
    return;
  }

  const input = backdrop.querySelector(SEARCH_INPUT_SELECTOR);
  const results = backdrop.querySelector(SEARCH_RESULTS_SELECTOR);
  const resultsId =
    root.dataset.enhancedSearchResultsId ||
    `${root.dataset.enhancedSearchConfigId || "enhanced-search"}-results`;

  if (input instanceof HTMLInputElement) {
    input.setAttribute("aria-label", config.inputLabel);
    input.setAttribute("aria-controls", resultsId);
    input.setAttribute("aria-autocomplete", "list");
  }

  if (results instanceof HTMLElement) {
    results.id = resultsId;
    results.setAttribute("aria-label", config.resultsLabel);
    enhanceSearchResults(results, config);
  }

  enhanceSearchEmptyState(backdrop, config);
  ensureSearchFilters(backdrop, config);

  if (backdrop.dataset.enhancedSearchModal === "true") {
    return;
  }

  backdrop.dataset.enhancedSearchModal = "true";
  backdrop.addEventListener(
    "keydown",
    (event) => {
      const activeFilter = backdrop.dataset.searchFilter || "all";
      if (
        activeFilter === "all" ||
        !(event.target instanceof HTMLInputElement) ||
        !["ArrowDown", "ArrowUp", "Enter"].includes(event.key)
      ) {
        return;
      }

      const currentResults = backdrop.querySelector<HTMLElement>(SEARCH_RESULTS_SELECTOR);
      const visibleResults = currentResults
        ? getVisibleSearchResults(currentResults)
        : [];
      if (!currentResults || visibleResults.length === 0) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      const selectedIndex = visibleResults.findIndex(
        (result) => result.dataset.selected === "true"
      );

      if (event.key === "Enter") {
        visibleResults[Math.max(selectedIndex, 0)]?.click();
        return;
      }

      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = Math.min(
        Math.max(selectedIndex + direction, 0),
        visibleResults.length - 1
      );
      const nextResult = visibleResults[nextIndex];
      if (nextResult) {
        selectVisibleResult(currentResults, nextResult);
      }
    },
    { capture: true }
  );
  backdrop.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements(backdrop);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (!firstElement || !lastElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

function enhanceSearchModals(): void {
  getSearchRoots().forEach(enhanceSearchModal);
}

function observeSearchModal(): void {
  searchObserver?.disconnect();
  searchObserver ??= new MutationObserver(enhanceSearchModals);
  searchObserver.observe(document.body, { childList: true, subtree: true });
}

function openSearch(): void {
  window.dispatchEvent(new CustomEvent("astro-search:open"));
  window.requestAnimationFrame(enhanceSearchModals);
}

function handleSearchRoute(): void {
  const url = new URL(window.location.href);

  if (url.searchParams.get("search") !== "1") {
    return;
  }

  url.searchParams.delete("search");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  openSearch();
}

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const searchLink = target.closest('a[href][data-enhanced-search-trigger="true"]');

  if (!(searchLink instanceof HTMLAnchorElement)) {
    return;
  }

  const linkUrl = new URL(searchLink.href, window.location.origin);
  const shouldOpen = getSearchRoots().some((root) => {
    const config = readConfig(root);

    return config.routeHrefs.some((href) => {
      const routeUrl = new URL(href, window.location.origin);
      return (
        routeUrl.origin === linkUrl.origin &&
        normalizePath(routeUrl.pathname) === normalizePath(linkUrl.pathname)
      );
    });
  });

  if (!shouldOpen) {
    return;
  }

  event.preventDefault();
  openSearch();
});

const initEnhancedSearch = (): void => {
  observeSearchModal();
  enhanceSearchModals();
  handleSearchRoute();
};

initEnhancedSearch();
document.addEventListener("astro:page-load", initEnhancedSearch);
window.addEventListener("popstate", handleSearchRoute);
window.addEventListener("astro-search:open", () => {
  window.requestAnimationFrame(enhanceSearchModals);
});

// Imported for its side effects (via the loader stub's dynamic import).
export {};
