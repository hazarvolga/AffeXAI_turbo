# ADR-0001: Monorepo Tooling — pnpm + Turborepo + Biome

## Status

Accepted

## Context

We need to choose a monorepo management strategy for a Solo Founder Engineering OS that:
- Manages 15+ packages and 5+ apps
- Enables fast, cached builds across packages
- Enforces code quality consistently
- Supports AI agent workflows
- Minimizes operational overhead for a single person

## Decision

We will use:
- **pnpm 9** as the package manager (with workspaces)
- **Turborepo** as the build orchestrator
- **Biome** as the sole linter and formatter (replacing ESLint + Prettier)

## Rationale

### pnpm over npm/yarn

- 30-50% faster installs than npm
- Strict node_modules structure prevents phantom dependencies
- Disk-efficient content-addressable store
- Built-in workspace support
- `pnpm dlx` for running CLI tools without global install

### Turborepo over Nx

- Zero-config remote caching (Vercel free tier or self-hosted)
- Simpler learning curve for a solo founder
- `turbo run build --filter` for targeted builds
- Pipeline definition matches our workflow exactly

### Biome over ESLint + Prettier

- 10-20x faster (Rust-based, native binary)
- Single tool for format + lint (eliminates config conflicts)
- Built-in import sorting
- Built-in formatter (no Prettier needed)
- Fewer dependencies to maintain

## Consequences

### Positive

- Single tool for linting and formatting (Biome)
- Fast CI with Turborepo remote cache
- Strict package boundaries enforced by pnpm
- Low maintenance overhead for a solo founder

### Negative

- Biome ecosystem is smaller than ESLint (fewer community plugins)
- Turborepo has less fine-grained control than Nx for large orgs
- pnpm's strictness can cause issues with packages that don't declare peer deps

### Mitigations

- Use Biome's rule configuration for custom rules
- Accept Turborepo's trade-offs for simplicity
- Use `shamefully-hoist=true` in `.npmrc` for compatibility

## References

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Biome Docs](https://biomejs.dev/)