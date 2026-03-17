export class EventManager {
  private controller = new AbortController();

  on(target: EventTarget, event: string, handler: (event: Event) => void): void {
    target.addEventListener(event, handler, { signal: this.controller.signal });
  }

  cleanup(): void {
    this.controller.abort();
  }
}
