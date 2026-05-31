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
      "AI-assisted rock concept albums from MelodyMind Music, shaped by hard rock weight, folk-rock memory, rock-opera drama, and guitar-led stories with a clear sense of place.",
    intro: [
      "The rock shelf is where MelodyMind Music lets guitars carry more than volume. Hard rock muscle, folk-rock grain, rock-opera scale, city stories, and stage myths sit beside albums that need a chorus strong enough to hold a plot together.",
      "These records work best when the riffs have scenery around them. A road, a harbor, a rehearsal room, a coastline, or a damaged crown can matter as much as the hook, because the song is usually tracking a person under pressure rather than a genre pose.",
    ],
    keywords: ["rock albums", "hard rock", "folk rock", "rock opera"],
  },
  {
    slug: "metal",
    mainGenre: "Metal",
    title: "Metal Albums",
    eyebrow: "Metal",
    description:
      "AI-assisted metal concept albums with power metal charge, metal-opera scale, Viking and gothic textures, and heavy storytelling built around myth, conflict, and consequence.",
    intro: [
      "The metal shelf carries MelodyMind Music at its most theatrical. Crowns, machines, cathedrals, oaths, ruined kingdoms, heavy riffs, and choirs appear often, but the point is not decoration. The drama needs weight, and the sound is built to make choices feel irreversible.",
      "Some albums lean into power metal and myth; others use metal opera, gothic metal, or Viking metal language. The common thread is scale, but the stronger records still come down to one damaged voice, one broken order, or one promise that costs more than expected.",
    ],
    keywords: ["metal albums", "power metal", "metal opera", "viking metal"],
  },
  {
    slug: "pop",
    mainGenre: "Pop",
    title: "Pop Albums",
    eyebrow: "Pop",
    description:
      "AI-assisted pop concept albums with K-pop brightness, synth-pop pressure, Nordic and French pop color, art-pop detail, and hooks tied to character and story.",
    intro: [
      "The pop shelf is the melodic center of MelodyMind Music. K-pop brightness, synth-pop pressure, French pop, Nordic atmosphere, and art-pop detail all turn up here, but the hook is not treated as packaging. It is part of how the record explains a character, a place, or a change in mood.",
      "These albums are polished, but they are not written as surface alone. Pop structure gives them clean edges: a verse can hold first love or exile, a chorus can turn city life into a public feeling, and a synth line can make a private worry sound larger than the room.",
    ],
    keywords: ["pop albums", "k-pop", "synth-pop", "art pop"],
  },
  {
    slug: "punk",
    mainGenre: "Punk",
    title: "Punk Albums",
    eyebrow: "Punk",
    description:
      "AI-assisted punk concept albums with raw guitars, protest writing, gang vocals, political pressure, and anti-authoritarian stories grounded in everyday friction.",
    intro: [
      "The punk shelf is direct by design. These albums deal in borders, propaganda, bills, rent, power, public anger, and the second when a crowd stops asking for permission. The writing stays close to pressure that can be named.",
      "The sound is raw and compact: dry drums, dirty guitars, shouted hooks, sirens, and fragments of broadcast noise. The politics work best when they stay near concrete details, because a late notice, a checkpoint, or a locked door can say more than a slogan.",
    ],
    keywords: ["punk albums", "political punk", "protest punk", "anti-authoritarian"],
  },
  {
    slug: "gothic",
    mainGenre: "Gothic",
    title: "Gothic Albums",
    eyebrow: "Gothic",
    description:
      "AI-assisted gothic concept albums with dark cabaret, cathedral drama, haunted romance, chamber shadows, and theatrical atmosphere that turns mood into narrative pressure.",
    intro: [
      "The gothic shelf collects MelodyMind Music's darker theatrical records: cabaret rooms, cathedral shadows, doomed romance, ritual, memory, and beauty that starts to feel unsafe once the door is closed.",
      "The sound world changes from album to album, but the pressure stays similar. Piano, dark guitars, chamber textures, and dramatic vocals turn atmosphere into a language for control, grief, obsession, and escape.",
    ],
    keywords: ["gothic albums", "dark cabaret", "gothic rock", "dark music"],
  },
  {
    slug: "hip-hop",
    mainGenre: "Hip-Hop",
    title: "Hip-Hop Albums",
    eyebrow: "Hip-Hop",
    description:
      "AI-assisted hip-hop concept albums with political rap, German rap, live-band energy, street detail, and narrative pressure led by voice, rhythm, and testimony.",
    intro: [
      "The hip-hop shelf is built around voice, witness, and rhythm. These albums use rap as a place for public pressure, personal accounting, and the kind of detail that does not fit neatly into a chorus.",
      "Some records lean toward live protest energy; others move through city storytelling, German rap cadence, or street-level observation. The center is always language: who gets to speak, what gets counted, and which rooms usually stay unheard.",
    ],
    keywords: ["hip-hop albums", "political rap", "german rap", "rap concept albums"],
  },
  {
    slug: "folk",
    mainGenre: "Folk",
    title: "Folk Albums",
    eyebrow: "Folk",
    description:
      "AI-assisted folk concept albums with sea stories, family memory, old rituals, acoustic textures, and mythic or regional settings where inheritance shapes the song.",
    intro: [
      "The folk shelf keeps the archive close to older forms of storytelling: sea songs, family rooms, regional memory, taverns, rituals, and voices that sound as if they have been carried from one listener to another.",
      "These albums are not all quiet, but they tend to value inheritance. Even when the arrangements grow heavy or cinematic, the songs often begin with a place, an object, or a story someone was supposed to remember before it changed shape.",
    ],
    keywords: ["folk albums", "folk pop", "folk metal", "sea shanty"],
  },
  {
    slug: "latin",
    mainGenre: "Latin",
    title: "Latin Albums",
    eyebrow: "Latin",
    description:
      "AI-assisted Latin concept albums with Afro-Cuban pop, mariachi-pop, Mexican pop, family stories, street scenes, and rhythmic color that carries memory as well as motion.",
    intro: [
      "The Latin shelf brings MelodyMind Music into songs shaped by streets, ports, balconies, family rooms, memory, and rhythm that carries more than celebration. Movement matters here, but so does the reason a person starts moving.",
      "These records use bright color and momentum, but the strongest moments are human-sized: a voice at a window, a last serenade, a procession, a harbor, a kitchen table, or a city holding several histories at once.",
    ],
    keywords: ["latin albums", "afro-cuban pop", "mariachi pop", "mexican pop"],
  },
  {
    slug: "jazz",
    mainGenre: "Jazz",
    title: "Jazz Albums",
    eyebrow: "Jazz",
    description:
      "AI-assisted jazz and Afro-Cuban jazz concept albums with late-night atmosphere, rhythmic detail, brass color, and cinematic city stories that leave room for tension.",
    intro: [
      "The jazz shelf is small but distinct: brass color, night air, Afro-Cuban movement, and songs that feel built around rooms, streets, and memory rather than straight genre display.",
      "These albums use rhythm as setting. The arrangements leave space for tension, restraint, and the kind of story that seems to happen between a final drink, an empty street, and the first pale light before sunrise.",
    ],
    keywords: ["jazz albums", "afro-cuban jazz", "cinematic jazz", "latin jazz"],
  },
  {
    slug: "soundtrack",
    mainGenre: "Soundtrack",
    title: "Soundtrack Albums",
    eyebrow: "Soundtrack",
    description:
      "AI-assisted soundtrack concept albums with cinematic scenes, instrumental scale, starships, skies, battle imagery, and widescreen production shaped around imagined motion.",
    intro: [
      "The soundtrack shelf gathers the albums that think in scenes first: flight, space, battle, weather, landscapes, and instrumental scale that suggests a camera moving before anyone says a word.",
      "These records are cinematic without needing to be background music. They use motif, texture, pacing, and silence to imply a world around the tracklist, so the listener can sense the shape of a story even without dialogue.",
    ],
    keywords: ["soundtrack albums", "cinematic music", "instrumental", "score"],
  },
  {
    slug: "classical",
    mainGenre: "Classical",
    title: "Classical Albums",
    eyebrow: "Classical",
    description:
      "AI-assisted classical and neo-classical concept albums with piano, chamber atmosphere, memory, silence, and restrained storytelling built from small emotional changes.",
    intro: [
      "The classical shelf is the quietest corner of MelodyMind Music. It focuses on piano, chamber color, silence, and albums where restraint does more work than volume.",
      "Here the concept is less about spectacle and more about time. Rooms, old memories, pauses, and small harmonic changes can suggest that something has shifted without announcing it, which is why the smallest gesture often carries the most weight.",
    ],
    keywords: ["classical albums", "neo-classical", "piano", "chamber music"],
  },
] satisfies GenreLandingPage[];

export const genreLandingPageBySlug = new Map(
  genreLandingPages.map((page) => [page.slug, page])
);
