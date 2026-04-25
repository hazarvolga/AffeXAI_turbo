# affexaiFactory — Claude Code Instructions

This is an AI-first monorepo (Solo Founder Engineering OS).

## Project Structure

- `apps/` — Runnable products (NestJS, Next.js)
- `packages/` — Reusable npm packages (@affex/* scope)
- `tools/` — CLI tools and generators
- `templates/` — Project scaffolding templates
- `ai/` — AI engineering surface (agents, prompts, workflows)
- `standards/` — Source of truth for how we work
- `infra/` — Infrastructure-as-code

## Key Rules

1. Read `standards/RULES.md` and `standards/STACK.md` before making changes
2. Package boundaries: apps → packages OK, packages → apps FORBIDDEN
3. *-core packages must NOT depend on other *-core packages (composition in apps)
4. Use Biome for formatting and linting (not ESLint/Prettier)
5. All new packages must follow the @affex/* naming convention
6. Use `tools/create-app` for new project scaffolding (no manual copy-paste)
7. DB schema changes require changeset + migration + db-core upgrade note
8. All commits follow Conventional Commits format
9. All packages must have README.md with at least 1 usage example

## Tech Stack

See `standards/STACK.md` for the approved technology matrix.

## Agent Behavior

See `standards/AGENTS.md` for AI agent rules.