import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Joker from "../Game/Joker.astro";

describe("Joker", () => {
  it("sollte die korrekte Struktur und Inhalte haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Joker);

    // Überprüfung der Grundstruktur
    expect(result).toContain('class="jokerContainer"');
    expect(result).toContain('class="jokerButton"');
    expect(result).toContain("50:50 Joker");
    expect(result).toContain('data-joker-type="fifty-fifty"');
  });

  it("sollte die korrekten Zugänglichkeitsattribute haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Joker);

    // Überprüfung der ARIA-Attribute
    expect(result).toContain('role="group"');
    expect(result).toContain('aria-labelledby="joker-title"');
    expect(result).toContain('aria-describedby="joker-description"');
    expect(result).toContain('id="joker-title"');
  });

  it("sollte die korrekte Beschreibung enthalten", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Joker);

    // Überprüfung des Beschreibungstexts
    expect(result).toContain('id="joker-description"');
    expect(result).toContain("Entfernt zwei falsche Antwortmöglichkeiten");
  });

  it("sollte alle erforderlichen CSS-Klassen haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Joker);

    // Überprüfung der CSS-Klassen
    expect(result).toContain('class="jokerContainer"');
    expect(result).toContain('class="jokerButton"');
    expect(result).toContain('class="buttonText"');
    expect(result).toContain('class="jokerCount"');
    expect(result).toContain('class="sr-only"');
  });
});
