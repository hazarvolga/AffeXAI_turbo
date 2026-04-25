# @affex/starter-next

Layer 1 (ACTIVE_NOW) reference Next.js 14 application using the App Router.

## Packages

- `@affex/ui-kit` — Shared UI component library
- `@affex/auth-core` — Authentication client (Next.js adapter)
- `@affex/design-tokens` — Tailwind preset + design system tokens
- `@affex/shared-types` — Shared TypeScript type definitions
- `@affex/shared-config` — Shared configuration utilities

## Routes

| Path | Description |
|---|---|
| `/` | Home page with hero and CTA |
| `/login` | Email + password sign-in |
| `/dashboard` | Protected dashboard (auth required) |

## Getting Started

```bash
# Install dependencies (from monorepo root)
pnpm install

# Run dev server
pnpm --filter @affex/starter-next dev

# Build for production
pnpm --filter @affex/starter-next build

# Run type checking
pnpm --filter @affex/starter-next typecheck

# Lint
pnpm --filter @affex/starter-next lint
```

## Docker

```bash
docker build -t affex-starter-next .
docker run -p 3000:3000 affex-starter-next
```

## Auth

Auth is powered by `@affex/auth-core`. The client is configured in `src/lib/auth.ts` and middleware in `src/middleware.ts` protects `/dashboard` routes, redirecting unauthenticated users to `/login`.