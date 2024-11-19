import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import LoadingSpinner from "../Game/LoadingSpinner.astro";

describe("LoadingSpinner", () => {
  it("sollte die korrekte Standardstruktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(LoadingSpinner);

    expect(result).toContain('class="spinnerContainer hidden"');
    expect(result).toContain('class="spinner spinner--large"');
    expect(result).toContain('role="status"');
    expect(result).toContain("Inhalte werden geladen...");
  });

  it("sollte die korrekten Zugänglichkeitsattribute haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(LoadingSpinner);

    expect(result).toContain('role="status"');
    expect(result).toContain('aria-live="polite"');
    expect(result).toContain('aria-busy="false"');
    expect(result).toContain('class="sr-only"');
  });

  it("sollte verschiedene Größen unterstützen", async () => {
    const container = await AstroContainer.create();

    const smallSpinner = await container.renderToString(LoadingSpinner, {
      props: { size: "small" },
    });
    expect(smallSpinner).toContain('class="spinner spinner--small"');

    const mediumSpinner = await container.renderToString(LoadingSpinner, {
      props: { size: "medium" },
    });
    expect(mediumSpinner).toContain('class="spinner spinner--medium"');

    const largeSpinner = await container.renderToString(LoadingSpinner, {
      props: { size: "large" },
    });
    expect(largeSpinner).toContain('class="spinner spinner--large"');
  });

  it("sollte benutzerdefinierte Labels unterstützen", async () => {
    const container = await AstroContainer.create();
    const customLabel = "Bitte warten...";

    const result = await container.renderToString(LoadingSpinner, {
      props: { label: customLabel },
    });

    expect(result).toContain(customLabel);
  });

  it("sollte eine benutzerdefinierte ID unterstützen", async () => {
    const container = await AstroContainer.create();
    const customId = "custom-spinner";

    const result = await container.renderToString(LoadingSpinner, {
      props: { id: customId },
    });

    expect(result).toContain(`id="${customId}"`);
  });
});
