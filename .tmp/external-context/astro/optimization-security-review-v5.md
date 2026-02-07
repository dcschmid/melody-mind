---
source: Context7 API + Official Astro Docs + MDN
library: Astro
package: astro
topic: optimization and security review for Astro v5+ (scripts, images, content collections, interactive nav)
fetched: 2026-02-07T00:00:00Z
official_docs: https://docs.astro.build/en/
---

## 1) Client-side scripts in `.astro` and listener lifecycle

- Prefer processed `<script>` tags (no attributes except optional `src`) for TypeScript, bundling, dedupe, and module behavior.
- Any extra script attribute (or `is:inline`) disables Astro processing and dedupe; inline scripts can duplicate per component instance.
- Use `addEventListener` with scoped selectors and idempotent setup logic; do not assume script re-runs on each navigation.
- For components rendered multiple times, use `querySelectorAll` or custom elements (`connectedCallback`) to attach handlers per instance safely.
- If using `<ClientRouter />` view transitions: bundled module scripts execute once; re-run behavior must use lifecycle events (`astro:page-load`, `astro:after-swap`, etc.).
- Use `data-astro-rerun` only when you intentionally need inline script re-execution and your code is safe to run multiple times.

### Gotchas

- Adding any attribute to `<script>` implies unprocessed behavior (`is:inline` semantics).
- `define:vars` on `<script>` implies inline script (no bundling/dedupe).
- `DOMContentLoaded` handlers are often wrong with `<ClientRouter />`; prefer `astro:page-load`.

## 2) Image performance best practices (`astro:assets`, loading strategy)

- Prefer `<Image />` (or `<Picture />`) for local `src/` images to get optimization, width/height inference, lazy loading, async decoding, and CLS protection.
- For above-the-fold hero images, use `priority` (Astro v5.10+) to set `loading="eager"`, `decoding="sync"`, and `fetchpriority="high"`.
- Configure responsive images with `layout` (`constrained`, `full-width`, etc.) or `image.layout`; Astro auto-generates `srcset`/`sizes`.
- Keep images in `src/` when possible; files in `public/` are never optimized.
- Authorize remote optimization sources with `image.domains` / `image.remotePatterns` for safety and predictable behavior.
- For remote unknown dimensions, use `inferSize` (or `inferRemoteSize()`) to avoid missing width/height and layout shift.

### Gotchas

- Responsive image generation can increase build time (more variants).
- `public/` images require explicit width/height when using `<Image />`.
- On adapters without Sharp support, use passthrough service: no transformation, but still get authoring consistency and CLS safeguards.

## 3) Content collections and `getCollection()` usage/performance

- Use Astro v5 Content Layer API with `loader` in `src/content.config.ts` (`glob()` / `file()`), and define Zod schemas for type safety.
- `getCollection()` returns all entries unless filtered; always filter early (e.g., drafts, locale path) to reduce processing.
- Sort explicitly after query; return order is non-deterministic/platform-dependent.
- Use `getEntry()` / `getEntries()` for targeted fetches and references when full collection reads are unnecessary.
- For large sets (thousands+ entries), leverage content collections for caching/scalability rather than ad-hoc file globs/fetch logic.
- In static builds, route generation calls `getCollection()` in `getStaticPaths()`; minimize work there and avoid unnecessary per-entry heavy computation.

### Gotchas

- Collections are build-time content by default, not real-time data.
- Schema/frontmatter changes may require content sync or dev server restart.

## 4) Accessibility + security considerations for interactive nav menus

- For site navigation, prefer semantic `<nav>` + list of links; do not use ARIA `role="menu"` unless building true app-style menu widgets.
- If implementing a popup menu button, include `aria-expanded`, `aria-controls`, and keyboard handling (`Esc`, arrows, `Enter`/`Space`) with focus return.
- Ensure open/close state is reflected in attributes and focus order; avoid keyboard traps.
- With Astro view transitions, rebind menu listeners via lifecycle events (`astro:page-load`) if needed.
- Sanitize any user-controlled URL before calling `navigate()`; enforce allow-lists for redirect targets.
- Avoid unsafe HTML injection (`set:html`) for nav labels/content unless trusted and sanitized.

### Gotchas

- `set:html` is not escaped and can introduce XSS if fed unsanitized data.
- Astro experimental CSP (v5.9+) improves script/style hardening but has limits: inline scripts require hashes and `<ClientRouter />` is not supported.

## Source links used

- https://docs.astro.build/en/guides/client-side-scripts/
- https://docs.astro.build/en/guides/view-transitions/
- https://docs.astro.build/en/guides/images/
- https://docs.astro.build/en/reference/modules/astro-assets/
- https://docs.astro.build/en/guides/content-collections/
- https://docs.astro.build/en/reference/modules/astro-content/
- https://docs.astro.build/en/reference/directives-reference/
- https://docs.astro.build/en/reference/experimental-flags/csp/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menu_role
