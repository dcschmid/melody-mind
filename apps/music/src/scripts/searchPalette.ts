import "@freshjuice/astro-search-plugin/element";

const SEARCH_ROOT_SELECTOR = "astro-search-palette";
const SEARCH_BACKDROP_SELECTOR = ".astro-search-backdrop";
const SEARCH_INPUT_SELECTOR = ".astro-search-input";
const SEARCH_RESULTS_SELECTOR = ".astro-search-results";
const SEARCH_FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const SEARCH_RESULTS_ID = "music-search-palette-results";
const SEARCH_INPUT_LABEL = "Search albums and tracks";

let searchObserver: MutationObserver | null = null;

function getSearchRoot(): Element | null {
  return document.querySelector(SEARCH_ROOT_SELECTOR);
}

function getFocusableElements(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll(SEARCH_FOCUSABLE_SELECTOR)).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.offsetParent !== null
  );
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
  }

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
