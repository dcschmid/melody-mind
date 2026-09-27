import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const SITE_URL = "https://melody-mind.de";

async function metaContent(page: Page, selector: string) {
  return page.getAttribute(`head meta${selector}`, "content");
}

test("artist profile emits profile social metadata for its own portrait", async ({
  page,
}) => {
  await page.goto("/artists/nika-arden/");

  await expect(
    page.locator(`head link[rel="canonical"][href="${SITE_URL}/artists/nika-arden/"]`)
  ).toHaveCount(1);
  expect(await metaContent(page, '[property="og:type"]')).toBe("profile");

  const ogImage = await metaContent(page, '[property="og:image"]');
  const twitterImage = await metaContent(page, '[name="twitter:image"]');
  expect(ogImage).toBeTruthy();
  expect(ogImage).not.toContain("/og/default.webp");
  expect(twitterImage).toBe(ogImage);

  expect(await metaContent(page, '[property="og:image:width"]')).toBe("1200");
  expect(await metaContent(page, '[property="og:image:height"]')).toBe("630");
  expect(await metaContent(page, '[property="og:image:alt"]')).toBe(
    "Portrait of Nika Arden"
  );
});

test("artist profile hero portrait is high priority and AVIF-first", async ({ page }) => {
  await page.goto("/artists/nika-arden/");

  const portrait = page.locator('img[alt="Portrait of Nika Arden"]');
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute("fetchpriority", "high");

  const picture = portrait.locator("xpath=ancestor::picture[1]");
  await expect(picture.locator('source[type="image/avif"]')).toHaveCount(1);
  const currentSrc = await portrait.evaluate((img) => img.currentSrc);
  expect(currentSrc.endsWith(".avif")).toBeTruthy();
});

test("favorites page is noindex, follow and keeps its canonical", async ({ page }) => {
  await page.goto("/favorites/");

  const robots = await metaContent(page, '[name="robots"]');
  expect(robots).toContain("noindex");
  expect(robots).toContain("follow");
  await expect(
    page.locator(`head link[rel="canonical"][href="${SITE_URL}/favorites/"]`)
  ).toHaveCount(1);
});

test("sitemap lists artist profiles but excludes favorites", async ({ request }) => {
  const indexResponse = await request.get("/sitemap-index.xml");
  expect(indexResponse.ok()).toBeTruthy();
  const indexXml = await indexResponse.text();

  const childUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1])
  );
  expect(childUrls.length).toBeGreaterThan(0);

  let allXml = "";
  for (const child of childUrls) {
    const childResponse = await request.get(`${child.pathname}${child.search}`);
    expect(childResponse.ok()).toBeTruthy();
    allXml += await childResponse.text();
  }

  expect(allXml).toContain(`${SITE_URL}/artists/nika-arden/`);
  expect(allXml).not.toContain(`${SITE_URL}/favorites/`);
});
