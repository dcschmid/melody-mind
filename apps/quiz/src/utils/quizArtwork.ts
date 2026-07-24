import type { ImageMetadata } from "astro";

import art1950s from "@assets/1950s.png";
import art1960s from "@assets/1960s.png";
import art1970s from "@assets/1970s.png";
import art1980s from "@assets/1980s.png";
import art1990s from "@assets/1990s.png";
import art2000s from "@assets/2000s.png";
import art2010s from "@assets/2010s.png";
import artBlues from "@assets/from-blues-to-breakdown.png";
import artHipHop from "@assets/from-hip-hop-to-trap-drill.png";
import artPop from "@assets/from-pop-to-streaming-pop.png";

const QUIZ_ARTWORK: Record<string, ImageMetadata> = {
  "1950s": art1950s,
  "1960s": art1960s,
  "1970s": art1970s,
  "1980s": art1980s,
  "1990s": art1990s,
  "2000s": art2000s,
  "2010s": art2010s,
  "from-pop-to-streaming-pop": artPop,
  "from-hip-hop-to-trap-drill": artHipHop,
  "from-blues-to-breakdown": artBlues,
};

export const QUIZ_ORDER = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "from-pop-to-streaming-pop",
  "from-hip-hop-to-trap-drill",
  "from-blues-to-breakdown",
] as const;

export function getQuizArtwork(id: string): ImageMetadata {
  const image = QUIZ_ARTWORK[id];
  if (!image) {
    throw new Error(`Missing quiz artwork for ${id}.`);
  }
  return image;
}

export function sortQuizIds(left: string, right: string): number {
  return (
    QUIZ_ORDER.indexOf(left as (typeof QUIZ_ORDER)[number]) -
    QUIZ_ORDER.indexOf(right as (typeof QUIZ_ORDER)[number])
  );
}
