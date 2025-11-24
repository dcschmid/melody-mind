/**
 * PlaylistCard Utilities
 *
 * Centralized utilities for managing playlist card functionality.
 * Eliminates code duplication in component script tags.
 */

import { safeQuerySelectorAll, safeQuerySelector } from "../dom/domUtils";

// Extended image element to store internal handler reference
interface PlaylistImageElement extends HTMLImageElement {
  __playlistCardErrorHandler?: () => void;
}

/**
 * PlaylistCard configuration interface
 */
interface PlaylistCardConfig {
  cardSelector: string;
  imageSelector: string;
  fallbackImageSrc: string;
}

/**
 * PlaylistCard utility class
 */
export class PlaylistCardUtils {
  private cards: HTMLElement[];
  private imageSelector: string;
  private fallbackImageSrc: string;

  /**
   * Initialize playlist card utilities and bind event handlers.
   */
  constructor(config: PlaylistCardConfig) {
    this.cards = safeQuerySelectorAll<HTMLElement>(config.cardSelector);
    this.imageSelector = config.imageSelector;
    this.fallbackImageSrc = config.fallbackImageSrc;

    this.init();
  }

  /**
   * Initialize playlist card utilities and bind event handlers.
   *
   * @param {PlaylistCardConfig} config - Configuration for playlist cards
   */

  /**
   * Initialize playlist card functionality
   */
  private init(): void {
    if (this.cards.length === 0) {
      return;
    }

    // Setup image error handling for all cards
    this.cards.forEach((card) => {
      this.setupImageFallback(card);
    });
  }

  /**
   * Setup image fallback for a card
   */
  private setupImageFallback(card: HTMLElement): void {
    const image = safeQuerySelector<HTMLImageElement>(this.imageSelector, card);

    if (image) {
      // Store a stable handler reference so it can be removed later
      const handler = (): void => this.handleImageError(image);
      // Attach using a named function reference on the element to allow removal later
      (image as PlaylistImageElement).__playlistCardErrorHandler = handler;
      image.addEventListener("error", handler);
    }
  }

  /**
   * Handle image loading errors
   */
  private handleImageError(image: HTMLImageElement): void {
    // Only set fallback if current src is not already the fallback
    if (image.src !== this.fallbackImageSrc) {
      image.src = this.fallbackImageSrc;
      image.alt = "Default playlist cover";
    }
  }

  /**
   * Get all playlist cards
   */
  public getCards(): HTMLElement[] {
    return this.cards;
  }

  /**
   * Get card count
   */
  public getCardCount(): number {
    return this.cards.length;
  }

  /**
   * Get card by index
   */
  public getCard(index: number): HTMLElement | null {
    return this.cards[index] || null;
  }

  /**
   * Check if a card has streaming links
   */
  public hasStreamingLinks(card: HTMLElement): boolean {
    const musicButtons = safeQuerySelector(".music-platform-link", card);
    return Boolean(musicButtons);
  }

  /**
   * Get card genre/decade
   */
  public getCardGenre(card: HTMLElement): string | null {
    return card.dataset.genre || null;
  }

  /**
   * Filter cards by genre
   */
  public filterByGenre(genre: string): HTMLElement[] {
    return this.cards.filter((card) => {
      const cardGenre = this.getCardGenre(card);
      return genre === "all" || cardGenre === genre;
    });
  }

  /**
   * Show/hide cards based on filter
   */
  public applyGenreFilter(genre: string): void {
    this.cards.forEach((card) => {
      const shouldShow = genre === "all" || this.getCardGenre(card) === genre;

      card.style.display = shouldShow ? "" : "none";
      card.setAttribute("aria-hidden", (!shouldShow).toString());
    });
  }

  /**
   * Refresh image fallbacks (useful after dynamic content updates)
   */
  public refreshImageFallbacks(): void {
    this.cards.forEach((card) => {
      this.setupImageFallback(card);
    });
  }

  /**
   * Destroy event listeners
   */
  public destroy(): void {
    this.cards.forEach((card) => {
      const image = safeQuerySelector<HTMLImageElement>(
        this.imageSelector,
        card,
      );
      if (image) {
        const handler = (image as PlaylistImageElement)
          .__playlistCardErrorHandler;
        if (typeof handler === "function") {
          image.removeEventListener("error", handler);
          try {
            delete (image as PlaylistImageElement).__playlistCardErrorHandler;
          } catch {
            // ignore in older browsers
          }
        }
      }
    });
  }
}

/**
 * Initialize playlist card functionality
 */
export function initPlaylistCards(
  config: PlaylistCardConfig,
): PlaylistCardUtils {
  return new PlaylistCardUtils(config);
}

/**
 * Default playlist card initialization
 */
export function initDefaultPlaylistCards(): PlaylistCardUtils {
  return initPlaylistCards({
    cardSelector: ".playlist-card",
    imageSelector: "img",
    fallbackImageSrc: "/default-cover.jpg",
  });
}

/**
 * Auto-detect and initialize playlist cards automatically.
 * @returns {PlaylistCardUtils | null} initialized utils or null if no playlist cards found
 */

/**
 * Auto-detect and initialize playlist cards
 */
export function initPlaylistCardsAuto(): PlaylistCardUtils | null {
  // Try different selectors to find playlist cards
  const selectors = [
    ".playlist-card",
    "[data-content-type='playlist']",
    "[itemtype*='MusicPlaylist']",
    "article[data-personalization='music-card']",
  ];

  for (const selector of selectors) {
    const cards = safeQuerySelectorAll(selector);
    if (cards.length > 0) {
      return initPlaylistCards({
        cardSelector: selector,
        imageSelector: "img",
        fallbackImageSrc: "/default-cover.jpg",
      });
    }
  }

  return null;
}
