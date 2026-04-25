# @affex/shared-types

Shared Zod schemas and TypeScript types for the affexaiFactory monorepo.

## Usage

```typescript
import { UserSchema, type User } from "@affex/shared-types";

const result = UserSchema.safeParse(data);
if (result.success) {
  console.log(result.data.name);
}
```

## Exports

- `@affex/shared-types` — All types and schemas
- `@affex/shared-types/user` — User types and schemas
- `@affex/shared-types/api` — API response types and schemas
- `@affex/shared-types/auth` — Auth types and schemas