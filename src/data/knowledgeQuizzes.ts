export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
};

const quizzes: Record<string, QuizQuestion[]> = {
  "1950s": [
    {
      question: "Which musical style became a defining youth movement in the 1950s?",
      options: ["Disco", "Rock and roll", "Grunge", "EDM"],
      correct: 1,
      explanation:
        "Rock and roll exploded in the 1950s and became a youth culture marker.",
      difficulty: "easy",
    },
    {
      question:
        "Which record format made singles cheap and widely collectible during the 1950s?",
      options: ["78 rpm shellac", "45 rpm single", "8-track", "CD"],
      correct: 1,
      explanation:
        "The 45 rpm single was affordable and perfect for jukeboxes and teens.",
      difficulty: "easy",
    },
    {
      question: "Sun Records is most closely associated with launching which artist?",
      options: ["Elvis Presley", "Aretha Franklin", "David Bowie", "Prince"],
      correct: 0,
      explanation: "Elvis recorded early hits at Sun Records in Memphis.",
      difficulty: "easy",
    },
    {
      question:
        "Which vocal style featured tight harmonies from small groups and thrived in the 1950s?",
      options: ["Doo-wop", "Gangsta rap", "Britpop", "Trap"],
      correct: 0,
      explanation: "Doo-wop groups were central to 1950s vocal harmony pop.",
      difficulty: "easy",
    },
    {
      question: "The payola scandal was mainly about what?",
      options: [
        "Illegal payments to radio DJs to play certain records",
        "Piracy of sheet music",
        "Counterfeit vinyl manufacturing",
        "Banning concerts in dance halls",
      ],
      correct: 0,
      explanation:
        "Record labels bribed DJs to spin songs, which sparked public backlash.",
      difficulty: "medium",
    },
    {
      question:
        "Which genre drew heavily from gospel and blues and expanded in the 1950s?",
      options: ["Reggae", "Rhythm and blues", "House", "K-pop"],
      correct: 1,
      explanation: "R&B evolved from gospel and blues traditions in the 1950s.",
      difficulty: "medium",
    },
    {
      question: "Which jazz style is most associated with Miles Davis in the late 1950s?",
      options: ["Cool jazz", "Swing", "Free jazz", "New jack swing"],
      correct: 0,
      explanation: "Miles Davis was a key figure in cool jazz, especially in the 1950s.",
      difficulty: "medium",
    },
    {
      question: "What was a major impact of television on 1950s music?",
      options: [
        "Artists gained national exposure through TV appearances",
        "Radio disappeared entirely",
        "Albums replaced singles overnight",
        "Live music venues shut down universally",
      ],
      correct: 0,
      explanation: "TV amplified artist visibility and shaped pop stardom.",
      difficulty: "medium",
    },
    {
      question: "Which blues development was significant in the 1950s?",
      options: [
        "Electric Chicago blues",
        "Delta blues decline",
        "Synth blues",
        "Disco blues",
      ],
      correct: 0,
      explanation: "Electric Chicago blues grew with amplified guitars and urban bands.",
      difficulty: "medium",
    },
    {
      question:
        "Which artist is often credited with bridging gospel and secular R&B in the 1950s?",
      options: ["Ray Charles", "Bing Crosby", "Brian Wilson", "Thom Yorke"],
      correct: 0,
      explanation: "Ray Charles fused gospel intensity with R&B and pop.",
      difficulty: "medium",
    },
  ],
  "1960s": [
    {
      question:
        "What term describes the wave of UK bands that conquered US charts in the early 1960s?",
      options: ["Britpop", "British Invasion", "New Wave", "Madchester"],
      correct: 1,
      explanation: "The British Invasion led by The Beatles reshaped global pop.",
      difficulty: "easy",
    },
    {
      question: "Which label became synonymous with Detroit soul in the 1960s?",
      options: ["Motown", "Sub Pop", "Def Jam", "Warp"],
      correct: 0,
      explanation: "Motown built a hit-making machine rooted in Detroit.",
      difficulty: "easy",
    },
    {
      question: "Which 1960s festival became a cultural symbol of the counterculture?",
      options: ["Woodstock", "Glastonbury 1994", "Live Aid", "Coachella"],
      correct: 0,
      explanation: "Woodstock took place in 1969 and symbolized the era.",
      difficulty: "easy",
    },
    {
      question: "Which artist helped electrify folk music and sparked controversy?",
      options: ["Bob Dylan", "Frank Sinatra", "Freddie Mercury", "Adele"],
      correct: 0,
      explanation: "Bob Dylan's electric turn in the mid-1960s split audiences.",
      difficulty: "medium",
    },
    {
      question: "Which studio technology enabled more experimental 1960s recordings?",
      options: ["Multitrack recording", "MIDI", "Auto-Tune", "MP3"],
      correct: 0,
      explanation: "Multitrack recording allowed layering and studio experimentation.",
      difficulty: "medium",
    },
    {
      question:
        "Which genre expanded with fuzz guitars, psychedelia, and studio effects?",
      options: ["Psychedelic rock", "Disco", "Trap", "Nu metal"],
      correct: 0,
      explanation: "Psychedelic rock explored altered sounds and textures.",
      difficulty: "medium",
    },
    {
      question: "Which vocal group was a central act in Motown's 1960s roster?",
      options: ["The Supremes", "The Strokes", "The Smiths", "Destiny's Child"],
      correct: 0,
      explanation: "The Supremes were among Motown's biggest 1960s stars.",
      difficulty: "easy",
    },
    {
      question: 'Which city is most associated with the "San Francisco Sound"?',
      options: ["San Francisco", "Chicago", "Nashville", "Detroit"],
      correct: 0,
      explanation: "The Bay Area scene fueled psychedelic rock.",
      difficulty: "easy",
    },
    {
      question:
        "What format became more central as albums turned into artistic statements?",
      options: ["LP album", "Cassette single", "CD single", "MiniDisc"],
      correct: 0,
      explanation: "The LP became a primary artistic format in the 1960s.",
      difficulty: "medium",
    },
    {
      question:
        "Which movement connected music to civil rights and social change in the 1960s?",
      options: ["Protest and soul music", "Yacht rock", "Eurodance", "Krautrock"],
      correct: 0,
      explanation: "Protest songs and soul music were tied to civil rights activism.",
      difficulty: "medium",
    },
  ],
  "1970s": [
    {
      question: "Which dance-focused genre dominated clubs in the mid-to-late 1970s?",
      options: ["Disco", "Grunge", "Britpop", "Drum and bass"],
      correct: 0,
      explanation: "Disco ruled the dance floor in the 1970s.",
      difficulty: "easy",
    },
    {
      question:
        "Which punk band helped define the stripped-down sound of 1970s punk rock?",
      options: ["Ramones", "U2", "Coldplay", "Radiohead"],
      correct: 0,
      explanation: "The Ramones were central to early punk aesthetics.",
      difficulty: "medium",
    },
    {
      question:
        "Which genre emerged from DJ culture and block parties in the Bronx during the 1970s?",
      options: ["Hip-hop", "Reggaeton", "Dubstep", "Techno"],
      correct: 0,
      explanation: "Hip-hop grew from Bronx block parties in the early 1970s.",
      difficulty: "medium",
    },
    {
      question: "Which album format became the core of rock listening in the 1970s?",
      options: [
        "Album-oriented rock (AOR)",
        "2-minute single",
        "Sheet music",
        "Ring tones",
      ],
      correct: 0,
      explanation: "AOR centered on full albums rather than singles.",
      difficulty: "medium",
    },
    {
      question: "Which artist helped popularize reggae internationally in the 1970s?",
      options: ["Bob Marley", "Prince", "Madonna", "Elton John"],
      correct: 0,
      explanation: "Bob Marley brought reggae to global audiences.",
      difficulty: "easy",
    },
    {
      question: "What technology became more prominent in 1970s pop and rock production?",
      options: ["Synthesizers", "Streaming", "Auto-Tune", "DAT"],
      correct: 0,
      explanation: "Synthesizers expanded the palette of 1970s production.",
      difficulty: "medium",
    },
    {
      question:
        "Which genre blended funk, soul, and dance rhythms into extended grooves?",
      options: ["Funk", "New wave", "Shoegaze", "Emo"],
      correct: 0,
      explanation: "Funk emphasized groove-heavy rhythms and bass lines.",
      difficulty: "easy",
    },
    {
      question: "Which style pushed virtuosity and long-form compositions in the 1970s?",
      options: ["Progressive rock", "Surf rock", "Skiffle", "Ska"],
      correct: 0,
      explanation: "Progressive rock favored complex, extended compositions.",
      difficulty: "medium",
    },
    {
      question:
        "Which subgenre emerged from Jamaican studio culture with heavy echo and reverb?",
      options: ["Dub", "Bossa nova", "Grunge", "Bluegrass"],
      correct: 0,
      explanation: "Dub remixed reggae with echo and reverb techniques.",
      difficulty: "medium",
    },
    {
      question: "Which 1970s movement reacted against polished rock with raw minimalism?",
      options: ["Punk", "Smooth jazz", "Adult contemporary", "Yacht rock"],
      correct: 0,
      explanation: "Punk rejected excess with fast, raw, short songs.",
      difficulty: "medium",
    },
  ],
};

export const getKnowledgeQuiz = (slug: string): QuizQuestion[] =>
  quizzes[slug] ? quizzes[slug] : [];
