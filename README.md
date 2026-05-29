# MelodyMind

MelodyMind is now focused on the Music app: an Astro-based static site for
AI-generated music albums.

## Workspace

- `apps/music`: the public MelodyMind Music app served at `https://melody-mind.de`

## Stack

- Astro 6 with static output
- TypeScript
- pnpm workspaces
- Turbo for task orchestration
- Scoped Astro component CSS with BEM naming

## Requirements

- Node.js `>=22.12.0`
- pnpm `10.33.0`

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm lint:check
pnpm format
pnpm format:check
pnpm clean
```

The root commands target the Music app by default.

## Repository Layout

```text
.
├── apps/
│   └── music/
├── AGENTS.md
├── eslint.config.mjs
├── stylelint.config.cjs
├── turbo.json
└── package.json
```

## Validation

There is no conventional automated test suite. Use the Music app quality gates:

```bash
pnpm format:check
pnpm lint:check
pnpm build
```
