---
source: MDN Web Docs
library: Web Platform APIs
package: web-platform
topic: localStorage state and revoke-consent mechanics
fetched: 2026-02-06T00:00:00Z
official_docs: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
---

## Storage behavior relevant to consent UX

- `window.localStorage` persists across browser sessions.
- `Storage.removeItem(key)` removes a stored key and is a no-op if missing.

```js
localStorage.setItem("analytics-consent", "granted");
const value = localStorage.getItem("analytics-consent");
localStorage.removeItem("analytics-consent");
```

## DNT signal caveat

From MDN:

- `navigator.doNotTrack` is deprecated/non-standard.
- It can still return `"1"`, `"0"`, or `null` in some browsers.
- If used, treat it as a best-effort extra signal, not a sole compliance control.

```js
const dntEnabled = navigator.doNotTrack === "1";
```

## Source URLs

- https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack
