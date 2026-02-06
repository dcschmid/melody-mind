---
source: Context7 API + Fathom Docs
library: Fathom Analytics
package: fathom-analytics
topic: consent loading, DNT, opt-out, GDPR positioning
fetched: 2026-02-06T00:00:00Z
official_docs: https://usefathom.com/docs/script/embed
---

## Recommended Fathom embed baseline

```html
<script src="https://cdn.usefathom.com/script.js" data-site="ABCDEFG" defer></script>
```

From Fathom docs, advanced flags relevant to privacy/compliance workflows:

- Honor DNT: `data-honor-dnt="true"`
- Disable automatic initial pageview: `data-auto="false"`
- SPA tracking mode (if needed): `data-spa="auto"`

```html
<script
  src="https://cdn.usefathom.com/script.js"
  data-site="ABCDEFG"
  data-honor-dnt="true"
  data-auto="false"
  defer
></script>
```

## Fathom guidance on cookies/consent

- Fathom states it does not use cookies in its embed script.
- Fathom states many customers may not require a consent banner for Fathom specifically, while also noting they do not provide legal advice.
- For Cookiebot environments, Fathom documents `data-cookieconsent="ignore"` to prevent Cookiebot from blocking the script.

```html
<script
  src="https://cdn.usefathom.com/script.js"
  data-site="ABCDEFG"
  data-cookieconsent="ignore"
  defer
></script>
```

## Opt-out / revoke-related API behavior

From "Exclude your own visits":

- `fathom.blockTrackingForMe();`
- `fathom.enableTrackingForMe();`

Fathom notes this preference is stored in browser `localStorage`.

## Source URLs

- https://usefathom.com/docs/script/embed
- https://usefathom.com/docs/script/script-advanced
- https://usefathom.com/docs/troubleshooting/cookies
- https://usefathom.com/docs/troubleshooting/cookiebot
- https://usefathom.com/docs/script/exclude-visits
- https://usefathom.com/docs/integrations/astro
