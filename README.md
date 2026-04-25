# affexaiFactory

Solo Founder Engineering OS — AI-first monorepo factory.

## Quick Start

```bash
pnpm install
pnpm build
```

## Create New App

```bash
pnpm create @affex/app
```

## Architecture

See [standards/ARCHITECTURE.md](standards/ARCHITECTURE.md)

## Layer Status

| Layer | Status | Description |
|-------|--------|-------------|
| Layer 1 | ACTIVE_NOW | Core packages + starter apps + CI |
| Layer 2 | OPTIONAL_LATER | Billing, notifications, templates, migration tool |
| Layer 3 | SCALE_STAGE | OTel, AI review CI, codemods, remote cache |

## Commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages and apps |
| `pnpm dev` | Start all apps in dev mode |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type check all packages |
| `pnpm check` | Biome format + lint fix |

## Standards

- [RULES.md](standards/RULES.md) — Coding standards, commit convention, branch policy
- [AGENTS.md](standards/AGENTS.md) — AI agent behavior rules
- [STACK.md](standards/STACK.md) — Approved technology matrix
- [DESIGN.md](standards/DESIGN.md) — Design language and tokens
- [ARCHITECTURE.md](standards/ARCHITECTURE.md) — High-level architecture decisions