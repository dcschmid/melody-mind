import { describe, expect, it } from "vitest";
import {
  buildArticleSchema,
  buildCollectionPageSchema,
  buildFaqPageSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "./seoSchema";

const siteUrl = "https://melody-mind.de";

describe("buildOrganizationSchema", () => {
  it("builds the organization node with a default logo", () => {
    const schema = buildOrganizationSchema({
      siteUrl: `${siteUrl}/`,
      siteName: "MelodyMind",
    });

    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: "MelodyMind",
      url: `${siteUrl}/`,
      description: undefined,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/web-app-manifest-512x512.png`,
      },
    });
  });
});

describe("buildWebSiteSchema", () => {
  it("links the organization and omits the search action by default", () => {
    const schema = buildWebSiteSchema({ siteUrl: `${siteUrl}/`, siteName: "MelodyMind" });

    expect(schema["@id"]).toBe(`${siteUrl}#website`);
    expect(schema.url).toBe(siteUrl);
    expect(schema.publisher).toEqual({ "@id": `${siteUrl}#organization` });
    expect(schema.potentialAction).toBeUndefined();
  });

  it("adds a search action only with a template", () => {
    const schema = buildWebSiteSchema({
      siteUrl,
      siteName: "MelodyMind",
      searchPathTemplate: "/search/?q={search_term_string}",
    });

    expect(schema.potentialAction).toEqual({
      "@type": "SearchAction",
      target: `${siteUrl}/search/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    });
  });
});

describe("buildCollectionPageSchema", () => {
  it("links the page to the website and organization nodes", () => {
    const schema = buildCollectionPageSchema({
      url: `${siteUrl}/genre/metal/`,
      name: "Metal",
    });

    expect(schema["@id"]).toBe(`${siteUrl}/genre/metal/#collectionpage`);
    expect(schema.inLanguage).toBe("en");
    expect(schema.isPartOf).toEqual({ "@id": `${siteUrl}#website` });
    expect(schema.about).toEqual({ "@id": `${siteUrl}#organization` });
    expect(schema.mainEntity).toBeUndefined();
  });

  it("adds language and main entity when provided", () => {
    const schema = buildCollectionPageSchema({
      url: `${siteUrl}/genre/metal/`,
      name: "Metal",
      lang: "de",
      mainEntityId: `${siteUrl}#music-collection`,
    });

    expect(schema.inLanguage).toBe("de");
    expect(schema.mainEntity).toEqual({ "@id": `${siteUrl}#music-collection` });
  });
});

describe("buildArticleSchema", () => {
  const baseOptions = {
    canonical: `${siteUrl}/stories/test/`,
    title: "Test Story",
    description: "A test story description.",
  };

  it("normalizes dates and derives the word count from the body", () => {
    const schema = buildArticleSchema({
      ...baseOptions,
      createdAt: "2026-01-15T00:00:00Z",
      updatedAt: new Date("2026-02-01T00:00:00Z"),
      body: "<p>Hello brave new world</p>",
      keywords: ["metal", "stories"],
    });

    expect(schema["@type"]).toBe("Article");
    expect(schema.datePublished).toBe("2026-01-15T00:00:00.000Z");
    expect(schema.dateModified).toBe("2026-02-01T00:00:00.000Z");
    expect(schema.wordCount).toBe(4);
    expect(schema.keywords).toBe("metal, stories");
    expect(schema.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": `${siteUrl}/stories/test/`,
    });
  });

  it("drops invalid dates and empty enrichment fields", () => {
    const schema = buildArticleSchema({
      ...baseOptions,
      createdAt: "not a date",
      keywords: [],
    });

    expect(schema.datePublished).toBeUndefined();
    expect(schema.dateModified).toBeUndefined();
    expect(schema.keywords).toBeUndefined();
    expect(schema.wordCount).toBeUndefined();
    expect(schema.about).toBeUndefined();
  });

  it("supports the podcast episode variant and enrichment lists", () => {
    const schema = buildArticleSchema({
      ...baseOptions,
      schemaType: "PodcastEpisode",
      about: [{ name: "Metal", sameAs: "https://example.org/metal" }],
      mentions: [{ name: "MelodyMind" }],
      sameAs: ["https://example.org/related"],
      citations: [{ name: "Source", url: "https://example.org/source" }],
    });

    expect(schema["@type"]).toBe("PodcastEpisode");
    expect(schema.about).toEqual([
      { "@type": "Thing", name: "Metal", sameAs: "https://example.org/metal" },
    ]);
    expect(schema.mentions).toEqual([{ "@type": "Thing", name: "MelodyMind" }]);
    expect(schema.sameAs).toEqual(["https://example.org/related"]);
    expect(schema.citation).toEqual([
      { "@type": "CreativeWork", name: "Source", url: "https://example.org/source" },
    ]);
  });
});

describe("buildFaqPageSchema", () => {
  it("returns undefined without items", () => {
    expect(buildFaqPageSchema([])).toBeUndefined();
  });

  it("maps questions and answers", () => {
    const schema = buildFaqPageSchema([
      { question: "What is this?", answer: "A music site." },
    ]) as Record<string, unknown>;

    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "What is this?",
        acceptedAnswer: { "@type": "Answer", text: "A music site." },
      },
    ]);
  });
});
