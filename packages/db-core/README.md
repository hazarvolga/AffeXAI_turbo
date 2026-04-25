# @affex/db-core

Prisma client factory, soft-delete middleware, audit log middleware, and migration helpers for the affexaiFactory monorepo.

## Usage

### Prisma Client

```typescript
import { createPrismaClient } from "@affex/db-core";

const prisma = createPrismaClient();
const user = await prisma.user.findFirst();
```

### Soft-Delete Middleware

```typescript
import { createPrismaClient } from "@affex/db-core/client";
import { softDeleteMiddleware } from "@affex/db-core/soft-delete";

const prisma = createPrismaClient();
prisma.$use(softDeleteMiddleware());
```

### Audit Log

```typescript
import { createAuditEntry } from "@affex/db-core/audit-log";

const entry = createAuditEntry("create", "User", "123", "admin-id", { role: "USER" });
```

### Migration Helpers

```typescript
import { runMigration, generateClient } from "@affex/db-core/migrations";

runMigration("add-user-table");
generateClient();
```

## Exports

- `@affex/db-core` — All exports
- `@affex/db-core/client` — Prisma client factory
- `@affex/db-core/soft-delete` — Soft-delete middleware
- `@affex/db-core/audit-log` — Audit log utilities
- `@affex/db-core/migrations` — Migration helpers