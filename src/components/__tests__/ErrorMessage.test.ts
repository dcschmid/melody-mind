import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ErrorMessage from "../Shared/ErrorMessage.astro";

describe("ErrorMessage", () => {
  it("sollte die korrekte Grundstruktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ErrorMessage, {
      props: {
        message: "Fehlermeldung"
      }
    });

    expect(result).toContain('class="errorMessage hidden"');
    expect(result).toContain('data-auto-hide="5000"');
    expect(result).toContain("Fehlermeldung");
  });

  it("sollte das Warn-Icon korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ErrorMessage);

    expect(result).toContain('<span class="errorIcon"');
    expect(result).toContain('⚠️');
  });

  it("sollte optionale Props korrekt verarbeiten", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ErrorMessage, {
      props: {
        message: "Test",
        autoHide: 5000
      }
    });

    expect(result).toContain('data-auto-hide="5000"');
    expect(result).toContain("Test");
    expect(result).toContain('class="errorMessage hidden"');
  });

  it("sollte Standardwerte verwenden wenn keine Props übergeben werden", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ErrorMessage);

    expect(result).toContain('class="errorMessage hidden"');
    expect(result).toContain('class="closeButton"');
    expect(result).toContain('class="errorContent"');
    expect(result).toContain('data-auto-hide="5000"');
  });

  it("sollte den Schließen-Button korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ErrorMessage);

    expect(result).toContain('<button class="closeButton"');
    expect(result).toContain('×');
  });
});
