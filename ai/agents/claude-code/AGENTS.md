# AI Agent Rules — affexaiFactory

This file is read by Claude Code, Aider, and OpenHands agents.

## Before Making Changes

1. Read `standards/RULES.md` for coding standards
2. Read `standards/STACK.md` for approved technology
3. Understand which layer you're modifying (ACTIVE_NOW, OPTIONAL_LATER, SCALE_STAGE)

## Package Architecture

```
apps/* → packages/*          ✅ ALLOWED
packages/* → packages/*      ✅ ALLOWED (declared deps only)
packages/* → apps/*          ❌ FORBIDDEN
*-core → other *-core        ❌ FORBIDDEN
```

## When Creating New Files

- Use `tools/create-app` for new apps — no manual copy-paste
- All packages must have: package.json, tsconfig.json, src/index.ts, README.md
- Follow naming: files kebab-case, classes PascalCase, functions camelCase
- Use tabs for indentation, double quotes, semicolons

## When Modifying Packages

- Run `pnpm build` after changes
- Run `pnpm test` after changes
- Run `pnpm lint` after changes
- Create changeset: `pnpm changeset`

## DB Schema Changes

1. Modify Prisma schema in `@affex/db-core`
2. Run migration: `pnpm db:migrate`
3. Add upgrade note in `packages/db-core/UPGRADE.md`

## Forbidden

- Never use --no-verify, --force, or git push --force
- Never commit .env files or secrets
- Never use ESLint or Prettier (use Biome)
- Never bypass package boundary rules