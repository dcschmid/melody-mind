import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ShowCoins from "../Shared/ShowCoins.astro";

describe("ShowCoins", () => {
  it("sollte die korrekte Grundstruktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ShowCoins);

    expect(result).toContain('class="coinsContainer"');
    expect(result).toContain('class="coinsDisplay"');
    expect(result).toContain('class="coinsCount"');
  });

  it("sollte das Münz-Icon korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ShowCoins);

    expect(result).toContain('class="coinIcon"');
    expect(result).toContain('data-icon="coin"');
    expect(result).toContain('width="24"');
    expect(result).toContain('height="24"');
  });

  it("sollte den Münzzähler korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ShowCoins);

    expect(result).toContain('<span class="count" data-astro-cid');
    expect(result).toContain(">0</span>");
    expect(result).toContain('<span class="sr-only"');
    expect(result).toContain(">Gesammelte Münzen:</span>");
  });

  it("sollte die korrekten ARIA-Attribute haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ShowCoins);

    expect(result).toContain('role="status"');
    expect(result).toContain('aria-label="Gesammelte Münzen"');
    expect(result).toContain('aria-live="polite"');
    expect(result).toContain('aria-atomic="true"');
  });

  it("sollte das Icon als dekorativ markieren", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ShowCoins);

    expect(result).toContain('aria-hidden="true"');
  });
});
