/**
 * MusicButtons Utilities
 *
 * Centralized utilities for managing music platform button functionality.
 * Eliminates code duplication in component script tags.
 */

import { safeQuerySelectorAll } from "../dom/domUtils";
import { handleGameError } from "../error/errorHandlingUtils";

/**
 * MusicButtons configuration interface
 */
interface MusicButtonsConfig {
  linkSelector: string;
}

// Helper to access optional global 'fathom' in a typed way without duplicate global declarations
function getFathom(): { trackEvent?: (eventName: string) => void } | undefined {
  return (globalThis as unknown as { fathom?: { trackEvent?: (n: string) => void } }).fathom;
}

/**
 * MusicButtons utility class
 */
export class MusicButtonsUtils {
  private links: HTMLElement[];

  /**
   *
   */
  constructor(config: MusicButtonsConfig) {
    this.links = safeQuerySelectorAll<HTMLElement>(config.linkSelector);

    this.init();
  }

  /**
   * Initialize music buttons functionality
   */
  private init(): void {
    if (this.links.length === 0) {
      return;
    }

    // Add click event listeners to all music platform links
    this.links.forEach((link) => {
      link.addEventListener("click", () => this.handleClick(link));
    });
  }

  /**
   * Handle click events for tracking
   */
  private handleClick(link: HTMLElement): void {
    try {
      const platform = link.dataset.platform;
      const playlistTitle = link.dataset.playlistTitle;

      if (platform && playlistTitle && this.isFathomAvailable()) {
        this.trackEvents(platform, playlistTitle);
      }
    } catch (error) {
      handleGameError(error, "music platform click tracking");
    }
  }

  /**
   * Check if Fathom analytics is available
   */
  /** Check if Fathom analytics is available */
  private isFathomAvailable(): boolean {
    const fathom = getFathom();
    return typeof fathom === "object" && typeof fathom.trackEvent === "function";
  }

  /**
   * Track events with Fathom analytics
   */
  private trackEvents(platform: string, playlistTitle: string): void {
    try {
      const generalEvent = `music_${platform}_click`;
      const specificEvent = `music_${platform}_${playlistTitle}`.replace(/[^a-zA-Z0-9_]/g, "_");

  const fathom = getFathom();
  fathom?.trackEvent?.(generalEvent);
  fathom?.trackEvent?.(specificEvent);
    } catch (error) {
      handleGameError(error, "analytics event tracking");
    }
  }

  /**
   * Get all tracked platforms
   */
  public getTrackedPlatforms(): string[] {
    return this.links
      .map((link) => link.dataset.platform)
      .filter((platform): platform is string => Boolean(platform));
  }

  /**
   * Get link count by platform
   */
  public getLinkCount(): number {
    return this.links.length;
  }

  /**
   * Check if a specific platform is available
   */
  public hasPlatform(platform: string): boolean {
    return this.links.some((link) => link.dataset.platform === platform);
  }

  /**
   * Destroy event listeners
   */
  public destroy(): void {
    this.links.forEach((link) => {
      link.removeEventListener("click", () => this.handleClick(link));
    });
  }
}

/**
 * Initialize music buttons functionality
 */
export function initMusicButtons(config: MusicButtonsConfig): MusicButtonsUtils {
  return new MusicButtonsUtils(config);
}

/**
 * Default music buttons initialization
 */
export function initDefaultMusicButtons(): MusicButtonsUtils {
  return initMusicButtons({
    linkSelector: ".music-platform-link",
  });
}
