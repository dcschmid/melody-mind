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

function getResultUrl(result: HTMLElement): string {
  const ownUrl =
    result instanceof HTMLAnchorElement
      ? result.getAttribute("href")
      : result.dataset.url || result.getAttribute("href");
  const nestedUrl = result.querySelector("a[href]")?.getAttribute("href");

  return ownUrl || nestedUrl || "";
}

function findSearchItem(
  result: HTMLElement,
  config: EnhancedSearchConfig
): EnhancedSearchItem | undefined {
  const resultPath = normalizePath(getResultUrl(result));
  const resultTitle = getResultTitle(result);

  if (resultPath) {
    const pathMatch = config.items.find((item) => normalizePath(item.url) === resultPath);

    if (pathMatch) {
      return pathMatch;
    }
  }

  return config.items.find((item) => normalizeText(item.title) === resultTitle);
}

function createMediaElement(item: EnhancedSearchItem): HTMLElement {
  const media = document.createElement("span");
  media.className = "astro-search-result-media";

  if (item.imageUrl) {
    const image = document.createElement("img");
    image.className = "astro-search-result-media__image";
    image.src = item.imageUrl;
    image.alt = item.imageAlt || "";
    image.loading = "lazy";
    image.decoding = "async";
    media.append(image);
    return media;
  }

  const mark = document.createElement("span");
  mark.className = "astro-search-result-media__mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = (item.type || item.title).trim().charAt(0).toUpperCase() || "S";
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

  results.querySelectorAll(SEARCH_RESULT_SELECTOR).forEach((result) => {
    if (
      !(result instanceof HTMLElement) ||
      result.dataset.enhancedSearchResult === "true"
    ) {
      return;
    }

    const searchItem = findSearchItem(result, config);

    if (!searchItem) {
      return;
    }

    result.dataset.enhancedSearchResult = "true";

    const title = result.querySelector(SEARCH_RESULT_TITLE_SELECTOR);
    const description = result.querySelector(SEARCH_RESULT_DESC_SELECTOR);
    const content = document.createElement("span");
    const meta = document.createElement("span");

    content.className = "astro-search-result-content";
    meta.className = "astro-search-result-meta";
    meta.textContent = searchItem.displayMeta || searchItem.type || "";

    if (title instanceof HTMLElement) {
      content.append(title);
    }

    if (meta.textContent) {
      content.append(meta);
    }

    if (description instanceof HTMLElement) {
      if (searchItem.description) {
        description.textContent = searchItem.description;
      }
      content.append(description);
    }

    result.prepend(createMediaElement(searchItem));

    if (content.childNodes.length > 0) {
      result.append(content);
    }
  });
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

  if (backdrop.dataset.enhancedSearchModal === "true") {
    return;
  }

  backdrop.dataset.enhancedSearchModal = "true";
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
  if (searchObserver) {
    return;
  }

  searchObserver = new MutationObserver(enhanceSearchModals);
  getSearchRoots().forEach((root) => {
    searchObserver?.observe(root, { childList: true, subtree: true });
  });
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

  const searchLink = target.closest("a[href]");

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

handleSearchRoute();
observeSearchModal();
window.addEventListener("popstate", handleSearchRoute);
window.addEventListener("astro-search:open", () => {
  window.requestAnimationFrame(enhanceSearchModals);
});
