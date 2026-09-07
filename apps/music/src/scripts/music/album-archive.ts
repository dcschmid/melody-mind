import {
  filterAlbumSearchRecords,
  paginateAlbumSearchRecords,
  type AlbumSearchRecord,
} from "../../utils/albumSearch";

let albumSearchRecordsPromise: Promise<AlbumSearchRecord[]> | undefined;

const fetchAlbumSearchRecords = async (): Promise<AlbumSearchRecord[]> => {
  const response = await fetch("/album-search-index.json");
  if (!response.ok) {
    throw new Error(`Album search index returned ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new TypeError("Album search index must be an array.");
  }
  return payload as AlbumSearchRecord[];
};

const loadAlbumSearchRecords = () => {
  albumSearchRecordsPromise ??= fetchAlbumSearchRecords();
  return albumSearchRecordsPromise;
};

const initializeAlbumArchiveSearch = () => {
  document.querySelectorAll<HTMLElement>("[data-album-archive]").forEach((root) => {
    if (root.dataset.albumArchiveReady === "true") {
      return;
    }

    const controls = root.querySelector<HTMLElement>("[data-album-archive-controls]");
    const form = root.querySelector<HTMLFormElement>("[data-album-search-form]");
    const input = root.querySelector<HTMLInputElement>("[data-album-search-input]");
    const clear = root.querySelector<HTMLButtonElement>("[data-album-search-clear]");
    const status = root.querySelector<HTMLElement>("[data-album-search-status]");
    const archiveGrid = root.querySelector<HTMLElement>("[data-album-archive-grid]");
    const archivePagination = root.querySelector<HTMLElement>(
      "[data-album-archive-pagination]"
    );
    const results = root.querySelector<HTMLOListElement>("[data-album-search-results]");
    const template = root.querySelector<HTMLTemplateElement>(
      "[data-album-search-result-template]"
    );
    const resultPages = root.querySelector<HTMLElement>(
      "[data-album-search-result-pages]"
    );
    const resultPage = root.querySelector<HTMLElement>("[data-album-search-result-page]");
    const previous = root.querySelector<HTMLButtonElement>(
      "[data-album-search-previous]"
    );
    const next = root.querySelector<HTMLButtonElement>("[data-album-search-next]");
    const resultsPageSize = Number.parseInt(root.dataset.albumPageSize ?? "", 10);

    if (
      !controls ||
      !form ||
      !input ||
      !clear ||
      !status ||
      !archiveGrid ||
      !archivePagination ||
      !results ||
      !template ||
      !resultPages ||
      !resultPage ||
      !previous ||
      !next ||
      !Number.isInteger(resultsPageSize) ||
      resultsPageSize <= 0
    ) {
      return;
    }

    root.dataset.albumArchiveReady = "true";
    const defaultStatus = status.textContent?.trim() ?? "Search the full album archive.";
    let requestedResultPage = 1;
    let debounceTimer = 0;

    const readState = () => {
      const params = new URL(window.location.href).searchParams;
      input.value = params.get("filter") ?? "";
      requestedResultPage = Number.parseInt(params.get("resultsPage") ?? "1", 10) || 1;
    };

    const writeState = (page: number, lastPage: number) => {
      const url = new URL(window.location.href);
      const filter = input.value.trim();
      filter ? url.searchParams.set("filter", filter) : url.searchParams.delete("filter");
      if (lastPage > 1 && page > 1) {
        url.searchParams.set("resultsPage", String(page));
      } else {
        url.searchParams.delete("resultsPage");
      }
      window.history.replaceState({}, "", url);
    };

    const setOptionalText = (element: HTMLElement, value: string | undefined) => {
      element.textContent = value ?? "";
      element.hidden = !value;
    };

    const createResult = (record: AlbumSearchRecord) => {
      const item = template.content.firstElementChild?.cloneNode(true);
      if (!(item instanceof HTMLElement)) {
        return undefined;
      }

      const links = item.querySelectorAll<HTMLAnchorElement>(
        "[data-album-search-result-link], [data-album-search-result-title]"
      );
      links.forEach((link) => {
        link.href = record.url;
      });

      const image = item.querySelector<HTMLImageElement>(
        "[data-album-search-result-image]"
      );
      const title = item.querySelector<HTMLElement>("[data-album-search-result-title]");
      const description = item.querySelector<HTMLElement>(
        "[data-album-search-result-description]"
      );
      const genre = item.querySelector<HTMLElement>("[data-album-search-result-genre]");
      const tracks = item.querySelector<HTMLElement>("[data-album-search-result-tracks]");
      const series = item.querySelector<HTMLElement>("[data-album-search-result-series]");
      if (!image || !title || !description || !genre || !tracks || !series) {
        return undefined;
      }

      image.src = record.imageSrc;
      image.alt = `Cover art for the album ${record.title}`;
      title.textContent = record.title;
      description.textContent = record.description;
      setOptionalText(genre, record.genre);
      tracks.textContent = `${record.trackCount} ${record.trackCount === 1 ? "track" : "tracks"}`;
      setOptionalText(series, record.seriesTitle);
      return item;
    };

    const restoreArchive = (updateUrl = true) => {
      archiveGrid.hidden = false;
      archivePagination.hidden = false;
      results.hidden = true;
      results.replaceChildren();
      resultPages.hidden = true;
      clear.hidden = true;
      status.textContent = defaultStatus;
      requestedResultPage = 1;
      if (updateUrl) {
        writeState(1, 1);
      }
    };

    const showSearchFailure = () => {
      root.removeAttribute("aria-busy");
      archiveGrid.hidden = false;
      archivePagination.hidden = false;
      results.hidden = true;
      results.replaceChildren();
      resultPages.hidden = true;
      status.textContent =
        "Search is temporarily unavailable. The paginated archive remains below.";
    };

    const render = async (updateUrl = true) => {
      const filter = input.value.trim();
      if (!filter) {
        restoreArchive(updateUrl);
        return;
      }

      clear.hidden = false;
      status.textContent = "Searching the album archive…";
      root.setAttribute("aria-busy", "true");
      try {
        const records = await loadAlbumSearchRecords();
        const matches = filterAlbumSearchRecords(records, filter);
        const page = paginateAlbumSearchRecords(
          matches,
          requestedResultPage,
          resultsPageSize
        );
        requestedResultPage = page.currentPage;
        results.replaceChildren(
          ...page.data
            .map((record) => createResult(record))
            .filter((item): item is HTMLElement => Boolean(item))
        );
        root.removeAttribute("aria-busy");
        archiveGrid.hidden = true;
        archivePagination.hidden = true;
        results.hidden = page.total === 0;
        resultPages.hidden = page.lastPage <= 1 || page.total === 0;
        previous.disabled = page.currentPage === 1;
        next.disabled = page.currentPage === page.lastPage;
        resultPage.textContent = `Page ${page.currentPage} of ${page.lastPage}`;
        status.textContent =
          page.total === 0
            ? "No albums match this filter."
            : `Showing ${page.start}–${page.end} of ${page.total} matching albums.`;
        if (updateUrl) {
          writeState(page.currentPage, page.lastPage);
        }
      } catch {
        showSearchFailure();
      }
    };

    const resetResultPageAndRender = () => {
      requestedResultPage = 1;
      void render();
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      resetResultPageAndRender();
    });
    input.addEventListener("input", () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(resetResultPageAndRender, 180);
    });
    clear.addEventListener("click", () => {
      input.value = "";
      restoreArchive();
      input.focus();
    });
    previous.addEventListener("click", () => {
      requestedResultPage -= 1;
      void render();
    });
    next.addEventListener("click", () => {
      requestedResultPage += 1;
      void render();
    });
    window.addEventListener("popstate", () => {
      readState();
      void render(false);
    });

    readState();
    controls.hidden = false;
    if (input.value.trim()) {
      void render(false);
    }
  });
};

initializeAlbumArchiveSearch();
document.addEventListener("astro:page-load", initializeAlbumArchiveSearch);
