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
  const lockedRegionState = new WeakMap<
    HTMLElement,
    { ariaHidden: string | null; inert: boolean }
  >();

  const getOutsideLockRegions = (): HTMLElement[] => {
    const regions: HTMLElement[] = [];
    let current: HTMLElement = root;
    let parent = root.parentElement;

    while (parent) {
      Array.from(parent.children).forEach((element) => {
        if (
          element === current ||
          !(element instanceof HTMLElement) ||
          (excludeFromOutsideLock?.(element, root) ?? false)
        ) {
          return;
        }

        regions.push(element);
      });

      if (parent === document.body) {
        break;
      }

      current = parent;
      parent = parent.parentElement;
    }

    return regions;
  };

  const getFocusable = (): HTMLElement[] =>
    Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));

  const syncOutsideInteractivity = (open: boolean) => {
    const lockOutside = open && mobileMedia.matches;
    document.body.classList.toggle(bodyClass, lockOutside);

    getOutsideLockRegions().forEach((region) => {
      if (lockOutside) {
        if (!lockedRegionState.has(region)) {
          lockedRegionState.set(region, {
            ariaHidden: region.getAttribute("aria-hidden"),
            inert: "inert" in region ? region.inert : false,
          });
        }
        if ("inert" in region) {
          region.inert = true;
        }
        region.setAttribute("aria-hidden", "true");
        return;
      }

      const previousState = lockedRegionState.get(region);
      if (!previousState) {
        return;
      }

      if ("inert" in region) {
        region.inert = previousState.inert;
      }
      if (previousState.ariaHidden === null) {
        region.removeAttribute("aria-hidden");
      } else {
        region.setAttribute("aria-hidden", previousState.ariaHidden);
      }
      lockedRegionState.delete(region);
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
