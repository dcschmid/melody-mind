import { expect, test, type Page } from "@playwright/test";

// Each matrix test sweeps all 11 page types; under the 8-worker parallel
// Firefox load, navigation plus health scans on the full sweep needs well
// over the default 30s, so give this spec a generous budget.
test.setTimeout(180_000);
// Supported viewport matrix from the responsive-layout plan: 320 small phone,
// 390 phone, 768 tablet portrait, 1024 tablet landscape, 1280/1440/1920 desktop.
const MATRIX_WIDTHS = [320, 390, 768, 1024, 1152, 1280, 1440, 1920];
// Real header switch boundaries across the suite, checked as pairs around each
// toggle (760/761, 767/768, 1023/1024, 1151/1152, 1279/1280).
const HEADER_BOUNDARY_WIDTHS = [760, 761, 767, 768, 1023, 1024, 1151, 1152, 1279, 1280];
const MIN_FONT_PX = 16;

// Every built music page type. Embed pages intentionally ship without a site
// header, so header geometry checks only apply when the header renders.
const ROUTES = [
  "/",
  "/albums/",
  "/the-morning-meeting-has-been-extended/",
  "/genre/rock/",
  "/artists/nika-arden/",
  "/series/the-newsroom-is-fine/",
  "/about/",
  "/favorites/",
  "/404",
  "/embed/album/the-morning-meeting-has-been-extended/",
  "/embed/series/the-newsroom-is-fine/",
];

const HEADER_SELECTOR = ".music-site-header";
const HEADER_BLOCKS = [
  ".music-site-header__brand",
  ".music-site-header__nav",
  ".music-site-header__toggle",
];

// Full-page health at the current viewport: no horizontal overflow, exactly
// one visible <main> and <h1>, no rendered text (own text nodes, form-control
// values, pseudo-element content) below the 16px minimum, and all media fully
// inside the viewport. Returns human-readable problem strings.
const pageHealth = (page: Page, path: string, width: number): Promise<string[]> =>
  page.evaluate(
    ([minPx, route, vw]) => {
      const problems: string[] = [];
      const prefix = (msg: string) => `${route} @${vw}px: ${msg}`;

      if (document.documentElement.scrollWidth > window.innerWidth + 1) {
        problems.push(
          `horizontal overflow: scrollWidth=${document.documentElement.scrollWidth}`
        );
      }

      const isVisible = (el: Element) => {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility !== "visible") {
          return false;
        }
        if (!el.getClientRects().length) {
          return false;
        }
        for (
          let node: HTMLElement | null = el as HTMLElement;
          node;
          node = node.parentElement
        ) {
          if (parseFloat(getComputedStyle(node).opacity) < 0.05) {
            return false;
          }
        }
        return true;
      };

      for (const tag of ["main", "h1"] as const) {
        const count = [...document.querySelectorAll(tag)].filter(isVisible).length;
        if (count !== 1) {
          problems.push(`${tag}: ${count} visible, expected 1`);
        }
      }

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node.textContent?.trim();
        if (!text) {
          continue;
        }
        const el = (node as Text).parentElement;
        if (!el || !isVisible(el)) {
          continue;
        }
        if (el.closest("[hidden],[aria-hidden='true'],template")) {
          continue;
        }
        const rect = el.getBoundingClientRect();
        // 1px clips are screen-reader only text; off-viewport rects are hidden
        // (e.g. a closed drawer) and caught by the overflow/geometry checks.
        if (rect.width < 2 || rect.height < 2) {
          continue;
        }
        if (rect.right <= 0 || rect.left >= window.innerWidth) {
          continue;
        }
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size > 0 && size < minPx - 0.01) {
          problems.push(
            `text ${size}px "${text.slice(0, 40)}" on <${el.tagName.toLowerCase()}>`
          );
        }
      }

      for (const control of document.querySelectorAll<HTMLElement>(
        "input:not([type='hidden']),textarea,select"
      )) {
        const input = control as HTMLInputElement;
        if (!input.value && !input.placeholder) {
          continue;
        }
        const rect = control.getBoundingClientRect();
        if (!rect.width || !rect.height || !isVisible(control)) {
          continue;
        }
        const size = parseFloat(getComputedStyle(control).fontSize);
        if (size > 0 && size < minPx - 0.01) {
          problems.push(
            `control text ${size}px "${(input.placeholder || input.value).slice(0, 40)}"`
          );
        }
      }

      for (const el of document.querySelectorAll("body *")) {
        if (!isVisible(el) || !el.getClientRects().length) {
          continue;
        }
        for (const pseudo of ["::before", "::after"]) {
          const style = getComputedStyle(el, pseudo);
          if (
            style.content === "none" ||
            style.content === "normal" ||
            style.content === '""'
          ) {
            continue;
          }
          const size = parseFloat(style.fontSize);
          if (size > 0 && size < minPx - 0.01) {
            problems.push(`${el.tagName.toLowerCase()}${pseudo} content ${size}px`);
          }
        }
      }

      for (const media of document.querySelectorAll("img,video,audio,iframe")) {
        if (!isVisible(media)) {
          continue;
        }
        const rect = media.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          continue;
        }
        if (rect.right > vw + 1 || rect.left < -1) {
          const name =
            media.getAttribute("alt") ||
            media.getAttribute("aria-label") ||
            media.className;
          problems.push(
            `media out of viewport: <${media.tagName.toLowerCase()}> ${name} x=${Math.round(
              rect.left
            )}..${Math.round(rect.right)}`
          );
        }
      }

      return problems.map(prefix);
    },
    [MIN_FONT_PX, path, width] as [number, string, number]
  );

// Brand, desktop nav and the menu toggle must not intersect each other and
// each visible header block must stay inside the viewport. Edge-to-edge
// adjacency is fine; crossing over is not. Off-screen/hidden blocks (closed
// drawer translated away) are skipped.
const headerCollisions = (page: Page, width: number): Promise<string[]> =>
  page.evaluate(
    ([headerSelector, blocks, vw]) => {
      const header = document.querySelector(headerSelector);
      if (!header) {
        return [];
      }
      const visible: Array<{ name: string; rect: DOMRect }> = [];
      for (const selector of blocks) {
        const el = header.querySelector(selector);
        if (!el) {
          continue;
        }
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility !== "visible") {
          continue;
        }
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          continue;
        }
        if (rect.right <= 0 || rect.left >= window.innerWidth) {
          continue;
        }
        visible.push({ name: selector, rect });
      }
      const problems: string[] = [];
      for (const block of visible) {
        if (block.rect.left < -1 || block.rect.right > vw + 1) {
          problems.push(
            `${block.name} x=${Math.round(block.rect.left)}..${Math.round(block.rect.right)} outside viewport`
          );
        }
      }
      for (let i = 0; i < visible.length; i += 1) {
        for (let j = i + 1; j < visible.length; j += 1) {
          const a = visible[i].rect;
          const b = visible[j].rect;
          if (
            a.left < b.right &&
            b.left < a.right &&
            a.top < b.bottom &&
            b.top < a.bottom
          ) {
            problems.push(`${visible[i].name} overlaps ${visible[j].name} at ${vw}px`);
          }
        }
      }
      return problems;
    },
    [HEADER_SELECTOR, HEADER_BLOCKS, width] as [string, string[], number]
  );

const gotoStable = async (page: Page, path: string, width: number) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  // Entry reveals animate opacity over ~700ms; jump finite animations to their
  // end state so measurements never catch them mid-flight (paused or
  // scroll-driven animations throw and are left alone).
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      try {
        animation.finish();
      } catch {
        /* not finishable: idle, scroll-driven, or infinite */
      }
    }
  });
};

for (const width of MATRIX_WIDTHS) {
  test(`renders every music page without overflow, stray headings, or sub-16px text at ${width}px`, async ({
    page,
  }) => {
    const problems: string[] = [];
    for (const path of ROUTES) {
      await gotoStable(page, path, width);
      problems.push(...(await pageHealth(page, path, width)));
    }
    expect(problems).toEqual([]);
  });
}

test("keeps brand and navigation collision-free across every header switch boundary", async ({
  page,
}) => {
  const problems: string[] = [];
  for (const width of HEADER_BOUNDARY_WIDTHS) {
    await gotoStable(page, "/", width);
    problems.push(...(await headerCollisions(page, width)));
  }
  expect(problems).toEqual([]);
});

test("keeps the opened drawer inside the phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open main menu" }).click();

  const nav = page.locator("[data-music-menu-nav]");
  await expect(nav).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close main menu" }).first()
  ).toBeVisible();

  // The drawer eases in; poll until it settles inside the viewport.
  await expect
    .poll(async () => {
      const box = await nav.boundingBox();
      return box !== null && box.x >= -1 && box.x + box.width <= 391;
    })
    .toBe(true);

  const problems = await pageHealth(page, "/", 390);
  expect(problems).toEqual([]);
});

test("keeps the played track and its action popover inside the phone viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/the-morning-meeting-has-been-extended/");

  await page.locator(".album-playlist-player__track-button").first().click();
  const play = page.locator(".album-hero__play");
  await expect(play).toBeVisible();

  const trigger = page.locator(".album-playlist-player__track-actions-trigger").first();
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger).toBeVisible();
  await trigger.click();

  const popover = page.locator(".album-playlist-player__track-actions-popover").first();
  await expect(popover).toBeVisible();
  const box = await popover.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width).toBeLessThanOrEqual(391);

  const problems = await pageHealth(page, "/the-morning-meeting-has-been-extended/", 390);
  expect(problems).toEqual([]);
});
