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

  if (!filter || items.length === 0) return;

  filter.addEventListener("change", (e) => {
    const value = (e.target as HTMLSelectElement).value;
    items.forEach((item) => {
      const category = item.getAttribute("data-category");
      item.classList.toggle("hidden", !category?.includes(value));
    });
  });
}

/**
 * Simple back to top functionality
 */
export function initBackToTop(button: HTMLElement): void {
  if (!button) return;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  button.addEventListener("click", scrollToTop);

  // Show/hide button based on scroll position
  const toggleButton = () => {
    button.classList.toggle("hidden", window.scrollY < 300);
  };

  window.addEventListener("scroll", toggleButton);
  toggleButton(); // Initial state
}

/**
 * Simple language picker
 */
export function initLanguagePicker(container: HTMLElement): void {
  const currentLang = container.getAttribute("data-current-lang");
  const links = container.querySelectorAll("a[data-lang]");

  links.forEach((link) => {
    const lang = link.getAttribute("data-lang");
    if (lang === currentLang) {
      link.classList.add("active");
    }
  });
}

/**
 * Simple table of contents
 */
export function initTableOfContents(container: HTMLElement): void {
  const headings = container.querySelectorAll("h2, h3, h4");
  const toc = container.querySelector(".toc");

  if (!toc || headings.length === 0) return;

  const tocItems = Array.from(headings).map((heading) => {
    const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-");
    if (id) heading.id = id;

    return {
      element: heading,
      id,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)),
    };
  });

  toc.innerHTML = tocItems
    .map(
      (item) => `<a href="#${item.id}" class="toc-item toc-level-${item.level}">${item.text}</a>`
    )
    .join("");
}

/**
 * Simple music buttons
 */
export function initMusicButtons(container: HTMLElement): void {
  const buttons = container.querySelectorAll(".music-button");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const action = button.getAttribute("data-action");
      const target = button.getAttribute("data-target");

      if (action === "play" && target) {
        // Simple audio play logic
        const audio = new Audio(target);
        audio.play().catch(console.error);
      }
    });
  });
}

/**
 * Simple loading spinner
 */
export function initLoadingSpinner(container: HTMLElement): void {
  const spinner = container.querySelector(".loading-spinner");
  if (!spinner) return;

  const show = () => spinner.classList.remove("hidden");
  const hide = () => spinner.classList.add("hidden");

  // Expose methods globally for this container
  (container as any).showSpinner = show;
  (container as any).hideSpinner = hide;
}

/**
 * Simple navigation
 */
export function initNavigation(container: HTMLElement): void {
  const menuButton = container.querySelector(".menu-button");
  const menu = container.querySelector(".menu");

  if (!menuButton || !menu) return;

  menuButton.addEventListener("click", () => {
    menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", menu.classList.contains("open").toString());
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target as Node)) {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

/**
 * Simple overlay manager
 */
export function initOverlayManager(): void {
  const overlays = document.querySelectorAll(".overlay");

  overlays.forEach((overlay) => {
    const closeButton = overlay.querySelector(".close-button");
    const backdrop = overlay.querySelector(".backdrop");

    const close = () => overlay.classList.add("hidden");

    closeButton?.addEventListener("click", close);
    backdrop?.addEventListener("click", close);

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
        close();
      }
    });
  });
}
