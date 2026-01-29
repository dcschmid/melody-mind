import { takeaways1950s } from "./1950s";
import { takeaways1960s } from "./1960s";
import { takeaways1970s } from "./1970s";

export const takeawaysDecades = ["1950s", "1960s", "1970s"] as const;

export const knowledgeTakeaways: Record<string, string[]> = {
  "1950s": takeaways1950s,
  "1960s": takeaways1960s,
  "1970s": takeaways1970s,
};

export type TakeawaysDecade = (typeof takeawaysDecades)[number];
