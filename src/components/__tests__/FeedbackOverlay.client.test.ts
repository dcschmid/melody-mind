import { describe, expect, it, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

describe("FeedbackOverlay Client", () => {
  beforeEach(() => {
    const dom = new JSDOM(`
      <div id="overlay" class="overlay hidden">
        <div class="overlayContent">
          <audio id="audio-preview" controls>
            <source id="audio-preview-source" src="" type="audio/mpeg">
          </audio>
          <button id="next-round-button">Nächste Runde</button>
        </div>
      </div>
    `);

    global.document = dom.window.document;
    global.window = dom.window as any;
  });

  it("sollte das Overlay initial versteckt sein", () => {
    const overlay = document.getElementById("overlay");
    expect(overlay?.classList.contains("hidden")).toBe(true);
  });

  it("sollte den Audio-Player korrekt initialisieren", () => {
    const audioPlayer = document.getElementById(
      "audio-preview",
    ) as HTMLAudioElement;
    expect(audioPlayer).toBeTruthy();
    expect(audioPlayer.controls).toBe(true);
  });

  it("sollte den Next-Round-Button korrekt initialisieren", () => {
    const nextButton = document.getElementById("next-round-button");
    expect(nextButton).toBeTruthy();
    expect(nextButton?.textContent).toBe("Nächste Runde");
  });

  // Weitere Tests für Client-seitige Funktionalität
  // z.B. Klick-Handler, Audio-Steuerung, etc.
});
