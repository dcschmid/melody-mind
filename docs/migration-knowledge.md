## Migration: Knowledge-Bereich auslagern (Monolith → eigenes Repo/Subdomain)

Ziel: Den gesamten "Knowledge"-Bereich aus dem `melody-mind`-Monolithen in ein eigenes
Git-Repository auslagern und auf einer Subdomain wie `knowledge.example.com` betreiben. Diese
Anleitung ist so strukturiert, dass ein anderer Agent oder Entwickler die Migration automatisiert
durchführen kann.

---

### 1) Kurzüberblick

- Warum: bessere Unabhängigkeit, schnellere Deploys, getrennte Release-Zyklen für
  Content/Knowledge-Inhalte.
- Ergebnis: neues Repo `melody-mind-knowledge` (oder gewählter Name) mit:
  - allen Knowledge-Inhalten (lokalisierte Markdown-Dateien)
  - assets/OG-Bildern, homecategory-Bildern
  - minimalen Komponenten/Utilities für Knowledge
  - CI / Deploy für Subdomain

---

### 2) Inventar (wichtige Fundstellen)

Funde im Monorepo (Auszug, vollständiges Inventar wurde bereits erzeugt):

- Content: `src/content/knowledge-*/` (z.B. `src/content/knowledge-pt/`)
- Assets: `src/assets/homecategories/knowledge/*`, `public/homecategories/knowledge.png`
- OG Bilder: `public/og-images/social-share-knowledge*.jpg`
- JSON links: `src/json/*_categories.json` referenzieren `"/en/knowledge/<slug>"`
- Utils: `src/utils/components/knowledgeSearchUtils.ts`
- Scripts: `scripts/migrate-knowledge-image-slugs.*`, `scripts/sync-knowledge-playlists.js`,
  `scripts/generate-og-images.cjs`

Hinweis: Inventar enthält Content in mehreren Sprachen. Slugs + Dateinamen müssen unverändert
bleiben, um SEO- und Social-Links zu erhalten.

---

### 3) Scope / Abgrenzung (was migriert wird)

Empfohlener Minimalumfang für das neue Repo:

- Alle Knowledge-Inhalte (`src/content/knowledge-*`)
- Knowledge-spezifische Assets (Bilder, OG-Images)
- Knowledge-spezifische Scripts (OG-Image-Generator wenn nur für Knowledge benutzt)
- Kleine domain-spezifische Utils (z.B. `knowledgeSearchUtils.ts`)
- Minimaler Satz an Seiten/Routes: `src/pages/[lang]/knowledge/[slug].astro` (dynamische Route mit
  `getStaticPaths()` — siehe AGENTS.md)

Was in Main-Repo bleiben sollte oder als Shared-Paket behandelt werden kann:

- Allgemeine UI-Komponenten (Header, Footer), außer wenn du die Knowledge-Seite komplett
  eigenständig gestalten willst
- Zentrale `src/types` oder `src/constants` (entweder als eigenes package veröffentlichen oder
  kopieren und dokumentieren)

Entscheidungs-Optionen:

- Schneller Weg: Kopiere nur die benötigten Typen/Constants (kleiner Duplikat) ins Knowledge-Repo
  und dokumentiere die Abweichungen.
- Langfristig: Extrahiere ein kleines shared npm-Paket (`@melody-mind/shared-types`) und importiere
  es in beiden Repos.

---

### 4) Vorbereitende Checks (Pre-migration)

1. Backup: Stelle sicher, dass der Monorepo-Branch mit aktuellem Stand gesichert ist.
2. Liste der zu verschiebenden Dateien validieren (Dry-run der Migration — Script später).
3. Entscheide Hosting (Vercel / Netlify / Cloudflare Pages). Empfehlung: Cloudflare Pages oder
   Vercel.
4. Lege Subdomain-Namen fest (z. B. `knowledge.example.com`).
5. Entscheide ob Redirects per CDN oder per Hauptrepo-Deploy gesetzt werden.

---

### 5) Migrationsschritte (hochdetailliert)

1. Scaffold neues Repo (manuell oder scriptbasiert)

- Erstelle Repo `melody-mind-knowledge` basierend auf Astro + TypeScript.
- Grundstruktur:
  - `package.json`, `tsconfig.json`, `astro.config.mjs`
  - `src/pages/[lang]/[slug].astro` (dynamische Route) — exportiere `getStaticPaths()` für alle
    Slugs
  - `src/content/` (kopiere hier `knowledge-*` Ordner)
  - `public/` oder `src/assets/` für die Bilder
  - `scripts/` mit `migrate-and-rewrite.js` (siehe unten)

2. Migration (dry-run zuerst)

- Schritt A: Dry-run: Erzeuge Liste aller Dateien, die kopiert würden.

  Beispiel (Konzept):

  ```bash
  node scripts/migrate-knowledge.js --dry-run --source ../melody-mind --target .
  ```

- Schritt B: Prüfe Liste, validiere Slugs, assets und referenzen.

- Schritt C: Ausführen (apply): Kopiere Dateien, rewrite image paths.

  Beispiel:

  ```bash
  node scripts/migrate-knowledge.js --apply --source ../melody-mind --target .
  ```

- Script-Details weiter unten (Abschnitt "Migration Script Spezifikation").

3. Kategorie-JSON / navigation links

- Option A: Kopiere die language-specific `*_categories.json` ins neue Repo und passe `knowledgeUrl`
  auf interne Pfade an (z. B. `/en/1950s`).
- Option B: Belasse JSON im Main-Repo und aktualisiere dort `knowledgeUrl` auf volle URL
  `https://knowledge.example.com/en/1950s`.
- Empfehlung: Für saubere Trennung kopiere relevante category-items ins neue Repo.

4. OG-Images & builder scripts

- Kopiere `public/og-images/social-share-knowledge*.jpg` und das zugehörige Generatorscript (z. B.
  `scripts/generate-og-images.cjs`) falls nötig.
- Teste OG-Erzeugung lokal.

5. CI / Deploy

- Füge eine GitHub Actions workflow hinzu, die `yarn install && yarn build` ausführt und bei Erfolg
  deployed (Cloudflare Pages / Vercel).
- Setze Preview-Deploys für Pull Requests.

6. DNS & Redirects

- DNS: Setze `CNAME` für `knowledge.example.com` auf Hostname des Providers.
- Redirects: 301 redirect setzen von alten Knowledge-URLs zu neuen Subdomain-URLs. Beispiel für
  Netlify `_redirects`:

  ```text
  /en/knowledge/*  https://knowledge.example.com/en/:splat  301!
  ```

- Wenn Hauptseite weiterhin statisch ausgeliefert wird, füge Redirects in Main-Repo
  `public/_redirects` oder Cloudflare Pages rules ein.

7. QA & Smoke Tests

- Build erfolgreich? `yarn build`
- Prüfe 10 repräsentative Slugs in verschiedenen Sprachen.
- Linkchecker: keine 404s
- OG-Bilder: social preview (twitter card validator)
- Accessibility spot-check (contrast, keyboard nav)

8. Cutover & Post-Migration

- Setze Redirects in Main-Repo oder CDN.
- Entferne oder ersetze verschobene Dateien im Main-Repo mit einem Link-Stub auf die Subdomain
  (verhindert 404 während Rollout).
- Tag und dokumentiere Commit mit `mig/knowledge-extract`.

---

### 6) Migration Script Spezifikation (zum Implementieren)

Ziel: Ein Node-Script (`scripts/migrate-knowledge.js`) mit folgenden Features:

- Flags: `--dry-run`, `--apply`, `--source <path>`, `--target <path>`,
  `--rewrite-json-links (true|false)`, `--redirects-out <file>`
- Schritte intern:
  1. Scan `source` nach: `src/content/knowledge-*`, `src/assets/homecategories/knowledge`,
     `public/og-images/social-share-knowledge*`, `src/json/*_categories.json` Einträge
  2. Erzeuge Kopierplan (src -> target), prüfe Dateikonflikte
  3. Parst markdown frontmatter und rewrites absolute paths (z. B. `/src/assets/...` →
     `./assets/...` oder `../public/...` je nach Zielstruktur)
  4. Kopiert Dateien (nur bei `--apply`)
  5. Erzeugt Redirect-Mapping (alte Pfade -> neue URLs) in `--redirects-out` (Standard:
     `redirects/knowledge-redirects.csv`)

Akzeptanzkriterien:

- Dry-run listet alle Operationen ohne Änderungen
- Apply führt die Kopien aus und verlässt sich auf idempotente Operationen (überschreibt nur wenn
  `--force` gesetzt)

---

### 7) CI / Deploy-Vorlage (High-level)

- Workflow: `on: [push, pull_request]`
- Jobs: `build` → installs deps, runs `yarn build`; `deploy` → run only on main branch and calls
  provider's deploy (Cloudflare/Vercel)
- Secrets: `CF_PAGES_API_KEY` oder `VERCEL_TOKEN` je nach Provider

---

### 8) DNS / Subdomain Checkliste

1. Erstelle DNS CNAME/A Eintrag für `knowledge.example.com`. Provider-spezifische Ziele:
   - Vercel: CNAME to `cname.vercel-dns.com`
   - Cloudflare Pages: CNAME to provided target
2. Warte auf DNS-Propagation
3. Test: `curl -I https://knowledge.example.com` sollte 200 oder 301 (während Cutover) zurückgeben

---

### 9) QA Checkliste (mindestens)

- Build: erfolgreich
- 20 zufällige Knowledge-Slug-Seiten > 200 OK
- keine toten Bilder (HTTP 200)
- OG-Bilder anzeigen korrekt in social preview
- Link-Checker (no 4xx)
- Accessibility cursory: color-contrast und keyboard focus

---

### 10) Rollback-Plan

1. Wenn problematisch: Deaktiviere Redirects → Traffic bleibt beim Monolithen
2. Revert Deploy der Knowledge-Repo
3. Wiederherstelle/remove placeholder-Stubs im Monorepo

---

### 11) Übergabe an einen anderen Agent / Entwickler (Aufgabenliste)

1. Prüfe Inventar (bereitgestellt)
2. Implementiere `scripts/migrate-knowledge.js` (siehe Spezifikation)
3. Erstelle `melody-mind-knowledge` Repo mit oben beschriebener Struktur
4. Führe Dry-run, Review, Apply
5. Teste CI/Deploy + DNS + Redirects
6. QA → Cutover → Post-cleanup

---

### 12) Deliverables (was der beauftragte Agent liefern soll)

1. `melody-mind-knowledge` Repo URL (public/private)
2. Migration Script mit README und Beispielaufrufen
3. `_redirects` oder redirects config file für Main-Repo
4. CI workflow / Deploy Konfiguration
5. QA-Bericht (Smoke tests, Liste getesteter Slugs)
6. Post-migration-Commit im Monorepo mit Stubs + Dokumentation

---

### 13) Akzeptanzkriterien (leicht automatisierbar)

- Alle alten Knowledge-URLs führen per 301 auf die entsprechenden neuen Seiten.
- Keine 4xx Fehler für kopierte Content- und Asset-Pfade.
- OG-Previews für 5 repräsentative Seiten korrekt.
- Build der Knowledge-Repo erfolgreich in CI.

---

### 14) Zeitplan (Schätzung)

- Inventarisierung & Vorbereitung: 0.5–1 Tag (bereit)
- Script-Implementierung & Dry-run: 0.5–1 Tag
- Apply + Assets kopieren: 0.5 Tag
- CI/Deploy + DNS-Konfiguration + QA: 0.5–1 Tag
- Gesamt (inkl. Review): 2–4 Arbeitstage

---

### 15) Nächste Schritte (für mich / dich)

1. Sag mir, ob ich das Migration-Skript jetzt erzeugen soll (ich kann es hier direkt als Patch
   hinzufügen).
2. Oder nenne bevorzugten Hosting-Provider (Vercel / Cloudflare / Netlify), damit ich die CI-Vorlage
   passend erstelle.

---

Dateien/Orte dieses Plans im Repo:

- `docs/migration-knowledge.md` ← du liest gerade diese Datei

Wenn du möchtest, erstelle ich nun automatisch das Migration-Script und ein kleines Astro-Scaffold
im `tools/` oder in einem separaten Branch.
