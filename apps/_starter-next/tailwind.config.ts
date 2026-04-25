import affexPreset from "@affex/design-tokens/tailwind";

export default {
	presets: [affexPreset],
	content: [
		"./src/**/*.{ts,tsx}",
		"../../packages/ui-kit/src/**/*.{ts,tsx}",
	],
};