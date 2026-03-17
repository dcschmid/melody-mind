import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const audioComponent = resolve("src/components/AudioPlayer.astro");
if (!existsSync(audioComponent)) {
  fail("AudioPlayer component missing: src/components/AudioPlayer.astro");
}

const episodePage = readFileSync(resolve("src/pages/[id].astro"), "utf8");
if (!episodePage.includes("AudioPlayer")) {
  fail("AudioPlayer not used in src/pages/[id].astro");
}

if (episodePage.includes("episode-player__")) {
  fail("AudioPlayer markup still present in src/pages/[id].astro");
}

console.log("AudioPlayer extraction check passed.");

const episodeCardComponent = resolve("src/components/EpisodeCard.astro");
if (!existsSync(episodeCardComponent)) {
  fail("EpisodeCard component missing: src/components/EpisodeCard.astro");
}

const indexPage = readFileSync(resolve("src/pages/index.astro"), "utf8");
if (!indexPage.includes("EpisodeCard")) {
  fail("EpisodeCard not used in src/pages/index.astro");
}

if (indexPage.includes("home__episode-card")) {
  fail("Episode card markup still present in src/pages/index.astro");
}

console.log("EpisodeCard extraction check passed.");

const homeHeroComponent = resolve("src/components/HomeHero.astro");
if (!existsSync(homeHeroComponent)) {
  fail("HomeHero component missing: src/components/HomeHero.astro");
}

if (!indexPage.includes("HomeHero")) {
  fail("HomeHero not used in src/pages/index.astro");
}

if (indexPage.includes("home__hero")) {
  fail("Home hero markup still present in src/pages/index.astro");
}

console.log("HomeHero extraction check passed.");
