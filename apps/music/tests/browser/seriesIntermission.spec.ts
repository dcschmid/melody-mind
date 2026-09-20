import { expect, test } from "@playwright/test";

// Part 1 (the-admin-in-the-basement) holds 14 tracks (index 0-13); the first
// Part 2 track is index 14 (pager-at-midnight), which carries a transition.
const NEXT_TO_LAST_PART1_TRACK = 13;

test("shows the Part 2 intermission at the Part 1 album boundary", async ({ page }) => {
  // External MP3s are not a CI contract: block them so the boundary logic is
  // exercised deterministically without real audio playback.
  await page.route("**/eu2.contabostorage.com/**", (route) => route.abort());

  await page.goto("/series/code-chaos-and-coffee/");
  await page.getByRole("button", { name: "Play full series", exact: true }).click();

  const player = page.locator("[data-global-player]");
  await expect(player).toBeVisible();

  const dispatchNext = () =>
    page.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent("melodymind:player-command", { detail: { action: "next" } })
      )
    );

  const trackIndex = () =>
    page.evaluate(
      () =>
        (
          window as unknown as {
            __melodyMindPlayer?: { getState: () => { currentTrackIndex: number } };
          }
        ).__melodyMindPlayer!.getState().currentTrackIndex
    );

  // Walk within Part 1 until the last Part 1 track is current.
  for (let i = 0; i < NEXT_TO_LAST_PART1_TRACK; i += 1) {
    await dispatchNext();
  }
  await expect.poll(trackIndex).toBe(NEXT_TO_LAST_PART1_TRACK);

  // One more advance crosses the album boundary and raises the intermission.
  await dispatchNext();

  const intermission = player.locator("[data-series-intermission]");
  await expect(intermission).toBeVisible();
  const partText = await player.locator("[data-series-intermission-part]").textContent();
  expect(partText).toContain("1");
});
