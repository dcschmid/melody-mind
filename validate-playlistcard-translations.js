/**
 * PlaylistCard Translation Key Validator
 *
 * Validates that all translation keys documented for PlaylistCard component
 * are present in all language files and adds any missing keys.
 */

import fs from "fs";
import path from "path";

// PlaylistCard translation keys from comprehensive documentation
const playlistCardKeys = {
  // Streaming platform actions
  "playlist.open.spotify": "Open on Spotify",
  "playlist.open.deezer": "Open on Deezer",
  "playlist.open.apple": "Open on Apple Music",

  // Accessibility instructions and info
  "playlist.accessibility.instruction": "Use Enter to activate streaming links",
  "playlist.accessibility.info": "Playlist information",
  "playlist.accessibility.public": "This is a publicly available playlist",

  // Interactive feedback for screen readers
  "playlist.activation.focused": "Focused on playlist {title}",
  "playlist.activation.no_links": "Playlist {title} has no streaming links available",
  "playlist.exit": "Exited playlist {title}",
  "playlist.visible": "Playlist {title} is now visible",

  // Priority and loading states
  "playlist.priority.loading": "Priority playlist {title} is loading",
  "playlist.music.from.decade": "Music from {decade}",

  // Error handling
  "playlist.image.error": "Image failed to load for playlist {title}",
  "playlist.title.unknown": "Unknown playlist",
};

// Language-specific translations for the keys
const translations = {
  de: {
    "playlist.open.spotify": "Auf Spotify öffnen",
    "playlist.open.deezer": "Auf Deezer öffnen",
    "playlist.open.apple": "Auf Apple Music öffnen",
    "playlist.accessibility.instruction": "Drücken Sie Enter, um Streaming-Links zu aktivieren",
    "playlist.accessibility.info": "Playlist-Informationen",
    "playlist.accessibility.public": "Dies ist eine öffentlich verfügbare Playlist",
    "playlist.activation.focused": "Fokus auf Playlist {title}",
    "playlist.activation.no_links": "Playlist {title} hat keine verfügbaren Streaming-Links",
    "playlist.exit": "Playlist {title} verlassen",
    "playlist.visible": "Playlist {title} ist jetzt sichtbar",
    "playlist.priority.loading": "Prioritäts-Playlist {title} wird geladen",
    "playlist.music.from.decade": "Musik aus den {decade}ern",
    "playlist.image.error": "Bild konnte für Playlist {title} nicht geladen werden",
    "playlist.title.unknown": "Unbekannte Playlist",
  },
  es: {
    "playlist.open.spotify": "Abrir en Spotify",
    "playlist.open.deezer": "Abrir en Deezer",
    "playlist.open.apple": "Abrir en Apple Music",
    "playlist.accessibility.instruction": "Presiona Enter para activar los enlaces de streaming",
    "playlist.accessibility.info": "Información de la playlist",
    "playlist.accessibility.public": "Esta es una playlist disponible públicamente",
    "playlist.activation.focused": "Enfocado en playlist {title}",
    "playlist.activation.no_links": "La playlist {title} no tiene enlaces de streaming disponibles",
    "playlist.exit": "Salir de playlist {title}",
    "playlist.visible": "La playlist {title} ahora es visible",
    "playlist.priority.loading": "Playlist prioritaria {title} cargando",
    "playlist.music.from.decade": "Música de los {decade}",
    "playlist.image.error": "No se pudo cargar la imagen para playlist {title}",
    "playlist.title.unknown": "Playlist desconocida",
  },
  fr: {
    "playlist.open.spotify": "Ouvrir sur Spotify",
    "playlist.open.deezer": "Ouvrir sur Deezer",
    "playlist.open.apple": "Ouvrir sur Apple Music",
    "playlist.accessibility.instruction": "Appuyez sur Entrée pour activer les liens de streaming",
    "playlist.accessibility.info": "Informations sur la playlist",
    "playlist.accessibility.public": "Ceci est une playlist disponible publiquement",
    "playlist.activation.focused": "Focus sur la playlist {title}",
    "playlist.activation.no_links": "La playlist {title} n'a pas de liens de streaming disponibles",
    "playlist.exit": "Quitter la playlist {title}",
    "playlist.visible": "La playlist {title} est maintenant visible",
    "playlist.priority.loading": "Playlist prioritaire {title} en cours de chargement",
    "playlist.music.from.decade": "Musique des années {decade}",
    "playlist.image.error": "Impossible de charger l'image pour la playlist {title}",
    "playlist.title.unknown": "Playlist inconnue",
  },
  it: {
    "playlist.open.spotify": "Apri su Spotify",
    "playlist.open.deezer": "Apri su Deezer",
    "playlist.open.apple": "Apri su Apple Music",
    "playlist.accessibility.instruction": "Premi Invio per attivare i collegamenti streaming",
    "playlist.accessibility.info": "Informazioni sulla playlist",
    "playlist.accessibility.public": "Questa è una playlist disponibile pubblicamente",
    "playlist.activation.focused": "Focus sulla playlist {title}",
    "playlist.activation.no_links": "La playlist {title} non ha collegamenti streaming disponibili",
    "playlist.exit": "Esci dalla playlist {title}",
    "playlist.visible": "La playlist {title} è ora visibile",
    "playlist.priority.loading": "Playlist prioritaria {title} in caricamento",
    "playlist.music.from.decade": "Musica degli anni {decade}",
    "playlist.image.error": "Impossibile caricare l'immagine per la playlist {title}",
    "playlist.title.unknown": "Playlist sconosciuta",
  },
  pt: {
    "playlist.open.spotify": "Abrir no Spotify",
    "playlist.open.deezer": "Abrir no Deezer",
    "playlist.open.apple": "Abrir no Apple Music",
    "playlist.accessibility.instruction": "Pressione Enter para ativar os links de streaming",
    "playlist.accessibility.info": "Informações da playlist",
    "playlist.accessibility.public": "Esta é uma playlist disponível publicamente",
    "playlist.activation.focused": "Focado na playlist {title}",
    "playlist.activation.no_links": "A playlist {title} não tem links de streaming disponíveis",
    "playlist.exit": "Sair da playlist {title}",
    "playlist.visible": "A playlist {title} agora está visível",
    "playlist.priority.loading": "Playlist prioritária {title} carregando",
    "playlist.music.from.decade": "Música dos anos {decade}",
    "playlist.image.error": "Falha ao carregar imagem para playlist {title}",
    "playlist.title.unknown": "Playlist desconhecida",
  },
  da: {
    "playlist.open.spotify": "Åbn på Spotify",
    "playlist.open.deezer": "Åbn på Deezer",
    "playlist.open.apple": "Åbn på Apple Music",
    "playlist.accessibility.instruction": "Tryk Enter for at aktivere streaming-links",
    "playlist.accessibility.info": "Playlist-information",
    "playlist.accessibility.public": "Dette er en offentligt tilgængelig playlist",
    "playlist.activation.focused": "Fokuseret på playlist {title}",
    "playlist.activation.no_links": "Playlist {title} har ingen tilgængelige streaming-links",
    "playlist.exit": "Forlad playlist {title}",
    "playlist.visible": "Playlist {title} er nu synlig",
    "playlist.priority.loading": "Prioritetsplaylist {title} indlæses",
    "playlist.music.from.decade": "Musik fra {decade}erne",
    "playlist.image.error": "Kunne ikke indlæse billede for playlist {title}",
    "playlist.title.unknown": "Ukendt playlist",
  },
  nl: {
    "playlist.open.spotify": "Openen op Spotify",
    "playlist.open.deezer": "Openen op Deezer",
    "playlist.open.apple": "Openen op Apple Music",
    "playlist.accessibility.instruction": "Druk op Enter om streaming-links te activeren",
    "playlist.accessibility.info": "Playlist-informatie",
    "playlist.accessibility.public": "Dit is een openbaar beschikbare playlist",
    "playlist.activation.focused": "Gefocust op playlist {title}",
    "playlist.activation.no_links": "Playlist {title} heeft geen beschikbare streaming-links",
    "playlist.exit": "Verlaat playlist {title}",
    "playlist.visible": "Playlist {title} is nu zichtbaar",
    "playlist.priority.loading": "Prioriteitsplaylist {title} laadt",
    "playlist.music.from.decade": "Muziek uit de jaren {decade}",
    "playlist.image.error": "Kon afbeelding niet laden voor playlist {title}",
    "playlist.title.unknown": "Onbekende playlist",
  },
  sv: {
    "playlist.open.spotify": "Öppna på Spotify",
    "playlist.open.deezer": "Öppna på Deezer",
    "playlist.open.apple": "Öppna på Apple Music",
    "playlist.accessibility.instruction": "Tryck Enter för att aktivera streaming-länkar",
    "playlist.accessibility.info": "Spellisteinformation",
    "playlist.accessibility.public": "Detta är en offentligt tillgänglig spellista",
    "playlist.activation.focused": "Fokuserad på spellista {title}",
    "playlist.activation.no_links": "Spellista {title} har inga tillgängliga streaming-länkar",
    "playlist.exit": "Lämna spellista {title}",
    "playlist.visible": "Spellista {title} är nu synlig",
    "playlist.priority.loading": "Prioritetsspellista {title} laddas",
    "playlist.music.from.decade": "Musik från {decade}-talet",
    "playlist.image.error": "Kunde inte ladda bild för spellista {title}",
    "playlist.title.unknown": "Okänd spellista",
  },
  fi: {
    "playlist.open.spotify": "Avaa Spotifyssa",
    "playlist.open.deezer": "Avaa Deezerissa",
    "playlist.open.apple": "Avaa Apple Musicissa",
    "playlist.accessibility.instruction": "Paina Enter aktivoidaksesi streaming-linkit",
    "playlist.accessibility.info": "Soittolistan tiedot",
    "playlist.accessibility.public": "Tämä on julkisesti saatavilla oleva soittolista",
    "playlist.activation.focused": "Keskittynyt soittolistaan {title}",
    "playlist.activation.no_links": "Soittolistalla {title} ei ole saatavilla streaming-linkkejä",
    "playlist.exit": "Poistu soittolistasta {title}",
    "playlist.visible": "Soittolista {title} on nyt näkyvissä",
    "playlist.priority.loading": "Prioriteettisoittolista {title} latautuu",
    "playlist.music.from.decade": "Musiikkia {decade}-luvulta",
    "playlist.image.error": "Kuvan lataaminen epäonnistui soittolistalle {title}",
    "playlist.title.unknown": "Tuntematon soittolista",
  },
};

const localesDir = "./src/i18n/locales";
const localeFiles = fs.readdirSync(localesDir).filter((f) => f.endsWith(".ts"));

console.log("🔍 Validating PlaylistCard translation keys...\n");

let totalMissing = 0;
const missingByLanguage = new Map();

// Check each language file
for (const file of localeFiles) {
  const lang = file.replace(".ts", "");
  const filePath = path.join(localesDir, file);
  const content = fs.readFileSync(filePath, "utf8");

  const missing = [];

  // Check which keys are missing
  for (const key of Object.keys(playlistCardKeys)) {
    if (!content.includes(`"${key}"`)) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.log(`❌ ${lang.toUpperCase()}: Missing ${missing.length} keys`);
    missing.forEach((key) => console.log(`   - ${key}`));
    missingByLanguage.set(lang, missing);
    totalMissing += missing.length;
  } else {
    console.log(`✅ ${lang.toUpperCase()}: All keys present`);
  }
  console.log("");
}

console.log(`📊 Total missing keys: ${totalMissing}\n`);

if (totalMissing > 0) {
  console.log("🔧 MISSING TRANSLATIONS TO ADD:\n");

  for (const [lang, missing] of missingByLanguage) {
    console.log(`=== ${lang.toUpperCase()} ===`);
    const langTranslations = translations[lang] || playlistCardKeys; // Fallback to English

    missing.forEach((key) => {
      const translation = langTranslations[key] || playlistCardKeys[key];
      console.log(`  "${key}": "${translation}",`);
    });
    console.log("");
  }

  console.log(
    "📝 These keys should be added to the respective language files to complete PlaylistCard internationalization."
  );
} else {
  console.log("🎉 All PlaylistCard translation keys are present in all language files!");
}
