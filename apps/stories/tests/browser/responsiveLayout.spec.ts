import { expect, test, type Page } from "@playwright/test";

// The boundary sweep replays navigation across ten widths; under parallel
// Firefox load that exceeds the default 30s.
test.setTimeout(120_000);

const MATRIX_WIDTHS = [320, 390, 768, 1024, 1280, 1440, 1920];
// Stories header switches at 48rem (768px); the shared boundary pairs keep the
// other apps' switch points covered too.
const HEADER_BOUNDARY_WIDTHS = [760, 761, 767, 768, 1023, 1024, 1151, 1152, 1279, 1280];
const MIN_FONT_PX = 16;

const ROUTES = ["/", "/manchester-fac-1-to-fac-51/", "/about/", "/404"];

const HEADER_SELECTOR = ".site-header";
const HEADER_BLOCKS = [
  ".site-header__brand",
  ".site-header__desktop-nav",
  ".site-header__menu-button",
  ".site-header__mobile-nav",
];

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
  test(`renders every stories page without overflow, stray headings, or sub-16px text at ${width}px`, async ({
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
  await page.getByRole("button", { name: "Open navigation" }).click();

  const nav = page.locator("[data-stories-mobile-nav]");
  await expect(nav).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close navigation" }).first()
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

test("keeps the searched and filtered directory inside the phone viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  // A query swaps the static archive for the search grid.
  await page.locator("[data-story-search-input]").fill("manchester");
  await expect(page.locator("[data-story-search-grid]")).toBeVisible();

  // The clear button restores the static archive.
  await page.locator("[data-story-search-clear]").click();
  await expect(page.locator("[data-story-static-grid]")).toBeVisible();

  // A format filter swaps to the search grid again.
  await page.locator('[data-story-format="cover-story"]').first().click();
  await expect(page.locator("[data-story-search-grid]")).toBeVisible();

  const problems = await pageHealth(page, "/", 390);
  expect(problems).toEqual([]);
});
