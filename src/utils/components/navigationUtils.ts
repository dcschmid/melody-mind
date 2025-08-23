/**
 * Navigation Utilities
 * 
 * Centralized utilities for managing navigation menu functionality.
 * Eliminates code duplication in navigation component script tags.
 */

import { safeGetElementById, safeQuerySelector } from "../dom/domUtils";

/**
 * Navigation menu configuration
 */
interface NavigationConfig {
  menuToggleId: string;
  mainMenuId: string;
  menuBackdropId: string;
  logoutButtonId?: string;
  lang?: string;
}

/**
 * Navigation menu utility class
 */
export class NavigationUtils {
  private menuToggle: HTMLElement | null;
  private mainMenu: HTMLElement | null;
  private menuBackdrop: HTMLElement | null;
  private closeButton: HTMLElement | null;
  private logoutButton: HTMLElement | null;
  private lang: string;

  /**
   *
   */
  constructor(config: NavigationConfig) {
    this.menuToggle = safeGetElementById(config.menuToggleId);
    this.mainMenu = safeGetElementById(config.mainMenuId);
    this.menuBackdrop = safeGetElementById(config.menuBackdropId);
    this.closeButton = this.mainMenu ? safeQuerySelector("button", this.mainMenu) : null;
    this.logoutButton = config.logoutButtonId ? safeGetElementById(config.logoutButtonId) : null;
    this.lang = config.lang || 'en';
    
    this.init();
  }

  /**
   * Initialize navigation functionality
   */
  private init(): void {
    if (!this.menuToggle || !this.mainMenu || !this.menuBackdrop || !this.closeButton) {
      return;
    }

    // Add event listeners
    this.menuToggle.addEventListener("click", () => this.toggleMenu());
    this.closeButton.addEventListener("click", () => this.closeMenu());
    this.menuBackdrop.addEventListener("click", () => this.closeMenu());

    // Handle escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isMenuOpen()) {
        this.closeMenu();
      }
    });

    // Initialize logout functionality
    if (this.logoutButton) {
      this.initLogout();
    }
  }

  /**
   * Toggle menu state
   */
  private toggleMenu(): void {
    const isExpanded = this.menuToggle?.getAttribute("aria-expanded") === "true";
    const newState = !isExpanded;

    this.setMenuState(newState);
  }

  /**
   * Close the menu
   */
  private closeMenu(): void {
    this.setMenuState(false);
  }

  /**
   * Set menu state
   */
  private setMenuState(isOpen: boolean): void {
    if (!this.menuToggle || !this.mainMenu || !this.menuBackdrop) {
      return;
    }

    this.menuToggle.setAttribute("aria-expanded", String(isOpen));
    this.mainMenu.setAttribute("data-state", isOpen ? "open" : "closed");
    this.menuBackdrop.setAttribute("data-state", isOpen ? "open" : "closed");

    // Prevent scrolling when menu is open
    document.body.style.overflow = isOpen ? "hidden" : "";

    // Focus management
    if (isOpen) {
      setTimeout(() => {
        this.closeButton?.focus();
      }, 50);
    } else {
      this.menuToggle.focus();
    }
  }

  /**
   * Check if menu is open
   */
  private isMenuOpen(): boolean {
    return this.menuToggle?.getAttribute("aria-expanded") === "true";
  }

  /**
   * Initialize logout functionality
   */
  private initLogout(): void {
    if (!this.logoutButton) {
      return;
    }

    this.logoutButton.addEventListener("click", async () => {
      try {
        const response = await fetch(`/${this.lang}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Clear any client-side storage
          localStorage.removeItem("melody_mind_user");
          sessionStorage.clear();
          
          // Redirect to home page
          window.location.href = `/${this.lang}`;
        } else {
          console.warn("Logout failed, redirecting anyway");
          window.location.href = `/${this.lang}`;
        }
      } catch (error) {
        console.warn("Logout error, redirecting anyway:", error);
        window.location.href = `/${this.lang}`;
      }
    });
  }
}

/**
 * Initialize navigation utilities
 */
export function initNavigation(config: NavigationConfig): NavigationUtils {
  return new NavigationUtils(config);
}

/**
 * Default navigation initialization for standard layout
 */
export function initStandardNavigation(lang: string = 'en'): NavigationUtils {
  return initNavigation({
    menuToggleId: "menu-toggle",
    mainMenuId: "main-menu", 
    menuBackdropId: "menu-backdrop",
    logoutButtonId: "logout-button",
    lang
  });
}
