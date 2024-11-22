import { describe, expect, it, beforeEach, vi } from "vitest";
import { JSDOM } from "jsdom";
import { initializeGoldenLPOverlay } from "../Overlays/GoldenLPOverlay.client";

describe("GoldenLPOverlay Client", () => {
  let dom: JSDOM;
  let mutationCallback: MutationCallback;

  beforeEach(() => {
    dom = new JSDOM(`
      <div id="golden-lp-popup" class="popup hidden">
        <div class="popupContent" tabindex="-1">
          <button id="restart-button-lp">Neues Spiel</button>
        </div>
      </div>
    `);

    global.document = dom.window.document;
    global.window = dom.window as any;
    global.MutationObserver = class {
      constructor(callback: MutationCallback) {
        mutationCallback = callback;
      }
      observe() {}
      disconnect() {}
    } as any;
  });

  it("sollte den Escape-Key-Handler korrekt hinzufügen", () => {
    const clickSpy = vi.spyOn(
      document.getElementById("restart-button-lp")!,
      "click",
    );

    initializeGoldenLPOverlay();

    const event = new dom.window.KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event);

    expect(clickSpy).toHaveBeenCalled();
  });

  it("sollte den Fokus auf popupContent setzen wenn sichtbar", () => {
    const popup = document.getElementById("golden-lp-popup");
    const popupContent = document.querySelector(".popupContent") as HTMLElement;
    const focusSpy = vi.spyOn(popupContent, "focus");

    initializeGoldenLPOverlay();

    // Simuliere Klassenänderung und löse MutationObserver aus
    popup?.classList.remove("hidden");

    // Erstelle und übergebe MutationRecord
    const mutation = {
      type: "attributes",
      attributeName: "class",
      target: popup,
      addedNodes: {
        length: 0,
        item: () => null,
        [Symbol.iterator]: function* () {},
      } as unknown as NodeList,
      removedNodes: {
        length: 0,
        item: () => null,
        [Symbol.iterator]: function* () {},
      } as unknown as NodeList,
      previousSibling: null,
      nextSibling: null,
      attributeNamespace: null,
      oldValue: null,
    } as MutationRecord;

    // Rufe den Observer-Callback manuell auf
    mutationCallback([mutation], {} as MutationObserver);

    expect(focusSpy).toHaveBeenCalled();
  });

  it("sollte Event-Listener beim Cleanup entfernen", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    initializeGoldenLPOverlay();

    const event = new dom.window.Event("astro:before-swap", { bubbles: true });
    document.dispatchEvent(event);

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });

  it("sollte den Fokus nicht setzen wenn Popup versteckt bleibt", () => {
    const popupContent = document.querySelector(".popupContent") as HTMLElement;
    const focusSpy = vi.spyOn(popupContent, "focus");

    initializeGoldenLPOverlay();

    // Simuliere andere Klassenänderung
    const popup = document.getElementById("golden-lp-popup");
    popup?.classList.add("another-class");

    const mutation = {
      type: "attributes",
      attributeName: "class",
      target: popup,
      addedNodes: {
        length: 0,
        item: () => null,
        [Symbol.iterator]: function* () {},
      } as unknown as NodeList,
      removedNodes: {
        length: 0,
        item: () => null,
        [Symbol.iterator]: function* () {},
      } as unknown as NodeList,
      previousSibling: null,
      nextSibling: null,
      attributeNamespace: null,
      oldValue: null,
    } as MutationRecord;

    mutationCallback([mutation], {} as MutationObserver);

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("sollte den Restart-Button korrekt initialisieren", () => {
    const restartButton = document.getElementById("restart-button-lp");
    expect(restartButton?.textContent).toBe("Neues Spiel");
  });

  it("sollte mehrere Escape-Tastendrücke korrekt behandeln", () => {
    const restartButton = document.getElementById("restart-button-lp");
    const clickSpy = vi.spyOn(restartButton as HTMLElement, "click");

    initializeGoldenLPOverlay();

    // Simuliere mehrere Escape-Tastendrücke
    const escapeEvent = new dom.window.KeyboardEvent("keydown", {
      key: "Escape",
    });
    document.dispatchEvent(escapeEvent);
    document.dispatchEvent(escapeEvent);
    document.dispatchEvent(escapeEvent);

    expect(clickSpy).toHaveBeenCalledTimes(3);
  });

  it("sollte andere Tasten ignorieren", () => {
    const restartButton = document.getElementById("restart-button-lp");
    const clickSpy = vi.spyOn(restartButton as HTMLElement, "click");

    initializeGoldenLPOverlay();

    // Simuliere andere Tasten
    const enterEvent = new dom.window.KeyboardEvent("keydown", {
      key: "Enter",
    });
    const spaceEvent = new dom.window.KeyboardEvent("keydown", { key: " " });

    document.dispatchEvent(enterEvent);
    document.dispatchEvent(spaceEvent);

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("sollte den MutationObserver korrekt disconnecten beim Cleanup", () => {
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, "disconnect");

    initializeGoldenLPOverlay();

    const event = new dom.window.Event("astro:before-swap", { bubbles: true });
    document.dispatchEvent(event);

    expect(disconnectSpy).toHaveBeenCalled();
  });

  it("sollte robust sein wenn Elemente fehlen", () => {
    // Entferne Elemente
    document.getElementById("golden-lp-popup")?.remove();
    document.getElementById("restart-button-lp")?.remove();

    // Sollte keine Fehler werfen
    expect(() => {
      initializeGoldenLPOverlay();
    }).not.toThrow();
  });
});
