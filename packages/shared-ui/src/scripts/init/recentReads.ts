import {
  loadRecentItems,
  normalizeRecentItemSlug,
} from "@shared-utils/utils/storage/recentItems";

const DEFAULT_FALLBACK_IMAGE = "/favicon.svg";

const createRecentReadItem = (
  title: string,
  href: string,
  imageSrc: string
): HTMLLIElement => {
  const item = document.createElement("li");
  item.className = "recent-reads-panel__item";

  const link = document.createElement("a");
  link.className = "recent-reads-panel__link";
  link.href = href;

  const media = document.createElement("div");
  media.className = "recent-reads-panel__media";

  const image = document.createElement("img");
  image.className = "recent-reads-panel__image";
  image.loading = "lazy";
  image.decoding = "async";
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  image.src = imageSrc || DEFAULT_FALLBACK_IMAGE;
  image.onerror = () => {
    if (image.src.endsWith(DEFAULT_FALLBACK_IMAGE)) {
      return;
    }

    image.src = DEFAULT_FALLBACK_IMAGE;
  };

  const body = document.createElement("span");
  body.className = "recent-reads-panel__body";

  const heading = document.createElement("span");
  heading.className = "recent-reads-panel__title";
  heading.textContent = title;

  body.append(heading);
  media.append(image);
  link.append(media, body);
  item.append(link);

  return item;
};

export const initRecentReadsPanels = (): void => {
  const panels = document.querySelectorAll("[data-recent-reads='true']");

  panels.forEach((panel) => {
    if (!(panel instanceof HTMLElement) || panel.dataset.initialized === "true") {
      return;
    }

    panel.dataset.initialized = "true";

    const storageKey = panel.dataset.storageKey || "";
    const fallbackImage = panel.dataset.fallbackImage || DEFAULT_FALLBACK_IMAGE;
    const maxItems = Number.parseInt(panel.dataset.maxItems || "3", 10);
    const listContainer = panel.querySelector("[data-role='container']");
    const list = panel.querySelector("[data-role='list']");
    const emptyState = panel.querySelector("[data-role='empty']");
    const status = panel.querySelector("[data-role='status']");

    if (
      !(listContainer instanceof HTMLElement) ||
      !(list instanceof HTMLElement) ||
      !(emptyState instanceof HTMLElement) ||
      !(status instanceof HTMLElement)
    ) {
      return;
    }

    list.textContent = "";
    const items = loadRecentItems(storageKey).slice(0, Math.max(1, maxItems));
    const fragment = document.createDocumentFragment();

    if (!items.length) {
      listContainer.hidden = true;
      emptyState.hidden = false;
      status.textContent = "No recent guides yet.";
      return;
    }

    items.forEach((item) => {
      const normalizedSlug = normalizeRecentItemSlug(item.slug);
      const resolvedImage =
        (typeof item.image === "string" && item.image.trim() ? item.image.trim() : "") ||
        fallbackImage;

      fragment.append(
        createRecentReadItem(item.title, `/knowledge/${normalizedSlug}`, resolvedImage)
      );
    });

    list.append(fragment);

    emptyState.hidden = true;
    listContainer.hidden = false;
    status.textContent = `Showing ${items.length} recent guides.`;
  });
};
