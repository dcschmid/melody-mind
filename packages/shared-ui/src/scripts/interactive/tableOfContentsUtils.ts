import { safeGetElementById } from "./dom-utils";

interface TableOfContentsConfig {
  toggleId: string;
  contentId: string;
  iconId: string;
}

export class TableOfContentsUtils {
  private toggle: HTMLButtonElement | null;
  private content: HTMLElement | null;
  private icon: HTMLElement | null;
  private isExpanded: boolean = false;

  constructor(config: TableOfContentsConfig) {
    this.toggle = safeGetElementById<HTMLButtonElement>(config.toggleId);
    this.content = safeGetElementById(config.contentId);
    this.icon = safeGetElementById(config.iconId);
    this.init();
  }

  private init(): void {
    if (!this.toggle || !this.content || !this.icon) {
      return;
    }

    this.toggle.addEventListener("click", () => this.toggleContent());
    this.toggle.addEventListener("keydown", (e) => this.handleKeydown(e));
    document.addEventListener("click", (e) => this.handleClickOutside(e));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isExpanded) {
        this.collapse();
      }
    });
  }

  private toggleContent(): void {
    this.isExpanded ? this.collapse() : this.expand();
  }

  private expand(): void {
    if (!this.toggle || !this.content || !this.icon) {
      return;
    }

    this.isExpanded = true;
    this.toggle.setAttribute("aria-expanded", "true");
    this.content.classList.remove("hidden");
    this.content.classList.add("block");

    try {
      this.content.style.opacity = "1";
      this.content.style.maxHeight = `${this.content.scrollHeight}px`;
      void this.content.offsetHeight;
    } catch {
      // fallback
    }

    this.icon.style.transform = "rotate(180deg)";

    const srText = this.toggle.querySelector("[data-expanded]");
    if (srText) {
      srText.textContent = srText.getAttribute("data-expanded") || "";
    }
  }

  private collapse(): void {
    if (!this.toggle || !this.content || !this.icon) {
      return;
    }

    this.isExpanded = false;
    this.toggle.setAttribute("aria-expanded", "false");

    try {
      this.content.style.opacity = "0";
      this.content.style.maxHeight = "0px";
      window.setTimeout(() => {
        this.content?.classList.add("hidden");
        this.content?.classList.remove("block");
      }, 250);
    } catch {
      this.content.classList.add("hidden");
      this.content.classList.remove("block");
    }

    this.icon.style.transform = "rotate(0deg)";

    const srText = this.toggle.querySelector("[data-collapsed]");
    if (srText) {
      srText.textContent = srText.getAttribute("data-collapsed") || "";
    }
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.toggleContent();
    }
  }

  private handleClickOutside(e: Event): void {
    if (!this.toggle || !this.content) {
      return;
    }

    const target = e.target as Element;
    if (!this.toggle.contains(target) && !this.content.contains(target)) {
      this.collapse();
    }
  }

  public expandProgrammatically(): void {
    this.expand();
  }

  public collapseProgrammatically(): void {
    this.collapse();
  }

  public isExpandedState(): boolean {
    return this.isExpanded;
  }

  public destroy(): void {
    if (this.toggle) {
      this.toggle.removeEventListener("click", () => this.toggleContent());
      this.toggle.removeEventListener("keydown", (e) => this.handleKeydown(e));
    }
  }
}

export function initTableOfContents(config: TableOfContentsConfig): TableOfContentsUtils {
  return new TableOfContentsUtils(config);
}

export function initDefaultTableOfContents(): TableOfContentsUtils {
  return new TableOfContentsUtils({
    toggleId: "toc-toggle",
    contentId: "toc-content",
    iconId: "toc-icon",
  });
}
