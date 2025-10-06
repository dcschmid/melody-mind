# AGENTS.md

A dedicated, predictable place for AI coding agents working on the MelodyMind project. This file
complements `README.md` (human-focused) and `.github/copilot-instructions.md` (high-level standards)
by providing concise, actionable, agent-oriented guidance.

---

## 1. Project Overview

MelodyMind is a music trivia game built with Astro + TypeScript. Core domains: questions, genres,
scoring, achievements, leaderboards, accessibility, localization (i18n), performance.

Authoritative sources:

- Game rules & scoring: `README.md`
- Coding standards: `.github/copilot-instructions.md`
- Data: `src/data/`, `public/category/`
- Question & score types: `src/types/`, `src/interfaces/`

Primary goals:

- Fast, accessible gameplay (WCAG AAA targets)
- Deterministic scoring & bonus calculation
- Minimal client JS; leverage Astro static rendering
- Clean separation of content (data) and logic (utils/services)

---

## 2. Tech Stack & Constraints

- Runtime: Astro 5 (Static-first + hybrid), Node (build time)
- Language: TypeScript (strict preferred; ensure types propagate)
- Style: Vanilla CSS (+ Tailwind utilities where present, verify usage before adding)
- Data storage: Fully static JSON / markdown content (no external database)
- Testing tooling present (Vitest) but NEW TESTS CURRENTLY FROZEN — do not add.
- Package manager: `yarn` (v1). Do NOT introduce pnpm.

Node memory tweaks already configured in `build:astro` script; keep consistent.

---

## 3. Core Commands (Agents MAY execute)

Install deps (development):

- `yarn install`

Dev server:

- `yarn dev`

Type / lint quality gates:

- `yarn lint:check` (no writes)
- `yarn lint` (will auto-fix + format)
- `yarn format:check`

Build variants:

- `yarn build` (standard)
- `yarn build:check` (type structure check ignoring TS errors flagged as non-blocking)
- `yarn build:production` (production bundle)

Preview:

- `yarn build:preview`

Data / assets helpers:

- `yarn setup-fonts`
- `yarn generate-og-images`
- `yarn sync:categories`
- `yarn sync:knowledge-playlists` (No database setup required — project is 100% static content.)

Avoid running heavy generation unless task explicitly needs updated assets.

---

## 4. File & Directory Conventions

- Pages: `src/pages/` — dynamic routes MUST export `getStaticPaths()`.
- Reusable UI: `src/components/`
- Layouts: `src/layouts/`
- Game / helper logic: `src/utils/`, `src/lib/`, `src/services/`
- Static question/genre/media data: `src/data/`, `public/category/`
- Type definitions: `src/types/` & `src/interfaces/`
- i18n resources: `src/i18n/` and JSON data files
- Styles: `src/styles/`

When adding new logic prefer: `src/utils/<area>/<name>.ts` keeping pure functions. Co-locate very
UI-specific helpers next to components if not reused elsewhere.

Do NOT duplicate CSS variables; reuse existing tokens (see global styles & variables). If adding
new, consolidate and document.

---

## 5. Coding Principles

- Strong typing first: infer over `any`; narrow unions; prefer readonly where possible.
- Pure functions for scoring & transformations (no side effects; inject dependencies).
- Accessibility baked in: semantic elements, labels, focus order, ARIA only when needed.
- Minimal client hydration; convert interactive islands only where user input is required.
- Defensive boundary checks on user-derived input (query params, dynamic paths).
- Keep bundle lean: avoid large new deps unless justified.

---

## 6. Internationalization (i18n)

- English is canonical source. Other locales generated/updated from English.
- Add new translatable keys in English first; sync tooling may propagate.
- Avoid hard-coded UI strings in components—abstract into i18n JSON where feasible.
- Keep placeholders explicit (e.g. `{count}`) and document expected type.

### 6.1 Service Language Handling

Runtime-exposed services (e.g. RSS/news) MUST normalize and validate incoming language values using:

- `normalizeLanguage` (trims + lowercases) from `src/constants/i18n.ts`
- `ensureSupportedLanguage` (normalize → membership check → fallback) from
  `src/constants/languages.ts`
- Canonical `FALLBACK_LANGUAGE` for any unsupported locale variants (e.g. `en-US`, `DE_de`).

Current adoption:

- `rssService.getNewsForLanguage()` now performs: user input → `normalizeLanguage` →
  `ensureSupportedLanguage` → feed lookup. If no language-specific feeds return items, it performs a
  single retry using the canonical fallback language instead of embedding a hard-coded `"en"`
  literal.

Rationale:

- Prevents cache fragmentation (e.g. `EN`, `en-US`, `en_us` collapsing onto one cache key).
- Centralizes fallback semantics; avoids silent drift if fallback language changes.
- Keeps service logic minimal (one generic fallback path, no duplicated English branch).

When adding new services that accept a `language` parameter, replicate this pattern rather than
re-implementing ad-hoc normalization or embedding literal fallback strings.

---

## 7. Data Integrity & Scoring

Question object baseline defined in `.github/copilot-instructions.md` and types directory.

Centralized constants (scoring, difficulty, joker allocations) live in `src/constants/game.ts`. Use
these instead of duplicating literal numbers (e.g. `50`, `10`, `15`, question counts, joker counts)
in new code.

Scoring rules:

- Base: 50 points per correct answer.
- Speed bonus: +50 (<=10s), +25 (<=15s), else 0.
- Max total depends on difficulty (Easy 500 / Medium 750 / Hard 1000).
- 50:50 Joker reduces displayed options (never remove correct answer). Track remaining uses per
  difficulty (3/5/10).

Implementations should:

- Keep scoring pure and testable (even if tests not added now — plan for later).
- Avoid coupling scoring with rendering.

---

## 8. Accessibility Requirements

- Contrast ratios target WCAG AAA (7:1 normal text).
- Every interactive element keyboard reachable (Tab / Shift+Tab) & has focus styles.
- Announce dynamic score / achievement changes via aria-live regions where applicable.
- Provide text equivalents for media. Images require `alt` text; decorative images: empty alt.

---

## 9. Performance Guidelines

- Prefer static generation where content stable.
- Defer or lazy load non-critical assets (images, large JSON) when possible.
- Reuse data across requests; avoid recomputing expensive transforms in runtime code.
- Keep third-party additions minimal; evaluate size impact.

---

## 10. Security & Safety

- Never commit secrets. Use environment variables (see `env.d.ts`).
- Validate external data (playlist sync results, remote fetches) before use.
- Avoid dynamic `eval` / Function constructors.
- Sanitize any user-provided content before injecting into HTML.

---

## 11. Contribution Behaviors for Agents

Before submitting changes (or concluding an automated task):

1. Ensure no lint errors: `yarn lint:check`
2. Run format check; if failing run `yarn format`.
3. Build: `yarn build` to confirm passes.
4. Summarize modifications referencing file paths in final message.
5. Do NOT add tests yet (project phase freeze).

Commit style: concise, imperative, scoped (e.g., `feat(score): add speed bonus util`).

---

## 12. When Editing or Adding Data Files

- Keep JSON sorted when practical (stable ordering aids diff review).
- Validate JSON with trailing commas disallowed.
- For large lists (genres, questions) avoid manual duplication—prefer scripts under `scripts/`.

---

## 13. Tooling Notes

ESLint + Prettier integrated; run `yarn lint` to auto-fix and `yarn format` for style. TypeScript
diagnostics may be partially relaxed in `build:check`—still aim for zero errors.

If adding new script files:

- Use `.cjs` for Node scripts requiring CommonJS or existing pattern
- Prefer `.ts` for code that benefits from types and is imported elsewhere

---

## 14. Future Testing (Reserved)

Test scaffolding exists but currently paused. When re-enabled expected pattern:

- Co-locate unit tests: `name.test.ts`
- Use Vitest + `describe/it` + `expect`
- Cover scoring, timing, joker logic, i18n edge cases

(Do not implement now.)

---

## 15. Known Open Improvements (Optional for Agents)

- Consolidate duplicated category image filenames (some naming inconsistencies like spaces vs
  dashes)
- Audit `.github/copilot-instructions.md` for minor formatting corruption near header
- Refine privacy/i18n copy to remove any lingering database terminology
- Add short README section linking to `AGENTS.md` (if not yet added)
- Image pipeline updated (2025-10-06): jpg/jpeg added to optimized variant glob so canonical
  fallback now resolves from discovered assets rather than hard-coded `/group/slug.jpg` path
  placeholder. When adding new images ensure canonical base file (slug.webp OR slug.jpg) exists in
  each asset folder.

If addressing one, update this section accordingly.

---

## 16. Escalation / Ambiguity Handling

If a task conflicts with this file and explicit user instruction: user chat instruction prevails.
Otherwise: prefer safer, smaller change; document assumption.

---

## 17. FAQ (Project-Specific)

Q: Can I introduce a new dependency for a small helper? A: Prefer implementing inline unless the
dependency is widely used & <5KB added impact.

Q: May I refactor file structure broadly? A: Large restructures require explicit human request.
Limit scope.

Q: Should I add new locales now? A: Only if requested; maintain English baseline first.

---

## 18. Completion Checklist (Agents)

Before finishing a complex change ensure:

- [ ] Code typed & no `any` leaks
- [ ] Lint passes
- [ ] Build succeeds
- [ ] Docs / comments updated
- [ ] No stray debug output
- [ ] This AGENTS.md still accurate

---

Generated: 2025-09-14. Keep this document living; update when architecture or workflow changes.

---

## 19. Anti Over-Engineering & Pragmatic DRY Policy

Principles to keep the codebase lean and maintainable:

- Prefer clarity over abstraction: duplicate a 3–5 line snippet once if abstraction would hide
  intent.
- Introduce a shared helper only after the pattern appears >=3 times or has a clear change hotspot.
- Avoid speculative generalization ("we might need multilevel fallbacks later"). Build for the
  current proven need.
- Centralize only canonical single sources of truth (e.g. `FALLBACK_LANGUAGE`, scoring constants,
  language lists).
- Remove deprecated flags/params promptly (e.g. `useAliasPath`) instead of carrying legacy switches
  forward.
- Keep loaders I/O focused and transformations pure; do not merge concerns back together.
- Do not wrap simple one-liners in extra functions unless they convey domain meaning.
- Prefer flat data structures; avoid deep nested objects for simple lookups.
- Measure before optimizing performance; readability is the default priority.

Refactor Triggers (green lights):

1. Same logic copied in 3+ places.
2. A bug fix would require touching multiple near-identical blocks.
3. Config or constant drift risk (multiple literal "en" → centralize).
4. Cognitive overhead > benefit (unclear indirection, nested abstractions).

Refactor Deferrals (red lights):

1. Single duplication of trivial code.
2. Hypothetical future feature only.
3. Abstraction increases parameter count / branching without proven reuse.
4. Performance tuning without profiling evidence.

Checkpoint Guidelines:

- During reviews: flag over-general abstractions early; suggest inline clarity.
- When adding a helper: co-locate near domain (e.g. i18n helpers in `src/constants/i18n.ts`).
- Document rationale in code comments if a seemingly obvious DRY step is intentionally skipped.

Outcome Goal: A codebase that is easy to reason about, fast to modify, and resistant to accidental
complexity creep.
