import { describe, expect, it } from "vitest";
import { FlagStore, createFeatureFlagClient, evaluateFlag } from "./index.js";
import type { FlagContext, FlagDefinition } from "./index.js";

const enabledFlag: FlagDefinition = {
	key: "test-flag",
	name: "Test Flag",
	description: "A test flag",
	defaultValue: true,
	enabled: true,
};

const disabledFlag: FlagDefinition = {
	key: "disabled-flag",
	name: "Disabled Flag",
	description: "",
	defaultValue: false,
	enabled: false,
};

describe("FlagStore", () => {
	it("sets and gets a flag", () => {
		const store = new FlagStore();
		store.set("my-flag", enabledFlag);
		expect(store.get("my-flag")).toEqual(enabledFlag);
	});

	it("returns undefined for unknown key", () => {
		const store = new FlagStore();
		expect(store.get("unknown")).toBeUndefined();
	});

	it("deletes a flag", () => {
		const store = new FlagStore();
		store.set("my-flag", enabledFlag);
		store.delete("my-flag");
		expect(store.get("my-flag")).toBeUndefined();
	});

	it("lists all flags", () => {
		const store = new FlagStore();
		store.set("flag-a", enabledFlag);
		store.set("flag-b", disabledFlag);
		const list = store.list();
		expect(list).toHaveLength(2);
	});

	it("clears all flags", () => {
		const store = new FlagStore();
		store.set("flag-a", enabledFlag);
		store.clear();
		expect(store.list()).toHaveLength(0);
	});

	it("loads flags from object", () => {
		const store = new FlagStore();
		store.loadFromObject({ "flag-a": enabledFlag });
		expect(store.get("flag-a")).toEqual(enabledFlag);
	});

	it("loads flags from JSON string", () => {
		const store = new FlagStore();
		store.loadFromJson(JSON.stringify({ "flag-a": enabledFlag }));
		expect(store.get("flag-a")).toEqual(enabledFlag);
	});
});

describe("evaluateFlag", () => {
	it("returns default value when flag is disabled", () => {
		const flag: FlagDefinition = {
			key: "off",
			name: "Off",
			description: "",
			defaultValue: true,
			enabled: false,
			rules: [{ condition: { type: "user_id", userIds: ["any"] } }],
		};
		expect(evaluateFlag(flag, { userId: "any" })).toBe(true);
	});

	it("returns default value when no rules match", () => {
		expect(evaluateFlag(enabledFlag)).toBe(true);
	});

	it("returns default value for user_id targeting match", () => {
		const flag: FlagDefinition = {
			key: "user-flag",
			name: "User Flag",
			description: "",
			defaultValue: true,
			enabled: true,
			rules: [{ condition: { type: "user_id", userIds: ["alice", "bob"] } }],
		};
		expect(evaluateFlag(flag, { userId: "alice" })).toBe(true);
	});

	it("falls through when user_id does not match", () => {
		const flag: FlagDefinition = {
			key: "user-flag",
			name: "User Flag",
			description: "",
			defaultValue: true,
			enabled: true,
			rules: [{ condition: { type: "user_id", userIds: ["alice"] } }],
		};
		expect(evaluateFlag(flag, { userId: "charlie" })).toBe(true);
	});

	it("returns default value for environment targeting match", () => {
		const flag: FlagDefinition = {
			key: "env-flag",
			name: "Env Flag",
			description: "",
			defaultValue: "active",
			enabled: true,
			rules: [{ condition: { type: "environment", environments: ["staging"] } }],
		};
		expect(evaluateFlag(flag, { environment: "staging" })).toBe("active");
	});

	it("falls through when environment does not match", () => {
		const flag: FlagDefinition = {
			key: "env-flag",
			name: "Env Flag",
			description: "",
			defaultValue: "active",
			enabled: true,
			rules: [{ condition: { type: "environment", environments: ["staging"] } }],
		};
		expect(evaluateFlag(flag, { environment: "production" })).toBe("active");
	});

	it("evaluates percentage rollout deterministically", () => {
		const flag: FlagDefinition = {
			key: "pct-flag",
			name: "Pct Flag",
			description: "",
			defaultValue: true,
			enabled: true,
			rules: [{ condition: { type: "percentage", value: 100 } }],
		};
		expect(evaluateFlag(flag, { userId: "any-user" })).toBe(true);
	});

	it("returns default when no userId for percentage rollout", () => {
		const flag: FlagDefinition = {
			key: "pct-flag",
			name: "Pct Flag",
			description: "",
			defaultValue: true,
			enabled: true,
			rules: [{ condition: { type: "percentage", value: 50 } }],
		};
		const ctx: FlagContext = { environment: "production" };
		expect(evaluateFlag(flag, ctx)).toBe(true);
	});

	it("prioritizes user_id over environment over percentage", () => {
		const flag: FlagDefinition = {
			key: "priority-flag",
			name: "Priority Flag",
			description: "",
			defaultValue: 42,
			enabled: true,
			rules: [
				{ condition: { type: "percentage", value: 0 } },
				{ condition: { type: "environment", environments: ["staging"] } },
				{ condition: { type: "user_id", userIds: ["alice"] } },
			],
		};
		expect(evaluateFlag(flag, { userId: "alice", environment: "staging" })).toBe(42);
	});
});

describe("createFeatureFlagClient", () => {
	it("creates client with initial flags", () => {
		const client = createFeatureFlagClient({
			"my-flag": {
				key: "my-flag",
				name: "My Flag",
				description: "",
				defaultValue: true,
				enabled: true,
			},
		});
		expect(client.isEnabled("my-flag")).toBe(true);
	});

	it("returns false for unknown flag in isEnabled", () => {
		const client = createFeatureFlagClient();
		expect(client.isEnabled("unknown")).toBe(false);
	});

	it("throws for unknown flag in getValue", () => {
		const client = createFeatureFlagClient();
		expect(() => client.getValue("unknown")).toThrow("Flag not found: unknown");
	});

	it("sets and removes flags", () => {
		const client = createFeatureFlagClient();
		client.setFlag("new-flag", {
			key: "new-flag",
			name: "New",
			description: "",
			defaultValue: "hello",
			enabled: true,
		});
		expect(client.getValue("new-flag")).toBe("hello");
		client.removeFlag("new-flag");
		expect(() => client.getValue("new-flag")).toThrow();
	});

	it("lists flags", () => {
		const client = createFeatureFlagClient({
			a: { key: "a", name: "A", description: "", defaultValue: true, enabled: true },
		});
		expect(client.listFlags()).toHaveLength(1);
	});

	it("loads flags from object", () => {
		const client = createFeatureFlagClient();
		client.loadFlags({
			b: { key: "b", name: "B", description: "", defaultValue: false, enabled: true },
		});
		expect(client.isEnabled("b")).toBe(false);
	});

	it("loads flags from JSON", () => {
		const client = createFeatureFlagClient();
		client.loadFlagsFromJson(
			JSON.stringify({
				c: { key: "c", name: "C", description: "", defaultValue: true, enabled: true },
			}),
		);
		expect(client.isEnabled("c")).toBe(true);
	});

	it("returns all values with context", () => {
		const client = createFeatureFlagClient({
			x: { key: "x", name: "X", description: "", defaultValue: 1, enabled: true },
			y: { key: "y", name: "Y", description: "", defaultValue: 2, enabled: false },
		});
		const values = client.getAllValues({ userId: "test" });
		expect(values.x).toBe(1);
		expect(values.y).toBe(2);
	});
});
