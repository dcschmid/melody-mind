# Feature Ideen (rechtssicher, eigenes Datenmaterial)

Ziel: Mehr Entdecker‑Faktor und Engagement ohne externe Rechte, ohne Accounts, ohne zusätzliche DSGVO‑Last.

## 1) Interaktive Zeitleiste

**Kurzbeschreibung**
Eine horizontale/vertikale Timeline je Dekade, Genre oder Szene mit „Knoten“ (Artikel). Filter nach Genres, Regionen, Mood oder Themen.

**Warum spannend**

- Sofortige Orientierung und „Stöber‑Gefühl“
- Verbindet Artikel über Zeitachsen und Trends
- Verweildauer und Seitenaufrufe steigen ohne Dark Patterns

**Datenbasis**

- Nur interne Metadaten: Jahr/Zeitraum, Genre, Region, Themen‑Tags, Stichworte
- Keine fremden Inhalte nötig

**UI‑Ideen**

- Knoten mit kurzer Vorschau (Titel + 1 Satz)
- Hover/Focus: kurze Zusammenfassung + „Lesen“
- Zoom‑Stufen (Jahr → Dekade → Epoche)

**Minimal‑Umsetzung**

- JSON/TS‑Index aus Content‑Frontmatter
- Astro Page + Client‑Island (z. B. kleine Vanilla‑JS Interaktion)

**Legal**

- Unkritisch, da eigene Daten/Struktur

**Zielbild**

- „Zeitstrahl“ als eigenständige Seite und als kleine Mini‑Timeline in Artikeln
- Zeigt Entwicklungen, Peaks und Übergänge zwischen Genres/Scenes

**Datenmodell (Vorschlag)**

- `year` oder `dateRange` (z. B. 1973–1977)
- `decade` (z. B. 1970s)
- `genre`, `region`, `themes` (Tags)
- `importance` (1–3) für visuelle Gewichtung

**Interaktion**

- Filterchips (Genre/Region/Thema)
- „Springe zu Jahr“ + Mini‑Zoom (Jahr → Dekade)
- Knoten‑Details im Sidepanel

**MVP‑Scope**

- 1 Dekade, 10–20 Knoten
- 1–2 Filter, statisches Layout

**Technische Umsetzung**

- Build‑time Index (JSON)
- Astro Page + kleine Client‑Interaktion (no framework nötig)

**Risiken/Abgrenzung**

- Keine harten Zeitdaten ohne Quelle; lieber „Kontext‑Markers“

---

## 2) Genre‑Landkarte (Exploration‑Map)

**Kurzbeschreibung**
Eine „Karte“ als Netz aus Genres/Subgenres mit Verbindungslinien (Einfluss, Parallelentwicklung, Fusion). Klick auf Knoten → Artikelliste.

**Warum spannend**

- Vermittelt musikalische Zusammenhänge visuell
- Zeigt „Wege“ zwischen Genres

**Datenbasis**

- Eigene Taxonomie: Genre‑Knoten + Verbindungen (Einfluss, Herkunft, Zeit)

**UI‑Ideen**

- Zoom/Pan per Drag
- Filter: Jahrzehnt, Region, Stimmung
- Knoten‑Farbe je Epoche/Region

**Minimal‑Umsetzung**

- SVG + simples Force‑Layout oder vorab definierte Koordinaten

**Legal**

- Unkritisch, solange es eigene Taxonomie/Relationen sind

**Zielbild**

- Eine „Karte“ als visuelles Netzwerk zum Entdecken von Beziehungen
- Fokus auf Erkundung statt historischer Präzision

**Datenmodell (Vorschlag)**

- `node`: `id`, `label`, `group` (Genre/Scene), `era`, `region`
- `link`: `source`, `target`, `type` (Einfluss, Fusion, Parallel)

**Interaktion**

- Hover: Kurzbeschreibung + zentrale Einflüsse
- Klick: Artikelliste + „Mehr davon“
- Filter: Epoche/Region/Genre‑Cluster

**MVP‑Scope**

- 12–20 Knoten, 15–30 Verbindungen
- 1 Filter + Klick‑Panel

**Technische Umsetzung**

- SVG + einfache Force‑Simulation oder fixe Koordinaten
- Fallback: statische Karte + Liste

**Risiken/Abgrenzung**

- Keine „Beweis‑Relationen“ behaupten; als kuratierte Karte kennzeichnen

## 4) Lesezeichen lokal

**Kurzbeschreibung**
Favoriten‑Stern pro Artikel, gespeichert lokal. Eine „Deine Sammlung“ Seite zeigt Lesezeichen.

**Warum spannend**

- Nutzerbindung ohne Login
- Fördert „Sammlungsgefühl“

**Minimal‑Umsetzung**

- LocalStorage‑Set je slug
- Kleine „My Library“ Seite mit Filter/Sortierung

**Legal**

- Unkritisch (rein lokal)

**Zielbild**

- Stern‑Icon pro Artikel
- „Deine Sammlung“ Seite mit Sortierung

**Datenmodell (localStorage)**

- Key: `mm_bookmarks`
- Value: `string[]` (Slugs)

**Interaktion**

- Stern toggled lokal
- Sortierung: zuletzt gespeichert / alphabetisch / Dekade

**MVP‑Scope**

- 1 UI‑Komponente + 1 Listing‑Seite
- Einfache Suche in der Sammlung

---

## 5) Quizzes pro Artikel

**Kurzbeschreibung**
3–5 Fragen pro Artikel (Multiple Choice, „Richtig/Falsch“). Auswertung direkt im Browser.

**Warum spannend**

- Lernerlebnis, erhöht Retention
- Gute Ergänzung zu Wissensartikeln

**Datenbasis**

- Eigene Fragen + Antworten

**UI‑Ideen**

- Am Ende des Artikels
- „Quick Quiz“ + Ergebnisbadge

**Minimal‑Umsetzung**

- JSON im Frontmatter oder separate Quiz‑Datei
- Astro Komponente mit Client‑Interaktion

**Legal**

- Unkritisch, nur eigener Content

**Zielbild**

- Kurzer Wissens‑Check am Artikelende
- Ergebnisbadge („3/5 richtig“)

**Datenmodell (Vorschlag)**

- `question`, `options`, `correct`, `explanation`
- Optional: `difficulty` (easy/med/hard)

**Interaktion**

- Ein‑Frage‑pro‑Screen oder kompakt als Liste
- Erklärung nach Antwort

**MVP‑Scope**

- 3 Fragen pro Artikel, Multiple Choice
- Kein Nutzer‑Login, keine Speicherung

**Risiken/Abgrenzung**

- Nur eigene Fragen/Erklärungen, keine Fremdtexte

---

## 6) Lernkarten (Flashcards)

**Kurzbeschreibung**
Kleine Karten mit Begriff/Frage vorn, Erklärung hinten. Optional: „Ich wusste es/Ich wusste es nicht“.

**Warum spannend**

- Fördert aktives Lernen
- Ideal für Schüler/Studierende

**Datenbasis**

- Eigene Kurzdefinitionen

**UI‑Ideen**

- Flip‑Animation
- Decks nach Thema/Genre

**Legal**

- Unkritisch

**Zielbild**

- Decks am Artikelende oder als eigene Lern‑Seite
- „Karte umdrehen“ + Selbstbewertung

**Datenmodell (Vorschlag)**

- `front`, `back`, optional `hint`, `tags`

**Interaktion**

- Keyboard‑Support (Space = flip, ←/→ = nächste)
- Fortschritt innerhalb des Decks

**MVP‑Scope**

- 5–10 Karten pro Artikel
- Keine Speicherung (oder lokal „bekannt/unbekannt“)

---

## 7) „Entdecke‑Pfad“ (Guided Journey)

**Kurzbeschreibung**
Vordefinierte Pfade durch Inhalte (z. B. „Von Soul zu Disco“, „Reggae Wurzeln“).

**Warum spannend**

- Storytelling über mehrere Artikel
- Erhöht Session‑Länge

**Datenbasis**

- Eigene curated Pfade

**UI‑Ideen**

- Schrittweiser Fortschritt
- „Nächster Schritt“ am Ende des Artikels

**Legal**

- Unkritisch

**Zielbild**

- Kuratierte „Reise“ mit 3–6 Artikeln
- Klarer roter Faden, z. B. „Soul → Disco → House“

**Datenmodell (Vorschlag)**

- `pathId`, `title`, `steps` (Slug‑Liste), `summary`

**Interaktion**

- Fortschrittsanzeige pro Pfad
- „Nächster Schritt“ CTA am Artikelende

**MVP‑Scope**

- 2–3 Pfade, je 3–4 Artikel
- Fortschritt optional lokal speichern

---

## 8) Themen‑Cluster (Topic Hubs)

**Kurzbeschreibung**
Sammelseiten für Themen (z. B. „Women in Music“, „Studio Tech“, „Underground Scenes“).

**Warum spannend**

- Schnellere Orientierung
- SEO‑freundlich

**Datenbasis**

- Eigene Tags/Cluster

**Legal**

- Unkritisch

**Zielbild**

- Themen‑Hubs als Landingpages mit kuratierten Blöcken
- Automatische + manuelle Auswahl kombinieren

**Datenmodell (Vorschlag)**

- `topic`, `lead`, `tags`, `featuredArticles`

**Interaktion**

- Intro‑Abschnitt + Kurations‑Highlights
- „Mehr lesen“‑Listen nach Subthemen

**MVP‑Scope**

- 3 Hubs (z. B. „Women in Music“, „Studio Tech“, „Underground“)
- 5–8 Artikel pro Hub

---

## 9) „Heute in der Musikgeschichte“

**Kurzbeschreibung**
Täglicher Hinweis auf Ereignisse/Artikel aus derselben Zeit (z. B. „1977: …“). Basierend auf eigenen Inhalten.

**Warum spannend**

- Wiederkehr‑Anreiz
- Einfacher Hook

**Datenbasis**

- Eigene Artikel‑Jahresmetadaten

**Legal**

- Unkritisch

**Zielbild**

- Tooltip/Popover bei Begriffen im Artikel
- Mini‑Glossar‑Seite mit A‑Z Liste

**Datenmodell (Vorschlag)**

- `term`, `definition`, `related` (optional)

**Interaktion**

- Hover + Tastatur‑Focus
- „Mehr im Glossar“‑Link

**MVP‑Scope**

- 20–40 Begriffe
- Begriffe manuell im Text markieren

**Zielbild**

- Täglicher „Spotlight“‑Kasten auf der Start‑ oder Knowledge‑Seite
- Zeigt 1–3 relevante Artikel/Abschnitte, die zum heutigen Datum passen
- Optional: kleine „Zeitreise“‑UI (z. B. „Heute vor 40 Jahren“)

**Logik (einfach & robust)**

- Nutze nur eigene Artikel‑Metadaten
- Priorisiere Artikel mit `year`/`era` im Frontmatter
- Wenn kein exaktes Datum vorhanden: fallback auf Dekade oder Jahr

**Beispiel‑Regeln**

- Wenn Artikel `year` hat: „Heute im Jahr 1977…“
- Wenn nur `decade`: „Heute in den 1970ern…“
- Wenn nichts passt: zeige kuratierten „Random‑Pick“ aus derselben Epoche

**UI‑Ideen**

- „Heute in der Musikgeschichte“‑Box mit großem Jahr + CTA „Lesen“
- Kleine Timeline‑Miniatur im Hintergrund
- Optional: Button „Noch ein Jahr“

**MVP‑Scope**

- Ein Slot pro Tag (1 Artikel)
- Fallback auf Dekade oder zufälligen Artikel mit `era`
- Keine externen Daten, keine Nutzer‑Historie

**Technische Umsetzung**

- Build‑time: täglich generierter Pick (z. B. per Script) oder
- Runtime: Client‑Side Auswahl (nur aus lokalem Index)
- Einfacher Index: `slug`, `title`, `year`, `decade`, `summary`

**Optionales Frontmatter‑Feld**

- `year`: 1977
- `decade`: "1970s"
- `spotlight`: true (manuell priorisierbar)

**Risiken/Abgrenzung**

- Keine echten „Events“ ohne Quellen; lieber „Artikel‑Bezug“
- Wenn Ereignisse genannt werden: nur aus eigenem Inhalt

---

## 10) Glossar‑Hover

**Kurzbeschreibung**
Begriffe im Text mit kurzer Definition (Tooltip/Popover).

**Warum spannend**

- Senkt Einstiegshürde
- Mehr Verständlichkeit

**Datenbasis**

- Eigene Glossar‑Einträge

**Legal**

- Unkritisch

**Zielbild**

- „Mehr davon“‑Kasten: ähnliche Artikel basierend auf lokalen Signalen
- Keine Server‑Profile, keine Accounts

**Signale (lokal)**

- Gelesene Genres/Tags
- Lesezeit oder Scrolltiefe

**Logik**

- Gewichtung nach Tags + Epoche
- Fallback: „Beliebt“ oder kuratierte Picks

**MVP‑Scope**

- 1 Box mit 3 Artikeln
- Nur lokal im Browser berechnet

**Abgrenzung**

- Kein serverseitiges Tracking, keine Cross‑Site‑Profile

---

## 11) „Klang‑Stammbaum“ (Genre‑Tree)

**Kurzbeschreibung**
Baumstruktur, die zeigt, wie Subgenres aus Hauptgenres hervorgehen.

**Warum spannend**

- Pädagogisch klar
- Sehr visuell

**Datenbasis**

- Eigene Klassifikation

**Legal**

- Unkritisch

**Zielbild**

- Ein interaktiver „Stammbaum“ mit Hauptgenres als Wurzeläste und Subgenres als Verzweigungen
- Klick auf einen Knoten öffnet Kurzinfo + passende Artikel
- Fokus auf Orientierung statt „Richtig/Falsch“‑Historie

**Informationsstruktur (Vorschlag)**

- `genre`: eindeutiger Schlüssel
- `label`: Anzeigename
- `parent`: Eltern‑Genre (optional)
- `era`: grober Zeitraum (optional, z. B. 1960s/1970s)
- `regions`: optionale Herkunftsregionen (z. B. US, UK, Jamaica)
- `tags`: Themen (z. B. groove, electronic, protest)
- `articles`: Liste von Slugs (nur eigene Inhalte)

**Interaktion**

- Hover/Focus: Kurzbeschreibung + Zeitraum
- Klick: Seitenpanel mit Artikelliste und „Weiter lesen“
- Filter: Epoche, Region, Stimmung (blendet Äste aus/ein)
- Mini‑Legende: Farben für Epochen oder Regionen

**Visuelles Layout**

- Baum‑Layout (oben→unten) oder radialer Stammbaum
- Große Knoten für Hauptgenres, kleinere für Subgenres
- Verbindungslinien dünn, klare Kontraste für Lesbarkeit

**Technische Umsetzung (leichtgewichtig)**

- Statische JSON‑Daten + `d3-hierarchy` oder simples Layout per Canvas/SVG
- Astro‑Page mit Client‑Island für Interaktion
- Fallback: statisches SVG‑Bild + Liste (ohne JS)

**MVP‑Scope**

- 1–2 Dekaden (z. B. 1970s + 1980s)
- 8–15 Genres, max. 2 Ebenen Tiefe
- 1 Filter (Epoche) + Klick‑Panel

**Beispiel‑Schema (JSON)**

```json
[
  {
    "genre": "rock",
    "label": "Rock",
    "era": "1950s+",
    "regions": ["US", "UK"],
    "tags": ["guitar", "live", "youth"],
    "articles": ["1950s", "1960s"]
  },
  {
    "genre": "punk",
    "label": "Punk",
    "parent": "rock",
    "era": "1970s",
    "regions": ["UK", "US"],
    "tags": ["diy", "speed", "attitude"],
    "articles": ["1970s"]
  }
]
```

**Warum rechtssicher**

- Taxonomie und Beziehungen sind eigenes Datenmodell
- Keine Fremdtexte, keine Audioclips, keine Cover‑Art

**Risiken/Abgrenzung**

- Keine behaupteten „harten“ historischen Stammbäume, eher Orientierung
- Bei kontroversen Einordnungen: als „kuratierte Sicht“ kennzeichnen

---

## 12) Minimal‑Personalisierung (ohne Account)

**Kurzbeschreibung**
„Mehr davon“ basierend auf lokalen Lesehistorien (kein Server‑Tracking).

**Warum spannend**

- Relevanz ohne Datenschutz‑Komplexität

**Datenbasis**

- Nur localStorage

**Legal**

- Unkritisch

---

## 13) Konzertdaten per öffentliche API

**Kurzbeschreibung**
Live‑Events von öffentlichen Datenanbietern abrufen und kontextuell zu Genres/Artikeln anzeigen.

**Warum spannend**

- Aktuelle Relevanz und Wiederkehr‑Anreiz
- Starker Mehrwert für Genre‑ und Artist‑Seiten

**Reality‑Check**

- Viele APIs haben strenge Nutzungsbedingungen, Pflicht‑Attribution und Einschränkungen bei Speicherung/Weitergabe
- Teilweise nur nicht‑kommerzielle Nutzung oder nur via Partnerschaft

**Anbieter‑Optionen (Kurzüberblick)**

- Songkick API (Attribution + „Concerts by Songkick“, i. d. R. non‑commercial, Cache‑Limit)
- Ticketmaster Discovery API (breite Abdeckung, feste Rate‑Limits, Branding‑Vorgaben)
- Bandsintown API (typisch an Artist‑Accounts gebunden; andere Nutzung nur mit Partnerschaft)

**Zielbild**

- „Live in deiner Nähe“‑Box auf Genre‑/Artist‑Seiten
- Filter nach Stadt, Datum, Genre
- Klarer Hinweis auf Datenquelle + Link pro Event

**Technische Umsetzung**

- Server‑Side Proxy (API‑Key schützen, Cache/TTL strikt einhalten)
- Client‑Side nur gefilterte/gerenderte Daten anzeigen
- Fallback‑State bei leeren Ergebnissen

**MVP‑Scope**

- 1 Anbieter, 1 Region
- 1 Filter (Stadt) + Eventliste
- Keine Aggregation mehrerer Anbieter

**Risiken/Abgrenzung**

- ToS beachten (Attribution/Logo, Cache‑Regeln, keine Konkurrenz‑Nutzung)
- Datenschutz: Standort nur via explizite Eingabe, keine versteckte Geo‑Ortung

**Alternative (rechtlich einfacher)**

- Offizielle Widgets der Anbieter einbetten (weniger Kontrolle, aber klarer ToS‑Pfad)

---

## 14) Artikel‑Hörmodus (TTS‑freundlich)

**Kurzbeschreibung**
Ein sauberer „Listen“-Modus, der Inhalte lesefreundlich strukturiert und TTS‑Systemen gute Vorlagen gibt.

**Warum spannend**

- Barrierearm, angenehm für mobile Nutzung
- Kein externer Audio‑Content nötig

**Zielbild**

- Button „Hörmodus“ führt zu abgespeckter Ansicht
- Klare Abschnitte, kurze Absätze, Pausen‑Marker

**Technische Umsetzung**

- Re‑Layout via CSS + optionaler `aria`‑Hinweis
- Kein serverseitiges Audio, nur Text

**MVP‑Scope**

- 1 Toggle + neue Layout‑Variante

**Legal**

- Unkritisch (eigener Text)

---

## 15) Key‑Takeaways pro Artikel

**Kurzbeschreibung**
3–5 Kernaussagen als „Was du mitnimmst“-Box oben oder unten.

**Warum spannend**

- Besseres Verständnis
- Gut für schnelle Leser

**Zielbild**

- Takeaways‑Box mit Icons + kurzen Sätzen

**Datenmodell (Vorschlag)**

- `takeaways`: string[]

**MVP‑Scope**

- 3–5 Takeaways bei neuen Artikeln, später nachziehen

**Legal**

- Unkritisch

---

## 16) Vergleichs‑Tabs (Genre/Dekaden)

**Kurzbeschreibung**
Zwei Genres oder Jahrzehnte nebeneinander vergleichen.

**Warum spannend**

- Lern‑Effekt durch Kontraste
- Fördert längere Sessions

**Zielbild**

- Tabs oder Split‑View: „1970s vs 1980s“

**Datenmodell (Vorschlag)**

- `compareTags`: string[]

**MVP‑Scope**

- 1 Vergleichsvorlage (z. B. 1970s/1980s)

**Legal**

- Unkritisch (eigene Inhalte)

---

## 17) Studio‑Tech‑Module

**Kurzbeschreibung**
Kleine Infokarten zu Aufnahme‑Technik, Synths, Drum‑Machines, Produktions‑Trends.

**Warum spannend**

- Praxisnah, ergänzt historische Inhalte
- Wiederverwendbare Wissens‑Snippets

**Zielbild**

- Inline‑Module oder Sidebar‑Cards

**Datenmodell (Vorschlag)**

- `techModules`: { title, summary, era, relatedArticles }[]

**MVP‑Scope**

- 5–8 Module für 1970s/1980s

**Legal**

- Unkritisch (eigene Kurztexte)

---

## 18) „5‑Min‑Version“ (Kurzfassung)

**Kurzbeschreibung**
Eine kurze Zusammenfassung pro Artikel, optional per Toggle sichtbar.

**Warum spannend**

- Schnelle Orientierung
- Bessere Mobile‑Erfahrung

**Zielbild**

- „Kurz lesen“‑Button, der die Summary zeigt

**Datenmodell (Vorschlag)**

- `summaryShort`: string

**MVP‑Scope**

- Kurzfassung nur für Top‑Artikel

**Legal**

- Unkritisch

---

## 19) Szenen‑Index (People/Scenes)

**Kurzbeschreibung**
Kuratiertes Register für Szenen, Bewegungen und Schlüsselpersonen.

**Warum spannend**

- Stärkt Navigation über Artikel hinaus
- Gute SEO‑Struktur

**Zielbild**

- A‑Z oder thematische Cluster

**Datenmodell (Vorschlag)**

- `scene`, `lead`, `articles`

**MVP‑Scope**

- 3–5 Szenen mit 5–8 Artikeln

**Legal**

- Unkritisch (eigene Beschreibungen)

---

## 20) Einfluss‑Ketten

**Kurzbeschreibung**
„Influenced by / Influenced later“‑Box auf Artikelbasis.

**Warum spannend**

- Zeigt Entwicklungslinien, fördert Klickpfade

**Zielbild**

- Zwei Listen mit 2–4 Artikeln

**Datenmodell (Vorschlag)**

- `influencedBy`: string[], `influencedLater`: string[]

**MVP‑Scope**

- Kuratiert für 10–20 Artikel

**Legal**

- Unkritisch (eigene Struktur)

---

## 21) Path Builder (lokal)

**Kurzbeschreibung**
User erstellt seinen eigenen Lernpfad aus Artikeln, lokal gespeichert.

**Warum spannend**

- Personalisierung ohne Accounts
- Fördert Rückkehr

**Zielbild**

- „Zum Pfad hinzufügen“‑Button + Pfad‑Übersicht

**Datenmodell (localStorage)**

- Key: `mm_paths`, Value: { id, title, slugs[] }

**MVP‑Scope**

- 1 Pfad, 10 Artikel

**Legal**

- Unkritisch (lokal)

---

## 22) „Heute gelernt“‑Counter

**Kurzbeschreibung**
Kleine lokale Statistik: gelesene Artikel/Wörter pro Tag.

**Warum spannend**

- Motivation ohne Gamification‑Druck

**Zielbild**

- „Heute gelernt: 2 Artikel / 12 Min“

**Datenmodell (localStorage)**

- Key: `mm_daily_stats`, Value: { date, articlesRead, minutes }

**MVP‑Scope**

- Einfacher Zähler + Reset pro Tag

**Legal**

- Unkritisch (rein lokal)

---

## 23) UX‑Verbesserungen (schnelle Wins)

**Kurzbeschreibung**
Kleine, direkte Verbesserungen für Orientierung, Lesbarkeit und Wiederkehr.

**Warum spannend**

- Spürbarer Komfort‑Boost ohne großen Build‑Aufwand
- Keine zusätzlichen Rechts‑/Tracking‑Risiken

**Ideenliste (ausgearbeitet)**

### 23.1 Sticky Inhaltsverzeichnis im Artikel

**Zielbild**

- Inhaltsverzeichnis bleibt beim Scrollen sichtbar
- Aktiver Abschnitt wird hervorgehoben

**Interaktion**

- Klick springt zur Sektion
- Tastatur‑Focus sichtbar

**MVP‑Scope**

- Nur auf langen Artikeln (z. B. > 5 Überschriften)
- Pure CSS + minimal JS für „active“‑State

**Legal**

- Unkritisch

### 23.2 „Weiterlesen“-Anker (letzte Position lokal speichern)

**Zielbild**

- Button „Weiterlesen“ springt an letzte gelesene Stelle
- Dezenter Hinweis „Zuletzt gelesen: Abschnitt X“

**Datenmodell (localStorage)**

- Key: `mm_last_position`
- Value: `{ [slug]: { headingId, offset, updatedAt } }`

**MVP‑Scope**

- Speichere nur nach Scroll‑Pause (z. B. 2s)
- Max. 50 Einträge

**Legal**

- Unkritisch (lokal)

### 23.3 Serien‑Header: „Du liest Teil X von Y“

**Zielbild**

- Zeigt Serien‑Kontext (z. B. 1950s–2010s)
- „Nächster Teil“‑CTA

**Datenmodell (Vorschlag)**

- `seriesId`, `seriesOrder`, `seriesTotal`

**MVP‑Scope**

- Nur für Dekaden‑Artikel
- 1 simple Badge + CTA

**Legal**

- Unkritisch

### 23.4 Lesbarkeit‑Toggle (Schriftgröße, Zeilenbreite, Kontrast)

**Zielbild**

- Ein Toggle mit 2–3 Presets (Standard / Lesefokus / Groß)

**Interaktion**

- Einstellung bleibt lokal gespeichert

**Datenmodell (localStorage)**

- Key: `mm_reading_mode`
- Value: `"default" | "focus" | "large"`

**MVP‑Scope**

- 3 CSS‑Varianten via Root‑Class
- Kein Design‑Redesign nötig

**Legal**

- Unkritisch

### 23.5 „Ähnliche Artikel“‑Box (lokal nach Tags/Epoche)

**Zielbild**

- Box am Artikelende mit 3–5 Empfehlungen
- Klare Begründung: „Ähnliche Epoche/Tags“

**Logik**

- Score: gleiche `decade` + gleiche `tags`
- Fallback: kuratierte Liste

**MVP‑Scope**

- Nur lokale Berechnung aus Content‑Index
- Kein Tracking

**Legal**

- Unkritisch

### 23.6 Mini‑Glossar‑Tooltips im Text

**Zielbild**

- Markierte Begriffe zeigen kurze Definition
- „Mehr im Glossar“‑Link

**Datenmodell (Vorschlag)**

- `term`, `definition`, optional `related`

**MVP‑Scope**

- 20–40 Begriffe
- Manuell markierte Terms in Artikeln

**Legal**

- Unkritisch

### 23.7 „In 30 Sekunden“‑Box (Key‑Takeaways)

**Zielbild**

- 3–5 Bullet‑Points am Artikelanfang oder ‑ende

**Datenmodell (Vorschlag)**

- `takeaways`: string[]

**MVP‑Scope**

- Nur für Top‑Artikel zuerst

**Legal**

- Unkritisch

### 23.8 Schnelle Suche per `/` + Esc schließt

**Zielbild**

- `/` öffnet Suche, Esc schließt
- Focus liegt direkt im Suchfeld

**MVP‑Scope**

- Globaler Key‑Listener
- Deaktiviert, wenn Input/Textarea fokussiert

**Legal**

- Unkritisch

### 23.9 „Zuletzt gelesen“‑Kachel (localStorage)

**Zielbild**

- Kleine Kachel auf Knowledge‑Startseite
- Zeigt 1–3 zuletzt gelesene Artikel

**Datenmodell (localStorage)**

- Key: `mm_recent_reads`
- Value: `[{ slug, title, updatedAt }]`

**MVP‑Scope**

- Max. 3 Einträge, LRU‑Logik

**Legal**

- Unkritisch (lokal)

**MVP‑Scope**

- 3–4 Features aus der Liste
- Alle lokal, keine Accounts

**Legal**

- Unkritisch (rein lokal)

# Mögliche nächste Schritte

1. Welche 2–3 Features sollen wir zuerst priorisieren?
2. Soll ich ein kleines Datenmodell (Frontmatter‑Schema) für Timeline/Map vorschlagen?
3. Darf ich eine einfache Demo‑Komponente (Astro + JS) erstellen?
