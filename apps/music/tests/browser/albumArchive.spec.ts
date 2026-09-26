import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

// The catalog is pruned and extended over time (134 albums were removed in a
// single commit), so archive *pagination* is exercised against a synthesized
// search index served through page.route. SSR assertions target whatever the
// build actually ships (one card per album entry), never a fixed count.
const SYNTHETIC_COUNT = 48;
const SYNTHETIC_QUERY = "browser";
const SYNTHETIC_TOTAL = SYNTHETIC_COUNT; // the query "browser" matches only synthesized records

const syntheticRecords = Array.from({ length: SYNTHETIC_COUNT }, (_, index) => {
  const id = `browser-test-album-${index + 1}`;
  return {
    id,
    url: `/${id}/`,
    title: `Browser Test Album ${index + 1}`,
    description: "Synthesized record for archive search coverage.",
    genre: "Synth Pop",
    trackCount: 2,
    seriesTitle: undefined,
    searchText: `browser test album ${index + 1}`,
    imageSrc: "/favicon.svg",
  };
});

const fulfillSyntheticSearchIndex = async (page: Page) => {
  await page.route("**/album-search-index.json", async (route) => {
    const live = await route.fetch().then((response) => response.json());
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify([...(Array.isArray(live) ? live : []), ...syntheticRecords]),
    });
  });
};

const readItemListSchema = async (page: Page) =>
  page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => {
    const nodes = scripts.map((script) => JSON.parse(script.textContent ?? "null"));
    return nodes.find((node) => node?.["@type"] === "ItemList");
  });

const liveCardCount = async (page: Page) =>
  page.locator('[data-testid="album-archive-card"]').count();

test("serves the SSR archive with page-specific SEO", async ({ page }) => {
  await page.goto("/albums/");
  const total = await liveCardCount(page);
  expect(total).toBeGreaterThan(0);
  await expect(page.getByText(`Showing 1–${total} of ${total}`)).toBeVisible();

  const firstSchema = await readItemListSchema(page);
  expect(firstSchema.itemListOrder).toBe("https://schema.org/ItemListOrderAscending");
  expect(firstSchema.itemListElement[0].position).toBe(1);
  expect(firstSchema.itemListElement).toHaveLength(total);

  // With a catalog that fits on one page there is no second page to link to.
  const pagination = page.getByRole("navigation", { name: "Album archive pages" });
  if (await pagination.count()) {
    await expect(pagination.getByRole("link", { name: "Next", exact: true })).toHaveCount(
      0
    );
  }
});

test("searches the full archive, pages results, and restores the SSR page", async ({
  page,
}) => {
  await fulfillSyntheticSearchIndex(page);
  await page.goto("/albums/");

  const staticGrid = page.locator("[data-album-archive-grid]");
  const results = page.locator("[data-album-search-results]");
  const input = page.getByLabel("Filter all albums");
  const status = page.locator("[data-album-search-status]");

  await expect(staticGrid).toBeVisible();
  expect(
    await staticGrid.getByRole("heading", { name: "Browser Test Album 1" }).count()
  ).toBe(0);

  await input.fill("Browser Test Album 7");
  await expect(status).toHaveText("Showing 1–1 of 1 matching albums.");
  await expect(staticGrid).toBeHidden();
  await expect(results).toBeVisible();
  await expect(
    results.getByRole("heading", { name: "Browser Test Album 7" })
  ).toBeVisible();
  await expect(
    results.getByRole("link", { name: "Browser Test Album 7", exact: true })
  ).toHaveAttribute("href", "/browser-test-album-7/");
  expect(new URL(page.url()).searchParams.get("filter")).toBe("Browser Test Album 7");

  await page.reload();
  await expect(input).toHaveValue("Browser Test Album 7");
  await expect(status).toHaveText("Showing 1–1 of 1 matching albums.");
  await expect(
    results.getByRole("heading", { name: "Browser Test Album 7" })
  ).toBeVisible();

  await input.fill(SYNTHETIC_QUERY);
  await expect(status).toHaveText(`Showing 1–24 of ${SYNTHETIC_TOTAL} matching albums.`);
  await expect(results.locator("[data-album-search-result]")).toHaveCount(24);
  const resultPages = page.locator("[data-album-search-result-pages]");
  await expect(resultPages).toBeVisible();
  await resultPages.getByRole("button", { name: "Next" }).click();
  await expect(page.locator("[data-album-search-result-page]")).toHaveText(
    /^Page 2 of \d+$/
  );
  expect(new URL(page.url()).searchParams.get("resultsPage")).toBe("2");

  await page.goto(`/albums/?filter=${SYNTHETIC_QUERY}&resultsPage=999`);
  const clampedPageLabel = page.locator("[data-album-search-result-page]");
  await expect(clampedPageLabel).toHaveText(/^Page \d+ of \d+$/);
  const clampedPageMatch = (await clampedPageLabel.textContent())?.match(
    /^Page (\d+) of (\d+)$/
  );
  expect(clampedPageMatch?.[1]).toBe(clampedPageMatch?.[2]);
  await expect(
    page.locator("[data-album-search-result-pages]").getByRole("button", { name: "Next" })
  ).toBeDisabled();

  await input.fill("zzzz-no-album-matches");
  await expect(status).toHaveText("No albums match this filter.");
  await expect(results).toBeHidden();
  await expect(resultPages).toBeHidden();

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(staticGrid).toBeVisible();
  await expect(page.locator("[data-album-archive-pagination]")).toBeVisible();
  expect(new URL(page.url()).searchParams.has("filter")).toBe(false);
  expect(new URL(page.url()).searchParams.has("resultsPage")).toBe(false);
});

test("keeps the paginated archive when the search index is unavailable", async ({
  page,
}) => {
  await page.route("**/album-search-index.json", (route) =>
    route.fulfill({ status: 503, body: "unavailable" })
  );
  await page.goto("/albums/?filter=browser");

  await expect(page.locator("[data-album-archive-grid]")).toBeVisible();
  await expect(page.locator("[data-album-search-results]")).toBeHidden();
  await expect(page.locator("[data-album-archive-pagination]")).toBeVisible();
  await expect(page.locator("[data-album-search-status]")).toHaveText(
    "Search is temporarily unavailable. The paginated archive remains below."
  );
});

test("keeps the SSR archive usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/albums/");

  await expect(page.locator("[data-album-archive-controls]")).toBeHidden();
  expect(await liveCardCount(page)).toBeGreaterThan(0);
  await expect(
    page.locator('[data-testid="album-archive-card"] a').first()
  ).toBeVisible();

  await context.close();
});
