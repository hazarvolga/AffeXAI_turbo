# RULES.md — affexaiFactory Coding Standards

## Code Style

- **Formatter/Linter:** Biome (not ESLint/Prettier)
- **Indent:** Tabs
- **Line width:** 100
- **Quotes:** Double quotes
- **Semicolons:** Always
- **Trailing commas:** ES5
- **Import organization:** Auto-sorted by Biome

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Package name | `@affex/<scope>-<name>` | `@affex/auth-core` |
| File (module) | kebab-case | `user-service.ts` |
| File (React component) | pascal-case | `DataTable.tsx` |
| Class | pascal-case | `UserService` |
| Function | camelCase | `getUserById` |
| Constant | SCREAMING_SNAKE | `MAX_RETRY_COUNT` |
| Type/Interface | pascal-case | `UserProfile` |
| Zod schema | camelCase + Schema suffix | `userProfileSchema` |
| Environment variable | SCREAMING_SNAKE | `DATABASE_URL` |
| Git branch | `<type>/<description>` | `feat/auth-core-jwt` |

## File Structure

- Every package MUST have: `package.json`, `tsconfig.json`, `src/index.ts`, `README.md`
- Every package MUST export everything from `src/index.ts` (barrel export)
- NestJS modules go in `src/nestjs/` subdirectory
- Next.js hooks go in `src/nextjs/` subdirectory
- Shared utilities go in `src/shared/` subdirectory

## Commit Convention

Conventional Commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Scope examples: `auth-core`, `ui-kit`, `create-app`, `ci`, `standards`

## Branch Policy

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready code | No push, PR required |
| `feat/*` | New features | PR to main |
| `fix/*` | Bug fixes | PR to main |
| `chore/*` | Maintenance | PR to main |
| `docs/*` | Documentation | PR to main |

## Package Boundary Rules

These are enforced in CI:

1. **apps/\* → packages/\*** — ALLOWED
2. **packages/\* → packages/\*** — ALLOWED only if declared in `dependencies`
3. **packages/\* → apps/\*** — FORBIDDEN (CI fails)
4. **packages/\*-core → other \*-core** — FORBIDDEN (composition belongs in apps)
5. **No circular dependencies** — enforced by Turborepo build graph

## Testing Rules

- Every `*-core` package MUST have Vitest tests with >70% coverage
- Every app MUST have at least 1 E2E test
- Use `@affex/testing-utils` for test helpers
- Never import from `src/` directly in tests; use the package export
- Mock external services (use MSW for HTTP, testcontainers for DB/Redis)

## DB Schema Changes

1. Modify Prisma schema in `@affex/db-core`
2. Create a changeset: `pnpm changeset`
3. Run migration: `pnpm db:migrate`
4. Add migration note in `packages/db-core/UPGRADE.md`

## PR Template

```
## What
[Description of changes]

## Why
[Motivation / context]

## How
[Technical approach]

## Testing
[How to verify]

## Checklist
- [ ] Tests pass
- [ ] No boundary violations (apps → packages only)
- [ ] Changeset created (if package changed)
- [ ] README updated (if new feature)