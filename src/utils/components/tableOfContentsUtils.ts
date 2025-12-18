/**
 * TableOfContents Utilities
 *
 * Centralized utilities for managing table of contents functionality.
 * Eliminates code duplication in component script tags.
 */

import { safeGetElementById } from "../dom/domUtils";

/**
 * TableOfContents configuration interface
 */
interface TableOfContentsConfig {
  toggleId: string;
  contentId: string;
  iconId: string;
}

/**
 * TableOfContents utility class
 */
export class TableOfContentsUtils {
  private toggle: HTMLButtonElement | null;
  private content: HTMLElement | null;
  private icon: HTMLElement | null;
  private isExpanded: boolean = false;

  /**
   * Initialize table of contents utility and attach event listeners.
   */
  constructor(config: TableOfContentsConfig) {
    this.toggle = safeGetElementById<HTMLButtonElement>(config.toggleId);
    this.content = safeGetElementById(config.contentId);
    this.icon = safeGetElementById(config.iconId);

    this.init();
  }

  /**
   * Initialize table of contents functionality
   */
  private init(): void {
    if (!this.toggle || !this.content || !this.icon) {
      return;
    }

    // Add click event listener
    this.toggle.addEventListener("click", () => this.toggleContent());

    // Add keyboard event listeners
    this.toggle.addEventListener("keydown", (e) => this.handleKeydown(e));

    // Add click outside listener to close
    document.addEventListener("click", (e) => this.handleClickOutside(e));

    // Add escape key listener
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isExpanded) {
        this.collapse();
      }
    });
  }

  /**
   * Toggle content visibility
   */
  private toggleContent(): void {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  /**
   * Expand the table of contents
   */
  private expand(): void {
    if (!this.toggle || !this.content || !this.icon) {
      return;
    }

    this.isExpanded = true;

    // Update ARIA attributes
    this.toggle.setAttribute("aria-expanded", "true");

    // Show content (progressive enhancement: animate height/opacity if CSS vars present)
    this.content.classList.remove("hidden");
    this.content.classList.add("block");
    try {
      this.content.style.opacity = "1";
      // If content has scrollHeight we can animate
      const fullHeight = this.content.scrollHeight;
      this.content.style.maxHeight = `${fullHeight}px`;
      // Force reflow for Safari quirks
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.content.offsetHeight;
    } catch {
      /* noop */
    }

    // Rotate icon
    this.icon.style.transform = "rotate(180deg)";

    // Update screen reader text
    const srText = this.toggle.querySelector("[data-expanded]");
    if (srText) {
      srText.textContent = srText.getAttribute("data-expanded");
    }
  }

  /**
   * Collapse the table of contents
   */
  private collapse(): void {
    if (!this.toggle || !this.content || !this.icon) {
      return;
    }

    this.isExpanded = false;

    // Update ARIA attributes
    this.toggle.setAttribute("aria-expanded", "false");

    // Hide content with animation fallback
    try {
      this.content.style.opacity = "0";
      this.content.style.maxHeight = "0px";
      window.setTimeout(() => {
        this.content?.classList.add("hidden");
        this.content?.classList.remove("block");
      }, 250); // match transition duration
    } catch {
      this.content.classList.add("hidden");
      this.content.classList.remove("block");
    }

    // Reset icon rotation
    this.icon.style.transform = "rotate(0deg)";

    // Update screen reader text
    const srText = this.toggle.querySelector("[data-collapsed]");
    if (srText) {
      srText.textContent = srText.getAttribute("data-collapsed");
    }
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.toggleContent();
    }
  }

  /**
   * Handle clicks outside the component
   */
  private handleClickOutside(e: Event): void {
    if (!this.toggle || !this.content) {
      return;
    }

    const target = e.target as Element;
    if (!this.toggle.contains(target) && !this.content.contains(target)) {
      this.collapse();
    }
  }

  /**
   * Programmatically expand
   */
  public expandProgrammatically(): void {
    this.expand();
  }

  /**
   * Programmatically collapse
   */
  public collapseProgrammatically(): void {
    this.collapse();
  }

  /**
   * Check if expanded
   */
  public isExpandedState(): boolean {
    return this.isExpanded;
  }

  /**
   * Destroy event listeners
   */
  public destroy(): void {
    if (this.toggle) {
      this.toggle.removeEventListener("click", () => this.toggleContent());
      this.toggle.removeEventListener("keydown", (e) => this.handleKeydown(e));
    }
    document.removeEventListener("click", (e) => this.handleClickOutside(e));
  }
}

/**
 * Initialize table of contents functionality
 */
export function initTableOfContents(config: TableOfContentsConfig): TableOfContentsUtils {
  return new TableOfContentsUtils(config);
}

/**
 * Default table of contents initialization
 */
export function initDefaultTableOfContents(): TableOfContentsUtils {
  return initTableOfContents({
    toggleId: "toc-toggle",
    contentId: "toc-content",
    iconId: "toc-icon",
  });
}
