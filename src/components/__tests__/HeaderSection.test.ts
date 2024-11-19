import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import HeaderSection from "../User/HeaderSection.astro";

describe("HeaderSection", () => {
  it("sollte die korrekte Grundstruktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HeaderSection);

    expect(result).toContain('class="profileHeader"');
    expect(result).toContain('class="headerContent"');
    expect(result).toContain('class="avatarWrapper"');
    expect(result).toContain('class="pointsDisplay"');
  });

  it("sollte das Profilbild korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HeaderSection);

    expect(result).toContain('class="avatarImage"');
    expect(result).toContain('src="/user-profiles/mika.png"');
    expect(result).toContain('width="128"');
    expect(result).toContain('height="128"');
    expect(result).toContain('type="image/avif"');
    expect(result).toContain('type="image/webp"');
  });

  it("sollte die Punkteanzeige korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HeaderSection);

    expect(result).toContain('class="coinIcon"');
    expect(result).toContain('class="pointsValue"');
    expect(result).toContain('<span class="sr-only"');
    expect(result).toContain(">Punktestand:</span>");
  });

  it("sollte die korrekten ARIA-Attribute haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HeaderSection);

    expect(result).toContain('role="banner"');
    expect(result).toContain('aria-label="Benutzerprofil Header"');
    expect(result).toContain('role="status"');
    expect(result).toContain('aria-live="polite"');
    expect(result).toContain('aria-atomic="true"');
  });

  it("sollte den Standardbenutzer verwenden wenn kein Benutzer übergeben wird", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HeaderSection);

    expect(result).toContain('aria-label="Profilbild von Mika"');
    expect(result).toContain('src="/user-profiles/mika.png"');
  });

  it("sollte einen benutzerdefinierten Benutzer korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HeaderSection);

    expect(result).toContain('aria-label="Profilbild von Mika"');
    expect(result).toContain('src="/user-profiles/mika.png"');
  });
});
