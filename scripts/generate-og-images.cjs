const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

// Project paths
const PROJECT_ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "public", "og-images");
const FONTS_DIR = path.join(PROJECT_ROOT, "public", "fonts");

// Supported languages (can be filtered via CLI: --langs=en,de)
const DEFAULT_LANGUAGES = [
  "de",
  "en",
  "es",
  "fr",
  "it",
  "pt",
  "da",
  "nl",
  "sv",
  "fi",
  "cn",
  "ru",
  "jp",
  "uk",
];

function parseListArg(name) {
  const flag = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!flag) return null;
  const val = flag.split("=")[1] || "";
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const CLI_LANGS = parseListArg("langs");
const LANGUAGES = Array.isArray(CLI_LANGS) && CLI_LANGS.length > 0 ? CLI_LANGS : DEFAULT_LANGUAGES;

// Configure canvas settings
const WIDTH = 1200;
const HEIGHT = 630;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Enhanced multilingual translations with motivational and longer descriptions
const TRANSLATIONS = {
  de: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "Tauche ein in die faszinierende Welt der Musik und teste dein Wissen in unserem interaktiven Musikquiz. Entdecke unzählige Genres, beweise dein musikalisches Können und werde zur echten Musiklegende!",

    // Playlists
    "playlist.title": "Musiksammlungen",
    "playlist.description":
      "Entdecke sorgfältig kuratierte Playlists, die dich auf eine musikalische Reise durch verschiedene Epochen nehmen. Von zeitlosen Klassikern bis zu modernen Hits - finde deinen perfekten Soundtrack für jeden Moment.",

    // Podcasts
    "podcast.title": "Musik-Podcasts",
    "podcast.description":
      "Höre faszinierende Geschichten hinter der Musik, Interviews mit Künstlern und tiefgehende Analysen verschiedener Genres. Unsere Podcasts bieten dir neue Perspektiven und erweitern dein musikalisches Verständnis.",

    // Game Home
    "game.title": "Musikquiz",
    "game.description":
      "Fordere dich selbst heraus mit spannenden Musikrätseln für jedes Wissensniveau. Wähle aus verschiedenen Genres, verdiene Punkte und erreiche neue Highscores. Das ultimative Spielerlebnis für alle Musikliebhaber!",

    // Knowledge
    "knowledge.title": "Musikwissen",
    "knowledge.description":
      "Erweitere deinen musikalischen Horizont mit unserem umfangreichen Wissenszentrum. Von Musikgeschichte bis zu Instrumentenkunde - tauche ein in die faszinierende Welt der Töne und werde zum Musikexperten.",
    "chronology.badge": "Chronologie",
    "timepressure.badge": "Zeitdruck",
  },

  en: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "Dive into the fascinating world of music and test your knowledge in our interactive music quiz. Explore countless genres, prove your musical expertise and become a true music legend!",

    // Playlists
    "playlist.title": "Music Collections",
    "playlist.description":
      "Discover carefully curated playlists that take you on a musical journey through different eras. From timeless classics to modern hits - find your perfect soundtrack for every moment.",

    // Podcasts
    "podcast.title": "Music Podcasts",
    "podcast.description":
      "Listen to fascinating stories behind the music, interviews with artists, and in-depth analyses of various genres. Our podcasts offer new perspectives and expand your musical understanding.",

    // Game Home
    "game.title": "Music Quiz",
    "game.description":
      "Challenge yourself with exciting music puzzles for every knowledge level. Choose from various genres, earn points and achieve new high scores. The ultimate gaming experience for all music lovers!",

    // Knowledge
    "knowledge.title": "Music Knowledge",
    "knowledge.description":
      "Broaden your musical horizon with our comprehensive knowledge center. From music history to instrument studies - immerse yourself in the fascinating world of sounds and become a music expert.",
    "chronology.badge": "Chronology",
    "timepressure.badge": "Time Pressure",
  },

  es: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "Sumérgete en el fascinante mundo de la música y pon a prueba tus conocimientos en nuestro cuestionario musical interactivo. ¡Explora innumerables géneros, demuestra tu experiencia musical y conviértete en una verdadera leyenda de la música!",

    // Playlists
    "playlist.title": "Colecciones Musicales",
    "playlist.description":
      "Descubre listas de reproducción cuidadosamente seleccionadas que te llevan en un viaje musical a través de diferentes épocas. Desde clásicos atemporales hasta éxitos modernos - encuentra tu banda sonora perfecta para cada momento.",

    // Podcasts
    "podcast.title": "Podcasts de Música",
    "podcast.description":
      "Escucha historias fascinantes detrás de la música, entrevistas con artistas y análisis en profundidad de varios géneros. Nuestros podcasts ofrecen nuevas perspectivas y amplían tu comprensión musical.",

    // Game Home
    "game.title": "Cuestionario Musical",
    "game.description":
      "¡Desafíate con emocionantes acertijos musicales para cada nivel de conocimiento. Elige entre varios géneros, gana puntos y alcanza nuevos récords. La experiencia de juego definitiva para todos los amantes de la música!",

    // Knowledge
    "knowledge.title": "Conocimiento Musical",
    "knowledge.description":
      "Amplía tu horizonte musical con nuestro completo centro de conocimiento. Desde la historia de la música hasta el estudio de instrumentos - sumérgete en el fascinante mundo de los sonidos y conviértete en un experto en música.",
    "chronology.badge": "Cronología",
    "timepressure.badge": "Contrarreloj",
  },

  fr: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "Plongez dans le monde fascinant de la musique et testez vos connaissances dans notre quiz musical interactif. Explorez d'innombrables genres, prouvez votre expertise musicale et devenez une véritable légende de la musique!",

    // Playlists
    "playlist.title": "Collections Musicales",
    "playlist.description":
      "Découvrez des playlists soigneusement sélectionnées qui vous emmènent dans un voyage musical à travers différentes époques. Des classiques intemporels aux hits modernes - trouvez votre bande sonore parfaite pour chaque moment.",

    // Podcasts
    "podcast.title": "Podcasts de Musique",
    "podcast.description":
      "Écoutez des histoires fascinantes derrière la musique, des interviews d'artistes et des analyses approfondies de divers genres. Nos podcasts offrent de nouvelles perspectives et élargissent votre compréhension musicale.",

    // Game Home
    "game.title": "Quiz Musical",
    "game.description":
      "Défiez-vous avec des énigmes musicales passionnantes pour chaque niveau de connaissance. Choisissez parmi différents genres, gagnez des points et atteignez de nouveaux records. L'expérience de jeu ultime pour tous les amateurs de musique!",

    // Knowledge
    "knowledge.title": "Connaissances Musicales",
    "knowledge.description":
      "Élargissez votre horizon musical avec notre centre de connaissances complet. De l'histoire de la musique à l'étude des instruments - immergez-vous dans le monde fascinant des sons et devenez un expert en musique.",
    "chronology.badge": "Chronologie",
    "timepressure.badge": "Contre-la-montre",
  },

  it: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "Immergiti nel fascinante mondo della musica e metti alla prova le tue conoscenze nel nostro quiz musicale interattivo. Esplora innumerevoli generi, dimostra la tua competenza musicale e diventa una vera leggenda della musica!",

    // Playlists
    "playlist.title": "Collezioni Musicali",
    "playlist.description":
      "Scopri playlist accuratamente selezionate che ti portano in un viaggio musicale attraverso diverse epoche. Dai classici senza tempo ai successi moderni - trova la tua colonna sonora perfetta per ogni momento.",

    // Podcasts
    "podcast.title": "Podcast Musicali",
    "podcast.description":
      "Ascolta storie affascinanti dietro la musica, interviste con artisti e analisi approfondite di vari generi. I nostri podcast offrono nuove prospettive e ampliano la tua comprensione musicale.",

    // Game Home
    "game.title": "Quiz Musicale",
    "game.description":
      "Sfida te stesso con entusiasmanti enigmi musicali per ogni livello di conoscenza. Scegli tra vari generi, guadagna punti e raggiungi nuovi record. L'esperienza di gioco definitiva per tutti gli amanti della musica!",

    // Knowledge
    "knowledge.title": "Conoscenza Musicale",
    "knowledge.description":
      "Amplia il tuo orizzonte musicale con il nostro centro di conoscenza completo. Dalla storia della musica allo studio degli strumenti - immergiti nel fascinante mondo dei suoni e diventa un esperto di musica.",
    "chronology.badge": "Cronologia",
    "timepressure.badge": "A tempo",
  },

  pt: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "Mergulhe no fascinante mundo da música e teste seus conhecimentos em nosso quiz musical interativo. Explore inúmeros gêneros, prove sua experiência musical e torne-se uma verdadeira lenda da música!",

    // Playlists
    "playlist.title": "Coleções Musicais",
    "playlist.description":
      "Descubra playlists cuidadosamente selecionadas que o levam em uma jornada musical através de diferentes épocas. De clássicos atemporais a hits modernos - encontre sua trilha sonora perfeita para cada momento.",

    // Podcasts
    "podcast.title": "Podcasts de Música",
    "podcast.description":
      "Ouça histórias fascinantes por trás da música, entrevistas com artistas e análises aprofundadas de vários gêneros. Nossos podcasts oferecem novas perspectivas e expandem sua compreensão musical.",

    // Game Home
    "game.title": "Quiz Musical",
    "game.description":
      "Desafie-se com emocionantes enigmas musicais para cada nível de conhecimento. Escolha entre vários gêneros, ganhe pontos e alcance novos recordes. A experiência de jogo definitiva para todos os amantes de música!",

    // Knowledge
    "knowledge.title": "Conhecimento Musical",
    "knowledge.description":
      "Amplie seu horizonte musical com nosso abrangente centro de conhecimento. Da história da música ao estudo de instrumentos - mergulhe no fascinante mundo dos sons e torne-se um especialista em música.",
    "chronology.badge": "Cronologia",
    "timepressure.badge": "Contra o tempo",
  },

  da: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "Dyk ned i musikkens fascinerende verden og test din viden i vores interaktive musikquiz. Udforsk utallige genrer, bevis din musikalske ekspertise og bliv en sand musiklegende!",

    // Playlists
    "playlist.title": "Musiksamlinger",
    "playlist.description":
      "Opdag omhyggeligt kuraterede playlister, der tager dig med på en musikalsk rejse gennem forskellige epoker. Fra tidløse klassikere til moderne hits - find dit perfekte soundtrack til ethvert øjeblik.",

    // Podcasts
    "podcast.title": "Musik Podcasts",
    "podcast.description":
      "Lyt til fascinerende historier bag musikken, interviews med kunstnere og dybdegående analyser af forskellige genrer. Vores podcasts tilbyder nye perspektiver og udvider din musikalske forståelse.",

    // Game Home
    "game.title": "Musik Quiz",
    "game.description":
      "Udfordr dig selv med spændende musikgåder for ethvert vidensniveau. Vælg mellem forskellige genrer, optjen point og opnå nye rekorder. Den ultimative spiloplevelse for alle musikelskere!",

    // Knowledge
    "knowledge.title": "Musikviden",
    "knowledge.description":
      "Udvid din musikalske horisont med vores omfattende videncenter. Fra musikhistorie til instrumentstudier - fordyb dig i lydenes fascinerende verden og bliv musikekspert.",
    "chronology.badge": "Kronologi",
    "timepressure.badge": "Tidspres",
  },

  nl: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "Duik in de fascinerende wereld van muziek en test je kennis in onze interactieve muziekquiz. Verken talloze genres, bewijs je muzikale expertise en word een ware muzieklegende!",

    // Playlists
    "playlist.title": "Muziekcollecties",
    "playlist.description":
      "Ontdek zorgvuldig samengestelde afspeellijsten die je meenemen op een muzikale reis door verschillende tijdperken. Van tijdloze klassiekers tot moderne hits - vind je perfecte soundtrack voor elk moment.",

    // Podcasts
    "podcast.title": "Muziek Podcasts",
    "podcast.description":
      "Luister naar fascinerende verhalen achter de muziek, interviews met artiesten en diepgaande analyses van verschillende genres. Onze podcasts bieden nieuwe perspectieven en verbreden je muzikale begrip.",

    // Game Home
    "game.title": "Muziek Quiz",
    "game.description":
      "Daag jezelf uit met spannende muziekpuzzels voor elk kennisniveau. Kies uit verschillende genres, verdien punten en behaal nieuwe records. De ultieme spelervaring voor alle muziekliefhebbers!",

    // Knowledge
    "knowledge.title": "Muziekkennis",
    "knowledge.description":
      "Verbreed je muzikale horizon met ons uitgebreide kenniscentrum. Van muziekgeschiedenis tot instrumentenstudies - dompel jezelf onder in de fascinerende wereld van klanken en word een muziekexpert.",
    "chronology.badge": "Chronologie",
    "timepressure.badge": "Tijdsdruk",
  },

  sv: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "Dyk ner i musikens fascinerande värld och testa dina kunskaper i vårt interaktiva musikquiz. Utforska otaliga genrer, bevisa din musikaliska expertis och bli en äkta musiklegend!",

    // Playlists
    "playlist.title": "Musiksamlingar",
    "playlist.description":
      "Upptäck noggrant utvalda spellistor som tar dig med på en musikalisk resa genom olika epoker. Från tidlösa klassiker till moderna hits - hitta ditt perfekta soundtrack för varje ögonblick.",

    // Podcasts
    "podcast.title": "Musik Podcasts",
    "podcast.description":
      "Lyssna på fascinerande berättelser bakom musiken, intervjuer med artister och djupgående analyser av olika genrer. Våra podcasts erbjuder nya perspektiv och utökar din musikaliska förståelse.",

    // Game Home
    "game.title": "Musik Quiz",
    "game.description":
      "Utmana dig själv med spännande musikgåtor för varje kunskapsnivå. Välj bland olika genrer, tjäna poäng och nå nya rekord. Den ultimata spelupplevelsen för alla musikälskare!",

    // Knowledge
    "knowledge.title": "Musikkunskap",
    "knowledge.description":
      "Bredda din musikaliska horisont med vårt omfattande kunskapscenter. Från musikhistoria till instrumentstudier - fördjupa dig i ljudens fascinerande värld och bli en musikexpert.",
    "chronology.badge": "Kronologi",
    "timepressure.badge": "Tidspress",
  },

  fi: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "Sukella musiikin kiehtovaan maailmaan ja testaa tietojasi interaktiivisessa musiikkivisassamme. Tutki lukemattomia genrejä, todista musiikillinen asiantuntemuksesi ja tule todelliseksi musiikkilegendaksi!",

    // Playlists
    "playlist.title": "Musiikkikokoelmat",
    "playlist.description":
      "Löydä huolellisesti kuratoituja soittolistoja, jotka vievät sinut musiikilliselle matkalle eri aikakausien läpi. Ajattomista klassikoista moderneihin hitteihin - löydä täydellinen ääniraita jokaiseen hetkeen.",

    // Podcasts
    "podcast.title": "Musiikki Podcastit",
    "podcast.description":
      "Kuuntele kiehtovia tarinoita musiikin takana, haastatteluja artistien kanssa ja syvällisiä analyyseja eri genreistä. Podcastimme tarjoavat uusia näkökulmia ja laajentavat musiikillista ymmärrystäsi.",

    // Game Home
    "game.title": "Musiikkivisa",
    "game.description":
      "Haasta itsesi jännittävillä musiikkiarvoituksilla jokaiselle tietotasolle. Valitse eri genreistä, ansaitse pisteitä ja saavuta uusia ennätyksiä. Täydellinen pelikokemus kaikille musiikin ystäville!",

    // Knowledge
    "knowledge.title": "Musiikkitieto",
    "knowledge.description":
      "Laajenna musiikillista näköpiiriäsi kattavan tietokeskuksemme avulla. Musiikin historiasta soitintutkimuksiin - uppoudu äänien kiehtovaan maailmaan ja tule musiikkiasiantuntijaksi.",
    "chronology.badge": "Kronologia",
    "timepressure.badge": "Aikapaine",
  },
  cn: {
    // Homepage
    "home.title": "MelodyMind",
    "home.description":
      "探索迷人的音乐世界，在我们的互动音乐问答中测试你的知识。发现无数流派，展示你的音乐功底，成为真正的音乐传奇！",
    "playlist.title": "音乐精选",
    "playlist.description": "发现精心策划的歌单，带你穿越不同时代。从永恒经典到现代热门——为每个时刻找到完美配乐。",
    "podcast.title": "音乐播客",
    "podcast.description": "聆听音乐背后的故事、艺术家访谈以及各类风格的深度解析。开启新的视角，拓展音乐理解。",
    "game.title": "音乐问答",
    "game.description": "从多种流派中选择，挑战不同难度，赢取高分。属于每位音乐爱好者的极致体验！",
    "knowledge.title": "音乐知识",
    "knowledge.description": "拓展你的音乐视野——从音乐史到乐器知识，沉浸在声音的世界中，成为真正的音乐达人。",
    "chronology.badge": "年代",
    "timepressure.badge": "限时",
  },
  jp: {
    "home.title": "MelodyMind",
    "home.description": "音楽の世界へ飛び込んで、インタラクティブなクイズで知識を試そう。無数のジャンルを探索して、真の音楽通になろう！",
    "playlist.title": "音楽プレイリスト",
    "playlist.description": "厳選されたプレイリストで、さまざまな時代を音楽とともに旅しよう。タイムレスな名曲から最新ヒットまで。",
    "podcast.title": "音楽ポッドキャスト",
    "podcast.description": "音楽の裏側の物語、アーティストへのインタビュー、幅広いジャンルの深掘りをお届け。",
    "game.title": "音楽クイズ",
    "game.description": "多彩なジャンルと難易度に挑戦し、ハイスコアを目指そう。音楽ファン必見の体験！",
    "knowledge.title": "音楽知識",
    "knowledge.description": "音楽史から楽器まで、知識を広げて音の世界に浸ろう。",
    "chronology.badge": "年代順",
    "timepressure.badge": "タイムアタック",
  },
  ru: {
    "home.title": "MelodyMind",
    "home.description": "Откройте для себя удивительный мир музыки и проверьте свои знания в интерактивной викторине. Исследуйте жанры, покажите мастерство и станьте легендой!",
    "playlist.title": "Музыкальные подборки",
    "playlist.description": "Откройте тщательно составленные плейлисты — путешествие сквозь эпохи: от классики до современных хитов.",
    "podcast.title": "Музыкальные подкасты",
    "podcast.description": "Истории за кулисами, интервью с артистами и глубокий разбор жанров — расширяйте музыкальный кругозор.",
    "game.title": "Музыкальная викторина",
    "game.description": "Выбирайте жанры и сложность, зарабатывайте очки и ставьте рекорды — идеальный опыт для меломанов!",
    "knowledge.title": "Музыкальные знания",
    "knowledge.description": "Расширяйте кругозор: от истории музыки до инструментов — погружайтесь в мир звуков.",
    "chronology.badge": "Хронология",
    "timepressure.badge": "На время",
  },
  uk: {
    "home.title": "MelodyMind",
    "home.description": "Пориньте у світ музики та перевірте свої знання в інтерактивній вікторині. Досліджуйте жанри й ставайте музичною легендою!",
    "playlist.title": "Музичні плейлисти",
    "playlist.description": "Добірки, що проведуть крізь епохи — від вічної класики до сучасних хітів.",
    "podcast.title": "Музичні подкасти",
    "podcast.description": "Історії за лаштунками, інтерв'ю з артистами та глибокий аналіз жанрів — відкривайте нове бачення музики.",
    "game.title": "Музична вікторина",
    "game.description": "Обирайте жанри та складність, набирайте очки та ставте рекорди — ідеально для меломанів!",
    "knowledge.title": "Музичні знання",
    "knowledge.description": "Розширюйте кругозір: від історії музики до інструментознавства — пірнайте у світ звуків.",
    "chronology.badge": "Хронологія",
    "timepressure.badge": "На час",
  },
};

// Page type definitions with style information
const PAGE_TYPES = {
  home: {
    background: {
      direction: "to bottom right",
      colorStops: ["#18181b 0%", "#27272a 25%", "#4c1d95 75%", "#6d28d9 100%"],
    },
  },
  playlists: {
    background: {
      direction: "to right",
      colorStops: ["#18181b 0%", "#312e81 50%", "#4c1d95 100%"],
    },
  },
  podcasts: {
    background: {
      direction: "to bottom left",
      colorStops: ["#18181b 0%", "#1e3a8a 50%", "#312e81 100%"],
    },
  },
  knowledge: {
    background: {
      direction: "to top right",
      colorStops: ["#18181b 0%", "#365314 50%", "#3b82f6 100%"],
    },
  },
  gameHome: {
    background: {
      direction: "45deg",
      colorStops: ["#18181b 0%", "#7e22ce 50%", "#4f46e5 100%"],
    },
  },
  chronology: {
    background: {
      direction: "to bottom",
      colorStops: ["#0b1020 0%", "#1e3a8a 50%", "#7c3aed 100%"],
    },
  },
  timePressure: {
    background: {
      direction: "to bottom right",
      colorStops: ["#111827 0%", "#b45309 50%", "#dc2626 100%"], // zinc-900 → amber-600 → red-600
    },
  },
};

// Erweiterte Konfiguration für bessere visuelle Gestaltung
const VISUAL_CONFIG = {
  // Farbschema für verschiedene Seitentypen
  colors: {
    primary: "#6d28d9", // Purple-600
    secondary: "#4f46e5", // Indigo-600
    dark: "#18181b", // Zinc-900
    light: "#ffffff", // White
    accent: "#3b82f6", // Blue-500
  },
  // Logo-Konfiguration
  logo: {
    size: 120,
    marginTop: 50,
  },
  // Text-Konfiguration
  typography: {
    titleSize: 72,
    descriptionSize: 36,
    titleLineHeight: 90,
    descriptionLineHeight: 45,
    titleMarginBottom: 20,
  },
  // Dekorative Elemente
  decorations: {
    circleCount: 4,
    maxRadius: 150,
    minRadius: 50,
    opacity: 0.1,
  },
};

/**
 * Gets translation for a specific language and key
 *
 * @param {string} lang - The language code
 * @param {string} key - The translation key
 * @returns {string} The translated text or a fallback
 */
function getTranslation(lang, key) {
  // Try to get translation for the requested language
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
    return TRANSLATIONS[lang][key];
  }

  // Fallback to English
  if (TRANSLATIONS["en"] && TRANSLATIONS["en"][key]) {
    return TRANSLATIONS["en"][key];
  }

  // Ultimate fallback - return the key itself
  return key;
}

// Hintergrundmuster für zusätzliche Textur
function _addTextureToBackground(ctx) {
  const pattern = addNoisyTexture(ctx);
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

// Erzeugt eine subtile Rauschtextur
function addNoisyTexture(ctx) {
  // Erstelle einen unsichtbaren Canvas für die Textur
  const textureCanvas = createCanvas(150, 150);
  const textureCtx = textureCanvas.getContext("2d");

  // Fülle mit transparentem Hintergrund
  textureCtx.fillStyle = "rgba(255, 255, 255, 0)";
  textureCtx.fillRect(0, 0, 150, 150);

  // Füge zufällige Punkte hinzu für Rauscheffekt
  const noiseOpacity = 0.03;
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 150;
    const y = Math.random() * 150;
    const size = Math.random() * 2.5;
    const color =
      Math.random() > 0.5
        ? `rgba(255, 255, 255, ${noiseOpacity})`
        : `rgba(0, 0, 0, ${noiseOpacity})`;

    textureCtx.beginPath();
    textureCtx.fillStyle = color;
    textureCtx.arc(x, y, size, 0, Math.PI * 2);
    textureCtx.fill();
  }

  return ctx.createPattern(textureCanvas, "repeat");
}

// Fügt dekorative Kreise als Design-Element hinzu
function addDecorativeElements(ctx, pageType) {
  const colors = PAGE_TYPES[pageType].background.colorStops.map((stop) => stop.split(" ")[0]);

  // Zeichne mehrere Kreise mit verschiedenen Größen und Positionen
  for (let i = 0; i < VISUAL_CONFIG.decorations.circleCount; i++) {
    const radius =
      Math.random() * (VISUAL_CONFIG.decorations.maxRadius - VISUAL_CONFIG.decorations.minRadius) +
      VISUAL_CONFIG.decorations.minRadius;

    // Positioniere je nach Index
    let x, y;
    if (i === 0) {
      // Oben rechts
      x = WIDTH - radius * 0.5;
      y = radius * 0.5;
    } else if (i === 1) {
      // Unten links
      x = radius * 0.5;
      y = HEIGHT - radius * 0.5;
    } else {
      // Zufällige Position für andere
      x = Math.random() * WIDTH;
      y = Math.random() * HEIGHT;
    }

    // Verwende eine Farbe aus dem Farbschema
    const colorIndex = i % colors.length;
    ctx.beginPath();
    ctx.fillStyle = colors[colorIndex];
    ctx.globalAlpha = VISUAL_CONFIG.decorations.opacity;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

/**
 * Create a gradient background on a canvas context with improved visual style
 */
function createGradientBackground(ctx, pageType) {
  const styleInfo = PAGE_TYPES[pageType].background;

  // Create linear gradient
  let gradient;
  if (styleInfo.direction === "45deg") {
    gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  } else if (styleInfo.direction === "to right") {
    gradient = ctx.createLinearGradient(0, 0, WIDTH, 0);
  } else if (styleInfo.direction === "to bottom") {
    gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  } else if (styleInfo.direction === "to bottom right") {
    gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  } else if (styleInfo.direction === "to bottom left") {
    gradient = ctx.createLinearGradient(WIDTH, 0, 0, HEIGHT);
  } else if (styleInfo.direction === "to top right") {
    gradient = ctx.createLinearGradient(0, HEIGHT, WIDTH, 0);
  } else {
    gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  }

  // Add color stops
  styleInfo.colorStops.forEach((stop) => {
    const [color, position] = stop.split(" ");
    gradient.addColorStop(parseFloat(position) / 100, color);
  });

  // Fill with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Füge dekorative Elemente hinzu
  addDecorativeElements(ctx, pageType);

  // Füge subtile Textur hinzu
  const noiseOpacity = 0.04;
  ctx.fillStyle = `rgba(255, 255, 255, ${noiseOpacity})`;

  // Streue Punkte mit leicht unterschiedlichen Größen für organischere Textur
  for (let i = 0; i < WIDTH * HEIGHT * 0.009; i++) {
    const x = Math.random() * WIDTH;
    const y = Math.random() * HEIGHT;
    const size = Math.random() * 2.2 + 0.2; // Größen zwischen 0.2 und 2.4

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Fügt einen leichten Rahmen zum Bild hinzu
 */
function addSubtleBorder(ctx) {
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.rect(12, 12, WIDTH - 24, HEIGHT - 24);
  ctx.stroke();
}

/**
 * Verbesserte Text-Rendering-Funktion mit Textschatten
 */
function renderTextWithEffects(ctx, text, x, y, maxWidth, lineHeight, options = {}) {
  const { fontSize = 48, fontWeight = "normal", color = "#ffffff", shadow = true, maxLines } = options;

  // Setze Schriftart und Stil
  ctx.font = `${fontWeight} ${fontSize}px Inter, sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  // Füge Textschatten hinzu, wenn aktiviert
  if (shadow) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = fontSize * 0.08;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = fontSize * 0.04;
  }

  // Wrapped Text zeichnen (optional mit maxLines + Ellipsis)
  wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines);

  // Textschatten zurücksetzen
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * Retry mechanism for image generation with fallback
 *
 * @param {Function} fn - The function to retry
 * @param {number} retries - Number of retries before giving up
 * @param {any} fallback - Value to return if all retries fail
 * @returns {Promise<any>} Result of function or fallback
 */
async function withRetry(fn, retries = 2, fallback = null) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Operation failed, retrying... (${retries} attempts left)`);
      return withRetry(fn, retries - 1, fallback);
    }
    console.error(`Operation failed after retries: ${error.message}`);
    return fallback;
  }
}

/**
 * Generate an OG image with enhanced visual design and error handling
 */
async function generateOgImage(title, description, type, lang) {
  return withRetry(
    async () => {
      const canvas = createCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext("2d");

      // Create beautiful background
      createGradientBackground(ctx, type);

      // Add subtle border for depth
      addSubtleBorder(ctx);

      // Try to draw logo if exists (prefer brand mark)
      try {
        const preferredLogoPath = path.join(PROJECT_ROOT, "public", "melody-mind.png");
        const fallbackLogoPath = path.join(PROJECT_ROOT, "public", "social-share.jpg");
        const logoPath = fs.existsSync(preferredLogoPath)
          ? preferredLogoPath
          : fs.existsSync(fallbackLogoPath)
          ? fallbackLogoPath
          : null;
        if (logoPath) {
          const logo = await loadImage(logoPath);
          const logoSize = VISUAL_CONFIG.logo.size;
          ctx.drawImage(
            logo,
            WIDTH / 2 - logoSize / 2,
            VISUAL_CONFIG.logo.marginTop,
            logoSize,
            logoSize
          );
        }
      } catch (err) {
        console.warn("Could not load logo image:", err.message);
      }

      // Enhanced text rendering with effects
      const titleY = HEIGHT * 0.4;
      renderTextWithEffects(
        ctx,
        title,
        WIDTH / 2,
        titleY,
        WIDTH - 120,
        VISUAL_CONFIG.typography.titleLineHeight,
        {
          fontSize: VISUAL_CONFIG.typography.titleSize,
          fontWeight: "bold",
          color: VISUAL_CONFIG.colors.light,
          shadow: true,
          maxLines: 2,
        }
      );

      const descriptionY = HEIGHT * 0.65;
      renderTextWithEffects(
        ctx,
        description,
        WIDTH / 2,
        descriptionY,
        WIDTH - 180,
        VISUAL_CONFIG.typography.descriptionLineHeight,
        {
          fontSize: VISUAL_CONFIG.typography.descriptionSize,
          fontWeight: "normal",
          color: "#e2e2e7",
          shadow: true,
          maxLines: 3,
        }
      );

      // Add chronology badge if applicable
      if (type === "chronology") {
        try {
          const badgeText = getTranslation(lang || "en", "chronology.badge");
          drawBadge(ctx, badgeText, "sort");
        } catch {}
      }
      if (type === "timePressure") {
        try {
          const badgeText = getTranslation(lang || "en", "timepressure.badge");
          drawBadge(ctx, badgeText, "clock");
        } catch {}
      }

      // Add a subtle signature
      ctx.font = "16px Inter, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.textAlign = "right";
      ctx.fillText("melodymind.app", WIDTH - 32, HEIGHT - 24);

      // Return as buffer with improved quality
      return canvas.toBuffer("image/jpeg", { quality: 0.92 });
    },
    2,
    null
  );
}

/**
 * Helper function to wrap text on canvas
 */
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const hasMax = typeof maxLines === "number" && maxLines > 0;

  // Detect CJK (no spaces) and fall back to grapheme-based wrapping
  const hasCJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(text);
  const hasSpaces = /\s/.test(text);

  // Tokenize: use words with trailing space for Latin; per-char for CJK/no-space
  const tokens = (!hasSpaces || hasCJK)
    ? Array.from(text)
    : text.split(" ").map((w) => w + " ");

  let line = "";
  let lineCount = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const testLine = line + token;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && line !== "") {
      // If this new token would overflow, draw current line
      if (hasMax && lineCount + 1 >= maxLines) {
        // Ellipsize current line to fit
        let trimmed = line.trimEnd();
        while (trimmed.length > 0 && ctx.measureText(trimmed + " …").width > maxWidth) {
          trimmed = trimmed.slice(0, -1);
        }
        ctx.fillText(trimmed + " …", x, y + lineCount * lineHeight);
        return;
      }
      ctx.fillText(line, x, y + lineCount * lineHeight);
      line = token;
      lineCount++;
    } else {
      line = testLine;
    }
  }

  // Draw final line
  if (!hasMax || lineCount < maxLines) {
    if (hasMax && lineCount + 1 >= maxLines && ctx.measureText(line).width > maxWidth) {
      let trimmed = line.trimEnd();
      while (trimmed.length > 0 && ctx.measureText(trimmed + " …").width > maxWidth) {
        trimmed = trimmed.slice(0, -1);
      }
      ctx.fillText(trimmed + " …", x, y + lineCount * lineHeight);
    } else {
      ctx.fillText(line, x, y + lineCount * lineHeight);
    }
  }
}

/**
 * Draw a small rounded badge in the top-left area
 */
function drawBadge(ctx, text, icon) {
  if (!text) return;
  const paddingX = 18;
  const paddingY = 10;
  const radius = 14;
  const margin = 28;
  const fontSize = 28;
  ctx.font = `600 ${fontSize}px Inter, sans-serif`;
  const metrics = ctx.measureText(text);
  const iconGap = icon ? 12 : 0;
  const iconBox = icon ? fontSize + 6 : 0; // square box for icon
  const tw = metrics.width + (icon ? iconGap + iconBox : 0);
  const th = fontSize * 1.2;
  const bw = tw + paddingX * 2;
  const bh = th + paddingY * 2;
  const x = margin;
  const y = margin;

  // Rounded rect background
  ctx.save();
  ctx.beginPath();
  roundRectPath(ctx, x, y, bw, bh, radius);
  const grad = ctx.createLinearGradient(x, y, x + bw, y + bh);
  grad.addColorStop(0, "rgba(59, 130, 246, 0.9)"); // blue-500
  grad.addColorStop(1, "rgba(124, 58, 237, 0.9)"); // violet-600
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Text + optional icon
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  let tx = x + paddingX;
  if (icon === "clock") {
    drawIconClock(ctx, tx, y + bh / 2, iconBox);
    tx += iconBox + iconGap;
  } else if (icon === "sort") {
    drawIconSort(ctx, tx, y + bh / 2, iconBox);
    tx += iconBox + iconGap;
  }
  ctx.fillText(text, tx, y + bh / 2);
}

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/**
 * Draw a simple clock icon (stroke only) centered at (cx, cy) with given box size
 */
function drawIconClock(ctx, cx, cy, size) {
  if (!size) return;
  const r = size * 0.4;
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(2, size * 0.08);
  // circle
  ctx.beginPath();
  ctx.arc(cx + size / 2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  // hands (12:00 and ~4:00)
  // center
  const ox = cx + size / 2;
  const oy = cy;
  // hour hand
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(ox, oy - r * 0.6);
  ctx.stroke();
  // minute hand
  const ang = Math.PI / 3; // 60 degrees
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(ox + r * Math.cos(ang) * 0.85, oy + r * Math.sin(ang) * 0.85);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw a simple sort icon (up/down arrows) centered at (cx, cy)
 */
function drawIconSort(ctx, cx, cy, size) {
  if (!size) return;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  const w = size * 0.26;
  const h = size * 0.34;
  const gap = size * 0.08;
  const leftX = cx + size / 2 - w - gap / 2;
  const rightX = cx + size / 2 + gap / 2;
  const topY = cy - h / 2;
  const bottomY = cy + h / 2;

  // Up arrow (left)
  ctx.beginPath();
  ctx.moveTo(leftX + w / 2, topY);
  ctx.lineTo(leftX, topY + h * 0.6);
  ctx.lineTo(leftX + w, topY + h * 0.6);
  ctx.closePath();
  ctx.fill();
  // Down arrow (right)
  ctx.beginPath();
  ctx.moveTo(rightX + w / 2, bottomY);
  ctx.lineTo(rightX, bottomY - h * 0.6);
  ctx.lineTo(rightX + w, bottomY - h * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Initialize font setup
 */
async function setupFonts() {
  try {
    const fontSetupPath = path.join(__dirname, "setup-fonts.cjs");

    // Check if setup-fonts.cjs exists
    if (fs.existsSync(fontSetupPath)) {
      // Import and run the font setup script
      const setupFontsFunc = require("./setup-fonts.cjs");
      await setupFontsFunc();
    } else {
      console.warn("Font setup script not found. Fonts may not be available.");

      // Create fonts directory anyway
      if (!fs.existsSync(FONTS_DIR)) {
        fs.mkdirSync(FONTS_DIR, { recursive: true });
      }
    }
  } catch (error) {
    console.error("Failed to set up fonts:", error);
  }
}

/**
 * Main function to generate OG images with improved error handling
 */
async function generateAllOgImages() {
  if (process.env.NODE_ENV !== "production") {
    console.log("🎵 MelodyMind OG Image Generator 🎵");
  }
  if (process.env.NODE_ENV !== "production") {
    console.log("======================================");
  }

  // Setup fonts first
  try {
    await setupFonts();

    // Register fonts (assuming Inter font is in public/fonts)
    try {
      registerFont(path.join(FONTS_DIR, "Inter-Bold.ttf"), {
        family: "Inter",
        weight: "bold",
      });
      registerFont(path.join(FONTS_DIR, "Inter-Regular.ttf"), {
        family: "Inter",
      });
      if (process.env.NODE_ENV !== "production") {
        console.log("✅ Fonts registered successfully");
      }
    } catch (error) {
      console.warn("Could not register fonts. Using system fonts instead:", error.message);
    }

    // Track failures for summary
    let totalImages = 0;
    let successfulImages = 0;

    for (const lang of LANGUAGES) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`\nGenerating OG images for language: ${lang}...`);
      }

      // Allow filtering page types via CLI: --types=home,podcasts
      const DEFAULT_PAGES = [
        {
          type: "home",
          title: getTranslation(lang, "home.title"),
          description: getTranslation(lang, "home.description"),
          filename: `social-share-home.jpg`,
        },
        {
          type: "playlists",
          title: getTranslation(lang, "playlist.title"),
          description: getTranslation(lang, "playlist.description"),
          filename: `social-share-playlists.jpg`,
        },
        {
          type: "podcasts",
          title: getTranslation(lang, "podcast.title"),
          description: getTranslation(lang, "podcast.description"),
          filename: `social-share-podcasts.jpg`,
        },
        {
          type: "gameHome",
          title: getTranslation(lang, "game.title"),
          description: getTranslation(lang, "game.description"),
          filename: `social-share-gamehome.jpg`,
        },
        {
          type: "timePressure",
          title: getTranslation(lang, "game.title"),
          description: getTranslation(lang, "game.description"),
          filename: `social-share-timepressure.jpg`,
        },
        {
          type: "chronology",
          title: getTranslation(lang, "game.title"),
          description: getTranslation(lang, "game.description"),
          filename: `social-share-chronology.jpg`,
        },
        {
          type: "knowledge",
          title: getTranslation(lang, "knowledge.title"),
          description: getTranslation(lang, "knowledge.description"),
          filename: `social-share-knowledge.jpg`,
        },
      ];
      const CLI_TYPES = parseListArg("types");
      const allowed = Array.isArray(CLI_TYPES) && CLI_TYPES.length > 0 ? new Set(CLI_TYPES) : null;
      const pagesToGenerate = allowed ? DEFAULT_PAGES.filter((p) => allowed.has(p.type)) : DEFAULT_PAGES;

      // Generate and save each image (refactored to reduce nesting)
      async function processPages(pages, language) {
        for (const page of pages) {
          try {
            const outputFilename = `${page.filename.replace(".jpg", "")}-${language}.jpg`;
            if (process.env.NODE_ENV !== "production") {
              console.log(`  • Generating ${outputFilename}...`);
            }

            const imageBuffer = await generateOgImage(page.title, page.description, page.type, language);

            if (!imageBuffer) {
              throw new Error("Failed to generate image buffer");
            }

            const outputPath = path.join(OUTPUT_DIR, outputFilename);
            fs.writeFileSync(outputPath, imageBuffer);
            if (process.env.NODE_ENV !== "production") {
              console.log(`    ✅ Successfully saved`);
            }
            successfulImages++;

            // Also create a language-agnostic version (e.g. social-share-home.jpg)
            // But only for the default language (English)
            if (language === "en") {
              const genericFilename = page.filename;
              const genericOutputPath = path.join(OUTPUT_DIR, genericFilename);
              fs.writeFileSync(genericOutputPath, imageBuffer);
              if (process.env.NODE_ENV !== "production") {
                console.log(`    ✅ Also saved as ${genericFilename}`);
              }
            }
          } catch (err) {
            console.error(`    ❌ Error: ${err.message}`);
          } finally {
            // Maintain image counters consistently
            totalImages++;
          }
        }
      }

      await processPages(pagesToGenerate, lang);
    }

    // Summary
    if (process.env.NODE_ENV !== "production") {
      console.log("\n✨ OG Image Generation Summary:");
    }
    if (process.env.NODE_ENV !== "production") {
      console.log(`📊 Generated ${successfulImages} of ${totalImages} images successfully`);
    }

    if (successfulImages === totalImages) {
      if (process.env.NODE_ENV !== "production") {
        console.log("✅ All OG images have been generated!");
      }
      return true;
    } else {
      console.warn(`⚠️ ${totalImages - successfulImages} images could not be generated`);
      return successfulImages > 0;
    }
  } catch (err) {
    console.error("\n❌ Unexpected error during OG image generation:", err);
    return false;
  }
}

// Run the script
generateAllOgImages().catch((err) => {
  console.error("\n❌ Error generating OG images:", err);
  process.exit(1);
});
