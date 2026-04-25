export type {
	FlagValue,
	FlagDefinition,
	FlagRule,
	RolloutPercentage,
	UserIdTargeting,
	EnvironmentTargeting,
	FlagContext,
} from "./types.js";

export { FlagStore } from "./store.js";

export { evaluateFlag } from "./evaluator.js";

export { createFeatureFlagClient } from "./client.js";
export type { FeatureFlagClient } from "./client.js";
