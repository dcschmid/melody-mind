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

## Phase 2 – Überengineering abbauen

- [x] **State-Management entflechten**: In Inseln prüfen, ob lokaler State/Effekte wirklich nötig
      sind oder durch reine Props/SSR ersetzbar.

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

#### Update (2025-10-08)

- Redundante Navigation-Initialisierung entfernt: Inline `<script>` in `Navigation.astro` gelöscht;
  Initialisierung läuft nun ausschließlich zentral über `initInteractiveComponents()` in
  `Layout.astro` (Pfadalias-Fix `@utils/components/autoInit`). Verhindert doppelte Listener und race
  conditions bei `aria-expanded`.

#### Komponenten-Hotlist (weitere Vereinfachung anstreben)

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

- **Game-Engines & Loader**
  - [ ] Loader zentralisieren: TimePressure- und Chronology-Engines auf `loadCategoryBySlug` /
        `loadCategoriesForLanguage` umstellen und doppelte Fetch-Fallbacks entfernen.
  - [ ] Lifecycle ergänzen: `destroy()`-Pfad für globale Listener (`keydown`, `visibilitychange`,
        Button-Handler) etablieren und Auto-Init entsprechend erweitern.
  - [ ] UI-Strings (Pause/Fortsetzen/Fehler) in die i18n-JSONs verschieben und über
        `useTranslations` einspielen.
- **Sprache & Fallback**
  - [ ] News-Seite vor `getNewsForLanguage` konsequent `normalizeLanguage` +
        `ensureSupportedLanguage` anwenden und Canonical/Breadcrumbs daran ausrichten.
  - [ ] Restliche Pfade auf harte `"en"`-Fallbacks prüfen und durch Konstanten + Normalisierung
        ersetzen.
- **Kontakt & Rechtliches**
  - [ ] `ContactCard`: Dedicated Label-Keys in den Übersetzungen hinterlegen und die Kontakt-E-Mail
        in `src/constants/contact.ts` zentralisieren.
- **Styles & Helpers**
  - [ ] `ContactCard`-Styles in ein Modul unter `src/styles/components/` auslagern und vorhandene
        CSS-Tokens nutzen.
  - [ ] CSS/Utility-Klassen straffen; doppelte Farb- und Spacing-Definitionen auf bestehende Tokens
        mappen.
  - [ ] Gemeinsame Helfer nur ab 3+ Vorkommen extrahieren (Formatierer, Score-Berechnungen,
        Data-Mapping) und pro Ordner dokumentieren.

### Phase 3 – Fortschritt (2025-10-07)

- `LanguagePicker.astro` nutzt jetzt `SUPPORTED_LANGUAGES` + Flag-Mapping; Path-Cleanup filtert
  dynamisch per Set statt hartcodierter Arrays.
- `Footer.astro` und `Game/Joker.astro` normalisieren Sprachen über `ensureSupportedLanguage`;
  Default-Fallbacks greifen zentral via `FALLBACK_LANGUAGE`.
- Kategorie-Seite (`src/pages/[lang]/[category].astro`) und Podcast-RSS (`rss.xml.ts`) eliminieren
  direkte `"en"`-Strings zugunsten der Konstanten.

## Phase 4 – Performance-Fokus

- **Build & Assets**
  - [ ] Schwere Komponenten lazy-loaden oder auf reine SSR-Ausgabe prüfen; Astro-Templates
        priorisieren.
  - [ ] JSON-Daten verschlanken (Fragen, Kategorien) und ableitbare Werte zur Build-Zeit generieren.
  - [ ] Medien-Assets in `public/` auditieren; WebP/JPG-Duplikate bereinigen und Dateien
        komprimieren.
- **Runtime & Services**
  - [ ] Laufende Services auf Caching/Precomputing trimmen, damit Build-Zeit vs. Laufzeit balanciert
        bleibt.
  - [ ] Kategorie-Fallback-Fetches per `AbortController` abbrechen, sobald Nutzer:innen die Seite
        verlassen.
  - [ ] `mapItemsWithDisplayData` Ergebnisse pro SSR-Request cachen, um mehrfaches Parsing zu
        vermeiden.
- **Interaktion & A11y**
  - [ ] Countdown der TimePressure-Engine auf eine rAF-gesteuerte Schleife konsolidieren und
        Timer-Typen korrekt annotieren.
  - [ ] Countdown-/Overlay-Animationen an `prefers-reduced-motion` anpassen (z. B.
        Puls-/Urgency-Effekte reduzieren).

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
