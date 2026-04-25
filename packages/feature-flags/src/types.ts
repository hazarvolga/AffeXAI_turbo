export type FlagValue = string | number | boolean | object;

export interface RolloutPercentage {
	type: "percentage";
	value: number;
}

export interface UserIdTargeting {
	type: "user_id";
	userIds: string[];
}

export interface EnvironmentTargeting {
	type: "environment";
	environments: string[];
}

export type FlagRule = {
	condition: RolloutPercentage | UserIdTargeting | EnvironmentTargeting;
};

export interface FlagDefinition {
	key: string;
	name: string;
	description: string;
	defaultValue: FlagValue;
	enabled: boolean;
	rules?: FlagRule[];
}

export interface FlagContext {
	userId?: string;
	environment?: string;
	properties?: Record<string, unknown>;
}
