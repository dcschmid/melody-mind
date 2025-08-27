import template from "./template";

export default {
  // Merge base template to keep existing common keys and then add/override
  ...template,

  // Machine-translated  additions for gamehome page — mark: MT
  // These entries were added automatically and should be reviewed by a native speaker.

  "accessibility.skip.to.content": "Aller au contenu principal",

  // Category filter keys used on category pages
  "category.filter.label": "Filtrer par catégorie :",
  "category.filter.aria_label": "Filtrer par catégorie",
  "category.filter.option_all": "Tous",

  // Search UI (client translations used on gamehome)
  "game.search.label": "Rechercher un genre",
  "game.search.placeholder": "Rechercher des genres...",
  "game.search.clear": "Effacer la recherche",
  "game.search.reset.text": "Réinitialiser la recherche",
  "game.search.showing.all": "Affichage de tous les genres",
  "game.search.results": "genres trouvés",
  "game.search.no.results": "Aucun genre trouvé correspondant à votre recherche",
  "game.search.help": "Tapez pour filtrer les genres musicaux par nom",

  // Gamehome hero / SEO strings
  "game.select":
    "🎵 Prêt pour l'aventure musicale ultime ? Plongez dans un monde de rythme, de mélodie et de chansons inoubliables ! Des solos de guitare époustouflants aux classiques intemporels — trouvez votre bataille musicale parfaite. Montrez au monde que vous êtes un vrai connaisseur de musique !",
  "game.welcome": "Bienvenue sur Melody Mind",
  "game.genre.selection.description":
    "Choisissez parmi plusieurs genres musicaux, y compris rock, pop, jazz, classique et plus encore. Chaque catégorie propose des questions soigneusement sélectionnées pour tester vos connaissances musicales.",
  "game.genre.list": "Sélection de genre",

  // Category-related fallbacks / empty states
  "game.categories.title": "Catégories musicales",
  "game.categories.loading": "Chargement des catégories musicales...",
  "game.categories.empty.headline": "Aucun genre trouvé",
  "game.categories.empty.text":
    "Malheureusement, aucune catégorie n'a été trouvée. Veuillez réessayer plus tard.",

  // Meta / SEO keywords
  "meta.keywords":
    "Quiz musical, Jeu musical, Quiz de chansons, Quiz d'artistes, Quiz musical en ligne, Trivia musical, Melody Mind, Jeu de devinettes musicales",

  // Small CTA used on gamehome (if not present)
  "game.start.now": "Commencer maintenant",

  // Client translation accessibility keys for gamehome scripts
  "game.search.results.found_with_count": "{count} genres trouvés", // used by some client components if present

  // Category / Knowledge / Game localized additions (French)
  "category.about.title": "À propos de cette catégorie",
  "knowledge.read.article": "Lire l'article",
  "category.difficulty.heading": "Choisissez votre niveau de difficulté",
  "knowledge.play.description":
    "🎵 Prêt pour le défi ultime ? Testez vos connaissances musicales et devenez un expert de genre ! Gagnez des points, utilisez des jokers intelligents et prouvez que vous avez ce qu'il faut pour devenir un champion de la musique ! 🏆",
  "difficulty.easy": "Facile",
  "difficulty.medium": "Moyen",
  "difficulty.hard": "Difficile",

  // Music chronology localized
  "game.chronology.title": "Chronologie musicale",
  "game.chronology.description":
    "⏰ Devenez un voyageur temporel de la musique ! Classez ces albums légendaires dans l'ordre chronologique correct et montrez que vous êtes un véritable historien de la musique. Chaque bonne action vous rapproche du score parfait ! 🎯",

  // Timepressure mode localized
  "game.timepressure.title": "Mode Pression temporelle",
  "game.timepressure.description":
    "⚡ Devenez le maître de la musique en éclair ! Prouvez que vous êtes un vrai champion même sous pression temporelle avec des niveaux de difficulté mixtes dans {category}. Chaque seconde compte — montrez simultanément votre vitesse et vos connaissances ! 🏆",

  // Mark: end of machine-translated additions for gamehome.
};
