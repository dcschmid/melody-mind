import { expect, test, type Page } from "@playwright/test";

const ALBUM_PATH = "/the-morning-meeting-has-been-extended/";

const ROUTES = [
  "/",
  ALBUM_PATH,
  "/albums/",
  "/genre/metal/",
  "/series/the-newsroom-is-fine/",
  "/artists/",
  "/favorites/",
];

const VIEWPORTS = [
  { width: 320, height: 844 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1152, height: 900 },
  { width: 1440, height: 900 },
];

const hasVisibleFocusRing = async (page: Page): Promise<boolean> =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) {
      return false;
    }
    const style = getComputedStyle(el);
    const outlineWidth = parseFloat(style.outlineWidth);
    return (
      style.outlineStyle !== "none" &&
      outlineWidth > 0 &&
      style.outlineColor !== "rgba(0, 0, 0, 0)"
    );
  });

for (const route of ROUTES) {
  test.describe(`accessibility journey on ${route}`, () => {
    for (const viewport of VIEWPORTS) {
      test(`single main and single h1 at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(route);

        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      });
    }

    test("keyboard path shows visible focus indicators", async ({ page }) => {
      await page.setViewportSize({ width: 1152, height: 900 });
      await page.goto(route);
      await page.keyboard.press("Tab"); // skip link
      await expect.poll(() => hasVisibleFocusRing(page)).toBe(true);

      for (let step = 0; step < 5; step += 1) {
        await page.keyboard.press("Tab");
        await expect.poll(() => hasVisibleFocusRing(page)).toBe(true);
      }
    });
  });
}

test("mobile menu opens by keyboard, traps focus, and returns it on Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const toggle = page.locator("[data-music-menu-toggle]");
  await expect(toggle).toHaveAttribute("aria-label", "Open main menu");
  await toggle.focus();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: "Main menu" });
  await expect(drawer).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");

  await expect.poll(() => hasVisibleFocusRing(page)).toBe(true);

  // Focus must stay inside the drawer across a full tab cycle.
  for (let step = 0; step < 12; step += 1) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const header = document
        .querySelector("[data-music-menu-toggle]")
        ?.closest("header");
      return Boolean(header?.contains(document.activeElement));
    });
    expect(inside, `focus escaped the drawer after ${step + 1} tab(s)`).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  const focusReturned = await page.evaluate(() =>
    document.activeElement?.hasAttribute("data-music-menu-toggle")
  );
  expect(focusReturned).toBe(true);
});
