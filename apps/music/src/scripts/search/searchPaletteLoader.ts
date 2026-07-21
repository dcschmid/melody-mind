/**
 * Tiny eager stub for the search palette. The local controller and Orama runtime
 * load only on first intent rather than on every page. They are
 * dynamically imported on first intent — mod+K, a click on a search trigger
 * link, or a `?search=1` deep link — and pre-warmed on hover/focus of the
 * trigger so the palette feels instant when actually invoked.
 */

const TRIGGER_SELECTOR = 'a[href][data-enhanced-search-trigger="true"]';

let loadPromise: Promise<unknown> | null = null;

function loadPalette(): Promise<unknown> {
  loadPromise ??= import("./enhancedSearchPalette").then((module) => {
    // The controller owns every trigger from here on; the stub must stop
    // listening or mod+K would be handled twice.
    teardownStub();
    return module;
  });

  return loadPromise;
}

function openPalette(): void {
  void loadPalette().then(() => {
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("astro-search:open"));
    });
  });
}

/** Mirrors the element's "mod+k" matching: meta or ctrl, no shift/alt. */
function isModK(event: KeyboardEvent): boolean {
  return (
    event.key.toLowerCase() === "k" &&
    !event.shiftKey &&
    !event.altKey &&
    (event.metaKey ? !event.ctrlKey : event.ctrlKey)
  );
}

function onKeydown(event: KeyboardEvent): void {
  if (!isModK(event)) {
    return;
  }

  event.preventDefault();
  openPalette();
}

function onTriggerClick(event: MouseEvent): void {
  const target = event.target;

  if (!(target instanceof Element) || !target.closest(TRIGGER_SELECTOR)) {
    return;
  }

  event.preventDefault();
  openPalette();
}

function onWarm(): void {
  void loadPalette();
}

function teardownStub(): void {
  window.removeEventListener("keydown", onKeydown);
  document.removeEventListener("click", onTriggerClick);
}

window.addEventListener("keydown", onKeydown);
document.addEventListener("click", onTriggerClick);

document.querySelectorAll(TRIGGER_SELECTOR).forEach((trigger) => {
  trigger.addEventListener("pointerenter", onWarm, { once: true });
  trigger.addEventListener("focus", onWarm, { once: true });
});

// Deep link (`/?search=1`): the enhancer's own route handling strips the query
// parameter and opens the palette as soon as its module is imported.
if (new URLSearchParams(window.location.search).get("search") === "1") {
  void loadPalette();
}
