import { expect, test } from "@playwright/test";

test("searches, combines genre, survives reload, and degrades on 503", async ({
  page,
}) => {
  await page.goto("/");

  const input = page.locator("[data-review-search-input]");
  const status = page.locator("[data-review-search-status]");
  const staticGrid = page.locator("[data-review-static-grid]");
  const searchGrid = page.locator("[data-review-search-grid]");

  // Artist search surfaces the matching review.
  await input.fill("Portishead");
  await input.press("Enter");
  await expect(staticGrid).toBeHidden();
  await expect(searchGrid).toBeVisible();
  const dummyCard = searchGrid.getByRole("heading", { name: /Dummy/ });
  await expect(dummyCard).toBeVisible();
  expect(await searchGrid.locator(".review-card").count()).toBe(1);

  // Query plus genre stays an intersection.
  await input.fill("Kate Bush");
  await page.locator('[data-review-genre="Rock"]').click();
  await expect(searchGrid).toBeVisible();
  const houndsCard = searchGrid.getByRole("heading", { name: /Hounds of Love/ });
  await expect(houndsCard).toBeVisible();
  expect(await searchGrid.locator(".review-card").count()).toBe(1);

  // URL state survives a reload.
  await page.reload();
  await expect(input).toHaveValue("Kate Bush");
  await expect(page.locator('[data-review-genre="Rock"]')).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(searchGrid).toBeVisible();
  await expect(houndsCard).toBeVisible();

  // A failed index fetch keeps the paginated archive visible.
  await page.route("**/review-search-index.json", (route) =>
    route.fulfill({ status: 503, body: "unavailable" })
  );
  await page.goto("/?q=Kate%20Bush&genre=Rock");
  await expect(staticGrid).toBeVisible();
  await expect(searchGrid).toBeHidden();
  await expect(status).toHaveText(
    "Search is temporarily unavailable. The paginated archive remains below."
  );
});
