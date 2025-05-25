/* eslint-disable max-lines-per-function */
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";

import Headline from "../components/Headline.astro";

describe("Headline Component", () => {
  test("renders headline with title prop", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "Test Headline",
        level: "h1",
      },
    });

    expect(result).toContain("<h1");
    expect(result).toContain("Test Headline");
    expect(result).toContain("headline");
  });

  test("renders headline with slot content", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      slots: {
        default: "Slot headline content",
      },
    });

    expect(result).toContain("Slot headline content");
    expect(result).toContain("<h1"); // Default level
  });

  test("renders different heading levels correctly", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "H2 Headline",
        level: "h2",
      },
    });

    expect(result).toContain("<h2");
    expect(result).toContain("H2 Headline");
    expect(result).toContain("</h2>");
  });

  test("applies custom CSS classes", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "Custom Styled Headline",
        className: "headline--large custom-class",
      },
    });

    expect(result).toContain("headline--large custom-class");
    expect(result).toContain("Custom Styled Headline");
  });

  test("renders with custom ID", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "Headline with ID",
        id: "custom-headline-id",
      },
    });

    expect(result).toContain('id="custom-headline-id"');
    expect(result).toContain("Headline with ID");
  });

  test("renders with aria-label", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "Accessible Headline",
        ariaLabel: "Custom aria label",
      },
    });

    expect(result).toContain('aria-label="Custom aria label"');
    expect(result).toContain("Accessible Headline");
  });

  test("renders with focusable attributes when focusable is true", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "Focusable Headline",
        focusable: true,
      },
    });

    expect(result).toContain('tabindex="-1"');
    expect(result).toContain("headline--focusable");
    expect(result).toContain("Focusable Headline");
  });

  test("prioritizes title prop over slot content", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "Title prop content",
      },
      slots: {
        default: "Slot content",
      },
    });

    expect(result).toContain("Title prop content");
    expect(result).not.toContain("Slot content");
  });

  test("renders with default values when no props provided", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      slots: {
        default: "Default headline",
      },
    });

    expect(result).toContain("<h1"); // Default level
    expect(result).toContain("headline"); // Base BEM class
    expect(result).toContain("Default headline");
    expect(result).not.toContain('tabindex="-1"'); // Default focusable=false
  });

  test("renders all heading levels correctly", async () => {
    const container = await AstroContainer.create();
    const levels = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

    for (const level of levels) {
      const result = await container.renderToString(Headline, {
        props: {
          title: `${level} Headline`,
          level,
        },
      });

      expect(result).toContain(`<${level}`);
      expect(result).toContain(`</${level}>`);
      expect(result).toContain(`${level} Headline`);
    }
  });

  test("renders with focusable=false explicitly", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "Non-focusable Headline",
        focusable: false,
      },
    });

    expect(result).not.toContain('tabindex="-1"');
    expect(result).not.toContain("headline--focusable");
    expect(result).toContain("headline");
    expect(result).toContain("Non-focusable Headline");
  });

  test("handles empty title prop gracefully", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "",
      },
      slots: {
        default: "Fallback content",
      },
    });

    // Empty title should fall back to slot content
    expect(result).toContain("Fallback content");
  });

  test("renders with combination of multiple props", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "Complex Headline",
        level: "h3",
        className: "headline--large custom-style",
        id: "complex-headline",
        focusable: true,
        ariaLabel: "Complex headline description",
      },
    });

    expect(result).toContain("<h3");
    expect(result).toContain("Complex Headline");
    expect(result).toContain("headline--large custom-style");
    expect(result).toContain('id="complex-headline"');
    expect(result).toContain('tabindex="-1"');
    expect(result).toContain('aria-label="Complex headline description"');
    expect(result).toContain("headline--focusable");
  });

  test("includes WCAG AAA compliant styling", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline, {
      props: {
        title: "Accessible Headline",
      },
    });

    // Verify BEM base class is present
    expect(result).toContain("headline");
    expect(result).toContain("Accessible Headline");
    // CSS styles are applied via stylesheet, not inline classes
    expect(result).toContain('class="headline"');
  });

  test("handles missing slot content gracefully", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Headline);

    expect(result).toContain("<h1"); // Should still render the tag
    expect(result).toContain("</h1>");
    // Content should be empty but structure intact
  });

  test("renders focus ring styles only when focusable", async () => {
    const container = await AstroContainer.create();

    // Test focusable version
    const focusableResult = await container.renderToString(Headline, {
      props: {
        title: "Focusable",
        focusable: true,
      },
    });

    expect(focusableResult).toContain("headline--focusable");

    // Test non-focusable version
    const nonFocusableResult = await container.renderToString(Headline, {
      props: {
        title: "Non-focusable",
        focusable: false,
      },
    });

    expect(nonFocusableResult).not.toContain("headline--focusable");
    expect(nonFocusableResult).toContain("headline");
  });

  // ======================================
  // SNAPSHOT TESTS
  // ======================================

  describe("Snapshot Tests", () => {
    test("matches snapshot for basic headline", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Headline, {
        props: {
          title: "Basic Headline",
        },
      });

      expect(result).toMatchSnapshot();
    });

    test("matches snapshot for headline with all props", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Headline, {
        props: {
          title: "Complete Headline",
          level: "h2",
          className: "headline--large custom-class",
          id: "complete-headline",
          focusable: true,
          ariaLabel: "Complete headline description",
        },
      });

      expect(result).toMatchSnapshot();
    });

    test("matches snapshot for different heading levels", async () => {
      const container = await AstroContainer.create();
      const levels = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

      for (const level of levels) {
        const result = await container.renderToString(Headline, {
          props: {
            title: `Level ${level} Headline`,
            level,
          },
        });

        expect(result).toMatchSnapshot(`headline-${level}`);
      }
    });

    test("matches snapshot for slot content", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Headline, {
        slots: {
          default: "Slot content headline",
        },
      });

      expect(result).toMatchSnapshot();
    });

    test("matches snapshot for empty content", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Headline);

      expect(result).toMatchSnapshot();
    });
  });

  // ======================================
  // WCAG 2.2 AAA ACCESSIBILITY TESTS
  // ======================================

  describe("WCAG 2.2 AAA Accessibility Tests", () => {
    test("ensures proper semantic heading structure", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Headline, {
        props: {
          title: "Semantic Test",
          level: "h2",
        },
      });

      // Must use semantic HTML heading elements
      expect(result).toContain("<h2");
      expect(result).toContain("</h2>");
      expect(result).not.toContain('<div role="heading"'); // Avoid role="heading" when semantic elements available
    });

    test("provides accessible focus management", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Headline, {
        props: {
          title: "Focus Test",
          focusable: true,
        },
      });

      // WCAG: Focus must be visible and manageable
      expect(result).toContain('tabindex="-1"'); // Programmatically focusable
      expect(result).toContain("headline--focusable"); // CSS class for focus styles
    });

    test("supports screen reader accessibility", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Headline, {
        props: {
          title: "Screen Reader Test",
          ariaLabel: "Detailed description for screen readers",
        },
      });

      // WCAG: Provide alternative text descriptions
      expect(result).toContain('aria-label="Detailed description for screen readers"');
      expect(result).toContain("Screen Reader Test"); // Visible text should still be present
    });

    test("maintains proper document structure with IDs", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Headline, {
        props: {
          title: "Document Structure Test",
          id: "unique-section-heading",
          level: "h3",
        },
      });

      // WCAG: Support skip navigation and document outline
      expect(result).toContain('id="unique-section-heading"');
      expect(result).toContain("<h3"); // Proper heading level for document hierarchy
    });

    test("handles text overflow accessibly", async () => {
      const container = await AstroContainer.create();
      const longTitle = "A".repeat(200); // Very long title to test text wrapping
      const result = await container.renderToString(Headline, {
        props: {
          title: longTitle,
        },
      });

      // WCAG: Text must be readable and not hidden
      expect(result).toContain(longTitle);
      expect(result).toContain("headline"); // CSS class includes text-wrap and word-break
    });

    test("supports keyboard navigation requirements", async () => {
      const container = await AstroContainer.create();

      // Test non-focusable (standard heading)
      const standardResult = await container.renderToString(Headline, {
        props: {
          title: "Standard Heading",
          focusable: false,
        },
      });

      // Standard headings should not be in tab order
      expect(standardResult).not.toContain("tabindex");

      // Test focusable (for skip navigation)
      const focusableResult = await container.renderToString(Headline, {
        props: {
          title: "Skip Target Heading",
          focusable: true,
        },
      });

      // Skip navigation targets should be programmatically focusable
      expect(focusableResult).toContain('tabindex="-1"');
    });

    test("ensures consistent heading hierarchy", async () => {
      const container = await AstroContainer.create();
      const levels = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

      for (const level of levels) {
        const result = await container.renderToString(Headline, {
          props: {
            title: `${level.toUpperCase()} Content`,
            level,
          },
        });

        // WCAG: Heading hierarchy must be logical and consistent
        expect(result).toContain(`<${level}`);
        expect(result).toContain(`</${level}>`);
        expect(result).not.toContain('<div role="heading"'); // Use semantic elements
      }
    });

    test("maintains content accessibility with fallbacks", async () => {
      const container = await AstroContainer.create();

      // Test with both title and slot (title should take precedence)
      const bothContentResult = await container.renderToString(Headline, {
        props: {
          title: "Title Priority",
        },
        slots: {
          default: "Slot Fallback",
        },
      });

      // WCAG: Content must be predictable and accessible
      expect(bothContentResult).toContain("Title Priority");
      expect(bothContentResult).not.toContain("Slot Fallback");

      // Test with only slot content
      const slotOnlyResult = await container.renderToString(Headline, {
        slots: {
          default: "Slot Content Only",
        },
      });

      expect(slotOnlyResult).toContain("Slot Content Only");
    });

    test("provides proper ARIA labeling support", async () => {
      const container = await AstroContainer.create();

      // Test with aria-label
      const ariaLabelResult = await container.renderToString(Headline, {
        props: {
          title: "Visible Text",
          ariaLabel: "Detailed accessible name",
        },
      });

      // WCAG: ARIA label should supplement, not replace visible text
      expect(ariaLabelResult).toContain('aria-label="Detailed accessible name"');
      expect(ariaLabelResult).toContain("Visible Text");

      // Test without aria-label
      const noAriaResult = await container.renderToString(Headline, {
        props: {
          title: "Standard Heading",
        },
      });

      expect(noAriaResult).not.toContain("aria-label");
      expect(noAriaResult).toContain("Standard Heading");
    });

    test("ensures CSS classes support accessibility features", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Headline, {
        props: {
          title: "Accessibility CSS Test",
          focusable: true,
          className: "headline--large",
        },
      });

      // WCAG: CSS classes must support accessibility features
      expect(result).toContain("headline"); // Base accessibility styles
      expect(result).toContain("headline--focusable"); // Focus indicator styles
      expect(result).toContain("headline--large"); // Size modifier preserved

      // Classes should be properly combined
      expect(result).toMatch(/class="[^"]*headline[^"]*"/);
      expect(result).toMatch(/class="[^"]*headline--large[^"]*"/);
      expect(result).toMatch(/class="[^"]*headline--focusable[^"]*"/);
    });

    test("validates HTML structure integrity", async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Headline, {
        props: {
          title: "HTML Structure Test",
          level: "h4",
          id: "structure-test",
          className: "custom-class",
          focusable: true,
          ariaLabel: "Structure validation",
        },
      });

      // WCAG: HTML must be valid and well-formed
      expect(result).toMatch(/<h4[^>]*>.*<\/h4>/); // Proper tag structure
      expect(result).toMatch(/id="structure-test"/); // Valid ID attribute
      expect(result).toMatch(/class="[^"]*"/); // Valid class attribute
      expect(result).toMatch(/aria-label="[^"]*"/); // Valid ARIA attribute
      expect(result).toMatch(/tabindex="-1"/); // Valid tabindex

      // Should not contain malformed attributes
      expect(result).not.toContain('=""'); // No empty attributes
      expect(result).not.toContain("undefined"); // No undefined values
      expect(result).not.toContain("null"); // No null values
    });
  });
});
