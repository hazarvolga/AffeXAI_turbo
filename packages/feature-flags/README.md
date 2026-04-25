# @affex/feature-flags

Lightweight feature flag client with an in-memory store and rule-based evaluation. No external dependencies — suitable for apps that need simple flag management without Unleash or LaunchDarkly.

## Installation

```bash
pnpm add @affex/feature-flags
```

## Usage

### Create a client

```typescript
import { createFeatureFlagClient } from "@affex/feature-flags";

const client = createFeatureFlagClient({
	"dark-mode": {
		key: "dark-mode",
		name: "Dark Mode",
		description: "Enable dark mode UI",
		defaultValue: false,
		enabled: true,
		rules: [
			{ condition: { type: "percentage", value: 50 } },
		],
	},
});
```

### Check if a flag is enabled

```typescript
const isDarkMode = client.isEnabled("dark-mode", { userId: "user-123" });
```

### Get a flag value

```typescript
const value = client.getValue("dark-mode", { userId: "user-123" });
```

### User targeting

```typescript
const client = createFeatureFlagClient({
	"beta-feature": {
		key: "beta-feature",
		name: "Beta Feature",
		description: "Beta feature for specific users",
		defaultValue: true,
		enabled: true,
		rules: [
			{ condition: { type: "user_id", userIds: ["user-1", "user-2"] } },
		],
	},
});

client.isEnabled("beta-feature", { userId: "user-1" }); // true
client.isEnabled("beta-feature", { userId: "user-99" }); // false (falls through)
```

### Environment targeting

```typescript
const client = createFeatureFlagClient({
	"maintenance-mode": {
		key: "maintenance-mode",
		name: "Maintenance Mode",
		description: "Show maintenance banner in staging",
		defaultValue: true,
		enabled: true,
		rules: [
			{ condition: { type: "environment", environments: ["staging", "qa"] } },
		],
	},
});

client.isEnabled("maintenance-mode", { environment: "staging" }); // true
```

### Load flags from JSON

```typescript
const client = createFeatureFlagClient();
client.loadFlagsFromJson('{"my-flag":{"key":"my-flag","name":"My Flag","description":"","defaultValue":true,"enabled":true}}');
```

### Get all flag values

```typescript
const values = client.getAllValues({ userId: "user-1", environment: "production" });
// { "dark-mode": false, "beta-feature": true, ... }
```

## Rule Evaluation Order

Rules are evaluated in the following priority order:

1. **User ID targeting** — matches if `context.userId` is in the rule's `userIds` list
2. **Environment targeting** — matches if `context.environment` is in the rule's `environments` list
3. **Percentage rollout** — deterministic hash of `context.userId` modulo 100, compared to `value`

If no rules match, the `defaultValue` is returned. If the flag is disabled (`enabled: false`), the `defaultValue` is always returned regardless of rules.

## Layer

This is a **Layer 2 (OPTIONAL_LATER)** package — it has no dependencies on other `@affex/*-core` packages.