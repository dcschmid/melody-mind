import { expect, test } from "@playwright/test";

test("searches, combines genre, survives reload, and degrades on 503", async ({
  page,
}) => {
  await page.goto("/");

  const input = page.locator("[data-review-search-input]");
  const status = page.locator("[data-review-search-status]");
  const staticList = page.locator("[data-review-static-list]");
  const searchList = page.locator("[data-review-search-list]");

  // Artist search surfaces the matching review.
  await input.fill("Portishead");
  await input.press("Enter");
  await expect(staticList).toBeHidden();
  await expect(searchList).toBeVisible();
  const dummyCard = searchList.getByRole("heading", { name: /Dummy/ });
  await expect(dummyCard).toBeVisible();
  expect(await searchList.getByRole("listitem").count()).toBe(1);

  // Query plus genre stays an intersection.
  await input.fill("Kate Bush");
  await page.locator('[data-review-genre="Rock"]').click();
  await expect(searchList).toBeVisible();
  const houndsCard = searchList.getByRole("heading", { name: /Hounds of Love/ });
  await expect(houndsCard).toBeVisible();
  expect(await searchList.getByRole("listitem").count()).toBe(1);

  // URL state survives a reload.
  await page.reload();
  await expect(input).toHaveValue("Kate Bush");
  await expect(page.locator('[data-review-genre="Rock"]')).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(searchList).toBeVisible();
  await expect(houndsCard).toBeVisible();

  // A failed index fetch keeps the paginated archive visible.
  await page.route("**/review-search-index.json", (route) =>
    route.fulfill({ status: 503, body: "unavailable" })
  );
  await page.goto("/?q=Kate%20Bush&genre=Rock");
  await expect(staticList).toBeVisible();
  await expect(searchList).toBeHidden();
  await expect(status).toHaveText(
    "Search is temporarily unavailable. The paginated archive remains below."
  );
});

test("hides inert search controls without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.locator("[data-review-controls]")).toBeHidden();
  const staticList = page.locator("[data-review-static-list]");
  await expect(staticList).toBeVisible();
  expect(await staticList.getByRole("listitem").count()).toBeGreaterThan(0);
  await expect(staticList.getByRole("link").first()).toBeVisible();
  await context.close();
});
