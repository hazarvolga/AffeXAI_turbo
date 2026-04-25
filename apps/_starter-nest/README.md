# @affex/starter-nest

Layer 1 (ACTIVE_NOW) reference NestJS application that wires all `@affex/*-core` packages. This is the template that the generator copies from.

## Packages Used

| Package | Purpose |
|---------|---------|
| `@affex/db-core` | Prisma client factory, soft-delete middleware, audit logging |
| `@affex/auth-core` | JWT auth, OAuth, RBAC guards and decorators |
| `@affex/ai-core` | Multi-provider LLM client with retry and tracing |
| `@affex/queue-core` | BullMQ typed wrapper with job factories and DLQ |
| `@affex/observability-core` | Structured logging (pino), Langfuse, error tracking |
| `@affex/shared-types` | Zod schemas and shared TypeScript types |
| `@affex/shared-config` | Shared tsconfig, biome, and vitest presets |

## Available Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check — returns `{ status: "ok", timestamp }` |
| GET | `/users` | List all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create a user |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Soft-delete a user |

## Getting Started

```bash
# Install dependencies (from monorepo root)
pnpm install

# Run in development mode
pnpm --filter @affex/starter-nest dev

# Build for production
pnpm --filter @affex/starter-nest build

# Run production build
pnpm --filter @affex/starter-nest start:prod
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://localhost:5432/affex` | PostgreSQL connection string |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `JWT_SECRET` | `change-me-in-production` | JWT signing secret |
| `PORT` | `3001` | Application port |

## Docker

```bash
docker build -t affex-starter-nest .
docker run -p 3001:3001 affex-starter-nest
```