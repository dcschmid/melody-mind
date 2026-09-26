import { expect, test } from "@playwright/test";

// The intermission is a player behavior, not a content artifact: the app's
// catalog shrinks and grows (134 albums were pruned in one commit), so this
// spec synthesizes a two-part series queue through the public
// `melodymind:player-load` contract instead of depending on any published
// album surviving.
const SYNTHETIC_QUEUE = {
  kind: "series" as const,
  queueId: "browser-test-series",
  title: "Browser Test Series",
  url: "/browser-test-series/",
  series: {
    id: "browser-test-series",
    title: "Browser Test Series",
    url: "/browser-test-series/",
    albumCount: 2,
  },
  transitions: [
    {
      beforeAlbumId: "browser-test-part-two",
      transitionText: "The story continues in the next part.",
    },
  ],
  tracks: [
    {
      trackNumber: 1,
      title: "Part One Opening",
      audioUrl: "https://eu2.contabostorage.com/test/part-one-1.mp3",
      album: {
        id: "browser-test-part-one",
        title: "Series Test Part One",
        url: "/browser-test-part-one/",
      },
      partNumber: 1,
      albumTrackCount: 2,
    },
    {
      trackNumber: 2,
      title: "Part One Closing",
      audioUrl: "https://eu2.contabostorage.com/test/part-one-2.mp3",
      album: {
        id: "browser-test-part-one",
        title: "Series Test Part One",
        url: "/browser-test-part-one/",
      },
      partNumber: 1,
      albumTrackCount: 2,
    },
    {
      trackNumber: 1,
      title: "Part Two Opening",
      audioUrl: "https://eu2.contabostorage.com/test/part-two-1.mp3",
      album: {
        id: "browser-test-part-two",
        title: "Series Test Part Two",
        url: "/browser-test-part-two/",
      },
      partNumber: 2,
      albumTrackCount: 1,
    },
  ],
};

test("shows the Part 2 intermission at the album boundary and resumes on continue", async ({
  page,
}) => {
  // External MP3s are not a CI contract: block them so the boundary logic is
  // exercised deterministically without real audio playback.
  await page.route("**/eu2.contabostorage.com/**", (route) => route.abort());

  await page.goto("/");

  const player = page.locator("[data-global-player]");

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

  await page.evaluate((queue) => {
    window.dispatchEvent(
      new CustomEvent("melodymind:player-load", { detail: { queue, startIndex: 0 } })
    );
  }, SYNTHETIC_QUEUE);

  await expect.poll(trackIndex).toBe(0);

  // Within Part 1 the boundary must stay silent.
  await dispatchNext();
  await expect.poll(trackIndex).toBe(1);
  await expect(player.locator("[data-series-intermission]")).toBeHidden();

  // One more advance crosses the album boundary and raises the intermission.
  await dispatchNext();

  const intermission = player.locator("[data-series-intermission]");
  await expect(intermission).toBeVisible();
  await expect(player.locator("[data-series-intermission-part]")).toHaveText(
    "Part 1 complete · Part 2 of 2"
  );
  await expect(player.locator("[data-series-intermission-title]")).toHaveText(
    "Up next: Series Test Part Two"
  );
  await expect(player.locator("[data-series-intermission-summary]")).toHaveText(
    "The story continues in the next part."
  );

  // Continue resumes at the first track of Part 2 and dismisses the panel.
  await intermission.getByRole("button", { name: "Play next album" }).click();
  await expect.poll(trackIndex).toBe(2);
  await expect(intermission).toBeHidden();
});
