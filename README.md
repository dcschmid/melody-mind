# MelodyMind

MelodyMind contains four privacy-conscious Astro sites for listening, music history,
long-form journalism, and criticism.

## Workspace

- `apps/music`: the public MelodyMind Music app served at `https://melody-mind.de`
- `apps/quiz`: the MelodyMind Quiz app served at `https://quiz.melody-mind.de`
- `apps/stories`: sourced long-form journalism at `https://stories.melody-mind.de`
- `apps/reviews`: score-free album criticism at `https://reviews.melody-mind.de`

## Stack

- Astro 7 with static output
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
pnpm dev:stories
pnpm dev:reviews
pnpm build
pnpm build:quiz
pnpm build:stories
pnpm build:reviews
pnpm build:all
pnpm preview
pnpm lint
pnpm lint:check
pnpm format
pnpm format:check
pnpm clean
```

`pnpm dev` starts the workspace apps in parallel.

The app-specific development commands start only their respective app. Build, preview,
lint, and format commands continue to target Music by default unless their name includes
`:quiz`, `:stories`, `:reviews`, or `:all`.

## Repository Layout

```text
.
├── apps/
│   ├── music/
│   ├── quiz/
│   ├── stories/
│   └── reviews/
├── AGENTS.md
├── eslint.config.mjs
├── stylelint.config.cjs
├── turbo.json
└── package.json
```

## Validation

Use the workspace-wide quality gates:

```bash
pnpm format:check:all
pnpm lint:check:all
pnpm check
pnpm test
```

App-specific gates also exist, for example `pnpm lint:check:quiz`,
`pnpm format:check:stories`, `pnpm build:reviews`, and
`pnpm --filter quiz test`.
