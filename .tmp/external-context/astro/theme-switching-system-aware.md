---
source: Official Astro Docs (fallback)
library: Astro
package: astro
topic: system-aware theme switching with localStorage and early script execution
fetched: 2026-02-06T00:00:00Z
official_docs: https://docs.astro.build/en/guides/client-side-scripts/
---

## Astro-specific script behavior you need for theme switching

From Astro docs:

- Processed `<script>` tags (no attributes except optional `src`) are bundled, deduplicated, and may be inlined if small.
- If a `<script>` has attributes (or `is:inline`), Astro does **not** process/bundle/deduplicate it, and it renders exactly where authored.
- `is:inline` is appropriate for tiny bootstrap scripts that must run as early as possible to avoid incorrect initial theme paint.

References:

- https://docs.astro.build/en/guides/client-side-scripts/
- https://docs.astro.build/en/reference/directives-reference/#isinline

## System-aware theme preference pattern (Astro tutorial baseline)

Astro tutorial provides this baseline logic in a component script:

1. Read `localStorage.getItem("theme")`.
2. If value is `"dark"` or `"light"`, use it.
3. Otherwise use `window.matchMedia("(prefers-color-scheme: dark)")`.
4. Apply theme class to document root.
5. Persist resolved theme to `localStorage`.
6. On toggle click, switch class and update storage.

Reference:

- https://docs.astro.build/en/tutorial/6-islands/2/

## Best-practice implementation details for `data-theme`

The tutorial uses an `html.dark` class. If your codebase prefers `data-theme`, use equivalent behavior:

- Set `document.documentElement.dataset.theme = "dark" | "light"`.
- Keep CSS keyed by `:root[data-theme="dark"]` and `:root[data-theme="light"]`.
- Keep a `color-scheme` declaration aligned with active theme to improve form/control rendering:

```css
:root[data-theme="light"] {
  color-scheme: light;
}
:root[data-theme="dark"] {
  color-scheme: dark;
}
```

## Avoiding flash of incorrect theme (FOUC/FART) in Astro

Recommended Astro placement:

- Put a tiny bootstrap `<script is:inline>` in the shared layout `<head>` so it runs before visible body content.
- Keep this script dependency-free (no imports), because `is:inline` scripts are not bundled.
- Separate concerns:
  - Early head script: resolve/apply initial theme before paint.
  - Later component script (processed or inline): wire toggle UI and persistence updates.

Example bootstrap (for `data-theme`):

```html
<script is:inline>
  (() => {
    const key = "theme";
    const stored = localStorage.getItem(key);
    const valid = stored === "dark" || stored === "light";
    const resolved = valid
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    document.documentElement.setAttribute("data-theme", resolved);
    localStorage.setItem(key, resolved);
  })();
</script>
```

## Astro layout/component guidance

- Put one global bootstrap script in your top-level layout to avoid duplicated inline scripts.
- Avoid placing inline bootstrap logic in a reusable leaf component that may render multiple times.
- If using Astro View Transitions, ensure your theme toggle listener setup is resilient to page swaps (re-bind as needed), while root `data-theme` state remains the source of truth.

Relevant docs:

- https://docs.astro.build/en/basics/layouts/
- https://docs.astro.build/en/guides/client-side-scripts/
- https://docs.astro.build/en/reference/directives-reference/#isinline
