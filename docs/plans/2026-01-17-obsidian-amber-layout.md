# Obsidian + Amber Site-Wide Dark Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply a modern Obsidian + Amber dark visual system site‑wide with WCAG AAA‑level contrast and consistent component styling.

**Architecture:** Centralize the dark theme tokens in `src/layouts/Layout.astro` (scoped CSS variables), then update shared components and page-level styles to use the new tokens. No external/global CSS; all styles remain in per‑component `<style>` blocks.

**Tech Stack:** Astro 5.x, scoped `<style>` blocks, existing components/pages.

> **Constraint:** User requested no worktree. Execute in current workspace. Tests should be added unless the user explicitly approves a TDD exception for this change.

### Task 1: Define Obsidian + Amber tokens in Layout

**Files:**
- Modify: `src/layouts/Layout.astro`

**Step 1: Write the failing test**

Create a minimal visual contract test (if test tooling exists). If no tests are available, pause and request a TDD exception from the user before proceeding.

**Step 2: Run test to verify it fails**

Run (example):
```bash
# If a visual/a11y test exists; otherwise skip with approval
npm test
```
Expected: FAIL (theme tokens not applied).

**Step 3: Write minimal implementation**

Update token variables in the `.app` scope to define the Obsidian + Amber system (backgrounds, surfaces, text, accents, focus). Example target tokens:
- `--color-obsidian-950/900/800`
- `--color-amber-300/400/500`
- `--surface-1/2/3`, `--text-primary/secondary`, `--link-default/hover`
- `--focus-ring-color`, `--focus-ring-offset`
- Update `--gn-*` mappings to point at new obsidian/amber values.

**Step 4: Run test to verify it passes**

```bash
npm test
```
Expected: PASS.

**Step 5: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add obsidian amber theme tokens"
```

### Task 2: Update shared component surfaces + typography

**Files:**
- Modify: `src/components/ButtonLink.astro`
- Modify: `src/components/Breadcrumbs.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/Headline.astro`
- Modify: `src/components/Paragraph.astro`
- Modify: `src/components/Prose.astro`
- Modify: `src/components/Search/SearchPanel.astro`
- Modify: `src/components/Shared/BackToTop.astro`
- Modify: `src/components/Shared/PageShell.astro`
- Modify: `src/components/Shared/SkipLink.astro`
- Modify: `src/components/TableOfContents.astro`
- Modify: `src/components/KnowledgeCard.astro`

**Step 1: Write the failing test**

Add a snapshot/DOM test for component color tokens or approve a TDD exception for this CSS‑only update.

**Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL (old colors still present).

**Step 3: Write minimal implementation**

Update component styles to use the new tokens only (no hardcoded colors unless required for contrast). Ensure:
- Buttons use amber gradient for primary, transparent for secondary.
- Panels/cards use `--surface-*` and inner stroke.
- Links and headings meet AAA contrast on obsidian background.
- Focus-visible rings use new amber focus tokens.

**Step 4: Run test to verify it passes**

```bash
npm test
```
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components
git commit -m "feat: align shared components with obsidian amber theme"
```

### Task 3: Update page-level layout styles

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/categories/[slug].astro`
- Modify: `src/pages/knowledge/[...slug].astro`
- Modify: `src/pages/imprint.astro`
- Modify: `src/pages/privacy.astro`

**Step 1: Write the failing test**

Add a basic page-level visual regression test or request TDD exception before editing.

**Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL.

**Step 3: Write minimal implementation**

Replace any page‑local hardcoded colors with theme tokens. Ensure hero/background gradients and panels match Obsidian + Amber direction. Keep layout structure intact.

**Step 4: Run test to verify it passes**

```bash
npm test
```
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages
git commit -m "feat: update page styles for obsidian amber layout"
```

### Task 4: Accessibility & contrast pass

**Files:**
- Modify: `src/layouts/Layout.astro`
- Modify: `src/components/Prose.astro`
- Modify: `src/components/ButtonLink.astro`

**Step 1: Write the failing test**

If an a11y test exists (axe/playwright), add one rule check; otherwise request TDD exception.

**Step 2: Run test to verify it fails**

```bash
npm test
```
Expected: FAIL (contrast/focus issues detected).

**Step 3: Write minimal implementation**

Ensure:
- Body text vs background meets AAA contrast.
- Link colors meet AAA in default and hover states.
- Focus rings are clearly visible on all surfaces.

**Step 4: Run test to verify it passes**

```bash
npm test
```
Expected: PASS.

**Step 5: Commit**

```bash
git add src/layouts/Layout.astro src/components/Prose.astro src/components/ButtonLink.astro
git commit -m "fix: AAA contrast and focus for dark theme"
```

### Task 5: Sanity checks (no automated tests if exception approved)

**Files:**
- Read-only: `src/layouts/Layout.astro`, `src/components`, `src/pages`

**Step 1: Write the failing test**

Skip if TDD exception approved.

**Step 2: Run test to verify it fails**

Skip if TDD exception approved.

**Step 3: Write minimal implementation**

Run quick checks:
```bash
rg -n "#ffffff|#000000|rgb\(" src/components src/pages src/layouts
rg -n "color-mix" src/layouts/Layout.astro
```
Expected:
- No stray hardcoded colors (unless intentional for contrast).
- Theme tokens consistently used.

**Step 4: Run test to verify it passes**

Skip if TDD exception approved.

**Step 5: Commit**

Skip (no code changes).
