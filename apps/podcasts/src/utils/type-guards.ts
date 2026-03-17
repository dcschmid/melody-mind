export function isHTMLElement(el: unknown): el is HTMLElement {
  return el instanceof HTMLElement;
}

export function isHTMLInputElement(el: unknown): el is HTMLInputElement {
  return el instanceof HTMLInputElement;
}

export function isHTMLButtonElement(el: unknown): el is HTMLButtonElement {
  return el instanceof HTMLButtonElement;
}

export function isHTMLAnchorElement(el: unknown): el is HTMLAnchorElement {
  return el instanceof HTMLAnchorElement;
}

export function isHTMLImageElement(el: unknown): el is HTMLImageElement {
  return el instanceof HTMLImageElement;
}

export function isHTMLTimeElement(el: unknown): el is HTMLTimeElement {
  return el instanceof HTMLTimeElement;
}

export function isHTMLAudioElement(el: unknown): el is HTMLAudioElement {
  return el instanceof HTMLAudioElement;
}

export function isHTMLDetailsElement(el: unknown): el is HTMLDetailsElement {
  return el instanceof HTMLDetailsElement;
}

export function isSVGElement(el: unknown): el is SVGElement {
  return el instanceof SVGElement;
}

export function isElement(el: unknown): el is Element {
  return el instanceof Element;
}

export function isMouseEvent(event: unknown): event is MouseEvent {
  return event instanceof MouseEvent;
}

export function isKeyboardEvent(event: unknown): event is KeyboardEvent {
  return event instanceof KeyboardEvent;
}

export function isCustomEvent(event: unknown): event is CustomEvent {
  return event instanceof CustomEvent;
}

export function assertHTMLElement(el: unknown, context = 'element'): HTMLElement {
  if (!isHTMLElement(el)) {
    throw new Error(`Expected ${context} to be HTMLElement`);
  }
  return el;
}
