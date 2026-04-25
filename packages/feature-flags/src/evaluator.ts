import type { FlagContext, FlagDefinition, FlagRule, FlagValue } from "./types.js";

function hashString(input: string): number {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		const char = input.charCodeAt(i);
		hash = ((hash << 5) - hash + char) | 0;
	}
	return Math.abs(hash);
}

function evaluateRule(rule: FlagRule, context: FlagContext): boolean {
	const { condition } = rule;

	switch (condition.type) {
		case "user_id":
			return context.userId != null && condition.userIds.includes(context.userId);
		case "environment":
			return context.environment != null && condition.environments.includes(context.environment);
		case "percentage": {
			if (context.userId == null) {
				return false;
			}
			const hash = hashString(context.userId);
			return hash % 100 < condition.value;
		}
	}
}

export function evaluateFlag(flag: FlagDefinition, context?: FlagContext): FlagValue {
	if (!flag.enabled) {
		return flag.defaultValue;
	}

	const rules = flag.rules ?? [];
	const ctx: FlagContext = context ?? {};

	for (const rule of rules) {
		const { condition } = rule;
		if (condition.type === "user_id" && evaluateRule(rule, ctx)) {
			return flag.defaultValue;
		}
	}

	for (const rule of rules) {
		const { condition } = rule;
		if (condition.type === "environment" && evaluateRule(rule, ctx)) {
			return flag.defaultValue;
		}
	}

	for (const rule of rules) {
		const { condition } = rule;
		if (condition.type === "percentage" && evaluateRule(rule, ctx)) {
			return flag.defaultValue;
		}
	}

	return flag.defaultValue;
}
