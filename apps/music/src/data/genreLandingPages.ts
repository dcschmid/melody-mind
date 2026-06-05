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
      "Rock at MelodyMind Music is built like a record shelf with road dust, theater lights, and amplifier heat on it. These AI-assisted concept albums move between hard rock force, folk-rock memory, rock-opera drama, and guitar-led storytelling where the setting matters as much as the chorus.",
    intro: [
      "The rock shelf is where MelodyMind Music lets guitars do narrative work. The riffs are not only there for weight; they sketch the weather around a scene, the impatience in a room, the long drive before a confession, or the pride before a fall.",
      "Hard rock muscle, folk-rock grain, rock-opera scale, city stories, and stage myths sit beside albums that need a chorus strong enough to hold a plot together. The best entries have scenery around the noise: a harbor, a rehearsal room, a coastline, a cracked throne, or a crowd waiting for the first chord to turn private pressure into public release.",
    ],
    keywords: ["rock albums", "hard rock", "folk rock", "rock opera"],
  },
  {
    slug: "metal",
    mainGenre: "Metal",
    title: "Metal Albums",
    eyebrow: "Metal",
    description:
      "Metal in this catalog favors scale, consequence, and sharp dramatic edges. MelodyMind Music uses AI-assisted production to build power metal charge, metal-opera architecture, Viking and gothic textures, and heavy stories where myth is useful only when it makes a human choice feel more costly.",
    intro: [
      "The metal shelf carries MelodyMind Music at its most theatrical. Crowns, machines, cathedrals, oaths, ruined kingdoms, heavy riffs, and choirs appear often, but the point is not decoration. The sound is built to make choices feel irreversible.",
      "Some albums lean into power metal lift and mythic battle language; others use metal opera, gothic metal, or Viking metal colors to darken the frame. The common thread is scale, but the stronger records still come down to one damaged voice, one broken order, or one promise that costs more than anyone expected.",
    ],
    keywords: ["metal albums", "power metal", "metal opera", "viking metal"],
  },
  {
    slug: "pop",
    mainGenre: "Pop",
    title: "Pop Albums",
    eyebrow: "Pop",
    description:
      "Pop is the melodic nerve center of MelodyMind Music: glossy enough to catch quickly, detailed enough to reward a closer listen. These AI-assisted concept albums move through K-pop brightness, synth-pop pressure, Nordic cool, French pop color, and art-pop detail while keeping every hook tied to character, place, or emotional turn.",
    intro: [
      "The pop shelf treats polish as a storytelling tool. K-pop brightness, synth-pop pressure, French pop, Nordic atmosphere, and art-pop detail all turn up here, but the hook is not treated as packaging. It is part of how a record explains a character, a place, or a change in mood.",
      "These albums are built for immediacy without flattening the feeling. A verse can hold first love or exile, a chorus can turn city life into a public emotion, and a synth line can make a private worry sound larger than the room. The surface shines, but the songs still need a reason to shine.",
    ],
    keywords: ["pop albums", "k-pop", "synth-pop", "art pop"],
  },
  {
    slug: "punk",
    mainGenre: "Punk",
    title: "Punk Albums",
    eyebrow: "Punk",
    description:
      "Punk at MelodyMind Music cuts through the catalog with raw guitars, hard corners, and writing that stays close to pressure a listener can recognize. These AI-assisted concept albums turn protest, gang vocals, political friction, and anti-authoritarian stories into short, urgent records that sound allergic to comfort.",
    intro: [
      "The punk shelf is direct by design. These albums deal in borders, propaganda, bills, rent, power, public anger, and the moment when a crowd stops asking for permission. The writing works best when it stays close to pressure that can be named.",
      "The sound is raw and compact: dry drums, dirty guitars, shouted hooks, sirens, and fragments of broadcast noise. The politics are strongest when they refuse to float above everyday detail, because a late notice, a checkpoint, or a locked door can say more than a slogan shouted twice.",
    ],
    keywords: ["punk albums", "political punk", "protest punk", "anti-authoritarian"],
  },
  {
    slug: "gothic",
    mainGenre: "Gothic",
    title: "Gothic Albums",
    eyebrow: "Gothic",
    description:
      "Gothic is where MelodyMind Music lets atmosphere become a form of pressure. These AI-assisted concept albums draw on dark cabaret, cathedral drama, haunted romance, chamber shadows, and gothic rock tension, turning beauty into something unstable once the candlelight starts to fade.",
    intro: [
      "The gothic shelf collects MelodyMind Music's darker theatrical records: cabaret rooms, cathedral shadows, doomed romance, ritual, memory, and beauty that starts to feel unsafe once the door is closed.",
      "The sound world changes from album to album, but the pressure stays similar. Piano, dark guitars, chamber textures, and dramatic vocals turn atmosphere into a language for control, grief, obsession, and escape. The records are moody by design, but mood is never the whole argument; it has to reveal who is trapped, who is watching, and who still has a way out.",
    ],
    keywords: ["gothic albums", "dark cabaret", "gothic rock", "dark music"],
  },
  {
    slug: "hip-hop",
    mainGenre: "Hip-Hop",
    title: "Hip-Hop Albums",
    eyebrow: "Hip-Hop",
    description:
      "Hip-hop in the MelodyMind Music catalog is led by voice first: rhythm as argument, flow as testimony, detail as evidence. These AI-assisted concept albums move through political rap, German rap cadence, live-band energy, street observation, and narrative pressure without treating the beat as a background surface.",
    intro: [
      "The hip-hop shelf is built around voice, witness, and rhythm. These albums use rap as a place for public pressure, personal accounting, and the kind of detail that does not fit neatly into a chorus.",
      "Some records lean toward live protest energy; others move through city storytelling, German rap cadence, or street-level observation. The center is always language: who gets to speak, what gets counted, and which rooms usually stay unheard. When the production hits hardest, it is usually because the words have already drawn the room.",
    ],
    keywords: ["hip-hop albums", "political rap", "german rap", "rap concept albums"],
  },
  {
    slug: "folk",
    mainGenre: "Folk",
    title: "Folk Albums",
    eyebrow: "Folk",
    description:
      "Folk gives MelodyMind Music its archive voice: songs that feel passed across tables, harbors, doorways, and half-remembered roads. These AI-assisted concept albums use sea stories, family memory, old rituals, acoustic textures, and regional or mythic settings to ask what people carry forward and what gets lost in the carrying.",
    intro: [
      "The folk shelf keeps the archive close to older forms of storytelling: sea songs, family rooms, regional memory, taverns, rituals, and voices that sound as if they have been carried from one listener to another.",
      "These albums are not all quiet, but they tend to value inheritance. Even when the arrangements grow heavy or cinematic, the songs often begin with a place, an object, or a story someone was supposed to remember before it changed shape. Folk, here, is less about purity than about continuity: the mark a story leaves after the original room is gone.",
    ],
    keywords: ["folk albums", "folk pop", "folk metal", "sea shanty"],
  },
  {
    slug: "latin",
    mainGenre: "Latin",
    title: "Latin Albums",
    eyebrow: "Latin",
    description:
      "Latin is the catalog's most kinetic shelf, full of bright movement, family rooms, street scenes, and rhythm that carries memory as well as motion. MelodyMind Music's AI-assisted concept albums draw from Afro-Cuban pop, mariachi-pop, Mexican pop, and city storytelling without reducing the songs to celebration alone.",
    intro: [
      "The Latin shelf brings MelodyMind Music into songs shaped by streets, ports, balconies, family rooms, memory, and rhythm that carries more than celebration. Movement matters here, but so does the reason a person starts moving.",
      "These records use bright color and momentum, but the strongest moments are human-sized: a voice at a window, a last serenade, a procession, a harbor, a kitchen table, or a city holding several histories at once. The rhythm opens the door; the story decides who walks through it.",
    ],
    keywords: ["latin albums", "afro-cuban pop", "mariachi pop", "mexican pop"],
  },
  {
    slug: "jazz",
    mainGenre: "Jazz",
    title: "Jazz Albums",
    eyebrow: "Jazz",
    description:
      "Jazz at MelodyMind Music lives in the late hours, where brass color, rhythmic detail, and open space can suggest more than a lyric explains. These AI-assisted jazz and Afro-Cuban jazz concept albums lean into cinematic city stories, restraint, and tension, leaving room for the listener to hear what happens between the notes.",
    intro: [
      "The jazz shelf is small but distinct: brass color, night air, Afro-Cuban movement, and songs that feel built around rooms, streets, and memory rather than straight genre display.",
      "These albums use rhythm as setting. The arrangements leave space for tension, restraint, and the kind of story that seems to happen between a final drink, an empty street, and the first pale light before sunrise. Jazz gives these records permission to breathe, but it also makes every pause count.",
    ],
    keywords: ["jazz albums", "afro-cuban jazz", "cinematic jazz", "latin jazz"],
  },
  {
    slug: "soundtrack",
    mainGenre: "Soundtrack",
    title: "Soundtrack Albums",
    eyebrow: "Soundtrack",
    description:
      "Soundtrack is where MelodyMind Music thinks in camera movement, weather, distance, and scale. These AI-assisted concept albums use cinematic scenes, instrumental architecture, starships, skies, battle imagery, and widescreen production to make imagined motion feel like a story already in progress.",
    intro: [
      "The soundtrack shelf gathers the albums that think in scenes first: flight, space, battle, weather, landscapes, and instrumental scale that suggests a camera moving before anyone says a word.",
      "These records are cinematic without needing to be background music. They use motif, texture, pacing, and silence to imply a world around the tracklist, so the listener can sense the shape of a story even without dialogue. The drama often comes from motion itself: something approaching, something vanishing, something too large to fit inside a normal song.",
    ],
    keywords: ["soundtrack albums", "cinematic music", "instrumental", "score"],
  },
  {
    slug: "classical",
    mainGenre: "Classical",
    title: "Classical Albums",
    eyebrow: "Classical",
    description:
      "Classical is the quietest shelf in MelodyMind Music, but not the smallest one emotionally. These AI-assisted classical and neo-classical concept albums work with piano, chamber color, memory, silence, and restrained storytelling, using small musical changes to suggest rooms, absences, and decisions that never needed to be shouted.",
    intro: [
      "The classical shelf is the quietest corner of MelodyMind Music. It focuses on piano, chamber color, silence, and albums where restraint does more work than volume.",
      "Here the concept is less about spectacle and more about time. Rooms, old memories, pauses, and small harmonic changes can suggest that something has shifted without announcing it, which is why the smallest gesture often carries the most weight. The records ask for slower listening, but they do not drift; they move by pressure, memory, and release.",
    ],
    keywords: ["classical albums", "neo-classical", "piano", "chamber music"],
  },
] satisfies GenreLandingPage[];

export const genreLandingPageBySlug = new Map(
  genreLandingPages.map((page) => [page.slug, page])
);
