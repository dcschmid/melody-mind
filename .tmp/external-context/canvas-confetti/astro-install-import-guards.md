---
source: Context7 API + Official docs
library: canvas-confetti + Astro
package: canvas-confetti
topic: installation, ESM imports, and browser-only guards in Astro
fetched: 2026-02-06T00:00:00Z
official_docs: https://github.com/catdad/canvas-confetti/blob/master/README.md
---

## Install

- Install from npm: `npm install --save canvas-confetti`
- Library is browser/client-side; it does not run in Node by itself.

## ESM import patterns in Astro

- In Astro `<script>` tags without attributes, imports from npm are bundled and processed as module scripts.
- Use default import in Astro client scripts:

```astro
<script>
  import confetti from "canvas-confetti";
</script>
```

- If you add `is:inline`, Astro does not process/bundle imports, so npm import patterns like above will not work.

## Browser-only usage guards

- Astro frontmatter runs on the server; accessing `window`/`document` there causes `document (or window) is not defined`.
- Put confetti usage inside client `<script>` blocks (or framework lifecycle hooks in hydrated components).

```astro
---
// server code only (no window/document here)
---

<button data-confetti-button>Celebrate</button>

<script>
  import confetti from "canvas-confetti";

  const buttons = document.querySelectorAll("[data-confetti-button]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => confetti());
  });
</script>
```

## Caveats

- Multiple `confetti()` calls reuse the same canvas/animation and may share the same in-flight promise.
- `confetti()` returns `Promise` when available, otherwise `null` in older environments without `Promise`.
- CDN usage exposes `window.confetti`; npm usage in Astro should prefer ESM import.

Sources:

- https://context7.com/api/v2/context?libraryId=/catdad/canvas-confetti
- https://context7.com/api/v2/context?libraryId=/withastro/docs
- https://docs.astro.build/en/guides/client-side-scripts/
- https://docs.astro.build/en/guides/troubleshooting/#document-or-window-is-not-defined
