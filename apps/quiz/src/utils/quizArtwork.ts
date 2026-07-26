import type { ImageMetadata } from "astro";

import art1950s from "@assets/1950s.webp";
import art1960s from "@assets/1960s.webp";
import art1970s from "@assets/1970s.webp";
import art1980s from "@assets/1980s.webp";
import art1990s from "@assets/1990s.webp";
import art2000s from "@assets/2000s.webp";
import art2010s from "@assets/2010s.webp";
import artAsiaPop from "@assets/from-asia-pop-to-global-pop.webp";
import artBlues from "@assets/from-blues-to-breakdown.webp";
import artClassical from "@assets/from-classical-roots-to-neo-classical-sounds.webp";
import artFolk from "@assets/from-folk-to-bedroom-pop.webp";
import artHipHop from "@assets/from-hip-hop-to-trap-drill.webp";
import artJazz from "@assets/from-jazz-to-neo-soul.webp";
import artLatin from "@assets/from-latin-to-latin-trap.webp";
import artPop from "@assets/from-pop-to-streaming-pop.webp";
import artSka from "@assets/from-ska-to-global-bass.webp";
import artSoul from "@assets/from-soul-to-modern-dance-music.webp";

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
  "from-classical-roots-to-neo-classical-sounds": artClassical,
  "from-folk-to-bedroom-pop": artFolk,
  "from-jazz-to-neo-soul": artJazz,
  "from-latin-to-latin-trap": artLatin,
  "from-ska-to-global-bass": artSka,
  "from-soul-to-modern-dance-music": artSoul,
  "from-asia-pop-to-global-pop": artAsiaPop,
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
  "from-classical-roots-to-neo-classical-sounds",
  "from-folk-to-bedroom-pop",
  "from-jazz-to-neo-soul",
  "from-latin-to-latin-trap",
  "from-ska-to-global-bass",
  "from-soul-to-modern-dance-music",
  "from-asia-pop-to-global-pop",
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
