# Atkinson Hyperlegible Local Embed Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Serve Atkinson Hyperlegible from local `public/` assets via inline `@font-face` in `Layout.astro` without external CSS imports.

**Architecture:** Copy the required WOFF/WOFF2 assets into `public/fonts/atkinson-hyperlegible/` and define `@font-face` rules in `src/layouts/Layout.astro` so all pages pick up the font tokens already used in the layout.

**Tech Stack:** Astro 5.x, static assets in `public/`, scoped `<style>` in `.astro` files.

### Task 1: Stage Font Assets

**Files:**
- Create: `public/fonts/atkinson-hyperlegible/`
- Copy: `node_modules/@fontsource/atkinson-hyperlegible/files/*latin-400/700-(normal|italic).woff2?`

**Step 1: Write the failing test**

No automated tests requested by user; skip test creation.

**Step 2: Run test to verify it fails**

Skip (user request).

**Step 3: Write minimal implementation**

```bash
mkdir -p public/fonts/atkinson-hyperlegible
cp node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2 public/fonts/atkinson-hyperlegible/
cp node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff public/fonts/atkinson-hyperlegible/
cp node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-italic.woff2 public/fonts/atkinson-hyperlegible/
cp node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-italic.woff public/fonts/atkinson-hyperlegible/
cp node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2 public/fonts/atkinson-hyperlegible/
cp node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff public/fonts/atkinson-hyperlegible/
cp node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-italic.woff2 public/fonts/atkinson-hyperlegible/
cp node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-italic.woff public/fonts/atkinson-hyperlegible/
```

**Step 4: Run tests to verify**

Skip (user request).

**Step 5: Commit**

```bash
git add public/fonts/atkinson-hyperlegible/
git commit -m "feat: add local Atkinson Hyperlegible assets"
```

### Task 2: Embed Local @font-face in Layout

**Files:**
- Modify: `src/layouts/Layout.astro`

**Step 1: Write the failing test**

No automated tests requested by user; skip test creation.

**Step 2: Run test to verify it fails**

Skip (user request).

**Step 3: Write minimal implementation**

```astro
<style>
@font-face {
  font-family: "Atkinson Hyperlegible";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/atkinson-hyperlegible/atkinson-hyperlegible-latin-400-normal.woff2") format("woff2"),
       url("/fonts/atkinson-hyperlegible/atkinson-hyperlegible-latin-400-normal.woff") format("woff");
}
</style>
```

**Step 4: Run tests to verify**

Skip (user request).

**Step 5: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: embed local Atkinson Hyperlegible font-face"
```
