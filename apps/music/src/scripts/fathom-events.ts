type FathomOptions = {
  _value?: number;
};

type FathomClient = {
  trackEvent: (eventName: string, options?: FathomOptions) => void;
};

declare global {
  interface Window {
    fathom?: FathomClient;
    __mmFathomEventsInitialized?: boolean;
  }
}

const EVENT_ATTRIBUTE = "data-fathom-event";
const EVENT_LABEL_ATTRIBUTE = "data-fathom-label";

const getFathomClient = (): FathomClient | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return typeof window.fathom?.trackEvent === "function" ? window.fathom : undefined;
};

export const trackFathomEvent = (eventName: string, options?: FathomOptions): void => {
  const normalizedEventName = eventName.trim();
  if (!normalizedEventName) {
    return;
  }

  try {
    getFathomClient()?.trackEvent(normalizedEventName, options);
  } catch {
    // Analytics must never break page interaction.
  }
};

const getDomainLabel = (url: URL): string => {
  const hostname = url.hostname.replace(/^www\./, "");
  const parts = hostname.split(".").filter(Boolean);

  if (parts.length <= 2) {
    return parts[0] || hostname;
  }

  return parts.at(-2) || hostname;
};

const getExplicitEventTarget = (target: EventTarget | null): HTMLElement | null => {
  return target instanceof Element
    ? target.closest<HTMLElement>(`[${EVENT_ATTRIBUTE}]`)
    : null;
};

const getClickedLink = (target: EventTarget | null): HTMLAnchorElement | null => {
  return target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
};

const trackExplicitClick = (target: EventTarget | null): boolean => {
  const eventTarget = getExplicitEventTarget(target);
  const eventName = eventTarget?.getAttribute(EVENT_ATTRIBUTE)?.trim();

  if (!eventName) {
    return false;
  }

  trackFathomEvent(eventName);
  return true;
};

const trackExternalLinkClick = (target: EventTarget | null): void => {
  const link = getClickedLink(target);
  if (!link) {
    return;
  }

  let linkUrl: URL;
  try {
    linkUrl = new URL(link.href, window.location.href);
  } catch {
    return;
  }

  if (
    !/^https?:$/.test(linkUrl.protocol) ||
    linkUrl.hostname === window.location.hostname
  ) {
    return;
  }

  const label =
    link.getAttribute(EVENT_LABEL_ATTRIBUTE)?.trim() || getDomainLabel(linkUrl);
  trackFathomEvent(`External: ${label}`);
};

const track404Page = (): void => {
  const title = document.title.toLowerCase();
  if (!title.includes("404") && !title.includes("not found")) {
    return;
  }

  trackFathomEvent(`404: ${window.location.pathname}`);
};

const initFathomEvents = (): void => {
  if (window.__mmFathomEventsInitialized) {
    return;
  }

  window.__mmFathomEventsInitialized = true;

  document.addEventListener("click", (event) => {
    if (trackExplicitClick(event.target)) {
      return;
    }

    trackExternalLinkClick(event.target);
  });

  window.addEventListener("load", track404Page, { once: true });
};

if (typeof window !== "undefined") {
  initFathomEvents();
}
