import { expect, test } from "@playwright/test";

const TARGET_TITLE = "The Room Before the Record";

test("finds a page-two story, combines filters, survives reload, and degrades on 503", async ({
  page,
}) => {
  await page.goto("/");

  // The target story is not in the server-rendered first archive page.
  const staticGrid = page.locator("[data-story-static-grid]");
  await expect(staticGrid).toBeVisible();
  expect(await staticGrid.getByRole("heading", { name: TARGET_TITLE }).count()).toBe(0);

  const input = page.locator("[data-story-search-input]");
  const status = page.locator("[data-story-search-status]");
  const searchGrid = page.locator("[data-story-search-grid]");

  await input.fill(TARGET_TITLE);
  await input.press("Enter");

  await expect(staticGrid).toBeHidden();
  await expect(searchGrid).toBeVisible();
  const card = searchGrid.getByRole("heading", { name: TARGET_TITLE });
  await expect(card).toBeVisible();
  await expect(status).toContainText(`Showing 1–1 of 1 matching stories.`);

  // Combining query and format narrows instead of widening.
  await page.locator('[data-story-format="scene-report"]').click();
  await expect(searchGrid).toBeVisible();
  await expect(card).toBeVisible();
  expect(await searchGrid.locator(".story-card").count()).toBe(1);

  // URL state survives a reload.
  await page.reload();
  await expect(input).toHaveValue(TARGET_TITLE);
  await expect(page.locator('[data-story-format="scene-report"]')).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(searchGrid).toBeVisible();
  await expect(card).toBeVisible();

  // A failed index fetch keeps the server-rendered archive visible.
  await page.route("**/story-search-index.json", (route) =>
    route.fulfill({ status: 503, body: "unavailable" })
  );
  await page.goto("/?q=The%20Room%20Before%20the%20Record&format=scene-report");
  await expect(staticGrid).toBeVisible();
  await expect(searchGrid).toBeHidden();
  await expect(status).toHaveText(
    "Search is temporarily unavailable. The paginated archive remains below."
  );
});

test("has no horizontal overflow at 390x844", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("[data-story-search-input]")).toBeVisible();
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBe(390);
});
