export interface GenreLandingPage {
  slug: string;
  mainGenre: string;
  title: string;
  eyebrow: string;
  description: string;
  intro: string[];
  keywords: string[];
}

export const genreLandingPages = [
  {
    slug: "rock",
    mainGenre: "Rock",
    title: "Rock Albums",
    eyebrow: "Rock",
    description:
      "AI-assisted rock concept albums from MelodyMind Music, from hard rock and folk rock to rock opera and atmospheric story records.",
    intro: [
      "The rock shelf is where MelodyMind Music keeps its broadest guitar language: hard rock, folk rock, rock opera, city stories, stage myths, and albums that need a strong chorus without losing their plot.",
      "These records tend to move through character, place, and tension rather than pure genre exercise. The guitars matter, but so do the rooms, roads, coastlines, and broken crowns around them.",
    ],
    keywords: ["rock albums", "hard rock", "folk rock", "rock opera"],
  },
  {
    slug: "metal",
    mainGenre: "Metal",
    title: "Metal Albums",
    eyebrow: "Metal",
    description:
      "AI-assisted metal concept albums with power metal, metal opera, Viking metal, gothic metal, and cinematic heavy storytelling.",
    intro: [
      "The metal shelf carries MelodyMind at its most theatrical: crowns, machines, cathedrals, oaths, ruined kingdoms, heavy riffs, choirs, and stories built for high stakes.",
      "Some albums lean into power metal and myth; others use metal opera, gothic metal, or Viking metal language. The common thread is scale, but the better records still come down to one damaged voice making a choice.",
    ],
    keywords: ["metal albums", "power metal", "metal opera", "viking metal"],
  },
  {
    slug: "pop",
    mainGenre: "Pop",
    title: "Pop Albums",
    eyebrow: "Pop",
    description:
      "AI-assisted pop concept albums with K-pop, synth-pop, Nordic pop, French pop, art pop, and emotional story-led production.",
    intro: [
      "The pop shelf is the melodic center of MelodyMind Music. It includes K-pop brightness, synth-pop gloss, French pop, Nordic atmosphere, art-pop detail, and albums where the hook is part of the story architecture.",
      "These records are polished, but they are not just surface. They use pop structure to hold first love, exile, city life, family memory, fantasy school worlds, and late-night synthetic pressure.",
    ],
    keywords: ["pop albums", "k-pop", "synth-pop", "art pop"],
  },
  {
    slug: "punk",
    mainGenre: "Punk",
    title: "Punk Albums",
    eyebrow: "Punk",
    description:
      "AI-assisted punk concept albums with raw guitars, protest writing, gang vocals, political pressure, and anti-authoritarian stories.",
    intro: [
      "The punk shelf is direct by design. These albums deal in borders, propaganda, bills, rent, power, public anger, and the moment a crowd stops waiting to be invited.",
      "The sound is raw and compact: dry drums, dirty guitars, shouted hooks, sirens, and broadcast fragments. The songs work best when the politics stay close to concrete details.",
    ],
    keywords: ["punk albums", "political punk", "protest punk", "anti-authoritarian"],
  },
  {
    slug: "gothic",
    mainGenre: "Gothic",
    title: "Gothic Albums",
    eyebrow: "Gothic",
    description:
      "AI-assisted gothic concept albums with dark cabaret, cathedral drama, haunted romance, shadowed rooms, and theatrical atmosphere.",
    intro: [
      "The gothic shelf collects MelodyMind's darker theatrical records: cabaret rooms, cathedral shadows, doomed romance, ritual, memory, and the kind of beauty that starts to feel unsafe.",
      "The sound world changes from album to album, but the pressure stays similar. Piano, dark guitars, chamber textures, and dramatic vocals turn atmosphere into a way of talking about control, grief, and escape.",
    ],
    keywords: ["gothic albums", "dark cabaret", "gothic rock", "dark music"],
  },
  {
    slug: "hip-hop",
    mainGenre: "Hip-Hop",
    title: "Hip-Hop Albums",
    eyebrow: "Hip-Hop",
    description:
      "AI-assisted hip-hop concept albums with political rap, German rap, live-band energy, street detail, and narrative pressure.",
    intro: [
      "The hip-hop shelf is built around voice, witness, and rhythm. These albums use rap as a place for public pressure, personal accounting, and the kind of detail that does not fit neatly into a chorus.",
      "Some tracks lean toward live protest energy, others toward city storytelling. The center is always language: who gets to speak, what gets counted, and which rooms usually stay unheard.",
    ],
    keywords: ["hip-hop albums", "political rap", "german rap", "rap concept albums"],
  },
  {
    slug: "folk",
    mainGenre: "Folk",
    title: "Folk Albums",
    eyebrow: "Folk",
    description:
      "AI-assisted folk concept albums with sea stories, family memory, old rituals, acoustic textures, and mythic or regional settings.",
    intro: [
      "The folk shelf keeps the archive close to older forms of storytelling: sea songs, family rooms, regional memory, taverns, rituals, and voices that sound like they have been carried for a while.",
      "These albums are not all quiet, but they tend to value inheritance. Even when the arrangements grow heavy or cinematic, the songs often begin with a place, an object, or a story someone was supposed to remember.",
    ],
    keywords: ["folk albums", "folk pop", "folk metal", "sea shanty"],
  },
  {
    slug: "latin",
    mainGenre: "Latin",
    title: "Latin Albums",
    eyebrow: "Latin",
    description:
      "AI-assisted Latin concept albums with Afro-Cuban pop, mariachi-pop, Mexican pop, family stories, street scenes, and bright rhythmic color.",
    intro: [
      "The Latin shelf brings MelodyMind into songs shaped by streets, ports, balconies, family rooms, memory, and rhythm that carries more than celebration.",
      "These records use bright color and movement, but the strongest moments are human-sized: a voice at a window, a last serenade, a procession, a harbor, a kitchen table, or a city holding several histories at once.",
    ],
    keywords: ["latin albums", "afro-cuban pop", "mariachi pop", "mexican pop"],
  },
  {
    slug: "jazz",
    mainGenre: "Jazz",
    title: "Jazz Albums",
    eyebrow: "Jazz",
    description:
      "AI-assisted jazz and Afro-Cuban jazz concept albums with late-night atmosphere, rhythmic detail, brass color, and cinematic city storytelling.",
    intro: [
      "The jazz shelf is small but distinct: brass color, night air, Afro-Cuban movement, and songs that feel built around rooms, streets, and memory rather than straight genre display.",
      "These albums use rhythm as setting. The arrangements leave space for tension, elegance, and the kind of story that seems to happen between a final drink and sunrise.",
    ],
    keywords: ["jazz albums", "afro-cuban jazz", "cinematic jazz", "latin jazz"],
  },
  {
    slug: "soundtrack",
    mainGenre: "Soundtrack",
    title: "Soundtrack Albums",
    eyebrow: "Soundtrack",
    description:
      "AI-assisted soundtrack concept albums with cinematic scenes, instrumental scale, starships, skies, battle imagery, and widescreen production.",
    intro: [
      "The soundtrack shelf gathers the albums that think in scenes first: flight, space, battle, weather, landscapes, and the kind of instrumental scale that suggests a camera moving before anyone says a word.",
      "These records are cinematic without needing to be background music. They use motif, texture, and pacing to imply a world around the tracklist.",
    ],
    keywords: ["soundtrack albums", "cinematic music", "instrumental", "score"],
  },
  {
    slug: "classical",
    mainGenre: "Classical",
    title: "Classical Albums",
    eyebrow: "Classical",
    description:
      "AI-assisted classical and neo-classical concept albums with piano, chamber atmosphere, memory, silence, and restrained emotional storytelling.",
    intro: [
      "The classical shelf is the quietest corner of MelodyMind Music. It focuses on piano, chamber color, silence, and albums where restraint does more work than volume.",
      "Here the concept is less about spectacle and more about time: rooms, old memories, pauses, and small changes in harmony that suggest something has shifted without announcing it.",
    ],
    keywords: ["classical albums", "neo-classical", "piano", "chamber music"],
  },
] satisfies GenreLandingPage[];

export const genreLandingPageBySlug = new Map(
  genreLandingPages.map((page) => [page.slug, page])
);
