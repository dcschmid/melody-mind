import {
  ALBUM_FAVORITES_CHANGED_EVENT,
  ALBUM_FAVORITES_STORAGE_KEY,
  bindAlbumFavoriteToggles,
  readAlbumFavorites,
} from "./album-favorites";

interface FavoritesCatalogEntry {
  title: string;
  url: string;
  genre?: string;
  trackCount: number;
  coverImagePath: string;
}

type FavoritesCatalog = Record<string, FavoritesCatalogEntry>;

const FAVORITES_DATA_URL = "/favorites-data.json";
const PLAYER_QUEUE_URL = "/player-queues.json";
const HEART_FILLED_PATH =
  "M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033l.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185l-.048.041l-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082l-7.493-7.422A6 6 0 0 1 6.979 3.074";
const PLAY_FILLED_PATH =
  "M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4";

const createIcon = (pathData: string, className: string): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add(className);

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("d", pathData);
  svg.append(path);

  return svg;
};

const createFavoriteCard = (
  albumId: string,
  album: FavoritesCatalogEntry
): HTMLLIElement => {
  const item = document.createElement("li");
  item.className = "favorites-page__item";

  const article = document.createElement("article");
  article.className = "favorites-page__album";

  const coverLink = document.createElement("a");
  coverLink.className = "favorites-page__cover-link";
  coverLink.href = album.url;
  coverLink.setAttribute("aria-label", `Open album ${album.title}`);

  const cover = document.createElement("img");
  cover.className = "favorites-page__cover";
  cover.src = album.coverImagePath;
  cover.alt = `Cover art for the album ${album.title}`;
  cover.width = 480;
  cover.height = 480;
  cover.loading = "lazy";
  cover.decoding = "async";
  coverLink.append(cover);

  const copy = document.createElement("div");
  copy.className = "favorites-page__copy";

  const heading = document.createElement("h2");
  heading.className = "favorites-page__card-title";
  const titleLink = document.createElement("a");
  titleLink.href = album.url;
  titleLink.textContent = album.title;
  heading.append(titleLink);

  const footer = document.createElement("div");
  footer.className = "favorites-page__footer";

  const meta = document.createElement("p");
  meta.className = "favorites-page__meta";
  if (album.genre) {
    const genre = document.createElement("span");
    genre.textContent = album.genre;
    meta.append(genre);
  }
  const tracks = document.createElement("span");
  tracks.textContent = `${album.trackCount} ${album.trackCount === 1 ? "track" : "tracks"}`;
  meta.append(tracks);

  const playButton = document.createElement("button");
  playButton.type = "button";
  playButton.className = "favorites-page__play";
  playButton.dataset.playerLoad = "";
  playButton.dataset.playerAlbumId = albumId;
  playButton.dataset.playerAlbumTitle = album.title;
  playButton.dataset.playerQueueUrl = PLAYER_QUEUE_URL;
  playButton.setAttribute("aria-label", `Play album ${album.title}`);
  playButton.append(createIcon(PLAY_FILLED_PATH, "favorites-page__play-icon"));

  const favoriteButton = document.createElement("button");
  favoriteButton.type = "button";
  favoriteButton.className = "favorites-page__favorite";
  favoriteButton.dataset.albumFavoriteToggle = albumId;
  favoriteButton.setAttribute("aria-pressed", "true");
  const favoriteLabel = document.createElement("span");
  favoriteLabel.className = "sr-only";
  favoriteLabel.setAttribute("data-album-favorite-label", "");
  favoriteLabel.textContent = "Remove from favorites";
  favoriteButton.append(
    createIcon(HEART_FILLED_PATH, "favorites-page__favorite-icon"),
    favoriteLabel
  );

  footer.append(meta, playButton, favoriteButton);
  copy.append(heading, footer);
  article.append(coverLink, copy);
  item.append(article);

  return item;
};

const isCatalogEntry = (value: unknown): value is FavoritesCatalogEntry => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<FavoritesCatalogEntry>;
  return (
    typeof entry.title === "string" &&
    typeof entry.url === "string" &&
    typeof entry.trackCount === "number" &&
    typeof entry.coverImagePath === "string" &&
    (entry.genre === undefined || typeof entry.genre === "string")
  );
};

const parseCatalog = (payload: unknown): FavoritesCatalog => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(payload as Record<string, unknown>).filter(([, value]) =>
      isCatalogEntry(value)
    )
  ) as FavoritesCatalog;
};

const bindFavoritesPage = (): void => {
  const root = document.querySelector<HTMLElement>("[data-favorites-root]");
  const list = document.querySelector<HTMLUListElement>("[data-favorites-list]");
  const empty = document.querySelector<HTMLElement>("[data-favorites-empty]");
  const status = document.querySelector<HTMLElement>("[data-favorites-status]");
  const loading = document.querySelector<HTMLElement>("[data-favorites-loading]");
  const error = document.querySelector<HTMLElement>("[data-favorites-error]");

  if (!root || !list || !empty || !status || !loading || !error) {
    return;
  }
  if (root.dataset.bound === "true") {
    return;
  }
  root.dataset.bound = "true";
  const controller = new AbortController();
  const { signal } = controller;

  let catalog: FavoritesCatalog | null = null;

  const render = (): void => {
    const currentCatalog = catalog;
    if (!currentCatalog) {
      return;
    }

    const favoriteAlbums = readAlbumFavorites().flatMap((albumId) => {
      const album = currentCatalog[albumId];
      return album ? [{ albumId, album }] : [];
    });
    list.replaceChildren(
      ...favoriteAlbums.map(({ albumId, album }) => createFavoriteCard(albumId, album))
    );
    empty.hidden = favoriteAlbums.length > 0;
    status.textContent = `${favoriteAlbums.length} ${favoriteAlbums.length === 1 ? "album" : "albums"} saved`;
    bindAlbumFavoriteToggles();
  };

  window.addEventListener(ALBUM_FAVORITES_CHANGED_EVENT, render, { signal });
  window.addEventListener(
    "storage",
    (event) => {
      if (event.key === ALBUM_FAVORITES_STORAGE_KEY) {
        render();
      }
    },
    { signal }
  );
  document.addEventListener("astro:before-preparation", () => controller.abort(), {
    once: true,
    signal,
  });

  loading.hidden = false;
  fetch(FAVORITES_DATA_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Favorites catalog request failed with HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((payload: unknown) => {
      catalog = parseCatalog(payload);
      loading.hidden = true;
      status.hidden = false;
      render();
    })
    .catch(() => {
      loading.hidden = true;
      error.hidden = false;
    });
};

bindFavoritesPage();
document.addEventListener("astro:page-load", bindFavoritesPage);
