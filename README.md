# affexaiFactory

Solo Founder Engineering OS — AI-first monorepo factory.

Write once, use everywhere. This repo is your software factory: scaffold new projects, reuse shared packages, and let AI agents work within your standards.

## Prerequisites

- **Node.js** 22+ (use `.nvmrc`: `nvm use`)
- **pnpm** 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker** (for local Postgres, Redis, MinIO, Langfuse)
- **Git** 2.40+

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/hazarvolga/AffeXAI_turbo.git
cd AffeXAI_turbo

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your values (JWT_SECRET, API keys, etc.)

# 4. Start infrastructure (Postgres, Redis, MinIO, Langfuse)
docker compose -f infra/compose/docker-compose.dev.yml up -d

# 5. Generate Prisma client
cd packages/db-core && npx prisma generate && cd ../..

# 6. Build all packages and apps
pnpm build

# 7. Run tests
pnpm test

# 8. Start development servers
pnpm dev
```

After step 8, you'll have:
- NestJS API at `http://localhost:3001`
- Next.js UI at `http://localhost:3000`
- Langfuse at `http://localhost:3100`
- MinIO Console at `http://localhost:9001`

## Create New App

```bash
# Interactive mode
pnpm create @affex/app

# Or use the generator directly
cd tools/create-app && pnpm dev
```

## Project Structure

```
affexaiFactory/
├── apps/                    # Runnable products
│   ├── _starter-nest/      # Reference NestJS app (Layer 1)
│   ├── _starter-next/      # Reference Next.js app (Layer 1)
│   └── <product>/          # Your apps go here
├── packages/               # Reusable npm packages (@affex/*)
│   ├── *-core/             # Core packages (auth, db, ai, queue, observability)
│   ├── shared-config/      # Config presets (tsconfig, biome, vitest)
│   ├── shared-types/       # Zod schemas + TS types
│   ├── design-tokens/      # Tailwind preset + CSS variables
│   ├── ui-kit/             # React component library
│   └── testing-utils/      # Vitest + MSW helpers
├── ai/                     # AI agents, prompts, workflows
├── standards/              # RULES.md, AGENTS.md, STACK.md, DESIGN.md
├── tools/                  # CLI tools (create-app, migrate-repo, doctor)
├── templates/              # Project scaffolding templates
├── infra/                  # Docker Compose, scripts, Coolify configs
└── docs/                   # Engineering docs
```

## Layer Status

| Layer | Status | Description |
|-------|--------|-------------|
| Layer 1 | ACTIVE_NOW | Core packages + starter apps + CI + generator |
| Layer 2 | OPTIONAL_LATER | Billing, notifications, feature-flags, admin-panel, docs-site |
| Layer 3 | SCALE_STAGE | OTel, AI review CI, codemods, remote cache, onboarding |

## Commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages and apps (Turborepo cached) |
| `pnpm dev` | Start all apps in dev mode |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages (Biome) |
| `pnpm typecheck` | Type check all packages |
| `pnpm check` | Biome format + lint fix (--write) |
| `pnpm clean` | Clean all dist folders + node_modules |

## Package Boundaries

```
apps/* → packages/*          ✅ ALLOWED
packages/* → packages/*      ✅ ALLOWED (declared deps only)
packages/* → apps/*          ❌ FORBIDDEN (CI will fail)
*-core → other *-core       ❌ FORBIDDEN (compose in apps)
```

## Infrastructure

Start local services:

```bash
docker compose -f infra/compose/docker-compose.dev.yml up -d
```

This starts:
- **PostgreSQL 16** on port 5432 (user: affex, password: affex, db: affex)
- **Redis 7** on port 6379
- **MinIO** on port 9000 (console: 9001, user: minioadmin, password: minioadmin)
- **Langfuse** on port 3100

Stop all services:

```bash
docker compose -f infra/compose/docker-compose.dev.yml down
```

## Standards

| File | Purpose |
|------|---------|
| [RULES.md](standards/RULES.md) | Coding standards, commit convention, branch policy |
| [AGENTS.md](standards/AGENTS.md) | AI agent behavior rules (Claude, Aider, OpenHands) |
| [STACK.md](standards/STACK.md) | Approved technology matrix + forbidden tech |
| [DESIGN.md](standards/DESIGN.md) | Design language, colors, typography, spacing |
| [ARCHITECTURE.md](standards/ARCHITECTURE.md) | High-level architecture + layer system |
| [ADR-0001](standards/adr/0001-monorepo-tooling.md) | Why pnpm + Turborepo + Biome |

## AI Agent Setup

### Aider

```bash
pip install aider-chat
aider --config ai/agents/aider/.aider.conf.yml
```

### Claude Code

Reads `CLAUDE.md` and `standards/AGENTS.md` automatically.

### Langfuse

Access at `http://localhost:3100` after starting Docker Compose. All LLM calls via `@affex/ai-core` are traced automatically.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `pnpm install` fails | Make sure you're using Node 22+ (`nvm use`) and pnpm 9+ |
| `prisma generate` fails | Run it inside `packages/db-core` directory |
| Docker Compose fails | Make sure Docker is running and ports 5432, 6379, 9000, 3100 are free |
| Build fails after pull | Run `pnpm clean && pnpm install && pnpm build` |
| Lint errors | Run `pnpm check` to auto-fix |