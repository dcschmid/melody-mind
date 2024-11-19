import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import EndOverlay from "../Overlays/EndOverlay.astro";

describe("EndOverlay", () => {
  it("sollte die korrekte Standardstruktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(EndOverlay, {
      props: {
        id: "test-overlay",
      },
    });

    expect(result).toContain('class="popup hidden"');
    expect(result).toContain('role="dialog"');
    expect(result).toContain('id="test-overlay"');
    expect(result).toContain('class="popupContent"');
    expect(result).toContain("Spiel beendet!");
  });

  it("sollte die korrekten Zugänglichkeitsattribute haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(EndOverlay, {
      props: {
        id: "test-overlay",
      },
    });

    expect(result).toContain('role="dialog"');
    expect(result).toContain('aria-labelledby="popup-title"');
    expect(result).toContain('aria-modal="true"');
  });

  it("sollte benutzerdefinierte Props akzeptieren", async () => {
    const container = await AstroContainer.create();
    const customProps = {
      id: "custom-overlay",
      title: "Benutzerdefinierter Titel",
      motivationText: "Gut gemacht!",
      "data-score": "100",
      "data-category": "Test",
      "data-difficulty": "Leicht",
    };

    const result = await container.renderToString(EndOverlay, {
      props: customProps,
    });

    expect(result).toContain('id="custom-overlay"');
    expect(result).toContain("Benutzerdefinierter Titel");
    expect(result).toContain("Gut gemacht!");
    expect(result).toContain('data-score="100"');
    expect(result).toContain('data-category="Test"');
    expect(result).toContain('data-difficulty="Leicht"');
  });

  it("sollte die korrekte Punkteanzeige haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(EndOverlay, {
      props: {
        id: "test-overlay",
        "data-score": "50",
      },
    });

    expect(result).toContain('class="scoreSection"');
    expect(result).toContain('class="scoreLabel"');
    expect(result).toContain('class="scoreValue"');
    expect(result).toContain('id="popup-score"');
  });

  it("sollte den Neustart-Button korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(EndOverlay, {
      props: {
        id: "test-overlay",
      },
    });

    expect(result).toContain('id="restart-button"');
    expect(result).toContain('class="restartButton"');
    expect(result).toContain('aria-label="Starte ein neues Spiel"');
    expect(result).toContain("Neues Spiel");
  });
});
