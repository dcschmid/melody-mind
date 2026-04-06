type OverlayDisclosureConfig = {
  bodyClass: string;
  mobileMedia: MediaQueryList;
  onOpenChange?: (open: boolean) => void;
  panel: HTMLElement;
  root: HTMLElement;
  toggle: HTMLButtonElement;
  applyDesktopState?: () => void;
  applyMobileClosedState?: () => void;
  closeOnLinkSelector?: string;
  excludeFromOutsideLock?: (element: Element, root: HTMLElement) => boolean;
  focusableSelector?: string;
  manageHidden?: boolean;
  mobileAttribute?: string;
  openAttribute?: string;
};

export const bindOverlayDisclosure = ({
  bodyClass,
  mobileMedia,
  onOpenChange,
  panel,
  root,
  toggle,
  applyDesktopState,
  applyMobileClosedState,
  closeOnLinkSelector = "a[href]",
  excludeFromOutsideLock,
  focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
  manageHidden = true,
  mobileAttribute = "data-mobile",
  openAttribute = "data-open",
}: OverlayDisclosureConfig): void => {
  const controller = new AbortController();
  const { signal } = controller;
  let previousFocus: HTMLElement | null = null;

  const siblingRegions = Array.from(document.body.children).filter(
    (element) => !(excludeFromOutsideLock?.(element, root) ?? false)
  ) as HTMLElement[];

  const getFocusable = (): HTMLElement[] =>
    Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));

  const syncOutsideInteractivity = (open: boolean) => {
    const lockOutside = open && mobileMedia.matches;
    document.body.classList.toggle(bodyClass, lockOutside);

    siblingRegions.forEach((region) => {
      if ("inert" in region) {
        region.inert = lockOutside;
      }
      if (lockOutside) {
        region.setAttribute("aria-hidden", "true");
        return;
      }
      region.removeAttribute("aria-hidden");
    });
  };

  const setOpen = (open: boolean, restoreFocus = true) => {
    if (!mobileMedia.matches) {
      applyDesktopState?.();
      syncOutsideInteractivity(false);
      return;
    }

    if (open) {
      previousFocus =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }

    root.setAttribute(openAttribute, open ? "true" : "false");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    onOpenChange?.(open);
    if (manageHidden) {
      panel.hidden = !open;
    }
    syncOutsideInteractivity(open);

    if (open) {
      window.requestAnimationFrame(() => getFocusable()[0]?.focus());
    } else if (restoreFocus && previousFocus) {
      previousFocus.focus();
    }
  };

  const syncMode = () => {
    root.setAttribute(mobileAttribute, mobileMedia.matches ? "true" : "false");

    if (mobileMedia.matches) {
      applyMobileClosedState?.();
      onOpenChange?.(false);
      syncOutsideInteractivity(false);
      return;
    }

    applyDesktopState?.();
    onOpenChange?.(false);
    syncOutsideInteractivity(false);
  };

  toggle.addEventListener(
    "click",
    () => {
      if (!mobileMedia.matches) {
        return;
      }

      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    },
    { signal }
  );

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (
        mobileMedia.matches &&
        root.getAttribute(openAttribute) === "true" &&
        target instanceof Node &&
        !root.contains(target)
      ) {
        setOpen(false);
      }
    },
    { signal }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (!mobileMedia.matches || root.getAttribute(openAttribute) !== "true") {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = [toggle, ...getFocusable()];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    },
    { signal }
  );

  panel.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const link = target.closest(closeOnLinkSelector);
      if (link && mobileMedia.matches) {
        setOpen(false);
      }
    },
    { signal }
  );

  mobileMedia.addEventListener("change", syncMode, { signal });
  window.addEventListener("pagehide", () => controller.abort(), {
    once: true,
    signal,
  });

  syncMode();
};
