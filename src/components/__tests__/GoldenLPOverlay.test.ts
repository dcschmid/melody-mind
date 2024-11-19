import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import GoldenLPOverlay from "../Overlays/GoldenLPOverlay.astro";

describe("GoldenLPOverlay", () => {
  it("sollte die korrekte Struktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GoldenLPOverlay, {
      props: {
        playerTitle: "Vinyl-Virtuose",
        category: "Rock",
      },
    });

    expect(result).toContain('id="golden-lp-popup"');
    expect(result).toContain('class="popup hidden"');
    expect(result).toContain('class="popupContent"');
    expect(result).toContain("Herzlichen Glückwunsch!");
  });

  it("sollte die übergebenen Props korrekt anzeigen", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GoldenLPOverlay, {
      props: {
        playerTitle: "Vinyl-Virtuose",
        category: "Rock",
      },
    });

    expect(result).toContain("Vinyl-Virtuose");
    expect(result).toContain("Rock");
    expect(result).toContain("goldene");
    expect(result).toContain("Schallplatte");
  });

  it("sollte alle erforderlichen UI-Elemente enthalten", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GoldenLPOverlay, {
      props: {
        playerTitle: "Vinyl-Virtuose",
        category: "Rock",
      },
    });

    expect(result).toContain('class="iconWrapper"');
    expect(result).toContain('class="trophyIcon"');
    expect(result).toContain('class="messageSection"');
    expect(result).toContain('class="scoreText"');
    expect(result).toContain('id="golden-lp-score"');
    expect(result).toContain('id="restart-button-lp"');
  });

  it("sollte korrekte ARIA-Attribute für Barrierefreiheit haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GoldenLPOverlay, {
      props: {
        playerTitle: "Vinyl-Virtuose",
        category: "Rock",
      },
    });

    expect(result).toContain('role="dialog"');
    expect(result).toContain('aria-modal="true"');
    expect(result).toContain('aria-live="polite"');
    expect(result).toContain('aria-labelledby="golden-lp-title"');
    expect(result).toContain('aria-describedby="popup-description"');
  });

  it("sollte den Neustart-Button korrekt konfigurieren", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GoldenLPOverlay, {
      props: {
        playerTitle: "Vinyl-Virtuose",
        category: "Rock",
      },
    });

    expect(result).toContain('id="restart-button-lp"');
    expect(result).toContain('class="restartButton"');
    expect(result).toContain('aria-label="Starte ein neues Spiel"');
    expect(result).toContain("Neues Spiel");
  });
}); 
