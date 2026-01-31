import { takeaways1950s } from "./1950s";
import { takeaways1960s } from "./1960s";
import { takeaways1970s } from "./1970s";
import { takeaways1980s } from "./1980s";
import { takeaways1990s } from "./1990s";

export const takeawaysDecades = ["1950s", "1960s", "1970s", "1980s", "1990s"] as const;

export const knowledgeTakeaways: Record<string, string[]> = {
  "1950s": takeaways1950s,
  "1960s": takeaways1960s,
  "1970s": takeaways1970s,
  "1980s": takeaways1980s,
  "1990s": takeaways1990s,
};

export type TakeawaysDecade = (typeof takeawaysDecades)[number];
