export function queryElement<T extends Element>(
  container: Element | Document,
  selector: string,
  expectedType: { new (): T },
): T | null {
  const element = container.querySelector(selector);
  return element instanceof expectedType ? element : null;
}

export function queryAll<T extends Element>(
  container: Element | Document,
  selector: string,
  expectedType: { new (): T },
): T[] {
  const elements = container.querySelectorAll(selector);
  return Array.from(elements).filter((el): el is T => el instanceof expectedType);
}

export function createQuery<T extends Element>(type: { new (): T }) {
  return (container: Element | Document, selector: string): T | null =>
    queryElement(container, selector, type);
}

export const queryAudio = createQuery(HTMLAudioElement);
export const queryButton = createQuery(HTMLButtonElement);
export const queryInput = createQuery(HTMLInputElement);
export const queryAnchor = createQuery(HTMLAnchorElement);
export const queryImage = createQuery(HTMLImageElement);
export const queryTime = createQuery(HTMLTimeElement);
export const queryHTMLElement = createQuery(HTMLElement);
