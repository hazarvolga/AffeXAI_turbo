# ARCHITECTURE.md — affexaiFactory High-Level Architecture

## Overview

affexaiFactory is a **Solo Founder Engineering OS** — a monorepo that serves as a software factory. It is NOT a SaaS product. It generates, scaffolds, and operates multiple SaaS products, internal tools, and AI agent workflows.

## Repository Structure

```
affexaiFactory/
├── apps/                    # Runnable products
│   ├── _starter-nest/       # Reference NestJS app (Layer 1)
│   ├── _starter-next/       # Reference Next.js app (Layer 1)
│   └── <product>/           # Generated products
├── packages/                # Reusable npm packages (@affex/*)
│   ├── *-core/              # Core packages (Layer 1)
│   ├── ui-kit/              # UI component library (Layer 1)
│   ├── design-tokens/       # Design system (Layer 1)
│   ├── shared-config/        # Config presets (Layer 1)
│   ├── shared-types/         # Zod + TS types (Layer 1)
│   ├── testing-utils/        # Test helpers (Layer 1)
│   ├── billing-core/        # (Layer 2)
│   ├── notification-core/   # (Layer 2)
│   └── feature-flags/       # (Layer 2)
├── templates/               # Project scaffolding (Layer 2)
├── ai/                      # AI engineering surface
│   ├── agents/              # Agent configs
│   ├── prompts/             # Prompt library
│   ├── workflows/           # LangGraph workflows
│   ├── tests/               # Promptfoo configs
│   ├── memory/              # Agent memory
│   └── observability/       # Langfuse config
├── standards/               # Source of truth docs
├── tools/                   # CLI tools
│   └── create-app/          # `pnpm create @affex/app` (Layer 1)
├── infra/                   # Infrastructure-as-code
│   ├── compose/             # Docker Compose (Layer 1)
│   └── scripts/             # Backup, restore, etc.
└── docs/                    # Engineering docs
```

## Architecture Decisions

### Monorepo Strategy (ADR-0001)

- **Workspace manager:** pnpm 9 + workspaces
- **Build orchestrator:** Turborepo (remote cache, topological builds)
- **Linter/Formatter:** Biome (replaces ESLint + Prettier)
- **Versioning:** Changesets (PR-based, automatic bump+publish)
- **Internal scope:** `@affex/*`
- **Private registry:** Verdaccio (self-hosted via Coolify)

### Package Boundary Rules

Enforced by dependency graph validation in CI:

```
apps/* → packages/*          ✅ ALLOWED
packages/* → packages/*      ✅ ALLOWED (declared deps only)
packages/* → apps/*          ❌ FORBIDDEN
*-core → other *-core       ❌ FORBIDDEN
```

Core packages (`*-core`) are independent building blocks. Composition happens in `apps/*`.

### Data Flow

```
End User → Next.js (apps/*-next) → API → NestJS (apps/*-nest)
                                           ↓
                                    @affex/*-core packages
                                           ↓
                                    PostgreSQL / Redis / LLM
```

### AI Agent Integration

```
Developer → Claude Code / Aider / OpenHands
                  ↓
           standards/AGENTS.md (rules)
                  ↓
           @affex/ai-core (LLM calls)
                  ↓
           Langfuse (trace + cost)
```

## Layer System

| Layer | Status | Meaning |
|-------|--------|---------|
| ACTIVE_NOW | Layer 1 | Fully implemented, repo must build cleanly |
| OPTIONAL_LATER | Layer 2 | Folder exists, package.json placeholder, no real code |
| SCALE_STAGE | Layer 3 | Infrastructure for when team grows |
| EXPERIMENTAL | Lab | Proof of concept, not production-ready |

### Layer 1 — ACTIVE_NOW (Must Build Cleanly)

- Root config (package.json, turbo.json, biome.json, tsconfig.base.json)
- packages/shared-config, shared-types, design-tokens
- packages/db-core, auth-core, ai-core, queue-core, observability-core
- packages/ui-kit, testing-utils
- apps/_starter-nest, apps/_starter-next
- tools/create-app
- standards/*, CLAUDE.md
- .github/workflows/ci.yml
- infra/compose/docker-compose.dev.yml
- ai/agents/* config files

### Layer 2 — OPTIONAL_LATER

- packages/billing-core, notification-core, feature-flags
- apps/admin-panel, apps/docs-site
- ai/prompts, ai/tests, ai/observability
- templates/* (all)
- tools/migrate-repo, tools/doctor
- .github/workflows/release.yml, deploy-coolify.yml

### Layer 3 — SCALE_STAGE

- OpenTelemetry full integration
- ai-review.yml CI
- nightly.yml CI
- tools/codemod
- ai/memory
- ai/agents/openhands
- Verdaccio registry
- Turbo Remote Cache

## Key Design Principles

1. **Write once, use everywhere** — Shared packages eliminate duplication
2. **AI-first development** — Agents read AGENTS.md and follow RULES.md
3. **Composition over configuration** — Core packages are independent; apps compose them
4. **Convention over decision** — STACK.md eliminates "which library?" debates
5. **Ship fast, scale later** — Layer system ensures clean baseline