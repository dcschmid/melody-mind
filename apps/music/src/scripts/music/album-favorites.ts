import {
  parseAlbumFavorites,
  serializeAlbumFavorites,
  toggleAlbumFavorite,
} from "../../utils/bookmarks/albumFavorites";

export const ALBUM_FAVORITES_STORAGE_KEY = "melodymind:music-favorites:v1";
export const ALBUM_FAVORITES_CHANGED_EVENT = "melodymind:favorites-changed";

export interface AlbumFavoritesChangedDetail {
  albumId: string;
  isFavorite: boolean;
  albumIds: string[];
}

const TOGGLE_SELECTOR = "[data-album-favorite-toggle]";
const LABEL_SELECTOR = "[data-album-favorite-label]";
const ADD_LABEL = "Add to favorites";
const REMOVE_LABEL = "Remove from favorites";

// Keeps toggles usable for the current page when storage access is blocked.
let memoryFallback: string[] | null = null;

export const readAlbumFavorites = (): string[] => {
  if (memoryFallback) {
    return memoryFallback;
  }

  try {
    return parseAlbumFavorites(window.localStorage.getItem(ALBUM_FAVORITES_STORAGE_KEY));
  } catch {
    return memoryFallback ?? [];
  }
};

const writeAlbumFavorites = (albumIds: string[]): void => {
  try {
    window.localStorage.setItem(
      ALBUM_FAVORITES_STORAGE_KEY,
      serializeAlbumFavorites(albumIds)
    );
    memoryFallback = null;
  } catch {
    memoryFallback = albumIds;
  }
};

const applyToggleState = (button: HTMLElement, isFavorite: boolean): void => {
  button.setAttribute("aria-pressed", String(isFavorite));
  const label = button.querySelector<HTMLElement>(LABEL_SELECTOR);
  if (label) {
    label.textContent = isFavorite ? REMOVE_LABEL : ADD_LABEL;
  }
};

const syncFavoriteToggles = (albumIds: string[]): void => {
  document.querySelectorAll<HTMLElement>(TOGGLE_SELECTOR).forEach((button) => {
    const albumId = button.dataset.albumFavoriteToggle;
    if (!albumId) {
      return;
    }
    applyToggleState(button, albumIds.includes(albumId));
  });
};

const dispatchFavoritesChanged = (detail: AlbumFavoritesChangedDetail): void => {
  window.dispatchEvent(
    new CustomEvent<AlbumFavoritesChangedDetail>(ALBUM_FAVORITES_CHANGED_EVENT, {
      detail,
    })
  );
};

export const bindAlbumFavoriteToggles = (): void => {
  document.querySelectorAll<HTMLElement>(TOGGLE_SELECTOR).forEach((button) => {
    if (button.dataset.bound === "true") {
      return;
    }
    button.dataset.bound = "true";

    button.addEventListener("click", () => {
      const albumId = button.dataset.albumFavoriteToggle;
      if (!albumId) {
        return;
      }

      const albumIds = toggleAlbumFavorite(readAlbumFavorites(), albumId);
      writeAlbumFavorites(albumIds);
      syncFavoriteToggles(albumIds);
      dispatchFavoritesChanged({
        albumId,
        isFavorite: albumIds.includes(albumId),
        albumIds,
      });
    });
  });

  syncFavoriteToggles(readAlbumFavorites());
};

window.addEventListener("storage", (event) => {
  if (event.key !== ALBUM_FAVORITES_STORAGE_KEY) {
    return;
  }
  syncFavoriteToggles(parseAlbumFavorites(event.newValue));
});

bindAlbumFavoriteToggles();
document.addEventListener("astro:page-load", bindAlbumFavoriteToggles);
