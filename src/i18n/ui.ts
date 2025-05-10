export const languages = {
  de: "Deutsch",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
  da: "Dansk",
  nl: "Nederlands",
  sv: "Svenska",
  fi: "Suomi",
};

export const defaultLang = "de";

export const ui = {
  de: {
    // Auth-Komponenten
    "auth.required.title": "Anmeldung erforderlich",
    "auth.required.description":
      "Bitte melde dich an, um auf diesen Bereich zuzugreifen",
    "auth.login.title": "Anmelden",
    "auth.register.title": "Registrieren",
    "auth.login.email": "E-Mail-Adresse",
    "auth.login.email.placeholder": "Deine E-Mail-Adresse",
    "auth.login.password": "Passwort",
    "auth.login.password.placeholder": "Dein Passwort",
    "auth.login.remember": "Angemeldet bleiben",
    "auth.login.forgot_password": "Passwort vergessen?",
    "auth.login.success": "Anmeldung erfolgreich",
    "auth.login.error": "Fehler bei der Anmeldung",
    "auth.toggle.login": "Zum Login wechseln",
    "auth.toggle.register": "Zur Registrierung wechseln",
    "auth.login.submit": "Anmelden",
    "auth.register.submit": "Registrieren",
    "auth.form.submit": "Absenden",
    "auth.form.loading": "Wird verarbeitet...",
    "auth.tabs.login": "Anmelden",
    "auth.tabs.register": "Registrieren",
    "auth.validation.processing": "Eingaben werden überprüft...",
    "auth.form.error.general": "Ein Fehler ist aufgetreten",
    "auth.form.success": "Erfolgreich!",
    "auth.form.email_required": "E-Mail-Adresse ist erforderlich",
    "auth.form.email_invalid_short": "Ungültige E-Mail-Adresse",
    "auth.form.loading_text": "Wird geladen...",
    "auth.form.send_reset_link": "Zurücksetzen-Link senden",
    "auth.form.password_required": "Passwort ist erforderlich",
    "auth.form.password_requirements":
      "Das Passwort erfüllt nicht alle Anforderungen",
    "auth.form.password_confirm_required":
      "Passwortbestätigung ist erforderlich",
    "auth.form.passwords_not_match": "Die Passwörter stimmen nicht überein",
    "auth.password_reset.success_message":
      "Wenn ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail mit Anweisungen zum Zurücksetzen des Passworts gesendet.",
    "auth.password_reset.error_message":
      "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
    "auth.password_reset.complete_success":
      "Passwort erfolgreich zurückgesetzt. Du kannst dich jetzt mit deinem neuen Passwort anmelden.",
    "auth.password_reset.complete_error":
      "Passwort-Reset fehlgeschlagen. Bitte überprüfe deine Eingaben oder fordere einen neuen Reset-Link an.",

    "auth.register.name": "Vollständiger Name",
    "auth.register.email": "E-Mail-Adresse",
    "auth.register.email.placeholder": "Deine E-Mail-Adresse",
    "auth.register.username": "Benutzername",
    "auth.register.username.placeholder": "Wähle einen Benutzernamen",
    "auth.register.password": "Passwort",
    "auth.register.password.placeholder": "Erstelle ein sicheres Passwort",
    "auth.register.password_confirm": "Passwort bestätigen",
    "auth.register.password_confirm.placeholder": "Passwort erneut eingeben",
    "auth.register.terms": "Ich akzeptiere die Nutzungsbedingungen",
    "auth.register.success": "Registrierung erfolgreich",
    "auth.register.error": "Fehler bei der Registrierung",

    "auth.password_reset.title": "Passwort zurücksetzen",
    "auth.password_reset.submit": "Link zum Zurücksetzen senden",
    "auth.password_reset.email": "E-Mail-Adresse",
    "auth.password_reset.email.placeholder":
      "Deine registrierte E-Mail-Adresse",
    "auth.password_reset.back_to_login": "Zurück zur Anmeldung",
    "auth.password_reset.login": "Anmelden",
    "auth.password_reset.success":
      "Ein Link zum Zurücksetzen wurde an deine E-Mail-Adresse gesendet",
    "auth.password_reset.error":
      "Fehler beim Senden des Links zum Zurücksetzen",
    "auth.password_reset.new_password": "Neues Passwort",
    "auth.password_reset.confirm_password": "Neues Passwort bestätigen",
    "auth.password_reset.change_submit": "Passwort ändern",

    "auth.email_verification.title": "E-Mail-Verifizierung",
    "auth.email_verification.message":
      "Wir haben einen Verifizierungslink an deine E-Mail-Adresse gesendet",
    "auth.email_verification.check_inbox": "Bitte überprüfe deinen Posteingang",
    "auth.email_verification.resend": "Verifizierungslink erneut senden",
    "auth.email_verification.success": "E-Mail erfolgreich verifiziert",
    "auth.email_verification.error": "Fehler bei der E-Mail-Verifizierung",

    // Passwortvalidierung
    "auth.password.requirements": "Passwortanforderungen:",
    "auth.password.min_length": "Passwort muss mindestens 8 Zeichen lang sein",
    "auth.password.uppercase":
      "Passwort muss mindestens einen Großbuchstaben enthalten",
    "auth.password.lowercase":
      "Passwort muss mindestens einen Kleinbuchstaben enthalten",
    "auth.password.number": "Passwort muss mindestens eine Zahl enthalten",
    "auth.password.special":
      "Passwort muss mindestens ein Sonderzeichen enthalten",
    "auth.password.no_common":
      "Passwort darf kein häufig verwendetes Passwort sein",
    "auth.password.no_repeats":
      "Passwort darf keine wiederholten Zeichen enthalten",
    "auth.password.no_sequences":
      "Passwort darf keine einfachen Sequenzen enthalten",
    "auth.password.match": "Passwörter müssen übereinstimmen",
    "auth.password.strength": "Passwortstärke",
    "auth.password.strength.weak": "Schwach",
    "auth.password.strength.medium": "Mittel",
    "auth.password.strength.strong": "Stark",
    "auth.password.strength.very_strong": "Sehr stark",

    // Formularvalidierung
    "auth.form.required": "Dieses Feld ist erforderlich",
    "auth.form.email_invalid": "Bitte gib eine gültige E-Mail-Adresse ein",
    "auth.form.min_length":
      "Dieses Feld muss mindestens {length} Zeichen lang sein",
    "auth.form.max_length":
      "Dieses Feld darf nicht länger als {length} Zeichen sein",
    "auth.form.invalid": "Dieses Feld ist ungültig",

    // Zugänglichkeit
    "auth.accessibility.loading": "Wird geladen, bitte warten",
    "auth.accessibility.error": "Fehler: {message}",
    "auth.accessibility.required_field": "Pflichtfeld",
    "auth.accessibility.password_toggle": "Passwort anzeigen/verbergen",
    "auth.accessibility.password_requirements":
      "Passwortanforderungen anzeigen/verbergen",
    "auth.accessibility.form": "Anmeldeformular",
    "auth.accessibility.close_modal": "Fenster schließen",

    // API-Fehlermeldungen
    "auth.api.network_error":
      "Netzwerkfehler. Bitte überprüfe deine Verbindung",
    "auth.api.server_error": "Serverfehler. Bitte versuche es später erneut",
    "auth.api.invalid_credentials": "Ungültige Anmeldedaten",
    "auth.api.account_exists":
      "Ein Konto mit dieser E-Mail-Adresse existiert bereits",
    "auth.api.email_not_found": "Kein Konto mit dieser E-Mail-Adresse gefunden",
    "auth.api.too_many_requests":
      "Zu viele Versuche. Bitte versuche es später erneut",

    // Service-Fehlermeldungen
    "auth.service.session_expired":
      "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an",
    "auth.service.unauthorized": "Nicht autorisiert. Bitte melde dich an",
    "auth.service.account_locked":
      "Dein Konto wurde gesperrt. Bitte kontaktiere den Support",
    "auth.service.permission_denied":
      "Berechtigung für diese Aktion verweigert",
    "auth.service.invalid_credentials":
      "Ungültige Anmeldedaten. Bitte überprüfe deine E-Mail und dein Passwort.",
    "auth.service.too_many_attempts":
      "Zu viele Anmeldeversuche. Bitte warte einen Moment und versuche es dann erneut.",

    "nav.home": "Startseite",
    "nav.rules": "Spielregeln",
    "category.no_image_available": "Kein Bild verfügbar",
    "game.score": "Punktestand",
    "game.round": "Runde",
    "game.joker": "50:50 Joker",
    "difficulty.easy": "Leicht",
    "difficulty.medium": "Mittel",
    "difficulty.hard": "Schwer",
    "game.select":
      "Entdecke die faszinierende Welt der Musik und teste dein Wissen in unseren interaktiven Musik-Quizzen. Wähle dein Lieblingsgenre und beginne deine klangvolle Reise!",
    "game.welcome": "Willkommen bei Melody Mind",
    "game.genre.list": "Genre Auswahl",
    "game.search.label": "Suche nach einem Genre",
    "game.search.description":
      "Die Liste wird während der Eingabe automatisch gefiltert",
    "game.genre.play.label": "spielen",
    "game.genre.image": "Cover-Bild für",
    "game.no.results": "Keine Ergebnisse gefunden",
    "game.not.available": "Nicht verfügbar",
    "category.selected": "gewählt!",
    "category.difficulty.heading": "Wähle deinen Schwierigkeitsgrad",
    "category.difficulty.group": "Schwierigkeitsgrade",
    "category.difficulty.easy": "Leicht",
    "category.difficulty.medium": "Mittel",
    "category.difficulty.hard": "Schwer",
    "category.difficulty.easy.label": "Starte Spiel im leichten Modus",
    "category.difficulty.medium.label": "Starte Spiel im mittleren Modus",
    "category.difficulty.hard.label": "Starte Spiel im schweren Modus",
    "category.image.alt": "Cover-Bild",
    "nav.menu.open": "Menü öffnen",
    "nav.menu.close": "Menü schließen",
    "nav.menu.home": "Startseite",
    "nav.menu.rules": "Spielregeln",
    "nav.menu.highscores": "Bestenliste",
    "nav.menu.profile": "Profil",
    "nav.menu.logout": "Abmelden",
    "nav.logout.text": "Abmelden",
    "nav.logout.label": "Von der Anwendung abmelden",
    "nav.skip.main": "Zum Hauptinhalt springen",
    "game.end.title": "Spiel beendet!",
    "game.end.motivation":
      "Fantastische Leistung! 🎉 Dein musikalisches Wissen ist beeindruckend. Fordere dich mit einer weiteren Runde heraus und werde zur echten Musiklegende! 🎵",
    "game.end.score": "Erreichte Punkte:",
    "game.end.newgame": "Neues Spiel",
    "game.end.share": "Teile deinen Erfolg!",
    "game.end.home": "Startseite",
    "game.feedback.resolution": "Auflösung",
    "game.feedback.media.section": "Medien-Bereich",
    "game.feedback.audio.preview": "Musik-Vorschau",
    "game.feedback.subtitles": "Untertitel",
    "game.feedback.audio.unsupported":
      "Dein Browser unterstützt keine Audio-Wiedergabe.",
    "game.feedback.streaming.links": "Musik-Streaming Links",
    "game.feedback.listen.spotify": "Auf Spotify anhören",
    "game.feedback.listen.deezer": "Auf Deezer anhören",
    "game.feedback.listen.apple": "Auf Apple Music anhören",
    "game.feedback.next.round": "Nächste Runde",
    "game.current.round": "Runde",
    "game.current.round.label": "Aktuelle Rundennummer",
    "game.joker.options": "Joker Optionen",
    "game.joker.use": "50:50 Joker einsetzen",
    "game.joker.description": "Entfernt zwei falsche Antwortmöglichkeiten",
    "loading.content": "Inhalte werden geladen...",
    "share.title": "Teile deinen Erfolg!",
    "share.buttons.group.label": "Social Media Teilen-Optionen",
    "share.facebook": "Auf Facebook teilen",
    "share.whatsapp": "Über WhatsApp teilen",
    "share.native": "Teilen mit...",
    "share.native.label": "Teilen",
    "share.twitter": "Auf X/Twitter teilen",
    "share.email": "Per E-Mail teilen",
    "share.email.label": "E-Mail",
    "share.copy": "Text zum Teilen in die Zwischenablage kopieren",
    "share.copy.label": "Text kopieren",
    "error.default": "Ein Fehler ist aufgetreten",
    "error.close": "Fehlermeldung schließen",
    "coins.collected": "Gesammelte Münzen",
    "language.picker.label": "Sprachwahl",
    "language.change": "Sprache der Webseite ändern",
    "language.select.label": "Wählen Sie Ihre bevorzugte Sprache",
    "language.de": "Deutsch",
    "language.en": "Englisch",
    "language.es": "Spanisch",
    "language.fr": "Französisch",
    "language.it": "Italienisch",
    "language.pt": "Portugiesisch",
    "language.da": "Dänisch",
    "language.nl": "Niederländisch",
    "language.sv": "Schwedisch",
    "language.fi": "Finnisch",
    "language.de.label": "Webseite auf Deutsch anzeigen",
    "language.en.label": "Webseite auf Englisch anzeigen",
    "language.es.label": "Webseite auf Spanisch anzeigen",
    "language.fr.label": "Webseite auf Französisch anzeigen",
    "language.it.label": "Webseite auf Italienisch anzeigen",
    "language.pt.label": "Webseite auf Portugiesisch anzeigen",
    "language.da.label": "Webseite auf Dänisch anzeigen",
    "language.nl.label": "Webseite auf Niederländisch anzeigen",
    "language.sv.label": "Webseite auf Schwedisch anzeigen",
    "language.fi.label": "Webseite auf Finnisch anzeigen",
    "playlist.item.unavailable": "Dieser Inhalt ist noch nicht verfügbar",
    "playlist.item.status": "Status",
    "playlist.item.coming.soon": "Demnächst verfügbar",
    "game.area.label": "Spielbereich",
    "game.options.label": "Antwortmöglichkeiten",
    "game.answer.correct": "Richtig! {points} Punkte + {bonus} Bonuspunkte",
    "game.answer.wrong": "Falsch! Die richtige Antwort war: {answer}",
    "error.invalid.question": "Ungültige Frage oder keine Optionen vorhanden",
    "error.no.initial.question": "Keine gültige initiale Frage gefunden",
    "error.no.albums.found": "Keine Alben für Kategorie {category} gefunden",
    "meta.keywords":
      "Musik Quiz, Musikspiel, Song Quiz, Künstler Quiz, Online Musikquiz, Musik Trivia, Melody Mind, Musik Ratespiel",
    "knowledge.title": "Musik-Wissensdatenbank",
    "knowledge.intro":
      "Tauche ein in die faszinierende Welt der Musikgeschichte. Hier findest du spannende Artikel über verschiedene Musikepochen, Genres und deren Entwicklung. Entdecke interessante Fakten und erweitere dein Musikwissen.",
    "knowledge.search.label": "Artikel durchsuchen",
    "knowledge.search.placeholder": "Suchen...",
    "knowledge.filter.all": "Alle Keywords",
    "knowledge.no.results":
      "Keine Artikel gefunden. Versuche es mit anderen Suchbegriffen.",
    "game.remaining": "verbleibend",
    "game.default.headline": "Spiel",
    "popup.score": "Punkte: {score}",
    "popup.golden.lp.score": "Erreichte Punkte: {score}",
    "nav.donate.heading": "Unterstütze uns",
    "nav.donate.paypal": "Via PayPal spenden",
    "nav.donate.coffee": "Kaffee spendieren",
    "nav.title": "Navigation",
    "nav.menu.text": "Menü",
    "game.categories.empty.headline": "Keine Genres gefunden",
    "game.categories.empty.text":
      "Es wurden leider keine Kategorien gefunden. Bitte versuche es später erneut.",
    "game.categories.no.playable.headline": "Keine spielbaren Genres",
    "game.categories.no.playable.text":
      "Es gibt derzeit keine spielbaren Kategorien. Bitte schau später wieder vorbei.",
    "knowledge.reading.time": "min Lesezeit",
    "knowledge.breadcrumb.label": "Navigation",
    "knowledge.listen.heading": "Höre verwandte Musik",
    "knowledge.back.to.list": "Zurück zur Übersicht",
    "knowledge.interact.heading": "Anhören & Spielen",
    "knowledge.play.heading": "Dieses Genre spielen",
    "knowledge.play.description":
      "Teste dein Wissen zu diesem Musikgenre in unserem interaktiven Quiz!",
    "knowledge.play.category": "Musikquiz starten",
    "category.play": "Spielen",
    "play.cover.puzzle": "Cover Puzzle spielen",
    "play.cover.puzzle.description":
      "Im Cover Puzzle musst du Albumcover nach und nach erkennen. Je schneller du das richtige Album identifizierst, desto mehr Punkte erhältst du. Teste dein visuelles Gedächtnis für Musikcover!",
    "podcast.page.title": "Musikpodcasts | Melody Mind",
    "podcast.page.heading": "Faszinierende Musikpodcasts",
    "podcast.page.description":
      "Tauche ein in die Welt der Musik mit unseren fesselnden Podcasts. Entdecke spannende Geschichten, faszinierende Hintergründe und prägende Momente verschiedener Musikepochen - perfekt für alle, die Musik nicht nur hören, sondern auch verstehen wollen. Unsere Podcasts erscheinen alle 2 Wochen und sind ausschließlich auf Deutsch und Englisch verfügbar.",
    "podcast.search.label": "Podcasts durchsuchen",
    "podcast.search.placeholder":
      "Nach faszinierenden Musikgeschichten suchen...",
    "podcast.search.status.all": "Alle Podcasts werden angezeigt",
    "podcast.search.status.one": "1 Podcast gefunden",
    "podcast.search.status.multiple": "{count} Podcasts gefunden",
    "podcast.no.results":
      "Keine passenden Podcasts gefunden. Versuche es mit einem anderen Suchbegriff.",
    "podcast.duration.error": "Dauer nicht verfügbar",
    "podcast.play": "Abspielen",
    "podcast.intro.title": "Einführung in Astropod",
    "podcast.intro.description":
      "Astropod ist eine kostenlose und quelloffene Lösung für serverlose Podcasts.",
    "podcast.deploy.title": "Serverlosen Podcast in 2 Minuten bereitstellen",
    "podcast.deploy.description":
      "Erfahren Sie, wie Sie Ihren Podcast schnell bereitstellen können.",
    "podcast.auth.title": "Benutzerauthentifizierung und Dashboard-Zugriff",
    "podcast.auth.description":
      "Aktivieren Sie die Authentifizierung und greifen Sie auf das Dashboard zu.",
    "podcast.config.title": "Astropod Podcast konfigurieren",
    "podcast.config.description":
      "Lernen Sie, wie Sie Ihren Podcast konfigurieren.",
    "podcast.publish.title": "Ihre erste Episode veröffentlichen",
    "podcast.publish.description":
      "Veröffentlichen Sie Ihre erste Episode mit Leichtigkeit.",
    "podcast.conclusion.title": "Fazit",
    "podcast.conclusion.description": "Zusammenfassung und nächste Schritte.",
    "podcast.listen.on": "Anhören auf",
    "podcast.language.availability":
      "Unsere Podcasts sind ausschließlich auf Deutsch und Englisch verfügbar.",
    "podcast.listen.heading": "Höre unsere Podcasts",
    "login.welcome": "Willkommen bei Melody Mind!",
    "login.description":
      "Begib dich auf eine musikalische Entdeckungsreise durch die Zeiten! Teste dein Wissen in spannenden Quizzen, erkunde faszinierende Musikgenres und tauche ein in unsere mitreißenden Podcasts. Zeige dein Können, sammle Punkte und werde zur wahren Musiklegende!",
    "index.continue": "Los geht's!",
    "index.start.game.label": "Starte deine musikalische Reise",
    "index.welcome.footnote":
      "Vorbereitet von Musikliebhabern für Musikliebhaber. Viel Spaß!",
    "accessibility.wcag": "Diese Anwendung strebt WCAG AAA Konformität an.",
    "game.instructions.title": "Spielanleitung",
    "game.instructions.puzzle":
      "Versuche das Album zu erraten, während das Cover nach und nach aufgedeckt wird. Je schneller du richtig rätst, desto mehr Punkte erhältst du.",
    "game.time.remaining": "Verbleibende Zeit:",
    "game.puzzle.label": "Album Cover Puzzle",
    "game.puzzle.loading": "Puzzle wird geladen...",
    "game.options.legend": "Wähle das richtige Album aus",
    "game.next.round": "Nächste Runde starten",
    "game.puzzle.revealed": "{percent}% des Albumcovers wurde aufgedeckt",
    "game.option.choose": "Wähle",
    "game.options.available": "Antwortmöglichkeiten sind jetzt verfügbar",
    "game.time.remaining.seconds": "Noch {seconds} Sekunden übrig",
    "game.time.up": "Zeit ist um! Das korrekte Album war:",
    "game.correct.answer": "Richtige Antwort",
    "game.slower.speed": "Langsameres Spiel",
    "game.normal.speed": "Normale Geschwindigkeit",
    "game.skip.to.answers": "Zu den Antwortmöglichkeiten springen",
    "game.next": "Weiter",
    "aria.pressed": "Gedrückt",
    "aria.expanded": "Erweitert",
    "aria.shortcuts.panel": "Tastaturkürzel-Panel",
    "aria.shortcuts.list": "Liste der verfügbaren Tastenkombinationen",
    "knowledge.empty": "Keine Artikel für diese Sprache gefunden",
    "playlist.page.title": "Musik Playlists | Melody Mind",
    "playlist.page.heading": "Entdecke unsere Musikplaylists",
    "playlist.page.description":
      "Tauche ein in sorgfältig kuratierte Playlists verschiedener Epochen und Genres. Perfekt zum Entdecken neuer Musik oder zum Wiedererleben deiner Lieblingsklassiker.",
    "playlist.search.label": "Playlists durchsuchen",
    "playlist.search.placeholder": "Nach Musikera oder Stil suchen...",
    "playlist.filter.all": "Alle Epochen",
    "playlist.no.results":
      "Keine passenden Playlists gefunden. Versuche es mit einem anderen Suchbegriff.",
    "playlist.listen.on": "Anhören auf",
    "playlist.listen.spotify": "Auf Spotify anhören",
    "playlist.listen.deezer": "Auf Deezer anhören",
    "playlist.listen.apple": "Auf Apple Music anhören",
    "playlist.decade.filter": "Nach Jahrzehnt filtern",
    "footer.rights": "Alle Rechte vorbehalten",
    "footer.donate": "Spenden",
    "game.chronology.title": "Musik-Chronologie",
    "game.chronology.description":
      "Ordne diese Alben nach ihrem Erscheinungsjahr (ältestes zuerst)",
    "game.chronology.area.label": "Chronologie-Spielbereich",
    "game.chronology.result": "Ergebnis",
    "game.chronology.correct": "Korrekt",
    "game.chronology.wrong": "Sollte an Position {position} sein",
    "game.chronology.score": "Ergebnis: {score} Punkte",
    "game.chronology.details": "{correct} von {total} Alben korrekt platziert",
    "game.chronology.year": "Jahr: {year}",
    "game.chronology.drag.help":
      "Nutze die Pfeiltasten ↑/↓ oder Drag & Drop zum Sortieren",
    "game.submit.answer": "Antwort überprüfen",
    "game.chronology.up": "Nach oben",
    "game.chronology.down": "Nach unten",
    "game.chronology.position": "Position",
    "game.chronology.start": "Anfang",
    "game.chronology.end": "Ende",
    "common.back.to.top": "Zurück nach oben",
    "knowledge.articles.heading": "Wissensartikel",
    "knowledge.search.heading": "Artikel durchsuchen",
    "knowledge.search.description":
      "Artikel werden automatisch während der Eingabe gefiltert",
    "knowledge.search.reset": "Suche zurücksetzen",
    "knowledge.search.reset.text": "Zurücksetzen",
    "knowledge.no.results.help":
      "Versuche andere Suchbegriffe oder setze die Suche zurück",
    "knowledge.keyboard.instructions":
      "Verwende die Pfeiltasten zur Navigation zwischen Artikeln. Drücke Enter, um einen Artikel zu öffnen.",
    "difficulty.level": "Schwierigkeitsgrad",

    // Profilseite
    "profile.title": "Mein Profil",
    "profile.description":
      "Verwalte deine persönlichen Informationen und sieh dir deine Spielstatistiken an",
    "profile.loading": "Profildaten werden geladen...",
    "profile.error": "Fehler beim Laden der Profildaten",
    "profile.auth.required":
      "Du musst angemeldet sein, um dein Profil anzuzeigen",
    "profile.user.info": "Benutzerinformationen",
    "profile.user.since": "Mitglied seit",
    "profile.stats.title": "Spielstatistiken",
    "profile.stats.quiz": "Quiz",
    "profile.stats.chronology": "Chronologie",
    "profile.stats.total.score": "Gesamtpunktzahl",
    "profile.stats.games.played": "Gespielte Spiele",
    "profile.stats.highest.score": "Höchste Punktzahl",
    "profile.recent.games": "Letzte Spielergebnisse",
    "profile.recent.games.empty": "Du hast noch keine Spiele gespielt",
    "profile.recent.game.mode": "Spielmodus",
    "profile.recent.game.category": "Kategorie",
    "profile.recent.game.difficulty": "Schwierigkeit",
    "profile.recent.game.score": "Punktzahl",
    "profile.recent.game.date": "Datum",
    "profile.nav.aria": "Navigering till användarprofil",
    "profile.nav.link": "Gå till profil",

    // Highscores-Seite
    "highscores.title": "Bestenliste",
    "highscores.description":
      "Sieh dir die besten Punktzahlen in verschiedenen Spielmodi und Kategorien an",
    "highscores.loading": "Bestenliste wird geladen...",
    "highscores.error": "Fehler beim Laden der Bestenliste",
    "highscores.empty": "Keine Einträge in der Bestenliste gefunden",
    "highscores.filter.title": "Bestenliste filtern",
    "highscores.filter.game.mode": "Spielmodus",
    "highscores.filter.category": "Kategorie",
    "highscores.filter.all": "Alle",
    "highscores.filter.search": "Kategorien durchsuchen...",
    "highscores.filter.no.results": "Keine Kategorien gefunden",
    "highscores.table.title": "Top-Punktzahlen",
    "highscores.table.rank": "Rang",
    "highscores.table.player": "Spieler",
    "highscores.table.game.mode": "Spielmodus",
    "highscores.table.category": "Kategorie",
    "highscores.table.score": "Punktzahl",
    "highscores.table.date": "Datum",

    // Achievement-System
    "achievements.title": "Achievements",
    "achievements.description":
      "Entdecke und schalte Achievements frei, um deinen Fortschritt zu verfolgen",
    "achievements.loading": "Achievements werden geladen...",
    "achievements.error": "Fehler beim Laden der Achievements",
    "achievements.empty": "Keine Achievements gefunden",
    "achievements.category.bronze": "Bronze",
    "achievements.category.silver": "Silber",
    "achievements.category.gold": "Gold",
    "achievements.category.platinum": "Platin",
    "achievements.category.diamond": "Diamant",
    "achievements.category.time": "Zeit",
    "achievements.status.locked": "Gesperrt",
    "achievements.status.in_progress": "In Bearbeitung",
    "achievements.status.unlocked": "Freigeschaltet",
    "achievements.progress": "Fortschritt: {progress}%",
    "achievements.unlocked_at": "Freigeschaltet am {date}",
    "achievements.points": "Punkte: {points}",
    "achievements.rarity": "Seltenheit: {percentage}%",
    "achievements.notification.unlocked": "Achievement freigeschaltet!",
    "achievements.notification.progress":
      "Achievement-Fortschritt aktualisiert!",
    "achievements.filter.title": "Achievements filtern",
    "achievements.filter.status": "Status",
    "achievements.filter.category": "Kategorie",
    "achievements.filter.all": "Alle",
    "achievements.filter.all_categories": "Alle Kategorien",
    "achievements.filter.status.aria": "Achievements nach Status filtern",
    "achievements.filter.category.aria": "Achievements nach Kategorie filtern",

    // Spielzähler-Achievements
    "achievements.games_played_1": "Anfänger: 1 Spiel",
    "achievements.games_played_1.description":
      "Spiele dein erstes Spiel in einem beliebigen Modus",
    "achievements.games_played_5": "Anfänger: 5 Spiele",
    "achievements.games_played_5.description":
      "Spiele 5 Partien in einem beliebigen Modus",
    "achievements.games_played_10": "Anfänger: 10 Spiele",
    "achievements.games_played_10.description":
      "Spiele 10 Partien in einem beliebigen Modus",

    // Tägliche Streak-Achievements
    "achievements.daily_streak_1": "Täglicher Spieler",
    "achievements.daily_streak_1.description": "Spiele an einem Tag in Folge",
    "achievements.daily_streak_3": "Musik-Enthusiast",
    "achievements.daily_streak_3.description": "Spiele an 3 Tagen in Folge",
    "achievements.daily_streak_5": "Melodie-Meister",
    "achievements.daily_streak_5.description": "Spiele an 5 Tagen in Folge",
    "achievements.daily_streak_7": "Perfekte Woche",
    "achievements.daily_streak_7.description": "Spiele an 7 Tagen in Folge",
    "achievements.daily_streak_14": "Musik-Veteran",
    "achievements.daily_streak_14.description": "Spiele an 14 Tagen in Folge",
    "achievements.daily_streak_30": "Melodie-Legende",
    "achievements.daily_streak_30.description": "Spiele an 30 Tagen in Folge",

    // Tägliche Spiele-Achievements
    "achievements.daily_games_3": "Warm-Up",
    "achievements.daily_games_3.description": "Spiele 3 Partien an einem Tag",
    "achievements.daily_games_5": "Musik-Session",
    "achievements.daily_games_5.description": "Spiele 5 Partien an einem Tag",
    "achievements.daily_games_10": "Musik-Marathon",
    "achievements.daily_games_10.description": "Spiele 10 Partien an einem Tag",
    "achievements.daily_games_20": "Melodie-Marathon",
    "achievements.daily_games_20.description": "Spiele 20 Partien an einem Tag",
    "achievements.daily_games_30": "Musik-Ultra",
    "achievements.daily_games_30.description": "Spiele 30 Partien an einem Tag",
    "achievements.daily_games_50": "Melodie-Wahnsinn",
    "achievements.daily_games_50.description": "Spiele 50 Partien an einem Tag",
    "achievements.games_played_25": "Amateur: 25 Spiele",
    "achievements.games_played_25.description":
      "Spiele 25 Partien in einem beliebigen Modus",
    "achievements.games_played_50": "Amateur: 50 Spiele",
    "achievements.games_played_50.description":
      "Spiele 50 Partien in einem beliebigen Modus",
    "achievements.games_played_75": "Amateur: 75 Spiele",
    "achievements.games_played_75.description":
      "Spiele 75 Partien in einem beliebigen Modus",
    "achievements.games_played_100": "Fortgeschritten: 100 Spiele",
    "achievements.games_played_100.description":
      "Spiele 100 Partien in einem beliebigen Modus",
    "achievements.games_played_150": "Fortgeschritten: 150 Spiele",
    "achievements.games_played_150.description":
      "Spiele 150 Partien in einem beliebigen Modus",
    "achievements.games_played_200": "Fortgeschritten: 200 Spiele",
    "achievements.games_played_200.description":
      "Spiele 200 Partien in einem beliebigen Modus",
    "achievements.games_played_300": "Experte: 300 Spiele",
    "achievements.games_played_300.description":
      "Spiele 300 Partien in einem beliebigen Modus",
    "achievements.games_played_400": "Experte: 400 Spiele",
    "achievements.games_played_400.description":
      "Spiele 400 Partien in einem beliebigen Modus",
    "achievements.games_played_500": "Experte: 500 Spiele",
    "achievements.games_played_500.description":
      "Spiele 500 Partien in einem beliebigen Modus",
    "achievements.games_played_750": "Meister: 750 Spiele",
    "achievements.games_played_750.description":
      "Spiele 750 Partien in einem beliebigen Modus",
    "achievements.games_played_1000": "Meister: 1000 Spiele",
    "achievements.games_played_1000.description":
      "Spiele 1000 Partien in einem beliebigen Modus",
    "achievements.games_played_1500": "Meister: 1500 Spiele",
    "achievements.games_played_1500.description":
      "Spiele 1500 Partien in einem beliebigen Modus",
    "achievements.games_played_2000": "Meister: 2000 Spiele",
    "achievements.games_played_2000.description":
      "Spiele 2000 Partien in einem beliebigen Modus",
    "achievements.games_played_2500": "Legende: 2500 Spiele",
    "achievements.games_played_2500.description":
      "Spiele 2500 Partien in einem beliebigen Modus",
    "achievements.games_played_3000": "Legende: 3000 Spiele",
    "achievements.games_played_3000.description":
      "Spiele 3000 Partien in einem beliebigen Modus",
    "achievements.games_played_4000": "Legende: 4000 Spiele",
    "achievements.games_played_4000.description":
      "Spiele 4000 Partien in einem beliebigen Modus",
    "achievements.games_played_5000": "Legende: 5000 Spiele",
    "achievements.games_played_5000.description":
      "Spiele 5000 Partien in einem beliebigen Modus",

    // Perfekte-Spiele-Achievements
    "achievements.perfect_games_1": "Glückstreffer: 1 perfektes Spiel",
    "achievements.perfect_games_1.description":
      "Erreiche in einem Spiel die maximale Punktzahl",
    "achievements.perfect_games_2": "Glückstreffer: 2 perfekte Spiele",
    "achievements.perfect_games_2.description":
      "Erreiche in 2 Spielen die maximale Punktzahl",
    "achievements.perfect_games_3": "Glückstreffer: 3 perfekte Spiele",
    "achievements.perfect_games_3.description":
      "Erreiche in 3 Spielen die maximale Punktzahl",
    "achievements.perfect_games_5": "Präzision: 5 perfekte Spiele",
    "achievements.perfect_games_5.description":
      "Erreiche in 5 Spielen die maximale Punktzahl",
    "achievements.perfect_games_7": "Präzision: 7 perfekte Spiele",
    "achievements.perfect_games_7.description":
      "Erreiche in 7 Spielen die maximale Punktzahl",
    "achievements.perfect_games_10": "Präzision: 10 perfekte Spiele",
    "achievements.perfect_games_10.description":
      "Erreiche in 10 Spielen die maximale Punktzahl",
    "achievements.perfect_games_15": "Expertise: 15 perfekte Spiele",
    "achievements.perfect_games_15.description":
      "Erreiche in 15 Spielen die maximale Punktzahl",
    "achievements.perfect_games_20": "Expertise: 20 perfekte Spiele",
    "achievements.perfect_games_20.description":
      "Erreiche in 20 Spielen die maximale Punktzahl",
    "achievements.perfect_games_25": "Expertise: 25 perfekte Spiele",
    "achievements.perfect_games_25.description":
      "Erreiche in 25 Spielen die maximale Punktzahl",
    "achievements.perfect_games_30": "Meisterschaft: 30 perfekte Spiele",
    "achievements.perfect_games_30.description":
      "Erreiche in 30 Spielen die maximale Punktzahl",
    "achievements.perfect_games_40": "Meisterschaft: 40 perfekte Spiele",
    "achievements.perfect_games_40.description":
      "Erreiche in 40 Spielen die maximale Punktzahl",
    "achievements.perfect_games_50": "Meisterschaft: 50 perfekte Spiele",
    "achievements.perfect_games_50.description":
      "Erreiche in 50 Spielen die maximale Punktzahl",
    "achievements.perfect_games_75": "Perfektion: 75 perfekte Spiele",
    "achievements.perfect_games_75.description":
      "Erreiche in 75 Spielen die maximale Punktzahl",
    "achievements.perfect_games_100": "Perfektion: 100 perfekte Spiele",
    "achievements.perfect_games_100.description":
      "Erreiche in 100 Spielen die maximale Punktzahl",
    "achievements.perfect_games_150": "Perfektion: 150 perfekte Spiele",
    "achievements.perfect_games_150.description":
      "Erreiche in 150 Spielen die maximale Punktzahl",
    "achievements.perfect_games_200": "Legende: 200 perfekte Spiele",
    "achievements.perfect_games_200.description":
      "Erreiche in 200 Spielen die maximale Punktzahl",
    "achievements.perfect_games_300": "Legende: 300 perfekte Spiele",
    "achievements.perfect_games_300.description":
      "Erreiche in 300 Spielen die maximale Punktzahl",
    "achievements.perfect_games_400": "Legende: 400 perfekte Spiele",
    "achievements.perfect_games_400.description":
      "Erreiche in 400 Spielen die maximale Punktzahl",
    "achievements.perfect_games_500": "Legende: 500 perfekte Spiele",
    "achievements.perfect_games_500.description":
      "Erreiche in 500 Spielen die maximale Punktzahl",

    // Punktestand-Achievements
    "achievements.total_score_100": "Sammler: 100 Punkte",
    "achievements.total_score_100.description":
      "Sammle insgesamt 100 Punkte über alle Spiele",
    "achievements.total_score_250": "Sammler: 250 Punkte",
    "achievements.total_score_250.description":
      "Sammle insgesamt 250 Punkte über alle Spiele",
    "achievements.total_score_500": "Sammler: 500 Punkte",
    "achievements.total_score_500.description":
      "Sammle insgesamt 500 Punkte über alle Spiele",
    "achievements.total_score_1000": "Punktejäger: 1.000 Punkte",
    "achievements.total_score_1000.description":
      "Sammle insgesamt 1.000 Punkte über alle Spiele",
    "achievements.total_score_2500": "Punktejäger: 2.500 Punkte",
    "achievements.total_score_2500.description":
      "Sammle insgesamt 2.500 Punkte über alle Spiele",
    "achievements.total_score_5000": "Punktejäger: 5.000 Punkte",
    "achievements.total_score_5000.description":
      "Sammle insgesamt 5.000 Punkte über alle Spiele",
    "achievements.total_score_7500": "Punktemagnet: 7.500 Punkte",
    "achievements.total_score_7500.description":
      "Sammle insgesamt 7.500 Punkte über alle Spiele",
    "achievements.total_score_10000": "Punktemagnet: 10.000 Punkte",
    "achievements.total_score_10000.description":
      "Sammle insgesamt 10.000 Punkte über alle Spiele",
    "achievements.total_score_15000": "Punktemagnet: 15.000 Punkte",
    "achievements.total_score_15000.description":
      "Sammle insgesamt 15.000 Punkte über alle Spiele",
    "achievements.total_score_20000": "Punktemeister: 20.000 Punkte",
    "achievements.total_score_20000.description":
      "Sammle insgesamt 20.000 Punkte über alle Spiele",
    "achievements.total_score_30000": "Punktemeister: 30.000 Punkte",
    "achievements.total_score_30000.description":
      "Sammle insgesamt 30.000 Punkte über alle Spiele",
    "achievements.total_score_50000": "Punktemeister: 50.000 Punkte",
    "achievements.total_score_50000.description":
      "Sammle insgesamt 50.000 Punkte über alle Spiele",
    "achievements.total_score_75000": "Elite: 75.000 Punkte",
    "achievements.total_score_75000.description":
      "Sammle insgesamt 75.000 Punkte über alle Spiele",
    "achievements.total_score_100000": "Elite: 100.000 Punkte",
    "achievements.total_score_100000.description":
      "Sammle insgesamt 100.000 Punkte über alle Spiele",
    "achievements.total_score_150000": "Elite: 150.000 Punkte",
    "achievements.total_score_150000.description":
      "Sammle insgesamt 150.000 Punkte über alle Spiele",
    "achievements.total_score_200000": "Legende: 200.000 Punkte",
    "achievements.total_score_200000.description":
      "Sammle insgesamt 200.000 Punkte über alle Spiele",
    "achievements.total_score_300000": "Legende: 300.000 Punkte",
    "achievements.total_score_300000.description":
      "Sammle insgesamt 300.000 Punkte über alle Spiele",
    "achievements.total_score_400000": "Legende: 400.000 Punkte",
    "achievements.total_score_400000.description":
      "Sammle insgesamt 400.000 Punkte über alle Spiele",
    "achievements.total_score_500000": "Legende: 500.000 Punkte",
    "achievements.total_score_500000.description":
      "Sammle insgesamt 500.000 Punkte über alle Spiele",
    "achievements.nav.link": "Achievements",
    "achievements.nav.aria": "Zu den Achievements navigieren",
    "achievements.badge.new": "Neue Achievements verfügbar",
    "achievements.summary.title": "Achievement-Fortschritt",
    "achievements.summary.total": "Gesamt",
    "achievements.summary.unlocked": "Freigeschaltet",
    "achievements.summary.progress": "Fortschritt",
    "achievements.notification.close": "Benachrichtigung schließen",
    "achievements.rarity.tooltip":
      "Prozentsatz der Spieler, die dieses Achievement freigeschaltet haben",

    // Achievement-Fehlermeldungen
    "errors.achievements.fetch": "Fehler beim Abrufen der Achievements",
    "errors.achievements.update":
      "Fehler beim Aktualisieren des Achievement-Fortschritts",
    "errors.achievements.unlock": "Fehler beim Freischalten des Achievements",
    "errors.achievements.check": "Fehler beim Prüfen der Achievements",
    "errors.invalidRequest": "Ungültige Anfrage",
    "errors.invalidParameters": "Ungültige Parameter",
    "errors.auth.unauthorized": "Nicht autorisiert. Bitte melde dich an",
  },
  en: {
    // Auth-Komponenten
    "auth.required.title": "Authentication Required",
    "auth.required.description": "Please log in to access this area",
    "auth.login.title": "Login",
    "auth.register.title": "Register",
    "auth.toggle.login": "Switch to login",
    "auth.toggle.register": "Switch to registration",
    "auth.login.submit": "Login",
    "auth.register.submit": "Register",
    "auth.form.submit": "Submit",
    "auth.form.loading": "Processing...",
    "auth.tabs.login": "Login",
    "auth.tabs.register": "Register",
    "auth.validation.processing": "Validating input...",
    "auth.form.error.general": "An error has occurred",
    "auth.form.success": "Success!",
    "auth.form.email_required": "Email address is required",
    "auth.form.email_invalid": "Invalid email address",
    "auth.form.loading_text": "Loading...",
    "auth.form.send_reset_link": "Send Reset Link",
    "auth.form.password_required": "Password is required",
    "auth.form.password_requirements":
      "Password does not meet all requirements",
    "auth.form.password_confirm_required": "Password confirmation is required",
    "auth.form.passwords_not_match": "Passwords do not match",
    "auth.password_reset.success_message":
      "If an account with this email exists, we've sent instructions to reset your password.",

    // Achievement System
    "achievements.title": "Achievements",
    "achievements.description":
      "Discover and unlock achievements to track your progress",
    "achievements.loading": "Loading achievements...",
    "achievements.error": "Error loading achievements",
    "achievements.empty": "No achievements found",
    "achievements.category.bronze": "Bronze",
    "achievements.category.silver": "Silver",
    "achievements.category.gold": "Gold",
    "achievements.category.platinum": "Platinum",
    "achievements.category.diamond": "Diamond",
    "achievements.category.time": "Time",
    "achievements.status.locked": "Locked",
    "achievements.status.in_progress": "In Progress",
    "achievements.status.unlocked": "Unlocked",
    "achievements.progress": "Progress: {progress}%",
    "achievements.unlocked_at": "Unlocked on {date}",
    "achievements.points": "Points: {points}",
    "achievements.rarity": "Rarity: {percentage}%",
    "achievements.notification.unlocked": "Achievement unlocked!",
    "achievements.notification.progress": "Achievement progress updated!",
    "achievements.nav.link": "Achievements",
    "achievements.nav.aria": "Navigate to achievements",
    "achievements.badge.new": "New achievements available",
    "achievements.filter.title": "Filter Achievements",
    "achievements.filter.status": "Status",
    "achievements.filter.status.aria": "Filter achievements by status",
    "achievements.filter.category": "Category",
    "achievements.filter.category.aria": "Filter achievements by category",
    "achievements.filter.all": "All",
    "achievements.filter.all_categories": "All Categories",
    "achievements.summary.title": "Achievement Progress",
    "achievements.summary.total": "Total",
    "achievements.summary.unlocked": "Unlocked",
    "achievements.summary.progress": "Progress",
    "achievements.notification.close": "Close notification",
    "achievements.rarity.tooltip":
      "Percentage of players who have unlocked this achievement",

    "achievements.games_played_50": "50 Games Played",
    "achievements.games_played_50.description": "Play 50 games in any mode",
    "achievements.perfect_games_5": "5 Perfect Games",
    "achievements.perfect_games_5.description":
      "Achieve maximum score in 5 games",
    "achievements.total_score_1000": "1000 Total Points",
    "achievements.total_score_1000.description":
      "Accumulate 1000 points across all games",

    // Game Counter Achievements
    "achievements.games_played_1": "Beginner: 1 Game",
    "achievements.games_played_1.description":
      "Play your first game in any mode",
    "achievements.games_played_5": "Beginner: 5 Games",
    "achievements.games_played_5.description": "Play 5 games in any mode",
    "achievements.games_played_10": "Beginner: 10 Games",
    "achievements.games_played_10.description": "Play 10 games in any mode",
    "achievements.games_played_25": "Amateur: 25 Games",
    "achievements.games_played_25.description": "Play 25 games in any mode",
    "achievements.games_played_75": "Amateur: 75 Games",
    "achievements.games_played_75.description": "Play 75 games in any mode",
    "achievements.games_played_100": "Advanced: 100 Games",
    "achievements.games_played_100.description": "Play 100 games in any mode",
    "achievements.games_played_150": "Advanced: 150 Games",
    "achievements.games_played_150.description": "Play 150 games in any mode",
    "achievements.games_played_200": "Advanced: 200 Games",
    "achievements.games_played_200.description": "Play 200 games in any mode",
    "achievements.games_played_300": "Expert: 300 Games",
    "achievements.games_played_300.description": "Play 300 games in any mode",
    "achievements.games_played_400": "Expert: 400 Games",
    "achievements.games_played_400.description": "Play 400 games in any mode",
    "achievements.games_played_500": "Expert: 500 Games",
    "achievements.games_played_500.description": "Play 500 games in any mode",
    "achievements.games_played_750": "Master: 750 Games",
    "achievements.games_played_750.description": "Play 750 games in any mode",
    "achievements.games_played_1000": "Master: 1000 Games",
    "achievements.games_played_1000.description": "Play 1000 games in any mode",
    "achievements.games_played_1500": "Master: 1500 Games",
    "achievements.games_played_1500.description": "Play 1500 games in any mode",
    "achievements.games_played_2000": "Master: 2000 Games",
    "achievements.games_played_2000.description": "Play 2000 games in any mode",
    "achievements.games_played_2500": "Legend: 2500 Games",
    "achievements.games_played_2500.description": "Play 2500 games in any mode",
    "achievements.games_played_3000": "Legend: 3000 Games",
    "achievements.games_played_3000.description": "Play 3000 games in any mode",
    "achievements.games_played_4000": "Legend: 4000 Games",
    "achievements.games_played_4000.description": "Play 4000 games in any mode",
    "achievements.games_played_5000": "Legend: 5000 Games",
    "achievements.games_played_5000.description": "Play 5000 games in any mode",

    // Perfect Games Achievements
    "achievements.perfect_games_1": "Lucky Strike: 1 Perfect Game",
    "achievements.perfect_games_1.description":
      "Achieve maximum score in 1 game",
    "achievements.perfect_games_2": "Lucky Strike: 2 Perfect Games",
    "achievements.perfect_games_2.description":
      "Achieve maximum score in 2 games",
    "achievements.perfect_games_3": "Lucky Strike: 3 Perfect Games",
    "achievements.perfect_games_3.description":
      "Achieve maximum score in 3 games",
    "achievements.perfect_games_7": "Precision: 7 Perfect Games",
    "achievements.perfect_games_7.description":
      "Achieve maximum score in 7 games",
    "achievements.perfect_games_10": "Precision: 10 Perfect Games",
    "achievements.perfect_games_10.description":
      "Achieve maximum score in 10 games",
    "achievements.perfect_games_15": "Expertise: 15 Perfect Games",
    "achievements.perfect_games_15.description":
      "Achieve maximum score in 15 games",
    "achievements.perfect_games_20": "Expertise: 20 Perfect Games",
    "achievements.perfect_games_20.description":
      "Achieve maximum score in 20 games",
    "achievements.perfect_games_25": "Expertise: 25 Perfect Games",
    "achievements.perfect_games_25.description":
      "Achieve maximum score in 25 games",
    "achievements.perfect_games_30": "Mastery: 30 Perfect Games",
    "achievements.perfect_games_30.description":
      "Achieve maximum score in 30 games",
    "achievements.perfect_games_40": "Mastery: 40 Perfect Games",
    "achievements.perfect_games_40.description":
      "Achieve maximum score in 40 games",
    "achievements.perfect_games_50": "Mastery: 50 Perfect Games",
    "achievements.perfect_games_50.description":
      "Achieve maximum score in 50 games",
    "achievements.perfect_games_75": "Perfection: 75 Perfect Games",
    "achievements.perfect_games_75.description":
      "Achieve maximum score in 75 games",
    "achievements.perfect_games_100": "Perfection: 100 Perfect Games",
    "achievements.perfect_games_100.description":
      "Achieve maximum score in 100 games",
    "achievements.perfect_games_150": "Perfection: 150 Perfect Games",
    "achievements.perfect_games_150.description":
      "Achieve maximum score in 150 games",
    "achievements.perfect_games_200": "Legend: 200 Perfect Games",
    "achievements.perfect_games_200.description":
      "Achieve maximum score in 200 games",
    "achievements.perfect_games_300": "Legend: 300 Perfect Games",
    "achievements.perfect_games_300.description":
      "Achieve maximum score in 300 games",
    "achievements.perfect_games_400": "Legend: 400 Perfect Games",
    "achievements.perfect_games_400.description":
      "Achieve maximum score in 400 games",
    "achievements.perfect_games_500": "Legend: 500 Perfect Games",
    "achievements.perfect_games_500.description":
      "Achieve maximum score in 500 games",

    // Score Achievements
    "achievements.total_score_100": "Collector: 100 Points",
    "achievements.total_score_100.description":
      "Accumulate 100 points across all games",
    "achievements.total_score_250": "Collector: 250 Points",
    "achievements.total_score_250.description":
      "Accumulate 250 points across all games",
    "achievements.total_score_500": "Collector: 500 Points",
    "achievements.total_score_500.description":
      "Accumulate 500 points across all games",
    "achievements.total_score_2500": "Point Hunter: 2,500 Points",
    "achievements.total_score_2500.description":
      "Accumulate 2,500 points across all games",
    "achievements.total_score_5000": "Point Hunter: 5,000 Points",
    "achievements.total_score_5000.description":
      "Accumulate 5,000 points across all games",
    "achievements.total_score_7500": "Point Magnet: 7,500 Points",
    "achievements.total_score_7500.description":
      "Accumulate 7,500 points across all games",
    "achievements.total_score_10000": "Point Magnet: 10,000 Points",
    "achievements.total_score_10000.description":
      "Accumulate 10,000 points across all games",
    "achievements.total_score_15000": "Point Magnet: 15,000 Points",
    "achievements.total_score_15000.description":
      "Accumulate 15,000 points across all games",
    "achievements.total_score_20000": "Point Master: 20,000 Points",
    "achievements.total_score_20000.description":
      "Accumulate 20,000 points across all games",
    "achievements.total_score_30000": "Point Master: 30,000 Points",
    "achievements.total_score_30000.description":
      "Accumulate 30,000 points across all games",
    "achievements.total_score_50000": "Point Master: 50,000 Points",
    "achievements.total_score_50000.description":
      "Accumulate 50,000 points across all games",
    "achievements.total_score_75000": "Elite: 75,000 Points",
    "achievements.total_score_75000.description":
      "Accumulate 75,000 points across all games",
    "achievements.total_score_100000": "Elite: 100,000 Points",
    "achievements.total_score_100000.description":
      "Accumulate 100,000 points across all games",
    "achievements.total_score_150000": "Elite: 150,000 Points",
    "achievements.total_score_150000.description":
      "Accumulate 150,000 points across all games",
    "achievements.total_score_200000": "Legend: 200,000 Points",
    "achievements.total_score_200000.description":
      "Accumulate 200,000 points across all games",
    "achievements.total_score_300000": "Legend: 300,000 Points",
    "achievements.total_score_300000.description":
      "Accumulate 300,000 points across all games",
    "achievements.total_score_400000": "Legend: 400,000 Points",
    "achievements.total_score_400000.description":
      "Accumulate 400,000 points across all games",
    "achievements.total_score_500000": "Legend: 500,000 Points",
    "achievements.total_score_500000.description":
      "Accumulate 500,000 points across all games",

    // Daily Streak Achievements
    "achievements.daily_streak_1": "Daily Player",
    "achievements.daily_streak_1.description": "Play on 1 consecutive day",
    "achievements.daily_streak_3": "Music Enthusiast",
    "achievements.daily_streak_3.description": "Play on 3 consecutive days",
    "achievements.daily_streak_5": "Melody Master",
    "achievements.daily_streak_5.description": "Play on 5 consecutive days",
    "achievements.daily_streak_7": "Perfect Week",
    "achievements.daily_streak_7.description": "Play on 7 consecutive days",
    "achievements.daily_streak_14": "Music Veteran",
    "achievements.daily_streak_14.description": "Play on 14 consecutive days",
    "achievements.daily_streak_30": "Melody Legend",
    "achievements.daily_streak_30.description": "Play on 30 consecutive days",

    // Daily Games Achievements
    "achievements.daily_games_3": "Warm-Up",
    "achievements.daily_games_3.description": "Play 3 games in a single day",
    "achievements.daily_games_5": "Music Session",
    "achievements.daily_games_5.description": "Play 5 games in a single day",
    "achievements.daily_games_10": "Music Marathon",
    "achievements.daily_games_10.description": "Play 10 games in a single day",
    "achievements.daily_games_20": "Melody Marathon",
    "achievements.daily_games_20.description": "Play 20 games in a single day",
    "achievements.daily_games_30": "Music Ultra",
    "achievements.daily_games_30.description": "Play 30 games in a single day",
    "achievements.daily_games_50": "Melody Madness",
    "achievements.daily_games_50.description": "Play 50 games in a single day",

    // Achievement error messages
    "errors.achievements.fetch": "Error fetching achievements",
    "errors.achievements.update": "Error updating achievement progress",
    "errors.achievements.unlock": "Error unlocking achievement",
    "errors.achievements.check": "Error checking achievements",
    "errors.invalidRequest": "Invalid request",

    // Achievement Categories
    "achievements.category.games_played": "Games Played",
    "achievements.category.perfect_games": "Perfect Games",
    "achievements.category.total_score": "Total Score",
    "achievements.category.daily_streak": "Daily Streak",
    "achievements.category.daily_games": "Daily Games",
    "errors.invalidParameters": "Invalid parameters",
    "errors.auth.unauthorized": "Unauthorized. Please log in",
    "auth.password_reset.error_message":
      "An error occurred. Please try again later.",
    "auth.password_reset.complete_success":
      "Password successfully reset. You can now log in with your new password.",
    "auth.password_reset.complete_error":
      "Password reset failed. Please check your inputs or request a new reset link.",

    // Password requirements
    "auth.password.requirements": "Password requirements:",
    "auth.password.min_length": "Password must be at least 8 characters long",
    "auth.password.uppercase":
      "Password must contain at least one uppercase letter",
    "auth.password.lowercase":
      "Password must contain at least one lowercase letter",
    "auth.password.number": "Password must contain at least one number",
    "auth.password.special":
      "Password must contain at least one special character",
    "auth.password.no_common": "Password must not be a commonly used password",
    "auth.password.no_repeats": "Password must not contain repeated characters",
    "auth.password.no_sequences": "Password must not contain simple sequences",
    "auth.password.match": "Passwords must match",

    // Highscores page
    "highscores.title": "Highscores",
    "highscores.description":
      "View the top scores across different game modes and categories",
    "highscores.loading": "Loading highscores...",
    "highscores.error": "Error loading highscores",
    "highscores.empty": "No highscores found",
    "highscores.filter.title": "Filter Highscores",
    "highscores.filter.game.mode": "Game Mode",
    "highscores.filter.category": "Category",
    "highscores.filter.all": "All",
    "highscores.filter.search": "Search categories...",
    "highscores.filter.no.results": "No categories found",
    "highscores.table.title": "Top Scores",
    "highscores.table.rank": "Rank",
    "highscores.table.player": "Player",
    "highscores.table.game.mode": "Game Mode",
    "highscores.table.category": "Category",
    "highscores.table.score": "Score",
    "highscores.table.date": "Date",
    "auth.password.strength": "Password strength",
    "auth.password.strength.weak": "Weak",
    "auth.password.strength.medium": "Medium",
    "auth.password.strength.strong": "Strong",

    // Accessibility
    "auth.accessibility.password_toggle": "Show/hide password",
    "auth.accessibility.password_requirements":
      "Show/hide password requirements",

    "nav.home": "Home",
    "nav.rules": "Rules",
    "category.no_image_available": "No image available",
    "game.score": "Score",
    "game.round": "Round",
    "game.joker": "50:50 Joker",
    "difficulty.easy": "Easy",
    "difficulty.medium": "Medium",
    "difficulty.hard": "Hard",
    "game.select":
      "Discover the fascinating world of music and test your knowledge in our interactive music quizzes. Choose your favorite genre and begin your melodious journey!",
    "game.welcome": "Welcome to Melody Mind",
    "game.genre.list": "Genre Selection",
    "game.search.label": "Search for a genre",
    "game.search.description":
      "The list is filtered automatically while typing",
    "game.genre.play.label": "Play",
    "game.genre.image": "Cover image for",
    "game.no.results": "No results found",
    "game.not.available": "Not available",
    "category.selected": "selected!",
    "category.difficulty.heading": "Choose your difficulty level",
    "category.difficulty.group": "Difficulty levels",
    "category.difficulty.easy": "Easy",
    "category.difficulty.medium": "Medium",
    "category.difficulty.hard": "Hard",
    "category.difficulty.easy.label": "Start game in easy mode",
    "category.difficulty.medium.label": "Start game in medium mode",
    "category.difficulty.hard.label": "Start game in hard mode",
    "category.image.alt": "cover image",
    "nav.menu.open": "Open menu",
    "nav.menu.close": "Close menu",
    "nav.menu.home": "Home",
    "nav.menu.rules": "Rules",
    "nav.menu.highscores": "Highscores",
    "nav.menu.profile": "Profile",
    "nav.menu.logout": "Logout",
    "nav.logout.text": "Logout",
    "nav.logout.label": "Logout from the application",
    "nav.skip.main": "Skip to main content",
    "game.end.title": "Game Over!",
    "game.end.motivation":
      "Fantastic performance! 🎉 Your musical knowledge is truly impressive. Challenge yourself with another round and become a true music legend! 🎵",
    "game.end.score": "Score achieved:",
    "game.end.newgame": "New Game",
    "game.end.share": "Share your success!",
    "game.end.home": "Home",
    "game.feedback.resolution": "Resolution",
    "game.feedback.media.section": "Media Section",
    "game.feedback.audio.preview": "Music Preview",
    "game.feedback.subtitles": "Subtitles",
    "game.feedback.audio.unsupported":
      "Your browser does not support audio playback.",
    "game.feedback.streaming.links": "Music Streaming Links",
    "game.feedback.listen.spotify": "Listen on Spotify",
    "game.feedback.listen.deezer": "Listen on Deezer",
    "game.feedback.listen.apple": "Listen on Apple Music",
    "game.feedback.next.round": "Next Round",
    "game.current.round": "Round",
    "game.current.round.label": "Current round number",
    "game.joker.options": "Joker Options",
    "game.joker.use": "Use 50:50 Joker",
    "game.joker.description": "Removes two wrong answer options",
    "loading.content": "Loading content...",
    "share.title": "Share your success!",
    "share.buttons.group.label": "Social Media Share Options",
    "share.facebook": "Share on Facebook",
    "share.whatsapp": "Share on WhatsApp",
    "share.native": "Share with...",
    "share.native.label": "Share",
    "share.twitter": "Share on X/Twitter",
    "share.email": "Share via Email",
    "share.email.label": "Email",
    "share.copy": "Copy sharing text to clipboard",
    "share.copy.label": "Copy text",
    "error.default": "An error has occurred",
    "error.close": "Close error message",
    "coins.collected": "Collected coins",
    "language.picker.label": "Language selection",
    "language.change": "Change website language",
    "language.select.label": "Choose your preferred language",
    "language.de": "German",
    "language.en": "English",
    "language.es": "Spanish",
    "language.fr": "French",
    "language.it": "Italian",
    "language.pt": "Portuguese",
    "language.da": "Danish",
    "language.nl": "Dutch",
    "language.sv": "Swedish",
    "language.fi": "Finnish",
    "language.de.label": "View website in German",
    "language.en.label": "View website in English",
    "language.es.label": "View website in Spanish",
    "language.fr.label": "View website in French",
    "language.it.label": "View website in Italian",
    "language.pt.label": "View website in Portuguese",
    "language.da.label": "View website in Danish",
    "language.nl.label": "View website in Dutch",
    "language.sv.label": "View website in Swedish",
    "language.fi.label": "View website in Finnish",
    "playlist.item.unavailable": "This content is not yet available",
    "playlist.item.status": "Status",
    "playlist.item.coming.soon": "Coming soon",
    "game.area.label": "Game area",
    "game.options.label": "Answer options",
    "game.answer.correct": "Correct! {points} points + {bonus} bonus points",
    "game.answer.wrong": "Wrong! The correct answer was: {answer}",
    "error.invalid.question": "Invalid question or no options available",
    "error.no.initial.question": "No valid initial question found",
    "error.no.albums.found": "No albums found for category {category}",
    "meta.keywords":
      "Music Quiz, Music Game, Song Quiz, Artist Quiz, Online Music Quiz, Music Trivia, Melody Mind, Music Guessing Game",
    "knowledge.title": "Music Knowledge Database",
    "knowledge.intro":
      "Dive into the fascinating world of music history. Here you'll find engaging articles about different music eras, genres, and their evolution. Discover interesting facts and expand your musical knowledge.",
    "knowledge.search.label": "Search articles",
    "knowledge.search.placeholder": "Search...",
    "knowledge.filter.all": "All Keywords",
    "knowledge.no.results": "No articles found. Try different search terms.",
    "game.remaining": "remaining",
    "game.default.headline": "Game",
    "popup.score": "Score: {score}",
    "popup.golden.lp.score": "Achieved points: {score}",
    "nav.donate.heading": "Support us",
    "nav.donate.paypal": "Donate via PayPal",
    "nav.donate.coffee": "Buy me a coffee",
    "nav.title": "Navigation",
    "nav.menu.text": "Menu",
    "game.categories.empty.headline": "No genres found",
    "game.categories.empty.text":
      "Unfortunately, no categories were found. Please try again later.",
    "game.categories.no.playable.headline": "No playable genres",
    "game.categories.no.playable.text":
      "There are currently no playable categories. Please check back later.",
    "knowledge.reading.time": "min read",
    "knowledge.breadcrumb.label": "Breadcrumb navigation",
    "knowledge.listen.heading": "Listen to Related Music",
    "knowledge.back.to.list": "Back to Articles",
    "knowledge.interact.heading": "Listen & Play",
    "knowledge.play.heading": "Play this Genre",
    "knowledge.play.description":
      "Test your knowledge about this music genre in our interactive quiz!",
    "knowledge.play.category": "Start Music Quiz",
    "category.play": "Play",
    "play.cover.puzzle": "Play Cover Puzzle",
    "play.cover.puzzle.description":
      "In Cover Puzzle, you need to recognize album covers as they gradually reveal. The faster you identify the correct album, the more points you earn. Test your visual memory for music covers!",
    "podcast.page.title": "Music Podcasts | Melody Mind",
    "podcast.page.heading": "Captivating Music Podcasts",
    "podcast.page.description":
      "Dive into the world of music with our engaging podcasts. Discover exciting stories, fascinating backgrounds, and defining moments of various music eras - perfect for anyone who wants to not just listen to music, but truly understand it. Our podcasts are released every 2 weeks and are available exclusively in German and English.",
    "podcast.search.label": "Search podcasts",
    "podcast.search.placeholder": "Search for fascinating music stories...",
    "podcast.search.status.all": "All podcasts are displayed",
    "podcast.search.status.one": "1 podcast found",
    "podcast.search.status.multiple": "{count} podcasts found",
    "podcast.no.results":
      "No matching podcasts found. Try a different search term.",
    "podcast.duration.error": "Duration unavailable",
    "podcast.play": "Play",
    "podcast.intro.title": "Introducing Astropod",
    "podcast.intro.description":
      "Astropod is a free and open-source serverless podcast solution.",
    "podcast.deploy.title": "Deploying your serverless podcast in 2 minutes",
    "podcast.deploy.description": "Learn how to quickly deploy your podcast.",
    "podcast.auth.title":
      "Setting user authentication and accessing the dashboard",
    "podcast.auth.description":
      "Enable authentication and access the dashboard.",
    "podcast.config.title": "Configuring your Astropod Podcast",
    "podcast.config.description": "Learn how to configure your podcast.",
    "podcast.publish.title": "Publishing your first episode",
    "podcast.publish.description": "Publish your first episode with ease.",
    "podcast.conclusion.title": "Conclusion",
    "podcast.conclusion.description": "Summary and next steps.",
    "podcast.listen.on": "Listen on",
    "podcast.language.availability":
      "Our podcasts are available exclusively in German and English.",
    "podcast.listen.heading": "Listen to our Podcasts",
    "login.welcome": "Welcome to Melody Mind!",
    "login.description":
      "Embark on a musical journey through time! Test your knowledge in exciting quizzes, explore fascinating music genres, and dive into our captivating podcasts. Show your skills, collect points, and become a true music legend!",
    "index.continue": "Let's Go!",
    "index.start.game.label": "Start your musical journey",
    "index.welcome.footnote":
      "Crafted by music lovers for music lovers. Enjoy!",
    "accessibility.wcag": "This application aims for WCAG AAA compliance.",
    "game.instructions.title": "Game Instructions",
    "game.instructions.puzzle":
      "Try to guess the album as the cover gradually reveals. The faster you guess correctly, the more points you earn.",
    "game.time.remaining": "Time remaining:",
    "game.puzzle.label": "Album Cover Puzzle",
    "game.puzzle.loading": "Loading puzzle...",
    "game.options.legend": "Choose the correct album",
    "game.next.round": "Start next round",
    "game.puzzle.revealed": "{percent}% of the album cover has been revealed",
    "game.option.choose": "Choose",
    "game.options.available": "Answer options are now available",
    "game.time.remaining.seconds": "{seconds} seconds remaining",
    "game.time.up": "Time's up! The correct album was:",
    "game.correct.answer": "Correct answer",
    "game.slower.speed": "Slower gameplay",
    "game.normal.speed": "Normal speed",
    "game.skip.to.answers": "Skip to answer options",
    "game.next": "Next",
    "aria.pressed": "Pressed",
    "aria.expanded": "Expanded",
    "aria.shortcuts.panel": "Keyboard shortcuts panel",
    "aria.shortcuts.list": "List of available keyboard shortcuts",
    "knowledge.empty": "No articles found for this language",
    "playlist.page.title": "Music Playlists | Melody Mind",
    "playlist.page.heading": "Discover our Music Playlists",
    "playlist.page.description":
      "Dive into carefully curated playlists from different eras and genres. Perfect for discovering new music or revisiting your favorite classics.",
    "playlist.search.label": "Search playlists",
    "playlist.search.placeholder": "Search by musical era or style...",
    "playlist.filter.all": "All Eras",
    "playlist.no.results":
      "No matching playlists found. Try a different search term.",
    "playlist.listen.on": "Listen on",
    "playlist.listen.spotify": "Listen on Spotify",
    "playlist.listen.deezer": "Listen on Deezer",
    "playlist.listen.apple": "Listen on Apple Music",
    "playlist.decade.filter": "Filter by decade",
    "footer.rights": "All Rights Reserved",
    "footer.donate": "Donate",
    "game.chronology.title": "Music Chronology",
    "game.chronology.description":
      "Order these albums by their release year (oldest first)",
    "game.chronology.area.label": "Chronology Game Area",
    "game.chronology.result": "Result",
    "game.chronology.correct": "Correct",
    "game.chronology.wrong": "Should be at position {position}",
    "game.chronology.score": "Result: {score} points",
    "game.chronology.details": "{correct} of {total} albums correctly placed",
    "game.chronology.year": "Year: {year}",
    "game.chronology.drag.help": "Use arrow keys ↑/↓ or drag & drop to sort",
    "game.submit.answer": "Check Answer",
    "game.chronology.up": "Up",
    "game.chronology.down": "Down",
    "game.chronology.position": "Position",
    "game.chronology.start": "Start",
    "game.chronology.end": "End",
    "common.back.to.top": "Back to top",
    "knowledge.articles.heading": "Knowledge Articles",
    "knowledge.search.heading": "Search Articles",
    "knowledge.search.description":
      "Articles will filter automatically as you type",
    "knowledge.search.reset": "Reset search",
    "knowledge.search.reset.text": "Reset",
    "knowledge.no.results.help":
      "Try different search terms or reset your search",
    "knowledge.keyboard.instructions":
      "Use arrow keys to navigate between articles. Press Enter to open an article.",

    // Service-Fehlermeldungen
    "auth.service.session_expired":
      "Your session has expired. Please log in again",
    "auth.service.unauthorized": "Unauthorized. Please log in",
    "auth.service.account_locked":
      "Your account has been locked. Please contact support",
    "auth.service.permission_denied": "Permission denied for this action",
    "auth.service.invalid_credentials":
      "Invalid credentials. Please check your email and password.",
    "auth.service.too_many_attempts":
      "Too many login attempts. Please wait a moment before trying again.",

    // Profile page
    "profile.title": "My Profile",
    "profile.description":
      "Manage your personal information and view your game statistics",
    "profile.loading": "Loading profile data...",
    "profile.error": "Error loading profile data",
    "profile.auth.required": "You must be logged in to view your profile",
    "profile.user.info": "User Information",
    "profile.user.since": "Member since",
    "profile.stats.title": "Game Statistics",
    "profile.stats.quiz": "Quiz",
    "profile.stats.chronology": "Chronology",
    "profile.stats.total.score": "Total Score",
    "profile.stats.games.played": "Games Played",
    "profile.stats.highest.score": "Highest Score",
    "profile.recent.games": "Recent Game Results",
    "profile.recent.games.empty": "You haven't played any games yet",
    "profile.recent.game.mode": "Game Mode",
    "profile.recent.game.category": "Category",
    "profile.recent.game.difficulty": "Difficulty",
    "profile.recent.game.score": "Score",
    "profile.recent.game.date": "Date",
    "profile.nav.aria": "User profile navigation",
    "profile.nav.link": "Go to profile",
  },
  es: {
    // Auth-Komponenten

    // Achievement Categories
    "achievements.category.games_played": "Partidas Jugadas",
    "achievements.category.perfect_games": "Partidas Perfectas",
    "achievements.category.total_score": "Puntuación Total",
    "achievements.category.daily_streak": "Racha Diaria",
    "achievements.category.daily_games": "Partidas Diarias",

    // Achievement System
    "achievements.title": "Logros",
    "achievements.description":
      "Descubre y desbloquea logros para seguir tu progreso",
    "achievements.loading": "Cargando logros...",
    "achievements.error": "Error al cargar los logros",
    "achievements.empty": "No se encontraron logros",
    "achievements.category.bronze": "Bronce",
    "achievements.category.silver": "Plata",
    "achievements.category.gold": "Oro",
    "achievements.category.platinum": "Platino",
    "achievements.category.diamond": "Diamante",
    "achievements.category.time": "Tiempo",
    "achievements.status.locked": "Bloqueado",
    "achievements.status.in_progress": "En Progreso",
    "achievements.status.unlocked": "Desbloqueado",
    "achievements.progress": "Progreso: {progress}%",
    "achievements.unlocked_at": "Desbloqueado el {date}",
    "achievements.points": "Puntos: {points}",
    "achievements.rarity": "Rareza: {percentage}%",
    "achievements.notification.unlocked": "¡Logro desbloqueado!",
    "achievements.notification.progress": "¡Progreso de logro actualizado!",
    "achievements.nav.link": "Logros",
    "achievements.nav.aria": "Navegar a logros",
    "achievements.badge.new": "Nuevos logros disponibles",
    "achievements.filter.title": "Filtrar Logros",
    "achievements.filter.status": "Estado",
    "achievements.filter.status.aria": "Filtrar logros por estado",
    "achievements.filter.category": "Categoría",
    "achievements.filter.category.aria": "Filtrar logros por categoría",
    "achievements.filter.all": "Todos",
    "achievements.filter.all_categories": "Todas las Categorías",
    "achievements.summary.title": "Progreso de Logros",
    "achievements.summary.total": "Total",
    "achievements.summary.unlocked": "Desbloqueados",
    "achievements.summary.progress": "Progreso",
    "achievements.notification.close": "Cerrar notificación",
    "achievements.rarity.tooltip":
      "Porcentaje de jugadores que han desbloqueado este logro",

    // Game Counter Achievements
    "achievements.games_played_1": "Principiante: 1 Partida",
    "achievements.games_played_1.description":
      "Juega tu primera partida en cualquier modo",
    "achievements.games_played_5": "Principiante: 5 Partidas",
    "achievements.games_played_5.description":
      "Juega 5 partidas en cualquier modo",
    "achievements.games_played_10": "Principiante: 10 Partidas",
    "achievements.games_played_10.description":
      "Juega 10 partidas en cualquier modo",
    "achievements.games_played_25": "Aficionado: 25 Partidas",
    "achievements.games_played_25.description":
      "Juega 25 partidas en cualquier modo",
    "achievements.games_played_50": "Aficionado: 50 Partidas",
    "achievements.games_played_50.description":
      "Juega 50 partidas en cualquier modo",
    "achievements.games_played_75": "Aficionado: 75 Partidas",
    "achievements.games_played_75.description":
      "Juega 75 partidas en cualquier modo",
    "achievements.games_played_100": "Avanzado: 100 Partidas",
    "achievements.games_played_100.description":
      "Juega 100 partidas en cualquier modo",
    "achievements.games_played_150": "Avanzado: 150 Partidas",
    "achievements.games_played_150.description":
      "Juega 150 partidas en cualquier modo",
    "achievements.games_played_200": "Avanzado: 200 Partidas",
    "achievements.games_played_200.description":
      "Juega 200 partidas en cualquier modo",
    "achievements.games_played_300": "Experto: 300 Partidas",
    "achievements.games_played_300.description":
      "Juega 300 partidas en cualquier modo",
    "achievements.games_played_400": "Experto: 400 Partidas",
    "achievements.games_played_400.description":
      "Juega 400 partidas en cualquier modo",
    "achievements.games_played_500": "Experto: 500 Partidas",
    "achievements.games_played_500.description":
      "Juega 500 partidas en cualquier modo",
    "achievements.games_played_750": "Maestro: 750 Partidas",
    "achievements.games_played_750.description":
      "Juega 750 partidas en cualquier modo",
    "achievements.games_played_1000": "Maestro: 1000 Partidas",
    "achievements.games_played_1000.description":
      "Juega 1000 partidas en cualquier modo",
    "achievements.games_played_1500": "Maestro: 1500 Partidas",
    "achievements.games_played_1500.description":
      "Juega 1500 partidas en cualquier modo",
    "achievements.games_played_2000": "Maestro: 2000 Partidas",
    "achievements.games_played_2000.description":
      "Juega 2000 partidas en cualquier modo",
    "achievements.games_played_2500": "Leyenda: 2500 Partidas",
    "achievements.games_played_2500.description":
      "Juega 2500 partidas en cualquier modo",
    "achievements.games_played_3000": "Leyenda: 3000 Partidas",
    "achievements.games_played_3000.description":
      "Juega 3000 partidas en cualquier modo",
    "achievements.games_played_4000": "Leyenda: 4000 Partidas",
    "achievements.games_played_4000.description":
      "Juega 4000 partidas en cualquier modo",
    "achievements.games_played_5000": "Leyenda: 5000 Partidas",
    "achievements.games_played_5000.description":
      "Juega 5000 partidas en cualquier modo",

    // Perfect Games Achievements
    "achievements.perfect_games_1": "Golpe de Suerte: 1 Partida Perfecta",
    "achievements.perfect_games_1.description":
      "Consigue la puntuación máxima en 1 partida",
    "achievements.perfect_games_2": "Golpe de Suerte: 2 Partidas Perfectas",
    "achievements.perfect_games_2.description":
      "Consigue la puntuación máxima en 2 partidas",
    "achievements.perfect_games_3": "Golpe de Suerte: 3 Partidas Perfectas",
    "achievements.perfect_games_3.description":
      "Consigue la puntuación máxima en 3 partidas",
    "achievements.perfect_games_5": "Precisión: 5 Partidas Perfectas",
    "achievements.perfect_games_5.description":
      "Consigue la puntuación máxima en 5 partidas",
    "achievements.perfect_games_7": "Precisión: 7 Partidas Perfectas",
    "achievements.perfect_games_7.description":
      "Consigue la puntuación máxima en 7 partidas",
    "achievements.perfect_games_10": "Precisión: 10 Partidas Perfectas",
    "achievements.perfect_games_10.description":
      "Consigue la puntuación máxima en 10 partidas",
    "achievements.perfect_games_15": "Experiencia: 15 Partidas Perfectas",
    "achievements.perfect_games_15.description":
      "Consigue la puntuación máxima en 15 partidas",
    "achievements.perfect_games_20": "Experiencia: 20 Partidas Perfectas",
    "achievements.perfect_games_20.description":
      "Consigue la puntuación máxima en 20 partidas",
    "achievements.perfect_games_25": "Experiencia: 25 Partidas Perfectas",
    "achievements.perfect_games_25.description":
      "Consigue la puntuación máxima en 25 partidas",
    "achievements.perfect_games_30": "Maestría: 30 Partidas Perfectas",
    "achievements.perfect_games_30.description":
      "Consigue la puntuación máxima en 30 partidas",
    "achievements.perfect_games_40": "Maestría: 40 Partidas Perfectas",
    "achievements.perfect_games_40.description":
      "Consigue la puntuación máxima en 40 partidas",
    "achievements.perfect_games_50": "Maestría: 50 Partidas Perfectas",
    "achievements.perfect_games_50.description":
      "Consigue la puntuación máxima en 50 partidas",
    "achievements.perfect_games_75": "Perfección: 75 Partidas Perfectas",
    "achievements.perfect_games_75.description":
      "Consigue la puntuación máxima en 75 partidas",
    "achievements.perfect_games_100": "Perfección: 100 Partidas Perfectas",
    "achievements.perfect_games_100.description":
      "Consigue la puntuación máxima en 100 partidas",
    "achievements.perfect_games_150": "Perfección: 150 Partidas Perfectas",
    "achievements.perfect_games_150.description":
      "Consigue la puntuación máxima en 150 partidas",
    "achievements.perfect_games_200": "Leyenda: 200 Partidas Perfectas",
    "achievements.perfect_games_200.description":
      "Consigue la puntuación máxima en 200 partidas",
    "achievements.perfect_games_300": "Leyenda: 300 Partidas Perfectas",
    "achievements.perfect_games_300.description":
      "Consigue la puntuación máxima en 300 partidas",
    "achievements.perfect_games_400": "Leyenda: 400 Partidas Perfectas",
    "achievements.perfect_games_400.description":
      "Consigue la puntuación máxima en 400 partidas",
    "achievements.perfect_games_500": "Leyenda: 500 Partidas Perfectas",
    "achievements.perfect_games_500.description":
      "Consigue la puntuación máxima en 500 partidas",

    // Score Achievements
    "achievements.total_score_100": "Coleccionista: 100 Puntos",
    "achievements.total_score_100.description":
      "Acumula 100 puntos en todas las partidas",
    "achievements.total_score_250": "Coleccionista: 250 Puntos",
    "achievements.total_score_250.description":
      "Acumula 250 puntos en todas las partidas",
    "achievements.total_score_500": "Coleccionista: 500 Puntos",
    "achievements.total_score_500.description":
      "Acumula 500 puntos en todas las partidas",
    "achievements.total_score_1000": "Cazador de Puntos: 1.000 Puntos",
    "achievements.total_score_1000.description":
      "Acumula 1.000 puntos en todas las partidas",
    "achievements.total_score_2500": "Cazador de Puntos: 2.500 Puntos",
    "achievements.total_score_2500.description":
      "Acumula 2.500 puntos en todas las partidas",
    "achievements.total_score_5000": "Cazador de Puntos: 5.000 Puntos",
    "achievements.total_score_5000.description":
      "Acumula 5.000 puntos en todas las partidas",
    "achievements.total_score_7500": "Imán de Puntos: 7.500 Puntos",
    "achievements.total_score_7500.description":
      "Acumula 7.500 puntos en todas las partidas",
    "achievements.total_score_10000": "Imán de Puntos: 10.000 Puntos",
    "achievements.total_score_10000.description":
      "Acumula 10.000 puntos en todas las partidas",
    "achievements.total_score_15000": "Imán de Puntos: 15.000 Puntos",
    "achievements.total_score_15000.description":
      "Acumula 15.000 puntos en todas las partidas",
    "achievements.total_score_20000": "Maestro de Puntos: 20.000 Puntos",
    "achievements.total_score_20000.description":
      "Acumula 20.000 puntos en todas las partidas",
    "achievements.total_score_30000": "Maestro de Puntos: 30.000 Puntos",
    "achievements.total_score_30000.description":
      "Acumula 30.000 puntos en todas las partidas",
    "achievements.total_score_50000": "Maestro de Puntos: 50.000 Puntos",
    "achievements.total_score_50000.description":
      "Acumula 50.000 puntos en todas las partidas",
    "achievements.total_score_75000": "Élite: 75.000 Puntos",
    "achievements.total_score_75000.description":
      "Acumula 75.000 puntos en todas las partidas",
    "achievements.total_score_100000": "Élite: 100.000 Puntos",
    "achievements.total_score_100000.description":
      "Acumula 100.000 puntos en todas las partidas",
    "achievements.total_score_150000": "Élite: 150.000 Puntos",
    "achievements.total_score_150000.description":
      "Acumula 150.000 puntos en todas las partidas",
    "achievements.total_score_200000": "Leyenda: 200.000 Puntos",
    "achievements.total_score_200000.description":
      "Acumula 200.000 puntos en todas las partidas",
    "achievements.total_score_300000": "Leyenda: 300.000 Puntos",
    "achievements.total_score_300000.description":
      "Acumula 300.000 puntos en todas las partidas",
    "achievements.total_score_400000": "Leyenda: 400.000 Puntos",
    "achievements.total_score_400000.description":
      "Acumula 400.000 puntos en todas las partidas",
    "achievements.total_score_500000": "Leyenda: 500.000 Puntos",
    "achievements.total_score_500000.description":
      "Acumula 500.000 puntos en todas las partidas",

    // Daily Streak Achievements
    "achievements.daily_streak_1": "Jugador Diario",
    "achievements.daily_streak_1.description":
      "Juega durante 1 día consecutivo",
    "achievements.daily_streak_3": "Entusiasta Musical",
    "achievements.daily_streak_3.description":
      "Juega durante 3 días consecutivos",
    "achievements.daily_streak_5": "Maestro de la Melodía",
    "achievements.daily_streak_5.description":
      "Juega durante 5 días consecutivos",
    "achievements.daily_streak_7": "Semana Perfecta",
    "achievements.daily_streak_7.description":
      "Juega durante 7 días consecutivos",
    "achievements.daily_streak_14": "Veterano Musical",
    "achievements.daily_streak_14.description":
      "Juega durante 14 días consecutivos",
    "achievements.daily_streak_30": "Leyenda de la Melodía",
    "achievements.daily_streak_30.description":
      "Juega durante 30 días consecutivos",

    // Daily Games Achievements
    "achievements.daily_games_3": "Calentamiento",
    "achievements.daily_games_3.description": "Juega 3 partidas en un solo día",
    "achievements.daily_games_5": "Sesión Musical",
    "achievements.daily_games_5.description": "Juega 5 partidas en un solo día",
    "achievements.daily_games_10": "Maratón Musical",
    "achievements.daily_games_10.description":
      "Juega 10 partidas en un solo día",
    "achievements.daily_games_20": "Maratón de Melodía",
    "achievements.daily_games_20.description":
      "Juega 20 partidas en un solo día",
    "achievements.daily_games_30": "Ultra Musical",
    "achievements.daily_games_30.description":
      "Juega 30 partidas en un solo día",
    "achievements.daily_games_50": "Locura Melódica",
    "achievements.daily_games_50.description":
      "Juega 50 partidas en un solo día",

    // Achievement error messages
    "errors.achievements.fetch": "Error al obtener logros",
    "errors.achievements.update": "Error al actualizar el progreso del logro",
    "errors.achievements.unlock": "Error al desbloquear el logro",
    "errors.achievements.check": "Error al verificar los logros",

    "auth.required.title": "Autenticación requerida",
    "auth.required.description":
      "Por favor, inicia sesión para acceder a esta área",
    "auth.login.title": "Iniciar sesión",
    "auth.register.title": "Registrarse",
    "auth.toggle.login": "Cambiar a inicio de sesión",
    "auth.toggle.register": "Cambiar a registro",
    "auth.login.submit": "Iniciar sesión",
    "auth.register.submit": "Registrarse",
    "auth.form.submit": "Enviar",
    "auth.form.loading": "Procesando...",
    "auth.tabs.login": "Iniciar sesión",
    "auth.tabs.register": "Registrarse",
    "auth.validation.processing": "Validando datos...",
    "auth.form.error.general": "Ha ocurrido un error",
    "auth.form.success": "¡Éxito!",
    "auth.form.email_required": "Se requiere dirección de correo electrónico",
    "auth.form.email_invalid_short": "Dirección de correo electrónico inválida",
    "auth.form.loading_text": "Cargando...",
    "auth.form.send_reset_link": "Enviar enlace de restablecimiento",
    "auth.form.password_required": "Se requiere contraseña",
    "auth.form.password_requirements":
      "La contraseña no cumple con todos los requisitos",
    "auth.form.password_confirm_required":
      "Se requiere confirmación de contraseña",
    "auth.form.passwords_not_match": "Las contraseñas no coinciden",
    "auth.password_reset.success_message":
      "Si existe una cuenta con este correo electrónico, hemos enviado instrucciones para restablecer tu contraseña.",
    "auth.password_reset.error_message":
      "Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.",
    "auth.password_reset.complete_success":
      "Contraseña restablecida con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.",
    "auth.password_reset.complete_error":
      "Error al restablecer la contraseña. Por favor, verifica tus datos o solicita un nuevo enlace de restablecimiento.",

    "auth.login.email": "Correo electrónico",
    "auth.login.email.placeholder": "Introduce tu correo electrónico",
    "auth.login.password": "Contraseña",
    "auth.login.password.placeholder": "Introduce tu contraseña",
    "auth.login.remember": "Recordarme",
    "auth.login.forgot_password": "¿Olvidaste tu contraseña?",
    "auth.login.success": "Inicio de sesión exitoso",
    "auth.login.error": "Error al iniciar sesión",

    "auth.register.name": "Nombre completo",
    "auth.register.email": "Correo electrónico",
    "auth.register.email.placeholder": "Introduce tu correo electrónico",
    "auth.register.username": "Nombre de usuario",
    "auth.register.username.placeholder": "Elige un nombre de usuario",
    "auth.register.password": "Contraseña",
    "auth.register.password.placeholder": "Crea una contraseña segura",
    "auth.register.confirm_password": "Confirmar contraseña",
    "auth.register.password_confirm.placeholder":
      "Vuelve a introducir tu contraseña",
    "auth.register.terms": "Acepto los términos y condiciones",
    "auth.register.success": "Registro exitoso",
    "auth.register.error": "Error al registrarse",

    "auth.password_reset.title": "Restablecer contraseña",
    "auth.password_reset.submit": "Enviar enlace de restablecimiento",
    "auth.password_reset.email": "Correo electrónico",
    "auth.password_reset.email.placeholder":
      "Introduce tu correo electrónico registrado",
    "auth.password_reset.back_to_login": "Volver al inicio de sesión",
    "auth.password_reset.login": "Iniciar sesión",
    "auth.password_reset.success":
      "Se ha enviado un enlace de restablecimiento a tu correo electrónico",
    "auth.password_reset.error":
      "Error al enviar el enlace de restablecimiento",
    "auth.password_reset.new_password": "Nueva contraseña",
    "auth.password_reset.confirm_password": "Confirmar nueva contraseña",
    "auth.password_reset.change_submit": "Cambiar contraseña",

    "auth.email_verification.title": "Verificación de correo electrónico",
    "auth.email_verification.message":
      "Hemos enviado un enlace de verificación a tu correo electrónico",
    "auth.email_verification.check_inbox":
      "Por favor, revisa tu bandeja de entrada",
    "auth.email_verification.resend": "Reenviar enlace de verificación",
    "auth.email_verification.success":
      "Correo electrónico verificado correctamente",
    "auth.email_verification.error": "Error al verificar el correo electrónico",

    // Passwortvalidierung
    "auth.password.requirements": "Requisitos de contraseña:",
    "auth.password.min_length":
      "La contraseña debe tener al menos 8 caracteres",
    "auth.password.require_number":
      "La contraseña debe contener al menos un número",
    "auth.password.require_uppercase":
      "La contraseña debe contener al menos una letra mayúscula",
    "auth.password.require_lowercase":
      "La contraseña debe contener al menos una letra minúscula",
    "auth.password.require_special":
      "La contraseña debe contener al menos un carácter especial",
    "auth.password.match": "Las contraseñas deben coincidir",
    "auth.password.strength.weak": "Débil",
    "auth.password.strength.medium": "Media",
    "auth.password.strength.strong": "Fuerte",

    // Formularvalidierung
    "auth.form.required": "Este campo es obligatorio",
    "auth.form.email_invalid":
      "Por favor, introduce un correo electrónico válido",
    "auth.form.min_length":
      "Este campo debe tener al menos {length} caracteres",
    "auth.form.max_length":
      "Este campo no puede tener más de {length} caracteres",
    "auth.form.invalid": "Este campo no es válido",

    // Zugänglichkeit
    "auth.accessibility.loading": "Cargando, por favor espera",
    "auth.accessibility.error": "Error: {message}",
    "auth.accessibility.required_field": "Campo obligatorio",
    "auth.accessibility.toggle_password": "Mostrar/ocultar contraseña",
    "auth.accessibility.close_modal": "Cerrar ventana",

    // API-Fehlermeldungen
    "auth.api.network_error": "Error de red. Por favor, comprueba tu conexión",
    "auth.api.server_error":
      "Error del servidor. Por favor, inténtalo de nuevo más tarde",
    "auth.api.invalid_credentials": "Credenciales inválidas",
    "auth.api.account_exists":
      "Ya existe una cuenta con este correo electrónico",
    "auth.api.email_not_found":
      "No se encontró ninguna cuenta con este correo electrónico",
    "auth.api.too_many_requests":
      "Demasiados intentos. Por favor, inténtalo de nuevo más tarde",

    // Service-Fehlermeldungen
    "auth.service.session_expired":
      "Tu sesión ha expirado. Por favor, inicia sesión de nuevo",
    "auth.service.unauthorized": "No autorizado. Por favor, inicia sesión",
    "auth.service.account_locked":
      "Tu cuenta ha sido bloqueada. Por favor, contacta con soporte",
    "auth.service.permission_denied": "Permiso denegado para esta acción",
    "auth.service.invalid_credentials":
      "Credenciales inválidas. Por favor, verifica tu correo y contraseña.",
    "auth.service.too_many_attempts":
      "Demasiados intentos de inicio de sesión. Por favor, espera un momento antes de intentarlo de nuevo.",

    "nav.home": "Inicio",
    "nav.rules": "Reglas",
    "category.no_image_available": "Imagen no disponible",
    "game.score": "Puntuación",
    "game.round": "Ronda",
    "game.joker": "Comodín 50:50",
    "difficulty.easy": "Fácil",
    "difficulty.medium": "Medio",
    "difficulty.hard": "Difícil",
    "category.difficulty.easy": "Fácil",
    "category.difficulty.medium": "Medio",
    "category.difficulty.hard": "Difícil",
    "game.select":
      "Descubre el fascinante mundo de la música y pon a prueba tus conocimientos en nuestros cuestionarios musicales interactivos. ¡Elige tu género favorito y comienza tu melodioso viaje!",
    "game.welcome": "Bienvenido a Melody Mind",
    "game.genre.list": "Selección de género",
    "game.search.label": "Buscar un género",
    "game.search.description":
      "La lista se filtra automáticamente mientras escribes",
    "game.genre.play.label": "Jugar",
    "game.genre.image": "Imagen de portada para",
    "game.no.results": "No se encontraron resultados",
    "game.not.available": "No disponible",
    "category.selected": "seleccionado!",
    "category.difficulty.heading": "Elige tu nivel de dificultad",
    "category.difficulty.group": "Niveles de dificultad",
    "category.difficulty.easy.label": "Iniciar juego en modo fácil",
    "category.difficulty.medium.label": "Iniciar juego en modo medio",
    "category.difficulty.hard.label": "Iniciar juego en modo difícil",
    "category.image.alt": "Imagen de portada de",
    "nav.menu.open": "Abrir menú",
    "nav.menu.close": "Cerrar menú",
    "nav.menu.home": "Inicio",
    "nav.menu.rules": "Reglas",
    "nav.menu.highscores": "Puntuaciones",
    "nav.menu.profile": "Perfil",
    "nav.menu.logout": "Cerrar sesión",
    "nav.skip.main": "Ir al contenido principal",
    "game.end.title": "¡Juego terminado!",
    "game.end.motivation":
      "¡Actuación fantástica! 🎉 Tu conocimiento musical es realmente impresionante. ¡Desafíate con otra ronda y conviértete en una verdadera leyenda de la música! 🎵",
    "game.end.score": "Puntos conseguidos:",
    "game.end.newgame": "Nuevo Juego",
    "game.end.share": "¡Comparte tu éxito!",
    "game.end.home": "Inicio",
    "game.feedback.resolution": "Resolución",
    "game.feedback.media.section": "Sección de Medios",
    "game.feedback.audio.preview": "Vista previa de música",
    "game.feedback.subtitles": "Subtítulos",
    "game.feedback.audio.unsupported":
      "Tu navegador no soporta la reproducción de audio.",
    "game.feedback.streaming.links": "Enlaces de Streaming de Música",
    "game.feedback.listen.spotify": "Escuchar en Spotify",
    "game.feedback.listen.deezer": "Escuchar en Deezer",
    "game.feedback.listen.apple": "Escuchar en Apple Music",
    "game.feedback.next.round": "Siguiente Ronda",
    "game.current.round": "Ronda",
    "game.current.round.label": "Número de ronda actual",
    "game.joker.options": "Opciones de Comodín",
    "game.joker.use": "Usar Comodín 50:50",
    "game.joker.description": "Elimina dos opciones de respuesta incorrectas",
    "loading.content": "Cargando contenido...",
    "share.title": "¡Comparte tu éxito!",
    "share.buttons.group.label": "Opciones para compartir en redes sociales",
    "share.facebook": "Compartir en Facebook",
    "share.whatsapp": "Compartir en WhatsApp",
    "share.native": "Compartir con...",
    "share.native.label": "Compartir",
    "share.twitter": "Compartir en X/Twitter",
    "share.email": "Compartir por correo electrónico",
    "share.email.label": "Correo electrónico",
    "share.copy": "Copiar texto para compartir al portapapeles",
    "share.copy.label": "Copiar texto",
    "error.default": "Ha ocurrido un error",
    "error.close": "Cerrar mensaje de error",
    "coins.collected": "Monedas recolectadas",
    "language.picker.label": "Selección de idioma",
    "language.change": "Cambiar el idioma del sitio web",
    "language.select.label": "Elige tu idioma preferido",
    "language.de": "Alemán",
    "language.en": "Inglés",
    "language.es": "Español",
    "language.fr": "Francés",
    "language.it": "Italiano",
    "language.pt": "Portugués",
    "language.da": "Danés",
    "language.nl": "Holandés",
    "language.sv": "Sueco",
    "language.fi": "Finlandés",
    "language.de.label": "Ver sitio web en alemán",
    "language.en.label": "Ver sitio web en inglés",
    "language.es.label": "Ver sitio web en español",
    "language.fr.label": "Ver sitio web en francés",
    "language.it.label": "Ver sitio web en italiano",
    "language.pt.label": "Ver sitio web en portugués",
    "language.da.label": "Ver sitio web en danés",
    "language.nl.label": "Ver sitio web en holandés",
    "language.sv.label": "Ver sitio web en sueco",
    "language.fi.label": "Ver sitio web en finlandés",
    "playlist.item.unavailable": "Este contenido aún no está disponible",
    "playlist.item.status": "Estado",
    "playlist.item.coming.soon": "Próximamente",
    "game.area.label": "Área de juego",
    "game.options.label": "Opciones de respuesta",
    "game.answer.correct": "¡Correcto! {points} puntos + {bonus} puntos extra",
    "game.answer.wrong": "¡Incorrecto! La respuesta correcta era: {answer}",
    "error.invalid.question": "Pregunta inválida o sin opciones disponibles",
    "error.no.initial.question": "No se encontró una pregunta inicial válida",
    "error.no.albums.found":
      "No se encontraron álbumes para la categoría {category}",
    "meta.keywords":
      "Quiz Musical, Juego de Música, Quiz de Canciones, Quiz de Artistas, Quiz Musical Online, Trivia Musical, Melody Mind, Juego de Adivinanzas Musicales",
    "knowledge.title": "Base de Conocimientos Musicales",
    "knowledge.intro":
      "Sumérgete en el fascinante mundo de la historia de la música. Aquí encontrarás artículos interesantes sobre diferentes épocas musicales, géneros y su evolución. Descubre datos interesantes y amplía tus conocimientos musicales.",
    "knowledge.search.label": "Buscar artículos",
    "knowledge.search.placeholder": "Buscar...",
    "knowledge.filter.all": "Todas las Palabras Clave",
    "knowledge.no.results":
      "No se encontraron artículos. Intenta con otros términos de búsqueda.",
    "game.remaining": "restante",
    "game.default.headline": "Juego",
    "popup.score": "Puntuación: {score}",
    "popup.golden.lp.score": "Puntos conseguidos: {score}",
    "nav.donate.heading": "Apóyanos",
    "nav.donate.paypal": "Donar por PayPal",
    "nav.donate.coffee": "Invítame a un café",
    "nav.title": "Navegación",
    "nav.menu.text": "Menú",
    "game.categories.empty.headline": "No se encontraron géneros",
    "game.categories.empty.text":
      "Desafortunadamente, no se encontraron categorías. Por favor, inténtalo de nuevo más tarde.",
    "game.categories.no.playable.headline": "No hay géneros jugables",
    "game.categories.no.playable.text":
      "Actualmente no hay categorías jugables. Por favor, vuelve a intentarlo más tarde.",
    "knowledge.reading.time": "min de lectura",
    "knowledge.breadcrumb.label": "Navegación de migas de pan",
    "knowledge.listen.heading": "Escucha Música Relacionada",
    "knowledge.back.to.list": "Volver a los Artículos",
    "knowledge.interact.heading": "Escuchar & Jugar",
    "knowledge.play.heading": "Jugar este Género",
    "knowledge.play.description":
      "¡Pon a prueba tus conocimientos sobre este género musical en nuestro cuestionario interactivo!",
    "knowledge.play.category": "Iniciar Quiz Musical",
    "category.play": "Jugar",
    "play.cover.puzzle": "Jugar Cover Puzzle",
    "play.cover.puzzle.description":
      "En Cover Puzzle, debes reconocer portadas de álbumes a medida que se revelan gradualmente. Cuanto más rápido identifiques el álbum correcto, más puntos ganarás. ¡Pon a prueba tu memoria visual para las portadas musicales!",
    "podcast.page.title": "Podcasts de Música | Melody Mind",
    "podcast.page.heading": "Podcasts de Música Cautivadores",
    "podcast.page.description":
      "Sumérgete en el mundo de la música con nuestros podcasts cautivadores. Descubre historias emocionantes, antecedentes fascinantes y momentos definitorios de varias épocas musicales, perfectos para cualquiera que quiera no solo escuchar música, sino también entenderla. Nuestros podcasts se publican cada 2 semanas y están disponibles exclusivamente en alemán e inglés.",
    "podcast.search.label": "Buscar podcasts",
    "podcast.search.placeholder": "Buscar historias fascinantes de música...",
    "podcast.search.status.all": "Se muestran todos los podcasts",
    "podcast.search.status.one": "1 podcast encontrado",
    "podcast.search.status.multiple": "{count} podcasts encontrados",
    "podcast.no.results":
      "No se encontraron podcasts coincidentes. Intenta con otro término de búsqueda.",
    "podcast.duration.error": "Duración no disponible",
    "podcast.play": "Reproducir",
    "podcast.intro.title": "Presentando Astropod",
    "podcast.intro.description":
      "Astropod es una solución de podcast sin servidor gratuita y de código abierto.",
    "podcast.deploy.title":
      "Despliegue de tu podcast sin servidor en 2 minutos",
    "podcast.deploy.description":
      "Aprende cómo desplegar rápidamente tu podcast.",
    "podcast.auth.title":
      "Configuración de autenticación de usuarios y acceso al panel de control",
    "podcast.auth.description":
      "Habilita la autenticación y accede al panel de control.",
    "podcast.config.title": "Configurando tu Podcast Astropod",
    "podcast.config.description": "Aprende a configurar tu podcast.",
    "podcast.publish.title": "Publicando tu primer episodio",
    "podcast.publish.description": "Publica tu primer episodio con facilidad.",
    "podcast.conclusion.title": "Conclusión",
    "podcast.conclusion.description": "Resumen y próximos pasos.",
    "podcast.listen.on": "Escuchar en",
    "podcast.language.availability":
      "Nuestros podcasts están disponibles exclusivamente en alemán e inglés.",
    "podcast.listen.heading": "Escucha nuestros Podcasts",
    "login.welcome": "¡Bienvenido a Melody Mind!",
    "login.description":
      "¡Embárcate en un viaje musical a través del tiempo! Pon a prueba tus conocimientos en emocionantes cuestionarios, explora fascinantes géneros musicales y sumérgete en nuestros cautivadores podcasts. Demuestra tus habilidades, acumula puntos y conviértete en una verdadera leyenda de la música.",
    "index.continue": "¡Vamos!",
    "index.start.game.label": "Comienza tu viaje musical",
    "index.welcome.footnote":
      "Creado por amantes de la música para amantes de la música. ¡Disfruta!",
    "accessibility.wcag": "Esta aplicación aspira a cumplir con WCAG AAA.",
    "game.instructions.title": "Instrucciones del Juego",
    "game.instructions.puzzle":
      "Intenta adivinar el álbum mientras la portada se revela gradualmente. Cuanto más rápido adivines correctamente, más puntos ganarás.",
    "game.time.remaining": "Tiempo restante:",
    "game.puzzle.label": "Puzzle de Portada de Álbum",
    "game.puzzle.loading": "Cargando puzzle...",
    "game.options.legend": "Elige el álbum correcto",
    "game.next.round": "Iniciar siguiente ronda",
    "game.puzzle.revealed":
      "Se ha revelado el {percent}% de la portada del álbum",
    "game.option.choose": "Elige",
    "game.options.available": "Las opciones de respuesta ya están disponibles",
    "game.time.remaining.seconds": "Quedan {seconds} segundos",
    "game.time.up": "¡Se acabó el tiempo! El álbum correcto era:",
    "game.correct.answer": "Respuesta correcta",
    "game.slower.speed": "Juego más lento",
    "game.normal.speed": "Velocidad normal",
    "game.skip.to.answers": "Saltar a las opciones de respuesta",
    "game.next": "Siguiente",
    "aria.pressed": "Presionado",
    "aria.expanded": "Expandido",
    "aria.shortcuts.panel": "Panel de atajos de teclado",
    "aria.shortcuts.list": "Lista de atajos de teclado disponibles",
    "knowledge.empty": "No hay artículos disponibles en esta categoría",
    "playlist.page.title": "Listas de Reproducción | Melody Mind",
    "playlist.page.heading": "Descubre nuestras Listas de Reproducción",
    "playlist.page.description":
      "Sumérgete en listas de reproducción cuidadosamente seleccionadas de diferentes épocas y géneros. Perfectas para descubrir nueva música o revisitar tus clásicos favoritos.",
    "playlist.search.label": "Buscar listas de reproducción",
    "playlist.search.placeholder": "Buscar por era musical o estilo...",
    "playlist.filter.all": "Todas las Épocas",
    "playlist.no.results":
      "No se encontraron listas de reproducción. Intenta con otro término de búsqueda.",
    "playlist.listen.on": "Escuchar en",
    "playlist.listen.spotify": "Escuchar en Spotify",
    "playlist.listen.deezer": "Escuchar en Deezer",
    "playlist.listen.apple": "Escuchar en Apple Music",
    "playlist.decade.filter": "Filtrar por década",
    "footer.rights": "Todos los derechos reservados",
    "footer.donate": "Donar",
    "game.chronology.title": "Cronología Musical",
    "game.chronology.description":
      "Ordena estos álbumes por año de lanzamiento (el más antiguo primero)",
    "game.chronology.area.label": "Área de Juego Cronológico",
    "game.chronology.result": "Resultado",
    "game.chronology.correct": "Correcto",
    "game.chronology.wrong": "Debería estar en la posición {position}",
    "game.chronology.score": "Puntuación: {score} puntos",
    "game.chronology.details":
      "{correct} de {total} álbumes colocados correctamente",
    "game.chronology.year": "Año: {year}",
    "game.chronology.drag.help":
      "Usa las teclas de flecha ↑/↓ o arrastra para reordenar",
    "game.submit.answer": "Verificar Respuesta",
    "game.chronology.up": "Arriba",
    "game.chronology.down": "Abajo",
    "game.chronology.position": "Posición",
    "game.chronology.start": "Inicio",
    "game.chronology.end": "Fin",
    "common.back.to.top": "Volver arriba",
    "knowledge.articles.heading": "Artículos de Conocimiento",
    "knowledge.search.heading": "Buscar Artículos",
    "knowledge.search.description":
      "Los artículos se filtrarán automáticamente mientras escribes",
    "knowledge.search.reset": "Reiniciar búsqueda",
    "knowledge.search.reset.text": "Reiniciar",
    "knowledge.no.results.help":
      "Prueba diferentes términos de búsqueda o reinicia tu búsqueda",
    "knowledge.keyboard.instructions":
      "Usa las teclas de flecha para navegar entre artículos. Presiona Enter para abrir un artículo.",

    // Página de perfil
    "profile.title": "Mi Perfil",
    "profile.description":
      "Administra tu información personal y visualiza tus estadísticas de juego",
    "profile.loading": "Cargando datos del perfil...",
    "profile.error": "Error al cargar los datos del perfil",
    "profile.auth.required": "Debes iniciar sesión para ver tu perfil",
    "profile.user.info": "Información del Usuario",
    "profile.user.since": "Miembro desde",
    "profile.stats.title": "Estadísticas de Juego",
    "profile.stats.quiz": "Quiz",
    "profile.stats.chronology": "Cronología",
    "profile.stats.total.score": "Puntuación Total",
    "profile.stats.games.played": "Partidas Jugadas",
    "profile.stats.highest.score": "Puntuación Más Alta",
    "profile.recent.games": "Resultados de Juegos Recientes",
    "profile.recent.games.empty": "Aún no has jugado ninguna partida",
    "profile.recent.game.mode": "Modo de Juego",
    "profile.recent.game.category": "Categoría",
    "profile.recent.game.difficulty": "Dificultad",
    "profile.recent.game.score": "Puntuación",
    "profile.recent.game.date": "Fecha",
    "profile.nav.aria": "Navegación al perfil de usuario",
    "profile.nav.link": "Ir al perfil",

    // Página de puntuaciones
    "highscores.title": "Puntuaciones más altas",
    "highscores.description":
      "Ver las mejores puntuaciones en diferentes modos de juego y categorías",
    "highscores.loading": "Cargando puntuaciones...",
    "highscores.error": "Error al cargar las puntuaciones",
    "highscores.empty": "No se encontraron puntuaciones",
    "highscores.filter.title": "Filtrar puntuaciones",
    "highscores.filter.game.mode": "Modo de juego",
    "highscores.filter.category": "Categoría",
    "highscores.filter.all": "Todos",
    "highscores.filter.search": "Buscar categorías...",
    "highscores.filter.no.results": "No se encontraron categorías",
    "highscores.table.title": "Mejores puntuaciones",
    "highscores.table.rank": "Posición",
    "highscores.table.player": "Jugador",
    "highscores.table.game.mode": "Modo de juego",
    "highscores.table.category": "Categoría",
    "highscores.table.score": "Puntuación",
    "highscores.table.date": "Fecha",
  },
  fr: {
    // Auth-Komponenten

    // Achievement Categories
    "achievements.category.games_played": "Parties Jouées",
    "achievements.category.perfect_games": "Parties Parfaites",
    "achievements.category.total_score": "Score Total",
    "achievements.category.daily_streak": "Série Quotidienne",
    "achievements.category.daily_games": "Parties Quotidiennes",

    // Achievement System
    "achievements.title": "Succès",
    "achievements.description":
      "Découvrez et débloquez des succès pour suivre votre progression",
    "achievements.loading": "Chargement des succès...",
    "achievements.error": "Erreur lors du chargement des succès",
    "achievements.empty": "Aucun succès trouvé",
    "achievements.category.bronze": "Bronze",
    "achievements.category.silver": "Argent",
    "achievements.category.gold": "Or",
    "achievements.category.platinum": "Platine",
    "achievements.category.diamond": "Diamant",
    "achievements.category.time": "Temps",
    "achievements.status.locked": "Verrouillé",
    "achievements.status.in_progress": "En Cours",
    "achievements.status.unlocked": "Débloqué",
    "achievements.progress": "Progression : {progress}%",
    "achievements.unlocked_at": "Débloqué le {date}",
    "achievements.points": "Points : {points}",
    "achievements.rarity": "Rareté : {percentage}%",
    "achievements.notification.unlocked": "Succès débloqué !",
    "achievements.notification.progress": "Progression du succès mise à jour !",
    "achievements.nav.link": "Succès",
    "achievements.nav.aria": "Naviguer vers les succès",
    "achievements.badge.new": "Nouveaux succès disponibles",
    "achievements.filter.title": "Filtrer les Succès",
    "achievements.filter.status": "Statut",
    "achievements.filter.status.aria": "Filtrer les succès par statut",
    "achievements.filter.category": "Catégorie",
    "achievements.filter.category.aria": "Filtrer les succès par catégorie",
    "achievements.filter.all": "Tous",
    "achievements.filter.all_categories": "Toutes les Catégories",
    "achievements.summary.title": "Progression des Succès",
    "achievements.summary.total": "Total",
    "achievements.summary.unlocked": "Débloqués",
    "achievements.summary.progress": "Progression",
    "achievements.notification.close": "Fermer la notification",
    "achievements.rarity.tooltip":
      "Pourcentage de joueurs ayant débloqué ce succès",

    // Game Counter Achievements
    "achievements.games_played_1": "Débutant : 1 Partie",
    "achievements.games_played_1.description":
      "Jouez votre première partie dans n'importe quel mode",
    "achievements.games_played_5": "Débutant : 5 Parties",
    "achievements.games_played_5.description":
      "Jouez 5 parties dans n'importe quel mode",
    "achievements.games_played_10": "Débutant : 10 Parties",
    "achievements.games_played_10.description":
      "Jouez 10 parties dans n'importe quel mode",
    "achievements.games_played_25": "Amateur : 25 Parties",
    "achievements.games_played_25.description":
      "Jouez 25 parties dans n'importe quel mode",
    "achievements.games_played_50": "Amateur : 50 Parties",
    "achievements.games_played_50.description":
      "Jouez 50 parties dans n'importe quel mode",
    "achievements.games_played_75": "Amateur : 75 Parties",
    "achievements.games_played_75.description":
      "Jouez 75 parties dans n'importe quel mode",
    "achievements.games_played_100": "Avancé : 100 Parties",
    "achievements.games_played_100.description":
      "Jouez 100 parties dans n'importe quel mode",
    "achievements.games_played_150": "Avancé : 150 Parties",
    "achievements.games_played_150.description":
      "Jouez 150 parties dans n'importe quel mode",
    "achievements.games_played_200": "Avancé : 200 Parties",
    "achievements.games_played_200.description":
      "Jouez 200 parties dans n'importe quel mode",
    "achievements.games_played_300": "Expert : 300 Parties",
    "achievements.games_played_300.description":
      "Jouez 300 parties dans n'importe quel mode",
    "achievements.games_played_400": "Expert : 400 Parties",
    "achievements.games_played_400.description":
      "Jouez 400 parties dans n'importe quel mode",
    "achievements.games_played_500": "Expert : 500 Parties",
    "achievements.games_played_500.description":
      "Jouez 500 parties dans n'importe quel mode",
    "achievements.games_played_750": "Maître : 750 Parties",
    "achievements.games_played_750.description":
      "Jouez 750 parties dans n'importe quel mode",
    "achievements.games_played_1000": "Maître : 1000 Parties",
    "achievements.games_played_1000.description":
      "Jouez 1000 parties dans n'importe quel mode",
    "achievements.games_played_1500": "Maître : 1500 Parties",
    "achievements.games_played_1500.description":
      "Jouez 1500 parties dans n'importe quel mode",
    "achievements.games_played_2000": "Maître : 2000 Parties",
    "achievements.games_played_2000.description":
      "Jouez 2000 parties dans n'importe quel mode",
    "achievements.games_played_2500": "Légende : 2500 Parties",
    "achievements.games_played_2500.description":
      "Jouez 2500 parties dans n'importe quel mode",
    "achievements.games_played_3000": "Légende : 3000 Parties",
    "achievements.games_played_3000.description":
      "Jouez 3000 parties dans n'importe quel mode",
    "achievements.games_played_4000": "Légende : 4000 Parties",
    "achievements.games_played_4000.description":
      "Jouez 4000 parties dans n'importe quel mode",
    "achievements.games_played_5000": "Légende : 5000 Parties",
    "achievements.games_played_5000.description":
      "Jouez 5000 parties dans n'importe quel mode",

    // Perfect Games Achievements
    "achievements.perfect_games_1": "Coup de Chance : 1 Partie Parfaite",
    "achievements.perfect_games_1.description":
      "Obtenez le score maximum dans 1 partie",
    "achievements.perfect_games_2": "Coup de Chance : 2 Parties Parfaites",
    "achievements.perfect_games_2.description":
      "Obtenez le score maximum dans 2 parties",
    "achievements.perfect_games_3": "Coup de Chance : 3 Parties Parfaites",
    "achievements.perfect_games_3.description":
      "Obtenez le score maximum dans 3 parties",
    "achievements.perfect_games_5": "Précision : 5 Parties Parfaites",
    "achievements.perfect_games_5.description":
      "Obtenez le score maximum dans 5 parties",
    "achievements.perfect_games_7": "Précision : 7 Parties Parfaites",
    "achievements.perfect_games_7.description":
      "Obtenez le score maximum dans 7 parties",
    "achievements.perfect_games_10": "Précision : 10 Parties Parfaites",
    "achievements.perfect_games_10.description":
      "Obtenez le score maximum dans 10 parties",
    "achievements.perfect_games_15": "Expérience : 15 Parties Parfaites",
    "achievements.perfect_games_15.description":
      "Obtenez le score maximum dans 15 parties",
    "achievements.perfect_games_20": "Expérience : 20 Parties Parfaites",
    "achievements.perfect_games_20.description":
      "Obtenez le score maximum dans 20 parties",
    "achievements.perfect_games_25": "Expérience : 25 Parties Parfaites",
    "achievements.perfect_games_25.description":
      "Obtenez le score maximum dans 25 parties",
    "achievements.perfect_games_30": "Maîtrise : 30 Parties Parfaites",
    "achievements.perfect_games_30.description":
      "Obtenez le score maximum dans 30 parties",
    "achievements.perfect_games_40": "Maîtrise : 40 Parties Parfaites",
    "achievements.perfect_games_40.description":
      "Obtenez le score maximum dans 40 parties",
    "achievements.perfect_games_50": "Maîtrise : 50 Parties Parfaites",
    "achievements.perfect_games_50.description":
      "Obtenez le score maximum dans 50 parties",
    "achievements.perfect_games_75": "Perfection : 75 Parties Parfaites",
    "achievements.perfect_games_75.description":
      "Obtenez le score maximum dans 75 parties",
    "achievements.perfect_games_100": "Perfection : 100 Parties Parfaites",
    "achievements.perfect_games_100.description":
      "Obtenez le score maximum dans 100 parties",
    "achievements.perfect_games_150": "Perfection : 150 Parties Parfaites",
    "achievements.perfect_games_150.description":
      "Obtenez le score maximum dans 150 parties",
    "achievements.perfect_games_200": "Légende : 200 Parties Parfaites",
    "achievements.perfect_games_200.description":
      "Obtenez le score maximum dans 200 parties",
    "achievements.perfect_games_300": "Légende : 300 Parties Parfaites",
    "achievements.perfect_games_300.description":
      "Obtenez le score maximum dans 300 parties",
    "achievements.perfect_games_400": "Légende : 400 Parties Parfaites",
    "achievements.perfect_games_400.description":
      "Obtenez le score maximum dans 400 parties",
    "achievements.perfect_games_500": "Légende : 500 Parties Parfaites",
    "achievements.perfect_games_500.description":
      "Obtenez le score maximum dans 500 parties",

    // Score Achievements
    "achievements.total_score_100": "Collectionneur : 100 Points",
    "achievements.total_score_100.description":
      "Accumulez 100 points dans toutes les parties",
    "achievements.total_score_250": "Collectionneur : 250 Points",
    "achievements.total_score_250.description":
      "Accumulez 250 points dans toutes les parties",
    "achievements.total_score_500": "Collectionneur : 500 Points",
    "achievements.total_score_500.description":
      "Accumulez 500 points dans toutes les parties",
    "achievements.total_score_1000": "Chasseur de Points : 1 000 Points",
    "achievements.total_score_1000.description":
      "Accumulez 1 000 points dans toutes les parties",
    "achievements.total_score_2500": "Chasseur de Points : 2 500 Points",
    "achievements.total_score_2500.description":
      "Accumulez 2 500 points dans toutes les parties",
    "achievements.total_score_5000": "Chasseur de Points : 5 000 Points",
    "achievements.total_score_5000.description":
      "Accumulez 5 000 points dans toutes les parties",
    "achievements.total_score_7500": "Aimant à Points : 7 500 Points",
    "achievements.total_score_7500.description":
      "Accumulez 7 500 points dans toutes les parties",
    "achievements.total_score_10000": "Aimant à Points : 10 000 Points",
    "achievements.total_score_10000.description":
      "Accumulez 10 000 points dans toutes les parties",
    "achievements.total_score_15000": "Aimant à Points : 15 000 Points",
    "achievements.total_score_15000.description":
      "Accumulez 15 000 points dans toutes les parties",
    "achievements.total_score_20000": "Maître des Points : 20 000 Points",
    "achievements.total_score_20000.description":
      "Accumulez 20 000 points dans toutes les parties",
    "achievements.total_score_30000": "Maître des Points : 30 000 Points",
    "achievements.total_score_30000.description":
      "Accumulez 30 000 points dans toutes les parties",
    "achievements.total_score_50000": "Maître des Points : 50 000 Points",
    "achievements.total_score_50000.description":
      "Accumulez 50 000 points dans toutes les parties",
    "achievements.total_score_75000": "Élite : 75 000 Points",
    "achievements.total_score_75000.description":
      "Accumulez 75 000 points dans toutes les parties",
    "achievements.total_score_100000": "Élite : 100 000 Points",
    "achievements.total_score_100000.description":
      "Accumulez 100 000 points dans toutes les parties",
    "achievements.total_score_150000": "Élite : 150 000 Points",
    "achievements.total_score_150000.description":
      "Accumulez 150 000 points dans toutes les parties",
    "achievements.total_score_200000": "Légende : 200 000 Points",
    "achievements.total_score_200000.description":
      "Accumulez 200 000 points dans toutes les parties",
    "achievements.total_score_300000": "Légende : 300 000 Points",
    "achievements.total_score_300000.description":
      "Accumulez 300 000 points dans toutes les parties",
    "achievements.total_score_400000": "Légende : 400 000 Points",
    "achievements.total_score_400000.description":
      "Accumulez 400 000 points dans toutes les parties",
    "achievements.total_score_500000": "Légende : 500 000 Points",
    "achievements.total_score_500000.description":
      "Accumulez 500 000 points dans toutes les parties",

    // Daily Streak Achievements
    "achievements.daily_streak_1": "Joueur Quotidien",
    "achievements.daily_streak_1.description":
      "Jouez pendant 1 jour consécutif",
    "achievements.daily_streak_3": "Enthousiaste Musical",
    "achievements.daily_streak_3.description":
      "Jouez pendant 3 jours consécutifs",
    "achievements.daily_streak_5": "Maître de la Mélodie",
    "achievements.daily_streak_5.description":
      "Jouez pendant 5 jours consécutifs",
    "achievements.daily_streak_7": "Semaine Parfaite",
    "achievements.daily_streak_7.description":
      "Jouez pendant 7 jours consécutifs",
    "achievements.daily_streak_14": "Vétéran Musical",
    "achievements.daily_streak_14.description":
      "Jouez pendant 14 jours consécutifs",
    "achievements.daily_streak_30": "Légende de la Mélodie",
    "achievements.daily_streak_30.description":
      "Jouez pendant 30 jours consécutifs",

    // Daily Games Achievements
    "achievements.daily_games_3": "Échauffement",
    "achievements.daily_games_3.description":
      "Jouez 3 parties en une seule journée",
    "achievements.daily_games_5": "Session Musicale",
    "achievements.daily_games_5.description":
      "Jouez 5 parties en une seule journée",
    "achievements.daily_games_10": "Marathon Musical",
    "achievements.daily_games_10.description":
      "Jouez 10 parties en une seule journée",
    "achievements.daily_games_20": "Marathon de Mélodie",
    "achievements.daily_games_20.description":
      "Jouez 20 parties en une seule journée",
    "achievements.daily_games_30": "Ultra Musical",
    "achievements.daily_games_30.description":
      "Jouez 30 parties en une seule journée",
    "achievements.daily_games_50": "Folie Mélodique",
    "achievements.daily_games_50.description":
      "Jouez 50 parties en une seule journée",

    // Achievement error messages
    "errors.achievements.fetch": "Erreur lors de la récupération des succès",
    "errors.achievements.update":
      "Erreur lors de la mise à jour de la progression du succès",
    "errors.achievements.unlock": "Erreur lors du déblocage du succès",
    "errors.achievements.check": "Erreur lors de la vérification des succès",

    "auth.required.title": "Authentification requise",
    "auth.required.description":
      "Veuillez vous connecter pour accéder à cette zone",
    "auth.login.title": "Connexion",
    "auth.register.title": "Inscription",
    "auth.toggle.login": "Passer à la connexion",
    "auth.toggle.register": "Passer à l'inscription",
    "auth.login.submit": "Se connecter",
    "auth.register.submit": "S'inscrire",
    "auth.form.submit": "Soumettre",
    "auth.form.loading": "Traitement en cours...",
    "auth.tabs.login": "Connexion",
    "auth.tabs.register": "Inscription",
    "auth.validation.processing": "Validation des données...",
    "auth.form.error.general": "Une erreur est survenue",
    "auth.form.success": "Succès !",
    "auth.form.email_required": "L'adresse e-mail est requise",
    "auth.form.email_invalid_short": "Adresse e-mail invalide",
    "auth.form.loading_text": "Chargement...",
    "auth.form.send_reset_link": "Envoyer le lien de réinitialisation",
    "auth.form.password_required": "Le mot de passe est requis",
    "auth.form.password_requirements":
      "Le mot de passe ne répond pas à toutes les exigences",
    "auth.form.password_confirm_required":
      "La confirmation du mot de passe est requise",
    "auth.form.passwords_not_match": "Les mots de passe ne correspondent pas",
    "auth.password_reset.success_message":
      "Si un compte existe avec cette adresse e-mail, nous avons envoyé des instructions pour réinitialiser votre mot de passe.",
    "auth.password_reset.error_message":
      "Une erreur s'est produite. Veuillez réessayer plus tard.",
    "auth.password_reset.complete_success":
      "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
    "auth.password_reset.complete_error":
      "Échec de la réinitialisation du mot de passe. Veuillez vérifier vos informations ou demander un nouveau lien de réinitialisation.",

    "auth.login.email": "Adresse e-mail",
    "auth.login.email.placeholder": "Saisissez votre adresse e-mail",
    "auth.login.password": "Mot de passe",
    "auth.login.password.placeholder": "Saisissez votre mot de passe",
    "auth.login.remember": "Se souvenir de moi",
    "auth.login.forgot_password": "Mot de passe oublié ?",
    "auth.login.success": "Connexion réussie",
    "auth.login.error": "Erreur lors de la connexion",

    "auth.register.name": "Nom complet",
    "auth.register.email": "Adresse e-mail",
    "auth.register.email.placeholder": "Saisissez votre adresse e-mail",
    "auth.register.username": "Nom d'utilisateur",
    "auth.register.username.placeholder": "Choisissez un nom d'utilisateur",
    "auth.register.password": "Mot de passe",
    "auth.register.password.placeholder": "Créez un mot de passe sécurisé",
    "auth.register.confirm_password": "Confirmer le mot de passe",
    "auth.register.password_confirm.placeholder":
      "Saisissez à nouveau votre mot de passe",
    "auth.register.terms": "J'accepte les conditions d'utilisation",
    "auth.register.success": "Inscription réussie",
    "auth.register.error": "Erreur lors de l'inscription",

    "auth.password_reset.title": "Réinitialiser le mot de passe",
    "auth.password_reset.submit": "Envoyer le lien de réinitialisation",
    "auth.password_reset.email": "Adresse e-mail",
    "auth.password_reset.email.placeholder":
      "Saisissez votre adresse e-mail enregistrée",
    "auth.password_reset.back_to_login": "Retour à la connexion",
    "auth.password_reset.login": "Se connecter",
    "auth.password_reset.success":
      "Un lien de réinitialisation a été envoyé à votre adresse e-mail",
    "auth.password_reset.error":
      "Erreur lors de l'envoi du lien de réinitialisation",
    "auth.password_reset.new_password": "Nouveau mot de passe",
    "auth.password_reset.confirm_password": "Confirmer le nouveau mot de passe",
    "auth.password_reset.change_submit": "Changer le mot de passe",

    "auth.email_verification.title": "Vérification de l'adresse e-mail",
    "auth.email_verification.message":
      "Nous avons envoyé un lien de vérification à votre adresse e-mail",
    "auth.email_verification.check_inbox":
      "Veuillez vérifier votre boîte de réception",
    "auth.email_verification.resend": "Renvoyer le lien de vérification",
    "auth.email_verification.success": "Adresse e-mail vérifiée avec succès",
    "auth.email_verification.error":
      "Erreur lors de la vérification de l'adresse e-mail",

    // Passwortvalidierung
    "auth.password.requirements": "Exigences du mot de passe :",
    "auth.password.min_length":
      "Le mot de passe doit contenir au moins 8 caractères",
    "auth.password.require_number":
      "Le mot de passe doit contenir au moins un chiffre",
    "auth.password.require_uppercase":
      "Le mot de passe doit contenir au moins une lettre majuscule",
    "auth.password.require_lowercase":
      "Le mot de passe doit contenir au moins une lettre minuscule",
    "auth.password.require_special":
      "Le mot de passe doit contenir au moins un caractère spécial",
    "auth.password.match": "Les mots de passe doivent correspondre",
    "auth.password.strength.weak": "Faible",
    "auth.password.strength.medium": "Moyen",
    "auth.password.strength.strong": "Fort",

    // Formularvalidierung
    "auth.form.required": "Ce champ est obligatoire",
    "auth.form.email_invalid": "Veuillez saisir une adresse e-mail valide",
    "auth.form.min_length":
      "Ce champ doit contenir au moins {length} caractères",
    "auth.form.max_length":
      "Ce champ ne peut pas contenir plus de {length} caractères",
    "auth.form.invalid": "Ce champ n'est pas valide",

    // Zugänglichkeit
    "auth.accessibility.loading": "Chargement, veuillez patienter",
    "auth.accessibility.error": "Erreur : {message}",
    "auth.accessibility.required_field": "Champ obligatoire",
    "auth.accessibility.toggle_password": "Afficher/masquer le mot de passe",
    "auth.accessibility.close_modal": "Fermer la fenêtre",

    // API-Fehlermeldungen
    "auth.api.network_error":
      "Erreur réseau. Veuillez vérifier votre connexion",
    "auth.api.server_error": "Erreur serveur. Veuillez réessayer plus tard",
    "auth.api.invalid_credentials": "Identifiants invalides",
    "auth.api.account_exists":
      "Un compte avec cette adresse e-mail existe déjà",
    "auth.api.email_not_found": "Aucun compte trouvé avec cette adresse e-mail",
    "auth.api.too_many_requests":
      "Trop de tentatives. Veuillez réessayer plus tard",

    // Service-Fehlermeldungen
    "auth.service.session_expired":
      "Votre session a expiré. Veuillez vous reconnecter",
    "auth.service.unauthorized": "Non autorisé. Veuillez vous connecter",
    "auth.service.account_locked":
      "Votre compte a été verrouillé. Veuillez contacter le support",
    "auth.service.permission_denied": "Permission refusée pour cette action",
    "auth.service.invalid_credentials":
      "Identifiants invalides. Veuillez vérifier votre e-mail et mot de passe.",
    "auth.service.too_many_attempts":
      "Trop de tentatives de connexion. Veuillez patienter un moment avant de réessayer.",

    "nav.home": "Accueil",
    "nav.rules": "Règles",
    "category.no_image_available": "Aucune image disponible",
    "game.score": "Score",
    "game.round": "Tour",
    "game.joker": "Joker 50:50",
    "difficulty.easy": "Facile",
    "difficulty.medium": "Moyen",
    "difficulty.hard": "Difficile",
    "category.difficulty.easy": "Facile",
    "category.difficulty.medium": "Moyen",
    "category.difficulty.hard": "Difficile",
    "game.select":
      "Découvrez le monde fascinant de la musique et testez vos connaissances dans nos quiz musicaux interactifs. Choisissez votre genre préféré et commencez votre voyage mélodieux !",
    "game.welcome": "Bienvenue à Melody Mind",
    "game.genre.list": "Sélection du genre",
    "game.search.label": "Rechercher un genre",
    "game.search.description":
      "La liste est filtrée automatiquement pendant la saisie",
    "game.genre.play.label": "Jouer",
    "game.genre.image": "Image de couverture pour",
    "game.no.results": "Aucun résultat trouvé",
    "game.not.available": "Non disponible",
    "category.selected": "sélectionné !",
    "category.difficulty.heading": "Choisissez votre niveau de difficulté",
    "category.difficulty.group": "Niveaux de difficulté",
    "category.difficulty.easy.label": "Démarrer le jeu en mode facile",
    "category.difficulty.medium.label": "Démarrer le jeu en mode moyen",
    "category.difficulty.hard.label": "Démarrer le jeu en mode difficile",
    "category.image.alt": "Image de couverture de",
    "nav.menu.open": "Ouvrir le menu",
    "nav.menu.close": "Fermer le menu",
    "nav.menu.home": "Accueil",
    "nav.menu.rules": "Règles",
    "nav.menu.highscores": "Classement",
    "nav.menu.profile": "Profil",
    "nav.menu.logout": "Déconnexion",
    "nav.skip.main": "Aller au contenu principal",
    "game.end.title": "Partie terminée !",
    "game.end.motivation":
      "Performance fantastique ! 🎉 Tes connaissances musicales sont vraiment impressionnantes. Défie-toi avec une autre partie et deviens une véritable légende musicale ! 🎵",
    "game.end.score": "Points obtenus :",
    "game.end.newgame": "Nouvelle Partie",
    "game.end.share": "Partagez votre succès !",
    "game.end.home": "Accueil",
    "game.feedback.resolution": "Résolution",
    "game.feedback.media.section": "Section Médias",
    "game.feedback.audio.preview": "Aperçu musical",
    "game.feedback.subtitles": "Sous-titres",
    "game.feedback.audio.unsupported":
      "Votre navigateur ne prend pas en charge la lecture audio.",
    "game.feedback.streaming.links": "Liens de Streaming Musical",
    "game.feedback.listen.spotify": "Écouter sur Spotify",
    "game.feedback.listen.deezer": "Écouter sur Deezer",
    "game.feedback.listen.apple": "Écouter sur Apple Music",
    "game.feedback.next.round": "Tour Suivant",
    "game.current.round": "Tour",
    "game.current.round.label": "Numéro du tour actuel",
    "game.joker.options": "Options du Joker",
    "game.joker.use": "Utiliser le Joker 50:50",
    "game.joker.description": "Supprime deux mauvaises réponses",
    "loading.content": "Chargement du contenu...",
    "share.title": "Partagez votre succès !",
    "share.buttons.group.label": "Options de partage sur les réseaux sociaux",
    "share.facebook": "Partager sur Facebook",
    "share.whatsapp": "Partager sur WhatsApp",
    "share.native": "Partager avec...",
    "share.native.label": "Partager",
    "share.twitter": "Partager sur X/Twitter",
    "share.email": "Partager par e-mail",
    "share.email.label": "E-mail",
    "share.copy": "Copier le texte de partage dans le presse-papiers",
    "share.copy.label": "Copier le texte",
    "error.default": "Une erreur s'est produite",
    "error.close": "Fermer le message d'erreur",
    "coins.collected": "Pièces collectées",
    "language.picker.label": "Sélection de la langue",
    "language.change": "Changer la langue du site",
    "language.select.label": "Choisissez votre langue préférée",
    "language.de": "Allemand",
    "language.en": "Anglais",
    "language.es": "Español",
    "language.fr": "Français",
    "language.it": "Italiano",
    "language.pt": "Português",
    "language.da": "Danois",
    "language.nl": "Néerlandais",
    "language.sv": "Suédois",
    "language.fi": "Finnois",
    "language.de.label": "Voir le site en allemand",
    "language.en.label": "Voir le site en anglais",
    "language.es.label": "Voir le site en espagnol",
    "language.fr.label": "Voir le site en français",
    "language.it.label": "Voir le site en italien",
    "language.pt.label": "Voir le site en portugais",
    "language.da.label": "Voir le site en danois",
    "language.nl.label": "Voir le site en néerlandais",
    "language.sv.label": "Voir le site en suédois",
    "language.fi.label": "Voir le site en finnois",
    "playlist.item.unavailable": "Ce contenu n'est pas encore disponible",
    "playlist.item.status": "Statut",
    "playlist.item.coming.soon": "Bientôt disponible",
    "game.area.label": "Zone de jeu",
    "game.options.label": "Options de réponse",
    "game.answer.correct": "Correct ! {points} points + {bonus} points bonus",
    "game.answer.wrong": "Faux ! La bonne réponse était : {answer}",
    "error.invalid.question": "Question invalide ou aucune option disponible",
    "error.no.initial.question": "Aucune question initiale valide trouvée",
    "error.no.albums.found": "Aucun album trouvé pour la catégorie {category}",
    "meta.keywords":
      "Quiz Musical, Jeu de Musique, Quiz de Chansons, Quiz d'Artistes, Quiz Musical en Ligne, Trivia Musicale, Melody Mind, Jeu de Devinettes Musicales",
    "knowledge.title": "Base de Connaissances Musicales",
    "knowledge.intro":
      "Plongez dans le monde fascinant de l'histoire de la musique. Vous trouverez ici des articles passionnants sur différentes époques musicales, genres et leur évolution. Découvrez des faits intéressants et élargissez vos connaissances musicales.",
    "knowledge.search.label": "Rechercher des articles",
    "knowledge.search.placeholder": "Rechercher...",
    "knowledge.filter.all": "Tous les Mots-clés",
    "knowledge.no.results":
      "Aucun article trouvé. Essayez d'autres termes de recherche.",
    "game.remaining": "restant",
    "game.default.headline": "Jeu",
    "popup.score": "Score : {score}",
    "popup.golden.lp.score": "Points obtenus : {score}",
    "nav.donate.heading": "Nous soutenir",
    "nav.donate.paypal": "Faire un don via PayPal",
    "nav.donate.coffee": "M'offrir un café",
    "nav.title": "Navigation",
    "nav.menu.text": "Menu",
    "game.categories.empty.headline": "Aucun genre trouvé",
    "game.categories.empty.text":
      "Malheureusement, aucune catégorie n'a été trouvée. Veuillez réessayer plus tard.",
    "game.categories.no.playable.headline": "Aucun genre jouable",
    "game.categories.no.playable.text":
      "Il n'y a actuellement aucune catégorie jouable. Veuillez revenir plus tard.",
    "knowledge.reading.time": "min de lecture",
    "knowledge.breadcrumb.label": "Navigation fil d'Ariane",
    "knowledge.listen.heading": "Écouter de la Musique Associée",
    "knowledge.back.to.list": "Retour aux Articles",
    "knowledge.interact.heading": "Écouter & Jouer",
    "knowledge.play.heading": "Jouer ce Genre",
    "knowledge.play.description":
      "Testez vos connaissances sur ce genre musical dans notre quiz interactif!",
    "knowledge.play.category": "Démarrer le Quiz Musical",
    "category.play": "Jouer",
    "play.cover.puzzle": "Jouer au Cover Puzzle",
    "play.cover.puzzle.description":
      "Dans Cover Puzzle, vous devez reconnaître les pochettes d'albums au fur et à mesure qu'elles se dévoilent. Plus vous identifiez rapidement le bon album, plus vous gagnez de points. Testez votre mémoire visuelle pour les pochettes musicales !",
    "podcast.page.title": "Podcasts de Musique | Melody Mind",
    "podcast.page.heading": "Podcasts de Musique Captivants",
    "podcast.page.description":
      "Plongez dans le monde de la musique avec nos podcasts captivants. Découvrez des histoires passionnantes, des contextes fascinants et des moments déterminants de différentes époques musicales - parfait pour tous ceux qui veulent non seulement écouter de la musique, mais aussi la comprendre. Nos podcasts sont publiés toutes les 2 semaines et sont disponibles exclusivement en allemand et en anglais.",
    "podcast.search.label": "Rechercher des podcasts",
    "podcast.search.placeholder":
      "Rechercher des histoires fascinantes de musique...",
    "podcast.search.status.all": "Tous les podcasts sont affichés",
    "podcast.search.status.one": "1 podcast trouvé",
    "podcast.search.status.multiple": "{count} podcasts trouvés",
    "podcast.no.results":
      "Aucun podcast correspondant trouvé. Essayez un autre terme de recherche.",
    "podcast.duration.error": "Durée non disponible",
    "podcast.play": "Lire",
    "podcast.intro.title": "Présentation d'Astropod",
    "podcast.intro.description":
      "Astropod est une solution de podcast sans serveur gratuite et open-source.",
    "podcast.deploy.title": "Déployer votre podcast sans serveur en 2 minutes",
    "podcast.deploy.description":
      "Apprenez à déployer rapidement votre podcast.",
    "podcast.auth.title":
      "Configuration de l'authentification utilisateur et accès au tableau de bord",
    "podcast.auth.description":
      "Activez l'authentification et accédez au tableau de bord.",
    "podcast.config.title": "Configurer votre Podcast Astropod",
    "podcast.config.description": "Apprenez à configurer votre podcast.",
    "podcast.publish.title": "Publier votre premier épisode",
    "podcast.publish.description":
      "Publiez votre premier épisode avec facilité.",
    "podcast.conclusion.title": "Conclusion",
    "podcast.conclusion.description": "Résumé et prochaines étapes.",
    "podcast.listen.on": "Écouter sur",
    "podcast.language.availability":
      "Nos podcasts sont disponibles exclusivement en allemand et en anglais.",
    "podcast.listen.heading": "Écoutez nos podcasts",
    "login.welcome": "Bienvenue à Melody Mind!",
    "login.description":
      "Embarquez pour un voyage musical à travers le temps ! Testez vos connaissances dans des quiz passionnants, explorez des genres musicaux fascinants et plongez dans nos podcasts captivants. Montrez vos compétences, collectez des points et devenez une véritable légende de la musique !",
    "index.continue": "Allons-y !",
    "index.start.game.label": "Commencez votre voyage musical",
    "index.welcome.footnote":
      "Conçu par des mélomanes pour des mélomanes. Profitez-en !",
    "accessibility.wcag": "Cette application vise la conformité WCAG AAA.",
    "game.instructions.title": "Instructions du Jeu",
    "game.instructions.puzzle":
      "Essayez de deviner l'album pendant que la pochette se révèle progressivement. Plus vous devinez vite, plus vous gagnez de points.",
    "game.time.remaining": "Temps restant :",
    "game.puzzle.label": "Puzzle de Pochette d'Album",
    "game.puzzle.loading": "Chargement du puzzle...",
    "game.options.legend": "Choisissez le bon album",
    "game.next.round": "Commencer le tour suivant",
    "game.puzzle.revealed": "{percent}% de la pochette d'album a été révélé",
    "game.option.choose": "Choisir",
    "game.options.available":
      "Les options de réponse sont maintenant disponibles",
    "game.time.remaining.seconds": "Il reste {seconds} secondes",
    "game.time.up": "Temps écoulé ! L'album correct était :",
    "game.correct.answer": "Réponse correcte",
    "game.slower.speed": "Jeu plus lent",
    "game.normal.speed": "Vitesse normale",
    "game.skip.to.answers": "Passer aux options de réponse",
    "game.next": "Suivant",
    "aria.pressed": "Appuyé",
    "aria.expanded": "Développé",
    "aria.shortcuts.panel": "Panneau de raccourcis clavier",
    "aria.shortcuts.list": "Liste des raccourcis clavier disponibles",
    "knowledge.empty": "Aucun article disponible dans cette catégorie",
    "playlist.page.title": "Playlists Musicales | Melody Mind",
    "playlist.page.heading": "Découvrez nos Playlists Musicales",
    "playlist.page.description":
      "Plongez dans des playlists soigneusement sélectionnées de différentes époques et genres. Parfaites pour découvrir de nouvelles musiques ou revivre vos classiques préférés.",
    "playlist.search.label": "Rechercher des playlists",
    "playlist.search.placeholder": "Rechercher par ère musicale ou style...",
    "playlist.filter.all": "Toutes les Époques",
    "playlist.no.results":
      "Aucune playlist correspondante trouvée. Essayez un autre terme de recherche.",
    "playlist.listen.on": "Écouter sur",
    "playlist.listen.spotify": "Écouter sur Spotify",
    "playlist.listen.deezer": "Écouter sur Deezer",
    "playlist.listen.apple": "Écouter sur Apple Music",
    "playlist.decade.filter": "Filtrer par décennie",
    "footer.rights": "Tous droits réservés",
    "footer.donate": "Faire un don",
    "game.chronology.title": "Chronologie Musicale",
    "game.chronology.description":
      "Classez ces albums par année de sortie (le plus ancien en premier)",
    "game.chronology.area.label": "Zone de Jeu Chronologique",
    "game.chronology.result": "Résultat",
    "game.chronology.correct": "Correct",
    "game.chronology.wrong": "Devrait être en position {position}",
    "game.chronology.score": "Score : {score} points",
    "game.chronology.details":
      "{correct} albums sur {total} correctement placés",
    "game.chronology.year": "Année : {year}",
    "game.chronology.drag.help":
      "Utilisez les touches fléchées ↑/↓ ou glissez pour réorganiser",
    "game.submit.answer": "Vérifier la Réponse",
    "game.chronology.up": "En haut",
    "game.chronology.down": "En bas",
    "game.chronology.position": "Position",
    "game.chronology.start": "Début",
    "game.chronology.end": "Fin",
    "common.back.to.top": "Retour en haut",
    "knowledge.articles.heading": "Articles de Connaissance",
    "knowledge.search.heading": "Rechercher des Articles",
    "knowledge.search.description":
      "Les articles seront filtrés automatiquement pendant que vous tapez",
    "knowledge.search.reset": "Réinitialiser la recherche",
    "knowledge.search.reset.text": "Réinitialiser",
    "knowledge.no.results.help":
      "Essayez d'autres termes de recherche ou réinitialisez votre recherche",
    "knowledge.keyboard.instructions":
      "Utilisez les touches fléchées pour naviguer entre les articles. Appuyez sur Entrée pour ouvrir un article.",

    // Page de profil
    "profile.title": "Mon Profil",
    "profile.description":
      "Gérez vos informations personnelles et consultez vos statistiques de jeu",
    "profile.loading": "Chargement des données du profil...",
    "profile.error": "Erreur lors du chargement des données du profil",
    "profile.auth.required": "Vous devez être connecté pour voir votre profil",
    "profile.user.info": "Informations Utilisateur",
    "profile.user.since": "Membre depuis",
    "profile.stats.title": "Statistiques de Jeu",
    "profile.stats.quiz": "Quiz",
    "profile.stats.chronology": "Chronologie",
    "profile.stats.total.score": "Score Total",
    "profile.stats.games.played": "Parties Jouées",
    "profile.stats.highest.score": "Meilleur Score",
    "profile.recent.games": "Résultats de Jeux Récents",
    "profile.recent.games.empty": "Vous n'avez pas encore joué de parties",
    "profile.recent.game.mode": "Mode de Jeu",
    "profile.recent.game.category": "Catégorie",
    "profile.recent.game.difficulty": "Difficulté",
    "profile.recent.game.score": "Score",
    "profile.recent.game.date": "Date",
    "profile.nav.aria": "Navigation vers le profil utilisateur",
    "profile.nav.link": "Aller au profil",

    // Page des meilleurs scores
    "highscores.title": "Meilleurs scores",
    "highscores.description":
      "Voir les meilleurs scores dans différents modes de jeu et catégories",
    "highscores.loading": "Chargement des scores...",
    "highscores.error": "Erreur lors du chargement des scores",
    "highscores.empty": "Aucun score trouvé",
    "highscores.filter.title": "Filtrer les scores",
    "highscores.filter.game.mode": "Mode de jeu",
    "highscores.filter.category": "Catégorie",
    "highscores.filter.all": "Tous",
    "highscores.filter.search": "Rechercher des catégories...",
    "highscores.filter.no.results": "Aucune catégorie trouvée",
    "highscores.table.title": "Meilleurs scores",
    "highscores.table.rank": "Rang",
    "highscores.table.player": "Joueur",
    "highscores.table.game.mode": "Mode de jeu",
    "highscores.table.category": "Catégorie",
    "highscores.table.score": "Score",
    "highscores.table.date": "Date",
  },
  it: {
    // Auth-Komponenten

    // Achievement Categories
    "achievements.category.games_played": "Partite Giocate",
    "achievements.category.perfect_games": "Partite Perfette",
    "achievements.category.total_score": "Punteggio Totale",
    "achievements.category.daily_streak": "Serie Giornaliera",
    "achievements.category.daily_games": "Partite Giornaliere",

    // Achievement System
    "achievements.title": "Obiettivi",
    "achievements.description":
      "Scopri e sblocca obiettivi per tracciare i tuoi progressi",
    "achievements.loading": "Caricamento obiettivi...",
    "achievements.error": "Errore durante il caricamento degli obiettivi",
    "achievements.empty": "Nessun obiettivo trovato",
    "achievements.category.bronze": "Bronzo",
    "achievements.category.silver": "Argento",
    "achievements.category.gold": "Oro",
    "achievements.category.platinum": "Platino",
    "achievements.category.diamond": "Diamante",
    "achievements.category.time": "Tempo",
    "achievements.status.locked": "Bloccato",
    "achievements.status.in_progress": "In Corso",
    "achievements.status.unlocked": "Sbloccato",
    "achievements.progress": "Progresso: {progress}%",
    "achievements.unlocked_at": "Sbloccato il {date}",
    "achievements.points": "Punti: {points}",
    "achievements.rarity": "Rarità: {percentage}%",
    "achievements.notification.unlocked": "Obiettivo sbloccato!",
    "achievements.notification.progress":
      "Progresso dell'obiettivo aggiornato!",
    "achievements.nav.link": "Obiettivi",
    "achievements.nav.aria": "Naviga agli obiettivi",
    "achievements.badge.new": "Nuovi obiettivi disponibili",
    "achievements.filter.title": "Filtra Obiettivi",
    "achievements.filter.status": "Stato",
    "achievements.filter.status.aria": "Filtra obiettivi per stato",
    "achievements.filter.category": "Categoria",
    "achievements.filter.category.aria": "Filtra obiettivi per categoria",
    "achievements.filter.all": "Tutti",
    "achievements.filter.all_categories": "Tutte le Categorie",
    "achievements.summary.title": "Progresso Obiettivi",
    "achievements.summary.total": "Totale",
    "achievements.summary.unlocked": "Sbloccati",
    "achievements.summary.progress": "Progresso",
    "achievements.notification.close": "Chiudi notifica",
    "achievements.rarity.tooltip":
      "Percentuale di giocatori che hanno sbloccato questo obiettivo",

    // Game Counter Achievements
    "achievements.games_played_1": "Principiante: 1 Partita",
    "achievements.games_played_1.description":
      "Gioca la tua prima partita in qualsiasi modalità",
    "achievements.games_played_5": "Principiante: 5 Partite",
    "achievements.games_played_5.description":
      "Gioca 5 partite in qualsiasi modalità",
    "achievements.games_played_10": "Principiante: 10 Partite",
    "achievements.games_played_10.description":
      "Gioca 10 partite in qualsiasi modalità",
    "achievements.games_played_25": "Dilettante: 25 Partite",
    "achievements.games_played_25.description":
      "Gioca 25 partite in qualsiasi modalità",
    "achievements.games_played_50": "Dilettante: 50 Partite",
    "achievements.games_played_50.description":
      "Gioca 50 partite in qualsiasi modalità",
    "achievements.games_played_75": "Dilettante: 75 Partite",
    "achievements.games_played_75.description":
      "Gioca 75 partite in qualsiasi modalità",
    "achievements.games_played_100": "Avanzato: 100 Partite",
    "achievements.games_played_100.description":
      "Gioca 100 partite in qualsiasi modalità",
    "achievements.games_played_150": "Avanzato: 150 Partite",
    "achievements.games_played_150.description":
      "Gioca 150 partite in qualsiasi modalità",
    "achievements.games_played_200": "Avanzato: 200 Partite",
    "achievements.games_played_200.description":
      "Gioca 200 partite in qualsiasi modalità",
    "achievements.games_played_300": "Esperto: 300 Partite",
    "achievements.games_played_300.description":
      "Gioca 300 partite in qualsiasi modalità",
    "achievements.games_played_400": "Esperto: 400 Partite",
    "achievements.games_played_400.description":
      "Gioca 400 partite in qualsiasi modalità",
    "achievements.games_played_500": "Esperto: 500 Partite",
    "achievements.games_played_500.description":
      "Gioca 500 partite in qualsiasi modalità",
    "achievements.games_played_750": "Maestro: 750 Partite",
    "achievements.games_played_750.description":
      "Gioca 750 partite in qualsiasi modalità",
    "achievements.games_played_1000": "Maestro: 1000 Partite",
    "achievements.games_played_1000.description":
      "Gioca 1000 partite in qualsiasi modalità",
    "achievements.games_played_1500": "Maestro: 1500 Partite",
    "achievements.games_played_1500.description":
      "Gioca 1500 partite in qualsiasi modalità",
    "achievements.games_played_2000": "Maestro: 2000 Partite",
    "achievements.games_played_2000.description":
      "Gioca 2000 partite in qualsiasi modalità",
    "achievements.games_played_2500": "Leggenda: 2500 Partite",
    "achievements.games_played_2500.description":
      "Gioca 2500 partite in qualsiasi modalità",
    "achievements.games_played_3000": "Leggenda: 3000 Partite",
    "achievements.games_played_3000.description":
      "Gioca 3000 partite in qualsiasi modalità",
    "achievements.games_played_4000": "Leggenda: 4000 Partite",
    "achievements.games_played_4000.description":
      "Gioca 4000 partite in qualsiasi modalità",
    "achievements.games_played_5000": "Leggenda: 5000 Partite",
    "achievements.games_played_5000.description":
      "Gioca 5000 partite in qualsiasi modalità",

    // Perfect Games Achievements
    "achievements.perfect_games_1": "Colpo di Fortuna: 1 Partita Perfetta",
    "achievements.perfect_games_1.description":
      "Ottieni il punteggio massimo in 1 partita",
    "achievements.perfect_games_2": "Colpo di Fortuna: 2 Partite Perfette",
    "achievements.perfect_games_2.description":
      "Ottieni il punteggio massimo in 2 partite",
    "achievements.perfect_games_3": "Colpo di Fortuna: 3 Partite Perfette",
    "achievements.perfect_games_3.description":
      "Ottieni il punteggio massimo in 3 partite",
    "achievements.perfect_games_5": "Precisione: 5 Partite Perfette",
    "achievements.perfect_games_5.description":
      "Ottieni il punteggio massimo in 5 partite",
    "achievements.perfect_games_7": "Precisione: 7 Partite Perfette",
    "achievements.perfect_games_7.description":
      "Ottieni il punteggio massimo in 7 partite",
    "achievements.perfect_games_10": "Precisione: 10 Partite Perfette",
    "achievements.perfect_games_10.description":
      "Ottieni il punteggio massimo in 10 partite",
    "achievements.perfect_games_15": "Esperienza: 15 Partite Perfette",
    "achievements.perfect_games_15.description":
      "Ottieni il punteggio massimo in 15 partite",
    "achievements.perfect_games_20": "Esperienza: 20 Partite Perfette",
    "achievements.perfect_games_20.description":
      "Ottieni il punteggio massimo in 20 partite",
    "achievements.perfect_games_25": "Esperienza: 25 Partite Perfette",
    "achievements.perfect_games_25.description":
      "Ottieni il punteggio massimo in 25 partite",
    "achievements.perfect_games_30": "Maestria: 30 Partite Perfette",
    "achievements.perfect_games_30.description":
      "Ottieni il punteggio massimo in 30 partite",
    "achievements.perfect_games_40": "Maestria: 40 Partite Perfette",
    "achievements.perfect_games_40.description":
      "Ottieni il punteggio massimo in 40 partite",
    "achievements.perfect_games_50": "Maestria: 50 Partite Perfette",
    "achievements.perfect_games_50.description":
      "Ottieni il punteggio massimo in 50 partite",
    "achievements.perfect_games_75": "Perfezione: 75 Partite Perfette",
    "achievements.perfect_games_75.description":
      "Ottieni il punteggio massimo in 75 partite",
    "achievements.perfect_games_100": "Perfezione: 100 Partite Perfette",
    "achievements.perfect_games_100.description":
      "Ottieni il punteggio massimo in 100 partite",
    "achievements.perfect_games_150": "Perfezione: 150 Partite Perfette",
    "achievements.perfect_games_150.description":
      "Ottieni il punteggio massimo in 150 partite",
    "achievements.perfect_games_200": "Leggenda: 200 Partite Perfette",
    "achievements.perfect_games_200.description":
      "Ottieni il punteggio massimo in 200 partite",
    "achievements.perfect_games_300": "Leggenda: 300 Partite Perfette",
    "achievements.perfect_games_300.description":
      "Ottieni il punteggio massimo in 300 partite",
    "achievements.perfect_games_400": "Leggenda: 400 Partite Perfette",
    "achievements.perfect_games_400.description":
      "Ottieni il punteggio massimo in 400 partite",
    "achievements.perfect_games_500": "Leggenda: 500 Partite Perfette",
    "achievements.perfect_games_500.description":
      "Ottieni il punteggio massimo in 500 partite",

    // Score Achievements
    "achievements.total_score_100": "Collezionista: 100 Punti",
    "achievements.total_score_100.description":
      "Accumula 100 punti in tutte le partite",
    "achievements.total_score_250": "Collezionista: 250 Punti",
    "achievements.total_score_250.description":
      "Accumula 250 punti in tutte le partite",
    "achievements.total_score_500": "Collezionista: 500 Punti",
    "achievements.total_score_500.description":
      "Accumula 500 punti in tutte le partite",
    "achievements.total_score_1000": "Cacciatore di Punti: 1.000 Punti",
    "achievements.total_score_1000.description":
      "Accumula 1.000 punti in tutte le partite",
    "achievements.total_score_2500": "Cacciatore di Punti: 2.500 Punti",
    "achievements.total_score_2500.description":
      "Accumula 2.500 punti in tutte le partite",
    "achievements.total_score_5000": "Cacciatore di Punti: 5.000 Punti",
    "achievements.total_score_5000.description":
      "Accumula 5.000 punti in tutte le partite",
    "achievements.total_score_7500": "Magnete di Punti: 7.500 Punti",
    "achievements.total_score_7500.description":
      "Accumula 7.500 punti in tutte le partite",
    "achievements.total_score_10000": "Magnete di Punti: 10.000 Punti",
    "achievements.total_score_10000.description":
      "Accumula 10.000 punti in tutte le partite",
    "achievements.total_score_15000": "Magnete di Punti: 15.000 Punti",
    "achievements.total_score_15000.description":
      "Accumula 15.000 punti in tutte le partite",
    "achievements.total_score_20000": "Maestro dei Punti: 20.000 Punti",
    "achievements.total_score_20000.description":
      "Accumula 20.000 punti in tutte le partite",
    "achievements.total_score_30000": "Maestro dei Punti: 30.000 Punti",
    "achievements.total_score_30000.description":
      "Accumula 30.000 punti in tutte le partite",
    "achievements.total_score_50000": "Maestro dei Punti: 50.000 Punti",
    "achievements.total_score_50000.description":
      "Accumula 50.000 punti in tutte le partite",
    "achievements.total_score_75000": "Elite: 75.000 Punti",
    "achievements.total_score_75000.description":
      "Accumula 75.000 punti in tutte le partite",
    "achievements.total_score_100000": "Elite: 100.000 Punti",
    "achievements.total_score_100000.description":
      "Accumula 100.000 punti in tutte le partite",
    "achievements.total_score_150000": "Elite: 150.000 Punti",
    "achievements.total_score_150000.description":
      "Accumula 150.000 punti in tutte le partite",
    "achievements.total_score_200000": "Leggenda: 200.000 Punti",
    "achievements.total_score_200000.description":
      "Accumula 200.000 punti in tutte le partite",
    "achievements.total_score_300000": "Leggenda: 300.000 Punti",
    "achievements.total_score_300000.description":
      "Accumula 300.000 punti in tutte le partite",
    "achievements.total_score_400000": "Leggenda: 400.000 Punti",
    "achievements.total_score_400000.description":
      "Accumula 400.000 punti in tutte le partite",
    "achievements.total_score_500000": "Leggenda: 500.000 Punti",
    "achievements.total_score_500000.description":
      "Accumula 500.000 punti in tutte le partite",

    // Daily Streak Achievements
    "achievements.daily_streak_1": "Giocatore Quotidiano",
    "achievements.daily_streak_1.description": "Gioca per 1 giorno consecutivo",
    "achievements.daily_streak_3": "Entusiasta Musicale",
    "achievements.daily_streak_3.description": "Gioca per 3 giorni consecutivi",
    "achievements.daily_streak_5": "Maestro della Melodia",
    "achievements.daily_streak_5.description": "Gioca per 5 giorni consecutivi",
    "achievements.daily_streak_7": "Settimana Perfetta",
    "achievements.daily_streak_7.description": "Gioca per 7 giorni consecutivi",
    "achievements.daily_streak_14": "Veterano Musicale",
    "achievements.daily_streak_14.description":
      "Gioca per 14 giorni consecutivi",
    "achievements.daily_streak_30": "Leggenda della Melodia",
    "achievements.daily_streak_30.description":
      "Gioca per 30 giorni consecutivi",

    // Daily Games Achievements
    "achievements.daily_games_3": "Riscaldamento",
    "achievements.daily_games_3.description":
      "Gioca 3 partite in un solo giorno",
    "achievements.daily_games_5": "Sessione Musicale",
    "achievements.daily_games_5.description":
      "Gioca 5 partite in un solo giorno",
    "achievements.daily_games_10": "Maratona Musicale",
    "achievements.daily_games_10.description":
      "Gioca 10 partite in un solo giorno",
    "achievements.daily_games_20": "Maratona di Melodia",
    "achievements.daily_games_20.description":
      "Gioca 20 partite in un solo giorno",
    "achievements.daily_games_30": "Ultra Musicale",
    "achievements.daily_games_30.description":
      "Gioca 30 partite in un solo giorno",
    "achievements.daily_games_50": "Follia Melodica",
    "achievements.daily_games_50.description":
      "Gioca 50 partite in un solo giorno",

    // Achievement error messages
    "errors.achievements.fetch": "Errore durante il recupero degli obiettivi",
    "errors.achievements.update":
      "Errore durante l'aggiornamento del progresso dell'obiettivo",
    "errors.achievements.unlock": "Errore durante lo sblocco dell'obiettivo",
    "errors.achievements.check": "Errore durante la verifica degli obiettivi",

    "auth.required.title": "Autenticazione richiesta",
    "auth.required.description":
      "Per favore accedi per visualizzare quest'area",
    "auth.login.title": "Accedi",
    "auth.register.title": "Registrati",
    "auth.toggle.login": "Passa al login",
    "auth.toggle.register": "Passa alla registrazione",
    "auth.login.submit": "Accedi",
    "auth.register.submit": "Registrati",
    "auth.form.submit": "Invia",
    "auth.form.loading": "Elaborazione in corso...",
    "auth.tabs.login": "Accedi",
    "auth.tabs.register": "Registrati",
    "auth.validation.processing": "Verifica dei dati in corso...",
    "auth.form.error.general": "Si è verificato un errore",
    "auth.form.success": "Operazione riuscita!",
    "auth.form.email_required": "L'indirizzo email è obbligatorio",
    "auth.form.email_invalid_short": "Indirizzo email non valido",
    "auth.form.loading_text": "Caricamento...",
    "auth.form.send_reset_link": "Invia link di reimpostazione",
    "auth.form.password_required": "La password è obbligatoria",
    "auth.form.password_requirements":
      "La password non soddisfa tutti i requisiti",
    "auth.form.password_confirm_required":
      "La conferma della password è obbligatoria",
    "auth.form.passwords_not_match": "Le password non corrispondono",
    "auth.password_reset.success_message":
      "Se esiste un account con questa email, abbiamo inviato le istruzioni per reimpostare la password.",
    "auth.password_reset.error_message":
      "Si è verificato un errore. Riprova più tardi.",
    "auth.password_reset.complete_success":
      "Password reimpostata con successo. Ora puoi accedere con la tua nuova password.",
    "auth.password_reset.complete_error":
      "Reimpostazione della password fallita. Verifica i tuoi dati o richiedi un nuovo link di reimpostazione.",

    "auth.login.email": "Indirizzo email",
    "auth.login.email.placeholder": "Inserisci il tuo indirizzo email",
    "auth.login.password": "Password",
    "auth.login.password.placeholder": "Inserisci la tua password",
    "auth.login.remember": "Ricordami",
    "auth.login.forgot_password": "Password dimenticata?",
    "auth.login.success": "Accesso effettuato con successo",
    "auth.login.error": "Errore durante l'accesso",

    "auth.register.name": "Nome completo",
    "auth.register.email": "Indirizzo email",
    "auth.register.email.placeholder": "Inserisci il tuo indirizzo email",
    "auth.register.username": "Nome utente",
    "auth.register.username.placeholder": "Scegli un nome utente",
    "auth.register.password": "Password",
    "auth.register.password.placeholder": "Crea una password sicura",
    "auth.register.confirm_password": "Conferma password",
    "auth.register.password_confirm.placeholder":
      "Inserisci nuovamente la password",
    "auth.register.terms": "Accetto i termini e le condizioni",
    "auth.register.success": "Registrazione completata con successo",
    "auth.register.error": "Errore durante la registrazione",

    "auth.password_reset.title": "Reimposta password",
    "auth.password_reset.submit": "Invia link di reimpostazione",
    "auth.password_reset.email": "Indirizzo email",
    "auth.password_reset.email.placeholder":
      "Inserisci l'indirizzo email registrato",
    "auth.password_reset.back_to_login": "Torna al login",
    "auth.password_reset.login": "Accedi",
    "auth.password_reset.success":
      "Un link di reimpostazione è stato inviato al tuo indirizzo email",
    "auth.password_reset.error":
      "Errore durante l'invio del link di reimpostazione",
    "auth.password_reset.new_password": "Nuova password",
    "auth.password_reset.confirm_password": "Conferma nuova password",
    "auth.password_reset.change_submit": "Cambia password",

    "auth.email_verification.title": "Verifica email",
    "auth.email_verification.message":
      "Abbiamo inviato un link di verifica al tuo indirizzo email",
    "auth.email_verification.check_inbox":
      "Per favore, controlla la tua casella di posta",
    "auth.email_verification.resend": "Rinvia link di verifica",
    "auth.email_verification.success": "Email verificata con successo",
    "auth.email_verification.error": "Errore durante la verifica dell'email",

    // Passwortvalidierung
    "auth.password.requirements": "Requisiti della password:",
    "auth.password.min_length": "La password deve contenere almeno 8 caratteri",
    "auth.password.require_number":
      "La password deve contenere almeno un numero",
    "auth.password.require_uppercase":
      "La password deve contenere almeno una lettera maiuscola",
    "auth.password.require_lowercase":
      "La password deve contenere almeno una lettera minuscola",
    "auth.password.require_special":
      "La password deve contenere almeno un carattere speciale",
    "auth.password.match": "Le password devono corrispondere",
    "auth.password.strength.weak": "Debole",
    "auth.password.strength.medium": "Media",
    "auth.password.strength.strong": "Forte",

    // Formularvalidierung
    "auth.form.required": "Questo campo è obbligatorio",
    "auth.form.email_invalid": "Inserisci un indirizzo email valido",
    "auth.form.min_length":
      "Questo campo deve contenere almeno {length} caratteri",
    "auth.form.max_length":
      "Questo campo non può contenere più di {length} caratteri",
    "auth.form.invalid": "Questo campo non è valido",

    // Zugänglichkeit
    "auth.accessibility.loading": "Caricamento in corso, attendere prego",
    "auth.accessibility.error": "Errore: {message}",
    "auth.accessibility.required_field": "Campo obbligatorio",
    "auth.accessibility.toggle_password": "Mostra/nascondi password",
    "auth.accessibility.close_modal": "Chiudi finestra",

    // API-Fehlermeldungen
    "auth.api.network_error": "Errore di rete. Controlla la tua connessione",
    "auth.api.server_error": "Errore del server. Riprova più tardi",
    "auth.api.invalid_credentials": "Credenziali non valide",
    "auth.api.account_exists": "Esiste già un account con questa email",
    "auth.api.email_not_found": "Nessun account trovato con questa email",
    "auth.api.too_many_requests": "Troppi tentativi. Riprova più tardi",

    // Service-Fehlermeldungen
    "auth.service.session_expired":
      "La tua sessione è scaduta. Effettua nuovamente l'accesso",
    "auth.service.unauthorized": "Non autorizzato. Effettua l'accesso",
    "auth.service.account_locked":
      "Il tuo account è stato bloccato. Contatta l'assistenza",
    "auth.service.permission_denied": "Permesso negato per questa azione",
    "auth.service.invalid_credentials":
      "Credenziali non valide. Controlla la tua email e password.",
    "auth.service.too_many_attempts":
      "Troppi tentativi di accesso. Attendi un momento prima di riprovare.",

    "nav.home": "Home",
    "nav.rules": "Regole",
    "category.no_image_available": "Nessuna immagine disponibile",
    "game.score": "Punteggio",
    "game.round": "Round",
    "game.joker": "Jolly 50:50",
    "difficulty.easy": "Facile",
    "difficulty.medium": "Medio",
    "difficulty.hard": "Difficile",
    "category.difficulty.easy": "Facile",
    "category.difficulty.medium": "Medio",
    "category.difficulty.hard": "Difficile",
    "game.select":
      "Scopri l'affascinante mondo della musica e metti alla prova le tue conoscenze nei nostri quiz musicali interattivi. Scegli il tuo genere preferito e inizia il tuo viaggio melodioso!",
    "game.welcome": "Benvenuti a Melody Mind",
    "game.genre.list": "Selezione del genere",
    "game.search.label": "Cerca un genere",
    "game.search.description":
      "La lista viene filtrata automaticamente durante la digitazione",
    "game.genre.play.label": "Gioca",
    "game.genre.image": "Immagine di copertina per",
    "game.no.results": "Nessun risultato trovato",
    "game.not.available": "Non disponibile",
    "category.selected": "selezionato!",
    "category.difficulty.heading": "Scegli il tuo livello di difficoltà",
    "category.difficulty.group": "Livelli di difficoltà",
    "category.difficulty.easy.label": "Avvia gioco in modalità facile",
    "category.difficulty.medium.label": "Avvia gioco in modalità media",
    "category.difficulty.hard.label": "Avvia gioco in modalità difficile",
    "category.image.alt": "Immagine di copertina",
    "nav.menu.open": "Apri menu",
    "nav.menu.close": "Chiudi menu",
    "nav.menu.home": "Home",
    "nav.menu.rules": "Regole",
    "nav.menu.highscores": "Punteggi",
    "nav.menu.profile": "Profilo",
    "nav.menu.logout": "Esci",
    "nav.skip.main": "Vai al contenuto principale",
    "game.end.title": "Partita finita!",
    "game.end.motivation":
      "Prestazione fantastica! 🎉 La tua conoscenza musicale è davvero impressionante. Sfida te stesso con un altro round e diventa una vera leggenda della musica! 🎵",
    "game.end.score": "Punteggio ottenuto:",
    "game.end.newgame": "Nuova Partita",
    "game.end.share": "Condividi il tuo successo!",
    "game.end.home": "Home",
    "game.feedback.resolution": "Risoluzione",
    "game.feedback.media.section": "Sezione Media",
    "game.feedback.audio.preview": "Anteprima musicale",
    "game.feedback.subtitles": "Sottotitoli",
    "game.feedback.audio.unsupported":
      "Il tuo browser non supporta la riproduzione audio.",
    "game.feedback.streaming.links": "Link per lo Streaming Musicale",
    "game.feedback.listen.spotify": "Ascolta su Spotify",
    "game.feedback.listen.deezer": "Ascolta su Deezer",
    "game.feedback.listen.apple": "Ascolta su Apple Music",
    "game.feedback.next.round": "Prossimo Round",
    "game.current.round": "Round",
    "game.current.round.label": "Numero del round attuale",
    "game.joker.options": "Opzioni Jolly",
    "game.joker.use": "Usa Jolly 50:50",
    "game.joker.description": "Rimuove due opzioni di risposta errate",
    "loading.content": "Caricamento contenuti...",
    "share.title": "Condividi il tuo successo!",
    "share.buttons.group.label": "Opzioni di condivisione sui social media",
    "share.facebook": "Condividi su Facebook",
    "share.whatsapp": "Condividi su WhatsApp",
    "share.native": "Condividi con...",
    "share.native.label": "Condividi",
    "share.twitter": "Condividi su X/Twitter",
    "share.email": "Condividi via Email",
    "share.email.label": "Email",
    "share.copy": "Copia il testo di condivisione negli appunti",
    "share.copy.label": "Copia testo",
    "error.default": "Si è verificato un errore",
    "error.close": "Chiudi messaggio di errore",
    "coins.collected": "Monete raccolte",
    "language.picker.label": "Selezione della lingua",
    "language.change": "Cambia la lingua del sito",
    "language.select.label": "Scegli la tua lingua preferita",
    "language.de": "Tedesco",
    "language.en": "Inglese",
    "language.es": "Spagnolo",
    "language.fr": "Francese",
    "language.it": "Italiano",
    "language.pt": "Portoghese",
    "language.da": "Danese",
    "language.nl": "Olandese",
    "language.sv": "Svedese",
    "language.fi": "Finlandese",
    "language.de.label": "Visualizza il sito in tedesco",
    "language.en.label": "Visualizza il sito in inglese",
    "language.es.label": "Visualizza il sito in spagnolo",
    "language.fr.label": "Visualizza il sito in francese",
    "language.it.label": "Visualizza il sito in italiano",
    "language.pt.label": "Visualizza il sito in portoghese",
    "language.da.label": "Visualizza il sito in danese",
    "language.nl.label": "Visualizza il sito in olandese",
    "language.sv.label": "Visualizza il sito in svedese",
    "language.fi.label": "Visualizza il sito in finlandese",
    "playlist.item.unavailable": "Questo contenuto non è ancora disponibile",
    "playlist.item.status": "Stato",
    "playlist.item.coming.soon": "Prossimamente",
    "game.area.label": "Area di gioco",
    "game.options.label": "Opzioni di risposta",
    "game.answer.correct": "Corretto! {points} punti + {bonus} punti bonus",
    "game.answer.wrong": "Sbagliato! La risposta corretta era: {answer}",
    "error.invalid.question":
      "Domanda non valida o nessuna opzione disponibile",
    "error.no.initial.question": "Nessuna domanda iniziale valida trovata",
    "error.no.albums.found": "Nessun album trovato per la categoria {category}",
    "meta.keywords":
      "Quiz Musicale, Gioco Musicale, Quiz Canzoni, Quiz Artisti, Quiz Musicale Online, Trivia Musicale, Melody Mind, Gioco Indovina la Musica",
    "knowledge.title": "Database delle Conoscenze Musicali",
    "knowledge.intro":
      "Immergiti nel fascinante mondo della storia della musica. Qui troverai articoli interessanti su diverse epoche musicali, generi e la loro evoluzione. Scopri fatti interessanti e amplia le tue conoscenze musicali.",
    "knowledge.search.label": "Cerca articoli",
    "knowledge.search.placeholder": "Cerca...",
    "knowledge.filter.all": "Tutte le Parole Chiave",
    "knowledge.no.results":
      "Nessun articolo trovato. Prova con altri termini di ricerca.",
    "game.remaining": "rimanente",
    "game.default.headline": "Gioco",
    "popup.score": "Punteggio: {score}",
    "popup.golden.lp.score": "Punti ottenuti: {score}",
    "nav.donate.heading": "Sostienici",
    "nav.donate.paypal": "Dona tramite PayPal",
    "nav.donate.coffee": "Offrimi un caffè",
    "nav.title": "Navigazione",
    "nav.menu.text": "Menu",
    "game.categories.empty.headline": "Nessun genere trovato",
    "game.categories.empty.text":
      "Purtroppo non sono state trovate categorie. Riprova più tardi.",
    "game.categories.no.playable.headline": "Nessun genere giocabile",
    "game.categories.no.playable.text":
      "Attualmente non ci sono categorie giocabili. Per favore, riprova più tardi.",
    "knowledge.reading.time": "min di lettura",
    "knowledge.breadcrumb.label": "Navigazione breadcrumb",
    "knowledge.listen.heading": "Ascolta Musica Correlata",
    "knowledge.back.to.list": "Torna agli Articoli",
    "knowledge.interact.heading": "Ascoltare & Giocare",
    "knowledge.play.heading": "Gioca questo Genere",
    "knowledge.play.description":
      "Metti alla prova le tue conoscenze su questo genere musicale nel nostro quiz interattivo!",
    "knowledge.play.category": "Avvia Quiz Musicale",
    "category.play": "Gioca",
    "play.cover.puzzle": "Gioca a Cover Puzzle",
    "play.cover.puzzle.description":
      "In Cover Puzzle, devi riconoscere le copertine degli album mentre si rivelano gradualmente. Più velocemente identifichi l'album corretto, più punti guadagni. Metti alla prova la tua memoria visiva per le copertine musicali!",
    "podcast.page.title": "Podcast di Musica | Melody Mind",
    "podcast.page.heading": "Podcast di Musica Avvincenti",
    "podcast.page.description":
      "Immergiti nel mondo della musica con i nostri podcast avvincenti. Scopri storie emozionanti, contesti affascinanti e momenti decisivi di varie epoche musicali, perfetti per chiunque voglia non solo ascoltare la musica, ma anche capirla. I nostri podcast vengono pubblicati ogni 2 settimane e sono disponibili esclusivamente in tedesco e inglese.",
    "podcast.search.label": "Cerca podcast",
    "podcast.search.placeholder": "Cerca storie affascinanti di musica...",
    "podcast.search.status.all": "Tutti i podcast sono visualizzati",
    "podcast.search.status.one": "1 podcast trovato",
    "podcast.search.status.multiple": "{count} podcast trovati",
    "podcast.no.results":
      "Nessun podcast corrispondente trovato. Prova un altro termine di ricerca.",
    "podcast.duration.error": "Durata non disponibile",
    "podcast.play": "Riproduci",
    "podcast.intro.title": "Introduzione ad Astropod",
    "podcast.intro.description":
      "Astropod è una soluzione di podcast serverless gratuita e open-source.",
    "podcast.deploy.title": "Distribuire il tuo podcast serverless in 2 minuti",
    "podcast.deploy.description":
      "Scopri come distribuire rapidamente il tuo podcast.",
    "podcast.auth.title":
      "Impostare l'autenticazione degli utenti e accedere al dashboard",
    "podcast.auth.description":
      "Abilita l'autenticazione e accedi al dashboard.",
    "podcast.config.title": "Configurare il tuo Podcast Astropod",
    "podcast.config.description": "Scopri come configurare il tuo podcast.",
    "podcast.publish.title": "Pubblicare il tuo primo episodio",
    "podcast.publish.description":
      "Pubblica il tuo primo episodio con facilità.",
    "podcast.conclusion.title": "Conclusione",
    "podcast.conclusion.description": "Riepilogo e prossimi passi.",
    "podcast.listen.on": "Ascolta su",
    "podcast.language.availability":
      "I nostri podcast sono disponibili esclusivamente in tedesco e inglese.",
    "podcast.listen.heading": "Ascolta i nostri Podcast",
    "login.welcome": "Benvenuto a Melody Mind!",
    "login.description":
      "Intraprendi un viaggio musicale attraverso il tempo! Metti alla prova le tue conoscenze in quiz entusiasmanti, esplora affascinanti generi musicali e immergiti nei nostri avvincenti podcast. Mostra le tue abilità, raccogli punti e diventa una vera leggenda della musica!",
    "index.continue": "Iniziamo!",
    "index.start.game.label": "Inizia il tuo viaggio musicale",
    "index.welcome.footnote":
      "Creato da amanti della musica per amanti della musica. Buon divertimento!",
    "accessibility.wcag": "Questa applicazione mira alla conformità WCAG AAA.",
    "game.instructions.title": "Istruzioni del Gioco",
    "game.instructions.puzzle":
      "Prova a indovinare l'album mentre la copertina si rivela gradualmente. Più velocemente indovini correttamente, più punti guadagni.",
    "game.time.remaining": "Tempo rimanente:",
    "game.puzzle.label": "Puzzle della Copertina dell'Album",
    "game.puzzle.loading": "Caricamento puzzle...",
    "game.options.legend": "Scegli l'album corretto",
    "game.next.round": "Inizia prossimo round",
    "game.puzzle.revealed":
      "È stato rivelato il {percent}% della copertina dell'album",
    "game.option.choose": "Scegli",
    "game.options.available": "Le opzioni di risposta sono ora disponibili",
    "game.time.remaining.seconds": "Rimangono {seconds} secondi",
    "game.time.up": "Tempo scaduto! L'album corretto era:",
    "game.correct.answer": "Risposta corretta",
    "game.slower.speed": "Gioco più lento",
    "game.normal.speed": "Velocità normale",
    "game.skip.to.answers": "Passa alle opzioni di risposta",
    "game.next": "Avanti",
    "aria.pressed": "Premuto",
    "aria.expanded": "Espanso",
    "aria.shortcuts.panel": "Pannello scorciatoie da tastiera",
    "aria.shortcuts.list": "Elenco delle scorciatoie da tastiera disponibili",
    "knowledge.empty": "Nessun articolo disponibile in questa categoria",
    "playlist.page.title": "Playlist Musicali | Melody Mind",
    "playlist.page.heading": "Scopri le nostre Playlist Musicali",
    "playlist.page.description":
      "Immergiti in playlist accuratamente selezionate di diverse epoche e generi. Perfette per scoprire nuova musica o rivisitare i tuoi classici preferiti.",
    "playlist.search.label": "Cerca playlist",
    "playlist.search.placeholder": "Cerca per era musicale o stile...",
    "playlist.filter.all": "Tutte le Epoche",
    "playlist.no.results":
      "Nessuna playlist corrispondente trovata. Prova un termine di ricerca diverso.",
    "playlist.listen.on": "Ascolta su",
    "playlist.listen.spotify": "Ascolta su Spotify",
    "playlist.listen.deezer": "Ascolta su Deezer",
    "playlist.listen.apple": "Ascolta su Apple Music",
    "playlist.decade.filter": "Filtra per decennio",
    "footer.rights": "Tutti i diritti riservati",
    "footer.donate": "Dona",
    "game.chronology.title": "Cronologia Musicale",
    "game.chronology.description":
      "Ordina questi album per anno di pubblicazione (il più vecchio per primo)",
    "game.chronology.area.label": "Area di Gioco Cronologica",
    "game.chronology.result": "Risultato",
    "game.chronology.correct": "Corretto",
    "game.chronology.wrong": "Dovrebbe essere in posizione {position}",
    "game.chronology.score": "Risultato: {score} punti",
    "game.chronology.details":
      "{correct} su {total} album posizionati correttamente",
    "game.chronology.year": "Anno: {year}",
    "game.chronology.drag.help":
      "Usa i tasti freccia ↑/↓ o trascina per riordinare",
    "game.submit.answer": "Verifica Risposta",
    "game.chronology.up": "Su",
    "game.chronology.down": "Giù",
    "game.chronology.position": "Posizione",
    "game.chronology.start": "Inizio",
    "game.chronology.end": "Fine",
    "common.back.to.top": "Torna in alto",
    "knowledge.articles.heading": "Articoli di Conoscenza",
    "knowledge.search.heading": "Cerca Articoli",
    "knowledge.search.description":
      "Gli articoli si filtreranno automaticamente mentre scrivi",
    "knowledge.search.reset": "Reimposta ricerca",
    "knowledge.search.reset.text": "Reimposta",
    "knowledge.no.results.help":
      "Prova termini di ricerca diversi o reimposta la tua ricerca",
    "knowledge.keyboard.instructions":
      "Utilizza i tasti freccia per navigare tra gli articoli. Premi Invio per aprire un articolo.",

    // Pagina del profilo
    "profile.title": "Il Mio Profilo",
    "profile.description":
      "Gestisci le tue informazioni personali e visualizza le tue statistiche di gioco",
    "profile.loading": "Caricamento dati del profilo...",
    "profile.error": "Errore durante il caricamento dei dati del profilo",
    "profile.auth.required":
      "Devi essere loggato per visualizzare il tuo profilo",
    "profile.user.info": "Informazioni Utente",
    "profile.user.since": "Membro dal",
    "profile.stats.title": "Statistiche di Gioco",
    "profile.stats.quiz": "Quiz",
    "profile.stats.chronology": "Cronologia",
    "profile.stats.total.score": "Punteggio Totale",
    "profile.stats.games.played": "Partite Giocate",
    "profile.stats.highest.score": "Punteggio Più Alto",
    "profile.recent.games": "Risultati Recenti",
    "profile.recent.games.empty": "Non hai ancora giocato nessuna partita",
    "profile.recent.game.mode": "Modalità di Gioco",
    "profile.recent.game.category": "Categoria",
    "profile.recent.game.difficulty": "Difficoltà",
    "profile.recent.game.score": "Punteggio",
    "profile.recent.game.date": "Data",
    "profile.nav.aria": "Navigazione al profilo utente",
    "profile.nav.link": "Vai al profilo",

    // Pagina dei punteggi migliori
    "highscores.title": "Punteggi migliori",
    "highscores.description":
      "Visualizza i punteggi migliori in diverse modalità di gioco e categorie",
    "highscores.loading": "Caricamento dei punteggi...",
    "highscores.error": "Errore durante il caricamento dei punteggi",
    "highscores.empty": "Nessun punteggio trovato",
    "highscores.filter.title": "Filtra punteggi",
    "highscores.filter.game.mode": "Modalità di gioco",
    "highscores.filter.category": "Categoria",
    "highscores.filter.all": "Tutti",
    "highscores.filter.search": "Cerca categorie...",
    "highscores.filter.no.results": "Nessuna categoria trovata",
    "highscores.table.title": "Punteggi migliori",
    "highscores.table.rank": "Posizione",
    "highscores.table.player": "Giocatore",
    "highscores.table.game.mode": "Modalità di gioco",
    "highscores.table.category": "Categoria",
    "highscores.table.score": "Punteggio",
    "highscores.table.date": "Data",
  },
  pt: {
    // Auth-Komponenten
    "auth.required.title": "Autenticação necessária",
    "auth.required.description": "Por favor, faça login para acessar esta área",
    "auth.login.title": "Entrar",
    "auth.register.title": "Registrar",
    "auth.toggle.login": "Mudar para login",
    "auth.toggle.register": "Mudar para registro",
    "auth.login.submit": "Entrar",
    "auth.register.submit": "Registrar",
    "auth.form.submit": "Enviar",
    "auth.form.loading": "Processando...",
    "auth.tabs.login": "Entrar",
    "auth.tabs.register": "Registrar",
    "auth.validation.processing": "Validando dados...",
    "auth.form.error.general": "Ocorreu um erro",
    "auth.form.success": "Sucesso!",
    "auth.form.email_required": "O endereço de e-mail é obrigatório",
    "auth.form.email_invalid_short": "Endereço de e-mail inválido",
    "auth.form.loading_text": "Carregando...",
    "auth.form.send_reset_link": "Enviar link de redefinição",
    "auth.form.password_required": "A senha é obrigatória",
    "auth.form.password_requirements":
      "A senha não atende a todos os requisitos",
    "auth.form.password_confirm_required":
      "A confirmação da senha é obrigatória",
    "auth.form.passwords_not_match": "As senhas não coincidem",
    "auth.password_reset.success_message":
      "Se existir uma conta com este e-mail, enviamos instruções para redefinir sua senha.",
    "auth.password_reset.error_message":
      "Ocorreu um erro. Por favor, tente novamente mais tarde.",
    "auth.password_reset.complete_success":
      "Senha redefinida com sucesso. Agora você pode entrar com sua nova senha.",
    "auth.password_reset.complete_error":
      "Falha na redefinição da senha. Verifique suas informações ou solicite um novo link de redefinição.",

    "auth.login.email": "E-mail",
    "auth.login.email.placeholder": "Digite seu e-mail",
    "auth.login.password": "Senha",
    "auth.login.password.placeholder": "Digite sua senha",
    "auth.login.remember": "Lembrar-me",
    "auth.login.forgot_password": "Esqueceu sua senha?",
    "auth.login.success": "Login realizado com sucesso",
    "auth.login.error": "Erro ao fazer login",

    "auth.register.name": "Nome completo",
    "auth.register.email": "E-mail",
    "auth.register.email.placeholder": "Digite seu e-mail",
    "auth.register.username": "Nome de usuário",
    "auth.register.username.placeholder": "Escolha um nome de usuário",
    "auth.register.password": "Senha",
    "auth.register.password.placeholder": "Crie uma senha segura",
    "auth.register.confirm_password": "Confirmar senha",
    "auth.register.password_confirm.placeholder": "Digite sua senha novamente",
    "auth.register.terms": "Eu aceito os termos e condições",
    "auth.register.success": "Registro realizado com sucesso",
    "auth.register.error": "Erro ao registrar",

    "auth.password_reset.title": "Redefinir senha",
    "auth.password_reset.submit": "Enviar link de redefinição",
    "auth.password_reset.email": "E-mail",
    "auth.password_reset.email.placeholder": "Digite seu e-mail cadastrado",
    "auth.password_reset.back_to_login": "Voltar para o login",
    "auth.password_reset.login": "Entrar",
    "auth.password_reset.success":
      "Um link de redefinição foi enviado para seu e-mail",
    "auth.password_reset.error": "Erro ao enviar o link de redefinição",
    "auth.password_reset.new_password": "Nova senha",
    "auth.password_reset.confirm_password": "Confirmar nova senha",
    "auth.password_reset.change_submit": "Alterar senha",

    "auth.email_verification.title": "Verificação de e-mail",
    "auth.email_verification.message":
      "Enviamos um link de verificação para seu e-mail",
    "auth.email_verification.check_inbox":
      "Por favor, verifique sua caixa de entrada",
    "auth.email_verification.resend": "Reenviar link de verificação",
    "auth.email_verification.success": "E-mail verificado com sucesso",
    "auth.email_verification.error": "Erro ao verificar o e-mail",

    // Passwortvalidierung
    "auth.password.requirements": "Requisitos da senha:",
    "auth.password.min_length": "A senha deve ter pelo menos 8 caracteres",
    "auth.password.require_number": "A senha deve conter pelo menos um número",
    "auth.password.require_uppercase":
      "A senha deve conter pelo menos uma letra maiúscula",
    "auth.password.require_lowercase":
      "A senha deve conter pelo menos uma letra minúscula",
    "auth.password.require_special":
      "A senha deve conter pelo menos um caractere especial",
    "auth.password.match": "As senhas devem corresponder",
    "auth.password.strength.weak": "Fraca",
    "auth.password.strength.medium": "Média",
    "auth.password.strength.strong": "Forte",

    // Formularvalidierung
    "auth.form.required": "Este campo é obrigatório",
    "auth.form.email_invalid": "Por favor, insira um e-mail válido",
    "auth.form.min_length":
      "Este campo deve ter pelo menos {length} caracteres",
    "auth.form.max_length":
      "Este campo não pode ter mais de {length} caracteres",
    "auth.form.invalid": "Este campo não é válido",

    // Zugänglichkeit
    "auth.accessibility.loading": "Carregando, por favor aguarde",
    "auth.accessibility.error": "Erro: {message}",
    "auth.accessibility.required_field": "Campo obrigatório",
    "auth.accessibility.toggle_password": "Mostrar/ocultar senha",
    "auth.accessibility.close_modal": "Fechar janela",

    // API-Fehlermeldungen
    "auth.api.network_error": "Erro de rede. Verifique sua conexão",
    "auth.api.server_error": "Erro do servidor. Tente novamente mais tarde",
    "auth.api.invalid_credentials": "Credenciais inválidas",
    "auth.api.account_exists": "Já existe uma conta com este e-mail",
    "auth.api.email_not_found": "Nenhuma conta encontrada com este e-mail",
    "auth.api.too_many_requests":
      "Muitas tentativas. Tente novamente mais tarde",

    // Service-Fehlermeldungen
    "auth.service.session_expired":
      "Sua sessão expirou. Por favor, faça login novamente",
    "auth.service.unauthorized": "Não autorizado. Por favor, faça login",
    "auth.service.account_locked":
      "Sua conta foi bloqueada. Entre em contato com o suporte",
    "auth.service.permission_denied": "Permissão negada para esta ação",
    "auth.service.invalid_credentials":
      "Credenciais inválidas. Verifique seu e-mail e senha.",
    "auth.service.too_many_attempts":
      "Muitas tentativas de login. Aguarde um momento antes de tentar novamente.",

    "nav.home": "Início",
    "nav.rules": "Regras",
    "category.no_image_available": "Nenhuma imagem disponível",
    "game.score": "Pontuação",
    "game.round": "Rodada",
    "game.joker": "Curinga 50:50",
    "difficulty.easy": "Fácil",
    "difficulty.medium": "Médio",
    "difficulty.hard": "Difícil",
    "category.difficulty.easy": "Fácil",
    "category.difficulty.medium": "Médio",
    "category.difficulty.hard": "Difícil",
    "game.select":
      "Descubra o fascinante mundo da música e teste seus conhecimentos em nossos quizzes musicais interativos. Escolha seu gênero favorito e comece sua jornada melodiosa!",
    "game.welcome": "Bem-vindo ao Melody Mind",
    "game.genre.list": "Seleção de Gênero",
    "game.search.label": "Buscar um gênero",
    "game.search.description":
      "A lista é filtrada automaticamente durante a digitação",
    "game.genre.play.label": "Jogar",
    "game.genre.image": "Imagem de capa para",
    "game.no.results": "Nenhum resultado encontrado",
    "game.not.available": "Não disponível",
    "category.selected": "selecionado!",
    "category.difficulty.heading": "Escolha seu nível de dificuldade",
    "category.difficulty.group": "Níveis de dificuldade",
    "category.difficulty.easy.label": "Iniciar jogo no modo fácil",
    "category.difficulty.medium.label": "Iniciar jogo no modo médio",
    "category.difficulty.hard.label": "Iniciar jogo no modo difícil",
    "category.image.alt": "Imagem de capa",
    "nav.menu.open": "Abrir menu",
    "nav.menu.close": "Fechar menu",
    "nav.menu.home": "Início",
    "nav.menu.rules": "Regras",
    "nav.menu.highscores": "Classificação",
    "nav.menu.profile": "Perfil",
    "nav.menu.logout": "Sair",
    "nav.skip.main": "Pular para o conteúdo principal",
    "game.end.title": "Fim de Jogo!",
    "game.end.motivation":
      "Desempenho fantástico! 🎉 Seu conhecimento musical é realmente impressionante. Desafie-se com outra rodada e torne-se uma verdadeira lenda da música! 🎵",
    "game.end.score": "Pontos obtidos:",
    "game.end.newgame": "Novo Jogo",
    "game.end.share": "Compartilhe seu sucesso!",
    "game.end.home": "Início",
    "game.feedback.resolution": "Resolução",
    "game.feedback.media.section": "Seção de Mídia",
    "game.feedback.audio.preview": "Prévia da Música",
    "game.feedback.subtitles": "Legendas",
    "game.feedback.audio.unsupported":
      "Seu navegador não suporta reprodução de áudio.",
    "game.feedback.streaming.links": "Links de Streaming de Música",
    "game.feedback.listen.spotify": "Ouvir no Spotify",
    "game.feedback.listen.deezer": "Ouvir no Deezer",
    "game.feedback.listen.apple": "Ouvir no Apple Music",
    "game.feedback.next.round": "Próxima Rodada",
    "game.current.round": "Rodada",
    "game.current.round.label": "Número da rodada atual",
    "game.joker.options": "Opções do Curinga",
    "game.joker.use": "Usar Curinga 50:50",
    "game.joker.description": "Remove duas opções de resposta incorretas",
    "loading.content": "Carregando conteúdo...",
    "share.title": "Compartilhe seu sucesso!",
    "share.buttons.group.label": "Opções de compartilhamento em redes sociais",
    "share.facebook": "Compartilhar no Facebook",
    "share.whatsapp": "Compartilhar no WhatsApp",
    "share.native": "Compartilhar com...",
    "share.native.label": "Compartilhar",
    "share.twitter": "Compartilhar no X/Twitter",
    "share.email": "Compartilhar por Email",
    "share.email.label": "Email",
    "share.copy":
      "Copiar texto de compartilhamento para a área de transferência",
    "share.copy.label": "Copiar texto",
    "error.default": "Ocorreu um erro",
    "error.close": "Fechar mensagem de erro",
    "coins.collected": "Moedas coletadas",
    "language.picker.label": "Seleção de idioma",
    "language.change": "Mudar idioma do site",
    "language.select.label": "Escolha seu idioma preferido",
    "language.de": "Alemão",
    "language.en": "Inglês",
    "language.es": "Espanhol",
    "language.fr": "Francês",
    "language.it": "Italiano",
    "language.pt": "Português",
    "language.da": "Dinamarquês",
    "language.nl": "Holandês",
    "language.sv": "Sueco",
    "language.fi": "Finlandês",
    "language.de.label": "Ver site em alemão",
    "language.en.label": "Ver site em inglês",
    "language.es.label": "Ver site em espanhol",
    "language.fr.label": "Ver site em francês",
    "language.it.label": "Ver site em italiano",
    "language.pt.label": "Ver site em português",
    "language.da.label": "Ver site em dinamarquês",
    "language.nl.label": "Ver site em holandês",
    "language.sv.label": "Ver site em sueco",
    "language.fi.label": "Ver site em finlandês",
    "playlist.item.unavailable": "Este conteúdo ainda não está disponível",
    "playlist.item.status": "Estado",
    "playlist.item.coming.soon": "Em breve",
    "game.area.label": "Área de jogo",
    "game.options.label": "Opções de resposta",
    "game.answer.correct": "Correto! {points} pontos + {bonus} pontos bônus",
    "game.answer.wrong": "Errado! A resposta correta era: {answer}",
    "error.invalid.question": "Pergunta inválida ou sem opções disponíveis",
    "error.no.initial.question": "Nenhuma pergunta inicial válida encontrada",
    "error.no.albums.found":
      "Nenhum álbum encontrado para a categoria {category}",
    "meta.keywords":
      "Quiz Musical, Jogo de Música, Quiz de Canções, Quiz de Artistas, Quiz Musical Online, Trivia Musical, Melody Mind, Jogo de Adivinhação Musical",
    "knowledge.title": "Banco de Dados de Conhecimento Musical",
    "knowledge.intro":
      "Mergulhe no fascinante mundo da história da música. Aqui você encontrará artigos interessantes sobre diferentes épocas musicais, gêneros e sua evolução. Descubra fatos interessantes e amplie seu conhecimento musical.",
    "knowledge.search.label": "Pesquisar artigos",
    "knowledge.search.placeholder": "Pesquisar...",
    "knowledge.filter.all": "Todas as Palavras-chave",
    "knowledge.no.results":
      "Nenhum artigo encontrado. Tente termos de pesquisa diferentes.",
    "game.remaining": "restante",
    "game.default.headline": "Jogo",
    "popup.score": "Pontuação: {score}",
    "popup.golden.lp.score": "Pontos obtidos: {score}",
    "nav.donate.heading": "Apoie-nos",
    "nav.donate.paypal": "Doar via PayPal",
    "nav.donate.coffee": "Compre-me um café",
    "nav.title": "Navegação",
    "nav.menu.text": "Menu",
    "game.categories.empty.headline": "Nenhum gênero encontrado",
    "game.categories.empty.text":
      "Infelizmente, nenhuma categoria foi encontrada. Por favor, tente novamente mais tarde.",
    "game.categories.no.playable.headline": "Nenhum gênero jogável",
    "game.categories.no.playable.text":
      "Atualmente não há categorias jogáveis. Por favor, volte mais tarde.",
    "knowledge.reading.time": "min de leitura",
    "knowledge.breadcrumb.label": "Navegação de trilha",
    "knowledge.listen.heading": "Ouça Música Relacionada",
    "knowledge.back.to.list": "Voltar para Artigos",
    "knowledge.interact.heading": "Ouvir & Jogar",
    "knowledge.play.heading": "Jogar este Gênero",
    "knowledge.play.description":
      "Teste seus conhecimentos sobre este gênero musical em nosso quiz interativo!",
    "knowledge.play.category": "Iniciar Quiz Musical",
    "category.play": "Jogar",
    "play.cover.puzzle": "Jogar Quebra-cabeça de Capas",
    "play.cover.puzzle.description":
      "No Quebra-cabeça de Capas, você precisa reconhecer capas de álbuns à medida que são reveladas gradualmente. Quanto mais rápido você identificar o álbum correto, mais pontos ganhará. Teste sua memória visual para capas de música!",
    "podcast.page.title": "Podcasts de Música | Melody Mind",
    "podcast.page.heading": "Podcasts de Música Cativantes",
    "podcast.page.description":
      "Mergulhe no mundo da música com nossos podcasts envolventes. Descubra histórias emocionantes, contextos fascinantes e momentos definidores de várias eras musicais - perfeito para quem quer não apenas ouvir música, mas realmente entendê-la. Nossos podcasts são lançados a cada 2 semanas e estão disponíveis exclusivamente em alemão e inglês.",
    "podcast.search.label": "Pesquisar podcasts",
    "podcast.search.placeholder": "Procurar histórias fascinantes de música...",
    "podcast.search.status.all": "Todos os podcasts são exibidos",
    "podcast.search.status.one": "1 podcast encontrado",
    "podcast.search.status.multiple": "{count} podcasts encontrados",
    "podcast.no.results":
      "Nenhum podcast correspondente encontrado. Tente um termo de pesquisa diferente.",
    "podcast.duration.error": "Duração não disponível",
    "podcast.play": "Reproduzir",
    "podcast.intro.title": "Apresentando o Astropod",
    "podcast.intro.description":
      "Astropod é uma solução de podcast sem servidor gratuita e de código aberto.",
    "podcast.deploy.title": "Implantando seu podcast sem servidor em 2 minutos",
    "podcast.deploy.description":
      "Aprenda como implantar rapidamente seu podcast.",
    "podcast.auth.title":
      "Configurando autenticação de usuário e acessando o painel",
    "podcast.auth.description": "Habilite a autenticação e acesse o painel.",

    // Achievement Categories
    "achievements.category.games_played": "Jogos Jogados",
    "achievements.category.perfect_games": "Jogos Perfeitos",
    "achievements.category.total_score": "Pontuação Total",
    "achievements.category.daily_streak": "Sequência Diária",
    "achievements.category.daily_games": "Jogos Diários",

    // Achievement System
    "achievements.title": "Conquistas",
    "achievements.description":
      "Descubra e desbloqueie conquistas para acompanhar seu progresso",
    "achievements.loading": "Carregando conquistas...",
    "achievements.error": "Erro ao carregar conquistas",
    "achievements.empty": "Nenhuma conquista encontrada",
    "achievements.category.bronze": "Bronze",
    "achievements.category.silver": "Prata",
    "achievements.category.gold": "Ouro",
    "achievements.category.platinum": "Platina",
    "achievements.category.diamond": "Diamante",
    "achievements.category.time": "Tempo",
    "achievements.status.locked": "Bloqueada",
    "achievements.status.in_progress": "Em Progresso",
    "achievements.status.unlocked": "Desbloqueada",
    "achievements.progress": "Progresso: {progress}%",
    "achievements.unlocked_at": "Desbloqueada em {date}",
    "achievements.points": "Pontos: {points}",
    "achievements.rarity": "Raridade: {percentage}%",
    "achievements.notification.unlocked": "Conquista desbloqueada!",
    "achievements.notification.progress": "Progresso da conquista atualizado!",
    "achievements.nav.link": "Conquistas",
    "achievements.nav.aria": "Navegar para conquistas",
    "achievements.badge.new": "Novas conquistas disponíveis",
    "achievements.filter.title": "Filtrar Conquistas",
    "achievements.filter.status": "Status",
    "achievements.filter.status.aria": "Filtrar conquistas por status",
    "achievements.filter.category": "Categoria",
    "achievements.filter.category.aria": "Filtrar conquistas por categoria",
    "achievements.filter.all": "Todas",
    "achievements.filter.all_categories": "Todas as Categorias",
    "achievements.summary.title": "Progresso das Conquistas",
    "achievements.summary.total": "Total",
    "achievements.summary.unlocked": "Desbloqueadas",
    "achievements.summary.progress": "Progresso",
    "achievements.notification.close": "Fechar notificação",
    "achievements.rarity.tooltip":
      "Porcentagem de jogadores que desbloquearam esta conquista",

    // Game Counter Achievements
    "achievements.games_played_1": "Iniciante: 1 Jogo",
    "achievements.games_played_1.description":
      "Jogue seu primeiro jogo em qualquer modo",
    "achievements.games_played_5": "Iniciante: 5 Jogos",
    "achievements.games_played_5.description": "Jogue 5 jogos em qualquer modo",
    "achievements.games_played_10": "Iniciante: 10 Jogos",
    "achievements.games_played_10.description":
      "Jogue 10 jogos em qualquer modo",
    "achievements.games_played_25": "Amador: 25 Jogos",
    "achievements.games_played_25.description":
      "Jogue 25 jogos em qualquer modo",
    "achievements.games_played_50": "Amador: 50 Jogos",
    "achievements.games_played_50.description":
      "Jogue 50 jogos em qualquer modo",
    "achievements.games_played_75": "Amador: 75 Jogos",
    "achievements.games_played_75.description":
      "Jogue 75 jogos em qualquer modo",
    "achievements.games_played_100": "Avançado: 100 Jogos",
    "achievements.games_played_100.description":
      "Jogue 100 jogos em qualquer modo",
    "achievements.games_played_150": "Avançado: 150 Jogos",
    "achievements.games_played_150.description":
      "Jogue 150 jogos em qualquer modo",
    "achievements.games_played_200": "Avançado: 200 Jogos",
    "achievements.games_played_200.description":
      "Jogue 200 jogos em qualquer modo",
    "achievements.games_played_300": "Especialista: 300 Jogos",
    "achievements.games_played_300.description":
      "Jogue 300 jogos em qualquer modo",
    "achievements.games_played_400": "Especialista: 400 Jogos",
    "achievements.games_played_400.description":
      "Jogue 400 jogos em qualquer modo",
    "achievements.games_played_500": "Especialista: 500 Jogos",
    "achievements.games_played_500.description":
      "Jogue 500 jogos em qualquer modo",
    "achievements.games_played_750": "Mestre: 750 Jogos",
    "achievements.games_played_750.description":
      "Jogue 750 jogos em qualquer modo",
    "achievements.games_played_1000": "Mestre: 1000 Jogos",
    "achievements.games_played_1000.description":
      "Jogue 1000 jogos em qualquer modo",
    "achievements.games_played_1500": "Mestre: 1500 Jogos",
    "achievements.games_played_1500.description":
      "Jogue 1500 jogos em qualquer modo",
    "achievements.games_played_2000": "Mestre: 2000 Jogos",
    "achievements.games_played_2000.description":
      "Jogue 2000 jogos em qualquer modo",
    "achievements.games_played_2500": "Lenda: 2500 Jogos",
    "achievements.games_played_2500.description":
      "Jogue 2500 jogos em qualquer modo",
    "achievements.games_played_3000": "Lenda: 3000 Jogos",
    "achievements.games_played_3000.description":
      "Jogue 3000 jogos em qualquer modo",
    "achievements.games_played_4000": "Lenda: 4000 Jogos",
    "achievements.games_played_4000.description":
      "Jogue 4000 jogos em qualquer modo",
    "achievements.games_played_5000": "Lenda: 5000 Jogos",
    "achievements.games_played_5000.description":
      "Jogue 5000 jogos em qualquer modo",

    // Perfect Games Achievements
    "achievements.perfect_games_1": "Golpe de Sorte: 1 Jogo Perfeito",
    "achievements.perfect_games_1.description":
      "Alcance a pontuação máxima em 1 jogo",
    "achievements.perfect_games_2": "Golpe de Sorte: 2 Jogos Perfeitos",
    "achievements.perfect_games_2.description":
      "Alcance a pontuação máxima em 2 jogos",
    "achievements.perfect_games_3": "Golpe de Sorte: 3 Jogos Perfeitos",
    "achievements.perfect_games_3.description":
      "Alcance a pontuação máxima em 3 jogos",
    "achievements.perfect_games_5": "Precisão: 5 Jogos Perfeitos",
    "achievements.perfect_games_5.description":
      "Alcance a pontuação máxima em 5 jogos",
    "achievements.perfect_games_7": "Precisão: 7 Jogos Perfeitos",
    "achievements.perfect_games_7.description":
      "Alcance a pontuação máxima em 7 jogos",
    "achievements.perfect_games_10": "Precisão: 10 Jogos Perfeitos",
    "achievements.perfect_games_10.description":
      "Alcance a pontuação máxima em 10 jogos",
    "achievements.perfect_games_15": "Experiência: 15 Jogos Perfeitos",
    "achievements.perfect_games_15.description":
      "Alcance a pontuação máxima em 15 jogos",
    "achievements.perfect_games_20": "Experiência: 20 Jogos Perfeitos",
    "achievements.perfect_games_20.description":
      "Alcance a pontuação máxima em 20 jogos",
    "achievements.perfect_games_25": "Experiência: 25 Jogos Perfeitos",
    "achievements.perfect_games_25.description":
      "Alcance a pontuação máxima em 25 jogos",
    "achievements.perfect_games_30": "Maestria: 30 Jogos Perfeitos",
    "achievements.perfect_games_30.description":
      "Alcance a pontuação máxima em 30 jogos",
    "achievements.perfect_games_40": "Maestria: 40 Jogos Perfeitos",
    "achievements.perfect_games_40.description":
      "Alcance a pontuação máxima em 40 jogos",
    "achievements.perfect_games_50": "Maestria: 50 Jogos Perfeitos",
    "achievements.perfect_games_50.description":
      "Alcance a pontuação máxima em 50 jogos",
    "achievements.perfect_games_75": "Perfeição: 75 Jogos Perfeitos",
    "achievements.perfect_games_75.description":
      "Alcance a pontuação máxima em 75 jogos",
    "achievements.perfect_games_100": "Perfeição: 100 Jogos Perfeitos",
    "achievements.perfect_games_100.description":
      "Alcance a pontuação máxima em 100 jogos",
    "achievements.perfect_games_150": "Perfeição: 150 Jogos Perfeitos",
    "achievements.perfect_games_150.description":
      "Alcance a pontuação máxima em 150 jogos",
    "achievements.perfect_games_200": "Lenda: 200 Jogos Perfeitos",
    "achievements.perfect_games_200.description":
      "Alcance a pontuação máxima em 200 jogos",
    "achievements.perfect_games_300": "Lenda: 300 Jogos Perfeitos",
    "achievements.perfect_games_300.description":
      "Alcance a pontuação máxima em 300 jogos",
    "achievements.perfect_games_400": "Lenda: 400 Jogos Perfeitos",
    "achievements.perfect_games_400.description":
      "Alcance a pontuação máxima em 400 jogos",
    "achievements.perfect_games_500": "Lenda: 500 Jogos Perfeitos",
    "achievements.perfect_games_500.description":
      "Alcance a pontuação máxima em 500 jogos",

    // Score Achievements
    "achievements.total_score_100": "Colecionador: 100 Pontos",
    "achievements.total_score_100.description":
      "Acumule 100 pontos em todos os jogos",
    "achievements.total_score_250": "Colecionador: 250 Pontos",
    "achievements.total_score_250.description":
      "Acumule 250 pontos em todos os jogos",
    "achievements.total_score_500": "Colecionador: 500 Pontos",
    "achievements.total_score_500.description":
      "Acumule 500 pontos em todos os jogos",
    "achievements.total_score_1000": "Caçador de Pontos: 1.000 Pontos",
    "achievements.total_score_1000.description":
      "Acumule 1.000 pontos em todos os jogos",
    "achievements.total_score_2500": "Caçador de Pontos: 2.500 Pontos",
    "achievements.total_score_2500.description":
      "Acumule 2.500 pontos em todos os jogos",
    "achievements.total_score_5000": "Caçador de Pontos: 5.000 Pontos",
    "achievements.total_score_5000.description":
      "Acumule 5.000 pontos em todos os jogos",
    "achievements.total_score_7500": "Ímã de Pontos: 7.500 Pontos",
    "achievements.total_score_7500.description":
      "Acumule 7.500 pontos em todos os jogos",
    "achievements.total_score_10000": "Ímã de Pontos: 10.000 Pontos",
    "achievements.total_score_10000.description":
      "Acumule 10.000 pontos em todos os jogos",
    "achievements.total_score_15000": "Ímã de Pontos: 15.000 Pontos",
    "achievements.total_score_15000.description":
      "Acumule 15.000 pontos em todos os jogos",
    "achievements.total_score_20000": "Mestre de Pontos: 20.000 Pontos",
    "achievements.total_score_20000.description":
      "Acumule 20.000 pontos em todos os jogos",
    "achievements.total_score_30000": "Mestre de Pontos: 30.000 Pontos",
    "achievements.total_score_30000.description":
      "Acumule 30.000 pontos em todos os jogos",
    "achievements.total_score_50000": "Mestre de Pontos: 50.000 Pontos",
    "achievements.total_score_50000.description":
      "Acumule 50.000 pontos em todos os jogos",
    "achievements.total_score_75000": "Elite: 75.000 Pontos",
    "achievements.total_score_75000.description":
      "Acumule 75.000 pontos em todos os jogos",
    "achievements.total_score_100000": "Elite: 100.000 Pontos",
    "achievements.total_score_100000.description":
      "Acumule 100.000 pontos em todos os jogos",
    "achievements.total_score_150000": "Elite: 150.000 Pontos",
    "achievements.total_score_150000.description":
      "Acumule 150.000 pontos em todos os jogos",
    "achievements.total_score_200000": "Lenda: 200.000 Pontos",
    "achievements.total_score_200000.description":
      "Acumule 200.000 pontos em todos os jogos",
    "achievements.total_score_300000": "Lenda: 300.000 Pontos",
    "achievements.total_score_300000.description":
      "Acumule 300.000 pontos em todos os jogos",
    "achievements.total_score_400000": "Lenda: 400.000 Pontos",
    "achievements.total_score_400000.description":
      "Acumule 400.000 pontos em todos os jogos",
    "achievements.total_score_500000": "Lenda: 500.000 Pontos",
    "achievements.total_score_500000.description":
      "Acumule 500.000 pontos em todos os jogos",

    // Daily Streak Achievements
    "achievements.daily_streak_1": "Jogador Diário",
    "achievements.daily_streak_1.description": "Jogue por 1 dia consecutivo",
    "achievements.daily_streak_3": "Entusiasta Musical",
    "achievements.daily_streak_3.description": "Jogue por 3 dias consecutivos",
    "achievements.daily_streak_5": "Mestre da Melodia",
    "achievements.daily_streak_5.description": "Jogue por 5 dias consecutivos",
    "achievements.daily_streak_7": "Semana Perfeita",
    "achievements.daily_streak_7.description": "Jogue por 7 dias consecutivos",
    "achievements.daily_streak_14": "Veterano Musical",
    "achievements.daily_streak_14.description":
      "Jogue por 14 dias consecutivos",
    "achievements.daily_streak_30": "Lenda da Melodia",
    "achievements.daily_streak_30.description":
      "Jogue por 30 dias consecutivos",

    // Daily Games Achievements
    "achievements.daily_games_3": "Aquecimento",
    "achievements.daily_games_3.description": "Jogue 3 jogos em um único dia",
    "achievements.daily_games_5": "Sessão Musical",
    "achievements.daily_games_5.description": "Jogue 5 jogos em um único dia",
    "achievements.daily_games_10": "Maratona Musical",
    "achievements.daily_games_10.description": "Jogue 10 jogos em um único dia",
    "achievements.daily_games_20": "Maratona de Melodia",
    "achievements.daily_games_20.description": "Jogue 20 jogos em um único dia",
    "achievements.daily_games_30": "Ultra Musical",
    "achievements.daily_games_30.description": "Jogue 30 jogos em um único dia",
    "achievements.daily_games_50": "Loucura Melódica",
    "achievements.daily_games_50.description": "Jogue 50 jogos em um único dia",

    // Achievement error messages
    "errors.achievements.fetch": "Erro ao buscar conquistas",
    "errors.achievements.update": "Erro ao atualizar o progresso da conquista",
    "errors.achievements.unlock": "Erro ao desbloquear a conquista",
    "errors.achievements.check": "Erro ao verificar conquistas",
    "podcast.config.title": "Configurando seu Podcast Astropod",
    "podcast.config.description": "Aprenda como configurar seu podcast.",
    "podcast.publish.title": "Publicando seu primeiro episódio",
    "podcast.publish.description":
      "Publique seu primeiro episódio com facilidade.",
    "podcast.conclusion.title": "Conclusão",
    "podcast.conclusion.description": "Resumo e próximos passos.",
    "podcast.listen.on": "Ouça em",
    "podcast.language.availability":
      "Nossos podcasts estão disponíveis exclusivamente em alemão e inglês.",
    "podcast.listen.heading": "Ouça nossos Podcasts",
    "login.welcome": "Bem-vindo ao Melody Mind!",
    "login.description":
      "Embarque em uma jornada musical através do tempo! Teste seus conhecimentos em quizzes emocionantes, explore gêneros musicais fascinantes e mergulhe em nossos podcasts cativantes. Mostre suas habilidades, acumule pontos e torne-se uma verdadeira lenda da música!",
    "index.continue": "Vamos lá!",
    "index.start.game.label": "Inicie sua jornada musical",
    "index.welcome.footnote":
      "Criado por amantes da música para amantes da música. Aproveite!",
    "accessibility.wcag": "Esta aplicação visa cumprir com WCAG AAA.",
    "game.instructions.title": "Instruções do Jogo",
    "game.instructions.puzzle":
      "Tente adivinhar o álbum enquanto a capa é revelada gradualmente. Quanto mais rápido você adivinhar corretamente, mais pontos ganhará.",
    "game.time.remaining": "Tempo restante:",
    "game.puzzle.label": "Quebra-cabeça de Capa de Álbum",
    "game.puzzle.loading": "Carregando quebra-cabeça...",
    "game.options.legend": "Escolha o álbum correto",
    "game.next.round": "Iniciar próxima rodada",
    "game.puzzle.revealed": "{percent}% da capa do álbum foi revelada",
    "game.option.choose": "Escolher",
    "game.options.available": "Opções de resposta agora disponíveis",
    "game.time.remaining.seconds": "{seconds} segundos restantes",
    "game.time.up": "Tempo esgotado! O álbum correto era:",
    "game.correct.answer": "Resposta correta",
    "game.slower.speed": "Jogo mais lento",
    "game.normal.speed": "Velocidade normal",
    "game.skip.to.answers": "Pular para opções de resposta",
    "game.next": "Próximo",
    "aria.pressed": "Pressionado",
    "aria.expanded": "Expandido",
    "aria.shortcuts.panel": "Painel de atalhos de teclado",
    "aria.shortcuts.list": "Lista de atalhos de teclado disponíveis",
    "knowledge.empty": "Nenhum artigo disponível nesta categoria",
    "playlist.page.title": "Listas de Reprodução | Melody Mind",
    "playlist.page.heading": "Descubra nossas Listas de Reprodução",
    "playlist.page.description":
      "Mergulhe em listas de reprodução cuidadosamente selecionadas de diferentes épocas e gêneros. Perfeitas para descobrir nova música ou revisitar seus clássicos favoritos.",
    "playlist.search.label": "Pesquisar listas de reprodução",
    "playlist.search.placeholder": "Pesquisar por era musical ou estilo...",
    "playlist.filter.all": "Todas as Épocas",
    "playlist.no.results":
      "Nenhuma lista de reprodução correspondente encontrada. Tente um termo de pesquisa diferente.",
    "playlist.listen.on": "Ouça em",
    "playlist.listen.spotify": "Ouça no Spotify",
    "playlist.listen.deezer": "Ouça no Deezer",
    "playlist.listen.apple": "Ouça no Apple Music",
    "playlist.decade.filter": "Filtrar por década",
    "footer.rights": "Todos os direitos reservados",
    "footer.donate": "Doar",
    "game.chronology.title": "Cronologia Musical",
    "game.chronology.description":
      "Ordene estes álbuns por seu ano de lançamento (mais antigos primeiro)",
    "game.chronology.area.label": "Área do Jogo de Cronologia",
    "game.chronology.result": "Resultado",
    "game.chronology.correct": "Correto",
    "game.chronology.wrong": "Deveria estar na posição {position}",
    "game.chronology.score": "Resultado: {score} pontos",
    "game.chronology.details":
      "{correct} de {total} álbuns corretamente posicionados",
    "game.chronology.year": "Ano: {year}",
    "game.chronology.drag.help":
      "Use as teclas de seta ↑/↓ ou arraste e solte para ordenar",
    "game.submit.answer": "Verificar Resposta",
    "game.chronology.up": "Para cima",
    "game.chronology.down": "Para baixo",
    "game.chronology.position": "Posição",
    "game.chronology.start": "Início",
    "game.chronology.end": "Fim",
    "common.back.to.top": "Voltar ao topo",
    "knowledge.articles.heading": "Artigos de Conhecimento",
    "knowledge.search.heading": "Pesquisar Artigos",
    "knowledge.search.description":
      "Os artigos serão filtrados automaticamente enquanto você digita",
    "knowledge.search.reset": "Redefinir pesquisa",
    "knowledge.search.reset.text": "Redefinir",
    "knowledge.no.results.help":
      "Tente termos de pesquisa diferentes ou redefina sua pesquisa",
    "knowledge.keyboard.instructions":
      "Use as teclas de seta para navegar entre os artigos. Pressione Enter para abrir um artigo.",

    // Página de perfil
    "profile.title": "Meu Perfil",
    "profile.description":
      "Gerencie suas informações pessoais e veja suas estatísticas de jogo",
    "profile.loading": "Carregando dados do perfil...",
    "profile.error": "Erro ao carregar dados do perfil",
    "profile.auth.required": "Você precisa estar logado para ver seu perfil",
    "profile.user.info": "Informações do Usuário",
    "profile.user.since": "Membro desde",
    "profile.stats.title": "Estatísticas de Jogo",
    "profile.stats.quiz": "Quiz",
    "profile.stats.chronology": "Cronologia",
    "profile.stats.total.score": "Pontuação Total",
    "profile.stats.games.played": "Jogos Jogados",
    "profile.stats.highest.score": "Maior Pontuação",
    "profile.recent.games": "Resultados Recentes",
    "profile.recent.games.empty": "Você ainda não jogou nenhum jogo",
    "profile.recent.game.mode": "Modo de Jogo",
    "profile.recent.game.category": "Categoria",
    "profile.recent.game.difficulty": "Dificuldade",
    "profile.recent.game.score": "Pontuação",
    "profile.recent.game.date": "Data",
    "profile.nav.aria": "Navegação para o perfil do usuário",
    "profile.nav.link": "Ir para o perfil",

    // Página de pontuações
    "highscores.title": "Melhores pontuações",
    "highscores.description":
      "Veja as melhores pontuações em diferentes modos de jogo e categorias",
    "highscores.loading": "Carregando pontuações...",
    "highscores.error": "Erro ao carregar pontuações",
    "highscores.empty": "Nenhuma pontuação encontrada",
    "highscores.filter.title": "Filtrar pontuações",
    "highscores.filter.game.mode": "Modo de jogo",
    "highscores.filter.category": "Categoria",
    "highscores.filter.all": "Todos",
    "highscores.filter.search": "Pesquisar categorias...",
    "highscores.filter.no.results": "Nenhuma categoria encontrada",
    "highscores.table.title": "Melhores pontuações",
    "highscores.table.rank": "Posição",
    "highscores.table.player": "Jogador",
    "highscores.table.game.mode": "Modo de jogo",
    "highscores.table.category": "Categoria",
    "highscores.table.score": "Pontuação",
    "highscores.table.date": "Data",
  },
  da: {
    // Auth-Komponenten

    // Achievement Categories
    "achievements.category.games_played": "Spil spillet",
    "achievements.category.perfect_games": "Perfekte spil",
    "achievements.category.total_score": "Total score",
    "achievements.category.daily_streak": "Daglig streak",
    "achievements.category.daily_games": "Daglige spil",

    // Achievement System
    "achievements.title": "Præstationer",
    "achievements.description":
      "Opdag og lås op for præstationer for at følge din fremgang",
    "achievements.loading": "Indlæser præstationer...",
    "achievements.error": "Fejl ved indlæsning af præstationer",
    "achievements.empty": "Ingen præstationer fundet",
    "achievements.category.bronze": "Bronze",
    "achievements.category.silver": "Sølv",
    "achievements.category.gold": "Guld",
    "achievements.category.platinum": "Platin",
    "achievements.category.diamond": "Diamant",
    "achievements.category.time": "Tid",
    "achievements.status.locked": "Låst",
    "achievements.status.in_progress": "I gang",
    "achievements.status.unlocked": "Oplåst",
    "achievements.progress": "Fremgang: {progress}%",
    "achievements.unlocked_at": "Oplåst den {date}",
    "achievements.points": "Point: {points}",
    "achievements.rarity": "Sjældenhed: {percentage}%",
    "achievements.notification.unlocked": "Præstation oplåst!",
    "achievements.notification.progress": "Præstationsfremgang opdateret!",
    "achievements.nav.link": "Præstationer",
    "achievements.nav.aria": "Naviger til præstationer",
    "achievements.badge.new": "Nye præstationer tilgængelige",
    "achievements.filter.title": "Filtrer præstationer",
    "achievements.filter.status": "Status",
    "achievements.filter.status.aria": "Filtrer præstationer efter status",
    "achievements.filter.category": "Kategori",
    "achievements.filter.category.aria": "Filtrer præstationer efter kategori",
    "achievements.filter.all": "Alle",
    "achievements.filter.all_categories": "Alle kategorier",
    "achievements.summary.title": "Præstationsfremgang",
    "achievements.summary.total": "Total",
    "achievements.summary.unlocked": "Oplåst",
    "achievements.summary.progress": "Fremgang",
    "achievements.notification.close": "Luk notifikation",
    "achievements.rarity.tooltip":
      "Procentdel af spillere, der har oplåst denne præstation",

    // Game Counter Achievements
    "achievements.games_played_1": "Begynder: 1 Spil",
    "achievements.games_played_1.description":
      "Spil dit første spil i enhver tilstand",
    "achievements.games_played_5": "Begynder: 5 Spil",
    "achievements.games_played_5.description": "Spil 5 spil i enhver tilstand",
    "achievements.games_played_10": "Begynder: 10 Spil",
    "achievements.games_played_10.description":
      "Spil 10 spil i enhver tilstand",
    "achievements.games_played_25": "Amatør: 25 Spil",
    "achievements.games_played_25.description":
      "Spil 25 spil i enhver tilstand",
    "achievements.games_played_50": "Amatør: 50 Spil",
    "achievements.games_played_50.description":
      "Spil 50 spil i enhver tilstand",
    "achievements.games_played_75": "Amatør: 75 Spil",
    "achievements.games_played_75.description":
      "Spil 75 spil i enhver tilstand",
    "achievements.games_played_100": "Avanceret: 100 Spil",
    "achievements.games_played_100.description":
      "Spil 100 spil i enhver tilstand",
    "achievements.games_played_150": "Avanceret: 150 Spil",
    "achievements.games_played_150.description":
      "Spil 150 spil i enhver tilstand",
    "achievements.games_played_200": "Avanceret: 200 Spil",
    "achievements.games_played_200.description":
      "Spil 200 spil i enhver tilstand",
    "achievements.games_played_300": "Ekspert: 300 Spil",
    "achievements.games_played_300.description":
      "Spil 300 spil i enhver tilstand",
    "achievements.games_played_400": "Ekspert: 400 Spil",
    "achievements.games_played_400.description":
      "Spil 400 spil i enhver tilstand",
    "achievements.games_played_500": "Ekspert: 500 Spil",
    "achievements.games_played_500.description":
      "Spil 500 spil i enhver tilstand",
    "achievements.games_played_750": "Mester: 750 Spil",
    "achievements.games_played_750.description":
      "Spil 750 spil i enhver tilstand",
    "achievements.games_played_1000": "Mester: 1000 Spil",
    "achievements.games_played_1000.description":
      "Spil 1000 spil i enhver tilstand",
    "achievements.games_played_1500": "Mester: 1500 Spil",
    "achievements.games_played_1500.description":
      "Spil 1500 spil i enhver tilstand",
    "achievements.games_played_2000": "Mester: 2000 Spil",
    "achievements.games_played_2000.description":
      "Spil 2000 spil i enhver tilstand",
    "achievements.games_played_2500": "Legende: 2500 Spil",
    "achievements.games_played_2500.description":
      "Spil 2500 spil i enhver tilstand",
    "achievements.games_played_3000": "Legende: 3000 Spil",
    "achievements.games_played_3000.description":
      "Spil 3000 spil i enhver tilstand",
    "achievements.games_played_4000": "Legende: 4000 Spil",
    "achievements.games_played_4000.description":
      "Spil 4000 spil i enhver tilstand",
    "achievements.games_played_5000": "Legende: 5000 Spil",
    "achievements.games_played_5000.description":
      "Spil 5000 spil i enhver tilstand",

    // Perfect Games Achievements
    "achievements.perfect_games_1": "Heldig: 1 Perfekt Spil",
    "achievements.perfect_games_1.description": "Opnå maksimum score i 1 spil",
    "achievements.perfect_games_2": "Heldig: 2 Perfekte Spil",
    "achievements.perfect_games_2.description": "Opnå maksimum score i 2 spil",
    "achievements.perfect_games_3": "Heldig: 3 Perfekte Spil",
    "achievements.perfect_games_3.description": "Opnå maksimum score i 3 spil",
    "achievements.perfect_games_5": "Præcision: 5 Perfekte Spil",
    "achievements.perfect_games_5.description": "Opnå maksimum score i 5 spil",
    "achievements.perfect_games_7": "Præcision: 7 Perfekte Spil",
    "achievements.perfect_games_7.description": "Opnå maksimum score i 7 spil",
    "achievements.perfect_games_10": "Præcision: 10 Perfekte Spil",
    "achievements.perfect_games_10.description":
      "Opnå maksimum score i 10 spil",
    "achievements.perfect_games_15": "Erfaring: 15 Perfekte Spil",
    "achievements.perfect_games_15.description":
      "Opnå maksimum score i 15 spil",
    "achievements.perfect_games_20": "Erfaring: 20 Perfekte Spil",
    "achievements.perfect_games_20.description":
      "Opnå maksimum score i 20 spil",
    "achievements.perfect_games_25": "Erfaring: 25 Perfekte Spil",
    "achievements.perfect_games_25.description":
      "Opnå maksimum score i 25 spil",
    "achievements.perfect_games_30": "Mesterskab: 30 Perfekte Spil",
    "achievements.perfect_games_30.description":
      "Opnå maksimum score i 30 spil",
    "achievements.perfect_games_40": "Mesterskab: 40 Perfekte Spil",
    "achievements.perfect_games_40.description":
      "Opnå maksimum score i 40 spil",
    "achievements.perfect_games_50": "Mesterskab: 50 Perfekte Spil",
    "achievements.perfect_games_50.description":
      "Opnå maksimum score i 50 spil",
    "achievements.perfect_games_75": "Perfektion: 75 Perfekte Spil",
    "achievements.perfect_games_75.description":
      "Opnå maksimum score i 75 spil",
    "achievements.perfect_games_100": "Perfektion: 100 Perfekte Spil",
    "achievements.perfect_games_100.description":
      "Opnå maksimum score i 100 spil",
    "achievements.perfect_games_150": "Perfektion: 150 Perfekte Spil",
    "achievements.perfect_games_150.description":
      "Opnå maksimum score i 150 spil",
    "achievements.perfect_games_200": "Legende: 200 Perfekte Spil",
    "achievements.perfect_games_200.description":
      "Opnå maksimum score i 200 spil",
    "achievements.perfect_games_300": "Legende: 300 Perfekte Spil",
    "achievements.perfect_games_300.description":
      "Opnå maksimum score i 300 spil",
    "achievements.perfect_games_400": "Legende: 400 Perfekte Spil",
    "achievements.perfect_games_400.description":
      "Opnå maksimum score i 400 spil",
    "achievements.perfect_games_500": "Legende: 500 Perfekte Spil",
    "achievements.perfect_games_500.description":
      "Opnå maksimum score i 500 spil",

    // Score Achievements
    "achievements.total_score_100": "Samler: 100 Point",
    "achievements.total_score_100.description":
      "Akkumuler 100 point i alle spil",
    "achievements.total_score_250": "Samler: 250 Point",
    "achievements.total_score_250.description":
      "Akkumuler 250 point i alle spil",
    "achievements.total_score_500": "Samler: 500 Point",
    "achievements.total_score_500.description":
      "Akkumuler 500 point i alle spil",
    "achievements.total_score_1000": "Pointjæger: 1.000 Point",
    "achievements.total_score_1000.description":
      "Akkumuler 1.000 point i alle spil",
    "achievements.total_score_2500": "Pointjæger: 2.500 Point",
    "achievements.total_score_2500.description":
      "Akkumuler 2.500 point i alle spil",
    "achievements.total_score_5000": "Pointjæger: 5.000 Point",
    "achievements.total_score_5000.description":
      "Akkumuler 5.000 point i alle spil",
    "achievements.total_score_7500": "Pointmagnet: 7.500 Point",
    "achievements.total_score_7500.description":
      "Akkumuler 7.500 point i alle spil",
    "achievements.total_score_10000": "Pointmagnet: 10.000 Point",
    "achievements.total_score_10000.description":
      "Akkumuler 10.000 point i alle spil",
    "achievements.total_score_15000": "Pointmagnet: 15.000 Point",
    "achievements.total_score_15000.description":
      "Akkumuler 15.000 point i alle spil",
    "achievements.total_score_20000": "Pointmester: 20.000 Point",
    "achievements.total_score_20000.description":
      "Akkumuler 20.000 point i alle spil",
    "achievements.total_score_30000": "Pointmester: 30.000 Point",
    "achievements.total_score_30000.description":
      "Akkumuler 30.000 point i alle spil",
    "achievements.total_score_50000": "Pointmester: 50.000 Point",
    "achievements.total_score_50000.description":
      "Akkumuler 50.000 point i alle spil",
    "achievements.total_score_75000": "Elite: 75.000 Point",
    "achievements.total_score_75000.description":
      "Akkumuler 75.000 point i alle spil",
    "achievements.total_score_100000": "Elite: 100.000 Point",
    "achievements.total_score_100000.description":
      "Akkumuler 100.000 point i alle spil",
    "achievements.total_score_150000": "Elite: 150.000 Point",
    "achievements.total_score_150000.description":
      "Akkumuler 150.000 point i alle spil",
    "achievements.total_score_200000": "Legende: 200.000 Point",
    "achievements.total_score_200000.description":
      "Akkumuler 200.000 point i alle spil",
    "achievements.total_score_300000": "Legende: 300.000 Point",
    "achievements.total_score_300000.description":
      "Akkumuler 300.000 point i alle spil",
    "achievements.total_score_400000": "Legende: 400.000 Point",
    "achievements.total_score_400000.description":
      "Akkumuler 400.000 point i alle spil",
    "achievements.total_score_500000": "Legende: 500.000 Point",
    "achievements.total_score_500000.description":
      "Akkumuler 500.000 point i alle spil",

    // Daily Streak Achievements
    "achievements.daily_streak_1": "Daglig Spiller",
    "achievements.daily_streak_1.description": "Spil i 1 dag i træk",
    "achievements.daily_streak_3": "Musikentusiast",
    "achievements.daily_streak_3.description": "Spil i 3 dage i træk",
    "achievements.daily_streak_5": "Melodimester",
    "achievements.daily_streak_5.description": "Spil i 5 dage i træk",
    "achievements.daily_streak_7": "Perfekt Uge",
    "achievements.daily_streak_7.description": "Spil i 7 dage i træk",
    "achievements.daily_streak_14": "Musikveteran",
    "achievements.daily_streak_14.description": "Spil i 14 dage i træk",
    "achievements.daily_streak_30": "Melodilegende",
    "achievements.daily_streak_30.description": "Spil i 30 dage i træk",

    // Daily Games Achievements
    "achievements.daily_games_3": "Opvarmning",
    "achievements.daily_games_3.description": "Spil 3 spil på én dag",
    "achievements.daily_games_5": "Musiksession",
    "achievements.daily_games_5.description": "Spil 5 spil på én dag",
    "achievements.daily_games_10": "Musikmaraton",
    "achievements.daily_games_10.description": "Spil 10 spil på én dag",
    "achievements.daily_games_20": "Melodimaraton",
    "achievements.daily_games_20.description": "Spil 20 spil på én dag",
    "achievements.daily_games_30": "Ultra Musikalsk",
    "achievements.daily_games_30.description": "Spil 30 spil på én dag",
    "achievements.daily_games_50": "Melodigalskab",
    "achievements.daily_games_50.description": "Spil 50 spil på én dag",

    // Achievement error messages
    "errors.achievements.fetch": "Fejl ved hentning af præstationer",
    "errors.achievements.update": "Fejl ved opdatering af præstationsfremgang",
    "errors.achievements.unlock": "Fejl ved oplåsning af præstation",
    "errors.achievements.check": "Fejl ved kontrol af præstationer",

    "auth.required.title": "Login påkrævet",
    "auth.required.description":
      "Log venligst ind for at få adgang til dette område",
    "auth.login.title": "Log ind",
    "auth.register.title": "Tilmeld",
    "auth.toggle.login": "Skift til login",
    "auth.toggle.register": "Skift til registrering",
    "auth.login.submit": "Log ind",
    "auth.register.submit": "Tilmeld",
    "auth.form.submit": "Send",
    "auth.form.loading": "Behandler...",
    "auth.tabs.login": "Log ind",
    "auth.tabs.register": "Tilmeld",
    "auth.validation.processing": "Validerer input...",
    "auth.form.error.general": "Der er opstået en fejl",
    "auth.form.success": "Succes!",
    "auth.form.email_required": "E-mailadresse er påkrævet",
    "auth.form.email_invalid_short": "Ugyldig e-mailadresse",
    "auth.form.loading_text": "Indlæser...",
    "auth.form.send_reset_link": "Send nulstillingslink",
    "auth.form.password_required": "Adgangskode er påkrævet",
    "auth.form.password_requirements": "Adgangskoden opfylder ikke alle krav",
    "auth.form.password_confirm_required":
      "Bekræftelse af adgangskode er påkrævet",
    "auth.form.passwords_not_match": "Adgangskoderne stemmer ikke overens",
    "auth.password_reset.success_message":
      "Hvis der findes en konto med denne e-mail, har vi sendt instruktioner til at nulstille din adgangskode.",
    "auth.password_reset.error_message":
      "Der opstod en fejl. Prøv igen senere.",
    "auth.password_reset.complete_success":
      "Adgangskode nulstillet med succes. Du kan nu logge ind med din nye adgangskode.",
    "auth.password_reset.complete_error":
      "Nulstilling af adgangskode mislykkedes. Kontroller dine oplysninger eller anmod om et nyt nulstillingslink.",

    "auth.login.email": "E-mail",
    "auth.login.email.placeholder": "Indtast din e-mail",
    "auth.login.password": "Adgangskode",
    "auth.login.password.placeholder": "Indtast din adgangskode",
    "auth.login.remember": "Husk mig",
    "auth.login.forgot_password": "Glemt adgangskode?",
    "auth.login.success": "Login succesfuldt",
    "auth.login.error": "Fejl ved login",

    "auth.register.name": "Fulde navn",
    "auth.register.email": "E-mail",
    "auth.register.email.placeholder": "Indtast din e-mail",
    "auth.register.username": "Brugernavn",
    "auth.register.username.placeholder": "Vælg et brugernavn",
    "auth.register.password": "Adgangskode",
    "auth.register.password.placeholder": "Opret en sikker adgangskode",
    "auth.register.confirm_password": "Bekræft adgangskode",
    "auth.register.password_confirm.placeholder":
      "Indtast din adgangskode igen",
    "auth.register.terms": "Jeg accepterer vilkår og betingelser",
    "auth.register.success": "Registrering succesfuld",
    "auth.register.error": "Fejl ved registrering",

    "auth.password_reset.title": "Nulstil adgangskode",
    "auth.password_reset.submit": "Send nulstillingslink",
    "auth.password_reset.email": "E-mail",
    "auth.password_reset.email.placeholder": "Indtast din registrerede e-mail",
    "auth.password_reset.back_to_login": "Tilbage til login",
    "auth.password_reset.login": "Log ind",
    "auth.password_reset.success":
      "Et nulstillingslink er blevet sendt til din e-mail",
    "auth.password_reset.error": "Fejl ved afsendelse af nulstillingslink",
    "auth.password_reset.new_password": "Ny adgangskode",
    "auth.password_reset.confirm_password": "Bekræft ny adgangskode",
    "auth.password_reset.change_submit": "Skift adgangskode",

    "auth.email_verification.title": "E-mail-verifikation",
    "auth.email_verification.message":
      "Vi har sendt et verifikationslink til din e-mail",
    "auth.email_verification.check_inbox": "Tjek venligst din indbakke",
    "auth.email_verification.resend": "Send verifikationslink igen",
    "auth.email_verification.success": "E-mail verificeret succesfuldt",
    "auth.email_verification.error": "Fejl ved verificering af e-mail",

    // Passwortvalidierung
    "auth.password.requirements": "Krav til adgangskode:",
    "auth.password.min_length": "Adgangskoden skal være mindst 8 tegn",
    "auth.password.require_number": "Adgangskoden skal indeholde mindst ét tal",
    "auth.password.require_uppercase":
      "Adgangskoden skal indeholde mindst ét stort bogstav",
    "auth.password.require_lowercase":
      "Adgangskoden skal indeholde mindst ét lille bogstav",
    "auth.password.require_special":
      "Adgangskoden skal indeholde mindst ét specialtegn",
    "auth.password.match": "Adgangskoderne skal matche",
    "auth.password.strength.weak": "Svag",
    "auth.password.strength.medium": "Medium",
    "auth.password.strength.strong": "Stærk",

    // Formularvalidierung
    "auth.form.required": "Dette felt er påkrævet",
    "auth.form.email_invalid": "Indtast venligst en gyldig e-mail",
    "auth.form.min_length": "Dette felt skal indeholde mindst {length} tegn",
    "auth.form.max_length":
      "Dette felt må ikke indeholde mere end {length} tegn",
    "auth.form.invalid": "Dette felt er ikke gyldigt",

    // Zugänglichkeit
    "auth.accessibility.loading": "Indlæser, vent venligst",
    "auth.accessibility.error": "Fejl: {message}",
    "auth.accessibility.required_field": "Påkrævet felt",
    "auth.accessibility.toggle_password": "Vis/skjul adgangskode",
    "auth.accessibility.close_modal": "Luk vindue",

    // API-Fehlermeldungen
    "auth.api.network_error": "Netværksfejl. Tjek venligst din forbindelse",
    "auth.api.server_error": "Serverfejl. Prøv igen senere",
    "auth.api.invalid_credentials": "Ugyldige legitimationsoplysninger",
    "auth.api.account_exists": "Der findes allerede en konto med denne e-mail",
    "auth.api.email_not_found": "Ingen konto fundet med denne e-mail",
    "auth.api.too_many_requests": "For mange forsøg. Prøv igen senere",

    // Service-Fehlermeldungen
    "auth.service.session_expired":
      "Din session er udløbet. Log venligst ind igen",
    "auth.service.unauthorized": "Uautoriseret. Log venligst ind",
    "auth.service.account_locked": "Din konto er blevet låst. Kontakt support",
    "auth.service.permission_denied": "Tilladelse nægtet til denne handling",
    "auth.service.invalid_credentials":
      "Ugyldige loginoplysninger. Tjek venligst din e-mail og adgangskode.",
    "auth.service.too_many_attempts":
      "For mange loginforsøg. Vent venligst et øjeblik før du prøver igen.",

    "nav.home": "Hjem",
    "nav.rules": "Regler",
    "category.no_image_available": "Intet billede tilgængeligt",
    "game.score": "Score",
    "game.round": "Runde",
    "game.joker": "50:50 Joker",
    "difficulty.easy": "Let",
    "difficulty.medium": "Medium",
    "difficulty.hard": "Svær",
    "category.difficulty.easy": "Let",
    "category.difficulty.medium": "Medium",
    "category.difficulty.hard": "Svær",
    "game.select":
      "Udforsk den fascinerende verden af musik og test din viden i vores interaktive musikquizzer. Vælg din yndlingsgenre og start din melodiske rejse!",
    "game.welcome": "Velkommen til Melody Mind",
    "game.genre.list": "Genrevalg",
    "game.search.label": "Søg efter en genre",
    "game.search.description": "Listen filtreres automatisk under indtastning",
    "game.genre.play.label": "Spil",
    "game.genre.image": "Coverbillede til",
    "game.no.results": "Ingen resultater fundet",
    "game.not.available": "Ikke tilgængelig",
    "category.selected": "valgt!",
    "category.difficulty.heading": "Vælg dit sværhedsniveau",
    "category.difficulty.group": "Sværhedsgrader",
    "category.difficulty.easy.label": "Start spil i let tilstand",
    "category.difficulty.medium.label": "Start spil i medium tilstand",
    "category.difficulty.hard.label": "Start spil i svær tilstand",
    "category.image.alt": "Coverbillede",
    "nav.menu.open": "Åbn menu",
    "nav.menu.close": "Luk menu",
    "nav.menu.home": "Hjem",
    "nav.menu.rules": "Regler",
    "nav.menu.highscores": "Topscorer",
    "nav.menu.profile": "Profil",
    "nav.menu.logout": "Log ud",
    "nav.skip.main": "Spring til hovedindhold",
    "game.end.title": "Spillet er slut!",
    "game.end.motivation":
      "Fantastisk præstation! 🎉 Din musikalske viden er virkelig imponerende. Udfordr dig selv med en ny runde og bliv en sand musiklegende! 🎵",
    "game.end.score": "Opnået score:",
    "game.end.newgame": "Nyt Spel",
    "game.end.share": "Del din succes!",
    "game.end.home": "Hjem",
    "game.feedback.resolution": "Opløsning",
    "game.feedback.media.section": "Mediesektion",
    "game.feedback.audio.preview": "Musikforhåndsvisning",
    "game.feedback.subtitles": "Undertekster",
    "game.feedback.audio.unsupported":
      "Din browser understøtter ikke lydafspilning.",
    "game.feedback.streaming.links": "Musik-streamingtjenester",
    "game.feedback.listen.spotify": "Lyt på Spotify",
    "game.feedback.listen.deezer": "Lyt på Deezer",
    "game.feedback.listen.apple": "Lyt på Apple Music",
    "game.feedback.next.round": "Næste Runde",
    "game.current.round": "Runde",
    "game.current.round.label": "Nuværende rundenummer",
    "game.joker.options": "Joker Muligheder",
    "game.joker.use": "Brug 50:50 Joker",
    "game.joker.description": "Fjerner to forkerte svarmuligheder",
    "loading.content": "Indlæser indhold...",
    "share.title": "Del din succes!",
    "share.buttons.group.label": "Sociale medier delingsmuligheder",
    "share.facebook": "Del på Facebook",
    "share.whatsapp": "Del på WhatsApp",
    "share.native": "Del med...",
    "share.native.label": "Del",
    "share.twitter": "Del på X/Twitter",
    "share.email": "Del via e-mail",
    "share.email.label": "E-mail",
    "share.copy": "Kopiér delingstekst til udklipsholder",
    "share.copy.label": "Kopiér tekst",
    "error.default": "Der er opstået en fejl",
    "error.close": "Luk fejlmeddelelse",
    "coins.collected": "Indsamlede mønter",
    "language.picker.label": "Sprogvalg",
    "language.change": "Skift webstedets sprog",
    "language.select.label": "Vælg dit foretrukne sprog",
    "language.de": "Tysk",
    "language.en": "Engelsk",
    "language.es": "Spansk",
    "language.fr": "Fransk",
    "language.it": "Italiensk",
    "language.pt": "Portugisisk",
    "language.da": "Dansk",
    "language.nl": "Hollandsk",
    "language.sv": "Svensk",
    "language.fi": "Finsk",
    "language.de.label": "Vis websted på tysk",
    "language.en.label": "Vis websted på engelsk",
    "language.es.label": "Vis websted på spansk",
    "language.fr.label": "Vis websted på fransk",
    "language.it.label": "Vis websted på italiensk",
    "language.pt.label": "Vis websted på portugisisk",
    "language.da.label": "Vis websted på dansk",
    "language.nl.label": "Vis websted på hollandsk",
    "language.sv.label": "Vis websted på svensk",
    "language.fi.label": "Vis websted på finsk",
    "playlist.item.unavailable": "Dette indhold er endnu ikke tilgængeligt",
    "playlist.item.status": "Status",
    "playlist.item.coming.soon": "Kommer snart",
    "game.area.label": "Spilområde",
    "game.options.label": "Svarmuligheder",
    "game.answer.correct": "Korrekt! {points} point + {bonus} bonuspoint",
    "game.answer.wrong": "Forkert! Det korrekte svar var: {answer}",
    "error.invalid.question":
      "Ugyldig spørgsmål eller ingen muligheder tilgængelige",
    "error.no.initial.question": "Ingen gyldigt første spørgsmål fundet",
    "error.no.albums.found": "Ingen albums fundet for kategorien {category}",
    "meta.keywords":
      "Musikquiz, Musikspil, Sangquiz, Kunstnerquiz, Online Musikquiz, Musik Trivia, Melody Mind, Musikalsk Gættespil",
    "knowledge.title": "Musik Vidensbank",
    "knowledge.intro":
      "Dyk ned i den fascinerende verden af musikhistorie. Her finder du spændende artikler om forskellige musikepoker, genrer og deres udvikling. Opdag interessante fakta og udvid din musikalske viden.",
    "knowledge.search.label": "Søg artikler",
    "knowledge.search.placeholder": "Søg...",
    "knowledge.filter.all": "Alle nøgleord",
    "knowledge.no.results": "Ingen artikler fundet. Prøv andre søgeord.",
    "game.remaining": "tilbage",
    "game.default.headline": "Spil",
    "popup.score": "Score: {score}",
    "popup.golden.lp.score": "Opnåede point: {score}",
    "nav.donate.heading": "Støt os",
    "nav.donate.paypal": "Donér via PayPal",
    "nav.donate.coffee": "Giv mig en kop kaffe",
    "nav.title": "Navigation",
    "nav.menu.text": "Menu",
    "game.categories.empty.headline": "Ingen genrer fundet",
    "game.categories.empty.text":
      "Desværre blev der ikke fundet nogen kategorier. Prøv igen senere.",
    "game.categories.no.playable.headline": "Ingen spillelige genrer",
    "game.categories.no.playable.text":
      "Der er i øjeblikket ingen spillelige kategorier. Tjek venligst igen senere.",
    "knowledge.reading.time": "min læsetid",
    "knowledge.breadcrumb.label": "Brødkrummenavigation",
    "knowledge.listen.heading": "Lyt til relateret musik",
    "knowledge.back.to.list": "Tilbage til artikler",
    "knowledge.interact.heading": "Lyt & Spil",
    "knowledge.play.heading": "Spil denne genre",
    "knowledge.play.description":
      "Test din viden om denne musikgenre i vores interaktive quiz!",
    "knowledge.play.category": "Start musikquiz",
    "category.play": "Spil",
    "play.cover.puzzle": "Spil Cover Puzzle",
    "play.cover.puzzle.description":
      "I Cover Puzzle skal du genkende albumcovers, mens de gradvist afsløres. Jo hurtigere du identificerer det korrekte album, jo flere point tjener du. Test din visuelle hukommelse for musikcovers!",
    "podcast.page.title": "Musik playlister | Melody Mind",
    "podcast.page.heading": "Opdag vores musik playlister",
    "podcast.page.description":
      "Dyk ned i omhyggeligt kuraterede playlister fra forskellige epoker og genrer. Perfekt til at opdage ny musik eller genbesøge dine yndlingsklassikere.",
    "podcast.search.label": "Søg podcasts",
    "podcast.search.placeholder": "Søg efter fascinerende musikhistorier...",
    "podcast.search.status.all": "Alle podcasts vises",
    "podcast.search.status.one": "1 podcast fundet",
    "podcast.search.status.multiple": "{count} podcasts fundet",
    "podcast.no.results":
      "Ingen matchende podcasts fundet. Prøv et andet søgeord.",
    "podcast.duration.error": "Varighed ikke tilgængelig",
    "podcast.play": "Afspil",
    "podcast.intro.title": "Introduktion til Astropod",
    "podcast.intro.description":
      "Astropod er en gratis og open-source serverløs podcast-løsning.",
    "podcast.deploy.title": "Implementér din serverløse podcast på 2 minutter",
    "podcast.deploy.description":
      "Lær hvordan du hurtigt implementerer din podcast.",
    "podcast.auth.title":
      "Konfigurering af brugerautentificering og adgang til dashboard",
    "podcast.auth.description":
      "Aktivér autentificering og få adgang til dashboardet.",
    "podcast.config.title": "Konfigurering af din Astropod Podcast",
    "podcast.config.description": "Lær hvordan du konfigurerer din podcast.",
    "podcast.publish.title": "Udgiv din første episode",
    "podcast.publish.description": "Udgiv din første episode med lethed.",
    "podcast.conclusion.title": "Konklusion",
    "podcast.conclusion.description": "Resumé og næste trin.",
    "podcast.listen.on": "Lyt på",
    "podcast.language.availability":
      "Vores podcasts er udelukkende tilgængelige på tysk og engelsk.",
    "podcast.listen.heading": "Lyt til vores podcasts",
    "login.welcome": "Velkommen til Melody Mind!",
    "login.description":
      "Begiv dig ud på en musikalsk rejse gennem tiden! Test din viden i spændende quizzer, udforsk fascinerende musikgenrer og dyk ned i vores fængslende podcasts. Vis dine færdigheder, saml point og bliv en sand musiklegende!",
    "index.continue": "Lad os komme igang!",
    "index.start.game.label": "Start din musikalske rejse",
    "index.welcome.footnote":
      "Skabt af musikelskere til musikelskere. God fornøjelse!",
    "accessibility.wcag":
      "Denne applikation stræber efter WCAG AAA-overholdelse.",
    "game.instructions.title": "Spilinstruktioner",
    "game.instructions.puzzle":
      "Prøv at gætte albummet, mens coveret gradvist afsløres. Jo hurtigere du gætter rigtigt, jo flere point tjener du.",
    "game.time.remaining": "Resterende tid:",
    "game.puzzle.label": "Albumcover puzzle",
    "game.puzzle.loading": "Indlæser puzzle...",
    "game.options.legend": "Vælg det korrekte album",
    "game.next.round": "Start næste runde",
    "game.puzzle.revealed": "{percent}% af albumcoveret er blevet afsløret",
    "game.option.choose": "Vælg",
    "game.options.available": "Svarmuligheder er nu tilgængelige",
    "game.time.remaining.seconds": "{seconds} sekunder tilbage",
    "game.time.up": "Tiden er gået! Det korrekte album var:",
    "game.correct.answer": "Korrekt svar",
    "game.slower.speed": "Langsommere spil",
    "game.normal.speed": "Normal hastighed",
    "game.skip.to.answers": "Spring til svarmuligheder",
    "game.next": "Næste",
    "aria.pressed": "Trykket",
    "aria.expanded": "Udvidet",
    "aria.shortcuts.panel": "Tastaturgenveje panel",
    "aria.shortcuts.list": "Liste over tilgængelige tastaturgenveje",
    "knowledge.empty": "Ingen artikler tilgængelige i denne kategori",
    "playlist.page.title": "Musik playlister | Melody Mind",
    "playlist.page.heading": "Opdag vores musik playlister",
    "playlist.page.description":
      "Dyk ned i omhyggeligt kuraterede playlister fra forskellige epoker og genrer. Perfekt til at opdage ny musik eller genbesøge dine yndlingsklassikere.",
    "playlist.search.label": "Søg i playlister",
    "playlist.search.placeholder": "Søg efter musikæra eller stil...",
    "playlist.filter.all": "Alle epoker",
    "playlist.no.results":
      "Ingen matchende playlister fundet. Prøv et andet søgeord.",
    "playlist.listen.on": "Lyt på",
    "playlist.listen.spotify": "Lyt på Spotify",
    "playlist.listen.deezer": "Lyt på Deezer",
    "playlist.listen.apple": "Lyt på Apple Music",
    "playlist.decade.filter": "Filter efter årti",
    "footer.rights": "Alle rettigheder forbeholdes",
    "footer.donate": "Donér",
    "game.chronology.title": "Musik-kronologi",
    "game.chronology.description":
      "Sæt disse albums i rækkefølge efter udgivelsesår (ældste først)",
    "game.chronology.area.label": "Kronologi-spilområde",
    "game.chronology.result": "Resultat",
    "game.chronology.correct": "Korrekt",
    "game.chronology.wrong": "Skulle være på position {position}",
    "game.chronology.score": "Resultat: {score} point",
    "game.chronology.details": "{correct} af {total} albums korrekt placeret",
    "game.chronology.year": "År: {year}",
    "game.chronology.drag.help":
      "Brug piletasterne ↑/↓ eller træk og slip for at sortere",
    "game.submit.answer": "Tjek svar",
    "game.chronology.up": "Op",
    "game.chronology.down": "Ned",
    "game.chronology.position": "Position",
    "game.chronology.start": "Start",
    "game.chronology.end": "Slut",
    "common.back.to.top": "Tilbage til toppen",
    "knowledge.articles.heading": "Vidensartikler",
    "knowledge.search.heading": "Søg Artikler",
    "knowledge.search.description":
      "Artikler filtreres automatisk, mens du skriver",
    "knowledge.search.reset": "Nulstil søgning",
    "knowledge.search.reset.text": "Nulstil",
    "knowledge.no.results.help": "Prøv andre søgeord eller nulstil din søgning",
    "knowledge.keyboard.instructions":
      "Brug piletasterne til at navigere mellem artikler. Tryk på Enter for at åbne en artikel.",

    // Profilside
    "profile.title": "Min Profil",
    "profile.description":
      "Administrer dine personlige oplysninger og se dine spilstatistikker",
    "profile.loading": "Indlæser profildata...",
    "profile.error": "Fejl ved indlæsning af profildata",
    "profile.auth.required": "Du skal være logget ind for at se din profil",
    "profile.user.info": "Brugeroplysninger",
    "profile.user.since": "Medlem siden",
    "profile.stats.title": "Spilstatistikker",
    "profile.stats.quiz": "Quiz",
    "profile.stats.chronology": "Kronologi",
    "profile.stats.total.score": "Samlet score",
    "profile.stats.games.played": "Spil spillet",
    "profile.stats.highest.score": "Højeste score",
    "profile.recent.games": "Seneste spilresultater",
    "profile.recent.games.empty": "Du har ikke spillet nogen spil endnu",
    "profile.recent.game.mode": "Spiltilstand",
    "profile.recent.game.category": "Kategori",
    "profile.recent.game.difficulty": "Sværhedsgrad",
    "profile.recent.game.score": "Score",
    "profile.recent.game.date": "Dato",
    "profile.nav.aria": "Navigation til brugerprofil",
    "profile.nav.link": "Gå til profil",

    // Highscores-side
    "highscores.title": "Topscorer",
    "highscores.description":
      "Se de bedste scorer på tværs af forskellige spiltilstande og kategorier",
    "highscores.loading": "Indlæser topscorer...",
    "highscores.error": "Fejl ved indlæsning af topscorer",
    "highscores.empty": "Ingen topscorer fundet",
    "highscores.filter.title": "Filtrer topscorer",
    "highscores.filter.game.mode": "Spiltilstand",
    "highscores.filter.category": "Kategori",
    "highscores.filter.all": "Alle",
    "highscores.filter.search": "Søg i kategorier...",
    "highscores.filter.no.results": "Ingen kategorier fundet",
    "highscores.table.title": "Topscorer",
    "highscores.table.rank": "Placering",
    "highscores.table.player": "Spiller",
    "highscores.table.game.mode": "Spiltilstand",
    "highscores.table.category": "Kategori",
    "highscores.table.score": "Score",
    "highscores.table.date": "Dato",
  },
  nl: {
    // Auth-Komponenten

    // Achievement Categories
    "achievements.category.games_played": "Gespeelde Spellen",
    "achievements.category.perfect_games": "Perfecte Spellen",
    "achievements.category.total_score": "Totale Score",
    "achievements.category.daily_streak": "Dagelijkse Reeks",
    "achievements.category.daily_games": "Dagelijkse Spellen",

    // Achievement System
    "achievements.title": "Prestaties",
    "achievements.description":
      "Ontdek en ontgrendel prestaties om je voortgang bij te houden",
    "achievements.loading": "Prestaties laden...",
    "achievements.error": "Fout bij het laden van prestaties",
    "achievements.empty": "Geen prestaties gevonden",
    "achievements.category.bronze": "Brons",
    "achievements.category.silver": "Zilver",
    "achievements.category.gold": "Goud",
    "achievements.category.platinum": "Platina",
    "achievements.category.diamond": "Diamant",
    "achievements.category.time": "Tijd",
    "achievements.status.locked": "Vergrendeld",
    "achievements.status.in_progress": "In Uitvoering",
    "achievements.status.unlocked": "Ontgrendeld",
    "achievements.progress": "Voortgang: {progress}%",
    "achievements.unlocked_at": "Ontgrendeld op {date}",
    "achievements.points": "Punten: {points}",
    "achievements.rarity": "Zeldzaamheid: {percentage}%",
    "achievements.notification.unlocked": "Prestatie ontgrendeld!",
    "achievements.notification.progress": "Prestatievoortgang bijgewerkt!",
    "achievements.nav.link": "Prestaties",
    "achievements.nav.aria": "Navigeer naar prestaties",
    "achievements.badge.new": "Nieuwe prestaties beschikbaar",
    "achievements.filter.title": "Filter Prestaties",
    "achievements.filter.status": "Status",
    "achievements.filter.status.aria": "Filter prestaties op status",
    "achievements.filter.category": "Categorie",
    "achievements.filter.category.aria": "Filter prestaties op categorie",
    "achievements.filter.all": "Alle",
    "achievements.filter.all_categories": "Alle Categorieën",
    "achievements.summary.title": "Prestatievoortgang",
    "achievements.summary.total": "Totaal",
    "achievements.summary.unlocked": "Ontgrendeld",
    "achievements.summary.progress": "Voortgang",
    "achievements.notification.close": "Melding sluiten",
    "achievements.rarity.tooltip":
      "Percentage spelers dat deze prestatie heeft ontgrendeld",

    // Game Counter Achievements
    "achievements.games_played_1": "Beginner: 1 Spel",
    "achievements.games_played_1.description":
      "Speel je eerste spel in elke modus",
    "achievements.games_played_5": "Beginner: 5 Spellen",
    "achievements.games_played_5.description": "Speel 5 spellen in elke modus",
    "achievements.games_played_10": "Beginner: 10 Spellen",
    "achievements.games_played_10.description":
      "Speel 10 spellen in elke modus",
    "achievements.games_played_25": "Amateur: 25 Spellen",
    "achievements.games_played_25.description":
      "Speel 25 spellen in elke modus",
    "achievements.games_played_50": "Amateur: 50 Spellen",
    "achievements.games_played_50.description":
      "Speel 50 spellen in elke modus",
    "achievements.games_played_75": "Amateur: 75 Spellen",
    "achievements.games_played_75.description":
      "Speel 75 spellen in elke modus",
    "achievements.games_played_100": "Gevorderd: 100 Spellen",
    "achievements.games_played_100.description":
      "Speel 100 spellen in elke modus",
    "achievements.games_played_150": "Gevorderd: 150 Spellen",
    "achievements.games_played_150.description":
      "Speel 150 spellen in elke modus",
    "achievements.games_played_200": "Gevorderd: 200 Spellen",
    "achievements.games_played_200.description":
      "Speel 200 spellen in elke modus",
    "achievements.games_played_300": "Expert: 300 Spellen",
    "achievements.games_played_300.description":
      "Speel 300 spellen in elke modus",
    "achievements.games_played_400": "Expert: 400 Spellen",
    "achievements.games_played_400.description":
      "Speel 400 spellen in elke modus",
    "achievements.games_played_500": "Expert: 500 Spellen",
    "achievements.games_played_500.description":
      "Speel 500 spellen in elke modus",
    "achievements.games_played_750": "Meester: 750 Spellen",
    "achievements.games_played_750.description":
      "Speel 750 spellen in elke modus",
    "achievements.games_played_1000": "Meester: 1000 Spellen",
    "achievements.games_played_1000.description":
      "Speel 1000 spellen in elke modus",
    "achievements.games_played_1500": "Meester: 1500 Spellen",
    "achievements.games_played_1500.description":
      "Speel 1500 spellen in elke modus",
    "achievements.games_played_2000": "Meester: 2000 Spellen",
    "achievements.games_played_2000.description":
      "Speel 2000 spellen in elke modus",
    "achievements.games_played_2500": "Legende: 2500 Spellen",
    "achievements.games_played_2500.description":
      "Speel 2500 spellen in elke modus",
    "achievements.games_played_3000": "Legende: 3000 Spellen",
    "achievements.games_played_3000.description":
      "Speel 3000 spellen in elke modus",
    "achievements.games_played_4000": "Legende: 4000 Spellen",
    "achievements.games_played_4000.description":
      "Speel 4000 spellen in elke modus",
    "achievements.games_played_5000": "Legende: 5000 Spellen",
    "achievements.games_played_5000.description":
      "Speel 5000 spellen in elke modus",

    // Perfect Games Achievements
    "achievements.perfect_games_1": "Gelukstreffer: 1 Perfect Spel",
    "achievements.perfect_games_1.description":
      "Behaal de maximale score in 1 spel",
    "achievements.perfect_games_2": "Gelukstreffer: 2 Perfecte Spellen",
    "achievements.perfect_games_2.description":
      "Behaal de maximale score in 2 spellen",
    "achievements.perfect_games_3": "Gelukstreffer: 3 Perfecte Spellen",
    "achievements.perfect_games_3.description":
      "Behaal de maximale score in 3 spellen",
    "achievements.perfect_games_5": "Precisie: 5 Perfecte Spellen",
    "achievements.perfect_games_5.description":
      "Behaal de maximale score in 5 spellen",
    "achievements.perfect_games_7": "Precisie: 7 Perfecte Spellen",
    "achievements.perfect_games_7.description":
      "Behaal de maximale score in 7 spellen",
    "achievements.perfect_games_10": "Precisie: 10 Perfecte Spellen",
    "achievements.perfect_games_10.description":
      "Behaal de maximale score in 10 spellen",
    "achievements.perfect_games_15": "Ervaring: 15 Perfecte Spellen",
    "achievements.perfect_games_15.description":
      "Behaal de maximale score in 15 spellen",
    "achievements.perfect_games_20": "Ervaring: 20 Perfecte Spellen",
    "achievements.perfect_games_20.description":
      "Behaal de maximale score in 20 spellen",
    "achievements.perfect_games_25": "Ervaring: 25 Perfecte Spellen",
    "achievements.perfect_games_25.description":
      "Behaal de maximale score in 25 spellen",
    "achievements.perfect_games_30": "Meesterschap: 30 Perfecte Spellen",
    "achievements.perfect_games_30.description":
      "Behaal de maximale score in 30 spellen",
    "achievements.perfect_games_40": "Meesterschap: 40 Perfecte Spellen",
    "achievements.perfect_games_40.description":
      "Behaal de maximale score in 40 spellen",
    "achievements.perfect_games_50": "Meesterschap: 50 Perfecte Spellen",
    "achievements.perfect_games_50.description":
      "Behaal de maximale score in 50 spellen",
    "achievements.perfect_games_75": "Perfectie: 75 Perfecte Spellen",
    "achievements.perfect_games_75.description":
      "Behaal de maximale score in 75 spellen",
    "achievements.perfect_games_100": "Perfectie: 100 Perfecte Spellen",
    "achievements.perfect_games_100.description":
      "Behaal de maximale score in 100 spellen",
    "achievements.perfect_games_150": "Perfectie: 150 Perfecte Spellen",
    "achievements.perfect_games_150.description":
      "Behaal de maximale score in 150 spellen",
    "achievements.perfect_games_200": "Legende: 200 Perfecte Spellen",
    "achievements.perfect_games_200.description":
      "Behaal de maximale score in 200 spellen",
    "achievements.perfect_games_300": "Legende: 300 Perfecte Spellen",
    "achievements.perfect_games_300.description":
      "Behaal de maximale score in 300 spellen",
    "achievements.perfect_games_400": "Legende: 400 Perfecte Spellen",
    "achievements.perfect_games_400.description":
      "Behaal de maximale score in 400 spellen",
    "achievements.perfect_games_500": "Legende: 500 Perfecte Spellen",
    "achievements.perfect_games_500.description":
      "Behaal de maximale score in 500 spellen",

    // Score Achievements
    "achievements.total_score_100": "Verzamelaar: 100 Punten",
    "achievements.total_score_100.description":
      "Verzamel 100 punten in alle spellen",
    "achievements.total_score_250": "Verzamelaar: 250 Punten",
    "achievements.total_score_250.description":
      "Verzamel 250 punten in alle spellen",
    "achievements.total_score_500": "Verzamelaar: 500 Punten",
    "achievements.total_score_500.description":
      "Verzamel 500 punten in alle spellen",
    "achievements.total_score_1000": "Puntenjager: 1.000 Punten",
    "achievements.total_score_1000.description":
      "Verzamel 1.000 punten in alle spellen",
    "achievements.total_score_2500": "Puntenjager: 2.500 Punten",
    "achievements.total_score_2500.description":
      "Verzamel 2.500 punten in alle spellen",
    "achievements.total_score_5000": "Puntenjager: 5.000 Punten",
    "achievements.total_score_5000.description":
      "Verzamel 5.000 punten in alle spellen",
    "achievements.total_score_7500": "Puntenmagneet: 7.500 Punten",
    "achievements.total_score_7500.description":
      "Verzamel 7.500 punten in alle spellen",
    "achievements.total_score_10000": "Puntenmagneet: 10.000 Punten",
    "achievements.total_score_10000.description":
      "Verzamel 10.000 punten in alle spellen",
    "achievements.total_score_15000": "Puntenmagneet: 15.000 Punten",
    "achievements.total_score_15000.description":
      "Verzamel 15.000 punten in alle spellen",
    "achievements.total_score_20000": "Puntenmeester: 20.000 Punten",
    "achievements.total_score_20000.description":
      "Verzamel 20.000 punten in alle spellen",
    "achievements.total_score_30000": "Puntenmeester: 30.000 Punten",
    "achievements.total_score_30000.description":
      "Verzamel 30.000 punten in alle spellen",
    "achievements.total_score_50000": "Puntenmeester: 50.000 Punten",
    "achievements.total_score_50000.description":
      "Verzamel 50.000 punten in alle spellen",
    "achievements.total_score_75000": "Elite: 75.000 Punten",
    "achievements.total_score_75000.description":
      "Verzamel 75.000 punten in alle spellen",
    "achievements.total_score_100000": "Elite: 100.000 Punten",
    "achievements.total_score_100000.description":
      "Verzamel 100.000 punten in alle spellen",
    "achievements.total_score_150000": "Elite: 150.000 Punten",
    "achievements.total_score_150000.description":
      "Verzamel 150.000 punten in alle spellen",
    "achievements.total_score_200000": "Legende: 200.000 Punten",
    "achievements.total_score_200000.description":
      "Verzamel 200.000 punten in alle spellen",
    "achievements.total_score_300000": "Legende: 300.000 Punten",
    "achievements.total_score_300000.description":
      "Verzamel 300.000 punten in alle spellen",
    "achievements.total_score_400000": "Legende: 400.000 Punten",
    "achievements.total_score_400000.description":
      "Verzamel 400.000 punten in alle spellen",
    "achievements.total_score_500000": "Legende: 500.000 Punten",
    "achievements.total_score_500000.description":
      "Verzamel 500.000 punten in alle spellen",

    // Daily Streak Achievements
    "achievements.daily_streak_1": "Dagelijkse Speler",
    "achievements.daily_streak_1.description": "Speel 1 dag achter elkaar",
    "achievements.daily_streak_3": "Muziekliefhebber",
    "achievements.daily_streak_3.description": "Speel 3 dagen achter elkaar",
    "achievements.daily_streak_5": "Melodiemeester",
    "achievements.daily_streak_5.description": "Speel 5 dagen achter elkaar",
    "achievements.daily_streak_7": "Perfecte Week",
    "achievements.daily_streak_7.description": "Speel 7 dagen achter elkaar",
    "achievements.daily_streak_14": "Muziekveteraan",
    "achievements.daily_streak_14.description": "Speel 14 dagen achter elkaar",
    "achievements.daily_streak_30": "Melodielegende",
    "achievements.daily_streak_30.description": "Speel 30 dagen achter elkaar",

    // Daily Games Achievements
    "achievements.daily_games_3": "Opwarming",
    "achievements.daily_games_3.description": "Speel 3 spellen op één dag",
    "achievements.daily_games_5": "Muzieksessie",
    "achievements.daily_games_5.description": "Speel 5 spellen op één dag",
    "achievements.daily_games_10": "Muziekmarathon",
    "achievements.daily_games_10.description": "Speel 10 spellen op één dag",
    "achievements.daily_games_20": "Melodiemarathon",
    "achievements.daily_games_20.description": "Speel 20 spellen op één dag",
    "achievements.daily_games_30": "Ultra Muzikaal",
    "achievements.daily_games_30.description": "Speel 30 spellen op één dag",
    "achievements.daily_games_50": "Melodiewaanzin",
    "achievements.daily_games_50.description": "Speel 50 spellen op één dag",

    // Achievement error messages
    "errors.achievements.fetch": "Fout bij het ophalen van prestaties",
    "errors.achievements.update":
      "Fout bij het bijwerken van de prestatievoortgang",
    "errors.achievements.unlock": "Fout bij het ontgrendelen van de prestatie",
    "errors.achievements.check": "Fout bij het controleren van prestaties",

    "auth.required.title": "Inloggen vereist",
    "auth.required.description": "Log in om toegang te krijgen tot dit gebied",
    "auth.login.title": "Inloggen",
    "auth.register.title": "Registreren",
    "auth.toggle.login": "Naar inloggen",
    "auth.toggle.register": "Naar registratie",
    "auth.login.submit": "Inloggen",
    "auth.register.submit": "Registreren",
    "auth.form.submit": "Verzenden",
    "auth.form.loading": "Verwerken...",
    "auth.tabs.login": "Inloggen",
    "auth.tabs.register": "Registreren",
    "auth.validation.processing": "Gegevens worden gevalideerd...",
    "auth.form.error.general": "Er is een fout opgetreden",
    "auth.form.success": "Gelukt!",
    "auth.form.email_required": "E-mailadres is vereist",
    "auth.form.email_invalid_short": "Ongeldig e-mailadres",
    "auth.form.loading_text": "Laden...",
    "auth.form.send_reset_link": "Resetlink verzenden",
    "auth.form.password_required": "Wachtwoord is vereist",
    "auth.form.password_requirements":
      "Wachtwoord voldoet niet aan alle vereisten",
    "auth.form.password_confirm_required": "Wachtwoordbevestiging is vereist",
    "auth.form.passwords_not_match": "Wachtwoorden komen niet overeen",
    "auth.password_reset.success_message":
      "Als er een account bestaat met dit e-mailadres, hebben we instructies verzonden om je wachtwoord opnieuw in te stellen.",
    "auth.password_reset.error_message":
      "Er is een fout opgetreden. Probeer het later opnieuw.",
    "auth.password_reset.complete_success":
      "Wachtwoord succesvol gereset. Je kunt nu inloggen met je nieuwe wachtwoord.",
    "auth.password_reset.complete_error":
      "Wachtwoordreset mislukt. Controleer je gegevens of vraag een nieuwe resetlink aan.",

    "auth.login.email": "E-mailadres",
    "auth.login.email.placeholder": "Voer je e-mailadres in",
    "auth.login.password": "Wachtwoord",
    "auth.login.password.placeholder": "Voer je wachtwoord in",
    "auth.login.remember": "Onthoud mij",
    "auth.login.forgot_password": "Wachtwoord vergeten?",
    "auth.login.success": "Succesvol ingelogd",
    "auth.login.error": "Fout bij inloggen",

    "auth.register.name": "Volledige naam",
    "auth.register.email": "E-mailadres",
    "auth.register.email.placeholder": "Voer je e-mailadres in",
    "auth.register.username": "Gebruikersnaam",
    "auth.register.username.placeholder": "Kies een gebruikersnaam",
    "auth.register.password": "Wachtwoord",
    "auth.register.password.placeholder": "Maak een veilig wachtwoord aan",
    "auth.register.confirm_password": "Bevestig wachtwoord",
    "auth.register.password_confirm.placeholder":
      "Voer je wachtwoord nogmaals in",
    "auth.register.terms": "Ik ga akkoord met de voorwaarden",
    "auth.register.success": "Registratie succesvol",
    "auth.register.error": "Fout bij registreren",

    "auth.password_reset.title": "Wachtwoord resetten",
    "auth.password_reset.submit": "Reset link versturen",
    "auth.password_reset.email": "E-mailadres",
    "auth.password_reset.email.placeholder":
      "Voer je geregistreerde e-mailadres in",
    "auth.password_reset.back_to_login": "Terug naar inloggen",
    "auth.password_reset.login": "Inloggen",
    "auth.password_reset.success":
      "Een reset link is naar je e-mailadres verstuurd",
    "auth.password_reset.error": "Fout bij versturen van reset link",
    "auth.password_reset.new_password": "Nieuw wachtwoord",
    "auth.password_reset.confirm_password": "Bevestig nieuw wachtwoord",
    "auth.password_reset.change_submit": "Wachtwoord wijzigen",

    "auth.email_verification.title": "E-mailverificatie",
    "auth.email_verification.message":
      "We hebben een verificatielink naar je e-mailadres gestuurd",
    "auth.email_verification.check_inbox": "Controleer je inbox",
    "auth.email_verification.resend": "Verificatielink opnieuw versturen",
    "auth.email_verification.success": "E-mail succesvol geverifieerd",
    "auth.email_verification.error": "Fout bij verificatie van e-mail",

    // Passwortvalidierung
    "auth.password.requirements": "Wachtwoordvereisten:",
    "auth.password.min_length": "Wachtwoord moet minimaal 8 tekens bevatten",
    "auth.password.require_number":
      "Wachtwoord moet minimaal één cijfer bevatten",
    "auth.password.require_uppercase":
      "Wachtwoord moet minimaal één hoofdletter bevatten",
    "auth.password.require_lowercase":
      "Wachtwoord moet minimaal één kleine letter bevatten",
    "auth.password.require_special":
      "Wachtwoord moet minimaal één speciaal teken bevatten",
    "auth.password.match": "Wachtwoorden moeten overeenkomen",
    "auth.password.strength.weak": "Zwak",
    "auth.password.strength.medium": "Gemiddeld",
    "auth.password.strength.strong": "Sterk",

    // Formularvalidierung
    "auth.form.required": "Dit veld is verplicht",
    "auth.form.email_invalid": "Voer een geldig e-mailadres in",
    "auth.form.min_length": "Dit veld moet minimaal {length} tekens bevatten",
    "auth.form.max_length":
      "Dit veld mag niet meer dan {length} tekens bevatten",
    "auth.form.invalid": "Dit veld is ongeldig",

    // Zugänglichkeit
    "auth.accessibility.loading": "Laden, even geduld",
    "auth.accessibility.error": "Fout: {message}",
    "auth.accessibility.required_field": "Verplicht veld",
    "auth.accessibility.toggle_password": "Wachtwoord tonen/verbergen",
    "auth.accessibility.close_modal": "Venster sluiten",

    // API-Fehlermeldungen
    "auth.api.network_error": "Netwerkfout. Controleer je verbinding",
    "auth.api.server_error": "Serverfout. Probeer het later opnieuw",
    "auth.api.invalid_credentials": "Ongeldige inloggegevens",
    "auth.api.account_exists": "Er bestaat al een account met dit e-mailadres",
    "auth.api.email_not_found": "Geen account gevonden met dit e-mailadres",
    "auth.api.too_many_requests": "Te veel pogingen. Probeer het later opnieuw",

    // Service-Fehlermeldungen
    "auth.service.session_expired": "Je sessie is verlopen. Log opnieuw in",
    "auth.service.unauthorized": "Niet geautoriseerd. Log in",
    "auth.service.account_locked":
      "Je account is vergrendeld. Neem contact op met support",
    "auth.service.permission_denied": "Geen toestemming voor deze actie",
    "auth.service.invalid_credentials":
      "Ongeldige inloggegevens. Controleer je e-mail en wachtwoord.",
    "auth.service.too_many_attempts":
      "Te veel inlogpogingen. Wacht even voordat je het opnieuw probeert.",

    "nav.home": "Home",
    "nav.rules": "Regels",
    "category.no_image_available": "Geen afbeelding beschikbaar",
    "game.score": "Score",
    "game.round": "Ronde",
    "game.joker": "50:50 Joker",
    "difficulty.easy": "Gemakkelijk",
    "difficulty.medium": "Gemiddeld",
    "difficulty.hard": "Moeilijk",
    "category.difficulty.easy": "Gemakkelijk",
    "category.difficulty.medium": "Gemiddeld",
    "category.difficulty.hard": "Moeilijk",
    "game.select":
      "Verken de fascinerende wereld van muziek en test je kennis in onze interactieve muziekquizzen. Kies je favoriete genre en begin je melodieuze reis!",
    "game.welcome": "Welkom bij Melody Mind",
    "game.genre.list": "Genrekeuze",
    "game.search.label": "Zoek een genre",
    "game.search.description":
      "De lijst wordt automatisch gefilterd tijdens het typen",
    "game.genre.play.label": "Spelen",
    "game.genre.image": "Hoesfoto voor",
    "game.no.results": "Geen resultaten gevonden",
    "game.not.available": "Niet beschikbaar",
    "category.selected": "geselecteerd!",
    "category.difficulty.heading": "Kies je moeilijkheidsgraad",
    "category.difficulty.group": "Moeilijkheidsgraden",
    "category.difficulty.easy.label": "Start spel in gemakkelijke modus",
    "category.difficulty.medium.label": "Start spel in gemiddelde modus",
    "category.difficulty.hard.label": "Start spel in moeilijke modus",
    "category.image.alt": "Hoesfoto",
    "nav.menu.open": "Menu openen",
    "nav.menu.close": "Menu sluiten",
    "nav.menu.home": "Home",
    "nav.menu.rules": "Regels",
    "nav.menu.highscores": "Topscores",
    "nav.menu.profile": "Profiel",
    "nav.menu.logout": "Uitloggen",
    "nav.skip.main": "Naar hoofdinhoud",
    "game.end.title": "Spel Voorbij!",
    "game.end.motivation":
      "Geweldige prestatie! 🎉 Je muziekkennis is echt indrukwekkend. Daag jezelf uit met een nieuwe ronde en word een echte muzieklegende! 🎵",
    "game.end.score": "Behaalde score:",
    "game.end.newgame": "Nieuw Spel",
    "game.end.share": "Deel je succes!",
    "game.end.home": "Home",
    "game.feedback.resolution": "Resolutie",
    "game.feedback.media.section": "Mediasectie",
    "game.feedback.audio.preview": "Muziekvoorbeeld",
    "game.feedback.subtitles": "Ondertitels",
    "game.feedback.audio.unsupported":
      "Je browser ondersteunt geen audioweergave.",
    "game.feedback.streaming.links": "Muziekstreamingdiensten",
    "game.feedback.listen.spotify": "Luister op Spotify",
    "game.feedback.listen.deezer": "Luister op Deezer",
    "game.feedback.listen.apple": "Luister op Apple Music",
    "game.feedback.next.round": "Volgende Ronde",
    "game.current.round": "Ronde",
    "game.current.round.label": "Huidig rondenummer",
    "game.joker.options": "Joker Opties",
    "game.joker.use": "Gebruik 50:50 Joker",
    "game.joker.description": "Verwijdert twee onjuiste antwoordopties",
    "loading.content": "Inhoud laden...",
    "share.title": "Deel je succes!",
    "share.buttons.group.label": "Sociale media deelopties",
    "share.facebook": "Delen op Facebook",
    "share.whatsapp": "Delen op WhatsApp",
    "share.native": "Delen met...",
    "share.native.label": "Delen",
    "share.twitter": "Delen op X/Twitter",
    "share.email": "Delen via e-mail",
    "share.email.label": "E-mail",
    "share.copy": "Deeltekst kopiëren naar klembord",
    "share.copy.label": "Tekst kopiëren",
    "error.default": "Er is een fout opgetreden",
    "error.close": "Foutmelding sluiten",
    "coins.collected": "Verzamelde munten",
    "language.picker.label": "Taalkeuze",
    "language.change": "Wijzig de taal van de website",
    "language.select.label": "Selecteer je voorkeurstaal",
    "language.de": "Duits",
    "language.en": "Engels",
    "language.es": "Spaans",
    "language.fr": "Frans",
    "language.it": "Italiaans",
    "language.pt": "Portugees",
    "language.da": "Deens",
    "language.nl": "Nederlands",
    "language.sv": "Zweeds",
    "language.fi": "Fins",
    "language.de.label": "Website weergeven in het Duits",
    "language.en.label": "Website weergeven in het Engels",
    "language.es.label": "Website weergeven in het Spaans",
    "language.fr.label": "Website weergeven in het Frans",
    "language.it.label": "Website weergeven in het Italiaans",
    "language.pt.label": "Website weergeven in het Portugees",
    "language.da.label": "Website weergeven in het Deens",
    "language.nl.label": "Website weergeven in het Nederlands",
    "language.sv.label": "Website weergeven in het Zweeds",
    "language.fi.label": "Website weergeven in het Fins",
    "playlist.item.unavailable": "Deze inhoud is nog niet beschikbaar",
    "playlist.item.status": "Status",
    "playlist.item.coming.soon": "Binnenkort beschikbaar",
    "game.area.label": "Spelgebied",
    "game.options.label": "Antwoordopties",
    "game.answer.correct": "Correct! {points} punten + {bonus} bonuspunten",
    "game.answer.wrong": "Onjuist! Het juiste antwoord was: {answer}",
    "error.invalid.question": "Ongeldige vraag of geen opties beschikbaar",
    "error.no.initial.question": "Geen geldige eerste vraag gevonden",
    "error.no.albums.found": "Geen albums gevonden voor categorie {category}",
    "meta.keywords":
      "Muziekquiz, Muziekspel, Liedjesquiz, Artiestquiz, Online Muziekquiz, Muziek Trivia, Melody Mind, Muzikaal Raadspel",
    "knowledge.title": "Muziek Kennisbank",
    "knowledge.intro":
      "Duik in de fascinerende wereld van muziekgeschiedenis. Hier vind je boeiende artikelen over verschillende muziektijdperken, genres en hun ontwikkeling. Ontdek interessante feiten en breid je muziekkennis uit.",
    "knowledge.search.label": "Zoek artikelen",
    "knowledge.search.placeholder": "Zoeken...",
    "knowledge.filter.all": "Alle trefwoorden",
    "knowledge.no.results":
      "Geen artikelen gevonden. Probeer andere zoektermen.",
    "knowledge.no.results.help":
      "Probeer andere zoektermen of reset je zoekopdracht",
    "knowledge.keyboard.instructions":
      "Gebruik de pijltjestoetsen om tussen artikelen te navigeren. Druk op Enter om een artikel te openen.",
    "knowledge.empty": "Geen artikelen beschikbaar in deze categorie",
    "game.remaining": "resterend",
    "game.default.headline": "Spel",
    "popup.score": "Score: {score}",
    "popup.golden.lp.score": "Behaalde punten: {score}",
    "nav.donate.heading": "Steun ons",
    "nav.donate.paypal": "Doneer via PayPal",
    "nav.donate.coffee": "Koop me een koffie",
    "nav.title": "Navigatie",
    "nav.menu.text": "Menu",
    "game.categories.empty.headline": "Geen genres gevonden",
    "game.categories.empty.text":
      "Helaas zijn er geen categorieën gevonden. Probeer het later nog eens.",
    "game.categories.no.playable.headline": "Geen speelbare genres",
    "game.categories.no.playable.text":
      "Er zijn momenteel geen speelbare categorieën. Kom later terug.",
    "knowledge.reading.time": "min leestijd",
    "knowledge.breadcrumb.label": "Kruimelpadnavigatie",
    "knowledge.listen.heading": "Luister naar gerelateerde muziek",
    "knowledge.back.to.list": "Terug naar artikelen",
    "knowledge.interact.heading": "Luister & Speel",
    "knowledge.play.heading": "Speel dit genre",
    "knowledge.play.description":
      "Test je kennis over dit muziekgenre in onze interactieve quiz!",
    "knowledge.play.category": "Start muziekquiz",
    "category.play": "Spelen",
    "play.cover.puzzle": "Speel Cover Puzzel",
    "play.cover.puzzle.description":
      "Bij Cover Puzzel moet je albumhoezen herkennen terwijl ze geleidelijk worden onthuld. Hoe sneller je het juiste album identificeert, hoe meer punten je verdient. Test je visuele geheugen voor muziekhoezen!",
    "podcast.page.title": "Muziekpodcasts | Melody Mind",
    "podcast.page.heading": "Boeiende muziekpodcasts",
    "podcast.page.description":
      "Duik in de muziekwereld met onze boeiende podcasts. Ontdek spannende verhalen, fascinerende achtergronden en bepalende momenten uit verschillende muziektijdperken - perfect voor iedereen die niet alleen naar muziek wil luisteren, maar deze echt wil begrijpen. Onze podcasts worden om de twee weken gepubliceerd en zijn uitsluitend in het Duits en Engels beschikbaar.",
    "podcast.search.label": "Zoek podcasts",
    "podcast.search.placeholder": "Zoek naar fascinerende muziekverhalen...",
    "podcast.search.status.all": "Alle podcasts weergegeven",
    "podcast.search.status.one": "1 podcast gevonden",
    "podcast.search.status.multiple": "{count} podcasts gevonden",
    "podcast.no.results":
      "Geen overeenkomende podcasts gevonden. Probeer een andere zoekterm.",
    "podcast.duration.error": "Duur niet beschikbaar",
    "podcast.play": "Afspelen",
    "podcast.intro.title": "Introductie tot Astropod",
    "podcast.intro.description":
      "Astropod is een gratis en open-source serverloze podcastoplossing.",
    "podcast.deploy.title": "Implementeer je serverloze podcast in 2 minuten",
    "podcast.deploy.description": "Leer hoe je snel je podcast implementeert.",
    "podcast.auth.title":
      "Gebruikersauthenticatie en dashboardtoegang configureren",
    "podcast.auth.description":
      "Schakel authenticatie in en krijg toegang tot het dashboard.",
    "podcast.config.title": "Je Astropod Podcast configureren",
    "podcast.config.description": "Leer hoe je je podcast configureert.",
    "podcast.publish.title": "Publiceer je eerste aflevering",
    "podcast.publish.description": "Publiceer je eerste aflevering met gemak.",
    "podcast.conclusion.title": "Conclusie",
    "podcast.conclusion.description": "Samenvatting en volgende stappen.",
    "podcast.listen.on": "Luister op",
    "podcast.language.availability":
      "Onze podcasts zijn uitsluitend beschikbaar in het Duits en Engels.",
    "podcast.listen.heading": "Luister naar onze podcasts",
    "login.welcome": "Welkom bij Melody Mind!",
    "login.description":
      "Begin aan een muzikale reis door de tijd! Test je kennis in spannende quizzen, verken fascinerende muziekgenres en duik in onze boeiende podcasts. Toon je vaardigheden, verzamel punten en word een echte muzieklegende!",
    "index.continue": "Laten we beginnen!",
    "index.start.game.label": "Begin je muzikale reis",
    "index.welcome.footnote":
      "Gemaakt door muziekliefhebbers voor muziekliefhebbers. Veel plezier!",
    "accessibility.wcag": "Deze applicatie streeft naar WCAG AAA-naleving.",
    "game.instructions.title": "Spelinstructies",
    "game.instructions.puzzle":
      "Probeer het album te raden terwijl de hoes geleidelijk wordt onthuld. Hoe sneller je het juiste antwoord geeft, hoe meer punten je verdient.",
    "game.time.remaining": "Resterende tijd:",
    "game.puzzle.label": "Albumhoes puzzel",
    "game.puzzle.loading": "Puzzel laden...",
    "game.options.legend": "Kies het juiste album",
    "game.next.round": "Start volgende ronde",
    "game.puzzle.revealed": "{percent}% van de albumhoes is onthuld",
    "game.option.choose": "Kies",
    "game.options.available": "Antwoordopties zijn nu beschikbaar",
    "game.time.remaining.seconds": "{seconds} seconden over",
    "game.time.up": "Tijd is op! Het juiste album was:",
    "game.correct.answer": "Juist antwoord",
    "game.slower.speed": "Langzamer spel",
    "game.normal.speed": "Normale snelheid",
    "game.skip.to.answers": "Ga naar antwoordopties",
    "game.next": "Volgende",
    "aria.pressed": "Ingedrukt",
    "aria.expanded": "Uitgevouwen",
    "aria.shortcuts.panel": "Sneltoetsen paneel",
    "aria.shortcuts.list": "Lijst van beschikbare sneltoetsen",
    "playlist.page.title": "Muziek afspeellijsten | Melody Mind",
    "playlist.page.heading": "Ontdek onze muziek afspeellijsten",
    "playlist.page.description":
      "Duik in zorgvuldig samengestelde afspeellijsten uit verschillende tijdperken en genres. Perfect om nieuwe muziek te ontdekken of je favoriete klassiekers opnieuw te beluisteren.",
    "playlist.search.label": "Zoek in afspeellijsten",
    "playlist.search.placeholder": "Zoek op muziektijdperk of stijl...",
    "playlist.filter.all": "Alle tijdperken",
    "playlist.no.results":
      "Geen overeenkomende afspeellijsten gevonden. Probeer een andere zoekterm.",
    "playlist.listen.on": "Luister op",
    "playlist.listen.spotify": "Luister op Spotify",
    "playlist.listen.deezer": "Luister op Deezer",
    "playlist.listen.apple": "Luister op Apple Music",
    "playlist.decade.filter": "Filter op decennium",
    "footer.rights": "Alle rechten voorbehouden",
    "footer.donate": "Doneren",
    "game.chronology.title": "Muziek-chronologie",
    "game.chronology.description":
      "Plaats deze albums in volgorde van uitgavejaar (oudste eerst)",
    "game.chronology.area.label": "Chronologie-spelgebied",
    "game.chronology.result": "Resultaat",
    "game.chronology.correct": "Correct",
    "game.chronology.wrong": "Zou op positie {position} moeten staan",
    "game.chronology.score": "Resultaat: {score} punten",
    "game.chronology.details": "{correct} van {total} albums correct geplaatst",
    "game.chronology.year": "Jaar: {year}",
    "game.chronology.drag.help":
      "Gebruik de pijltjestoetsen ↑/↓ of sleep en laat los om te sorteren",
    "game.submit.answer": "Controleer antwoord",
    "game.chronology.up": "Omhoog",
    "game.chronology.down": "Omlaag",
    "game.chronology.position": "Positie",
    "game.chronology.start": "Begin",
    "game.chronology.end": "Einde",
    "common.back.to.top": "Terug naar boven",
    "knowledge.articles.heading": "Kennisartikelen",
    "knowledge.search.heading": "Artikelen Zoeken",
    "knowledge.search.description":
      "Artikelen worden automatisch gefilterd tijdens het typen",
    "knowledge.search.reset": "Zoekopdracht resetten",
    "knowledge.search.reset.text": "Resetten",

    // Profielpagina
    "profile.title": "Mijn Profiel",
    "profile.description":
      "Beheer je persoonlijke informatie en bekijk je spelstatistieken",
    "profile.loading": "Profielgegevens laden...",
    "profile.error": "Fout bij het laden van profielgegevens",
    "profile.auth.required": "Je moet ingelogd zijn om je profiel te bekijken",
    "profile.user.info": "Gebruikersinformatie",
    "profile.user.since": "Lid sinds",
    "profile.stats.title": "Spelstatistieken",
    "profile.stats.quiz": "Quiz",
    "profile.stats.chronology": "Chronologie",
    "profile.stats.total.score": "Totale score",
    "profile.stats.games.played": "Gespeelde spellen",
    "profile.stats.highest.score": "Hoogste score",
    "profile.recent.games": "Recente spelresultaten",
    "profile.recent.games.empty": "Je hebt nog geen spellen gespeeld",
    "profile.recent.game.mode": "Spelmodus",
    "profile.recent.game.category": "Categorie",
    "profile.recent.game.difficulty": "Moeilijkheidsgraad",
    "profile.recent.game.score": "Score",
    "profile.recent.game.date": "Datum",
    "profile.nav.aria": "Navigatie naar gebruikersprofiel",
    "profile.nav.link": "Naar profiel",

    // Highscores-pagina
    "highscores.title": "Topscores",
    "highscores.description":
      "Bekijk de beste scores in verschillende spelmodi en categorieën",
    "highscores.loading": "Topscores laden...",
    "highscores.error": "Fout bij het laden van topscores",
    "highscores.empty": "Geen topscores gevonden",
    "highscores.filter.title": "Filter topscores",
    "highscores.filter.game.mode": "Spelmodus",
    "highscores.filter.category": "Categorie",
    "highscores.filter.all": "Alle",
    "highscores.filter.search": "Zoek categorieën...",
    "highscores.filter.no.results": "Geen categorieën gevonden",
    "highscores.table.title": "Topscores",
    "highscores.table.rank": "Rang",
    "highscores.table.player": "Speler",
    "highscores.table.game.mode": "Spelmodus",
    "highscores.table.category": "Categorie",
    "highscores.table.score": "Score",
    "highscores.table.date": "Datum",
  },
  sv: {
    // Auth-Komponenten

    // Achievement Categories
    "achievements.category.games_played": "Spelade spel",
    "achievements.category.perfect_games": "Perfekta spel",
    "achievements.category.total_score": "Total poäng",
    "achievements.category.daily_streak": "Daglig svit",
    "achievements.category.daily_games": "Dagliga spel",

    // Achievement System
    "achievements.title": "Prestationer",
    "achievements.description":
      "Upptäck och lås upp prestationer för att följa din framsteg",
    "achievements.loading": "Laddar prestationer...",
    "achievements.error": "Fel vid laddning av prestationer",
    "achievements.empty": "Inga prestationer hittades",
    "achievements.category.bronze": "Brons",
    "achievements.category.silver": "Silver",
    "achievements.category.gold": "Guld",
    "achievements.category.platinum": "Platina",
    "achievements.category.diamond": "Diamant",
    "achievements.category.time": "Tid",
    "achievements.status.locked": "Låst",
    "achievements.status.in_progress": "Pågående",
    "achievements.status.unlocked": "Upplåst",
    "achievements.progress": "Framsteg: {progress}%",
    "achievements.unlocked_at": "Upplåst den {date}",
    "achievements.points": "Poäng: {points}",
    "achievements.rarity": "Sällsynthet: {percentage}%",
    "achievements.notification.unlocked": "Prestation upplåst!",
    "achievements.notification.progress": "Prestationsframsteg uppdaterat!",
    "achievements.nav.link": "Prestationer",
    "achievements.nav.aria": "Navigera till prestationer",
    "achievements.badge.new": "Nya prestationer tillgängliga",
    "achievements.filter.title": "Filtrera prestationer",
    "achievements.filter.status": "Status",
    "achievements.filter.status.aria": "Filtrera prestationer efter status",
    "achievements.filter.category": "Kategori",
    "achievements.filter.category.aria": "Filtrera prestationer efter kategori",
    "achievements.filter.all": "Alla",
    "achievements.filter.all_categories": "Alla kategorier",
    "achievements.summary.title": "Prestationsframsteg",
    "achievements.summary.total": "Totalt",
    "achievements.summary.unlocked": "Upplåsta",
    "achievements.summary.progress": "Framsteg",
    "achievements.notification.close": "Stäng notifikation",
    "achievements.rarity.tooltip":
      "Procentandel spelare som har låst upp denna prestation",

    // Game Counter Achievements
    "achievements.games_played_1": "Nybörjare: 1 Spel",
    "achievements.games_played_1.description":
      "Spela ditt första spel i valfritt läge",
    "achievements.games_played_5": "Nybörjare: 5 Spel",
    "achievements.games_played_5.description": "Spela 5 spel i valfritt läge",
    "achievements.games_played_10": "Nybörjare: 10 Spel",
    "achievements.games_played_10.description": "Spela 10 spel i valfritt läge",
    "achievements.games_played_25": "Amatör: 25 Spel",
    "achievements.games_played_25.description": "Spela 25 spel i valfritt läge",
    "achievements.games_played_50": "Amatör: 50 Spel",
    "achievements.games_played_50.description": "Spela 50 spel i valfritt läge",
    "achievements.games_played_75": "Amatör: 75 Spel",
    "achievements.games_played_75.description": "Spela 75 spel i valfritt läge",
    "achievements.games_played_100": "Avancerad: 100 Spel",
    "achievements.games_played_100.description":
      "Spela 100 spel i valfritt läge",
    "achievements.games_played_150": "Avancerad: 150 Spel",
    "achievements.games_played_150.description":
      "Spela 150 spel i valfritt läge",
    "achievements.games_played_200": "Avancerad: 200 Spel",
    "achievements.games_played_200.description":
      "Spela 200 spel i valfritt läge",
    "achievements.games_played_300": "Expert: 300 Spel",
    "achievements.games_played_300.description":
      "Spela 300 spel i valfritt läge",
    "achievements.games_played_400": "Expert: 400 Spel",
    "achievements.games_played_400.description":
      "Spela 400 spel i valfritt läge",
    "achievements.games_played_500": "Expert: 500 Spel",
    "achievements.games_played_500.description":
      "Spela 500 spel i valfritt läge",
    "achievements.games_played_750": "Mästare: 750 Spel",
    "achievements.games_played_750.description":
      "Spela 750 spel i valfritt läge",
    "achievements.games_played_1000": "Mästare: 1000 Spel",
    "achievements.games_played_1000.description":
      "Spela 1000 spel i valfritt läge",
    "achievements.games_played_1500": "Mästare: 1500 Spel",
    "achievements.games_played_1500.description":
      "Spela 1500 spel i valfritt läge",
    "achievements.games_played_2000": "Mästare: 2000 Spel",
    "achievements.games_played_2000.description":
      "Spela 2000 spel i valfritt läge",
    "achievements.games_played_2500": "Legend: 2500 Spel",
    "achievements.games_played_2500.description":
      "Spela 2500 spel i valfritt läge",
    "achievements.games_played_3000": "Legend: 3000 Spel",
    "achievements.games_played_3000.description":
      "Spela 3000 spel i valfritt läge",
    "achievements.games_played_4000": "Legend: 4000 Spel",
    "achievements.games_played_4000.description":
      "Spela 4000 spel i valfritt läge",
    "achievements.games_played_5000": "Legend: 5000 Spel",
    "achievements.games_played_5000.description":
      "Spela 5000 spel i valfritt läge",

    // Perfect Games Achievements
    "achievements.perfect_games_1": "Lyckträff: 1 Perfekt Spel",
    "achievements.perfect_games_1.description": "Uppnå maximal poäng i 1 spel",
    "achievements.perfect_games_2": "Lyckträff: 2 Perfekta Spel",
    "achievements.perfect_games_2.description": "Uppnå maximal poäng i 2 spel",
    "achievements.perfect_games_3": "Lyckträff: 3 Perfekta Spel",
    "achievements.perfect_games_3.description": "Uppnå maximal poäng i 3 spel",
    "achievements.perfect_games_5": "Precision: 5 Perfekta Spel",
    "achievements.perfect_games_5.description": "Uppnå maximal poäng i 5 spel",
    "achievements.perfect_games_7": "Precision: 7 Perfekta Spel",
    "achievements.perfect_games_7.description": "Uppnå maximal poäng i 7 spel",
    "achievements.perfect_games_10": "Precision: 10 Perfekta Spel",
    "achievements.perfect_games_10.description":
      "Uppnå maximal poäng i 10 spel",
    "achievements.perfect_games_15": "Erfarenhet: 15 Perfekta Spel",
    "achievements.perfect_games_15.description":
      "Uppnå maximal poäng i 15 spel",
    "achievements.perfect_games_20": "Erfarenhet: 20 Perfekta Spel",
    "achievements.perfect_games_20.description":
      "Uppnå maximal poäng i 20 spel",
    "achievements.perfect_games_25": "Erfarenhet: 25 Perfekta Spel",
    "achievements.perfect_games_25.description":
      "Uppnå maximal poäng i 25 spel",
    "achievements.perfect_games_30": "Mästerskap: 30 Perfekta Spel",
    "achievements.perfect_games_30.description":
      "Uppnå maximal poäng i 30 spel",
    "achievements.perfect_games_40": "Mästerskap: 40 Perfekta Spel",
    "achievements.perfect_games_40.description":
      "Uppnå maximal poäng i 40 spel",
    "achievements.perfect_games_50": "Mästerskap: 50 Perfekta Spel",
    "achievements.perfect_games_50.description":
      "Uppnå maximal poäng i 50 spel",
    "achievements.perfect_games_75": "Perfektion: 75 Perfekta Spel",
    "achievements.perfect_games_75.description":
      "Uppnå maximal poäng i 75 spel",
    "achievements.perfect_games_100": "Perfektion: 100 Perfekta Spel",
    "achievements.perfect_games_100.description":
      "Uppnå maximal poäng i 100 spel",
    "achievements.perfect_games_150": "Perfektion: 150 Perfekta Spel",
    "achievements.perfect_games_150.description":
      "Uppnå maximal poäng i 150 spel",
    "achievements.perfect_games_200": "Legend: 200 Perfekta Spel",
    "achievements.perfect_games_200.description":
      "Uppnå maximal poäng i 200 spel",
    "achievements.perfect_games_300": "Legend: 300 Perfekta Spel",
    "achievements.perfect_games_300.description":
      "Uppnå maximal poäng i 300 spel",
    "achievements.perfect_games_400": "Legend: 400 Perfekta Spel",
    "achievements.perfect_games_400.description":
      "Uppnå maximal poäng i 400 spel",
    "achievements.perfect_games_500": "Legend: 500 Perfekta Spel",
    "achievements.perfect_games_500.description":
      "Uppnå maximal poäng i 500 spel",

    // Score Achievements
    "achievements.total_score_100": "Samlare: 100 Poäng",
    "achievements.total_score_100.description": "Samla 100 poäng i alla spel",
    "achievements.total_score_250": "Samlare: 250 Poäng",
    "achievements.total_score_250.description": "Samla 250 poäng i alla spel",
    "achievements.total_score_500": "Samlare: 500 Poäng",
    "achievements.total_score_500.description": "Samla 500 poäng i alla spel",
    "achievements.total_score_1000": "Poängjägare: 1 000 Poäng",
    "achievements.total_score_1000.description":
      "Samla 1 000 poäng i alla spel",
    "achievements.total_score_2500": "Poängjägare: 2 500 Poäng",
    "achievements.total_score_2500.description":
      "Samla 2 500 poäng i alla spel",
    "achievements.total_score_5000": "Poängjägare: 5 000 Poäng",
    "achievements.total_score_5000.description":
      "Samla 5 000 poäng i alla spel",
    "achievements.total_score_7500": "Poängmagnet: 7 500 Poäng",
    "achievements.total_score_7500.description":
      "Samla 7 500 poäng i alla spel",
    "achievements.total_score_10000": "Poängmagnet: 10 000 Poäng",
    "achievements.total_score_10000.description":
      "Samla 10 000 poäng i alla spel",
    "achievements.total_score_15000": "Poängmagnet: 15 000 Poäng",
    "achievements.total_score_15000.description":
      "Samla 15 000 poäng i alla spel",
    "achievements.total_score_20000": "Poängmästare: 20 000 Poäng",
    "achievements.total_score_20000.description":
      "Samla 20 000 poäng i alla spel",
    "achievements.total_score_30000": "Poängmästare: 30 000 Poäng",
    "achievements.total_score_30000.description":
      "Samla 30 000 poäng i alla spel",
    "achievements.total_score_50000": "Poängmästare: 50 000 Poäng",
    "achievements.total_score_50000.description":
      "Samla 50 000 poäng i alla spel",
    "achievements.total_score_75000": "Elit: 75 000 Poäng",
    "achievements.total_score_75000.description":
      "Samla 75 000 poäng i alla spel",
    "achievements.total_score_100000": "Elit: 100 000 Poäng",
    "achievements.total_score_100000.description":
      "Samla 100 000 poäng i alla spel",
    "achievements.total_score_150000": "Elit: 150 000 Poäng",
    "achievements.total_score_150000.description":
      "Samla 150 000 poäng i alla spel",
    "achievements.total_score_200000": "Legend: 200 000 Poäng",
    "achievements.total_score_200000.description":
      "Samla 200 000 poäng i alla spel",
    "achievements.total_score_300000": "Legend: 300 000 Poäng",
    "achievements.total_score_300000.description":
      "Samla 300 000 poäng i alla spel",
    "achievements.total_score_400000": "Legend: 400 000 Poäng",
    "achievements.total_score_400000.description":
      "Samla 400 000 poäng i alla spel",
    "achievements.total_score_500000": "Legend: 500 000 Poäng",
    "achievements.total_score_500000.description":
      "Samla 500 000 poäng i alla spel",

    // Daily Streak Achievements
    "achievements.daily_streak_1": "Daglig Spelare",
    "achievements.daily_streak_1.description": "Spela i 1 dag i rad",
    "achievements.daily_streak_3": "Musikentusiast",
    "achievements.daily_streak_3.description": "Spela i 3 dagar i rad",
    "achievements.daily_streak_5": "Melodimästare",
    "achievements.daily_streak_5.description": "Spela i 5 dagar i rad",
    "achievements.daily_streak_7": "Perfekt Vecka",
    "achievements.daily_streak_7.description": "Spela i 7 dagar i rad",
    "achievements.daily_streak_14": "Musikveteran",
    "achievements.daily_streak_14.description": "Spela i 14 dagar i rad",
    "achievements.daily_streak_30": "Melodilegend",
    "achievements.daily_streak_30.description": "Spela i 30 dagar i rad",

    // Daily Games Achievements
    "achievements.daily_games_3": "Uppvärmning",
    "achievements.daily_games_3.description": "Spela 3 spel på en dag",
    "achievements.daily_games_5": "Musiksession",
    "achievements.daily_games_5.description": "Spela 5 spel på en dag",
    "achievements.daily_games_10": "Musikmaraton",
    "achievements.daily_games_10.description": "Spela 10 spel på en dag",
    "achievements.daily_games_20": "Melodimaraton",
    "achievements.daily_games_20.description": "Spela 20 spel på en dag",
    "achievements.daily_games_30": "Ultra Musikalisk",
    "achievements.daily_games_30.description": "Spela 30 spel på en dag",
    "achievements.daily_games_50": "Melodigalenskap",
    "achievements.daily_games_50.description": "Spela 50 spel på en dag",

    // Achievement error messages
    "errors.achievements.fetch": "Fel vid hämtning av prestationer",
    "errors.achievements.update": "Fel vid uppdatering av prestationsframsteg",
    "errors.achievements.unlock": "Fel vid upplåsning av prestation",
    "errors.achievements.check": "Fel vid kontroll av prestationer",

    "auth.required.title": "Inloggning krävs",
    "auth.required.description":
      "Vänligen logga in för att komma åt detta område",
    "auth.login.title": "Logga in",
    "auth.register.title": "Registrera",
    "auth.toggle.login": "Byt till inloggning",
    "auth.toggle.register": "Byt till registrering",
    "auth.login.submit": "Logga in",
    "auth.register.submit": "Registrera",
    "auth.form.submit": "Skicka",
    "auth.form.loading": "Bearbetar...",
    "auth.tabs.login": "Logga in",
    "auth.tabs.register": "Registrera",
    "auth.validation.processing": "Validerar uppgifter...",
    "auth.form.error.general": "Ett fel har inträffat",
    "auth.form.success": "Klart!",
    "auth.form.email_required": "E-postadress krävs",
    "auth.form.email_invalid_short": "Ogiltig e-postadress",
    "auth.form.loading_text": "Laddar...",
    "auth.form.send_reset_link": "Skicka återställningslänk",
    "auth.form.password_required": "Lösenord krävs",
    "auth.form.password_requirements": "Lösenordet uppfyller inte alla krav",
    "auth.form.password_confirm_required": "Lösenordsbekräftelse krävs",
    "auth.form.passwords_not_match": "Lösenorden matchar inte",
    "auth.password_reset.success_message":
      "Om det finns ett konto med denna e-postadress har vi skickat instruktioner för att återställa ditt lösenord.",
    "auth.password_reset.error_message":
      "Ett fel har uppstått. Försök igen senare.",
    "auth.password_reset.complete_success":
      "Lösenordet har återställts. Du kan nu logga in med ditt nya lösenord.",
    "auth.password_reset.complete_error":
      "Lösenordsåterställning misslyckades. Kontrollera dina uppgifter eller begär en ny återställningslänk.",

    "auth.login.email": "E-postadress",
    "auth.login.email.placeholder": "Ange din e-postadress",
    "auth.login.password": "Lösenord",
    "auth.login.password.placeholder": "Ange ditt lösenord",
    "auth.login.remember": "Kom ihåg mig",
    "auth.login.forgot_password": "Glömt lösenord?",
    "auth.login.success": "Inloggning lyckades",
    "auth.login.error": "Fel vid inloggning",

    "auth.register.name": "Fullständigt namn",
    "auth.register.email": "E-postadress",
    "auth.register.email.placeholder": "Ange din e-postadress",
    "auth.register.username": "Användarnamn",
    "auth.register.username.placeholder": "Välj ett användarnamn",
    "auth.register.password": "Lösenord",
    "auth.register.password.placeholder": "Skapa ett säkert lösenord",
    "auth.register.confirm_password": "Bekräfta lösenord",
    "auth.register.password_confirm.placeholder": "Ange ditt lösenord igen",
    "auth.register.terms": "Jag godkänner villkoren",
    "auth.register.success": "Registrering lyckades",
    "auth.register.error": "Fel vid registrering",

    "auth.password_reset.title": "Återställ lösenord",
    "auth.password_reset.submit": "Skicka återställningslänk",
    "auth.password_reset.email": "E-postadress",
    "auth.password_reset.email.placeholder":
      "Ange din registrerade e-postadress",
    "auth.password_reset.back_to_login": "Tillbaka till inloggning",
    "auth.password_reset.login": "Logga in",
    "auth.password_reset.success":
      "En återställningslänk har skickats till din e-post",
    "auth.password_reset.error": "Fel vid skickande av återställningslänk",
    "auth.password_reset.new_password": "Nytt lösenord",
    "auth.password_reset.confirm_password": "Bekräfta nytt lösenord",
    "auth.password_reset.change_submit": "Ändra lösenord",

    "auth.email_verification.title": "E-postverifiering",
    "auth.email_verification.message":
      "Vi har skickat en verifieringslänk till din e-post",
    "auth.email_verification.check_inbox": "Vänligen kontrollera din inkorg",
    "auth.email_verification.resend": "Skicka verifieringslänk igen",
    "auth.email_verification.success": "E-post verifierad",
    "auth.email_verification.error": "Fel vid verifiering av e-post",

    // Passwortvalidierung
    "auth.password.requirements": "Lösenordskrav:",
    "auth.password.min_length": "Lösenordet måste innehålla minst 8 tecken",
    "auth.password.require_number":
      "Lösenordet måste innehålla minst en siffra",
    "auth.password.require_uppercase":
      "Lösenordet måste innehålla minst en stor bokstav",
    "auth.password.require_lowercase":
      "Lösenordet måste innehålla minst en liten bokstav",
    "auth.password.require_special":
      "Lösenordet måste innehålla minst ett specialtecken",
    "auth.password.match": "Lösenorden måste matcha",
    "auth.password.strength.weak": "Svagt",
    "auth.password.strength.medium": "Medel",
    "auth.password.strength.strong": "Starkt",

    // Formularvalidierung
    "auth.form.required": "Detta fält är obligatoriskt",
    "auth.form.email_invalid": "Ange en giltig e-postadress",
    "auth.form.min_length": "Detta fält måste innehålla minst {length} tecken",
    "auth.form.max_length":
      "Detta fält får inte innehålla mer än {length} tecken",
    "auth.form.invalid": "Detta fält är ogiltigt",

    // Zugänglichkeit
    "auth.accessibility.loading": "Laddar, vänligen vänta",
    "auth.accessibility.error": "Fel: {message}",
    "auth.accessibility.required_field": "Obligatoriskt fält",
    "auth.accessibility.toggle_password": "Visa/dölj lösenord",
    "auth.accessibility.close_modal": "Stäng fönster",

    // API-Fehlermeldungen
    "auth.api.network_error": "Nätverksfel. Kontrollera din anslutning",
    "auth.api.server_error": "Serverfel. Försök igen senare",
    "auth.api.invalid_credentials": "Ogiltiga inloggningsuppgifter",
    "auth.api.account_exists": "Det finns redan ett konto med denna e-post",
    "auth.api.email_not_found": "Inget konto hittades med denna e-post",
    "auth.api.too_many_requests": "För många försök. Försök igen senare",

    // Service-Fehlermeldungen
    "auth.service.session_expired": "Din session har gått ut. Logga in igen",
    "auth.service.unauthorized": "Obehörig. Logga in",
    "auth.service.account_locked": "Ditt konto har låsts. Kontakta support",
    "auth.service.permission_denied": "Åtkomst nekad för denna åtgärd",
    "auth.service.invalid_credentials":
      "Ogiltiga inloggningsuppgifter. Kontrollera din e-post och lösenord.",
    "auth.service.too_many_attempts":
      "För många inloggningsförsök. Vänta en stund innan du försöker igen.",

    "nav.home": "Hem",
    "nav.rules": "Regler",
    "category.no_image_available": "Ingen bild tillgänglig",
    "game.score": "Poäng",
    "game.round": "Runda",
    "game.joker": "50:50 Joker",
    "difficulty.easy": "Lätt",
    "difficulty.medium": "Medel",
    "difficulty.hard": "Svår",
    "category.difficulty.easy": "Lätt",
    "category.difficulty.medium": "Medel",
    "category.difficulty.hard": "Svår",
    "game.select":
      "Utforska musikens fascinerande värld och testa dina kunskaper i interaktiva musikfrågesporter. Välj din favoritgenre och börja din melodiska resa!",
    "game.welcome": "Välkommen till Melody Mind",
    "game.genre.list": "Genremeny",
    "game.search.label": "Sök genre",
    "game.search.description": "Listan filtreras automatiskt medan du skriver",
    "game.genre.play.label": "Spela",
    "game.genre.image": "Omslagsbild för genre",
    "game.no.results": "Inga sökresultat",
    "game.not.available": "Inte tillgängligt",
    "category.selected": "vald!",
    "category.difficulty.heading": "Välj svårighetsgrad",
    "category.difficulty.group": "Svårighetsgrader",
    "category.difficulty.easy.label": "Starta spelet på lätt nivå",
    "category.difficulty.medium.label": "Starta spelet på medelnivå",
    "category.difficulty.hard.label": "Starta spelet på svår nivå",
    "category.image.alt": "Omslagsbild",
    "nav.menu.open": "Öppna meny",
    "nav.menu.close": "Stäng meny",
    "nav.menu.home": "Hem",
    "nav.menu.rules": "Regler",
    "nav.menu.highscores": "Highscores",
    "nav.menu.profile": "Profil",
    "nav.menu.logout": "Logga ut",
    "nav.skip.main": "Gå till huvudinnehåll",
    "game.end.title": "Spelet är slut!",
    "game.end.motivation":
      "Fantastisk prestation! 🎉 Din musikkunskap är verkligen imponerande. Utmana dig själv i en ny runda och bli en äkta musiklegend! 🎵",
    "game.end.score": "Uppnådda poäng:",
    "game.end.newgame": "Nytt spel",
    "game.end.share": "Dela din framgång!",
    "game.end.home": "Hem",
    "game.feedback.resolution": "Lösning",
    "game.feedback.media.section": "Mediasektion",
    "game.feedback.audio.preview": "Musikförhandslyssning",
    "game.feedback.subtitles": "Undertexter",
    "game.feedback.audio.unsupported":
      "Din webbläsare stöder inte ljuduppspelning.",
    "game.feedback.streaming.links": "Musikstreamingtjänster",
    "game.feedback.listen.spotify": "Lyssna på Spotify",
    "game.feedback.listen.deezer": "Lyssna på Deezer",
    "game.feedback.listen.apple": "Lyssna på Apple Music",
    "game.feedback.next.round": "Nästa runda",
    "game.current.round": "Runda",
    "game.current.round.label": "Aktuellt rundnummer",
    "game.joker.options": "Jokeralternativ",
    "game.joker.use": "Använd 50:50 Joker",
    "game.joker.description": "Tar bort två felaktiga svarsalternativ",
    "loading.content": "Laddar innehåll...",
    "share.title": "Dela din framgång!",
    "share.buttons.group.label": "Alternativ för delning på sociala medier",
    "share.facebook": "Dela på Facebook",
    "share.whatsapp": "Dela på WhatsApp",
    "share.native": "Dela...",
    "share.native.label": "Dela",
    "share.twitter": "Dela på X/Twitter",
    "share.email": "Dela via e-post",
    "share.email.label": "E-post",
    "share.copy": "Kopiera delningstext till urklipp",
    "share.copy.label": "Kopiera text",
    "error.default": "Ett fel har inträffat",
    "error.close": "Stäng felmeddelande",
    "coins.collected": "Insamlade mynt",
    "language.picker.label": "Språkval",
    "language.change": "Ändra webbplatsens språk",
    "language.select.label": "Välj önskat språk",
    "language.de": "Tyska",
    "language.en": "Engelska",
    "language.es": "Spanska",
    "language.fr": "Franska",
    "language.it": "Italienska",
    "language.pt": "Portugisiska",
    "language.da": "Danska",
    "language.nl": "Nederländska",
    "language.sv": "Svenska",
    "language.fi": "Finska",
    "language.de.label": "Visa webbplatsen på tyska",
    "language.en.label": "Visa webbplatsen på engelska",
    "language.es.label": "Visa webbplatsen på spanska",
    "language.fr.label": "Visa webbplatsen på franska",
    "language.it.label": "Visa webbplatsen på italienska",
    "language.pt.label": "Visa webbplatsen på portugisiska",
    "language.da.label": "Visa webbplatsen på danska",
    "language.nl.label": "Visa webbplatsen på nederländska",
    "language.sv.label": "Visa webbplatsen på svenska",
    "language.fi.label": "Visa webbplatsen på finska",
    "playlist.item.unavailable": "Detta innehåll är ännu inte tillgängligt",
    "playlist.item.status": "Status",
    "playlist.item.coming.soon": "Kommer snart",
    "game.area.label": "Spelområde",
    "game.options.label": "Svarsalternativ",
    "game.answer.correct": "Rätt! {points} poäng + {bonus} bonuspoäng",
    "game.answer.wrong": "Fel! Rätt svar var: {answer}",
    "error.invalid.question":
      "Ogiltig fråga eller alternativ inte tillgängliga",
    "error.no.initial.question": "Ingen giltig startfråga hittades",
    "error.no.albums.found": "Inga album hittades för kategorin {category}",
    "meta.keywords":
      "Musikquiz, Musikspel, Låtgissningsspel, Artistquiz, Online Musikquiz, Musiktrivia, Melody Mind, Musikgissningsspel",
    "knowledge.title": "Musikkunskapsbank",
    "knowledge.intro":
      "Dyk in i musikhistoriens fascinerande värld. Här hittar du intressanta artiklar om olika musikepoker, genrer och deras utveckling. Upptäck spännande fakta och utöka dina musikkunskaper.",
    "knowledge.search.label": "Sök artiklar",
    "knowledge.search.placeholder": "Sök...",
    "knowledge.filter.all": "Alla nyckelord",
    "knowledge.no.results": "Inga artiklar hittades. Försök med andra sökord.",
    "game.remaining": "kvar",
    "game.default.headline": "Spel",
    "popup.score": "Poäng: {score}",
    "popup.golden.lp.score": "Uppnådda poäng: {score}",
    "nav.donate.heading": "Stöd oss",
    "nav.donate.paypal": "Donera via PayPal",
    "nav.donate.coffee": "Bjud mig på en kaffe",
    "nav.title": "Navigation",
    "nav.menu.text": "Meny",
    "game.categories.empty.headline": "Inga genrer hittades",
    "game.categories.empty.text":
      "Tyvärr hittades inga kategorier. Försök igen senare.",
    "game.categories.no.playable.headline": "Inga spelbara genrer",
    "game.categories.no.playable.text":
      "För närvarande finns det inga spelbara kategorier. Kom tillbaka senare.",
    "knowledge.reading.time": "min lästid",
    "knowledge.breadcrumb.label": "Brödsmulor",
    "knowledge.listen.heading": "Lyssna på relaterad musik",
    "knowledge.back.to.list": "Tillbaka till artiklar",
    "knowledge.interact.heading": "Lyssna & Spela",
    "knowledge.play.heading": "Spela denna genre",
    "knowledge.play.description":
      "Testa dina kunskaper i denna musikgenre i vårt interaktiva quiz!",
    "knowledge.play.category": "Starta musikquiz",
    "category.play": "Spela",
    "play.cover.puzzle": "Spela omslagspussel",
    "play.cover.puzzle.description":
      "I omslagspusslet identifierar du albumomslag när de avslöjas gradvis. Ju snabbare du identifierar rätt album, desto fler poäng tjänar du. Testa ditt visuella minne med musikomslag!",
    "podcast.page.title": "Musikpoddar | Melody Mind",
    "podcast.page.heading": "Engagerande musikpoddar",
    "podcast.page.description":
      "Dyk in i musikens värld med våra engagerande poddar. Upptäck spännande berättelser, fascinerande bakgrunder och betydelsefulla ögonblick från olika musikepoker - perfekt för alla som inte bara vill lyssna på musik, utan verkligen förstå den. Våra poddar släpps varannan vecka och är endast tillgängliga på tyska och engelska.",
    "podcast.search.label": "Sök poddar",
    "podcast.search.placeholder": "Sök efter engagerande musikberättelser...",
    "podcast.search.status.all": "Alla poddar visas",
    "podcast.search.status.one": "1 podd hittad",
    "podcast.search.status.multiple": "{count} poddar hittade",
    "podcast.no.results":
      "Inga matchande poddar hittades. Försök med en annan sökterm.",
    "podcast.duration.error": "Längd ej tillgänglig",
    "podcast.play": "Spela",
    "podcast.intro.title": "Introduktion till Astropod",
    "podcast.intro.description":
      "Astropod är en gratis och öppen källkodslösning för serverlösa poddar.",
    "podcast.deploy.title": "Distribuera din serverlösa podd på 2 minuter",
    "podcast.deploy.description":
      "Lär dig hur du snabbt distribuerar din podd.",
    "podcast.auth.title":
      "Konfigurera användarautentisering och adminpanelåtkomst",
    "podcast.auth.description": "Aktivera autentisering och adminpanelåtkomst.",
    "podcast.config.title": "Konfigurera din Astropod-podd",
    "podcast.config.description": "Lär dig konfigurera din podd.",
    "podcast.publish.title": "Publicera ditt första avsnitt",
    "podcast.publish.description": "Publicera ditt första avsnitt enkelt.",
    "podcast.conclusion.title": "Slutsats",
    "podcast.conclusion.description": "Sammanfattning och nästa steg.",
    "podcast.listen.on": "Lyssna på",
    "podcast.language.availability":
      "Våra poddar är endast tillgängliga på tyska och engelska.",
    "podcast.listen.heading": "Lyssna på våra poddar",
    "login.welcome": "Välkommen till Melody Mind!",
    "login.description":
      "Ge dig ut på en musikalisk resa genom tiden! Testa dina kunskaper i spännande quiz, utforska fascinerande musikgenrer och fördjupa dig i våra engagerande poddar. Visa dina färdigheter, samla poäng och bli en riktig musiklegend!",
    "index.continue": "Låt oss börja!",
    "index.start.game.label": "Börja din musikaliska resa",
    "index.welcome.footnote": "Skapad av musikälskare för musikälskare. Njut!",
    "accessibility.wcag":
      "Denna applikation strävar efter att uppfylla WCAG AAA-krav.",
    "game.instructions.title": "Spelinstruktioner",
    "game.instructions.puzzle":
      "Försök gissa albumet när omslaget avslöjas gradvis. Ju snabbare du gissar rätt, desto fler poäng tjänar du.",
    "game.time.remaining": "Tid kvar:",
    "game.puzzle.label": "Albumomslagspussel",
    "game.puzzle.loading": "Laddar pussel...",
    "game.options.legend": "Välj rätt album",
    "game.next.round": "Börja nästa runda",
    "game.puzzle.revealed": "{percent}% av albumomslaget avslöjat",
    "game.option.choose": "Välj",
    "game.options.available": "Svarsalternativ är nu tillgängliga",
    "game.time.remaining.seconds": "{seconds} sekunder kvar",
    "game.time.up": "Tiden är ute! Rätt album var:",
    "game.correct.answer": "Rätt svar",
    "game.slower.speed": "Långsammare spel",
    "game.normal.speed": "Normal hastighet",
    "game.skip.to.answers": "Hoppa till svarsalternativ",
    "game.next": "Nästa",
    "aria.pressed": "Tryckt",
    "aria.expanded": "Expanderad",
    "aria.shortcuts.panel": "Genvägspanel",
    "aria.shortcuts.list": "Lista över tillgängliga genvägar",
    "knowledge.empty": "Inga artiklar tillgängliga i denna kategori",
    "playlist.page.title": "Musikspellistor | Melody Mind",
    "playlist.page.heading": "Upptäck våra musikspellistor",
    "playlist.page.description":
      "Dyk in i noggrant kurerade spellistor från olika epoker och genrer. Perfekt sätt att upptäcka ny musik eller återuppleva dina favoritklassiker.",
    "playlist.search.label": "Sök spellistor",
    "playlist.search.placeholder": "Sök efter musikera eller stil...",
    "playlist.filter.all": "Alla epoker",
    "playlist.no.results":
      "Inga matchande spellistor hittades. Försök med en annan sökterm.",
    "playlist.listen.on": "Lyssna på",
    "playlist.listen.spotify": "Lyssna på Spotify",
    "playlist.listen.deezer": "Lyssna på Deezer",
    "playlist.listen.apple": "Lyssna på Apple Music",
    "playlist.decade.filter": "Filtrera efter årtionde",
    "footer.rights": "Alla rättigheter förbehållna",
    "footer.donate": "Donera",
    "game.chronology.title": "Musikkronologi",
    "game.chronology.description":
      "Ordna dessa album efter deras utgivningsår (äldst först)",
    "game.chronology.area.label": "Kronologispelområde",
    "game.chronology.result": "Resultat",
    "game.chronology.correct": "Korrekt",
    "game.chronology.wrong": "Borde vara i position {position}",
    "game.chronology.score": "Resultat: {score} poäng",
    "game.chronology.details": "{correct} / {total} album korrekt placerade",
    "game.chronology.year": "År: {year}",
    "game.chronology.drag.help":
      "Använd piltangenterna ↑/↓ eller dra och släpp för att ordna",
    "game.submit.answer": "Kontrollera svar",
    "game.chronology.up": "Upp",
    "game.chronology.down": "Ner",
    "game.chronology.position": "Position",
    "game.chronology.start": "Början",
    "game.chronology.end": "Slut",
    "common.back.to.top": "Tillbaka till toppen",
    "knowledge.articles.heading": "Kunskapsartiklar",
    "knowledge.search.heading": "Sök Artiklar",
    "knowledge.search.description":
      "Artiklar filtreras automatiskt medan du skriver",
    "knowledge.search.reset": "Återställ sökning",
    "knowledge.search.reset.text": "Återställ",
    "knowledge.no.results.help":
      "Prova andra sökord eller återställ din sökning",
    "difficulty.level": "Svårighetsgrad",

    // Profilsida
    "profile.title": "Min Profil",
    "profile.description":
      "Hantera din personliga information och se din spelstatistik",
    "profile.loading": "Laddar profildata...",
    "profile.error": "Fel vid laddning av profildata",
    "profile.auth.required": "Du måste vara inloggad för att se din profil",
    "profile.user.info": "Användarinformation",
    "profile.user.since": "Medlem sedan",
    "profile.stats.title": "Spelstatistik",
    "profile.stats.quiz": "Quiz",
    "profile.stats.chronology": "Kronologi",
    "profile.stats.total.score": "Total poäng",
    "profile.stats.games.played": "Spelade spel",
    "profile.stats.highest.score": "Högsta poäng",
    "profile.recent.games": "Senaste spelresultat",
    "profile.recent.games.empty": "Du har inte spelat några spel än",
    "profile.recent.game.mode": "Spelläge",
    "profile.recent.game.category": "Kategori",
    "profile.recent.game.difficulty": "Svårighetsgrad",
    "profile.recent.game.score": "Poäng",
    "profile.recent.game.date": "Datum",

    // Highscores-sida
    "highscores.title": "Toppresultat",
    "highscores.description":
      "Se de bästa resultaten i olika spellägen och kategorier",
    "highscores.loading": "Laddar toppresultat...",
    "highscores.error": "Fel vid laddning av toppresultat",
    "highscores.empty": "Inga toppresultat hittades",
    "highscores.filter.title": "Filtrera toppresultat",
    "highscores.filter.game.mode": "Spelläge",
    "highscores.filter.category": "Kategori",
    "highscores.filter.all": "Alla",
    "highscores.filter.search": "Sök kategorier...",
    "highscores.filter.no.results": "Inga kategorier hittades",
    "highscores.table.title": "Toppresultat",
    "highscores.table.rank": "Placering",
    "highscores.table.player": "Spelare",
    "highscores.table.game.mode": "Spelläge",
    "highscores.table.category": "Kategori",
    "highscores.table.score": "Poäng",
    "highscores.table.date": "Datum",
  },
  fi: {
    "profile.nav.aria": "Navigointi käyttäjäprofiiliin",
    "profile.nav.link": "Siirry profiiliin",

    // Auth-Komponenten
    "auth.required.title": "Kirjautuminen vaaditaan",
    "auth.required.description": "Kirjaudu sisään päästäksesi tälle alueelle",
    "auth.login.title": "Kirjaudu",
    "auth.register.title": "Rekisteröidy",
    "auth.toggle.login": "Vaihda kirjautumiseen",
    "auth.toggle.register": "Vaihda rekisteröitymiseen",
    "auth.login.submit": "Kirjaudu",
    "auth.register.submit": "Rekisteröidy",
    "auth.form.submit": "Lähetä",
    "auth.form.loading": "Käsitellään...",
    "auth.tabs.login": "Kirjaudu",
    "auth.tabs.register": "Rekisteröidy",
    "auth.validation.processing": "Tarkistetaan tietoja...",
    "auth.form.error.general": "Tapahtui virhe",
    "auth.form.success": "Onnistui!",

    // Achievement Categories
    "achievements.category.games_played": "Pelatut pelit",
    "achievements.category.perfect_games": "Täydelliset pelit",
    "achievements.category.total_score": "Kokonaispisteet",
    "achievements.category.daily_streak": "Päivittäinen putki",
    "achievements.category.daily_games": "Päivittäiset pelit",

    // Achievement System
    "achievements.title": "Saavutukset",
    "achievements.description":
      "Löydä ja avaa saavutuksia seurataksesi edistymistäsi",
    "achievements.loading": "Ladataan saavutuksia...",
    "achievements.error": "Virhe ladattaessa saavutuksia",
    "achievements.empty": "Saavutuksia ei löytynyt",
    "achievements.category.bronze": "Pronssi",
    "achievements.category.silver": "Hopea",
    "achievements.category.gold": "Kulta",
    "achievements.category.platinum": "Platina",
    "achievements.category.diamond": "Timantti",
    "achievements.category.time": "Aika",
    "achievements.status.locked": "Lukittu",
    "achievements.status.in_progress": "Kesken",
    "achievements.status.unlocked": "Avattu",
    "achievements.progress": "Edistyminen: {progress}%",
    "achievements.unlocked_at": "Avattu {date}",
    "achievements.points": "Pisteet: {points}",
    "achievements.rarity": "Harvinaisuus: {percentage}%",
    "achievements.notification.unlocked": "Saavutus avattu!",
    "achievements.notification.progress": "Saavutuksen edistyminen päivitetty!",
    "achievements.nav.link": "Saavutukset",
    "achievements.nav.aria": "Siirry saavutuksiin",
    "achievements.badge.new": "Uusia saavutuksia saatavilla",
    "achievements.filter.title": "Suodata saavutuksia",
    "achievements.filter.status": "Tila",
    "achievements.filter.status.aria": "Suodata saavutuksia tilan mukaan",
    "achievements.filter.category": "Kategoria",
    "achievements.filter.category.aria":
      "Suodata saavutuksia kategorian mukaan",
    "achievements.filter.all": "Kaikki",
    "achievements.filter.all_categories": "Kaikki kategoriat",
    "achievements.summary.title": "Saavutusten edistyminen",
    "achievements.summary.total": "Yhteensä",
    "achievements.summary.unlocked": "Avattu",
    "achievements.summary.progress": "Edistyminen",
    "achievements.notification.close": "Sulje ilmoitus",
    "achievements.rarity.tooltip":
      "Prosenttiosuus pelaajista, jotka ovat avanneet tämän saavutuksen",

    // Game Counter Achievements
    "achievements.games_played_1": "Aloittelija: 1 Peli",
    "achievements.games_played_1.description":
      "Pelaa ensimmäinen pelisi missä tahansa tilassa",
    "achievements.games_played_5": "Aloittelija: 5 Peliä",
    "achievements.games_played_5.description":
      "Pelaa 5 peliä missä tahansa tilassa",
    "achievements.games_played_10": "Aloittelija: 10 Peliä",
    "achievements.games_played_10.description":
      "Pelaa 10 peliä missä tahansa tilassa",
    "achievements.games_played_25": "Harrastelija: 25 Peliä",
    "achievements.games_played_25.description":
      "Pelaa 25 peliä missä tahansa tilassa",
    "achievements.games_played_50": "Harrastelija: 50 Peliä",
    "achievements.games_played_50.description":
      "Pelaa 50 peliä missä tahansa tilassa",
    "achievements.games_played_75": "Harrastelija: 75 Peliä",
    "achievements.games_played_75.description":
      "Pelaa 75 peliä missä tahansa tilassa",
    "achievements.games_played_100": "Edistynyt: 100 Peliä",
    "achievements.games_played_100.description":
      "Pelaa 100 peliä missä tahansa tilassa",
    "achievements.games_played_150": "Edistynyt: 150 Peliä",
    "achievements.games_played_150.description":
      "Pelaa 150 peliä missä tahansa tilassa",
    "achievements.games_played_200": "Edistynyt: 200 Peliä",
    "achievements.games_played_200.description":
      "Pelaa 200 peliä missä tahansa tilassa",
    "achievements.games_played_300": "Asiantuntija: 300 Peliä",
    "achievements.games_played_300.description":
      "Pelaa 300 peliä missä tahansa tilassa",
    "achievements.games_played_400": "Asiantuntija: 400 Peliä",
    "achievements.games_played_400.description":
      "Pelaa 400 peliä missä tahansa tilassa",
    "achievements.games_played_500": "Asiantuntija: 500 Peliä",
    "achievements.games_played_500.description":
      "Pelaa 500 peliä missä tahansa tilassa",
    "achievements.games_played_750": "Mestari: 750 Peliä",
    "achievements.games_played_750.description":
      "Pelaa 750 peliä missä tahansa tilassa",
    "achievements.games_played_1000": "Mestari: 1000 Peliä",
    "achievements.games_played_1000.description":
      "Pelaa 1000 peliä missä tahansa tilassa",
    "achievements.games_played_1500": "Mestari: 1500 Peliä",
    "achievements.games_played_1500.description":
      "Pelaa 1500 peliä missä tahansa tilassa",
    "achievements.games_played_2000": "Mestari: 2000 Peliä",
    "achievements.games_played_2000.description":
      "Pelaa 2000 peliä missä tahansa tilassa",
    "achievements.games_played_2500": "Legenda: 2500 Peliä",
    "achievements.games_played_2500.description":
      "Pelaa 2500 peliä missä tahansa tilassa",
    "achievements.games_played_3000": "Legenda: 3000 Peliä",
    "achievements.games_played_3000.description":
      "Pelaa 3000 peliä missä tahansa tilassa",
    "achievements.games_played_4000": "Legenda: 4000 Peliä",
    "achievements.games_played_4000.description":
      "Pelaa 4000 peliä missä tahansa tilassa",
    "achievements.games_played_5000": "Legenda: 5000 Peliä",
    "achievements.games_played_5000.description":
      "Pelaa 5000 peliä missä tahansa tilassa",

    // Perfect Games Achievements
    "achievements.perfect_games_1": "Onnenpotku: 1 Täydellinen Peli",
    "achievements.perfect_games_1.description":
      "Saavuta maksimipisteet 1 pelissä",
    "achievements.perfect_games_2": "Onnenpotku: 2 Täydellistä Peliä",
    "achievements.perfect_games_2.description":
      "Saavuta maksimipisteet 2 pelissä",
    "achievements.perfect_games_3": "Onnenpotku: 3 Täydellistä Peliä",
    "achievements.perfect_games_3.description":
      "Saavuta maksimipisteet 3 pelissä",
    "achievements.perfect_games_5": "Tarkkuus: 5 Täydellistä Peliä",
    "achievements.perfect_games_5.description":
      "Saavuta maksimipisteet 5 pelissä",
    "achievements.perfect_games_7": "Tarkkuus: 7 Täydellistä Peliä",
    "achievements.perfect_games_7.description":
      "Saavuta maksimipisteet 7 pelissä",
    "achievements.perfect_games_10": "Tarkkuus: 10 Täydellistä Peliä",
    "achievements.perfect_games_10.description":
      "Saavuta maksimipisteet 10 pelissä",
    "achievements.perfect_games_15": "Kokemus: 15 Täydellistä Peliä",
    "achievements.perfect_games_15.description":
      "Saavuta maksimipisteet 15 pelissä",
    "achievements.perfect_games_20": "Kokemus: 20 Täydellistä Peliä",
    "achievements.perfect_games_20.description":
      "Saavuta maksimipisteet 20 pelissä",
    "achievements.perfect_games_25": "Kokemus: 25 Täydellistä Peliä",
    "achievements.perfect_games_25.description":
      "Saavuta maksimipisteet 25 pelissä",
    "achievements.perfect_games_30": "Mestaruus: 30 Täydellistä Peliä",
    "achievements.perfect_games_30.description":
      "Saavuta maksimipisteet 30 pelissä",
    "achievements.perfect_games_40": "Mestaruus: 40 Täydellistä Peliä",
    "achievements.perfect_games_40.description":
      "Saavuta maksimipisteet 40 pelissä",
    "achievements.perfect_games_50": "Mestaruus: 50 Täydellistä Peliä",
    "achievements.perfect_games_50.description":
      "Saavuta maksimipisteet 50 pelissä",
    "achievements.perfect_games_75": "Täydellisyys: 75 Täydellistä Peliä",
    "achievements.perfect_games_75.description":
      "Saavuta maksimipisteet 75 pelissä",
    "achievements.perfect_games_100": "Täydellisyys: 100 Täydellistä Peliä",
    "achievements.perfect_games_100.description":
      "Saavuta maksimipisteet 100 pelissä",
    "achievements.perfect_games_150": "Täydellisyys: 150 Täydellistä Peliä",
    "achievements.perfect_games_150.description":
      "Saavuta maksimipisteet 150 pelissä",
    "achievements.perfect_games_200": "Legenda: 200 Täydellistä Peliä",
    "achievements.perfect_games_200.description":
      "Saavuta maksimipisteet 200 pelissä",
    "achievements.perfect_games_300": "Legenda: 300 Täydellistä Peliä",
    "achievements.perfect_games_300.description":
      "Saavuta maksimipisteet 300 pelissä",
    "achievements.perfect_games_400": "Legenda: 400 Täydellistä Peliä",
    "achievements.perfect_games_400.description":
      "Saavuta maksimipisteet 400 pelissä",
    "achievements.perfect_games_500": "Legenda: 500 Täydellistä Peliä",
    "achievements.perfect_games_500.description":
      "Saavuta maksimipisteet 500 pelissä",

    // Score Achievements
    "achievements.total_score_100": "Keräilijä: 100 Pistettä",
    "achievements.total_score_100.description":
      "Kerää 100 pistettä kaikissa peleissä",
    "achievements.total_score_250": "Keräilijä: 250 Pistettä",
    "achievements.total_score_250.description":
      "Kerää 250 pistettä kaikissa peleissä",
    "achievements.total_score_500": "Keräilijä: 500 Pistettä",
    "achievements.total_score_500.description":
      "Kerää 500 pistettä kaikissa peleissä",
    "achievements.total_score_1000": "Pisteiden metsästäjä: 1 000 Pistettä",
    "achievements.total_score_1000.description":
      "Kerää 1 000 pistettä kaikissa peleissä",
    "achievements.total_score_2500": "Pisteiden metsästäjä: 2 500 Pistettä",
    "achievements.total_score_2500.description":
      "Kerää 2 500 pistettä kaikissa peleissä",
    "achievements.total_score_5000": "Pisteiden metsästäjä: 5 000 Pistettä",
    "achievements.total_score_5000.description":
      "Kerää 5 000 pistettä kaikissa peleissä",
    "achievements.total_score_7500": "Pistemagneetti: 7 500 Pistettä",
    "achievements.total_score_7500.description":
      "Kerää 7 500 pistettä kaikissa peleissä",
    "achievements.total_score_10000": "Pistemagneetti: 10 000 Pistettä",
    "achievements.total_score_10000.description":
      "Kerää 10 000 pistettä kaikissa peleissä",
    "achievements.total_score_15000": "Pistemagneetti: 15 000 Pistettä",
    "achievements.total_score_15000.description":
      "Kerää 15 000 pistettä kaikissa peleissä",
    "achievements.total_score_20000": "Pistemestari: 20 000 Pistettä",
    "achievements.total_score_20000.description":
      "Kerää 20 000 pistettä kaikissa peleissä",
    "achievements.total_score_30000": "Pistemestari: 30 000 Pistettä",
    "achievements.total_score_30000.description":
      "Kerää 30 000 pistettä kaikissa peleissä",
    "achievements.total_score_50000": "Pistemestari: 50 000 Pistettä",
    "achievements.total_score_50000.description":
      "Kerää 50 000 pistettä kaikissa peleissä",
    "achievements.total_score_75000": "Eliitti: 75 000 Pistettä",
    "achievements.total_score_75000.description":
      "Kerää 75 000 pistettä kaikissa peleissä",
    "achievements.total_score_100000": "Eliitti: 100 000 Pistettä",
    "achievements.total_score_100000.description":
      "Kerää 100 000 pistettä kaikissa peleissä",
    "achievements.total_score_150000": "Eliitti: 150 000 Pistettä",
    "achievements.total_score_150000.description":
      "Kerää 150 000 pistettä kaikissa peleissä",
    "achievements.total_score_200000": "Legenda: 200 000 Pistettä",
    "achievements.total_score_200000.description":
      "Kerää 200 000 pistettä kaikissa peleissä",
    "achievements.total_score_300000": "Legenda: 300 000 Pistettä",
    "achievements.total_score_300000.description":
      "Kerää 300 000 pistettä kaikissa peleissä",
    "achievements.total_score_400000": "Legenda: 400 000 Pistettä",
    "achievements.total_score_400000.description":
      "Kerää 400 000 pistettä kaikissa peleissä",
    "achievements.total_score_500000": "Legenda: 500 000 Pistettä",
    "achievements.total_score_500000.description":
      "Kerää 500 000 pistettä kaikissa peleissä",

    // Daily Streak Achievements
    "achievements.daily_streak_1": "Päivittäinen pelaaja",
    "achievements.daily_streak_1.description": "Pelaa 1 päivä peräkkäin",
    "achievements.daily_streak_3": "Musiikkientusiasti",
    "achievements.daily_streak_3.description": "Pelaa 3 päivää peräkkäin",
    "achievements.daily_streak_5": "Melodiamestari",
    "achievements.daily_streak_5.description": "Pelaa 5 päivää peräkkäin",
    "achievements.daily_streak_7": "Täydellinen viikko",
    "achievements.daily_streak_7.description": "Pelaa 7 päivää peräkkäin",
    "achievements.daily_streak_14": "Musiikkiveteraani",
    "achievements.daily_streak_14.description": "Pelaa 14 päivää peräkkäin",
    "achievements.daily_streak_30": "Melodialegenda",
    "achievements.daily_streak_30.description": "Pelaa 30 päivää peräkkäin",

    // Daily Games Achievements
    "achievements.daily_games_3": "Lämmittely",
    "achievements.daily_games_3.description":
      "Pelaa 3 peliä yhden päivän aikana",
    "achievements.daily_games_5": "Musiikkisessio",
    "achievements.daily_games_5.description":
      "Pelaa 5 peliä yhden päivän aikana",
    "achievements.daily_games_10": "Musiikkimaraton",
    "achievements.daily_games_10.description":
      "Pelaa 10 peliä yhden päivän aikana",
    "achievements.daily_games_20": "Melodiamaraton",
    "achievements.daily_games_20.description":
      "Pelaa 20 peliä yhden päivän aikana",
    "achievements.daily_games_30": "Ultra musikaalinen",
    "achievements.daily_games_30.description":
      "Pelaa 30 peliä yhden päivän aikana",
    "achievements.daily_games_50": "Melodiahulluus",
    "achievements.daily_games_50.description":
      "Pelaa 50 peliä yhden päivän aikana",

    // Achievement error messages
    "errors.achievements.fetch": "Virhe haettaessa saavutuksia",
    "errors.achievements.update":
      "Virhe päivitettäessä saavutuksen edistymistä",
    "errors.achievements.unlock": "Virhe avattaessa saavutusta",
    "errors.achievements.check": "Virhe tarkistettaessa saavutuksia",

    "auth.login.email": "Sähköpostiosoite",
    "auth.login.email.placeholder": "Syötä sähköpostiosoitteesi",
    "auth.login.password": "Salasana",
    "auth.login.password.placeholder": "Syötä salasanasi",
    "auth.login.remember": "Muista minut",
    "auth.login.forgot_password": "Unohditko salasanasi?",
    "auth.login.success": "Kirjautuminen onnistui",
    "auth.login.error": "Virhe kirjautumisessa",

    "auth.register.name": "Koko nimi",
    "auth.register.email": "Sähköpostiosoite",
    "auth.register.email.placeholder": "Syötä sähköpostiosoitteesi",
    "auth.register.username": "Käyttäjänimi",
    "auth.register.username.placeholder": "Valitse käyttäjänimi",
    "auth.register.password": "Salasana",
    "auth.register.password.placeholder": "Luo turvallinen salasana",
    "auth.register.confirm_password": "Vahvista salasana",
    "auth.register.password_confirm.placeholder": "Syötä salasanasi uudelleen",
    "auth.register.terms": "Hyväksyn käyttöehdot",
    "auth.register.success": "Rekisteröityminen onnistui",
    "auth.register.error": "Virhe rekisteröitymisessä",

    "auth.password_reset.title": "Nollaa salasana",
    "auth.password_reset.submit": "Lähetä nollauslinkki",
    "auth.password_reset.email": "Sähköpostiosoite",
    "auth.password_reset.email.placeholder":
      "Syötä rekisteröity sähköpostiosoitteesi",
    "auth.password_reset.back_to_login": "Takaisin kirjautumiseen",
    "auth.password_reset.login": "Kirjaudu",
    "auth.password_reset.success": "Nollauslinkki on lähetetty sähköpostiisi",
    "auth.password_reset.error": "Virhe nollauslinkin lähettämisessä",
    "auth.password_reset.new_password": "Uusi salasana",
    "auth.password_reset.confirm_password": "Vahvista uusi salasana",
    "auth.password_reset.change_submit": "Vaihda salasana",

    "auth.email_verification.title": "Sähköpostin vahvistus",
    "auth.email_verification.message":
      "Olemme lähettäneet vahvistuslinkin sähköpostiisi",
    "auth.email_verification.check_inbox": "Tarkista saapuneet-kansio",
    "auth.email_verification.resend": "Lähetä vahvistuslinkki uudelleen",
    "auth.email_verification.success": "Sähköposti vahvistettu onnistuneesti",
    "auth.email_verification.error": "Virhe sähköpostin vahvistamisessa",

    // Passwortvalidierung
    "auth.password.requirements": "Salasanavaatimukset:",
    "auth.password.min_length": "Salasanan on oltava vähintään 8 merkkiä pitkä",
    "auth.password.require_number":
      "Salasanan on sisällettävä vähintään yksi numero",
    "auth.password.require_uppercase":
      "Salasanan on sisällettävä vähintään yksi iso kirjain",
    "auth.password.require_lowercase":
      "Salasanan on sisällettävä vähintään yksi pieni kirjain",
    "auth.password.require_special":
      "Salasanan on sisällettävä vähintään yksi erikoismerkki",
    "auth.password.match": "Salasanojen on täsmättävä",
    "auth.password.strength.weak": "Heikko",
    "auth.password.strength.medium": "Keskitaso",
    "auth.password.strength.strong": "Vahva",

    // Formularvalidierung
    "auth.form.required": "Tämä kenttä on pakollinen",
    "auth.form.email_invalid": "Syötä kelvollinen sähköpostiosoite",
    "auth.form.min_length":
      "Tämän kentän on oltava vähintään {length} merkkiä pitkä",
    "auth.form.max_length":
      "Tämä kenttä ei saa olla yli {length} merkkiä pitkä",
    "auth.form.invalid": "Tämä kenttä on virheellinen",

    // Zugänglichkeit
    "auth.accessibility.loading": "Ladataan, odota hetki",
    "auth.accessibility.error": "Virhe: {message}",
    "auth.accessibility.required_field": "Pakollinen kenttä",
    "auth.accessibility.toggle_password": "Näytä/piilota salasana",
    "auth.accessibility.close_modal": "Sulje ikkuna",

    // API-Fehlermeldungen
    "auth.api.network_error": "Verkkovirhe. Tarkista yhteytesi",
    "auth.api.server_error": "Palvelinvirhe. Yritä myöhemmin uudelleen",
    "auth.api.invalid_credentials": "Virheelliset kirjautumistiedot",
    "auth.api.account_exists": "Tällä sähköpostiosoitteella on jo tili",
    "auth.api.email_not_found": "Tällä sähköpostiosoitteella ei löydy tiliä",
    "auth.api.too_many_requests":
      "Liian monta yritystä. Yritä myöhemmin uudelleen",

    // Service-Fehlermeldungen
    "auth.service.session_expired":
      "Istuntosi on vanhentunut. Kirjaudu sisään uudelleen",
    "auth.service.unauthorized": "Ei valtuuksia. Kirjaudu sisään",
    "auth.service.account_locked":
      "Tilisi on lukittu. Ota yhteyttä asiakaspalveluun",
    "auth.service.permission_denied": "Ei käyttöoikeutta tähän toimintoon",
    "auth.service.invalid_credentials":
      "Virheelliset kirjautumistiedot. Tarkista sähköpostisi ja salasanasi.",
    "auth.service.too_many_attempts":
      "Liian monta kirjautumisyritystä. Odota hetki ennen kuin yrität uudelleen.",

    "nav.home": "Etusivu",
    "nav.rules": "Säännöt",
    "category.no_image_available": "Kuvaa ei saatavilla",
    "game.score": "Pisteet",
    "game.round": "Kierros",
    "game.joker": "50:50 Jokeri",
    "difficulty.easy": "Helppo",
    "difficulty.medium": "Keskitaso",
    "difficulty.hard": "Vaikea",
    "category.difficulty.easy": "Helppo",
    "category.difficulty.medium": "Keskitaso",
    "category.difficulty.hard": "Vaikea",
    "game.select":
      "Tutki musiikin kiehtovaa maailmaa ja testaa tietojasi interaktiivisissa musiikkitietovisoissa. Valitse suosikkigenresi ja aloita melodinen matkasi!",
    "game.welcome": "Tervetuloa Melody Mindiin",
    "game.genre.list": "Genrevalikko",
    "game.search.label": "Etsi genreä",
    "game.search.description":
      "Lista suodattuu automaattisesti kirjoittaessasi",
    "game.genre.play.label": "Pelaa",
    "game.genre.image": "Genren kansikuva",
    "game.no.results": "Ei hakutuloksia",
    "game.not.available": "Ei saatavilla",
    "category.selected": "valittu!",
    "category.difficulty.heading": "Valitse vaikeustaso",
    "category.difficulty.group": "Vaikeustasot",
    "category.difficulty.easy.label": "Aloita peli helpolla tasolla",
    "category.difficulty.medium.label": "Aloita peli keskitasolla",
    "category.difficulty.hard.label": "Aloita peli vaikealla tasolla",
    "category.image.alt": "Kansikuva",
    "nav.menu.open": "Avaa valikko",
    "nav.menu.close": "Sulje valikko",
    "nav.menu.home": "Etusivu",
    "nav.menu.rules": "Säännöt",
    "nav.menu.highscores": "Huippupisteet",
    "nav.menu.profile": "Profiili",
    "nav.menu.logout": "Kirjaudu ulos",
    "nav.skip.main": "Siirry pääsisältöön",
    "game.end.title": "Peli päättyi!",
    "game.end.motivation":
      "Loistava suoritus! 🎉 Musiikkitietosi on todella vaikuttava. Haasta itsesi uudella kierroksella och tule oikeaksi musiikkilegendaksi! 🎵",
    "game.end.score": "Saavutetut pisteet:",
    "game.end.newgame": "Uusi peli",
    "game.end.share": "Jaa menestyksesi!",
    "game.end.home": "Etusivu",
    "game.feedback.resolution": "Ratkaisu",
    "game.feedback.media.section": "Media-osio",
    "game.feedback.audio.preview": "Musiikkinäyte",
    "game.feedback.subtitles": "Tekstitykset",
    "game.feedback.audio.unsupported": "Selaimesi ei tue äänen toistoa.",
    "game.feedback.streaming.links": "Musiikin suoratoistopalvelut",
    "game.feedback.listen.spotify": "Kuuntele Spotifyssa",
    "game.feedback.listen.deezer": "Kuuntele Deezerissä",
    "game.feedback.listen.apple": "Kuuntele Apple Musicissa",
    "game.feedback.next.round": "Seuraava kierros",
    "game.current.round": "Kierros",
    "game.current.round.label": "Nykyinen kierrosnumero",
    "game.joker.options": "Jokerivaihtoehdot",
    "game.joker.use": "Käytä 50:50 Jokeri",
    "game.joker.description": "Poistaa kaksi väärää vastausvaihtoehtoa",
    "loading.content": "Ladataan sisältöä...",
    "share.title": "Jaa menestyksesi!",
    "share.buttons.group.label": "Sosiaalisen median jakovaihtoehdot",
    "share.facebook": "Jaa Facebookissa",
    "share.whatsapp": "Jaa WhatsAppissa",
    "share.native": "Jaa...",
    "share.native.label": "Jaa",
    "share.twitter": "Jaa X/Twitterissä",
    "share.email": "Jaa sähköpostitse",
    "share.email.label": "Sähköposti",
    "share.copy": "Kopioi jaettava teksti leikepöydälle",
    "share.copy.label": "Kopioi teksti",
    "error.default": "Tapahtui virhe",
    "error.close": "Sulje virheilmoitus",
    "coins.collected": "Kerätyt kolikot",
    "language.picker.label": "Kielivalinta",
    "language.change": "Vaihda sivuston kieltä",
    "language.select.label": "Valitse haluamasi kieli",
    "language.de": "Saksa",
    "language.en": "Englanti",
    "language.es": "Espanja",
    "language.fr": "Ranska",
    "language.it": "Italia",
    "language.pt": "Portugali",
    "language.da": "Tanska",
    "language.nl": "Hollanti",
    "language.sv": "Ruotsi",
    "language.fi": "Suomi",
    "language.de.label": "Näytä sivusto saksaksi",
    "language.en.label": "Näytä sivusto englanniksi",
    "language.es.label": "Näytä sivusto espanjaksi",
    "language.fr.label": "Näytä sivusto ranskaksi",
    "language.it.label": "Näytä sivusto italiaksi",
    "language.pt.label": "Näytä sivusto portugaliksi",
    "language.da.label": "Näytä sivusto tanskaksi",
    "language.nl.label": "Näytä sivusto hollanniksi",
    "language.sv.label": "Näytä sivusto ruotsiksi",
    "language.fi.label": "Näytä sivusto suomeksi",
    "playlist.item.unavailable": "Tämä sisältö ei ole vielä saatavilla",
    "playlist.item.status": "Tila",
    "playlist.item.coming.soon": "Tulossa pian",
    "game.area.label": "Pelialue",
    "game.options.label": "Vastausvaihtoehdot",
    "game.answer.correct": "Oikein! {points} pistettä + {bonus} bonuspistettä",
    "game.answer.wrong": "Väärin! Oikea vastaus oli: {answer}",
    "error.invalid.question":
      "Virheellinen kysymys tai vaihtoehtoja ei saatavilla",
    "error.no.initial.question": "Kelvollista aloituskysymystä ei löytynyt",
    "error.no.albums.found": "Albumeita ei löytynyt kategorialle {category}",
    "meta.keywords":
      "Musiikkivisa, Musiikkipeli, Kappaleen arvaus -peli, Artistivisa, Online Musiikkivisa, Musiikkitrivia, Melody Mind, Musiikin arvaus -peli",
    "knowledge.title": "Musiikkitietopankki",
    "knowledge.intro":
      "Sukella musiikkihistorian kiehtovaan maailmaan. Täältä löydät mielenkiintoisia artikkeleita eri musiikkikausista, genreistä ja niiden kehityksestä. Tutustu jännittäviin tietoihin ja laajenna musiikkitietämystäsi.",
    "knowledge.search.label": "Etsi artikkeleita",
    "knowledge.search.placeholder": "Etsi...",
    "knowledge.filter.all": "Kaikki avainsanat",
    "knowledge.no.results":
      "Artikkeleita ei löytynyt. Kokeile muita hakusanoja.",
    "game.remaining": "jäljellä",
    "game.default.headline": "Peli",
    "popup.score": "Pisteet: {score}",
    "popup.golden.lp.score": "Saavutetut pisteet: {score}",
    "nav.donate.heading": "Tue meitä",
    "nav.donate.paypal": "Lahjoita PayPalin kautta",
    "nav.donate.coffee": "Tarjoa minulle kahvi",
    "nav.title": "Navigaatio",
    "nav.menu.text": "Valikko",
    "game.categories.empty.headline": "Genrejä ei löytynyt",
    "game.categories.empty.text":
      "Valitettavasti kategorioita ei löytynyt. Yritä myöhemmin uudelleen.",
    "game.categories.no.playable.headline": "Ei pelattavia genrejä",
    "game.categories.no.playable.text":
      "Tällä hetkellä ei ole pelattavia kategorioita. Palaa myöhemmin uudelleen.",
    "knowledge.reading.time": "min lukuaika",
    "knowledge.breadcrumb.label": "Murupolku",
    "knowledge.listen.heading": "Kuuntele aiheeseen liittyvää musiikkia",
    "knowledge.back.to.list": "Takaisin artikkeleihin",
    "knowledge.interact.heading": "Kuuntele & Pelaa",
    "knowledge.play.heading": "Pelaa tätä genreä",
    "knowledge.play.description":
      "Testaa tietojasi tässä musiikkigenressä interaktiivisessa visailussamme!",
    "knowledge.play.category": "Aloita musiikkivisa",
    "category.play": "Pelaa",
    "play.cover.puzzle": "Pelaa kansipuzzlea",
    "play.cover.puzzle.description":
      "Kansipuzzlessa tunnistat albumikansia, kun ne paljastuvat vähitellen. Mitä nopeammin tunnistat oikean albumin, sitä enemmän pisteitä ansaitset. Testaa visuaalista muistiasi musiikkikansilla!",
    "podcast.page.title": "Musiikkipodcastit | Melody Mind",
    "podcast.page.heading": "Mukaansatempaavat musiikkipodcastit",
    "podcast.page.description":
      "Sukella musiikin maailmaan mukaansatempaavien podcastiemme kanssa. Löydä jännittäviä tarinoita, kiehtovia taustoja ja merkityksellisiä hetkiä eri musiikkikausilta - täydellinen kaikille, jotka eivät halua vain kuunnella musiikkia, vaan todella ymmärtää sitä. Podcastimme julkaistaan joka toinen viikko ja ne ovat saatavilla vain saksaksi ja englanniksi.",
    "podcast.search.label": "Etsi podcasteja",
    "podcast.search.placeholder": "Etsi mukaansatempaavia musiikkitarinoita...",
    "podcast.search.status.all": "Kaikki podcastit näkyvissä",
    "podcast.search.status.one": "1 podcast löydetty",
    "podcast.search.status.multiple": "{count} podcastia löydetty",
    "podcast.no.results":
      "Vastaavia podcasteja ei löytynyt. Kokeile toista hakutermiä.",
    "podcast.duration.error": "Pituus ei saatavilla",
    "podcast.play": "Toista",
    "podcast.intro.title": "Johdanto Astropodiin",
    "podcast.intro.description":
      "Astropod on ilmainen ja avoimen lähdekoodin serveritön podcast-ratkaisu.",
    "podcast.deploy.title": "Julkaise serveritön podcastisi 2 minuutissa",
    "podcast.deploy.description": "Opi julkaisemaan podcastisi nopeasti.",
    "podcast.auth.title":
      "Määritä käyttäjien todennus ja hallintapaneelin käyttöoikeudet",
    "podcast.auth.description":
      "Ota käyttöön tunnistautuminen ja hallintapaneelin käyttöoikeudet.",
    "podcast.config.title": "Määritä Astropod-podcastisi",
    "podcast.config.description": "Opi määrittämään podcastisi.",
    "podcast.publish.title": "Julkaise ensimmäinen jaksosi",
    "podcast.publish.description": "Julkaise ensimmäinen jaksosi helposti.",
    "podcast.conclusion.title": "Päätelmä",
    "podcast.conclusion.description": "Yhteenveto ja seuraavat vaiheet.",
    "podcast.listen.on": "Kuuntele palvelussa",
    "podcast.language.availability":
      "Podcastimme ovat saatavilla vain saksaksi ja englanniksi.",
    "podcast.listen.heading": "Kuuntele podcastejamme",
    "login.welcome": "Tervetuloa Melody Mindiin!",
    "login.description":
      "Lähde musiikilliselle matkalle läpi ajan! Testaa tietojasi jännittävissä visoissa, tutki kiehtovia musiikkigenrejä och sukella mukaansatempaaviin podcasteihimme. Näytä taitosi, kerää pisteitä och tule todelliseksi musiikkilegendaksi!",
    "index.continue": "Aloitetaan!",
    "index.start.game.label": "Aloita musiikillinen matkasi",
    "index.welcome.footnote":
      "Musiikin rakastajien luoma musiikin rakastajille. Nauti!",
    "accessibility.wcag":
      "Tämä sovellus pyrkii täyttämään WCAG AAA-vaatimukset.",
    "game.instructions.title": "Peliohjeet",
    "game.instructions.puzzle":
      "Yritä arvata albumi, kun sen kansi paljastuu vähitellen. Mitä nopeammin arvaat oikein, sitä enemmän pisteitä ansaitset.",
    "game.time.remaining": "Aikaa jäljellä:",
    "game.puzzle.label": "Albumikansipuzzle",
    "game.puzzle.loading": "Ladataan puzzlea...",
    "game.options.legend": "Valitse oikea albumi",
    "game.next.round": "Aloita seuraava kierros",
    "game.puzzle.revealed": "{percent}% albumin kannesta paljastettu",
    "game.option.choose": "Valitse",
    "game.options.available": "Vastausvaihtoehdot ovat nyt saatavilla",
    "game.time.remaining.seconds": "{seconds} sekuntia jäljellä",
    "game.time.up": "Aika loppui! Oikea albumi oli:",
    "game.correct.answer": "Oikea vastaus",
    "game.slower.speed": "Hitaampi peli",
    "game.normal.speed": "Normaali nopeus",
    "game.skip.to.answers": "Siirry vastausvaihtoehtoihin",
    "game.next": "Seuraava",
    "aria.pressed": "Painettu",
    "aria.expanded": "Laajennettu",
    "aria.shortcuts.panel": "Pikakuvakepaneeli",
    "aria.shortcuts.list": "Luettelo käytettävissä olevista pikakuvakkeista",
    "knowledge.empty": "Tässä kategoriassa ei ole artikkeleita",
    "playlist.page.title": "Musiikkisoittolistat | Melody Mind",
    "playlist.page.heading": "Löydä musiikkisoittolistamme",
    "playlist.page.description":
      "Sukella huolellisesti kuratoituihin soittolistoihin eri aikakausilta och genreistä. Täydellinen tapa löytää uutta musiikkia och kokea uudelleen suosikkiklassikoita.",
    "playlist.search.label": "Hae soittolistoja",
    "playlist.search.placeholder": "Hae aikakautta och tyyliä...",
    "playlist.filter.all": "Kaikki aikakaudet",
    "playlist.no.results":
      "Vastaavia soittolistoja ei löytynyt. Kokeile toista hakutermiä.",
    "playlist.listen.on": "Kuuntele palvelussa",
    "playlist.listen.spotify": "Kuuntele Spotifyssa",
    "playlist.listen.deezer": "Kuuntele Deezerissä",
    "playlist.listen.apple": "Kuuntele Apple Musicissa",
    "playlist.decade.filter": "Suodata vuosikymmenen mukaan",
    "footer.rights": "Kaikki oikeudet pidätetään",
    "footer.donate": "Lahjoita",
    "game.chronology.title": "Musiikkikronologia",
    "game.chronology.description":
      "Järjestä nämä albumit julkaisuvuoden mukaan (vanhin ensin)",
    "game.chronology.area.label": "Kronologiapelialue",
    "game.chronology.result": "Tulos",
    "game.chronology.correct": "Oikein",
    "game.chronology.wrong": "Pitäisi olla paikassa {position}",
    "game.chronology.score": "Tulos: {score} pistettä",
    "game.chronology.details": "{correct} / {total} albumia oikein sijoitettu",
    "game.chronology.year": "Vuosi: {year}",
    "game.chronology.drag.help":
      "Käytä nuolinäppäimiä ↑/↓ tai vedä och pudota järjestääksesi",
    "game.submit.answer": "Tarkista vastaus",
    "game.chronology.up": "Ylös",
    "game.chronology.down": "Alas",
    "game.chronology.position": "Sijainti",
    "game.chronology.start": "Alku",
    "game.chronology.end": "Loppu",
    "common.back.to.top": "Takaisin ylös",
    "knowledge.articles.heading": "Tietoartikkelit",
    "knowledge.search.heading": "Hae artikkeleita",
    "knowledge.search.description":
      "Artikkelit suodattuvat automaattisesti kirjoittaessasi",
    "knowledge.search.reset": "Nollaa haku",
    "knowledge.search.reset.text": "Nollaa",
    "knowledge.no.results.help": "Kokeile eri hakusanoja tai nollaa haku",
    "knowledge.keyboard.instructions":
      "Käytä nuolinäppäimiä navigoidaksesi artikkeleiden välillä. Paina Enter avataksesi artikkelin.",
    "difficulty.level": "Vaikeustaso",

    // Profiilisivu
    "profile.title": "Oma Profiili",
    "profile.description":
      "Hallitse henkilökohtaisia tietojasi ja tarkastele pelitilastojasi",
    "profile.loading": "Ladataan profiilitietoja...",
    "profile.error": "Virhe profiilitietojen lataamisessa",
    "profile.auth.required":
      "Sinun täytyy kirjautua sisään nähdäksesi profiilisi",
    "profile.user.info": "Käyttäjätiedot",
    "profile.user.since": "Jäsen alkaen",
    "profile.stats.title": "Pelitilastot",

    // Highscores-Seite
    "highscores.title": "Parhaat tulokset",
    "highscores.description":
      "Katso parhaat tulokset eri pelitavoissa ja kategorioissa",
    "highscores.loading": "Ladataan parhaita tuloksia...",
    "highscores.error": "Virhe ladattaessa parhaita tuloksia",
    "highscores.empty": "Parhaita tuloksia ei löytynyt",
    "highscores.filter.title": "Suodata parhaita tuloksia",
    "highscores.filter.game.mode": "Pelitapa",
    "highscores.filter.category": "Kategoria",
    "highscores.filter.all": "Kaikki",
    "highscores.filter.search": "Etsi kategorioita...",
    "highscores.filter.no.results": "Kategorioita ei löytynyt",

    "highscores.table.title": "Parhaat tulokset",
    "highscores.table.rank": "Sijoitus",
    "highscores.table.player": "Pelaaja",
    "highscores.table.game.mode": "Pelitapa",
    "highscores.table.category": "Kategoria",
    "highscores.table.score": "Pisteet",
    "highscores.table.date": "Päivämäärä",
    "profile.stats.quiz": "Tietovisa",
    "profile.stats.chronology": "Kronologia",
    "profile.stats.total.score": "Kokonaispisteet",
    "profile.stats.games.played": "Pelatut pelit",
    "profile.stats.highest.score": "Korkein pistemäärä",
    "profile.recent.games": "Viimeisimmät pelitulokset",
    "profile.recent.games.empty": "Et ole vielä pelannut yhtään peliä",
    "profile.recent.game.mode": "Pelitila",
    "profile.recent.game.category": "Kategoria",
    "profile.recent.game.difficulty": "Vaikeustaso",
    "profile.recent.game.score": "Pisteet",
    "profile.recent.game.date": "Päivämäärä",

    // Neue Übersetzungsschlüssel für Finnisch
    "auth.form.email_required": "Sähköpostiosoite vaaditaan",
    "auth.form.email_invalid_short": "Virheellinen sähköpostiosoite",
    "auth.form.loading_text": "Ladataan...",
    "auth.form.send_reset_link": "Lähetä palautuslinkki",
    "auth.form.password_required": "Salasana vaaditaan",
    "auth.form.password_requirements": "Salasana ei täytä kaikkia vaatimuksia",
    "auth.form.password_confirm_required": "Salasanan vahvistus vaaditaan",
    "auth.form.passwords_not_match": "Salasanat eivät täsmää",
    "auth.password_reset.success_message":
      "Jos tällä sähköpostiosoitteella on tili, olemme lähettäneet ohjeet salasanan palauttamiseksi.",
    "auth.password_reset.error_message":
      "Tapahtui virhe. Yritä myöhemmin uudelleen.",
    "auth.password_reset.complete_success":
      "Salasana palautettu onnistuneesti. Voit nyt kirjautua sisään uudella salasanallasi.",
    "auth.password_reset.complete_error":
      "Salasanan palautus epäonnistui. Tarkista syöttämäsi tiedot tai pyydä uusi palautuslinkki.",
  },
};
