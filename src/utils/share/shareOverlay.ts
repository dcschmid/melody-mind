import { safeGetElementById, safeQuerySelectorAll } from "../dom/domUtils";

/**
 * ShareOverlay Utility - Performance-optimized sharing functionality
 *
 * Extracted script logic for better code splitting and reusability.
 * This module manages sharing game results via multiple methods while ensuring
 * high performance and full accessibility compliance (WCAG AAA).
 *
 * @module ShareOverlayUtil
 */


import { shareScore } from "./shareUtils";
import type { ShareData } from "./shareUtils";


/**
 * Store Element References
 * Cached DOM references to improve performance and prevent repeated DOM queries
 */
interface ElementRefs {
  nativeShareButton: HTMLButtonElement | null;
  copyButton: HTMLButtonElement | null;
  copyButtonText: HTMLElement | null;
  statusAnnouncer: HTMLElement | null;
  shareButtons: NodeListOf<HTMLButtonElement> | null;
}

/**
 * Constants for UI interactions
 */
const UI_CONSTANTS = {
  COPY_SUCCESS_DURATION: 2000,
  COPY_ORIGINAL_TEXT: "",
  ANIMATION_DURATION: 200,
} as const;

/**
 * ShareOverlay Class - Encapsulated sharing functionality
 */
export class ShareOverlayManager {
  private elements: ElementRefs = {
    nativeShareButton: null,
    copyButton: null,
    copyButtonText: null,
    statusAnnouncer: null,
    shareButtons: null,
  };

  private abortController: AbortController | null = null;
  private copyOriginalText: string = "";

  /**
   * Initialize the sharing functionality
   */
  public initialize(): void {
    this.setupAbortController();
    this.cacheElements();

    // Store original copy button text
    const originalText = this.elements.copyButtonText?.textContent || "";
    this.copyOriginalText = originalText;

    // Set up individual sharing methods
    this.initializeNativeSharing();
    this.initializeClipboardCopy();
    this.initializePlatformSharing();
  }

  /**
   * Setup AbortController for cleanup
   */
  private setupAbortController(): void {
    this.abortController = new AbortController();

    // Cleanup on page navigation
    document.addEventListener("astro:before-swap", () => this.cleanup(), {
      signal: this.abortController.signal,
    });
  }

  /**
   * Cache DOM elements to improve performance
   */
  private cacheElements(): void {
    this.elements.nativeShareButton = safeGetElementById<HTMLButtonElement>("native-share-button");
    this.elements.copyButton = safeGetElementById<HTMLButtonElement>("copy-share-button");
    this.elements.copyButtonText = safeGetElementById("copy-button-text");
    this.elements.statusAnnouncer = safeGetElementById("share-status-announcer");
    this.elements.shareButtons = safeQuerySelectorAll<HTMLButtonElement>("[data-share]");
  }

  /**
   * Initialize native Web Share API
   */
  private initializeNativeSharing(): void {
    const nativeShareSupported = "share" in navigator;

    if (!nativeShareSupported || !this.elements.nativeShareButton) {
      return;
    }

    // Show the native share button
    this.elements.nativeShareButton.classList.remove("share-overlay__button--hidden");
    this.elements.nativeShareButton.classList.add("share-overlay__button--visible");

    // Add click handler with proper cleanup
    this.elements.nativeShareButton.addEventListener("click", this.handleNativeShare.bind(this), {
      signal: this.abortController?.signal,
    });
  }

  /**
   * Handle native share button click
   */
  private async handleNativeShare(event: Event): Promise<void> {
    const button = event.currentTarget as HTMLButtonElement;

    if (button.hasAttribute("disabled")) {
      return;
    }

    button.setAttribute("disabled", "disabled");

    try {
      const gameData = this.getGameDataFromPopup();
      if (!gameData) {
        this.announceToScreenReader("Unable to share. Game data not found.");
        return;
      }

      const shareText = await this.generateShareTextFromUtils(gameData);
      await navigator.share({
        title: "Melody Mind Music Quiz",
        text: shareText.split("\n\n").slice(0, -1).join("\n\n"),
        url: window.location.href,
      });

      this.announceToScreenReader("Successfully shared your score.");
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        this.announceToScreenReader("Sharing failed. Please try another method.");
      }
    } finally {
      button.removeAttribute("disabled");
    }
  }

  /**
   * Initialize platform-specific sharing
   */
  private initializePlatformSharing(): void {
    if (!this.elements.shareButtons?.length) {
      return;
    }

    // Use event delegation with AbortController
    document.addEventListener("click", this.handlePlatformShare.bind(this), {
      signal: this.abortController?.signal,
    });
  }

  /**
   * Handle platform share button clicks
   */
  private handlePlatformShare(event: Event): void {
    const target = event.target as HTMLElement;
    const button = target.closest("[data-share]") as HTMLButtonElement;

    if (!button) {
      return;
    }

    event.preventDefault();

    const platform = button.getAttribute("data-share");
    if (!platform) {
      return;
    }

    const gameData = this.getGameDataFromPopup();
    if (!gameData) {
      this.announceToScreenReader("Unable to share. Game data not found.");
      return;
    }

    try {
      shareScore(platform, gameData);
      this.announceToScreenReader(`Opened ${platform} sharing.`);
    } catch (err) {
      this.announceToScreenReader(`Failed to share to ${platform}.`);
    }
  }

  /**
   * Initialize clipboard copy functionality
   */
  private initializeClipboardCopy(): void {
    if (!this.elements.copyButton || !this.elements.copyButtonText) {
      return;
    }

    this.elements.copyButton.addEventListener("click", this.handleClipboardCopy.bind(this), {
      signal: this.abortController?.signal,
    });
  }

  /**
   * Handle clipboard copy button click
   */
  private async handleClipboardCopy(event: Event): Promise<void> {
    const button = event.currentTarget as HTMLButtonElement;

    if (button.hasAttribute("disabled")) {
      return;
    }

    button.setAttribute("disabled", "disabled");

    try {
      const gameData = this.getGameDataFromPopup();
      if (!gameData) {
        this.announceToScreenReader("Unable to copy. Game data not found.");
        return;
      }

      const shareText = await this.generateShareTextFromUtils(gameData);
      const shareUrl = window.location.href;
      const fullText = `${shareText}\n\n${shareUrl}`;

      await navigator.clipboard.writeText(fullText);

      // Show success state
      if (this.elements.copyButtonText) {
        this.elements.copyButtonText.textContent = "✓ Copied!";
      }
      button.classList.add("share-overlay__clipboard-button--success");

      this.announceToScreenReader("Score copied to clipboard successfully!");

      // Reset after delay
      setTimeout(() => {
        if (this.elements.copyButtonText) {
          this.elements.copyButtonText.textContent = this.copyOriginalText;
        }
        button.classList.remove("share-overlay__clipboard-button--success");
        button.removeAttribute("disabled");
      }, UI_CONSTANTS.COPY_SUCCESS_DURATION);
    } catch (err) {

      if (this.elements.copyButtonText) {
        this.elements.copyButtonText.textContent = "Copy failed";
      }

      this.announceToScreenReader("Failed to copy score to clipboard.");

      setTimeout(() => {
        if (this.elements.copyButtonText) {
          this.elements.copyButtonText.textContent = this.copyOriginalText;
        }
        button.removeAttribute("disabled");
      }, UI_CONSTANTS.COPY_SUCCESS_DURATION / 2);
    }
  }

  /**
   * Announce messages to screen readers
   */
  private announceToScreenReader(message: string): void {
    if (!this.elements.statusAnnouncer) {
      return;
    }

    this.elements.statusAnnouncer.textContent = message;

    setTimeout(() => {
      if (this.elements.statusAnnouncer) {
        this.elements.statusAnnouncer.textContent = "";
      }
    }, 5000);
  }

  /**
   * Extract game data from popup element
   */
  private getGameDataFromPopup(): ShareData | null {
    const popup = document.querySelector("#endgame-popup");
    if (!popup) {
      return null;
    }

    return {
      score: parseInt(popup.getAttribute("data-score") || "0"),
      category: popup.getAttribute("data-category") || "",
      difficulty: popup.getAttribute("data-difficulty") || "",
    };
  }

  /**
   * Generate share text using utility function
   */
  private async generateShareTextFromUtils(data: ShareData): Promise<string> {
    let shareText = "";

    const originalWindowOpen = window.open;
    window.open = function (url) {
      if (!url) {
        return null;
      }
      const textMatch = decodeURIComponent(url.toString()).match(/text=([^&]+)/);
      if (textMatch && textMatch[1]) {
        shareText = textMatch[1].replace(/\+/g, " ");
      }
      return null;
    };

    const originalConsoleWarn = console.warn;
    console.warn = () => {};

    await shareScore("twitter", data);

    window.open = originalWindowOpen;
    console.warn = originalConsoleWarn;

    return shareText;
  }

  /**
   * Cleanup function to prevent memory leaks
   */
  public cleanup(): void {
    if (this.abortController) {
      this.abortController.abort();
    }

    // Clear references
    Object.keys(this.elements).forEach((key) => {
      (this.elements as Record<string, HTMLElement | null>)[key] = null;
    });
  }
}

/**
 * Initialize sharing functionality
 */
export function initializeShareOverlay(): ShareOverlayManager {
  const manager = new ShareOverlayManager();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => manager.initialize());
  } else {
    manager.initialize();
  }

  return manager;
}
