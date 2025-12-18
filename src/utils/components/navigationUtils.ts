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
  // Close button might not yet be parsed if streaming / incremental HTML; treat as optional & attach later.
  let closeButton: HTMLButtonElement | null =
    (mainMenu?.querySelector("button") as HTMLButtonElement | null) || null;
  const logoutButton = config.logoutButtonId
    ? document.getElementById(config.logoutButtonId)
    : undefined;

  if (!menuToggle || !mainMenu || !menuBackdrop) {
    return; // fundamental elements missing
  }

  // Debounce handling to avoid rapid toggle spam
  let lastToggleTime = 0;
  const TOGGLE_DEBOUNCE_MS = 250;

  function handleToggleClick(): void {
    const now = Date.now();
    if (now - lastToggleTime < TOGGLE_DEBOUNCE_MS) {
      // Ignore rapid successive clicks
      return;
    }
    lastToggleTime = now;
    toggleMenu();
  }

  // Add event listeners
  menuToggle.addEventListener("click", handleToggleClick);
  if (closeButton) {
    closeButton.addEventListener("click", () => closeMenu());
  } else {
    // Retry once on next frame to catch late close button (defensive)
    requestAnimationFrame(() => {
      closeButton =
        (mainMenu.querySelector("button") as HTMLButtonElement | null) || null;
      closeButton?.addEventListener("click", () => closeMenu());
    });
  }
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
    menuToggle!.setAttribute("aria-expanded", String(isOpen));
    mainMenu!.setAttribute("data-state", isOpen ? "open" : "closed");
    menuBackdrop!.setAttribute("data-state", isOpen ? "open" : "closed");
    // Announce state change for screen readers (non-intrusive polite region)
    try {
      const announcer = document.getElementById("menu-status-announcer");
      if (announcer) {
        // Prefer localized strings provided via data attributes; fallback to English literals.
        const openedText = mainMenu?.getAttribute("data-status-opened") || "Menu opened";
        const closedText = mainMenu?.getAttribute("data-status-closed") || "Menu closed";
        announcer.textContent = isOpen ? openedText : closedText;
      }
    } catch {
      /* silent */
    }
  }

  function isMenuOpen(): boolean {
    return mainMenu!.getAttribute("data-state") === "open";
  }

  function initLogout(button: HTMLElement, lang: string): void {
    button.addEventListener("click", () => {
      // Simple logout logic
      if (
        confirm(
          lang === "de"
            ? "Möchten Sie sich wirklich abmelden?"
            : "Do you really want to logout?"
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
      // element.getAttribute may return null; normalize to undefined to match NavigationConfig
      logoutButtonId: element.getAttribute("data-logout-button") || undefined,
      lang: element.getAttribute("data-lang") || "en",
    };

    initNavigation(config);
  });
}

/**
 * Default navigation initialization
 */
export function initDefaultNavigation(): void {
  // Detect current language from <html lang="..."> else fallback to en
  let detectedLang = "en";
  try {
    const html = document.documentElement;
    if (html && html.lang) {
      detectedLang = html.lang.split("-")[0].toLowerCase();
    }
  } catch {
    /* noop */
  }
  initNavigation({
    menuToggleId: "menu-toggle",
    mainMenuId: "main-menu",
    menuBackdropId: "menu-backdrop",
    lang: detectedLang,
  });
}
