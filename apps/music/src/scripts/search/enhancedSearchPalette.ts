import { create, load, search } from "@orama/orama";
import type { AnyOrama, RawData, Result } from "@orama/orama";
import type { PlayerLoadDetail, PlayerQueue } from "../../types/player";
import { loadPlayerQueue } from "../music/player-queue-loader";

const SEARCH_ROOT_SELECTOR = '[data-enhanced-search="true"]';
const SEARCH_FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type SearchFilter = "all" | "Album" | "Track" | "Genre" | "Series";

interface SearchDocument {
  id?: string;
  type: Exclude<SearchFilter, "all">;
  title: string;
  desc?: string;
  url: string;
  imageUrl?: string;
  imageAlt?: string;
  displayMeta?: string;
  albumId?: string;
  trackIndex?: number;
}

interface SearchConfig {
  emptyText: string;
  emptyTextWithQuery: string;
  emptyTitle: string;
  emptyTitleWithQuery: string;
  groupLabels: Record<string, string>;
  inputLabel: string;
  resultsLabel: string;
  routeHrefs: string[];
  suggestions: string[];
}

interface SearchController {
  open: () => void;
  close: () => void;
}

interface SearchQuery {
  term: string;
  properties: readonly ["title", "searchText"];
  boost: { title: number };
  limit: number;
  where?: { type: Exclude<SearchFilter, "all"> };
}

interface SearchResponse {
  hits: Result<SearchDocument>[];
}

const fallbackConfig: SearchConfig = {
  emptyText: "Try a shorter title, topic, or one of the suggested searches.",
  emptyTextWithQuery: "Try a shorter title, topic, or one of the suggested searches.",
  emptyTitle: "Start with a title, topic, or mood.",
  emptyTitleWithQuery: "No matching result.",
  groupLabels: {},
  inputLabel: "Search",
  resultsLabel: "Search results",
  routeHrefs: [],
  suggestions: [],
};

const indexCache = new Map<string, Promise<AnyOrama>>();
const controllers = new WeakMap<HTMLElement, SearchController>();
let activeController: SearchController | null = null;
const searchDocuments = search as unknown as (
  database: AnyOrama,
  query: SearchQuery
) => SearchResponse | Promise<SearchResponse>;

const normalizePath = (value: string): string => {
  const url = new URL(value, window.location.origin);
  return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
};

const getSearchRoots = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>(SEARCH_ROOT_SELECTOR));

const readConfig = (root: HTMLElement): SearchConfig => {
  const configId = root.dataset.enhancedSearchConfigId;
  const element = configId ? document.getElementById(configId) : null;

  if (!element?.textContent) {
    return fallbackConfig;
  }

  try {
    const parsed = JSON.parse(element.textContent) as Partial<SearchConfig>;
    return {
      ...fallbackConfig,
      ...parsed,
      groupLabels: parsed.groupLabels || {},
      routeHrefs: Array.isArray(parsed.routeHrefs) ? parsed.routeHrefs : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    };
  } catch {
    return fallbackConfig;
  }
};

const loadIndex = (url: string): Promise<AnyOrama> => {
  const cached = indexCache.get(url);
  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Search index request failed with HTTP ${response.status}`);
    }

    const raw = (await response.json()) as RawData;
    const database = create({ schema: { __placeholder: "string" } as const });
    load(database, raw);
    return database;
  })();

  indexCache.set(url, promise);
  void promise.catch(() => {
    if (indexCache.get(url) === promise) {
      indexCache.delete(url);
    }
  });
  return promise;
};

const createIcon = (): SVGElement => {
  const namespace = "http://www.w3.org/2000/svg";
  const icon = document.createElementNS(namespace, "svg");
  const path = document.createElementNS(namespace, "path");
  icon.classList.add("astro-search-icon");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("width", "18");
  icon.setAttribute("height", "18");
  icon.setAttribute("viewBox", "0 0 256 256");
  icon.setAttribute("fill", "currentColor");
  path.setAttribute(
    "d",
    "M229.66 218.34l-50.07-50.06a88.11 88.11 0 1 0-11.31 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32ZM40 112a72 72 0 1 1 72 72A72.08 72.08 0 0 1 40 112Z"
  );
  icon.append(path);
  return icon;
};

const createController = (root: HTMLElement): SearchController => {
  const config = readConfig(root);
  const indexUrl = root.dataset.indexUrl || "/search-index.json";
  const queueUrl = root.dataset.queueUrl || "/player-queues.json";
  const resultLimit = Number.parseInt(root.dataset.resultLimit || "8", 10);
  let filter: SearchFilter = "all";
  let query = "";
  let results: Result<SearchDocument>[] = [];
  let displayedResults: Result<SearchDocument>[] = [];
  let selectedIndex = 0;
  let requestId = 0;
  let previouslyFocused: HTMLElement | null = null;
  let backdrop: HTMLElement | null = null;
  let input: HTMLInputElement | null = null;
  let resultsList: HTMLUListElement | null = null;
  const inertedElements = new Map<HTMLElement, boolean>();

  const getGroupLabel = (type: string): string =>
    config.groupLabels[type.toLowerCase()] || `${type}s`;

  const getTrackQueue = async (document: SearchDocument): Promise<PlayerQueue | null> => {
    if (!document.albumId) {
      return null;
    }

    try {
      return await loadPlayerQueue(queueUrl, document.albumId);
    } catch {
      return null;
    }
  };

  const select = (index: number): void => {
    if (!resultsList || displayedResults.length === 0) {
      input?.removeAttribute("aria-activedescendant");
      return;
    }
    selectedIndex = Math.min(Math.max(index, 0), displayedResults.length - 1);
    resultsList
      .querySelectorAll<HTMLElement>(".astro-search-result")
      .forEach((element, elementIndex) => {
        const isSelected = elementIndex === selectedIndex;
        element.dataset.selected = String(isSelected);
        element.setAttribute("aria-selected", String(isSelected));
        if (isSelected) {
          input?.setAttribute("aria-activedescendant", element.id);
          element.scrollIntoView({ block: "nearest" });
        }
      });
  };

  const choose = async (index: number): Promise<void> => {
    const hit = displayedResults[index];
    if (!hit) {
      return;
    }
    const selectionEvent = new CustomEvent("astro-search:select", {
      detail: { document: hit.document },
      cancelable: true,
    });
    if (root.dispatchEvent(selectionEvent)) {
      const queue =
        hit.document.type === "Track" ? await getTrackQueue(hit.document) : null;
      const trackIndex = hit.document.trackIndex;
      if (
        queue &&
        Number.isInteger(trackIndex) &&
        trackIndex !== undefined &&
        trackIndex >= 0 &&
        trackIndex < queue.tracks.length
      ) {
        window.dispatchEvent(
          new CustomEvent<PlayerLoadDetail>("melodymind:player-load", {
            detail: { queue, startIndex: trackIndex, autoplay: true },
          })
        );
      } else {
        window.location.href = hit.document.url;
      }
    }
    controller.close();
  };

  const createMedia = (document: SearchDocument): HTMLElement => {
    const media = documentCreate("span", "astro-search-result-media");
    if (document.imageUrl) {
      const image = documentCreate("img", "astro-search-result-media__image");
      image.setAttribute("src", document.imageUrl);
      image.setAttribute("alt", document.imageAlt || "");
      image.setAttribute("loading", "lazy");
      image.setAttribute("decoding", "async");
      media.append(image);
      return media;
    }

    const mark = documentCreate("span", "astro-search-result-media__mark");
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = document.title.trim().charAt(0).toUpperCase() || "S";
    media.append(mark);
    return media;
  };

  const createResult = (hit: Result<SearchDocument>, index: number): HTMLElement => {
    const item = documentCreate("li", "astro-search-result-item");
    const button = documentCreate("button", "astro-search-result");
    const content = documentCreate("span", "astro-search-result-content");
    const title = documentCreate("span", "astro-search-result-title");
    const type = documentCreate("span", "astro-search-result-type");
    const action = documentCreate("span", "astro-search-result-action");
    item.setAttribute("role", "presentation");
    button.setAttribute("type", "button");
    button.setAttribute("role", "option");
    button.id = `${resultsList?.id || "music-search-results"}-option-${index}`;
    button.dataset.selected = String(index === selectedIndex);
    button.setAttribute("aria-selected", String(index === selectedIndex));
    type.textContent = hit.document.type;
    action.textContent = hit.document.type === "Track" ? "Play" : "Open";
    title.append(type, document.createTextNode(hit.document.title));
    content.append(title);

    if (hit.document.displayMeta) {
      const meta = documentCreate("span", "astro-search-result-meta");
      meta.textContent = hit.document.displayMeta;
      content.append(meta);
    }
    if (hit.document.desc) {
      const description = documentCreate("span", "astro-search-result-desc");
      description.textContent = hit.document.desc;
      content.append(description);
    }

    button.append(createMedia(hit.document), content, action);
    button.addEventListener("mouseenter", () => select(index));
    button.addEventListener("focus", () => select(index));
    button.addEventListener("click", () => void choose(index));
    item.append(button);
    return item;
  };

  const renderEmpty = (isLoading = false, hasError = false): void => {
    if (!resultsList) {
      return;
    }
    displayedResults = [];
    input?.removeAttribute("aria-activedescendant");
    resultsList.setAttribute("aria-busy", String(isLoading));
    const item = documentCreate("li", "astro-search-empty");
    item.setAttribute("role", "status");
    const title = documentCreate("p", "astro-search-empty__title");
    const text = documentCreate("p", "astro-search-empty__text");

    if (isLoading) {
      title.textContent = "Loading the music catalog…";
      text.textContent = "Search will be ready in a moment.";
    } else if (hasError) {
      title.textContent = "Search is unavailable.";
      text.textContent = "Check your connection and try again.";
    } else {
      title.textContent = query ? config.emptyTitleWithQuery : config.emptyTitle;
      text.textContent = query ? config.emptyTextWithQuery : config.emptyText;
    }
    item.append(title, text);

    if (hasError) {
      const retry = documentCreate("button", "astro-search-empty__retry");
      retry.setAttribute("type", "button");
      retry.textContent = "Retry search";
      retry.addEventListener("click", () => {
        renderEmpty(true);
        void loadIndex(indexUrl)
          .then(() => {
            if (query.trim()) {
              void runSearch();
            } else {
              renderEmpty();
            }
          })
          .catch(() => renderEmpty(false, true));
      });
      item.append(retry);
    }

    if (!query && !isLoading && !hasError && config.suggestions.length > 0) {
      const suggestions = documentCreate("span", "astro-search-empty__suggestions");
      for (const suggestion of config.suggestions) {
        const button = documentCreate("button", "astro-search-empty__suggestion");
        button.setAttribute("type", "button");
        button.textContent = suggestion;
        button.addEventListener("click", () => {
          if (!input) {
            return;
          }
          input.value = suggestion;
          query = suggestion;
          void runSearch();
          input.focus();
        });
        suggestions.append(button);
      }
      item.append(suggestions);
    }
    resultsList.replaceChildren(item);
  };

  const renderResults = (): void => {
    if (!resultsList) {
      return;
    }
    if (results.length === 0) {
      renderEmpty();
      return;
    }

    const fragment = document.createDocumentFragment();
    if (filter === "all") {
      const groups = new Map<string, Result<SearchDocument>[]>();
      for (const hit of results) {
        const group = groups.get(hit.document.type) || [];
        group.push(hit);
        groups.set(hit.document.type, group);
      }
      displayedResults = Array.from(groups.values()).flat();
      let resultIndex = 0;
      for (const [type, hits] of groups) {
        const groupItem = documentCreate("li", "astro-search-result-group");
        const label = documentCreate("div", "astro-search-group-label");
        const list = documentCreate("ul", "astro-search-result-group__list");
        const groupLabelId = `${resultsList.id}-group-${type.toLowerCase()}`;
        groupItem.setAttribute("role", "group");
        groupItem.setAttribute("aria-labelledby", groupLabelId);
        label.id = groupLabelId;
        list.setAttribute("role", "presentation");
        label.textContent = getGroupLabel(type);
        for (const hit of hits) {
          list.append(createResult(hit, resultIndex));
          resultIndex += 1;
        }
        groupItem.append(label, list);
        fragment.append(groupItem);
      }
    } else {
      displayedResults = [...results];
      displayedResults.forEach((hit, index) => fragment.append(createResult(hit, index)));
    }
    resultsList.setAttribute("aria-busy", "false");
    resultsList.replaceChildren(fragment);
    select(selectedIndex);
  };

  const runSearch = async (): Promise<void> => {
    const currentRequest = ++requestId;
    const term = query.trim();
    if (!term) {
      results = [];
      selectedIndex = 0;
      renderEmpty();
      return;
    }

    renderEmpty(true);
    try {
      const loadedDatabase = await loadIndex(indexUrl);
      const response = await searchDocuments(loadedDatabase, {
        term,
        properties: ["title", "searchText"],
        boost: { title: 2 },
        limit: Number.isFinite(resultLimit) ? resultLimit : 8,
        ...(filter === "all" ? {} : { where: { type: filter } }),
      });
      if (currentRequest !== requestId) {
        return;
      }
      results = response.hits;
      selectedIndex = 0;
      renderResults();
    } catch (error) {
      if (currentRequest !== requestId) {
        return;
      }
      console.error("[music-search]", error);
      results = [];
      renderEmpty(false, true);
    }
  };

  const setFilter = (nextFilter: SearchFilter, filters: HTMLElement): void => {
    if (filter === nextFilter) {
      return;
    }
    filter = nextFilter;
    filters
      .querySelectorAll<HTMLButtonElement>(".astro-search-filter")
      .forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.searchFilter === nextFilter)
        );
      });
    void runSearch();
  };

  const setBackgroundInert = (): void => {
    let current: HTMLElement | null = root;

    while (current && current !== document.body) {
      const parent: HTMLElement | null = current.parentElement;
      if (!parent) {
        break;
      }
      Array.from(parent.children).forEach((element) => {
        if (element instanceof HTMLElement && element !== current) {
          if (!inertedElements.has(element)) {
            inertedElements.set(element, element.inert);
          }
          element.inert = true;
        }
      });
      current = parent;
    }
    document.body.classList.add("astro-search-open");
  };

  const restoreBackground = (): void => {
    inertedElements.forEach((wasInert, element) => {
      element.inert = wasInert;
    });
    inertedElements.clear();
    document.body.classList.remove("astro-search-open");
  };

  const createShell = (): void => {
    backdrop = documentCreate("div", "astro-search-backdrop");
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", config.inputLabel);
    const modal = documentCreate("div", "astro-search-modal");
    const inputWrap = documentCreate("div", "astro-search-input-wrap");
    input = documentCreate("input", "astro-search-input");
    input.setAttribute("type", "search");
    input.setAttribute("placeholder", root.dataset.placeholder || "Search…");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("spellcheck", "false");
    input.setAttribute("aria-label", config.inputLabel);
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-haspopup", "listbox");
    input.setAttribute(
      "aria-controls",
      root.dataset.enhancedSearchResultsId || "music-search-results"
    );
    input.setAttribute("aria-autocomplete", "list");
    const closeButton = documentCreate("button", "astro-search-close");
    const closeMark = documentCreate("span", "astro-search-close__mark");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("aria-label", "Close search");
    closeMark.setAttribute("aria-hidden", "true");
    closeMark.textContent = "\u00d7";
    closeButton.append(closeMark);
    closeButton.addEventListener("click", () => controller.close());
    inputWrap.append(createIcon(), input, closeButton);

    const filters = documentCreate("div", "astro-search-filters");
    filters.setAttribute("role", "group");
    filters.setAttribute("aria-label", "Filter search results");
    const filterOptions: ReadonlyArray<readonly [SearchFilter, string]> = [
      ["all", "All"],
      ["Album", "Albums"],
      ["Track", "Tracks"],
      ["Genre", "Genres"],
      ["Series", "Series"],
    ];
    for (const [value, label] of filterOptions) {
      const button = documentCreate("button", "astro-search-filter");
      button.setAttribute("type", "button");
      button.dataset.searchFilter = value;
      button.setAttribute("aria-pressed", String(value === filter));
      button.textContent = label;
      button.addEventListener("click", () => setFilter(value, filters));
      filters.append(button);
    }

    resultsList = documentCreate("ul", "astro-search-results");
    resultsList.id = root.dataset.enhancedSearchResultsId || "music-search-results";
    resultsList.setAttribute("role", "listbox");
    resultsList.setAttribute("aria-label", config.resultsLabel);
    resultsList.setAttribute("aria-busy", "false");
    const footer = documentCreate("div", "astro-search-footer");
    footer.append(
      createKeyHint(["↑", "↓"], "navigate"),
      createKeyHint(["↵"], "select"),
      createKeyHint(["esc"], "close")
    );
    modal.append(inputWrap, filters, resultsList, footer);
    backdrop.append(modal);
    root.replaceChildren(backdrop);

    input.addEventListener("input", () => {
      query = input?.value || "";
      void runSearch();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        select(selectedIndex + (event.key === "ArrowDown" ? 1 : -1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        void choose(selectedIndex);
      }
    });
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        controller.close();
      }
    });
    backdrop.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || !backdrop) {
        return;
      }
      const focusable = Array.from(
        backdrop.querySelectorAll<HTMLElement>(SEARCH_FOCUSABLE_SELECTOR)
      ).filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) {
        event.preventDefault();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    renderEmpty();
  };

  const controller: SearchController = {
    open: () => {
      if (backdrop) {
        input?.focus();
        return;
      }
      activeController?.close();
      activeController = controller;
      window.dispatchEvent(new CustomEvent("music-menu:close"));
      previouslyFocused =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setBackgroundInert();
      createShell();
      renderEmpty(true);
      void loadIndex(indexUrl)
        .then(() => {
          if (!query) {
            renderEmpty();
          }
        })
        .catch(() => {
          if (!query) {
            renderEmpty(false, true);
          }
        });
      window.requestAnimationFrame(() => input?.focus());
    },
    close: () => {
      if (!backdrop) {
        return;
      }
      requestId += 1;
      query = "";
      results = [];
      displayedResults = [];
      selectedIndex = 0;
      root.replaceChildren();
      backdrop = null;
      input = null;
      resultsList = null;
      if (activeController === controller) {
        activeController = null;
      }
      restoreBackground();
      previouslyFocused?.focus();
      previouslyFocused = null;
    },
  };

  return controller;
};

function documentCreate<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}

const createKeyHint = (keys: string[], label: string): HTMLElement => {
  const hint = documentCreate("span", "astro-search-key");
  for (const key of keys) {
    const keyboardKey = document.createElement("kbd");
    keyboardKey.textContent = key;
    hint.append(keyboardKey);
  }
  hint.append(document.createTextNode(` ${label}`));
  return hint;
};

const bindRoots = (): void => {
  getSearchRoots().forEach((root) => {
    if (!controllers.has(root)) {
      controllers.set(root, createController(root));
    }
  });
};

const openSearch = (): void => {
  bindRoots();
  const root = getSearchRoots()[0];
  if (root) {
    controllers.get(root)?.open();
  }
};

const handleSearchRoute = (): void => {
  const url = new URL(window.location.href);
  if (url.searchParams.get("search") !== "1") {
    return;
  }
  url.searchParams.delete("search");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  openSearch();
};

const isModK = (event: KeyboardEvent): boolean =>
  event.key.toLowerCase() === "k" &&
  !event.shiftKey &&
  !event.altKey &&
  (event.metaKey ? !event.ctrlKey : event.ctrlKey);

window.addEventListener("keydown", (event) => {
  if (isModK(event)) {
    event.preventDefault();
    activeController ? activeController.close() : openSearch();
  } else if (event.key === "Escape" && activeController) {
    event.preventDefault();
    activeController.close();
  }
});
window.addEventListener("astro-search:open", openSearch);
window.addEventListener("astro-search:close", () => activeController?.close());
window.addEventListener("astro-search:toggle", () =>
  activeController ? activeController.close() : openSearch()
);
document.addEventListener("click", (event) => {
  const target = event.target;
  const link =
    target instanceof Element
      ? target.closest<HTMLAnchorElement>('a[href][data-enhanced-search-trigger="true"]')
      : null;
  if (!link) {
    return;
  }
  const shouldOpen = getSearchRoots().some((root) =>
    readConfig(root).routeHrefs.some(
      (href) => normalizePath(href) === normalizePath(link.href)
    )
  );
  if (shouldOpen) {
    event.preventDefault();
    openSearch();
  }
});

bindRoots();
handleSearchRoute();
document.addEventListener("astro:page-load", () => {
  bindRoots();
  handleSearchRoute();
});
document.addEventListener("astro:before-swap", () => activeController?.close());
window.addEventListener("popstate", handleSearchRoute);

export {};
