# MelodyMind

MelodyMind contains two privacy-conscious Astro sites: the Music archive and a
research-led music history quiz.

## Workspace

- `apps/music`: the public MelodyMind Music app served at `https://melody-mind.de`
- `apps/quiz`: the MelodyMind Quiz app served at `https://quiz.melody-mind.de`

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
pnpm dev:music
pnpm dev:quiz
pnpm build
pnpm build:quiz
pnpm build:all
pnpm preview
pnpm lint
pnpm lint:check
pnpm format
pnpm format:check
pnpm clean
```

`pnpm dev` starts both apps in parallel:

- Music: `http://localhost:4321`
- Quiz: `http://localhost:4322`

The app-specific development commands start only their respective app. Build, preview,
lint, and format commands continue to target Music by default unless their name includes
`:quiz` or `:all`.

## Repository Layout

```text
.
├── apps/
│   ├── music/
│   └── quiz/
├── AGENTS.md
├── eslint.config.mjs
├── stylelint.config.cjs
├── turbo.json
└── package.json
```

## Validation

Use the app-specific quality gates:

```bash
pnpm format:check
pnpm lint:check
pnpm build
pnpm --filter quiz test
pnpm format:check:quiz
pnpm lint:check:quiz
pnpm build:quiz
```
