import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Button from "../Shared/Button.astro";

describe("Button", () => {
  it("sollte die korrekte Grundstruktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        buttonText: "Klick mich",
        url: "/test"
      }
    });

    expect(result).toContain('class="button"');
    expect(result).toContain('href="/test"');
    expect(result).toContain("Klick mich");
  });

  it("sollte das Next-Icon korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button);

    expect(result).toContain('<svg');
    expect(result).toContain('data-icon="next"');
    expect(result).toContain('width="24"');
    expect(result).toContain('height="24"');
  });

  it("sollte optionale Props korrekt verarbeiten", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button, {
      props: {
        id: "test-button",
        buttonText: "Test",
        url: "#"
      }
    });

    expect(result).toContain('id="test-button"');
    expect(result).toContain('href="#"');
    expect(result).toContain("Test");
  });

  it("sollte Standardwerte verwenden wenn keine Props übergeben werden", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button);

    expect(result).toMatch(/<a[^>]*class="button"[^>]*>/);
    expect(result).not.toMatch(/<a[^>]*id="[^"]*"[^>]*>/);
    expect(result).toContain('href=""');
    expect(result).toContain('class="button"');
  });

  it("sollte als Link-Element gerendert werden", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Button);

    expect(result).toMatch(/<a[^>]*>/);
    expect(result).toMatch(/<\/a>/);
  });
});
