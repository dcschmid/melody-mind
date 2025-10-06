# Render Deployment Enhancements

Plan to stabilise MelodyMind builds on Render by capping memory usage and reusing dependencies.

## Goals

- Capture peak memory and GC activity in build logs for observability.
- Reuse dependency builds (Sharp, Astro) across deploys via Render cache.
- Align Node.js version between local and Render to avoid import assertion warnings.
- Reduce repeated `sharp` installations that spike memory/duration.

## Action Steps

### 1. Capture Memory Metrics

- Update Render build command to: `/usr/bin/time -v yarn build:production`
  - If Render shell lacks `/usr/bin/time`, wrap via `command time -v ...`.
- Add fallback `NODE_OPTIONS="--trace-gc --max-old-space-size=8192"` in build script to log GC
  events.
- Verify logs show `Maximum resident set size` and GC stats after next deploy.

### 2. Enable Build Cache

- Create `render.yaml` (see snippet below) or configure via Render Dashboard.
- Include `build:   cache:     enabled: true` to persist `.cache`, `.astro`, or `node_modules` as
  permitted.
- Add `cacheDirs` for `.yarn/cache`, `node_modules`, `.astro` if available.
- Validate next deploy reuses cache (look for "Using cache" in logs).

### 3. Pin Node Version

- Add `.node-version` file and/or package.json `engines.node: "22.12.0"` to match Render.
- Alternatively, set Render environment variable `NODE_VERSION=22.12.0`.
- Re-run build locally with `nvm use 22.12.0` to ensure import assertions behave consistently.

### 4. Optimise Sharp Installation

- Move `sharp` to regular dependency and remove `yarn install:sharp` if binary is prebuilt.
- If Render still requires recompilation, add `SHARP_IGNORE_GLOBAL_LIBS=true` and preinstall via
  `yarn install --frozen-lockfile`.
- Consider optionalDependency pattern in `package.json` plus `yarn install --ignore-optional=false`
  to avoid repeated `yarn add`.
- Track memory/time of Sharp step before/after changes.

### 5. Document & Monitor

- Update `docs/modernization-plan.md` with outcomes (memory figures, cache hits, Node alignment).
- If memory remains >8GB after cache, consider reducing locales per build or splitting content sync.
- Schedule periodic review (monthly) to ensure Render deployments stay within limits.

## Example `render.yaml`

```yaml
services:
  - type: web
    name: melody-mind
    runtime: node
    buildCommand: "/usr/bin/time -v yarn build:production"
    startCommand: "yarn start:production"
    envVars:
      - key: NODE_VERSION
        value: "22.12.0"
    build:
      cache:
        enabled: true
        cacheDirs:
          - .yarn/cache
          - node_modules
          - .astro
```

## Open Questions

- Does Render support `/usr/bin/time` directly? If not, choose alternative logging.
- Which directories are safe to cache without bloating storage (Render limits apply)?
- After Node pinning, does `astro.config.mjs` still throw import assertion warning?
