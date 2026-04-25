# migrate-repo

CLI tool for migrating existing repositories into the affexaiFactory monorepo.

## Installation

```bash
pnpm install
```

## Commands

### `migrate audit <path>`

Analyzes a repository and generates a migration report identifying opportunities to adopt `@affex/*` packages.

```bash
# Audit a local repository
pnpm dev audit /path/to/my-project

# Audit the current directory
pnpm dev audit .
```

The report includes:

- **Package replacements** — dependencies that map to `@affex/*` packages
- **Config replacements** — config files that can be replaced by `@affex/shared-config`
- **Utility extractions** — utility directories that could become shared packages
- Risk levels (low / medium / high) for each migration

### `migrate adopt <path> --pkg <pkg-name>`

Adopts a specific `@affex/*` package into an existing repository.

```bash
# Adopt auth-core into a project
pnpm dev adopt /path/to/my-project --pkg auth-core

# Adopt db-core into a project
pnpm dev adopt /path/to/my-project --pkg db-core
```

Steps performed:

1. Adds `@affex/<package>` to the target repo's `package.json`
2. Creates/updates `.npmrc` pointing to the Verdaccio registry
3. Scans source files for import statements that can be updated
4. Prints post-adoption instructions

### `migrate absorb <path>`

Absorbs an entire repository into `apps/<name>/` using git subtree.

```bash
# Absorb a repository into the monorepo
pnpm dev absorb /path/to/external-repo
```

Steps performed:

1. Validates the target is a git repository
2. Extracts repo name from `package.json` or directory name
3. Runs `git subtree add` to `apps/<name>/`
4. Falls back to file copy if subtree fails
5. Creates/updates `package.json` with `@affex/*` naming
6. Updates `pnpm-workspace.yaml` if needed
7. Prints post-absorption instructions

## Development

```bash
pnpm dev          # Run in development mode
pnpm build        # Compile TypeScript
pnpm test         # Run tests
pnpm typecheck    # Type-check without emitting
pnpm lint         # Lint with Biome
pnpm clean        # Remove build artifacts
```