# MelodyMind Vereinfachungs- und Performance-Plan

Dieser Plan bündelt die Schritte, mit denen wir Überengineering abbauen, echte DRY-Potenziale heben
und die Performance verbessern. Er ist als lebendes Dokument gedacht – Häkchen setzen, ergänzen,
verlinken.

## Leitplanken

- Nutzer:innen-Erlebnis hat Priorität: jede Vereinfachung und Optimierung muss barrierefrei,
  deterministisch und wartbar bleiben.
- Orientierung an `AGENTS.md`, `.github/copilot-instructions.md` sowie den vorhandenen
  Konstanten/Utils – keine parallelen Wahrheiten.
- Keine neuen Tests in dieser Phase (Test-Freeze beachten), aber „Testbarkeit mitdenken“.

## Arbeitsmodus

1. **Baseline schaffen** – Codeinventar sichten, Metriken notieren (Bundle-Größe, Build-Zeit).
2. **Hotspots priorisieren** – Welche Komponenten/Utils fallen als komplex, redundant, langsam auf?
3. **Gezielt vereinfachen** – Kleine, in sich abgeschlossene Schritte; erst konsolidieren, dann ggf.
   abstrahieren.
4. **Stetig messen** – Nach jedem Block Build- und Performance-Auswirkungen prüfen.

---

## Phase 0 – Vorbereitungen

- [ ] Projektziele & Grenzen aus `AGENTS.md` / `README.md` abgleichen.
- [ ] Letzten größeren Changeset (CHANGELOG / Git-Historie) querlesen, um aktuelle Pain-Points zu
      verstehen.
- [ ] Klären, welche Metriken wir tracken (Bundle-Größe, LCP, Datenmenge je Kategorie).

## Phase 1 – Bestand erfassen & Quick Wins

- [x] **Komponenten-Inventur** (`src/components`, `src/layouts`): identifiziere Inseln mit viel
      Client-Hydration oder mehrfach verwendeten Hooks/Logikblöcken.
- [x] **Utils- & Service-Scan** (`src/utils`, `src/services`, `src/lib`): markieren, wo ähnliche
      Transformations- oder Load-Funktionen parallel existieren.
- [x] **Konstanten prüfen** (`src/constants`, `src/types`): harte Strings/Zahlen sammeln, die
      bereits zentral definiert sind (z. B. Sprache, Scoring). Ziel: später konsolidieren.
- [x] **Build & Bundle messen**: `yarn build` + vorhandene Build-Logs sichten, welche Seiten/Chunks
      auffällig groß sind. _(Node via `nvm use 22.19.0` geladen – Build läuft durch.)_
- [x] **Hydration-Hotspots lokalisieren**: Astro-Inseln mit hoher JS-Last markieren (Browser-Tab
      Inspect; `dist/` analysieren).

### Phase 1 – Beobachtungen (2025-10-07)

- Navigation & Layout: `src/components/Header/Navigation.astro` enthält einen umfangreichen
  Inline-Script-Block, der nahezu identisch zu `@utils/components/navigationUtils.ts` ist; doppelte
  Wartung + unnötige JS-Last.
- Inline-Inits: Mehrere Komponenten (`TableOfContents.astro`, `MusicButtons.astro`,
  `LanguagePicker.astro`, `PlaylistCard.astro`, `CategoryFilter.astro`, Overlay-Komponenten) binden
  `document.addEventListener("DOMContentLoaded")` nur um `initDefault…`-Hilfen aufzurufen. Hier
  bietet sich eine zentralisierte Auto-Initialisierung oder SSR-Lösung an.
- Over-Abstracted Utils: `src/utils/components` und `src/utils/dom/domUtils.ts` nutzen zahlreiche
  Klassen/Wrapper für einfache DOM-Operationen. Viele `safe*`-Helfer verdoppeln native Aufrufe ohne
  klaren Mehrwert.
- Sprachkonstanten: Komponenten wie `LanguagePicker.astro`, `Footer.astro`, `Game/Joker.astro`
  führen eigene Sprachlisten (`["de","en",…]`) bzw. Hartcodierungen (`"en"`) statt
  `SUPPORTED_LANGUAGES` / `FALLBACK_LANGUAGE` zu verwenden.
- i18n-Duplizierung: Sowohl `src/utils/i18n.ts` (einfach) als auch `src/lib/i18n-utils.ts` (stark
  abstrahiert) liefern ähnliche Funktionalität mit unterschiedlichen APIs. Bedarf für Konsolidierung
  klären, bevor weitere Features darauf aufbauen.
- Build-Metriken: `yarn build` (Node 22.19.0) erzeugt größtes Client-Bundle
  `endGameUtils.BY3Q-z8S.js` mit 481 kB (gzip 139 kB); weitere Kandidaten `timePressureGameEngine`
  (~18 kB / gzip 5.5 kB) und Sprach-/Seiten-Inseln >10 kB. Fokus auf Reduktion der Endgame-Logik &
  Game-Engine-Skripte prüfen.

## Phase 2 – Überengineering abbauen

- [x] **Komponenten vereinfachen**: Übertrieben generische Komponenten identifizieren (viele Props,
      unused Variationen) und auf reale Use-Cases zurückschneiden.
- [x] **Services verschlanken**: Pfade mit mehrfachen Konfigurationsobjekten oder doppelten
      Fallback-Logiken prüfen (z. B. rund um Kategorien, RSS, Achievements).
- [ ] **State-Management entflechten**: In Inseln prüfen, ob lokaler State/Effekte wirklich nötig
      sind oder durch reine Props/SSR ersetzbar.
- [x] **Datenfluss dokumentieren**: Für komplexe Pipelines (Fragen laden, Scoring) kurze
      Architektur-Notizen erstellen, um weitere Vereinfachungen gezielt zu planen.

### Phase 2 – Fortschritt (2025-10-07)

- Inline-Skripte in Navigations- und UI-Komponenten entfernt; zentrale Lazy-Initialisierung via
  `src/utils/components/autoInit.ts` eingeführt (dynamic imports + `requestIdleCallback`).
- `Layout.astro` startet die Auto-Initialisierung einmalig nach DOM ready; dadurch weniger
  redundante `DOMContentLoaded`-Listener in `Navigation.astro`, `LanguagePicker.astro`,
  `TableOfContents.astro`, `CategoryFilter.astro`, `PlaylistCard.astro`, `BackToTop.astro`,
  `LoadingSpinner.astro`, `Game/Joker.astro` und `FeedbackOverlay.astro`.
- Komponenten bleiben SSR-first: Initializer laden nur, wenn Selektoren vorhanden sind;
  Feedback-Overlay weiterhin auf Quiz-Routen beschränkt
  (`window.location.pathname.includes("game-")` Guard).
- `StructuredItemList.astro` entfernt; Playlists nutzen nun eine schlanke, seitenlokale
  ItemList-Schleife (Microdata + Filter-Attribute direkt in `playlists.astro`), wodurch
  Props-Overhead und generische Render-Pfade entfallen.
- `HeroSection.astro` entrümpelt (nur noch benötigte Props:
  title/subtitle/headingLevel/id/spacing/icon); dekorative/Align/Gradient-Overrides entfallen
  zugunsten klarer Defaults.
- `SearchPanel.astro` reduziert auf Kern-Props (`idBase`, Label/Placeholder, `ariaControls`,
  optionale Status-Templates); Größen-/Auto-Toggle-Varianten und überschüssige Stile entfernt,
  Reset/SR-Status standardisiert.
- `PlaylistCard.astro` von Microdata/Date-Generierung und `microdataDisable`-Pfad befreit;
  Komponente dient jetzt ausschließlich als Präsentationskarte, Microdata bleibt seitenlokal in
  `playlists.astro`.
- `LoadingSpinner.astro` auf reinen indeterminierten Spinner mit optionalem Label reduziert;
  determinate-/State-/Context-Varianten entfernt.
- `EndOverlay.astro` stellt Steuerung & `window.showEndOverlay` nun direkt bereit; umfangreiche
  Utility-Dateien (`endOverlay.ts`, Auto-Init-Hook) entfernt.
- `FeedbackOverlay.astro` verkabelt Schließen/Keyboard-Handling direkt im Component-Script;
  `feedbackOverlayUtils.ts` entfernt und Auto-Init-Eintrag gestrichen.

**Komponenten-Hotlist (weitere Vereinfachung anstreben)**

- `FeedbackOverlay.astro`: (weiter beobachten) – aktueller Inline-Handler deckt Close/Focus ab.
- `ChronologyFeedbackOverlay.astro` auf eigenes Script umgestellt (Utils entfernt); bei
  Folgearbeiten EndOverlay weiter modularisieren.
- `MusicButtons.astro` erledigt (Tracking lokal, Util entfernt) – Folgearbeiten: ggf. zentrales
  Analytics-Helper konsolidieren.
- `ShareOverlay.astro` ausgelagert: Logik in `shareOverlayScript.ts`, Component liefert nur Markup +
  schlanken Init.

#### Datenfluss-Notizen (2025-10-07)

- **Fragen/Category-Pipeline**
  - Inhaltliche Quellen liegen als statische JSON-Dateien unter `src/json/*_categories.json`;
    `src/utils/category/categoriesIndex.ts` lädt sie lazy per `import.meta.glob`, normalisiert Pfade
    und cached pro Sprache.
  - `getCategories(lang)` → `categoryLoader.ts` stellt bei leerem Ergebnis automatisch auf
    `FALLBACK_LANGUAGE` um; Spiel-spezifische Loader wie `albumLoader.ts` arbeiten nach dem gleichen
    Muster (`normalizeLanguage` → primär → Fallback).
  - Die Game-Engines (`gameEngine.ts`, `timePressureGameEngine.ts`) ziehen daraus
    Album/Fragen-Strukturen und wählen via `getRandomQuestion` bzw. `getTimePressureQuestion` eine
    Frage; beide Tracker bewahren state (`usedQuestions`, Difficulty-Verteilung) und bieten
    Reset-APIs.
  - Anzeige/Interaktion läuft konsistent über `loadQuestionUtils.ts` (DOM-Setup & A11y),
    `handleAnswer.ts`/`handleAnswerUtils.ts` (Antwort- und Feedback-Handling) sowie Joker-Steuerung
    in `jokerManager.ts`.
- **Scoring & Achievements**
  - Kernformeln liegen zentral in `src/constants/game.ts` (`computeQuestionScore`, `SPEED_BONUS_*`,
    `MAX_*`); alle Engines nutzen denselben Satz Konstanten.
  - `gameStateUtils.ts` bündelt Score/Runden-Updates (`updateGameScore`, `updateGameRound`) inkl.
    DOM-Sync & Screenreader-Ansagen; `scoreUtils.ts` kümmert sich um Bonus-Animationen.
  - Laufzeitpunkte kommen aus `handleAnswerUtils.ts` (korrekt/Bonusberechnung) bzw.
    `timePressureGameEngine.ts` (Zeitlimit, Strafpunkte) und münden in den zentralen Score-State.
  - `achievements.ts` übersetzt finale Scores in Tier-IDs; `gameUI.ts` + Overlays
    (`EndOverlay.astro` / `shareOverlayScript.ts`) konsumieren das Ergebnis für Ergebnis-Popups,
    Sharing und Achievement-Text.
- **English summary**: see `docs/data-flow-notes.md` for an English deep dive covering the same
  pipelines plus future refactor notes.

## Phase 3 – DRY-Potenziale heben

- [ ] **Kategorie-/Fragen-Loader konsolidieren**: Prüfen, ob `src/utils/category/*` und
      `src/utils/game/*` ähnliche Strukturen doppelt pflegen.
- [ ] **Sprache & Fallback**: Sicherstellen, dass alle Sprachpfade `normalizeLanguage` +
      `ensureSupportedLanguage` nutzen; harte `"en"`-Fallbacks entfernen.
- [ ] **Styles straffen**: CSS/Utility-Klassen vergleichen; doppelte Farb- oder Spacing-Definitionen
      sammeln und auf bestehende Tokens mappen.
- [ ] **Common Helpers extrahieren**: Erst ab 3+ Vorkommen abstrahieren (z. B. Formatierer,
      Score-Berechnungen, Data-Mapping). Dokumentation im gleichen Ordner.

### Phase 3 – Fortschritt (2025-10-07)

- `LanguagePicker.astro` nutzt jetzt `SUPPORTED_LANGUAGES` + Flag-Mapping; Path-Cleanup filtert
  dynamisch per Set statt hartcodierter Arrays.
- `Footer.astro` und `Game/Joker.astro` normalisieren Sprachen über `ensureSupportedLanguage`;
  Default-Fallbacks greifen zentral via `FALLBACK_LANGUAGE`.
- Kategorie-Seite (`src/pages/[lang]/[category].astro`) und Podcast-RSS (`rss.xml.ts`) eliminieren
  direkte `"en"`-Strings zugunsten der Konstanten.

## Phase 4 – Performance-Fokus

- [ ] **Build-Optimierungen**: Schwere Komponenten lazy-loaden oder als reine SSR-Ausgabe belassen;
      überprüfen, ob Astro-Templates statt Client-Inseln reichen.
- [ ] **Daten-Reduktion**: JSON-Daten prüfen (Fragen, Kategorien) – sind alle Felder nötig?
      Optional: Ableitbare Werte (z. B. Slugs) zur Build-Zeit generieren.
- [ ] **Assets auditieren**: Medien in `public/` auf WebP/JPG-Duplikate prüfen; große Dateien
      komprimieren oder nur bei Bedarf laden.
- [ ] **Runtime-Services**: Falls Fetch/Parsing stattfindet, Caching/Precomputing anstreben, um
      Build-Zeit vs. Laufzeit optimal zu balancieren.

### Phase 4 – Fortschritt (2025-10-07)

- `endGameUtils.ts` (~476 kB) wird jetzt über `endGameLoader.ts` nur bei Bedarf geladen; die
  interaktiven Spiel-Seiten müssen initial nur noch ~12 kB JS ziehen. Der große Overlay-/i18n-Chunk
  bleibt separiert und wird erst beim Spielende nachgeladen.
- `gameEngine.ts` & `chronologyGameEngine.ts` nutzen das neue Lazy-Gateway; Restart-Button &
  End-of-Game-Flow triggern dynamische Imports statt statischer Dependencies.
- `yarn build:astro --verbose` (Node 22.19.0 via `nvm use 22.19.0`) bestätigt kleinere
  Primär-Bundles; die Render-Instanz sollte dadurch weniger Peak-RAM benötigen.

## Phase 5 – Validierung & Nachbereitung

- [ ] `yarn lint:check` & `yarn build` nach jedem größeren Block.
- [ ] Build-Ausgabe vergleichen (Bundle-Größe, dist-Analyse) und Erfolge/Folgethemen dokumentieren.
- [ ] Roadmap aktualisieren: Offene Punkte + Erkenntnisse aus Lessons Learned ergänzen, damit
      Folgearbeiten klar bleiben.

---

## Offene Fragen / Klärungen

- Welche Seiten oder Features gelten als kritisch für erste Performance-Gewinne? (z. B. Startseite,
  Leaderboard)
- Gibt es Stakeholder-Präferenzen für bestimmte Refactorings (z. B. Kategorien vs. Frage-Logik)?
- Sollten wir parallel Dokumentation (README / AGENTS.md) aktualisieren, wenn neue Vereinfachungen
  greifen?

> Ergänzungen willkommen – bitte direkt als Pull Requests oder Kommentare in diesem Dokument
> festhalten.
