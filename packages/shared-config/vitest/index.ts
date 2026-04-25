import { defineConfig } from "vitest/config";

export function createVitestConfig(options?: { alias?: Record<string, string> }) {
	return defineConfig({
		test: {
			globals: true,
			environment: "node",
			include: ["src/**/*.test.ts"],
			coverage: {
				provider: "v8",
				include: ["src/**/*.ts"],
				exclude: ["src/**/*.test.ts", "src/**/index.ts"],
			},
		},
		resolve: {
			alias: options?.alias ?? {},
		},
	});
}
