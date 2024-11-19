import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import GameHeadline from "../Game/GameHeadline.astro";

describe("GameHeadline", () => {
  it("sollte die korrekte Struktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GameHeadline, {
      props: {
        category: "Test Headline",
      },
    });

    expect(result).toContain('class="gameHeadline"');
    expect(result).toContain('role="banner"');
    expect(result).toContain('<h1 class="category"');
    expect(result).toContain("Spiel");
  });

  it("sollte die korrekte Zugänglichkeitsattribute haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GameHeadline, {
      props: {
        category: "Test Headline",
      },
    });

    expect(result).toContain('aria-label="Spielinformationen"');
    expect(result).toContain('aria-live="polite"');
    expect(result).toContain('role="status"');
    expect(result).toContain('aria-label="Aktuelle Rundennummer"');
  });

  it("sollte die korrekte Klassenstruktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(GameHeadline, {
      props: {
        category: "Test Headline",
      },
    });

    expect(result).toContain('class="gameHeadline"');
    expect(result).toContain('class="category"');
    expect(result).toContain('class="roundInfo"');
    expect(result).toContain('class="round"');
    expect(result).toContain('id="game-category"');
  });
});
