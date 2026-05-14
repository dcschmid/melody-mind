import "@freshjuice/astro-search-plugin/element";

const SEARCH_ROOT_SELECTOR = "astro-search-palette";
const SEARCH_BACKDROP_SELECTOR = ".astro-search-backdrop";
const SEARCH_INPUT_SELECTOR = ".astro-search-input";
const SEARCH_RESULTS_SELECTOR = ".astro-search-results";
const SEARCH_RESULT_SELECTOR = ".astro-search-result";
const SEARCH_RESULT_TITLE_SELECTOR = ".astro-search-result-title";
const SEARCH_RESULT_TYPE_SELECTOR = ".astro-search-result-type";
const SEARCH_RESULT_DESC_SELECTOR = ".astro-search-result-desc";
const SEARCH_GROUP_LABEL_SELECTOR = ".astro-search-group-label";
const SEARCH_EMPTY_SELECTOR = ".astro-search-empty";
const SEARCH_ARTWORK_DATA_ID = "music-search-artwork-data";
const SEARCH_FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const SEARCH_RESULTS_ID = "music-search-palette-results";
const SEARCH_INPUT_LABEL = "Search albums and tracks";
const SEARCH_EMPTY_SUGGESTIONS = ["Neon Hearts", "Gothic Metal", "instrumental", "dawn"];

const SEARCH_GROUP_LABELS: Record<string, string> = {
  album: "Albums",
  albums: "Albums",
  track: "Tracks",
  tracks: "Tracks",
  genre: "Genres",
  genres: "Genres",
};

let searchObserver: MutationObserver | null = null;
let artworkItems: SearchArtworkItem[] | null = null;

interface SearchArtworkItem {
  albumUrl: string;
  title: string;
  description: string;
  genre: string;
  imageUrl: string;
  imageWidth?: number;
  imageHeight?: number;
  trackCount: number;
  totalDurationSeconds: number;
  trackTitles: string[];
  tracks: SearchArtworkTrack[];
}

interface SearchArtworkTrack {
  title: string;
  trackNumber: number;
  durationSeconds: number;
  description: string;
  isInstrumental: boolean;
}

interface SearchResultMatch {
  item: SearchArtworkItem;
  track?: SearchArtworkTrack;
}

function getSearchRoot(): Element | null {
  return document.querySelector(SEARCH_ROOT_SELECTOR);
}

function getFocusableElements(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll(SEARCH_FOCUSABLE_SELECTOR)).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.offsetParent !== null
  );
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizePath(value: string): string {
  try {
    const url = new URL(value, window.location.origin);
    return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  } catch {
    return value.split("#")[0] || value;
  }
}

function getArtworkItems(): SearchArtworkItem[] {
  if (artworkItems) {
    return artworkItems;
  }

  const dataElement = document.getElementById(SEARCH_ARTWORK_DATA_ID);

  if (!dataElement?.textContent) {
    artworkItems = [];
    return artworkItems;
  }

  try {
    const parsed = JSON.parse(dataElement.textContent);
    artworkItems = Array.isArray(parsed) ? parsed : [];
  } catch {
    artworkItems = [];
  }

  return artworkItems;
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

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds) {
    return "";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getAlbumMeta(item: SearchArtworkItem): string {
  return [
    item.genre,
    `${item.trackCount} tracks`,
    formatDuration(item.totalDurationSeconds),
  ]
    .filter(Boolean)
    .join(" · ");
}

function getTrackMeta(item: SearchArtworkItem, track: SearchArtworkTrack): string {
  return [
    `Track ${track.trackNumber}`,
    item.title,
    item.genre,
    formatDuration(track.durationSeconds),
  ]
    .filter(Boolean)
    .join(" · ");
}

function findArtworkForResult(result: HTMLElement): SearchResultMatch | undefined {
  const items = getArtworkItems();
  const resultPath = normalizePath(getResultUrl(result));
  const resultTitle = getResultTitle(result);
  const resultDescription = normalizeText(
    result.querySelector(SEARCH_RESULT_DESC_SELECTOR)?.textContent || ""
  );

  if (resultPath) {
    const pathMatch = items.find((item) => normalizePath(item.albumUrl) === resultPath);

    if (pathMatch) {
      const trackMatch = pathMatch.tracks.find(
        (track) => normalizeText(track.title) === resultTitle
      );

      return { item: pathMatch, ...(trackMatch ? { track: trackMatch } : {}) };
    }
  }

  const titleMatch = items.find((item) => normalizeText(item.title) === resultTitle);

  if (titleMatch) {
    return { item: titleMatch };
  }

  for (const item of items) {
    const albumTitle = normalizeText(item.title);
    const trackMatch = item.tracks.find(
      (track) => normalizeText(track.title) === resultTitle
    );

    if (trackMatch || resultDescription.includes(`from ${albumTitle}.`)) {
      return { item, ...(trackMatch ? { track: trackMatch } : {}) };
    }
  }

  return undefined;
}

function createArtworkElement(item: SearchArtworkItem): HTMLElement {
  const artwork = document.createElement("span");
  const image = document.createElement("img");

  artwork.className = "astro-search-result-artwork";
  image.className = "astro-search-result-artwork__image";
  image.src = item.imageUrl;
  image.alt = `Cover art for ${item.title}`;
  image.loading = "lazy";
  image.decoding = "async";

  if (typeof item.imageWidth === "number") {
    image.width = item.imageWidth;
  }

  if (typeof item.imageHeight === "number") {
    image.height = item.imageHeight;
  }

  artwork.append(image);
  return artwork;
}

function getSearchGroupLabel(value: string): string {
  const normalized = normalizeText(value);

  return SEARCH_GROUP_LABELS[normalized] || value;
}

function enhanceSearchGroups(results: HTMLElement): void {
  results.querySelectorAll(SEARCH_GROUP_LABEL_SELECTOR).forEach((label) => {
    if (!(label instanceof HTMLElement)) {
      return;
    }

    const nextLabel = getSearchGroupLabel(label.textContent || "");
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

function enhanceSearchEmptyState(backdrop: HTMLElement): void {
  const input = backdrop.querySelector(SEARCH_INPUT_SELECTOR);
  const emptyState = backdrop.querySelector(SEARCH_EMPTY_SELECTOR);

  if (!(input instanceof HTMLInputElement) || !(emptyState instanceof HTMLElement)) {
    return;
  }

  const query = input.value.trim();

  if (
    emptyState.dataset.musicSearchEmptyEnhanced === "true" &&
    emptyState.dataset.musicSearchEmptyQuery === query
  ) {
    return;
  }

  emptyState.dataset.musicSearchEmptyEnhanced = "true";
  emptyState.dataset.musicSearchEmptyQuery = query;
  emptyState.replaceChildren();

  const title = document.createElement("p");
  title.className = "astro-search-empty__title";
  title.textContent = query
    ? "No match on the shelf."
    : "Start with a record, genre, or mood.";
  emptyState.append(title);

  const text = document.createElement("p");
  text.className = "astro-search-empty__text";
  text.textContent = query
    ? "Try a shorter title, a genre, or one of these listening cues."
    : "Try one of these searches to browse the catalog.";
  emptyState.append(text);

  const suggestions = document.createElement("span");
  suggestions.className = "astro-search-empty__suggestions";

  for (const suggestion of SEARCH_EMPTY_SUGGESTIONS) {
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

function enhanceSearchResults(results: HTMLElement): void {
  enhanceSearchGroups(results);
  syncResultSelectionState(results);

  results.querySelectorAll(SEARCH_RESULT_SELECTOR).forEach((result) => {
    if (
      !(result instanceof HTMLElement) ||
      result.dataset.musicArtworkEnhanced === "true"
    ) {
      return;
    }

    const artworkMatch = findArtworkForResult(result);

    if (!artworkMatch) {
      return;
    }

    result.dataset.musicArtworkEnhanced = "true";

    const title = result.querySelector(SEARCH_RESULT_TITLE_SELECTOR);
    const description = result.querySelector(SEARCH_RESULT_DESC_SELECTOR);
    const content = document.createElement("span");
    const meta = document.createElement("span");

    content.className = "astro-search-result-content";
    meta.className = "astro-search-result-meta";
    meta.textContent = artworkMatch.track
      ? getTrackMeta(artworkMatch.item, artworkMatch.track)
      : getAlbumMeta(artworkMatch.item);

    if (title instanceof HTMLElement) {
      title.dataset.musicSearchTitle = artworkMatch.track
        ? artworkMatch.track.title
        : artworkMatch.item.title;
      content.append(title);
    }

    content.append(meta);

    if (description instanceof HTMLElement) {
      description.textContent =
        artworkMatch.track?.description ||
        (artworkMatch.track?.isInstrumental ? "Instrumental track." : "") ||
        artworkMatch.item.description;
      content.append(description);
    }

    result.prepend(createArtworkElement(artworkMatch.item));

    if (content.childNodes.length > 0) {
      result.append(content);
    }
  });
}

function enhanceSearchModal(): void {
  const root = getSearchRoot();
  const backdrop = root?.querySelector(SEARCH_BACKDROP_SELECTOR);

  if (!(backdrop instanceof HTMLElement)) {
    return;
  }

  const input = backdrop.querySelector(SEARCH_INPUT_SELECTOR);
  const results = backdrop.querySelector(SEARCH_RESULTS_SELECTOR);

  if (input instanceof HTMLInputElement) {
    input.setAttribute("aria-label", SEARCH_INPUT_LABEL);
    input.setAttribute("aria-controls", SEARCH_RESULTS_ID);
    input.setAttribute("aria-autocomplete", "list");
  }

  if (results instanceof HTMLElement) {
    results.id = SEARCH_RESULTS_ID;
    results.setAttribute("aria-label", "Search results");
    enhanceSearchResults(results);
  }

  enhanceSearchEmptyState(backdrop);

  if (backdrop.dataset.musicSearchEnhanced === "true") {
    return;
  }

  backdrop.dataset.musicSearchEnhanced = "true";
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

function observeSearchModal(): void {
  const root = getSearchRoot();

  if (!root || searchObserver) {
    return;
  }

  searchObserver = new MutationObserver(() => {
    enhanceSearchModal();
  });
  searchObserver.observe(root, { childList: true, subtree: true });
}

function openSearch(): void {
  window.dispatchEvent(new CustomEvent("astro-search:open"));
  window.requestAnimationFrame(enhanceSearchModal);
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

  const searchLink = target.closest('a[href="/?search=1"]');

  if (!searchLink) {
    return;
  }

  event.preventDefault();
  openSearch();
});

handleSearchRoute();
observeSearchModal();
window.addEventListener("popstate", handleSearchRoute);
window.addEventListener("astro-search:open", () => {
  window.requestAnimationFrame(enhanceSearchModal);
});
