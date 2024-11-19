import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import FeedbackOverlay from "../Overlays/FeedbackOverlay.astro";

describe("FeedbackOverlay", () => {
  it("sollte die korrekte Struktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(FeedbackOverlay);

    expect(result).toContain('id="overlay"');
    expect(result).toContain('class="overlay hidden"');
    expect(result).toContain("Auflösung");
  });

  it("sollte alle erforderlichen Medien-Elemente enthalten", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(FeedbackOverlay);

    // Prüfe Audio-Player
    expect(result).toContain('id="audio-preview"');
    expect(result).toContain('class="audioPlayer"');

    // Prüfe Album-Cover
    expect(result).toContain('id="overlay-cover"');
    expect(result).toContain('class="albumCover"');
  });

  it("sollte alle Streaming-Links enthalten", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(FeedbackOverlay);

    // Prüfe Streaming-Buttons
    expect(result).toContain('id="spotify-link"');
    expect(result).toContain('id="deezer-link"');
    expect(result).toContain('id="apple-link"');
  });

  it("sollte alle Info-Felder enthalten", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(FeedbackOverlay);

    expect(result).toContain('id="overlay-artist"');
    expect(result).toContain('id="overlay-album"');
    expect(result).toContain('id="overlay-year"');
    expect(result).toContain('id="overlay-funfact"');
  });

  it("sollte korrekte ARIA-Attribute für Barrierefreiheit haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(FeedbackOverlay);

    expect(result).toContain('role="dialog"');
    expect(result).toContain('aria-modal="true"');
    expect(result).toContain('aria-live="polite"');
    expect(result).toContain('aria-labelledby="overlay-title"');
  });
}); 
