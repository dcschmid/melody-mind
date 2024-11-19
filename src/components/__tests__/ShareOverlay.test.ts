import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ShareOverlay from "../Overlays/ShareOverlay.astro";

describe("ShareOverlay", () => {
  it("sollte die korrekte Standardstruktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ShareOverlay);

    expect(result).toContain('class="shareContainer"');
    expect(result).toContain('class="shareButtons"');
    expect(result).toContain("Teile deinen Erfolg!");
  });

  it("sollte die korrekten Social-Media-Buttons rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ShareOverlay);

    // Facebook Button
    expect(result).toContain('class="shareButton facebook"');
    expect(result).toContain('data-share="facebook"');
    expect(result).toContain('aria-label="Auf Facebook teilen"');

    // WhatsApp Button
    expect(result).toContain('class="shareButton whatsapp"');
    expect(result).toContain('data-share="whatsapp"');
    expect(result).toContain('aria-label="Über WhatsApp teilen"');
  });

  it("sollte die korrekten Zugänglichkeitsattribute haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ShareOverlay);

    expect(result).toContain('role="group"');
    expect(result).toContain('aria-label="Social Media Teilen-Optionen"');
  });

  it("sollte die korrekte Icon-Integration haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ShareOverlay);

    expect(result).toContain('data-icon="facebook"');
    expect(result).toContain('data-icon="whatsapp"');
  });
});
