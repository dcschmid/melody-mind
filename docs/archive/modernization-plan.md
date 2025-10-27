# MelodyMind Modernization & Build Optimization Plan

## Ziele

- Reduzieren wahrgenommenes Overengineering ohne Features zu verlieren.
- Annäherung an aktuelle Astro 5 Best Practices (statische Ausrichtung, Inseln zielgerichtet).
- Senken des Build-Speicherbedarfs, damit Render.com Deployments stabil <8 GB bleiben.
- Bewahren bestehender Daten- und i18n-Abdeckung.

## Leitplanken & Annahmen

- Keine neuen Abhängigkeiten ohne gesonderte Bewertung (<5 kB Bundle-Impact).
- Test-Suite bleibt eingefroren; wir planen aber Validierungsschritte über vorhandene Builds/Lints.
- Änderungen erfolgen inkrementell, damit Deployments jederzeit möglich bleiben.

## Phase 0 – Analyse & Baselines

- [x] **Build-Profiling**: `yarn build:astro --verbose` lokal laufen lassen, Peak-Speicher (RSS) und
      Dauer protokollieren.
- [ ] **Render-Metriken sammeln**: Logs vom Provider sichern (Welche Phase sprengt 8 GB? Sharp,
      Astro, Skripte?).
- [x] **Architektur-Inventory**: Mapping der wichtigsten Routen, Datenquellen, Services (RSS,
      Podcasts, Kategorien) erstellen.
- [x] **Hydration-Audit**: Liste aller interaktiven Komponenten + Inselmodus anfertigen (Client
      directives, Skriptgrößen).

### Phase 0 – Status 2025-10-06

- **Build-Profiling (lokal)**: `yarn build:astro --verbose` (Walltime ~1:14 min, User 96 s).
  `/usr/bin/time -v` meldet `Maximum resident set size: 10681344 kB` (~10,2 GB) → überschreitet
  Render-Limit knapp. Node warnt weiterhin: "Failed to load config … Unexpected identifier 'assert'"
  beim Import-Assertion in `astro.config.mjs`; Ursache (Node-Version vs. ESM-Lader) klären.
- **Build-Profiling (Render.com)**: Build-Log (`yarn build:production`) zeigt Node 22.12.0, erneute
  Installation von `sharp` bei jedem Deploy (kein Cache) und lange Content-Sync-Phase:
  `content sync` ≈280 s. Speicherwerte fehlen; Render bricht trotz RAM-Limit nicht ab →
  Monitoring/Logs mit Memory-Anzeige aktivieren. Debug-Route entfernt
  (`src/pages/[lang]/debug/image-index.json.ts`) → Warnung entfällt. Prüfen, ob Node 22.12 fehlende
  Import-Assertion-Unterstützung verursacht (lokal 22.19 meldet denselben Fehler) → ggf.
  `astro.config` anpassen oder Node-Version pinnen.
- **Build-Profiling (Render.com)**: Build-Log (`yarn build:production`) zeigt Node 22.12.0, erneute
  Installation von `sharp` bei jedem Deploy (kein Cache) und lange Content-Sync-Phase:
  `content sync` ≈280 s. Speicherwerte fehlen; Render bricht trotz RAM-Limit nicht ab →
  Monitoring/Logs mit Memory-Anzeige aktivieren. Debug-Route entfernt
  (`src/pages/[lang]/debug/image-index.json.ts`) → Warnung entfällt. Node-Version inzwischen auf
  22.12.0 gepinnt (`.node-version`, `package.json engines`); Import-Assertion-Warnung bei nächstem
  Build beobachten.
- **Architektur-Inventory**: Umfangreicher Locale-Fächer (14 Sprachen) erzeugt pro Route 14
  statische Derivate. Zusätzliche Einzel-Routen-Ordner (`src/pages/de`, `src/pages/en`) für
  Impressum/Legal. Wichtige Generatoren: Podcasts (`src/data/podcasts`), RSS
  (`src/services/rssService.ts`, `src/services/podcastRssService.ts`), Knowledge
  (`src/pages/[lang]/knowledge`). Content Collections (~220 MB gesamt) spiegeln Knowledge pro Locale
  (`src/content/knowledge-xx`, 15–23 MB je Sprache) → hoher `content sync` Aufwand.
- **Hydration-Audit**: Keine `client:*` Direktiven gefunden. Interaktivität erfolgt über 15+
  Inline-Skripte (`Navigation.astro`, Overlays, Spieleinstiege). Kandidaten für
  Vereinheitlichung/Modularisierung, um JS-Footprint zu reduzieren.
- **Offene Punkte**: Provider-Logs weiterhin ausstehend; ohne Peak-Werte bleibt Speicher-Analyse
  unvollständig.

## Phase 1 – Vereinfachung Code-Struktur

- [ ] **i18n-Seiten konsolidieren**: Prüfen, wo `src/pages/[lang]/...` duplizierte Templates enthält
      → Umstieg auf gemeinsame Komponenten + `getStaticPaths` je Locale.
- [ ] **Utility-Helfer sichten**: Kandidaten für Entfernung/Inline markieren (z. B. einmalig
      verwendete DOM-Helper, Debug-Utilities).
- [ ] **Overlay-/Modal-Fluss**: Überprüfen, ob separate Overlays (Share, End) zu einem generischen
      Shell komponiert werden können, ohne Verhalten zu brechen.
- [ ] **Bilder-Pipeline**: Scripts vergleichen (`optimize-*`, `migrate-*`) → Priorisieren, welche
      vereint oder entfernt werden können.
- [x] **Debug/Health Routes prüfen**: Debug-Endpoint `src/pages/[lang]/debug/image-index.json.ts`
      entfernt (Test-Route). Weitere Diagnose-Pfade dokumentieren, falls benötigt.

### Phase 1 – Fokus 2025-10-06

- **Template-Duplizierung**: `src/pages/[lang]/gamehome.astro`, `playlists.astro`, `podcasts.astro`,
  `news.astro`, `time-pressure-[category].astro`, `game-[category]/[difficulty].astro`,
  `chronology-[category]/[difficulty].astro` unterscheiden sich primär in Datenquellen, nicht im
  Layout → Kandidat für generische Layout-Komponenten + pro-Route Service-Layer.
- **Locale-spezifische Seiten**: Rechts-/Privacy-Seiten (`src/pages/en/*.astro`,
  `src/pages/de/*.astro`) teilen sich Struktur. Evtl. Content Collection + Markdown, um Wartung zu
  vereinfachen.
- **Inline-Skripte bündeln**: Navigation-Overlay (`Navigation.astro`) und Overlays
  (`ShareOverlay.astro`, `EndOverlay.astro`, `ChronologyFeedbackOverlay.astro`,
  `FeedbackOverlay.astro`) enthalten doppelten Fokus-/ARIA-/Animation-Code. Shared Overlay
  Controller + Utility (`useMenuToggle`, `trapFocus`) evaluieren.
- **Utility-Inventur**: Einmalige Utilities (`src/utils/dom/forceReflow.ts`, `getEndOverlayRoot.ts`,
  `src/utils/debug.ts`) katalogisieren → entweder dokumentierter Bedarf oder Entfernen/Inline.
- **Image-Script-Sprawl**: Acht verwandte Skripte (`optimize-*.cjs`, `migrate-*.cjs`,
  `consolidate-image-slugs.cjs`) überschneiden sich funktional. Mapping erstellen, welche aktuell
  aktiv genutzt werden, um redundante Pfade zu streichen.

## Phase 2 – Astro-Best-Practice Alignment

- [ ] **Astro Content Collections** evaluieren, um JSON/TS-Daten zu zentralisieren (Fragen,
      Kategorien, Podcasts), inkl. Type-Safety.
- [ ] **Server-Output prüfen**: Evaluieren, ob Wechsel auf `output: "static"` + Edge Adapters
      möglich ist oder ob bestimmte APIs Server-Output erzwingen.
- [ ] **Prefetch-Konfiguration**: Gegen neue Astro `prefetch` Policies halten (ggf. auto/viewport
      statt hover, aber mit Messung).
- [ ] **Tailwind 4 Nutzung**: Sicherstellen, dass `@tailwindcss/vite` korrekt konfiguriert ist und
      ungenutzte Utilities gestrichen werden können.
- [ ] **Markdown Pipeline**: Prüfen, ob `remarkCodeHighlighter`/`shikiSingleton` noch benötigt
      werden, nachdem Prism aktiv ist.

## Phase 3 – Build- & Runtime-Optimierung

- [ ] **Sharp-Handling**: Build-Skript `yarn install:sharp` evaluieren → Alternative:
      optionalDependencies + vorinstallierte Binärpakete, um Kompilationskosten zu sparen.
- [ ] **Parallelisierung prüfen**: Astro Build mit `process.env.ASTRO_JOBS` (oder Vite
      `build.rollupOptions`) justieren, um Memory-Spitzen zu glätten.
- [ ] **Bild-Generierung entkoppeln**: OG-/Image-Optimierungen auf separaten Prebuild (Render Cron)
      verlagern, statt im Haupt-Build.
- [ ] **Cache-Strategie**: Render Persistenz (z. B. `render.yaml buildCache`) nutzen, um wiederholte
      Datensynchronisation/Downloads zu sparen.
- [ ] **Bundle-Analyse**: `astro build --verbose --trace` + `npx astro analyze` (falls verfügbar)
      einsetzen, um große Inseln zu identifizieren.
- [ ] **Node-Version & Import-Assertions**: Node-Version pinnen (z. B. 22.12 vs. 22.19) oder
      `astro.config` ohne JSON-Assertion laden, um Warnung/Retry zu vermeiden.
- [ ] **Sharp-Installation optimieren**: Auf optionalDependencies/`yarn globalDir` oder
      Render-Build-Skripte umstellen, damit `yarn add sharp` nicht jedes Deploy triggert.

Siehe ergänzendes Dokument `docs/render-deployment-improvements.md` für konkrete Umsetzungsschritte
(Memory-Logging, Cache-Persistenz, Node-/Sharp-Pinning).

### Phase 3 – Fokus 2025-10-06

- **Speicherlogging Render**: `render.yaml` angelegt; Build-Befehl setzt nun
  `/usr/bin/time -v yarn build:production` und `NODE_OPTIONS="--max-old-space-size=8192"`. Nächste
  Deploy-Logs auf Peak-RAM prüfen.
- **Cache-Persistenz**: Render-Build-Cache in `render.yaml` aktiviert (`cacheDirs`: `.yarn/cache`,
  `node_modules`, `.astro`). Nach Deployment verifizieren, ob Cache genutzt wird.
- **Node-/Sharp-Pinning**: Node-Version via `.node-version` und `package.json engines` auf 22.12.0
  fixiert. Sharp-Optimierung noch offen (siehe Render-Deployment-Dokument).

## Phase 4 – Qualitätssicherung & Dokumentation

- [ ] **Lint/Format Gate**: Nach größeren Refactors automatisch `yarn lint:check` +
      `yarn format:check` einplanen.
- [ ] **Build Smoke Tests**: `yarn build:production` in CI/Sandbox, Speichern Peak-Memory.
- [ ] **Docs aktualisieren**: README/AGENTS ergänzen (neue Build-Vorgehensweise, vereinfachte
      Struktur).
- [ ] **Changelog pflegen**: Größere Umbauten als "refactor"/"perf" Einträge festhalten.

## Offene Fragen

- Welche Features hängen zwingend an Server-Output (z. B. dynamische RSS-Feeds)?
- Gibt es Render-spezifische Limits (CPU/Swap), die zusätzlich adressiert werden müssen?
- Sind alle 13 lokalen JSON-Locales wirklich gleich gepflegt oder können sekundäre Sprachen aus
  generiertem Schema abgeleitet werden?

## Nächste Schritte

1. Phase-0-Aufgaben priorisieren und Verantwortlichkeiten klären.
2. Ergebnisse zusammenführen → Entscheidung, welche Phase-1 Pakete zuerst angegangen werden.
3. Fortschritt und Entscheidungen in diesem Dokument pflegen.
