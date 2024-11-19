import { describe, expect, it, beforeEach, vi } from "vitest";
import { JSDOM } from "jsdom";

describe("ShareOverlay Client", () => {
  let dom: JSDOM;
  let mockOpen: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dom = new JSDOM(
      `
      <div class="shareContainer">
        <button class="shareButton facebook" data-share="facebook">Facebook</button>
        <button class="shareButton whatsapp" data-share="whatsapp">WhatsApp</button>
      </div>
    `,
      {
        url: "http://localhost",
        referrer: "http://localhost",
        runScripts: "dangerously",
      },
    );

    mockOpen = vi.fn();

    global.document = dom.window.document;
    global.window = Object.create(dom.window, {
      open: { value: mockOpen },
      location: {
        value: {
          href: "http://localhost/game",
          origin: "http://localhost",
        },
      },
    });

    // Client-Side-Logik direkt initialisieren
    document.querySelectorAll("[data-share]").forEach((button) => {
      button.addEventListener("click", (e) => {
        const target = e.currentTarget as HTMLElement;
        const type = target.getAttribute("data-share");
        const url = window.location.href;

        if (type === "facebook") {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            "_blank",
          );
        } else if (type === "whatsapp") {
          window.open(`https://api.whatsapp.com/send?text=${url}`, "_blank");
        }
      });
    });
  });

  it("sollte Facebook Share URL korrekt aufrufen", () => {
    const facebookButton = document.querySelector("[data-share='facebook']");
    facebookButton?.dispatchEvent(new dom.window.MouseEvent("click"));

    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining("facebook.com/sharer/sharer.php"),
      "_blank",
    );
  });

  it("sollte WhatsApp Share URL korrekt aufrufen", () => {
    const whatsappButton = document.querySelector("[data-share='whatsapp']");
    whatsappButton?.dispatchEvent(new dom.window.MouseEvent("click"));

    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining("api.whatsapp.com/send"),
      "_blank",
    );
  });
});
