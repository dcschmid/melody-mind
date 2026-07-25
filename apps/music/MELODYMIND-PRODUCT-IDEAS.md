# MelodyMind Product Ideas

Stand: 24. Juli 2026

Dieses Dokument sammelt mögliche Produktfunktionen und eigenständige Apps für
MelodyMind. Es ist ein Ideen-Backlog, kein verbindlicher Entwicklungsplan.

## Ausgangspunkt

MelodyMind sollte kein kleiner Spotify-Klon werden. Der stärkste Unterschied liegt in
den vollständigen Konzeptalben, ihren Geschichten, Figuren, Serien, Sprachen und
redaktionellen Begleittexten.

Die zentrale Produktidee lautet:

> MelodyMind ist ein Ort, an dem man Alben hört, ihre Geschichten versteht und neue
> musikalische Welten entdeckt.

Der aktuelle Katalog umfasst 121 Alben, 11 Genre-Bereiche und 5 Albumserien. Bereits
vorhandene Metadaten wie Stimmung, Energie, Sprache, Epoche, Tags und Laufzeit bieten
eine gute Grundlage für neue Discovery-Funktionen.

## Produktprinzipien

Neue Funktionen sollten mindestens eines dieser Ziele erfüllen:

1. **Deep Listening:** Ein vollständiges Album bewusster erleben.
2. **Discovery:** Einen nachvollziehbaren Weg zum nächsten Album bieten.
3. **Context:** Geschichte, Lyrics und Produktion verständlicher machen.
4. **Participation:** Hörer aktiv einbeziehen, ohne die Musik zu überdecken.
5. **Return Value:** Einen konkreten Grund schaffen, später wiederzukommen.

Dabei gelten folgende Grenzen:

- Musik und Albumkunst bleiben wichtiger als dekorative Effekte.
- Ein neues Feature darf die bestehenden Wiedergabefunktionen nicht komplizierter
  machen.
- Redaktionelle Auswahl ist wertvoller als endlose automatisch erzeugte Listen.
- Lokale Speicherung wird vor verpflichtenden Benutzerkonten bevorzugt.
- Neue Apps erhalten nur dann eine eigene Oberfläche oder Subdomain, wenn sie einen
  eigenständigen, wiederkehrenden Nutzungsgrund haben.
- AI-Funktionen müssen ein konkretes Problem lösen. Ein Chatfenster allein ist noch
  kein Produkt.

## Prioritätsübersicht

| Idee                |     Produktwert |          Aufwand | Empfehlung                 |
| ------------------- | --------------: | ---------------: | -------------------------- |
| MelodyMind Stories  |       Sehr hoch |           Mittel | Signature-Prototyp         |
| MelodyMind Radio    |       Sehr hoch |           Mittel | Früh testen                |
| Continue Listening  |            Hoch |            Klein | Quick Win                  |
| Mood Navigator      |            Hoch | Klein bis mittel | Quick Win                  |
| Series Marathon     |            Hoch | Klein bis mittel | Früh umsetzen              |
| MelodyMind Quiz Lab |            Hoch |           Mittel | Beste Verbindung zu Quiz   |
| Listening Passport  |            Hoch |           Mittel | Lokal starten              |
| MelodyMind Daily    | Mittel bis hoch |            Klein | Schnell validierbar        |
| MelodyMind Atlas    |            Hoch |  Mittel bis groß | Nach Story-Prototyp        |
| MelodyMind Studio   | Mittel bis hoch |           Mittel | Content-Pilot              |
| Lyrics & Languages  |            Hoch | Content-intensiv | Mit einem Album testen     |
| MelodyMind Visuals  |          Mittel |           Mittel | Späterer Lean-back-Modus   |
| MelodyMind Rooms    |            Hoch |             Groß | Erst nach Nutzungssignalen |
| MelodyMind Clubs    | Mittel bis hoch |             Groß | Community-Phase            |
| MelodyMind API      |          Mittel |           Mittel | Erst bei externem Bedarf   |

---

## 1. MelodyMind Stories

### Idee

Eine interaktive Begleit-App für Konzeptalben. Während ein Album läuft, bewegt sich
die Geschichte mit der Musik. Hörer sehen Handlung, Figuren, Orte, Lyrics und
wiederkehrende musikalische Motive im Kontext des aktuellen Tracks.

### Kernnutzen

Konzeptalben verlangen mehr Aufmerksamkeit als eine lose Trackliste. Stories hilft
Hörern, der Dramaturgie zu folgen, ohne vor dem ersten Track einen langen Text lesen
zu müssen.

### Mögliche Oberfläche

- Cover oder Szenenillustration
- aktueller Track mit Fortschritt
- aktuelle Story-Szene
- beteiligte Figuren
- Album-Zeitleiste
- wiederkehrende Motive
- Umschalter zwischen Story, Lyrics und Production
- Spoiler-Einstellung

Beispiel für eine aktuelle Szene:

> Nora entdeckt, dass Project Phoenix nicht nur ein Softwareprojekt ist. Das
> dreitönige Gitarrenmotiv aus dem ersten Track kehrt in verlangsamter Form zurück.

### MVP

- ein erzählerisch starkes Album
- eine Szene pro Track
- Figurenliste
- lineare Album-Zeitleiste
- Hervorhebung des aktuellen Tracks
- manuelles Vor- und Zurückspringen
- keine zeitgesteuerten Animationen innerhalb eines Tracks

### Ausbaustufen

- Hinweise an bestimmten Zeitpunkten eines Tracks
- Karten fiktiver Orte
- Beziehungen zwischen Figuren
- Rückblick auf bereits gehörte Kapitel
- Serien-Zeitleiste über mehrere Alben
- Leitmotiv-Ansicht
- Szenenillustrationen
- barrierearme Textansicht ohne visuelle Effekte

### Mögliche Content-Felder

- `storySummary`
- `characters`
- `locations`
- `scenes`
- `motifs`
- `spoilerLevel`
- `seriesPosition`
- `previouslyOn`

### Erfolgssignale

- mehr vollständig gehörte Alben
- Nutzung der Story-Ansicht über mehrere Tracks hinweg
- Wechsel von einem Serienalbum zum nächsten
- häufig geteilte Szenen oder Zeitpunkte

### Empfehlung

Mit genau einem Album prototypisieren. Der Pilot sollte klären, ob Nutzer während des
Hörens tatsächlich lesen möchten und welche Textmenge den Player unterstützt, ohne
von der Musik abzulenken.

---

## 6. MelodyMind Atlas

### Idee

Eine visuelle Karte des Katalogs. Alben erscheinen als verbundene Punkte. Nähe
bedeutet eine inhaltliche oder musikalische Beziehung.

### Mögliche Verbindungen

- Genre
- Stimmung
- Sprache
- Energie
- Epoche
- Thema
- Schauplatz
- gemeinsame Serie
- ähnlicher erzählerischer Konflikt

### Beispiel

Ein Nutzer startet bei einem französischen Gothic-Album und folgt einer Verbindung zu
einem italienischen Folk-Drama, weil beide Geschichten von Exil handeln.

### MVP

- zweidimensionales Netz
- Filter für Genre, Sprache und Stimmung
- Cover und Beschreibung beim Öffnen eines Knotens
- sichtbare Erklärung jeder Verbindung
- direkter Start des Albums

### Ausbaustufen

- unterschiedliche Kartenansichten
- Story-Welten
- Genreentwicklung
- persönliche Karte bereits gehörter Alben
- Zoom von Genre zu Album zu Track
- exportierbare Posteransicht

### Risiko

Eine Netzgrafik kann beeindruckend aussehen und trotzdem unbrauchbar sein. Jede
Verbindung braucht deshalb eine verständliche Begründung. Auf Mobilgeräten muss eine
lineare Listenalternative verfügbar sein.

---

## 7. Listening Passport

### Idee

Eine persönliche Musiksammlung, die zunächst vollständig lokal im Browser gespeichert
wird.

### Gespeicherte Informationen

- gehörte Alben
- vollständig abgeschlossene Alben
- Favoriten
- Lieblingstracks
- erkundete Genres
- gehörte Sprachen
- abgeschlossene Serien
- persönliche Notizen

### Meilensteine

Meilensteine sollen Entdeckung sichtbar machen, nicht künstlich Druck erzeugen:

- First complete concept album
- First complete series
- Albums heard in five languages
- Ten hours of instrumental music
- Three album worlds explored

### MVP

- lokale Speicherung
- Favoriten
- Hörhistorie
- Album gilt ab einem definierten Fortschritt als gehört
- Export und Import als JSON
- keine Anmeldung

### Ausbaustufen

- optionales Konto
- geräteübergreifende Synchronisierung
- persönliche Jahresübersicht
- eigene Albumlisten
- Passport-Poster
- private Hörnotizen

### Empfehlung

Als Weiterentwicklung von Continue Listening starten. Konten sind erst notwendig,
wenn der Nutzen lokaler Sammlungen bestätigt ist.

---

## 8. MelodyMind Daily

### Idee

Jeden Tag steht genau ein Album im Mittelpunkt. Die App besitzt keine große Suche und
keinen endlosen Feed.

### Tagesansicht

- Album des Tages
- kurze redaktionelle Einführung
- Laufzeit
- beste Hörsituation
- vollständiger Player
- ein Detail, auf das man achten kann
- eine Frage nach dem Hören
- Archiv vergangener Empfehlungen

### Kernnutzen

Die Begrenzung nimmt Nutzern die Auswahlentscheidung ab. Music bleibt das Archiv,
Daily wird ein wiederkehrendes Ritual.

### MVP

- manuell geplante Tagesauswahl
- bestehende Albumdaten
- Archiv
- teilbarer Tageslink
- keine Personalisierung

### Ausbaustufen

- wöchentliche Themen
- Newsletter oder Web-Push
- tägliche Quizfrage
- Rückblick auf gehörte Tagesalben
- Gastkuratierungen

### Empfehlung

Sehr gut als kleines Experiment geeignet. Daily kann zunächst eine Route sein und
später eine eigene reduzierte App erhalten.

---

## 9. MelodyMind Quiz Lab

### Idee

Eine zweite Quiz-Linie, die direkt mit den eigenen Alben verbunden ist. Die bestehende
Quiz-App behandelt Musikgeschichte und Genreentwicklung. Quiz Lab konzentriert sich
auf MelodyMind-Cover, Tracks, Geschichten und Serien.

### Spielmodi

#### Audio Guess

Ein Track läuft fünf, zehn oder fünfzehn Sekunden. Gesucht werden Album, Track oder
Genre.

#### Cover Reveal

Ein vergrößerter Ausschnitt des Covers wird schrittweise sichtbar.

#### Story Clue

Eine Szene oder Figur muss dem richtigen Album zugeordnet werden.

#### Track Order

Die Tracks eines Konzeptalbums werden in die richtige Reihenfolge gebracht.

#### Language Challenge

Eine Textzeile oder ein kurzer Ausschnitt wird einer Sprache oder einem Album
zugeordnet.

#### Which Came Next?

Der Spieler entscheidet, welcher Track eine begonnene Handlung fortsetzt.

#### After Album Quiz

Nach dem vollständigen Hören erscheinen fünf Fragen zum Album. Neben Fakten können
auch musikalische Beobachtungen abgefragt werden.

### MVP

- drei Alben
- je fünf Fragen
- Cover-, Story- und Hörfragen
- Ergebnis ohne Benutzerkonto
- direkter Link zurück zum Album
- keine globale Bestenliste

### Ausbaustufen

- tägliche Audiofrage
- Serienquiz
- Duell über einen geteilten Link
- Quiz aus zuletzt gehörten Alben
- persönliche Quizhistorie
- thematische Wochen

### Empfehlung

Quiz Lab ist die naheliegendste Verbindung zwischen den bestehenden Apps Music und
Quiz. Ein gemeinsames Content-Format für albumbezogene Fragen könnte Doppelpflege
vermeiden.

---

## 10. MelodyMind Studio

### Idee

Eine „Behind the Album“-App für Entstehung, Redaktion und Produktion.

### Mögliche Inhalte

- Ausgangsidee
- musikalische Richtung
- Storyentwicklung
- Coverentwicklung
- Instrumentierung
- wiederkehrende Motive
- Versionen einzelner Songs
- Produktionsnotizen
- Rolle von AI-Werkzeugen
- redaktionelle Überarbeitung
- Credits

### MVP

- fünf ausgewählte Alben
- vorhandene Produktionsnotizen
- Credits
- kompakter Entstehungsablauf
- verwendete Werkzeuge
- Cover-Skizzen, sofern vorhanden

### Ausbaustufen

- Vergleich früher und später Versionen
- Kommentare zu Arrangement und Dramaturgie
- Making-of-Videos
- Interviews
- öffentliche Changelogs überarbeiteter Alben
- technische Detailansicht

### Empfehlung

Mit vorhandenen Informationen beginnen. Fehlende Entstehungsgeschichten dürfen nicht
nachträglich erfunden werden. Die Stärke der App liegt in nachvollziehbaren
Entscheidungen und sauberer AI-Transparenz.

---

## 11. MelodyMind Lyrics & Languages

### Idee

Eine Anwendung für Lyrics, Übersetzungen, Aussprache und sprachlichen Kontext.

### Funktionen

- synchronisierte Lyrics
- Original und Übersetzung nebeneinander
- Aussprachehilfe
- Markierung wiederkehrender Zeilen
- Figurenstimmen bei Dialogsongs
- Erklärungen kultureller Begriffe
- Suche nach Textstellen
- Wechsel zwischen Story-Kontext und Übersetzung

### MVP

- ein mehrsprachiges Album
- manuell geprüfte Übersetzung
- zeilenweise Darstellung
- Link zum aktuellen Track
- barrierearme Nur-Text-Ansicht

### Ausbaustufen

- mehrere Übersetzungssprachen
- Ausspracheansicht
- Vergleich wiederkehrender Refrains
- Story-Anmerkungen
- Vokabelsammlung
- persönliche markierte Zeilen

### Risiko

Übersetzungen und Lyrics benötigen redaktionelle Kontrolle. Eine automatische
Übersetzung ohne Prüfung kann Bedeutung, Reim und Figurenstimme verfälschen.

---

## 12. MelodyMind Rooms

### Idee

Gemeinsames synchrones Albumhören über einen Link oder QR-Code.

### MVP

- Raum ohne Registrierung erstellen
- Gastgeber kontrolliert Start und Pause
- Gäste hören synchron
- Teilnehmerzahl
- einfache Reaktionen
- Trackliste und Liner Notes
- Raum endet nach dem Album

### Zweite Stufe

- geplanter Termin
- Countdown
- Abstimmung über das nächste Album
- moderierte Textnachrichten
- Fragen zur Entstehung
- Albumquiz am Ende

### Dritte Stufe

- öffentliche Premieren
- thematische Hörabende
- Serien-Marathons
- Gastmoderatoren
- wiederkehrende Clubs

### Risiken

- Synchronisierung und Verbindungsabbrüche
- Moderation bei offenem Chat
- Datenschutz
- Missbrauch öffentlicher Räume
- höhere Backend-Kosten

### Empfehlung

Zuerst ohne offenen Chat starten. Reaktionen und eine gemeinsame Trackanzeige
vermitteln Anwesenheit, ohne sofort eine Moderationsplattform aufzubauen.

---

## 13. MelodyMind Clubs

### Idee

Ein monatlicher digitaler Plattenclub mit einer festen redaktionellen Auswahl.

### Mögliche Clubs

- The Heavy Room
- Folk and Myth
- Political Records
- Album Stories
- Instrumental Cinema
- Songs Across Europe

### Monatlicher Ablauf

1. Ein Album wird vorgestellt.
2. Ein redaktioneller Text erklärt die Auswahl.
3. Mitglieder hören das Album.
4. Ein Quiz oder eine Hörfrage vertieft das Thema.
5. Optional findet ein gemeinsamer Hörtermin statt.

### MVP

- ein frei zugänglicher Club
- ein Album pro Monat
- redaktionelle Einführung
- Diskussionsfrage ohne öffentliche Kommentare
- Archiv bisheriger Auswahlen

### Ausbaustufen

- mehrere Clubs
- Gastkuratoren
- Newsletter
- Listening Rooms
- optionale Mitgliedschaft
- exklusive Interviews oder Studio Notes

### Empfehlung

Erst sinnvoll, wenn Daily, Radio oder redaktionelle Pfade zeigen, dass Nutzer
regelmäßig wegen kuratierter Auswahl zurückkehren.

---

## 15. MelodyMind Journal

### Idee

Ein privates Hörtagebuch.

### Eintrag nach einem Album

- Lieblingsmoment
- stärkster Track
- wahrgenommene Stimmung
- persönliche Notiz
- Hörort
- Datum
- private Bewertung

### MVP

- lokale Einträge
- Verknüpfung mit Album und Track
- Suche in eigenen Notizen
- Export

### Ausbaustufen

- Monats- und Jahreschronik
- wiederkehrende Motive in eigenen Notizen
- teilbare Einzelkarten
- Synchronisierung

### Empfehlung

Als optionaler Teil des Listening Passport umsetzen, nicht sofort als separate App.

---

## 16. MelodyMind Trails

### Idee

Redaktionell kuratierte Hörreisen durch mehrere Alben.

### Beispiele

- Five Nights of Gothic Music
- From Punk Protest to Political Metal
- Stories of Exile
- Northern Myths
- European City Nights
- Office Horror and Developer Comedy
- Instrumental Worlds

### Aufbau eines Trails

- klare Ausgangsfrage
- drei bis sieben Alben
- kurze Einleitung
- Begründung für jeden Übergang
- geschätzte Gesamtlaufzeit
- Fortschritt
- Abschlussnotiz

### MVP

- drei manuell kuratierte Trails
- bestehende Albumdaten
- lineare Navigation
- „Play this trail“

### Empfehlung

Guter Zwischenschritt zwischen statischen Genre-Seiten und personalisierten
Empfehlungen.

---

## 17. MelodyMind Time Machine

### Idee

Discovery über musikalische Epochen, Produktionsästhetiken und fiktive Welten.

### Mögliche Einstiege

- Medieval Hall
- 1970s Progressive Stage
- 1980s Neon City
- 1990s Alternative Club
- Near-future Corporate Collapse
- Mythic Prehistory

### MVP

- sechs kuratierte Epochen oder Welten
- Albumzuordnung mit Begründung
- Zeitstrahl
- direkter Player

### Risiko

Historische Einordnung und Albumfiktion dürfen nicht vermischt werden. Die App muss
klar kennzeichnen, ob ein Album historische Musik behandelt, stilistisch auf eine
Epoche verweist oder in einer fiktiven Vergangenheit spielt.

---

## 18. MelodyMind Sleeves

### Idee

Eine Galerie für Coverkunst.

### Funktionen

- Cover im Vollbild
- Detailansicht
- Serienvergleich
- Sortierung nach Farben oder Motiven
- Cover Reveal Quiz
- Posteransicht
- Wallpaper-Download, sofern angeboten

### MVP

- vollständige Covergalerie
- Filter nach Genre und Serie
- Fokusmodus ohne weitere Seitenelemente
- Link zum Album

### Empfehlung

Kann als visuell starker Discovery-Einstieg funktionieren, sollte aber immer den Weg
zur Musik offenhalten.

---

## 20. MelodyMind Archive

### Idee

Eine geordnete Download- und Metadaten-App für Sammler.

### Inhalte

- vollständige Albumdownloads
- einzelne Tracks
- Lyrics
- Cover
- Liner Notes
- Formate und Dateigrößen
- Versionshinweise
- Paket pro Album

### MVP

- einheitliche Downloadansicht pro Album
- verständliche Dateinamen
- Paketinhalt vor dem Download
- Versionsdatum
- Hinweise zu Nutzung und Rechten

### Ausbaustufen

- Prüfsummen
- Release-Versionen
- Metadatenexport
- Sammlung heruntergeladener Alben
- Offline-Verfügbarkeit in der PWA

---

## 22. MelodyMind Classroom

### Idee

Ein Lernbereich rund um Songwriting, Konzeptalben und Musikgeschichte.

### Mögliche Lektionen

- Wie erzählt ein Album eine Geschichte?
- Was ist ein musikalisches Leitmotiv?
- Wie verändert Trackreihenfolge eine Handlung?
- Wie unterscheiden sich Genre und Stimmung?
- Wie funktionieren wiederkehrende Figurenstimmen?

### MVP

- drei kurze Lektionen
- konkrete MelodyMind-Tracks als Beispiele
- Hörübung am Ende
- Quellen und Begriffe

### Ausbaustufen

- Unterrichtsmaterial als PDF
- Aufgaben für Gruppen
- Quiz-Integration
- mehrsprachige Lektionen
- Creator-Aufgabe zum Entwerfen eines Albums

---

## 23. MelodyMind Creator

### Idee

Ein Werkzeug zum Entwerfen eines eigenen Konzeptalbums, zunächst ohne
Musikgenerierung.

### Eingaben

- Thema
- Hauptfigur
- Konflikt
- Schauplatz
- musikalische Entwicklung
- Anzahl der Tracks
- Wendepunkt
- Schluss

### Ergebnis

- Albumprämisse
- Figurenübersicht
- dramaturgische Trackrollen
- Stimmungsentwicklung
- bearbeitbare Tracktitel
- exportierbares Konzept

### MVP

- geführtes Formular
- klare Struktur statt Chat
- vollständig bearbeitbares Ergebnis
- Markdown-Export
- keine automatische Veröffentlichung

### Risiko

Creator darf nicht zur Quelle massenhaft austauschbarer Albumideen werden. Das
Werkzeug sollte Entscheidungen sichtbar machen und den Nutzer zum Überarbeiten
zwingen, statt sofort ein scheinbar fertiges Werk auszugeben.

---

## 24. MelodyMind Release Room

### Idee

Eine Präsentationsseite für neue Albumveröffentlichungen.

### Vor Veröffentlichung

- Coverausschnitt
- Countdown
- Story-Teaser
- teilweise verborgene Trackliste
- Termin vormerken

### Bei Veröffentlichung

- gemeinsamer Start
- vollständige Trackliste
- Story Mode
- Reaktionen
- Quiz
- Making-of

### Nach Veröffentlichung

- dauerhafte Release-Chronik
- redaktionelle Rückschau
- Links zu verwandten Alben
- Hörstatistik, sofern datenschutzfreundlich möglich

### Empfehlung

Zunächst als besondere Album-Landingpage testen. Eine eigene App lohnt sich nur bei
regelmäßigen Premieren.

---

## 25. MelodyMind API

### Idee

Eine öffentliche, schreibgeschützte Schnittstelle für den Katalog.

### Mögliche Daten

- Alben
- Tracklisten
- Genres
- Serien
- Cover
- Sprachen
- Stimmungen
- Laufzeiten
- kanonische URLs

### Mögliche Anwendungen

- alternative Player
- Discord-Bots
- Community-Visualisierungen
- externe Albumlisten
- eigene Discovery-Experimente

### Risiken

- Audio- und Downloadrechte
- stabile Versionierung
- Missbrauch durch Scraper
- zusätzlicher Dokumentationsaufwand
- langfristige Kompatibilität

### Empfehlung

Erst veröffentlichen, wenn ein konkreter externer Anwendungsfall besteht. Ein interner
gemeinsamer Katalog-Feed für Music und Quiz kann deutlich früher sinnvoll sein.

---

## Was vorerst Teil von Music bleiben sollte

Diese Funktionen verbessern den normalen Hörvorgang und benötigen keine eigene App:

- Continue Listening
- Mood Navigator
- Favoriten
- Series Marathon
- zufälliges Album
- Laufzeitfilter
- Teilen ab Zeitmarke
- ähnliche Alben
- persönliche Queue
- zuletzt gehörte Alben
- Radio-Prototyp
- Story-Mode-Pilot

## Was eine eigene App tragen könnte

| App      | Eigenständiger Nutzungsgrund             |
| -------- | ---------------------------------------- |
| Stories  | Album als interaktive Erzählung erleben  |
| Radio    | Ohne vorherige Auswahl dauerhaft hören   |
| Atlas    | Den Katalog visuell erforschen           |
| Quiz Lab | Wiederkehrendes Spiel mit eigenem Ablauf |
| Rooms    | Gemeinsam und synchron hören             |
| Studio   | Entstehung und Produktion erkunden       |
| Daily    | Tägliches kuratiertes Ritual             |
| Visuals  | Lean-back-Nutzung auf großen Displays    |
| Creator  | Eigene Albumkonzepte entwerfen           |
| API      | Externe Anwendungen ermöglichen          |

## Empfohlene Reihenfolge

### Stufe 1: vorhandene Grundlagen besser nutzen

1. Continue Listening
2. Series Marathon
3. Mood Navigator
4. Favoriten und lokale Hörhistorie
5. Radio mit fünf festen Sendern
6. Verbindung von Music und Quiz

### Stufe 2: eine eigene Identität aufbauen

1. Story Mode für ein ausgewähltes Album
2. albumbezogene Quizfragen
3. MelodyMind Daily
4. Studio-Seiten für ausgewählte Alben
5. Listening Passport

### Stufe 3: Discovery vertiefen

1. MelodyMind Trails
2. Atlas-Prototyp
3. persönliche Radiosender
4. Lyrics und Übersetzungen
5. Visuals für TV und Tablet

### Stufe 4: Community testen

1. Listening Room ohne offenen Chat
2. geplante Premieren
3. MelodyMind Clubs
4. optionale Konten
5. Synchronisierung zwischen Geräten

## Drei empfohlene Prototypen

### Story Mode

Story Mode zeigt am deutlichsten, was MelodyMind von gewöhnlichen Musikarchiven
unterscheidet. Ein einziger sauber ausgearbeiteter Album-Pilot reicht für eine erste
Bewertung.

### MelodyMind Radio

Radio nutzt den gesamten vorhandenen Katalog und schafft einen einfachen Grund,
regelmäßig zurückzukehren. Die erste Version kann vollständig regelbasiert arbeiten.

### Quiz Lab

Quiz Lab verbindet die beiden bestehenden Apps, benötigt für den Einstieg keinen
großen neuen Backend-Dienst und verwandelt vorhandene Musik direkt in Interaktion.

## Kleine Experimente

Diese Änderungen können einzelne Hypothesen testen, bevor größere Apps entstehen:

- „Surprise me“ auf der Startseite
- Filter „I have 30 minutes“
- „Play full series“
- ein Album des Tages
- eine teilbare URL ab Zeitmarke
- lokale Favoriten
- drei feste Radiosender
- ein Story-Track mit Szenentext
- fünf Quizfragen zu einem Album
- ein Cover-Reveal-Spiel
- ein persönlicher Hörverlauf

## Mögliche Erfolgsmessung

Die Sammlung soll nicht automatisch dazu führen, möglichst viele Kennzahlen zu
erheben. Wenige, verständliche Signale reichen:

- gestartete und vollständig gehörte Alben
- Wechsel zum nächsten Serienalbum
- wiederkehrende Radio-Sessions
- Nutzung von Continue Listening
- abgeschlossene Albumquizze
- Interaktion mit Story-Szenen
- Rückkehr zu Daily
- geteilte Album-, Track- oder Szenenlinks

Personenbezogenes Tracking ist für diese ersten Fragen nicht notwendig.

## Bewusste Nicht-Ziele

Folgende Richtungen passen derzeit nicht gut zur Positionierung:

- generischer Social Feed
- öffentliche Followerzahlen
- Popularitätsrankings als Hauptnavigation
- AI-Chatbot als zentrale Suche
- verpflichtende Benutzerkonten für grundlegende Funktionen
- automatisch erzeugte Massenplaylists ohne redaktionelle Idee
- offene Kommentare ohne Moderationskonzept
- Engagement-Streaks mit Verlustandrohung
- Autoplay beim ersten Seitenbesuch
- einzelne Songs auf Kosten des Albumzusammenhangs priorisieren

## Externe Referenzen

Diese Produkte dienen als Hinweise auf funktionierende Nutzungsmuster, nicht als
Vorlagen, die kopiert werden sollen:

- [Bandcamp Listening Parties](https://bandcamp.com/about_listening_parties):
  gemeinsames Hören vollständiger Alben mit Liner Notes und Live-Kontext
- [Bandcamp Clubs](https://bandcamp.com/about_clubs):
  monatliche, kuratierte Albumauswahl und gemeinsames Hören
- [Spotify Jam](https://newsroom.spotify.com/2023-09-26/spotify-jam-personalized-collaborative-listening-session-free-premium-users/):
  synchrone Sessions und gemeinsame Queues
- [Spotify Discovery](https://newsroom.spotify.com/2025-01-22/4-tips-to-supercharge-your-discovery-on-spotify-in-2025/):
  zeit- und nutzungsabhängige Discovery
- [ListenBrainz](https://listenbrainz.org/add-data/):
  Hörhistorie, Statistiken und offene Musikdaten
- [NTS](https://www.nts.live/about):
  redaktionell kuratiertes Radio und ein langfristiges Sendungsarchiv
- [Apple Music Lyrics Translation](https://www.apple.com/uk/newsroom/2025/06/apple-services-deliver-powerful-features-and-intelligent-updates-to-users-this-fall/):
  Übersetzung und Aussprachehilfe für Lyrics

## Backlog-Status

| Status    | Bedeutung                                        |
| --------- | ------------------------------------------------ |
| Idea      | Ungeprüfte Idee                                  |
| Candidate | Passt zur Produktstrategie                       |
| Prototype | Kleine testbare Version wird geplant oder gebaut |
| Validated | Nutzung oder Feedback bestätigt den Wert         |
| Planned   | Umsetzung wurde priorisiert                      |
| Rejected  | Bewusst verworfen, mit dokumentierter Begründung |

Aktuell besitzen alle Einträge in diesem Dokument den Status **Idea**. Die drei
empfohlenen Prototypen sind die ersten Kandidaten für eine spätere Priorisierung.
