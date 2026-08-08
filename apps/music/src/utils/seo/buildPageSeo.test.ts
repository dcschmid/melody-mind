import { describe, expect, it, vi } from "vitest";
import { buildPageSeo } from "./buildPageSeo";

const baseParams = {
  description: "A test description for the page.",
  url: "https://melody-mind.de/test/",
};

describe("buildPageSeo title branding", () => {
  it("appends the brand suffix once", () => {
    const result = buildPageSeo({ ...baseParams, title: "Night Radio", memoize: false });

    expect(result.title).toBe("Night Radio - MelodyMind");

    const alreadyBranded = buildPageSeo({
      ...baseParams,
      title: "Night Radio - MelodyMind",
      memoize: false,
    });

    expect(alreadyBranded.title).toBe("Night Radio - MelodyMind");
  });

  it("normalizes the legacy brand suffix", () => {
    const result = buildPageSeo({
      ...baseParams,
      title: "Night Radio | Melody Mind",
      memoize: false,
    });

    expect(result.title).toBe("Night Radio - MelodyMind");
  });

  it("supports custom suffixes and disabling branding", () => {
    const custom = buildPageSeo({
      ...baseParams,
      title: "Night Radio",
      brandSuffix: " · Music",
      memoize: false,
    });
    const disabled = buildPageSeo({
      ...baseParams,
      title: "Night Radio",
      brandSuffix: false,
      memoize: false,
    });

    expect(custom.title).toBe("Night Radio · Music");
    expect(disabled.title).toBe("Night Radio");
  });
});

describe("buildPageSeo type inference", () => {
  it("maps content kinds to page and Open Graph types", () => {
    const cases = [
      { contentKind: "news", type: "article", ogType: "article" },
      { contentKind: "playlist", type: "musicPlaylist", ogType: "music.playlist" },
      { contentKind: "podcast", type: "podcastEpisode", ogType: "article" },
      { contentKind: "generic", type: "website", ogType: "website" },
    ] as const;

    for (const { contentKind, type, ogType } of cases) {
      const result = buildPageSeo({
        ...baseParams,
        title: "T",
        contentKind,
        memoize: false,
      });
      expect(result.type).toBe(type);
      expect(result.openGraph.type).toBe(ogType);
    }
  });

  it("prefers an explicit type over the content kind", () => {
    const result = buildPageSeo({
      ...baseParams,
      title: "T",
      contentKind: "news",
      type: "musicAlbum",
      memoize: false,
    });

    expect(result.type).toBe("musicAlbum");
    expect(result.openGraph.type).toBe("music.album");
  });
});

describe("buildPageSeo robots directives", () => {
  it("defaults to index and follow", () => {
    const result = buildPageSeo({ ...baseParams, title: "T", memoize: false });

    expect(result.robots).toBe("index,follow");
    expect(result.robotsDirectives).toEqual({ index: true, follow: true });
  });

  it("serializes every restriction into the robots string and directives", () => {
    const result = buildPageSeo({
      ...baseParams,
      title: "T",
      index: false,
      follow: false,
      noArchive: true,
      noImageIndex: true,
      maxSnippet: 50,
      maxImagePreview: "large",
      maxVideoPreview: 30,
      memoize: false,
    });

    expect(result.robots).toBe(
      "noindex,nofollow,noarchive,noimageindex,max-snippet:50,max-image-preview:large,max-video-preview:30"
    );
    expect(result.robotsDirectives).toEqual({
      index: false,
      follow: false,
      noarchive: true,
      noimageindex: true,
      maxSnippet: 50,
      maxImagePreview: "large",
      maxVideoPreview: 30,
    });
  });
});

describe("buildPageSeo social payloads", () => {
  it("uses the large image card when an image is present", () => {
    const result = buildPageSeo({
      ...baseParams,
      title: "T",
      image: "/og/test.jpg",
      imageAlt: "Alt text",
      ogLocale: "en_US",
      twitterCreator: "@melodymind",
      memoize: false,
    });

    expect(result.twitter.card).toBe("summary_large_image");
    expect(result.twitter.image).toBe("/og/test.jpg");
    expect(result.twitter.creator).toBe("@melodymind");
    expect(result.openGraph.image).toBe("/og/test.jpg");
    expect(result.openGraph.locale).toBe("en_US");
    expect(result.imageAlt).toBe("Alt text");
  });

  it("falls back to the summary card without an image", () => {
    const result = buildPageSeo({ ...baseParams, title: "T", memoize: false });

    expect(result.twitter.card).toBe("summary");
    expect(result.twitter.image).toBeUndefined();
    expect(result.image).toBeUndefined();
  });

  it("generates a social image only when opted in and no image exists", () => {
    const generateSocialImage = vi.fn(() => "/og/generated.jpg");

    const generated = buildPageSeo({
      ...baseParams,
      title: "T",
      autoSocialImage: true,
      generateSocialImage,
    });
    const withImage = buildPageSeo({
      ...baseParams,
      title: "T",
      image: "/og/explicit.jpg",
      autoSocialImage: true,
      generateSocialImage,
    });

    expect(generated.image).toBe("/og/generated.jpg");
    expect(withImage.image).toBe("/og/explicit.jpg");
    expect(generateSocialImage).toHaveBeenCalledTimes(1);
  });

  it("swallows social image generator errors and reports them", () => {
    const error = new Error("generation failed");
    const onSocialImageError = vi.fn();

    const result = buildPageSeo({
      ...baseParams,
      title: "T",
      autoSocialImage: true,
      generateSocialImage: () => {
        throw error;
      },
      onSocialImageError,
    });

    expect(result.image).toBeUndefined();
    expect(onSocialImageError).toHaveBeenCalledWith(error, {
      title: "T - MelodyMind",
      contentKind: "generic",
    });
  });
});

describe("buildPageSeo structured data", () => {
  it("injects a BreadcrumbList when breadcrumbs are provided", () => {
    const result = buildPageSeo({
      ...baseParams,
      title: "T",
      breadcrumbs: [
        { name: "Home", url: "https://melody-mind.de/" },
        { name: "Albums", url: "https://melody-mind.de/albums/" },
      ],
      memoize: false,
    });

    const breadcrumbs = result.structuredData.find(
      (entry) => entry["@type"] === "BreadcrumbList"
    );
    expect(breadcrumbs?.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://melody-mind.de/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Albums",
        item: "https://melody-mind.de/albums/",
      },
    ]);
  });

  it("keeps an explicit BreadcrumbList instead of duplicating it", () => {
    const explicit = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [],
    };

    const result = buildPageSeo({
      ...baseParams,
      title: "T",
      structuredData: [explicit],
      breadcrumbs: [{ name: "Home", url: "https://melody-mind.de/" }],
      memoize: false,
    });

    expect(result.structuredData).toHaveLength(1);
    expect(result.structuredData[0]).toBe(explicit);
  });
});

describe("buildPageSeo memoization", () => {
  it("returns the cached object for equivalent inputs regardless of key order", () => {
    const first = buildPageSeo({
      ...baseParams,
      title: "Cached",
      extraMeta: { a: "1", b: "2" },
    });
    const second = buildPageSeo({
      ...baseParams,
      title: "Cached",
      extraMeta: { b: "2", a: "1" },
    });

    expect(second).toBe(first);
  });

  it("skips the cache when memoization is disabled", () => {
    const first = buildPageSeo({ ...baseParams, title: "Fresh", memoize: false });
    const second = buildPageSeo({ ...baseParams, title: "Fresh", memoize: false });

    expect(second).not.toBe(first);
    expect(second.title).toBe(first.title);
  });
});

describe("buildPageSeo dates and description", () => {
  it("exposes publish and modified dates as Date instances", () => {
    const result = buildPageSeo({
      ...baseParams,
      title: "T",
      publishDate: "2026-01-15T00:00:00Z",
      modifiedDate: "2026-02-01T00:00:00Z",
      memoize: false,
    });

    expect(result.publishDate?.toISOString()).toBe("2026-01-15T00:00:00.000Z");
    expect(result.modifiedDate?.toISOString()).toBe("2026-02-01T00:00:00.000Z");
  });

  it("keeps the generated description within the meta limit", () => {
    const result = buildPageSeo({
      ...baseParams,
      title: "T",
      description:
        "A very long description that keeps going and going so the builder has to bound it for meta usage.",
      memoize: false,
    });

    expect(result.description.length).toBeGreaterThan(0);
    expect(result.description.length).toBeLessThanOrEqual(160);
    expect(result.openGraph.description).toBe(result.description);
  });
});
