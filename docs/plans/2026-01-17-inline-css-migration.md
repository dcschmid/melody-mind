# Inline CSS Migration (Astro 5) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace external/global CSS imports with per-component `<style>` blocks while leaving all scripts unchanged.

**Architecture:**
- Astro scoped styles do not style child components by default, so each component/page must carry its own styles.
- Design tokens and base variables live on `<html class="app">` (Layout) to cascade across the app.
- Shared utilities like `.panel` and `.sr-only` are duplicated in each file that uses them to keep CSS scoped.
- No external CSS files or global stylesheets are referenced.
- Skills: @astro-5-strict-reviewer.

**Tech Stack:** Astro 5.x, scoped `<style>` blocks, BEM classes.

**Constraints:**
- No worktree (per user request).
- No tests (per user request).
- Do not change scripts.

---

### Task 1: Inline tokens + layout base styles

**Files:**
- Modify: `src/layouts/Layout.astro`
- Source: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/site.css`

**Step 1: Remove global CSS import**
- Delete `import "../styles/global.css";`.

**Step 2: Add tokens and base variables into Layout `<style>`**
- Copy `src/styles/tokens.css` lines 6-135 and 139-172.
- Replace `:root` with `.app` for both blocks.
- Copy `src/styles/base.css` lines 3-85.
- Replace `:root` with `.app`.

**Step 3: Add layout base styles**
- Copy `src/styles/site.css` lines 3-43 (includes `.app`, `.app *`, `.app__body`, `.app__main`).
- Keep as-is, inside Layout `<style>`.

**Step 4: Reduced motion rule (scoped)**
- Copy `src/styles/base.css` lines 87-90, but change selector `*` to `.app *` to keep it scoped.

**Step 5: Update font comment**
- In `src/layouts/Layout.astro` remove/update the comment that says fonts load via `src/styles/fonts.css`.

**Step 6: Commit**
- Skip (per user request).

---

### Task 2: SkipLink styles

**Files:**
- Modify: `src/components/Shared/SkipLink.astro`
- Source: `src/styles/site.css`

**Step 1: Add `<style>`**
- Copy lines 224-251 (`.skip-link`, `.skip-link:focus-visible`, `.skip-link__icon`).

**Step 2: Commit**
- Skip.

---

### Task 3: PageShell styles

**Files:**
- Modify: `src/components/Shared/PageShell.astro`
- Source: `src/styles/site.css`

**Step 1: Add `<style>`**
- Copy lines 164-222 (`.page-shell`, `.page-shell__overlay`, `.page-shell__container`, variants).

**Step 2: Commit**
- Skip.

---

### Task 4: Breadcrumbs styles

**Files:**
- Modify: `src/components/Breadcrumbs.astro`
- Source: `src/styles/site.css`

**Step 1: Add `<style>`**
- Copy lines 253-376 (all `.breadcrumbs*` rules and media queries).

**Step 2: Commit**
- Skip.

---

### Task 5: Footer styles

**Files:**
- Modify: `src/components/Footer.astro`
- Source: `src/styles/site.css`

**Step 1: Add `<style>`**
- Copy lines 378-540 (all `.site-footer*` rules and media queries).

**Step 2: Commit**
- Skip.

---

### Task 6: ButtonLink styles + sr-only

**Files:**
- Modify: `src/components/ButtonLink.astro`
- Source: `src/styles/site.css`, `src/styles/utilities.css`

**Step 1: Add `<style>`**
- Copy `src/styles/site.css` lines 80-162 (all `.button-link*` rules).
- Add `.sr-only` rule from `src/styles/utilities.css` line 3.

**Step 2: Commit**
- Skip.

---

### Task 7: SearchPanel styles + sr-only

**Files:**
- Modify: `src/components/Search/SearchPanel.astro`
- Source: `src/styles/site.css`, `src/styles/utilities.css`

**Step 1: Add `<style>`**
- Copy `src/styles/site.css` lines 543-700 (all `.search-panel*` rules and media queries; you can omit `.search-panel__label` if desired since markup uses `.sr-only`).
- Add `.sr-only` rule from `src/styles/utilities.css` line 3.

**Step 2: Commit**
- Skip.

---

### Task 8: TableOfContents styles + panel + sr-only

**Files:**
- Modify: `src/components/TableOfContents.astro`
- Source: `src/styles/site.css`, `src/styles/knowledge.css`, `src/styles/utilities.css`

**Step 1: Add `<style>`**
- Copy `src/styles/site.css` lines 45-78 (all `.panel*` rules used by `panel panel--compact`).
- Copy `src/styles/knowledge.css` lines 439-605 (all `.toc*` rules).
- Add `.sr-only` rule from `src/styles/utilities.css` line 3.

**Step 2: Commit**
- Skip.

---

### Task 9: BackToTop styles + sr-only

**Files:**
- Modify: `src/components/Shared/BackToTop.astro`
- Source: `src/styles/knowledge.css`, `src/styles/utilities.css`

**Step 1: Add `<style>`**
- Copy `src/styles/knowledge.css` lines 851-897 (all `.back-to-top*` rules).
- Add `.sr-only` rule from `src/styles/utilities.css` line 3.

**Step 2: Commit**
- Skip.

---

### Task 10: Headline styles

**Files:**
- Modify: `src/components/Headline.astro`
- Source: `src/styles/knowledge.css`

**Step 1: Add `<style>`**
- Copy `src/styles/knowledge.css` lines 900-972 (all `.headline*` rules).

**Step 2: Commit**
- Skip.

---

### Task 11: Paragraph styles

**Files:**
- Modify: `src/components/Paragraph.astro`
- Source: `src/styles/knowledge.css`

**Step 1: Add `<style>`**
- Copy `src/styles/knowledge.css` lines 974-1047 (all `.paragraph*` rules).

**Step 2: Commit**
- Skip.

---

### Task 12: Prose styles (content + utilities)

**Files:**
- Modify: `src/components/Prose.astro`
- Source: `src/styles/knowledge.css`, `src/styles/utilities.css`

**Step 1: Add `<style>`**
- Copy `src/styles/knowledge.css` lines 607-715 (all `.prose*` rules).
- Copy `src/styles/utilities.css` lines 6-117 (prose images + heading anchors + subsection figure).
- Add a focus style for prose links (new):
  ```css
  .prose a:focus-visible {
    outline: 2px solid var(--color-gn-amber-300);
    outline-offset: 2px;
  }
  ```

**Step 2: Commit**
- Skip.

---

### Task 13: KnowledgeCard styles + sr-only

**Files:**
- Modify: `src/components/KnowledgeCard.astro`
- Source: `src/styles/knowledge.css`, `src/styles/utilities.css`

**Step 1: Add `<style>`**
- Copy `src/styles/knowledge.css` lines 717-849 (all `.knowledge-card*` rules).
- Add `.sr-only` rule from `src/styles/utilities.css` line 3.

**Step 2: Commit**
- Skip.

---

### Task 14: Index page styles + sr-only

**Files:**
- Modify: `src/pages/index.astro`
- Source: `src/styles/site.css`, `src/styles/utilities.css`

**Step 1: Add `<style>`**
- Copy `src/styles/site.css` lines 702-931 (all `.knowledge-index*` and `.category-card*` rules).
- Add `.sr-only` rule from `src/styles/utilities.css` line 3.

**Step 2: Commit**
- Skip.

---

### Task 15: Category page styles + panel

**Files:**
- Modify: `src/pages/categories/[slug].astro`
- Source: `src/styles/site.css`

**Step 1: Add `<style>`**
- Copy `src/styles/site.css` lines 45-78 (all `.panel*` rules).
- Copy `src/styles/site.css` lines 933-1130 (all `.category-page*`, `.category-hero*`, and empty state rules).

**Step 2: Commit**
- Skip.

---

### Task 16: Knowledge article page styles + panel + sr-only

**Files:**
- Modify: `src/pages/knowledge/[...slug].astro`
- Source: `src/styles/knowledge.css`, `src/styles/site.css`, `src/styles/utilities.css`

**Step 1: Add `<style>`**
- Copy `src/styles/site.css` lines 45-78 (all `.panel*` rules).
- Copy `src/styles/knowledge.css` lines 3-387 (all `.reading-progress*` and `.knowledge*` rules).
- Copy `src/styles/knowledge.css` lines 389-437 (all `.share-button*` rules).
- Add `.sr-only` rule from `src/styles/utilities.css` line 3.

**Step 2: Commit**
- Skip.

---

### Task 17: Imprint page styles + panel

**Files:**
- Modify: `src/pages/imprint.astro`
- Source: `src/styles/site.css`

**Step 1: Add `<style>`**
- Copy `src/styles/site.css` lines 45-78 (all `.panel*` rules).
- Copy `src/styles/site.css` lines 1132-1198 (all `.legal-page*` rules).
- Add focus style for legal links (new):
  ```css
  .legal-page__link:focus-visible {
    outline: 2px solid var(--color-gn-amber-300);
    outline-offset: 2px;
  }
  ```

**Step 2: Commit**
- Skip.

---

### Task 18: Privacy page styles + panel

**Files:**
- Modify: `src/pages/privacy.astro`
- Source: `src/styles/site.css`

**Step 1: Add `<style>`**
- Copy `src/styles/site.css` lines 45-78 (all `.panel*` rules).
- Copy `src/styles/site.css` lines 1132-1198 (all `.legal-page*` rules).
- Add focus style for legal links (same as Task 17).

**Step 2: Commit**
- Skip.

---

### Task 19: Clean up unused CSS references

**Files:**
- None required.

**Step 1:** Confirm there are no remaining CSS imports in `.astro` files.
- Run: `rg "styles/|\.css" src -g "*.astro"`
- Expected: no stylesheet imports remaining.

**Step 2: Commit**
- Skip.
