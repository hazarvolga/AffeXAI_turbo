# create-app

Project scaffolding CLI for the AffeXAI monorepo.

## Usage

```bash
pnpm create @affex/app
```

Or run directly:

```bash
pnpm --filter create-app dev
```

## Prompts

The CLI will ask:

1. **Project name** — kebab-case identifier (e.g. `my-saas-app`)
2. **Template** — Choose from:
   - `nest-saas` — NestJS SaaS application
   - `next-app` — Next.js frontend application
   - `nest-microservice` — NestJS microservice
   - `ai-agent` — AI agent service
3. **Features** — Select from auth, billing, AI, notifications, queue, UI kit
4. **Deploy target** — Coolify or manual deployment
5. **AI agent config** — Claude + Aider + OpenHands, Claude only, or none

## What it does

- Creates `apps/<name>/` from the selected template
- Replaces tokens: `__APP_NAME__`, `__APP_PORT__`, `__DB_NAME__`
- Adds `@affex/*-core` dependencies based on selected features
- Injects AI agent config (CLAUDE.md, .aider.conf.yml) if selected
- Creates Coolify deployment stub if selected

## Layer

`ACTIVE_NOW` — Core scaffolding tool, must always work.