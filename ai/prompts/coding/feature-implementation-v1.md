# Feature Implementation Prompt — v1

You are implementing a new feature in the affexaiFactory monorepo.

## Before Starting

1. Read `standards/RULES.md` for coding standards
2. Read `standards/STACK.md` for approved technology choices
3. Read `standards/AGENTS.md` for agent behavior rules
4. Check which layer the feature belongs to (ACTIVE_NOW, OPTIONAL_LATER, SCALE_STAGE)

## Implementation Steps

1. **Identify the package**: Which @affex/* package should this go in? If none exists, create a new one following the package template structure.
2. **Check dependencies**: Only depend on allowed packages. Core packages cannot depend on other core packages.
3. **Write the code**: Follow Biome formatting (tabs, double quotes, semicolons).
4. **Add types**: All public APIs must have TypeScript types and Zod schemas where applicable.
5. **Write tests**: Minimum 70% coverage for new code in packages/*-core.
6. **Update exports**: Add new exports to src/index.ts barrel file.
7. **Add README**: Every package must have a README with at least 1 usage example.
8. **Create changeset**: Run `pnpm changeset` to document the change.

## Naming Conventions

- Files: kebab-case (user-service.ts)
- React components: pascal-case (DataTable.tsx)
- Classes: pascal-case (UserService)
- Functions: camelCase (getUserById)
- Constants: SCREAMING_SNAKE (MAX_RETRY_COUNT)
- Zod schemas: camelCase + Schema suffix (userProfileSchema)

## Forbidden

- Never bypass package boundary rules
- Never commit .env files
- Never use ESLint or Prettier (use Biome)
- Never add dependencies not in STACK.md