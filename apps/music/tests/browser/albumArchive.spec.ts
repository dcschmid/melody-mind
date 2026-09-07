import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const TARGET_TITLE = "Zwischen Akten und Asphalt";
const TARGET_PATH = "/zwischen-akten-und-asphalt/";

const readItemListSchema = async (page: Page) =>
  page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => {
    const nodes = scripts.map((script) => JSON.parse(script.textContent ?? "null"));
    return nodes.find((node) => node?.["@type"] === "ItemList");
  });

test("paginates the alphabetical archive with page-specific SEO", async ({ page }) => {
  await page.goto("/albums/");

  const firstPageCards = page.locator('[data-testid="album-archive-card"]');
  await expect(firstPageCards).toHaveCount(24);
  await expect(page.getByText(/^Showing 1–24 of \d+$/)).toBeVisible();

  const pagination = page.getByRole("navigation", { name: "Album archive pages" });
  await expect(pagination).toBeVisible();
  await expect(
    pagination.getByRole("link", { name: "Next", exact: true })
  ).toHaveAttribute("href", "/albums/page/2/");

  const firstSchema = await readItemListSchema(page);
  expect(firstSchema.itemListOrder).toBe("https://schema.org/ItemListOrderAscending");
  expect(firstSchema.itemListElement[0].position).toBe(1);
  expect(firstSchema.itemListElement).toHaveLength(24);

  await page.goto("/albums/page/2/");
  await expect(page).toHaveTitle("All Albums — Page 2 | MelodyMind Music");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://melody-mind.de/albums/page/2/"
  );
  await expect(page.getByText(/^Archive page 2 of \d+ · Albums 25–48$/)).toBeVisible();
  await expect(page.locator('[data-testid="album-archive-card"]')).toHaveCount(24);

  const secondSchema = await readItemListSchema(page);
  expect(secondSchema.itemListOrder).toBe("https://schema.org/ItemListOrderAscending");
  expect(secondSchema.numberOfItems).toBe(firstSchema.numberOfItems);
  expect(secondSchema.itemListElement[0].position).toBe(25);
  expect(secondSchema.itemListElement).toHaveLength(24);

  const secondPagination = page.getByRole("navigation", { name: "Album archive pages" });
  await expect(
    secondPagination.getByRole("link", { name: "Previous", exact: true })
  ).toHaveAttribute("href", "/albums/");
});

test("searches the full archive, pages results, and restores the SSR page", async ({
  page,
}) => {
  await page.goto("/albums/");

  const staticGrid = page.locator("[data-album-archive-grid]");
  const results = page.locator("[data-album-search-results]");
  const input = page.getByLabel("Filter all albums");
  const status = page.locator("[data-album-search-status]");

  await expect(staticGrid).toBeVisible();
  expect(await staticGrid.getByRole("heading", { name: TARGET_TITLE }).count()).toBe(0);

  await input.fill(TARGET_TITLE);
  await expect(status).toHaveText("Showing 1–1 of 1 matching albums.");
  await expect(staticGrid).toBeHidden();
  await expect(results).toBeVisible();
  await expect(results.getByRole("heading", { name: TARGET_TITLE })).toBeVisible();
  await expect(
    results.getByRole("link", { name: TARGET_TITLE, exact: true })
  ).toHaveAttribute("href", TARGET_PATH);
  expect(new URL(page.url()).searchParams.get("filter")).toBe(TARGET_TITLE);

  await page.reload();
  await expect(input).toHaveValue(TARGET_TITLE);
  await expect(status).toHaveText("Showing 1–1 of 1 matching albums.");
  await expect(results.getByRole("heading", { name: TARGET_TITLE })).toBeVisible();

  await input.fill("e");
  await expect(results.locator("[data-album-search-result]")).toHaveCount(24);
  const resultPages = page.locator("[data-album-search-result-pages]");
  await expect(resultPages).toBeVisible();
  await resultPages.getByRole("button", { name: "Next" }).click();
  await expect(page.locator("[data-album-search-result-page]")).toHaveText(
    /^Page 2 of \d+$/
  );
  expect(new URL(page.url()).searchParams.get("resultsPage")).toBe("2");

  await page.goto("/albums/?filter=e&resultsPage=999");
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
  await page.goto(`/albums/?filter=${encodeURIComponent(TARGET_TITLE)}`);

  await expect(page.locator("[data-album-archive-grid]")).toBeVisible();
  await expect(page.locator("[data-album-search-results]")).toBeHidden();
  await expect(page.locator("[data-album-archive-pagination]")).toBeVisible();
  await expect(page.locator("[data-album-search-status]")).toHaveText(
    "Search is temporarily unavailable. The paginated archive remains below."
  );
});

test("keeps pagination usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/albums/");

  await expect(page.locator("[data-album-archive-controls]")).toBeHidden();
  await expect(page.locator('[data-testid="album-archive-card"]')).toHaveCount(24);
  const pagination = page.getByRole("navigation", { name: "Album archive pages" });
  await expect(
    pagination.getByRole("link", { name: "Next", exact: true })
  ).toHaveAttribute("href", "/albums/page/2/");
  await expect(
    page.locator('[data-testid="album-archive-card"] a').first()
  ).toBeVisible();

  await context.close();
});
