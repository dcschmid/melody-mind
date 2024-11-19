import { describe, expect, it, vi, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

// Mock muss vor dem Import der zu testenden Komponente definiert werden
vi.mock("../../utils/share/shareUtils", () => ({
  shareScore: vi.fn()
}));

// Import nach dem Mock
import { shareScore } from "../../utils/share/shareUtils";
import { initializeShareButtons } from "../Overlays/EndOverlay.client";

describe("EndOverlay Client", () => {
  beforeEach(() => {
    // DOM Setup
    const dom = new JSDOM(`
      <div>
        <button data-share="twitter">Twitter</button>
        <button data-share="facebook">Facebook</button>
      </div>
    `);

    global.document = dom.window.document;
    global.window = dom.window as any;

    // Reset mock
    vi.mocked(shareScore).mockReset();

    // Initialize share buttons
    initializeShareButtons();
  });

  it("sollte beim Klick auf Twitter-Share die shareScore Funktion aufrufen", () => {
    const twitterButton = document.querySelector('[data-share="twitter"]');
    twitterButton?.click();

    expect(shareScore).toHaveBeenCalledWith("twitter", {
      score: 0,
      category: "",
      difficulty: ""
    });
  });

  it("sollte beim Klick auf Facebook-Share die shareScore Funktion aufrufen", () => {
    const facebookButton = document.querySelector('[data-share="facebook"]');
    facebookButton?.click();

    expect(shareScore).toHaveBeenCalledWith("facebook", {
      score: 0,
      category: "",
      difficulty: ""
    });
  });

  it("sollte mit fehlenden Daten umgehen können", () => {
    const twitterButton = document.querySelector('[data-share="twitter"]');
    twitterButton?.click();

    expect(shareScore).toHaveBeenCalledWith("twitter", {
      score: 0,
      category: "",
      difficulty: ""
    });
  });
});
