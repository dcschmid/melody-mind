import { takeaways1950s } from "./1950s";
import { takeaways1960s } from "./1960s";
import { takeaways1970s } from "./1970s";
import { takeaways1980s } from "./1980s";
import { takeaways1990s } from "./1990s";
import { takeaways2000s } from "./2000s";
import { takeaways2010s } from "./2010s";
import { takeawaysFromClassicalRootsToNeoClassicalSounds } from "./from-classical-roots-to-neo-classical-sounds";
import { takeawaysFromBluesToBreakdown } from "./from-blues-to-breakdown";

export const takeawaysDecades = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "from-classical-roots-to-neo-classical-sounds",
  "from-blues-to-breakdown",
] as const;

export const knowledgeTakeaways: Record<string, string[]> = {
  "1950s": takeaways1950s,
  "1960s": takeaways1960s,
  "1970s": takeaways1970s,
  "1980s": takeaways1980s,
  "1990s": takeaways1990s,
  "2000s": takeaways2000s,
  "2010s": takeaways2010s,
  "from-classical-roots-to-neo-classical-sounds":
    takeawaysFromClassicalRootsToNeoClassicalSounds,
  "from-blues-to-breakdown": takeawaysFromBluesToBreakdown,
};

export type TakeawaysDecade = (typeof takeawaysDecades)[number];
