/**
 * Simple Utility Functions
 * Replaces over-engineered class-based utilities
 */

/**
 * Simple category filter
 */
export function initCategoryFilter(container: HTMLElement): void {
  const filter = container.querySelector(".filter") as HTMLSelectElement;
  const items = container.querySelectorAll(".item");

  if (!filter || items.length === 0) {
    return;
  }

  filter.addEventListener("change", (e: Event): void => {
    const value = (e.target as HTMLSelectElement).value;
    items.forEach((item: Element): void => {
      const category = item.getAttribute("data-category");
      item.classList.toggle("hidden", !category?.includes(value));
    });
  });
}

/**
 * Simple back to top functionality
 */
export function initBackToTop(button: HTMLElement): void {
  if (!button) {
    return;
  }

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  button.addEventListener("click", (e: Event): void => {
    e.preventDefault();
    scrollToTop();
  });

  // Show/hide button based on scroll position
  const toggleButton = (): void => {
    button.classList.toggle("hidden", window.scrollY < 300);
  };

  window.addEventListener("scroll", (): void => {
    toggleButton();
  });
  toggleButton(); // Initial state
}

/**
 * Simple language picker
 */
export function initLanguagePicker(container: HTMLElement): void {
  const currentLang = container.getAttribute("data-current-lang");
  const links = container.querySelectorAll("a[data-lang]");

  links.forEach((link: Element): void => {
    const lang = (link as HTMLElement).getAttribute("data-lang");
    if (lang === currentLang) {
      (link as HTMLElement).classList.add("active");
    }
  });
}

/**
 * Simple table of contents
 */
export function initTableOfContents(container: HTMLElement): void {
  const headings = container.querySelectorAll("h2, h3, h4");
  const toc = container.querySelector(".toc");

  if (!toc || headings.length === 0) {
    return;
  }

  const tocItems = Array.from(headings).map(
    (
      heading: Element,
    ): {
      element: Element;
      id: string;
      text: string | null;
      level: number;
    } => {
      const h = heading as HTMLElement;
      const id =
        h.id ||
        (h.textContent
          ? h.textContent
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "")
          : "");
      if (id) {
        h.id = id;
      }

      return {
        element: heading,
        id,
        text: h.textContent,
        level: parseInt(h.tagName.charAt(1), 10),
      };
    },
  );

  toc.innerHTML = tocItems
    .map(
      (item) =>
        `<a href="#${item.id}" class="toc-item toc-level-${item.level}">${item.text ?? ""}</a>`,
    )
    .join("");
}

/**
 * Simple music buttons
 */
export function initMusicButtons(container: HTMLElement): void {
  const buttons = container.querySelectorAll(".music-button");

  buttons.forEach((button: Element): void => {
    button.addEventListener("click", (e: Event): void => {
      e.preventDefault();
      const action = (button as HTMLElement).getAttribute("data-action");
      const target = (button as HTMLElement).getAttribute("data-target");

      if (action === "play" && target) {
        // Simple audio play logic
        const audio = new Audio(target);
        // attach explicit handler type for promise rejection
        (audio.play() as Promise<void>).catch((err: unknown): void => {
          console.error(err);
        });
      }
    });
  });
}

/**
 * Simple loading spinner
 */
export function initLoadingSpinner(container: HTMLElement): void {
  const spinner = container.querySelector(".loading-spinner");
  if (!spinner) {
    return;
  }

  const show = (): void => spinner.classList.remove("hidden");
  const hide = (): void => spinner.classList.add("hidden");

  // Expose methods globally for this container
  interface SpinnerContainer extends HTMLElement {
    showSpinner?: () => void;
    hideSpinner?: () => void;
  }
  const spinnerContainer = container as SpinnerContainer;
  spinnerContainer.showSpinner = show;
  spinnerContainer.hideSpinner = hide;
}

/**
 * Simple navigation
 */
export function initNavigation(container: HTMLElement): void {
  const menuButton = container.querySelector(".menu-button");
  const menu = container.querySelector(".menu");

  if (!menuButton || !menu) {
    return;
  }

  menuButton.addEventListener("click", (): void => {
    menu.classList.toggle("open");
    (menuButton as HTMLElement).setAttribute(
      "aria-expanded",
      menu.classList.contains("open").toString(),
    );
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e: Event): void => {
    if (!container.contains(e.target as Node)) {
      menu.classList.remove("open");
      (menuButton as HTMLElement).setAttribute("aria-expanded", "false");
    }
  });
}

/**
 * Simple overlay manager
 */
export function initOverlayManager(): void {
  const overlays = document.querySelectorAll(".overlay");

  overlays.forEach((overlay: Element): void => {
    const closeButton = overlay.querySelector(".close-button");
    const backdrop = overlay.querySelector(".backdrop");

    const close = (): void => (overlay as HTMLElement).classList.add("hidden");

    closeButton?.addEventListener("click", (): void => {
      close();
    });
    backdrop?.addEventListener("click", (): void => {
      close();
    });

    // Close on escape key
    document.addEventListener("keydown", (e: KeyboardEvent): void => {
      if (
        e.key === "Escape" &&
        !(overlay as HTMLElement).classList.contains("hidden")
      ) {
        close();
      }
    });
  });
}
