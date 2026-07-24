# MelodyMind Editorial App Ideas

Stand: 24. Juli 2026

Dieses Dokument sammelt eigenständige redaktionelle Musik-Apps für Hörer und Leser.
Die Inhalte werden von MelodyMind geplant, recherchiert und veröffentlicht. Die Apps
richten sich nicht an Musiker als Arbeitswerkzeuge und sind weder Streamingdienst noch
Quiz.

## Ausgangspunkt

Die neue Produktfamilie soll drei Fragen beantworten:

1. **Was höre ich hier?**
2. **Warum klingt oder wirkt es so?**
3. **Wie hängt es mit anderen Alben, Menschen, Orten und Entwicklungen zusammen?**

MelodyMind kann dafür Musikjournalismus, Hintergrundwissen und interaktive
Darstellungen verbinden.

## Klare Abgrenzung

Die vorhandenen Apps behalten ihre Aufgaben:

- **MelodyMind Music:** Konzeptalben entdecken, abspielen und lesen
- **MelodyMind Quiz:** Musikwissen spielerisch prüfen

Die neuen redaktionellen Apps:

- veröffentlichen recherchierte Inhalte
- bereiten Musik für Hörer und Leser auf
- können auf Musik bei MelodyMind oder externen Diensten verlinken
- können kurze lizenzierte oder eigene Audiobeispiele einsetzen
- benötigen keinen persönlichen Hörverlauf
- sind keine Tools für Releaseplanung, Songwriting oder Bandorganisation

## Empfohlene App-Familie

Nicht jedes redaktionelle Format braucht eine eigene Subdomain. Eine klare Familie aus
vier Haupt-Apps und einem späteren Community-Produkt ist verständlicher:

| App                  | Hauptaufgabe                        | Typische Formate                   | Priorität |
| -------------------- | ----------------------------------- | ---------------------------------- | --------: |
| MelodyMind Knowledge | Musik verständlich erklären         | Genre Guides, Glossar, Zeitleisten | Sehr hoch |
| MelodyMind Reviews   | Alben kritisch einordnen            | Reviews, Reappraisals, Vergleiche  | Sehr hoch |
| MelodyMind Stories   | Menschen, Orte und Szenen erzählen  | Features, Interviews, Reportagen   |      Hoch |
| MelodyMind Lab       | Musik interaktiv erkunden           | Karten, Netzwerke, Datenessays     |      Hoch |
| MelodyMind Club      | gemeinsam kuratiert hören und lesen | Album des Monats, Diskussion       |    Später |

Diese fünf Apps bilden unterschiedliche Nutzungserwartungen:

- **Knowledge:** Ich möchte etwas verstehen.
- **Reviews:** Ich möchte wissen, wie ein Album eingeordnet wird.
- **Stories:** Ich möchte eine gute Musikgeschichte lesen.
- **Lab:** Ich möchte einen Zusammenhang selbst erkunden.
- **Club:** Ich möchte mich über ein ausgewähltes Album mit anderen beschäftigen.

---

# 1. MelodyMind Knowledge

## Idee

Eine recherchierte Wissens-App für Genres, Produktion, Instrumente, Musikkultur und
Hörbegriffe. Knowledge soll kein alphabetisches Lexikon mit kurzen Definitionen
werden, sondern ein geführter Einstieg in musikalische Zusammenhänge.

## Kernnutzen

Viele Texte über Musik setzen Vorwissen voraus. Knowledge erklärt Begriffe und
Entwicklungen so, dass Leser anschließend genauer hören können.

## Inhaltssäulen

### Genre Guides

Ein Genre wird nicht nur definiert, sondern über Klang, Geschichte, Orte und wichtige
Entwicklungen erklärt.

Möglicher Aufbau:

1. kurze klangliche Orientierung
2. historische Entstehung
3. rhythmische und harmonische Merkmale
4. typische Instrumentierung
5. regionale Unterschiede
6. wichtige Wendepunkte
7. Einstiegsempfehlungen
8. Quellen

Beispiele:

- Was Gothic Rock von Gothic Metal unterscheidet
- Wie Dub Raum und Studioeffekte zum Instrument machte
- Warum Power Metal in verschiedenen Ländern anders klingt
- Vom Chanson zum französischen Pop
- Wie Folk-Traditionen in Metal weiterleben

### How to Listen

Hörführer zu musikalischen Details:

- Wie hört man einen Basslauf?
- Was macht ein Arrangement dicht?
- Wie funktioniert ein Leitmotiv?
- Was verändert ein Taktwechsel?
- Wie erzeugt Produktion räumliche Tiefe?
- Was unterscheidet Live- und Studioversionen?

### Music Terms

Ein Glossar mit verständlichen Beispielen:

- Bridge
- Breakdown
- Ostinato
- Polyrhythmus
- Call and Response
- Drone
- Double Tracking
- Reverb
- Leitmotiv
- Konzeptalbum

Jeder Begriff erhält:

- eine kurze Definition
- eine ausführlichere Erklärung
- ein visuelles oder notiertes Beispiel
- ein eigenes oder lizenziertes Audiobeispiel
- Verbindungen zu verwandten Begriffen

### Instruments and Sound

- Wie verschiedene Gitarrenstimmungen wirken
- Warum ein Mellotron anders klingt als ein moderner Synthesizer
- Instrumente regionaler Folk-Traditionen
- Wie bestimmte Mikrofontechniken den Klang verändern
- Geschichte einzelner elektronischer Instrumente

### Music and Technology

- Vom Tonband zum digitalen Editing
- Wie Sampling Produktionsweisen verändert hat
- Geschichte der Drum Machine
- Was verlustbehaftete Kompression hörbar verändert
- Wie Streaming die Albumlänge beeinflusst hat

## Interaktive Elemente

### Layer Explorer

Ein kurzer eigener Audioclip wird in einzelne Schichten aufgeteilt:

- Rhythmus
- Bass
- Harmonie
- Melodie
- Effekte

Leser können Schichten ein- und ausschalten und hören, welche Funktion sie erfüllen.

### Rhythm Visualizer

Ein Pattern wird gleichzeitig als Raster, Bewegung und Klang dargestellt.

### Before and After

Zwei eigene Beispiele zeigen eine Produktionsentscheidung:

- trocken und mit Reverb
- mono und breit
- unbearbeitet und komprimiert
- gerader und synkopierter Rhythmus

### Begriffnetz

Verwandte Begriffe werden als kleines, erklärtes Netz dargestellt. Jede Verbindung
braucht einen redaktionellen Satz und darf nicht nur eine dekorative Linie sein.

## MVP

- ein Genre Guide
- fünf Music Terms
- ein How-to-Listen-Artikel
- ein interaktives Audiobeispiel
- vollständige Quellen
- statische Astro-Seiten mit kleinen clientseitigen Inseln
- keine Benutzerkonten

## Ausbaustufen

- thematische Lernpfade
- interaktive Zeitleisten
- mehrsprachige Artikel
- eigene Illustrationen und Diagramme
- Gastautoren
- Knowledge-Newsletter
- druckbare Kurzfassungen

## Redaktionelle Anforderungen

- Begriffe nicht unnötig vereinfachen
- Unterschiede zwischen Szenen und Regionen sichtbar machen
- historische Behauptungen belegen
- Audiobeispiele selbst produzieren oder Rechte klären
- keine erfundenen Zitate oder Autoritäten

## Erfolgssignale

- Leser öffnen mehrere verbundene Artikel
- Glossarbegriffe werden aus anderen Apps aufgerufen
- interaktive Beispiele werden tatsächlich bedient
- Nutzer kehren über thematische Pfade zurück

## Empfehlung

Knowledge ist der stärkste neue App-Kandidat. Die App kann klein starten, unterstützt
alle späteren redaktionellen Produkte und passt zu MelodyMinds bestehendem Anspruch an
erklärende Musiktexte.

---

# 2. MelodyMind Reviews

## Idee

Eine eigenständige App für Albumkritik. Reviews sollen begründen, wie ein Album
arbeitet, wo es überzeugt, wo es scheitert und in welchem Kontext es steht.

## Redaktionelle Position

Eine Review ist keine Produktbeschreibung und keine automatisch verlängerte
Empfehlung. Sie braucht:

- eine erkennbare These
- konkrete musikalische Beobachtungen
- Kontext
- begründete Kritik
- klare Autorenschaft
- ein Veröffentlichungsdatum

## Mögliche Review-Formate

### Full Review

Eine ausführliche Albumkritik.

Aufbau:

1. zentrale These
2. musikalische und thematische Einordnung
3. zwei bis vier konkrete Trackbeispiele
4. Stärken
5. Schwächen oder Grenzen
6. Schluss ohne Kaufaufforderung

### Album of the Week

Ein wöchentlich ausgewähltes Album mit:

- kompakter Review
- drei Hörhinweisen
- Kontext zum Künstler oder zur Szene
- einem vertiefenden Link
- externer Hörmöglichkeit

### Reappraisal

Eine erneute Betrachtung eines älteren Albums:

- damalige Rezeption
- heutige Wirkung
- was gealtert ist
- was weiterhin trägt
- welche späteren Entwicklungen das Album anders erscheinen lassen

### Second Listen

Ein Autor hört ein Album nach einem festgelegten Abstand erneut und dokumentiert, was
sich an der Einschätzung verändert hat.

### Two Critics

Zwei Autoren schreiben unabhängig über dasselbe Album. Die App stellt keine
künstliche Gewinnerfrage, sondern zeigt unterschiedliche Hörperspektiven.

### Short Reviews

Kurze Kritiken mit einer klaren Beobachtung. Kein bloßer Absatz aus Adjektiven.

### Series Review

Mehrere zusammengehörige Alben werden als Werkfolge betrachtet:

- Entwicklung
- wiederkehrende Motive
- Brüche
- stärkster Teil
- Wirkung des Gesamtbogens

## Bewertungssystem

Eine numerische Skala ist nicht zwingend notwendig. Mögliche Alternativen:

- keine Wertung, nur Text
- redaktionelle Kategorien wie „Recommended“, „Mixed“ oder „Not for us“
- getrennte Einschätzung von Komposition, Produktion und Dramaturgie

Empfehlung:

> Zunächst ohne Zahlenwertung starten. Eine präzise Review ist wertvoller als eine
> scheinbar exakte 7,8.

## Interaktive Elemente

### Review Map

Die Review zeigt, an welchen Stellen des Albums die Argumentation ansetzt:

- Track 2: Aufbau
- Track 4: Wendepunkt
- Track 7: schwächste Wiederholung
- letzter Track: Schlusswirkung

### Perspective Switch

Bei Two Critics können Leser zwischen beiden Texten wechseln oder Abschnitte
nebeneinander vergleichen.

### First Listen / Later Listen

Zwei veröffentlichte Fassungen derselben Einschätzung werden sichtbar verglichen.
Änderungen werden begründet, nicht heimlich überschrieben.

### Reader Reflection

Nach dem Lesen kann ein Leser eine private Notiz speichern:

- Was habe ich anders gehört?
- Welcher Punkt überzeugt mich nicht?
- Worauf möchte ich beim nächsten Hören achten?

Keine öffentliche Sternebewertung im MVP.

## Glaubwürdigkeit bei MelodyMind-eigenen Alben

Eigene Veröffentlichungen sollten nicht wie unabhängig rezensierte externe Werke
dargestellt werden.

Mögliche Kennzeichnungen:

- Editorial Note
- Track-by-track Commentary
- Production Reflection
- Retrospective

Eine eigentliche Review benötigt redaktionelle Distanz und sollte bevorzugt externe
Musik behandeln.

## MVP

- fünf vollständige Reviews
- ein Album of the Week
- eine Reappraisal
- klare Autorenseiten
- Quellen und Hörlinks
- keine Nutzerbewertungen
- keine Kommentare

## Ausbaustufen

- mehrere Autoren
- Genre- und Jahresarchive
- Two Critics
- Review-Newsletter
- thematische Review-Reihen
- Leserbriefe nach Moderation
- Verbindungen zu Knowledge und Stories

## Erfolgssignale

- Reviews werden vollständig gelesen
- Leser öffnen erwähnte Knowledge-Begriffe
- ältere Reviews bleiben auffindbar
- Album-of-the-Week-Leser kehren wieder

## Empfehlung

Reviews ist der zweite starke App-Kandidat. Für Glaubwürdigkeit braucht die App von
Anfang an Autorenschaft, redaktionelle Standards und eine klare Trennung zwischen
Kritik und eigener Promotion.

---

# 3. MelodyMind Stories

## Idee

Eine Longform-App für Musikjournalismus. Stories erzählt von Menschen, Orten, Szenen,
Werken und kulturellen Veränderungen.

## Formate

### Artist Portrait

Kein umgeschriebener Pressetext, sondern ein Porträt mit klarer Perspektive,
Arbeitsweise und musikalischem Kontext.

### Scene Report

Eine lokale oder zeitlich begrenzte Szene wird über Orte, Beteiligte, Veröffentlichungen
und Konflikte erzählt.

### Label Profile

- ästhetische Linie
- wichtige Veröffentlichungen
- Arbeitsweise
- regionale Rolle
- Veränderung über die Zeit

### Studio Story

Ein Studio als Ort musikalischer Begegnung:

- technische Besonderheiten
- Menschen
- prägende Aufnahmen
- Veränderungen

### Oral History

Mehrere Beteiligte erinnern sich an ein gemeinsames Ereignis oder eine Szene.
Widersprüche dürfen sichtbar bleiben.

### Cover Story

Die Entstehung und Wirkung eines Covers:

- Art Direction
- Fotografie oder Illustration
- Typografie
- verschiedene Ausgaben
- kultureller Kontext

### Track Story

Die Geschichte eines einzelnen Songs, ohne Lyrics vollständig zu reproduzieren:

- Entstehung
- Aufnahme
- Veröffentlichung
- spätere Versionen
- Rezeption

### Music and Place

Eine musikalische Geschichte entlang eines Ortes:

- Straße
- Club
- Stadtteil
- Hafen
- Studio
- Festivalgelände

## Interaktive Elemente

### Scrollytelling

Karte, Zeitleiste oder Bilddetail verändert sich beim Lesen. Die Interaktion dient der
Erklärung und darf den Text nicht in eine Animation zerlegen.

### Oral-History-Wechsel

Leser können dieselbe Situation aus mehreren Stimmen betrachten.

### Then and Now

Historische und aktuelle Bilder eines Ortes werden verglichen.

### Annotated Artifact

Ein Flyer, Cover oder Studioplan erhält anklickbare redaktionelle Anmerkungen.

### Story Route

Eine Geschichte wird entlang mehrerer Orte auf einer Karte gelesen. Eine lineare
Textansicht bleibt immer verfügbar.

## MVP

- ein Artist Portrait
- ein Scene Report
- eine Cover Story
- ein interaktives Element
- Autorenangaben
- Quellen
- Bildrechte

## Ausbaustufen

- thematische Serien
- Audiointerviews
- Fotoessays
- mehrsprachige Reportagen
- Gastredaktionen
- jährliche digitale Ausgabe

## Redaktionelle Anforderungen

- Pressetexte nur als Quelle, nicht als fertige Erzählung verwenden
- lebende Personen fair und überprüfbar darstellen
- Zitate autorisieren oder sauber belegen
- Orts- und Szenegeschichte nicht romantisieren
- Bildrechte dokumentieren

## Empfehlung

Stories eignet sich für weniger häufige, aber hochwertige Veröffentlichungen.
Bandcamp Daily zeigt, wie Album des Tages, Features, Scene Reports, Label Profiles und
Listen unter einer redaktionellen Marke zusammenarbeiten können. MelodyMind sollte
kleiner beginnen und eine eigene Themenauswahl entwickeln.

---

# 4. MelodyMind Lab

## Idee

Eine App für interaktive Musikessays und visuelle Experimente. Lab veröffentlicht
weniger Beiträge als Knowledge oder Reviews, jeder Beitrag besitzt dafür eine eigene
Interaktion.

## Grundregel

Ein Lab-Projekt beginnt mit einer Frage, nicht mit einem visuellen Effekt.

Gute Frage:

> Wie verbreitete sich eine lokale Rhythmusidee über mehrere Städte und Genres?

Schwache Frage:

> Welche Animation könnte man mit Albumcovern bauen?

## Formate

### Music Atlas

Eine Karte erklärt Orte, Migration, Studios, Clubs und regionale Entwicklungen.

Beispiele:

- Wege eines Genres
- Studios einer Stadt
- Soundsystem-Kultur
- unabhängige Labels entlang einer Region

### Interactive Timeline

Parallele Entwicklungen werden vergleichbar:

- technische Innovation
- gesellschaftlicher Kontext
- wichtige Veröffentlichungen
- regionale Abweichungen

### Credits Network

Eine visuelle Verbindung zwischen Musikern, Produzenten, Studios, Labels und
Aufnahmen. Jede Linie erhält eine verständliche Erklärung.

### Album Anatomy

Ein Album wird als Dramaturgie dargestellt:

- Energieverlauf
- Tonarten oder Tempi
- wiederkehrende Motive
- Perspektivwechsel
- Trackfunktionen

Die Darstellung muss auf recherchierten oder eigenen Daten beruhen.

### Song Anatomy

Ein eigenes oder lizenziertes Audiobeispiel wird in Abschnitte zerlegt:

- Intro
- Verse
- Pre-chorus
- Chorus
- Bridge
- Outro

Leser können die Form hören und gleichzeitig sehen.

### Compare

Zwei Werke, Versionen oder Produktionsweisen werden nebeneinander betrachtet:

- Original und Cover
- Studio und Live
- frühe und spätere Aufnahme
- Mono und Stereo
- zwei regionale Ausprägungen eines Genres

### Influence Paths

Eine redaktionell belegte Folge von Verbindungen. Die App darf Einfluss nicht allein
aus Ähnlichkeit ableiten.

### Data Essay

Eine konkrete musikjournalistische Frage wird mit Daten untersucht:

- Wie veränderte sich die durchschnittliche Tracklänge in einem abgegrenzten Korpus?
- Welche Instrumente tauchen in den Credits einer Szene besonders häufig auf?
- Wie international waren die Beteiligten ausgewählter Festivals?

### Cover Explorer

Cover einer Reihe oder Epoche werden nach Gestaltung, nicht nach Popularität,
untersucht.

## MVP

- ein Interactive Timeline Essay
- ein Credits Network
- ein Album-Anatomy-Prototyp mit eigenen MelodyMind-Daten
- lineare Alternativansicht
- vollständige Methodik
- Quellen und Datenexport

## Ausbaustufen

- mehrere Lab-Reihen
- wiederverwendbare Visualisierungskomponenten
- Methodikseiten
- offene Datensätze
- Gastprojekte
- Embeds

## Barrierefreiheit

Jedes Experiment benötigt:

- vollständige Textalternative
- Tastaturbedienung
- verständliche Fokusreihenfolge
- reduzierte Bewegung
- keine Information nur durch Farbe
- Daten in Tabellenform
- Transkript für Audio

## Risiken

- Visualisierung kann Unsicherheit verstecken
- externe Daten sind häufig unvollständig
- Audiorechte
- hoher Entwicklungsaufwand pro Beitrag
- Interaktion kann auf Mobilgeräten scheitern

## Empfehlung

Lab sollte nicht zum Start wöchentlich veröffentlichen. Zwei bis vier starke Projekte
pro Jahr reichen, wenn sie redaktionell und technisch substanziell sind.

---

# 5. MelodyMind Club

## Idee

Ein redaktionell geführter Albumclub. Jeden Monat wird ein Album ausgewählt, erklärt
und gemeinsam besprochen. Die Musik wird über einen legalen externen Dienst oder
MelodyMind Music geöffnet.

## Monatlicher Ablauf

### Woche 1: Einführung

- Warum dieses Album?
- historischer und musikalischer Kontext
- kurze Hörvorbereitung
- Verfügbarkeit

### Woche 2: Deep Listening

- drei konkrete Hörhinweise
- Track oder Passage, auf die man achten sollte
- Knowledge-Verweise
- private Notizen

### Woche 3: Gespräch

- moderierte Leitfragen
- zwei redaktionelle Perspektiven
- optionaler gemeinsamer Hörtermin

### Woche 4: Rückblick

- wichtigste Beobachtungen
- Leserbriefe nach Moderation
- Verbindung zum nächsten Album

## Club-Varianten

- Heavy Music Club
- Concept Album Club
- Folk and Myth Club
- Political Records Club
- Album Design Club
- One City, One Record
- Reappraisal Club

## Interaktive Elemente

- private Hörnotizen
- Abstimmung zwischen drei redaktionell ausgewählten Folgealben
- moderierte Leserfragen
- gemeinsame Timeline
- Karte der teilnehmenden Länder nur mit freiwilliger, grober Angabe
- Listening Room ohne offenen Chat

## MVP

- ein frei zugängliches Album des Monats
- redaktionelle Einführung
- drei Hörfragen
- externe Hörlinks
- private lokale Notizen
- Rückblick
- keine Konten
- keine Kommentare

## Ausbaustufen

- mehrere Clubs
- Newsletter
- eingeladene Gastmoderatoren
- moderierte Leserbriefe
- geplante Listening Rooms
- Clubarchiv

## Risiken

- Verfügbarkeit unterscheidet sich nach Region
- Community-Moderation
- Auswahl kann wie Promotion wirken
- ein fester monatlicher Rhythmus bindet redaktionelle Kapazität

## Empfehlung

Club erst starten, wenn Knowledge, Reviews oder Stories regelmäßig Inhalte liefern.
Bandcamp Clubs verbindet kuratierte Albumauswahl, redaktionellen Kontext und
gemeinsames Hören. MelodyMind könnte eine frei zugängliche, kleinere Variante mit
stärkerem Lern- und Lesefokus entwickeln.

---

# Weitere redaktionelle Formate

Die folgenden Ideen benötigen nicht zwingend eigene Apps. Sie können als feste Reihen
unter Knowledge, Reviews, Stories oder Lab erscheinen.

## Album of the Day

Eine kurze, konkrete Vorstellung eines Albums:

- ein Absatz
- ein musikalisches Detail
- eine Einordnung
- ein Hörlink

Nicht täglich starten, wenn die Redaktion den Rhythmus nicht halten kann. „Album of
the Week“ ist für MelodyMind realistischer.

## Where to Start

Ein geführter Einstieg in:

- einen Künstler
- ein Label
- ein Genre
- eine regionale Szene
- eine lange Albumserie

Die Auswahl wird begründet und besitzt eine klare Reihenfolge.

## Five Records

Eine Person oder Redaktion wählt fünf Alben zu einer konkreten Frage. Die Reihe darf
nicht zu einer beliebigen Listicle-Maschine werden.

## One Album, Three Contexts

Ein Album wird gleichzeitig betrachtet als:

- musikalisches Werk
- Produkt seiner Zeit
- Teil einer persönlichen oder politischen Geschichte

## The Difficult Album

Eine Reihe über sperrige Werke und mögliche Zugänge. Kein Versuch, jede Kritik als
fehlendes Verständnis abzutun.

## Overlooked

Neue Betrachtungen wenig beachteter Alben. „Übersehen“ muss mit damaliger Rezeption
oder Verfügbarkeit begründet werden.

## The First Ten Minutes

Ein genauer Blick auf die Eröffnung eines Albums. Geeignet für kurze interaktive
Formanalysen.

## Closing Tracks

Wie letzte Songs ein Album abschließen, öffnen oder bewusst unaufgelöst lassen.

## Version History

Original, Demo, Liveversion, Remix und Neuaufnahme werden in ihrem jeweiligen Kontext
verglichen.

## Producer Signature

Wiederkehrende Arbeitsweisen einer produzierenden Person werden anhand belegbarer
Credits und konkreter Aufnahmen untersucht.

## Scene Dispatch

Kompakter Bericht aus einer Stadt oder Szene mit drei aktuellen oder historischen
Einstiegen.

## The Record Shelf

Musiker, Autoren, Designer oder Hörer erklären fünf Platten aus ihrer eigenen
Sammlung. Die Auswahl braucht persönliche oder fachliche Begründung.

## Music Books

Rezensionen und Leselisten zu:

- Biografien
- Szenegeschichten
- Produktion
- Kritik
- Musiktheorie
- Fotobänden

## Screen and Sound

Musik in Film, Serie und Games:

- Score
- Songauswahl
- Leitmotive
- musikalische Dramaturgie
- kultureller Kontext

## Reader Letters

Moderierte Leserreaktionen auf Reviews und Essays. Leserbriefe werden ausgewählt,
gekürzt nur mit Kennzeichnung und nicht als unmoderierter Kommentarbereich
veröffentlicht.

---

# Interaktive Ideen im Detail

## 1. Genre Family Tree

Eine redaktionell erklärte Entwicklungslinie. Verbindungen zeigen belegte Einflüsse,
gemeinsame Szenen oder dokumentierte Übergänge.

Nicht geeignet:

- automatische Ableitung nur aus Tags
- eine einzige lineare Ursprungsgeschichte
- Darstellung umstrittener Begriffe als Fakten

## 2. Scene Map

Eine Karte mit:

- Venues
- Studios
- Plattenläden
- Labels
- Fanzines
- Treffpunkten

Jeder Ort erhält Zeitrahmen, Quellen und redaktionellen Kontext.

## 3. Album Energy Curve

Tracks werden nach redaktionell erklärter Energie und Dramaturgie dargestellt. Die
Kurve ist eine Interpretation, keine objektive Messung.

## 4. Motif Tracker

Wiederkehrende musikalische oder erzählerische Motive werden entlang eines Albums
markiert.

## 5. Credits Web

Leser folgen Beteiligten von Aufnahme zu Aufnahme. Fehlende Credits werden sichtbar
als Datenlücke gekennzeichnet.

## 6. Production A/B

Eigene Audiobeispiele machen einen Produktionsunterschied hörbar.

## 7. Interactive Liner Notes

Cover, Booklet und Credits erhalten anklickbare Anmerkungen.

## 8. Track Role Explorer

Leser sehen, welche dramaturgische Funktion ein Track innerhalb eines Albums erfüllt:

- Eröffnung
- Aufbau
- Wendepunkt
- Kontrast
- Auflösung
- Epilog

## 9. Two Versions

Zwei Versionen eines Werks werden synchron in Struktur und Kontext verglichen.
Audioeinsatz nur mit geklärten Rechten.

## 10. Choose a Listening Path

Leser wählen eine Richtung:

- Geschichte
- Produktion
- Texte
- Instrumentierung

Die Auswahl verändert den Lesepfad, nicht die Fakten.

## 11. Annotated Timeline

Ein Ereignis öffnet:

- kurze Erklärung
- beteiligte Personen
- relevantes Werk
- Ort
- Quelle

## 12. Reader Reflection

Private lokale Notizen begleiten einen Artikel oder Hörführer. Keine öffentliche
Bewertung und kein Login im MVP.

## 13. Data Sonification

Ein kleiner Datensatz wird hörbar gemacht. Die Sonifikation muss erklärt und immer
durch Tabelle und Text ergänzt werden.

## 14. Cover Detail Zoom

Ein hochauflösendes, rechtlich geklärtes Cover wird mit Designanmerkungen versehen.

## 15. Before You Listen / After You Listen

Ein Artikel besitzt zwei Ebenen:

- spoilerfreie Einführung
- vertiefende Analyse nach dem Hören

Der Leser entscheidet selbst, wann die zweite Ebene sichtbar wird.

---

# Empfohlene Informationsarchitektur

## Knowledge

- Genres
- How to Listen
- Music Terms
- Instruments
- Music and Technology
- Timelines

## Reviews

- New Reviews
- Album of the Week
- Reappraisals
- Two Critics
- Series Reviews
- Review Archive

## Stories

- Features
- Scene Reports
- Interviews
- Oral Histories
- Cover Stories
- Music and Place

## Lab

- Maps
- Timelines
- Album Anatomy
- Connections
- Comparisons
- Data Essays

## Club

- Current Album
- Listening Guide
- Discussion
- Archive
- Upcoming

---

# Zusammenspiel der Apps

Ein Beitrag sollte Leser sinnvoll weiterführen:

```text
Review eines Albums
    -> Knowledge-Begriff zur Produktion
    -> Story über die lokale Szene
    -> Lab-Karte zu Orten und Verbindungen
    -> Club-Auswahl für gemeinsames Hören
```

Ein anderes Beispiel:

```text
Knowledge-Artikel über Leitmotive
    -> interaktives Lab-Beispiel
    -> Review eines Konzeptalbums
    -> Story über die Entstehung
```

Die Apps teilen Themen und Begriffe, aber nicht dieselbe Startseite oder
Nutzungserwartung.

---

# Gemeinsames Content-Modell

Mehrere Apps können später dieselben strukturierten Objekte verwenden:

- Article
- Author
- Artist
- Release
- Recording
- Work
- Person
- Place
- Venue
- Scene
- Genre
- Instrument
- Credit
- Source
- Citation
- Media Asset
- Interactive

Wichtige gemeinsame Felder:

- Titel
- Kurzbeschreibung
- Veröffentlichungsdatum
- Aktualisierungsdatum
- Autoren
- Quellen
- Bild- und Audiorechte
- Themen
- erwähnte Werke und Personen
- weiterführende Artikel
- Korrekturhinweis

Eine gemeinsame große Plattform sollte erst gebaut werden, wenn mindestens zwei Apps
dieselben Felder praktisch benötigen.

---

# Redaktionelle Standards

## Autorenschaft

Jeder Beitrag zeigt:

- Autor
- Veröffentlichungsdatum
- Aktualisierungsdatum
- gegebenenfalls Gastautor oder Interviewpartner

## Quellen

Fakten zu Geschichte, Credits, Veröffentlichungen und Zitaten benötigen
nachvollziehbare Quellen.

Mögliche Quellen:

- Primärinterviews
- offizielle Liner Notes
- Archive
- Bücher
- Fachpublikationen
- MusicBrainz für strukturierte Metadaten
- offizielle Künstler- und Labelseiten

## Korrekturen

Sachliche Korrekturen werden mit Datum dokumentiert. Eine Review darf stilistisch
überarbeitet werden, ihre ursprüngliche Wertung oder These sollte aber nicht
unbemerkt verändert werden.

## AI-Transparenz

AI kann bei Rechercheorganisation, Transkription oder Strukturprüfung helfen. Sie ist
kein Autor und darf keine Quellen, Zitate oder Beobachtungen erfinden.

## Rechte

Vor Veröffentlichung klären:

- Cover
- Pressefoto
- Konzertfoto
- Flyer
- Lyrics-Zitat
- Audiobeispiel
- Interviewaufnahme
- Transkript

## Sprache

- konkrete Beobachtung statt Werbesprache
- keine generischen Empfehlungsabsätze
- keine erzwungene Begeisterung
- Kritik nachvollziehbar begründen
- Fachbegriffe erklären, nicht vermeiden

---

# Priorisierte Umsetzung

## Stufe 1: redaktionelle Basis

### MelodyMind Knowledge

- ein Genre Guide
- fünf Glossarbegriffe
- ein How-to-Listen-Artikel

### MelodyMind Reviews

- fünf Albumreviews
- eine Reappraisal
- ein Album of the Week

Ziel:

Den redaktionellen Ton, die Content-Schemas und den realistischen
Veröffentlichungsrhythmus testen.

## Stufe 2: Longform

### MelodyMind Stories

- ein Artist Portrait
- ein Scene Report
- eine Cover Story

Ziel:

Recherche, Bildrechte und lange Lesestrecken unter realen Bedingungen prüfen.

## Stufe 3: Interaktion

### MelodyMind Lab

- eine Timeline
- ein Credits Network
- eine Album Anatomy

Ziel:

Wiederverwendbare interaktive Komponenten entwickeln und ihre mobile sowie
barrierearme Nutzung prüfen.

## Stufe 4: wiederkehrendes Format

### MelodyMind Club

- ein Album des Monats
- Hörführer
- private Notizen
- redaktioneller Rückblick

Ziel:

Regelmäßige Rückkehr und gemeinsame Auseinandersetzung testen.

---

# Drei empfohlene Startprototypen

## 1. Knowledge Pilot

Thema:

> Wie funktioniert ein musikalisches Leitmotiv?

Enthalten:

- ausführlicher Artikel
- drei eigene kurze Audiobeispiele
- Motif Tracker
- fünf verwandte Begriffe
- Quellen

Warum:

Der Pilot verbindet redaktionellen Text, eigenes Audiomaterial und eine kleine
Interaktion.

## 2. Review Pilot

Enthalten:

- drei aktuelle oder bewusst ausgewählte Albumreviews
- eine Review eines älteren Albums
- eine klare Review-Vorlage
- Autorenseiten
- Hörlinks

Warum:

Der Pilot zeigt schnell, ob MelodyMind eine glaubwürdige kritische Stimme entwickeln
kann.

## 3. Interactive Scene Story

Enthalten:

- eine lokale Szene
- fünf Orte
- kurze Zeitleiste
- zwei Personenporträts
- Karte
- Quellen

Warum:

Der Pilot verbindet Stories und Lab, ohne sofort eine große Datenplattform zu
erfordern.

---

# Was ich zunächst nicht empfehlen würde

## Tägliche News

Ein Newsdesk verlangt laufende Geschwindigkeit und konkurriert mit größeren
Publikationen. MelodyMind sollte auf Tiefe und langfristig lesbare Texte setzen.

## Sehr breite Review-Abdeckung

Fünfzig oberflächliche Reviews pro Woche würden die redaktionelle Identität
schwächen. Wenige gut begründete Texte sind glaubwürdiger.

## Unmoderierte Kommentare

Kommentare benötigen Moderation, Meldewege und klare Regeln. Private Leserreflexion
oder ausgewählte Leserbriefe sind bessere Einstiege.

## Automatische AI-Reviews

Sie besitzen keine eigene Hörerfahrung, keine verlässliche Quellenarbeit und keine
glaubwürdige Autorenschaft.

## Kopierte Lyrics

Vollständige Songtexte dürfen nicht ohne geklärte Rechte veröffentlicht werden.
Kurze Zitate müssen begründet und rechtlich geprüft sein.

## Interaktion als Dekoration

Scrollanimationen, 3D-Cover oder bewegte Netzwerke sind nur sinnvoll, wenn sie eine
redaktionelle Aussage verständlicher machen.

## Eine App pro Artikelreihe

Album of the Week, Cover Stories und Scene Reports sind Formate. Sie benötigen keine
jeweils eigene technische App.

---

# Externe Referenzen

Diese Angebote zeigen einzelne funktionierende Muster. MelodyMind sollte sie nicht
kopieren, sondern auf eine kleinere, eigene redaktionelle Linie übertragen:

- [Bandcamp Daily](https://daily.bandcamp.com/):
  Album of the Day, Features, Scene Reports, Label Profiles, Listen und menschliche
  Kuration
- [Bandcamp Daily Features](https://daily.bandcamp.com/features/):
  längere Porträts, historische Rückblicke, Interviews und Szenegeschichten
- [Bandcamp Clubs](https://daily.bandcamp.com/features/introducing-bandcamp-clubs):
  kuratierte Albumauswahl, redaktioneller Kontext und gemeinsames Hören
- [Google Arts & Culture](https://about.artsandculture.google.com/experience/):
  digitale Ausstellungen, geführte Geschichten und interaktive Kulturvermittlung
- [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API):
  strukturierte Daten zu Artists, Releases, Recordings, Works, Places und Beziehungen
- [NTS](https://www.nts.live/about):
  kuratierte Musik, Shows und langfristiges Archiv unter einer klaren
  redaktionellen Identität

---

# Backlog-Status

| Status    | Bedeutung                                        |
| --------- | ------------------------------------------------ |
| Idea      | Ungeprüfte Idee                                  |
| Candidate | Passt zur redaktionellen Strategie               |
| Prototype | Ein kleines reales Format wird gebaut            |
| Validated | Leser oder Hörer nutzen das Format wiederholt    |
| Planned   | Regelmäßige Veröffentlichung ist priorisiert     |
| Rejected  | Bewusst verworfen, mit dokumentierter Begründung |

Aktuell besitzen alle Einträge den Status **Idea**. Knowledge und Reviews sind die
stärksten ersten Kandidaten. Stories und Lab sollten folgen, sobald Ton,
Rechercheprozess und Content-Modell in realen Beiträgen funktionieren.
