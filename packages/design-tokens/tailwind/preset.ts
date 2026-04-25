import type { Config } from "tailwindcss";

const affexPreset: Partial<Config> = {
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#eff6ff",
					100: "#dbeafe",
					200: "#bfdbfe",
					300: "#93c5fd",
					400: "#60a5fa",
					500: "#3b82f6",
					600: "#2563eb",
					700: "#1d4ed8",
					800: "#1e40af",
					900: "#1e3a8a",
					950: "#172554",
				},
				neutral: {
					50: "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#94a3b8",
					500: "#64748b",
					600: "#475569",
					700: "#334155",
					800: "#1e293b",
					900: "#0f172a",
					950: "#020617",
				},
				success: "#10b981",
				warning: "#f59e0b",
				error: "#ef4444",
				info: "#3b82f6",
			},
			spacing: {
				1: "4px",
				2: "8px",
				3: "12px",
				4: "16px",
				6: "24px",
				8: "32px",
				12: "48px",
				16: "64px",
			},
			borderRadius: {
				sm: "4px",
				md: "8px",
				lg: "12px",
				xl: "16px",
				full: "9999px",
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				mono: ["JetBrains Mono", "monospace"],
			},
			fontSize: {
				"heading-1": ["2rem", { lineHeight: "1.2", fontWeight: "700" }],
				"heading-2": ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
				"heading-3": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
				body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
				small: ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
			},
			transitionDuration: {
				"150": "150ms",
				"250": "250ms",
				"400": "400ms",
			},
			transitionTimingFunction: {
				"ease-out": "ease-out",
				"ease-in-out": "ease-in-out",
			},
		},
	},
};

export default affexPreset;
