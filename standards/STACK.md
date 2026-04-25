# STACK.md — Approved Technology Matrix

Every technology choice in this repository must be listed here. Adding a new technology requires an ADR (Architecture Decision Record) in `standards/adr/`.

## Runtime & Language

| Category | Choice | Version | Why |
|----------|--------|---------|-----|
| Runtime | Node.js | 22 LTS | Native fetch, perf, long-term support |
| Language | TypeScript | 5.7+ | Strict mode, NodeNext modules |
| Package Manager | pnpm | 9.x | Fast, disk-efficient, strict hoisting |
| Build Orchestrator | Turborepo | 2.x | Remote cache, topological builds |

## Backend

| Category | Choice | Why |
|----------|-------|-----|
| Framework | NestJS | Modular, DI, decorators, enterprise-grade |
| ORM | Prisma | Type-safe, migration-first, excellent DX |
| Database | PostgreSQL 16 | Reliable, feature-rich, JSON support |
| Queue | BullMQ | Redis-backed, typed jobs, DLQ support |
| Cache | Redis 7 | Session, cache, BullMQ backend |
| Validation | Zod | Runtime + compile-time, inferred types |
| Auth | JWT + OAuth | Stateless, multi-provider |
| Logging | pino | Fastest Node.js logger, structured JSON |
| API Style | REST + tRPC | REST for public, tRPC for internal |

## Frontend

| Category | Choice | Why |
|----------|-------|-----|
| Framework | Next.js 14 (App Router) | SSR, RSC, file-based routing |
| UI Library | shadcn/ui | Copy-paste, customizable, accessible |
| Styling | Tailwind CSS 3 | Utility-first, design tokens |
| State | React Server Components + SWR | Minimal client state |
| Form | React Hook Form + Zod | Type-safe validation |
| Table | TanStack Table | Headless, virtualized |

## AI & Agents

| Category | Choice | Why |
|----------|-------|-----|
| LLM Client | OpenAI + Anthropic SDKs | Multi-provider, direct control |
| Agent Framework | LangGraph | Stateful agents, production workflows |
| Observability | Langfuse (self-hosted) | Trace, cost, latency tracking |
| Prompt Testing | Promptfoo | Regression suite, CI integration |
| Code Agent | Aider | In-terminal pair programming |
| Code Agent | OpenHands | Autonomous multi-step executor |
| Code Agent | Claude Code | Default coding agent (this CLI) |
| Code Graph | Graphify | Codebase indexing for AI context |

## DevOps & Infra

| Category | Choice | Why |
|----------|-------|-----|
| Container | Docker | Industry standard |
| Deploy | Coolify | Self-hosted PaaS, Git-based deploy |
| CI | GitHub Actions | Native, free for solo |
| Registry | Verdaccio (self-hosted) | Private @affex/* npm packages |
| Secrets | 1Password CLI + OIDC | No .env files in repo |
| Monitoring | Uptime Kuma | Self-hosted uptime checks |
| Analytics | Plausible (self-hosted) | Privacy-first, no cookies |
| Error Tracking | GlitchTip | Self-hosted Sentry-compatible |
| Object Storage | MinIO | S3-compatible, self-hosted |

## Quality & Standards

| Category | Choice | Why |
|----------|-------|-----|
| Linting | Biome | Single tool, 10-20x faster than ESLint |
| Testing | Vitest | Fast, ESM-native, Turborepo compatible |
| E2E | Playwright | Cross-browser, reliable |
| Versioning | Changesets | PR-based, multi-package aware |
| Design Tokens | CSS Variables + Tailwind | Single source of truth |

## Forbidden Technologies

The following are explicitly NOT allowed without an ADR:

- ESLint (replaced by Biome)
- Prettier (replaced by Biome)
- Jest (replaced by Vitest)
- GraphQL (use REST + tRPC unless ADR approves)
- Kubernetes (use Coolify until scale requires it)
- Redis alternatives (use Redis for both cache and queue)
- MongoDB (use PostgreSQL for everything)