import { evaluateFlag } from "./evaluator.js";
import { FlagStore } from "./store.js";
import type { FlagContext, FlagDefinition, FlagValue } from "./types.js";

export interface FeatureFlagClient {
	isEnabled(key: string, context?: FlagContext): boolean;
	getValue(key: string, context?: FlagContext): FlagValue;
	setFlag(key: string, definition: FlagDefinition): void;
	removeFlag(key: string): void;
	listFlags(): FlagDefinition[];
	loadFlags(flags: Record<string, FlagDefinition>): void;
	loadFlagsFromJson(json: string): void;
	getAllValues(context?: FlagContext): Record<string, FlagValue>;
}

export function createFeatureFlagClient(
	initialFlags?: Record<string, FlagDefinition>,
): FeatureFlagClient {
	const store = new FlagStore();

	if (initialFlags) {
		store.loadFromObject(initialFlags);
	}

	return {
		isEnabled(key: string, context?: FlagContext): boolean {
			const flag = store.get(key);
			if (!flag) {
				return false;
			}
			return evaluateFlag(flag, context) as boolean;
		},

		getValue(key: string, context?: FlagContext): FlagValue {
			const flag = store.get(key);
			if (!flag) {
				throw new Error(`Flag not found: ${key}`);
			}
			return evaluateFlag(flag, context);
		},

		setFlag(key: string, definition: FlagDefinition): void {
			store.set(key, definition);
		},

		removeFlag(key: string): void {
			store.delete(key);
		},

		listFlags(): FlagDefinition[] {
			return store.list();
		},

		loadFlags(flags: Record<string, FlagDefinition>): void {
			store.loadFromObject(flags);
		},

		loadFlagsFromJson(json: string): void {
			store.loadFromJson(json);
		},

		getAllValues(context?: FlagContext): Record<string, FlagValue> {
			const result: Record<string, FlagValue> = {};
			for (const flag of store.list()) {
				result[flag.key] = evaluateFlag(flag, context);
			}
			return result;
		},
	};
}
