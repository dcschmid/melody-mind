---
source: Official Astro Docs
library: Astro
package: astro
topic: v6 Migration Guide - Breaking Changes from Astro 5 to 6
fetched: 2026-03-17T12:00:00Z
official_docs: https://docs.astro.build/en/guides/upgrade-to/v6/
---

# Astro v6 Migration Guide: Breaking Changes from Astro 5 to Astro 6

## Quick Upgrade Command

```bash
# npm
npx @astrojs/upgrade

# pnpm
pnpm dlx @astrojs/upgrade

# yarn
yarn dlx @astrojs/upgrade
```

---

## 1. Node.js Version Requirements

### ⚠️ BREAKING: Node 22 Required

**Astro v6.0 drops Node 18 and Node 20 support entirely.**

- **Minimum required**: Node `22.12.0` or higher
- Node 18 reached End of Life in March 2025
- Node 20 scheduled for End of Life in April 2026

### What to do:

```bash
# Check your local version
node -v

# Create .nvmrc file
echo "22.12.0" > .nvmrc
```

Update your deployment environment to support Node 22.

---

## 2. Content Collections Changes

### ⚠️ REMOVED: Legacy Content Collections

**The automatic legacy content collections support from Astro 5 is removed.**

All content collections must now use the **Content Layer API** introduced in Astro v5.0.

### Temporary Migration Helper

If you can't update immediately, enable the backwards compatibility flag:

```javascript
// astro.config.mjs
export default defineConfig({
  legacy: {
    collectionsBackwardsCompat: true,
  },
});
```

This flag preserves:

- `type: 'content'` and `type: 'data'` without loaders
- Legacy entry API: `entry.slug` and `entry.render()`
- Path-based entry IDs instead of slug-based IDs

> ⚠️ **This is temporary** - migrate to Content Layer API ASAP, then disable this flag.

### Migration: config.ts → content.config.ts

**Old (Astro 4/v5 legacy):**

```javascript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

export const collections = { blog };
```

**New (Astro 5/6 Content Layer API):**

```javascript
// src/content.config.ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

export const collections = { blog };
```

### Zod Import Change

**Deprecated:**

```javascript
import { defineCollection, z } from "astro:content";
import { z } from "astro:schema";
```

**New:**

```javascript
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
```

### Zod 4 Migration

Astro v6 uses Zod 4. Key changes:

**String formats moved to top-level:**

```javascript
// Old (Zod 3)
email: z.string().email(),
url: z.string().url(),

// New (Zod 4)
email: z.email(),
url: z.url(),
```

**Error messages changed:**

```javascript
// Old (Zod 3)
z.string().min(5, { message: "Too short." });

// New (Zod 4)
z.string().min(5, { error: "Too short." });
```

**Default values with transforms:**

```javascript
// Old (Zod 3): default matched input type
views: z.string().transform(Number).default("0"),

// New (Zod 4): default must match output type
views: z.string().transform(Number).default(0),

// Or use prefault() for old behavior
views: z.string().transform(Number).prefault("0"),
```

### Loader API Changes

**New `createSchema()` method (Astro 6):**

```javascript
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

export function myLoader(options) {
  return {
    name: "my-loader",
    load: async ({ store, parseData }) => {
      // ... load data
    },
    // New in Astro 6: dynamically generate schema
    createSchema: async () => {
      const schema = await getSchema();
      const types = await getTypes();
      return {
        schema,
        types: `export type Entry = ${types}`,
      };
    },
  } satisfies Loader;
}
```

### Schema Types Inference Change

**Breaking:** Schema types are now **inferred** instead of generated.

This affects the Content Loader API - types are computed at build time rather than pre-generated.

---

## 3. astro.config.mjs Changes

### REMOVED: CommonJS Config Files

**Support for CommonJS config files (`astro.config.cjs`) is removed.**

**Migration:**

```javascript
// Rename astro.config.cjs → astro.config.mjs
// Update syntax:
module.exports = {}; // Old
export default defineConfig({}); // New
```

### Session Driver Configuration

**Deprecated string signature:**

```javascript
// Old
export default defineConfig({
  session: {
    driver: "redis",
    options: {
      url: process.env.REDIS_URL,
    },
  },
});
```

**New object signature:**

```javascript
import { defineConfig, sessionDrivers } from "astro/config";

export default defineConfig({
  session: {
    driver: sessionDrivers.redis({
      url: process.env.REDIS_URL,
    }),
    cookie: { secure: true },
    ttl: 3600,
  },
});
```

---

## 4. i18n Configuration Changes

### Changed Default: `redirectToDefaultLocale`

**The default value of `i18n.routing.redirectToDefaultLocale` changed.**

Check your i18n configuration for any routing behavior changes after upgrading.

---

## 5. Integration Changes

### Vite 7.0 Upgrade

Astro v6 uses Vite v7.0. Check the [Vite migration guide](https://vite.dev/guide/migration) for plugin compatibility.

**Note:** Using `getViteConfig()` requires at least Vitest v3.2 or v4.1 beta 5.

### Official Adapters Updated

All official adapters have new major versions:

| Adapter               | Notes                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `@astrojs/cloudflare` | **Significant changes** - see [upgrade guide](https://docs.astro.build/en/guides/integrations-guide/cloudflare/#upgrading-to-v13-and-astro-6) |
| `@astrojs/netlify`    | Updated for Vite 7                                                                                                                            |
| `@astrojs/node`       | Updated for Vite 7                                                                                                                            |
| `@astrojs/vercel`     | Updated for Vite 7                                                                                                                            |

### Shiki 4.0

Syntax highlighting upgraded to Shiki v4.0. Check [Shiki migration guide](https://shiki.style/blog/v4) if using Shiki-specific APIs.

---

## 6. Deprecated Features

| Feature                         | Migration                                                 |
| ------------------------------- | --------------------------------------------------------- |
| `Astro` in `getStaticPaths()`   | Use `import.meta.env.SITE` instead of `Astro.site`        |
| `import.meta.env.ASSETS_PREFIX` | Use `build.assetsPrefix` from `astro:config/server`       |
| `astro:schema`                  | Use `astro/zod`                                           |
| `z` from `astro:content`        | Import from `astro/zod` separately                        |
| `astro:transitions` internals   | Use string literals like `'astro:before-preparation'`     |
| Session driver string signature | Use `sessionDrivers` object                               |
| `NodeApp` from `astro/app/node` | Use `createApp()` + `createRequest()` + `writeResponse()` |
| `loadManifest()`, `loadApp()`   | Use `createApp()`                                         |
| `createExports()`, `start()`    | Use `entrypointResolution: "auto"` in `setAdapter()`      |

### `Astro` in `getStaticPaths()` Migration

```javascript
// Old
export async function getStaticPaths() {
  console.log(Astro.generator);
  return getPages(Astro.site);
}

// New
export async function getStaticPaths() {
  // Remove Astro.generator
  return getPages(import.meta.env.SITE);
}
```

### Assets Prefix Migration

```javascript
// Old
import { someLogic } from "./utils";
someLogic(import.meta.env.ASSETS_PREFIX);

// New
import { build } from "astro:config/server";
someLogic(build.assetsPrefix);
```

### View Transitions Internals Migration

```javascript
// Old
import {
  isTransitionBeforePreparationEvent,
  TRANSITION_AFTER_SWAP,
} from "astro:transitions/client";

console.log(isTransitionBeforePreparationEvent(event));
console.log(TRANSITION_AFTER_SWAP);

// New
console.log(event.type === "astro:before-preparation");
console.log("astro:after-swap");
```

---

## 7. Removed Features

| Feature                                    | Status                                   |
| ------------------------------------------ | ---------------------------------------- |
| Legacy content collections                 | **REMOVED** - must use Content Layer API |
| `<ViewTransitions />` component            | **REMOVED** - use `<ClientRouter />`     |
| `emitESMImage()`                           | **REMOVED**                              |
| `Astro.glob()`                             | **REMOVED** - use `import.meta.glob()`   |
| `astro:actions` internals                  | **REMOVED**                              |
| Percent-encoding in routes (`%25`)         | **REMOVED**                              |
| `astro:ssr-manifest` virtual module        | **REMOVED**                              |
| `RouteData.generate()`                     | **REMOVED**                              |
| `routes` on `astro:build:done` hook        | **REMOVED**                              |
| `entryPoints` on `astro:build:ssr` hook    | **REMOVED**                              |
| Old `app.render()` signature               | **REMOVED**                              |
| `app.setManifestData()`                    | **REMOVED**                              |
| `handleForms` prop for `<ClientRouter />`  | **REMOVED**                              |
| `prefetch()` with option                   | **REMOVED**                              |
| `rewrite()` from Actions context           | **REMOVED**                              |
| Schema function signature (Content Loader) | **REMOVED**                              |
| Session test driver                        | **REMOVED**                              |
| CommonJS config files                      | **REMOVED**                              |

### Astro.glob() Migration

```javascript
// Old
const posts = await Astro.glob("../blog/*.md");

// New
const posts = await import.meta.glob("../blog/*.md", { eager: true });
```

---

## 8. Breaking Changes (Behavior Changes)

### Endpoints with File Extension

Endpoints with a file extension can no longer be accessed with a trailing slash.

### import.meta.env Values

All `import.meta.env` values are now **always inlined** (not runtime-accessible).

### Image Service Changes

1. **Cropping by default** - Default image service now crops by default
2. **Never upscale** - Images are never upscaled in default image service
3. **SVG rasterization** - Changed behavior
4. **getImage() throws on client** - Calling `getImage()` on the client now throws an error

### Markdown Heading IDs

Heading ID generation has changed. May affect anchor links.

### getStaticPaths() Params

**Cannot return params of type `number`:**

```javascript
// Old - this worked
return [{ params: { id: 123 } }];

// New - must be string
return [{ params: { id: "123" } }];
```

### Script/Style Rendering Order

`<script>` and `<style>` tags are now rendered **in the order they are defined** in the component.

### Responsive Image Styles

How responsive image styles are emitted has changed.

---

## 9. Adapter API Changes

For adapter maintainers:

### SSRManifest Interface

The `SSRManifest` interface structure has changed.

### Integration Hooks & HMR

Integration hooks and HMR access patterns have changed.

### NodeApp Migration

```javascript
// Old
import { NodeApp } from "astro/app/node";
const app = new NodeApp(manifest);
const response = await app.render(req);
await NodeApp.writeResponse(response, res);

// New
import { createApp } from "astro/app/entrypoint";
import { createRequest, writeResponse } from "astro/app/node";

const app = createApp();
const request = createRequest(req);
const response = await app.render(request);
await writeResponse(response, res);
```

### New Adapter Entry Point

```javascript
// Old
export function getEntry() {
  return new URL('./server.js', import.meta.url);
}
export function createExports(manifest) {
  const app = new NodeApp(manifest);
  return { handler: (req, res) => app.render(req) };
}

// New
export default function (options) {
  return {
    name: 'my-adapter',
    setAdapter({ serverEntry, tryToResolve: true }) {
      // ...
    },
  };
}
```

---

## 10. Experimental Flags Removed

The following experimental flags have been removed (features are now stable or removed):

- Check your `astro.config.mjs` for any `experimental:` flags
- Remove flags that are no longer needed

---

## Migration Checklist

- [ ] Update to Node.js 22.12.0+
- [ ] Run `npx @astrojs/upgrade`
- [ ] Migrate content collections to Content Layer API (or enable `legacy.collectionsBackwardsCompat`)
- [ ] Update Zod imports to `astro/zod`
- [ ] Update Zod schemas for Zod 4
- [ ] Rename `astro.config.cjs` to `astro.config.mjs` if needed
- [ ] Update session driver configuration
- [ ] Check i18n routing behavior
- [ ] Update adapter if using SSR
- [ ] Replace `Astro.glob()` with `import.meta.glob()`
- [ ] Replace `<ViewTransitions />` with `<ClientRouter />`
- [ ] Update `getStaticPaths()` params to strings
- [ ] Check image service behavior changes
- [ ] Remove deprecated imports and APIs

---

## Resources

- [Official Astro v6 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Zod 4 Changelog](https://zod.dev/v4/changelog)
- [Vite 7 Migration Guide](https://vite.dev/guide/migration)
- [Shiki 4 Migration Guide](https://shiki.style/blog/v4)
- [Content Loader API Reference](https://docs.astro.build/en/reference/content-loader-reference/)
- [Legacy Flags Reference](https://docs.astro.build/en/reference/legacy-flags/)
