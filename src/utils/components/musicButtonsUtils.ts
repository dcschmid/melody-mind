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
   * Initialize the MusicButtonsUtils instance.
   * Attaches event handlers to the configured links.
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
      const externalLabel = link.dataset.externalLabel;

      // Priority: music platform links (platform + playlistTitle)
      if (platform && playlistTitle && this.isFathomAvailable()) {
        this.trackEvents(platform, playlistTitle);
        return;
      }

      // Generic external links (e.g. footer, donations, news). Use externalLabel when available,
      // otherwise fall back to hostname derived from href.
      if (this.isFathomAvailable()) {
        const href = (link as HTMLAnchorElement).href || "";
        const label = externalLabel || this.extractHostname(href) || "external";
        this.trackExternal(label, playlistTitle);
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
   * Track generic external link clicks.
   * Emits two events: a general "external_link_click" and a specific one with the label.
   */
  private trackExternal(label: string, contextTitle?: string | undefined): void {
    try {
      const sanitizedLabel = label.replace(/[^a-zA-Z0-9_]/g, "_");
      const generalEvent = `external_link_click`;
      const specificEvent = contextTitle
        ? `external_${sanitizedLabel}_${contextTitle}`.replace(/[^a-zA-Z0-9_]/g, "_")
        : `external_${sanitizedLabel}`;

      const fathom = getFathom();
      fathom?.trackEvent?.(generalEvent);
      fathom?.trackEvent?.(specificEvent);
    } catch (error) {
      handleGameError(error, "analytics external event tracking");
    }
  }

  /**
   * Extract hostname from a URL string safely.
   */
  private extractHostname(href: string): string | null {
    try {
      if (!href) {
        return null;
      }
      const u = new URL(href);
      return u.hostname.replace(/\./g, "_");
    } catch {
      return null;
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
