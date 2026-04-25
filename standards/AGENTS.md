# AGENTS.md — AI Agent Behavior Rules

This file is read by all AI coding agents (Claude Code, Aider, OpenHands) operating in this repository.

## Identity

You are an AI coding agent working in **affexaiFactory**, a Solo Founder Engineering OS monorepo.

## Mandatory Reading

Before making ANY changes, read:
1. `standards/RULES.md` — Coding standards and boundary rules
2. `standards/STACK.md` — Approved technology matrix

## Allowed Actions

- Create new files within existing package boundaries
- Modify existing code following RULES.md naming conventions
- Write tests for any code you create or modify
- Add dependencies only if listed in STACK.md
- Run `pnpm build`, `pnpm test`, `pnpm lint`, `pnpm typecheck` to verify changes

## Forbidden Actions

- NEVER use `--no-verify`, `--force`, or `--skip-ci` flags
- NEVER use `git push --force`
- NEVER access production databases directly
- NEVER commit secrets, API keys, or `.env` files
- NEVER create packages outside the `@affex/*` naming convention
- NEVER add dependencies not in STACK.md without an ADR
- NEVER bypass package boundary rules (apps → packages only, no cross-core deps)
- NEVER use ESLint or Prettier (this project uses Biome exclusively)
- NEVER manually copy-paste starter apps; use `tools/create-app` instead

## Package Boundary Enforcement

- Apps may import from packages: `apps/* → packages/*` ✅
- Packages may import from other packages if declared: `packages/* → packages/*` ✅ (declared deps only)
- Packages may NOT import from apps: `packages/* → apps/*` ❌
- Core packages may NOT import from other core packages: `*-core → *-core` ❌

## Commit Messages

Follow Conventional Commits:
```
<type>(<scope>): <description>
```
Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

## DB Schema Changes

If you modify the Prisma schema:
1. Create a changeset: `pnpm changeset`
2. Run migration: `pnpm db:migrate`
3. Add upgrade note in `packages/db-core/UPGRADE.md`

## New Package Creation

When creating a new package:
1. Use `tools/create-app` or follow the package template structure
2. Name must follow `@affex/<name>` convention
3. Must include: `package.json`, `tsconfig.json`, `src/index.ts`, `README.md`
4. Must have Vitest tests with >70% coverage

## Error Handling

If you encounter an error:
1. Read the error message carefully
2. Check `standards/RULES.md` for relevant rules
3. Fix the root cause, don't add workarounds
4. If blocked, stop and ask for guidance

## Fallback

If you're unsure about any decision, default to:
- Simplest solution
- Follow existing patterns in the codebase
- Ask for clarification rather than guessing