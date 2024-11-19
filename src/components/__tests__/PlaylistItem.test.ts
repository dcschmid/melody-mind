import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import PlaylistItem from "../PlaylistItem.astro";

describe("PlaylistItem", () => {
  it("sollte ein aktives Playlist-Item korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PlaylistItem, {
      props: {
        headline: "Test Playlist",
        image: "/test-image.jpg",
        imageAlt: "Test Alt Text",
        isDisabled: false,
      },
    });

    expect(result).toContain('class="playlistItem"');
    expect(result).toContain('src="/test-image.jpg"');
    expect(result).toContain('alt="Test Alt Text"');
    expect(result).toContain(">Test Playlist</h2>");
    expect(result).not.toContain('class="disabled"');
  });

  it("sollte ein deaktiviertes Playlist-Item korrekt rendern", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PlaylistItem, {
      props: {
        headline: "Test Playlist",
        image: "/test-image.jpg",
        imageAlt: "Test Alt Text",
        isDisabled: true,
      },
    });

    expect(result).toContain('class="playlistItem"');
    expect(result).toContain('class="disabled"');
    expect(result).toContain('role="status"');
    expect(result).toContain("Demnächst verfügbar");
  });

  it("sollte die Bildoptimierung korrekt konfigurieren", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PlaylistItem, {
      props: {
        headline: "Test Playlist",
        image: "/test-image.jpg",
        imageAlt: "Test Alt Text",
        isDisabled: false,
      },
    });

    expect(result).toContain('width="130"');
    expect(result).toContain('height="130"');
    expect(result).toContain('loading="lazy"');
    expect(result).toContain('decoding="async"');
    expect(result).toContain('type="image/avif"');
    expect(result).toContain('type="image/webp"');
  });

  it("sollte die korrekte fetchpriority basierend auf isDisabled setzen", async () => {
    const container = await AstroContainer.create();

    const activeResult = await container.renderToString(PlaylistItem, {
      props: {
        headline: "Test Playlist",
        image: "/test-image.jpg",
        imageAlt: "Test Alt Text",
        isDisabled: false,
      },
    });
    expect(activeResult).toContain('fetchpriority="auto"');

    const disabledResult = await container.renderToString(PlaylistItem, {
      props: {
        headline: "Test Playlist",
        image: "/test-image.jpg",
        imageAlt: "Test Alt Text",
        isDisabled: true,
      },
    });
    expect(disabledResult).toContain('fetchpriority="low"');
  });
});
