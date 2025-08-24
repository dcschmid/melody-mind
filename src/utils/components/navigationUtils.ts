/**
 * Simple Navigation
 * Replaces the over-engineered class-based approach
 */

interface NavigationConfig {
  menuToggleId: string;
  mainMenuId: string;
  menuBackdropId: string;
  logoutButtonId?: string;
  lang?: string;
}

/**
 * Initialize navigation functionality
 */
export function initNavigation(config: NavigationConfig): void {
  const menuToggle = document.getElementById(config.menuToggleId);
  const mainMenu = document.getElementById(config.mainMenuId);
  const menuBackdrop = document.getElementById(config.menuBackdropId);
  const closeButton = mainMenu?.querySelector("button");
  const logoutButton = config.logoutButtonId
    ? document.getElementById(config.logoutButtonId)
    : null;

  if (!menuToggle || !mainMenu || !menuBackdrop || !closeButton) {
    return;
  }

  // Add event listeners
  menuToggle.addEventListener("click", () => toggleMenu());
  closeButton.addEventListener("click", () => closeMenu());
  menuBackdrop.addEventListener("click", () => closeMenu());

  // Handle escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen()) {
      closeMenu();
    }
  });

  // Initialize logout functionality
  if (logoutButton) {
    initLogout(logoutButton, config.lang || "en");
  }

  function toggleMenu(): void {
    const isExpanded = menuToggle?.getAttribute("aria-expanded") === "true";
    const newState = !isExpanded;
    setMenuState(newState);
  }

  function closeMenu(): void {
    setMenuState(false);
  }

  function setMenuState(isOpen: boolean): void {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mainMenu.setAttribute("data-state", isOpen ? "open" : "closed");
    menuBackdrop.setAttribute("data-state", isOpen ? "open" : "closed");
  }

  function isMenuOpen(): boolean {
    return mainMenu.getAttribute("data-state") === "open";
  }

  function initLogout(button: HTMLElement, lang: string): void {
    button.addEventListener("click", () => {
      // Simple logout logic
      if (
        confirm(
          lang === "de" ? "Möchten Sie sich wirklich abmelden?" : "Do you really want to logout?"
        )
      ) {
        window.location.href = "/logout";
      }
    });
  }
}

/**
 * Auto-initialize navigation
 */
export function initNavigationAuto(): void {
  const navElements = document.querySelectorAll("[data-navigation]");

  navElements.forEach((element) => {
    const config = {
      menuToggleId: element.getAttribute("data-menu-toggle") || "menu-toggle",
      mainMenuId: element.getAttribute("data-main-menu") || "main-menu",
      menuBackdropId: element.getAttribute("data-menu-backdrop") || "menu-backdrop",
      logoutButtonId: element.getAttribute("data-logout-button"),
      lang: element.getAttribute("data-lang") || "en",
    };

    initNavigation(config);
  });
}

/**
 * Default navigation initialization
 */
export function initDefaultNavigation(): void {
  initNavigation({
    menuToggleId: "menu-toggle",
    mainMenuId: "main-menu",
    menuBackdropId: "menu-backdrop",
    lang: "en",
  });
}
