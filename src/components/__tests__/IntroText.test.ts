import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import IntroText from "../Shared/IntroText.astro";

describe("IntroText", () => {
  it("sollte die korrekte Grundstruktur haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(IntroText, {
      props: {
        headline: "Test Headline",
        subline: "Test Subline",
      },
    });

    expect(result).toContain('class="introSection"');
    expect(result).toContain('class="headline"');
    expect(result).toContain('class="subline"');
  });

  it("sollte Headline und Subline korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(IntroText, {
      props: {
        headline: "Test Headline",
        subline: "Test Subline",
      },
    });

    expect(result).toContain("Test Headline");
    expect(result).toContain("Test Subline");
  });

  it("sollte nur Headline ohne Subline rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(IntroText, {
      props: {
        headline: "Only Headline",
      },
    });

    expect(result).toContain("Only Headline");
    expect(result).toContain('class="headline"');
    expect(result).not.toContain('class="subline"');
  });

  it("sollte Standardwerte verwenden wenn keine Props übergeben werden", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(IntroText);

    expect(result).toContain('class="introSection"');
    expect(result).toContain('class="headline"');
  });

  it("sollte die korrekten ARIA-Attribute haben", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(IntroText, {
      props: {
        headline: "Test Headline",
      },
    });

    expect(result).toContain('role="region"');
    expect(result).toContain('aria-labelledby="intro-heading"');
    expect(result).toContain('id="intro-heading"');
  });
});
