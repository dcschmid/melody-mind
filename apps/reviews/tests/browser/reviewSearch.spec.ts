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

test("shows the hero without overflow at 390x844", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  // The featured hero carries the single h1 on the first page.
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("link", { name: /Read the review/ })).toBeVisible();
  // Cover art or its typographic fallback must be visible.
  await expect(
    page.locator(".home-hero__mark img, .home-hero__mark .album-mark").first()
  ).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBe(390);
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

test("locks background scrolling while the mobile navigation is open", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  // Deterministic measurements regardless of any smooth-scroll styling.
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });

  const menuButton = page.locator("[data-menu-button]");
  const backdrop = page.locator("[data-menu-backdrop]");

  await page.evaluate(() => window.scrollTo(0, 400));
  const scrolledTo = await page.evaluate(() => window.scrollY);
  expect(scrolledTo).toBeGreaterThan(0);

  await menuButton.click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(backdrop).toBeVisible();

  // A wheel gesture over the visible backdrop must not move the page.
  const box = await backdrop.boundingBox();
  if (!box) {
    throw new Error("Backdrop is not visible while the navigation is open.");
  }
  await page.mouse.move(box.x + box.width / 2, box.y + box.height - 40);
  await page.mouse.wheel(0, 300);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      })
  );
  expect(await page.evaluate(() => window.scrollY)).toBe(scrolledTo);

  await page.keyboard.press("Escape");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(menuButton).toBeFocused();

  // Scrolling resumes once the drawer closes.
  await page.mouse.move(195, 500);
  await page.mouse.wheel(0, 300);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(scrolledTo);
});
