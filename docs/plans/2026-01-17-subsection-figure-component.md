# Subsection Figure Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all MDX `.subsection-figure` blocks with a dedicated `SubsectionFigure` Astro component that renders a 40/60 editorial split (image left, headline right) and owns its styles.

**Architecture:** Create `src/components/SubsectionFigure.astro` with the full markup + `<style>` block and BEM classes, then update all `src/content/knowledge-en/*.mdx` files to use the component. Remove the legacy `.subsection-figure` styles from `src/components/Prose.astro` to avoid duplicate rules. No external CSS.

**Tech Stack:** Astro 5.x, MDX, `astro:assets` Image component.

> **Constraint:** User requested no worktree and no tests. Execute in current worktree and skip tests unless the user approves later.

### Task 1: Verify Astro-specific behavior via MCP (blocker)

**Files:**
- Reference: Astro MCP docs (required by astro-5-strict-reviewer)

**Step 1: Write the failing test**

Skip (user request).

**Step 2: Run test to verify it fails**

Skip (user request).

**Step 3: Write minimal implementation**

Verify with MCP documentation:
- Using Astro components inside MDX
- `<style>` scoping expectations for component markup
- `astro:assets` Image usage inside `.astro` components

**Step 4: Run test to verify it passes**

Skip (user request).

**Step 5: Commit**

Skip (no changes).

### Task 2: Create SubsectionFigure component

**Files:**
- Create: `src/components/SubsectionFigure.astro`

**Step 1: Write the failing test**

Skip (user request).

**Step 2: Run test to verify it fails**

Skip (user request).

**Step 3: Write minimal implementation**

```astro
---
import { Image } from "astro:assets";

interface Props {
  imageSrc: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  heading: string;
  headingLevel?: "h2" | "h3" | "h4";
  sizes?: string;
  className?: string;
}

const {
  imageSrc,
  imageAlt = "",
  imageWidth = 1024,
  imageHeight = 683,
  heading,
  headingLevel = "h3",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 40vw",
  className = "",
} = Astro.props as Props;

const Tag = headingLevel;
const classes = ["subsection-figure", className].filter(Boolean).join(" ");
---

<figure class={classes}>
  <div class="subsection-figure__media">
    <Image
      class="subsection-figure__image"
      src={imageSrc}
      alt={imageAlt}
      width={imageWidth}
      height={imageHeight}
      sizes={sizes}
      loading="lazy"
      decoding="async"
    />
  </div>
  <div class="subsection-figure__content">
    <Tag class="subsection-figure__title">{heading}</Tag>
  </div>
</figure>

<style>
.subsection-figure {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-items: center;
  margin: 2.25rem 0;
}

.subsection-figure__media {
  position: relative;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #0f1724;
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.45);
}

.subsection-figure__media::after {
  content: "";
  position: absolute;
  inset: 6px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--gn-panel-border) 75%, transparent);
  pointer-events: none;
}

.subsection-figure__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.subsection-figure__content {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
  min-height: 100%;
}

.subsection-figure__content::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.2rem;
  bottom: 0.2rem;
  width: 3px;
  border-radius: 999px;
  background: var(--color-gn-amber-400);
  box-shadow: 0 0 12px rgba(217, 166, 92, 0.35);
}

.subsection-figure__title {
  margin: 0;
  color: var(--gn-ink);
  font-family: var(--font-display);
  font-size: 1.6rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.4);
}

@media (min-width: 900px) {
  .subsection-figure {
    grid-template-columns: minmax(0, 40%) minmax(0, 60%);
    gap: 1.5rem;
  }

  .subsection-figure__title {
    font-size: 1.9rem;
  }
}

@media (max-width: 899px) {
  .subsection-figure__content {
    padding-left: 0;
    padding-top: 0.9rem;
  }

  .subsection-figure__content::before {
    top: 0;
    bottom: auto;
    width: 2.75rem;
    height: 3px;
  }
}
</style>
```

**Step 4: Run test to verify it passes**

Skip (user request).

**Step 5: Commit**

```bash
git add src/components/SubsectionFigure.astro
git commit -m "feat: add subsection figure component"
```

### Task 3: Update MDX content to use SubsectionFigure

**Files:**
- Modify: `src/content/knowledge-en/*.mdx`

**Step 1: Write the failing test**

Skip (user request).

**Step 2: Run test to verify it fails**

Skip (user request).

**Step 3: Write minimal implementation**

For each `.mdx` file:
1) Add import:
```mdx
import SubsectionFigure from "@components/SubsectionFigure.astro";
```
2) Replace each block:
```mdx
<figure class="subsection-figure">
  <div class="subsection-figure__media">
    <Image alt="" src="/knowledge/xyz.jpg" width="1024" height="683" />
  </div>
  <h3>Heading Text</h3>
</figure>
```
with:
```mdx
<SubsectionFigure
  imageSrc="/knowledge/xyz.jpg"
  imageAlt=""
  imageWidth={1024}
  imageHeight={683}
  heading="Heading Text"
  headingLevel="h3"
/>
```
3) Remove `import { Image } from "astro:assets";` if it becomes unused.

**Step 4: Run test to verify it passes**

Skip (user request).

**Step 5: Commit**

```bash
git add src/content/knowledge-en
git commit -m "refactor: use SubsectionFigure in MDX content"
```

### Task 4: Remove legacy subsection-figure styles from Prose

**Files:**
- Modify: `src/components/Prose.astro`

**Step 1: Write the failing test**

Skip (user request).

**Step 2: Run test to verify it fails**

Skip (user request).

**Step 3: Write minimal implementation**

Delete the `.subsection-figure` and `.subsection-figure__media` rules from the `<style>` block in `src/components/Prose.astro` (the ones currently copied from `src/styles/utilities.css`). Keep all `.prose` and `.heading-anchor` rules intact.

**Step 4: Run test to verify it passes**

Skip (user request).

**Step 5: Commit**

```bash
git add src/components/Prose.astro
git commit -m "chore: remove legacy subsection-figure styles"
```

### Task 5: Sanity checks (no automated tests)

**Files:**
- Read-only: `src/content/knowledge-en/*.mdx`

**Step 1: Write the failing test**

Skip (user request).

**Step 2: Run test to verify it fails**

Skip (user request).

**Step 3: Write minimal implementation**

Run quick checks:
```bash
rg -n "<figure class=\"subsection-figure\"" src/content/knowledge-en
rg -n "subsection-figure__" src/content/knowledge-en
rg -n "Image from \"astro:assets\"" src/content/knowledge-en
```
Expected:
- No `<figure class="subsection-figure">` remains.
- No `subsection-figure__` classes remain in MDX.
- `Image` import only remains where still used.

**Step 4: Run test to verify it passes**

Skip (user request).

**Step 5: Commit**

Skip (no code changes).
