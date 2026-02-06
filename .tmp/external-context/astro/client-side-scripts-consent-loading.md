---
source: Context7 API + Astro Docs
library: Astro
package: astro
topic: client-side scripts for consent-gated analytics
fetched: 2026-02-06T00:00:00Z
official_docs: https://docs.astro.build/en/guides/client-side-scripts/
---

## Relevant Astro patterns for consent-based analytics loading

From `Scripts and event handling` and directives reference:

- Astro processes `<script>` tags by default when they have no attributes (or only `src`): TypeScript support, bundling, deduplication, and module behavior.
- Astro does **not** process scripts with additional attributes; `is:inline` leaves script content unchanged and renders exactly where authored.
- External scripts (e.g. analytics CDN) should use `is:inline src="..."` if you want raw HTML-script behavior.
- If a component containing an inline script is rendered multiple times, inline scripts are duplicated; put consent loader code in a shared layout/head to avoid duplicates.

### Source excerpts

```astro
<!-- Astro processed local script -->
<script src="../scripts/local.js"></script>

<!-- External script / CDN -->
<script is:inline src="https://my-analytics.com/script.js"></script>
```

```astro
<script is:inline>
  // Rendered exactly as written, no Astro transforms
</script>
```

## Implications for GDPR-style consent gating

- Keep analytics script injection in a single layout-level script block (usually before `</head>`).
- Use a client-side script to read consent state (`localStorage`) and only then append the analytics `<script>` element.
- For Astro View Transitions (SPA-like navigation), combine with analytics SPA mode if provider supports it.

## Source URLs

- https://docs.astro.build/en/guides/client-side-scripts/
- https://docs.astro.build/en/reference/directives-reference/#isinline
- https://context7.com/withastro/docs
