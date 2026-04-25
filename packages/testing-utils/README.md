# @affex/testing-utils

Vitest setup, test fixtures, and MSW handlers for the affexaiFactory monorepo.

This is a **Layer 1 (ACTIVE_NOW)** testing utilities package. It must NOT depend on other `@affex/*-core` packages.

## Installation

```bash
pnpm add -D @affex/testing-utils
```

## Usage

### Vitest Global Setup

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  setupFiles: ["@affex/testing-utils/vitest-setup"],
});
```

```typescript
// In your setup file
import { setup } from "@affex/testing-utils/vitest-setup";

setup({ enableMsw: true, globalTimeout: 15_000 });
```

### Test Fixtures

```typescript
import { createPostgresFixture, createRedisFixture } from "@affex/testing-utils/fixtures";

// In a test
const pg = await createPostgresFixture();
console.log(pg.connectionString); // "postgresql://test:test@localhost:5432/testdb"
await pg.stop();

const redis = await createRedisFixture();
console.log(redis.host, redis.port); // "localhost" 6379
await redis.stop();
```

### MSW Handlers

```typescript
import { createAuthHandlers, createHealthHandlers } from "@affex/testing-utils/msw-handlers";

const handlers = [
  ...createAuthHandlers("http://localhost:3000"),
  ...createHealthHandlers("http://localhost:3000"),
];
```

### Test Utilities

```typescript
import { wait, createMockRouter, createMockRequest, createMockResponse } from "@affex/testing-utils/test-utils";

await wait(100); // wait 100ms

const router = createMockRouter({ pathname: "/dashboard" });
const req = createMockRequest({ body: { name: "test" } });
const res = createMockResponse();

res.status(200).json({ ok: true });
expect(res.status).toHaveBeenCalledWith(200);
```