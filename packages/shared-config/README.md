# @affex/shared-config

Shared configuration presets for the affexaiFactory monorepo.

## Usage

### TypeScript Configs

In your `tsconfig.json`:

```json
{
  "extends": "@affex/shared-config/tsconfig/base"
}
```

Available configs:
- `@affex/shared-config/tsconfig/base` — Base config for all packages
- `@affex/shared-config/tsconfig/nestjs` — NestJS projects (decorators support)
- `@affex/shared-config/tsconfig/nextjs` — Next.js projects (JSX, DOM)

### Biome Config

In your root `biome.json`:

```json
{
  "extends": ["@affex/shared-config/biome"]
}
```

### Vitest Config

```typescript
import { createVitestConfig } from "@affex/shared-config/vitest";

export default createVitestConfig();
```