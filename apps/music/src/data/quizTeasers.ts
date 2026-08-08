/**
 * Curated links from Music album genres to matching genre-journey quizzes on
 * quiz.melody-mind.de. The quiz app is a separate site, so the mapping is
 * maintained here alongside the Music content.
 */

const QUIZ_SITE_URL = "https://quiz.melody-mind.de";

interface QuizTeaserConfig {
  quizSlug: string;
  quizTitle: string;
  copy: string;
}

export interface QuizTeaser {
  href: string;
  quizTitle: string;
  copy: string;
}

const QUIZ_TEASERS_BY_GENRE: Record<string, QuizTeaserConfig> = {
  Metal: {
    quizSlug: "from-heavy-metal-to-extreme-metal",
    quizTitle: "From Heavy Metal to Extreme Metal",
    copy: "How well do you know metal's road from Black Sabbath and Judas Priest through thrash, doom, and extreme scenes?",
  },
  Rock: {
    quizSlug: "from-blues-to-breakdown",
    quizTitle: "From Blues to Breakdown",
    copy: "Follow heavy music from blues and R&B roots through hard rock and metal to modern breakdowns.",
  },
  Punk: {
    quizSlug: "from-punk-diy-to-alternative-rock",
    quizTitle: "From Punk DIY to Alternative Rock",
    copy: "From New York and London clubs through hardcore to alternative rock — how deep does your punk knowledge go?",
  },
  Pop: {
    quizSlug: "from-pop-to-streaming-pop",
    quizTitle: "From Radio Pop to Streaming Pop",
    copy: "Radio pop to streaming pop: questions on the sounds, business, and stars that shaped pop music.",
  },
  Folk: {
    quizSlug: "from-folk-to-bedroom-pop",
    quizTitle: "From Folk to Bedroom Pop",
    copy: "From folk revivals to bedroom pop: questions on songwriters, scenes, and sounds.",
  },
  Jazz: {
    quizSlug: "from-jazz-to-neo-soul",
    quizTitle: "From Jazz to Neo Soul",
    copy: "From jazz standards and bebop to neo soul — test your knowledge of the music's evolution.",
  },
  "Hip-Hop": {
    quizSlug: "from-hip-hop-to-trap-drill",
    quizTitle: "From Block Parties to Trap and Drill",
    copy: "From block parties to trap and drill: questions on hip-hop history and its global spread.",
  },
  Latin: {
    quizSlug: "from-latin-to-latin-trap",
    quizTitle: "From Latin Music to Latin Trap",
    copy: "Test your knowledge of Latin music's road from classic styles to Latin trap and global hits.",
  },
  Classical: {
    quizSlug: "from-classical-roots-to-neo-classical-sounds",
    quizTitle: "From Classical Roots to Neo-Classical Sounds",
    copy: "From classical roots to neo-classical sounds: questions across centuries of concert music.",
  },
};

export function getQuizTeaser(mainGenre?: string): QuizTeaser | undefined {
  if (!mainGenre) {
    return undefined;
  }

  const teaser: QuizTeaserConfig | undefined = QUIZ_TEASERS_BY_GENRE[mainGenre];
  if (!teaser) {
    return undefined;
  }

  return {
    href: `${QUIZ_SITE_URL}/${teaser.quizSlug}/`,
    quizTitle: teaser.quizTitle,
    copy: teaser.copy,
  };
}
