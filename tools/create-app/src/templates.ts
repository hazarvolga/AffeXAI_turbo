import Handlebars from "handlebars";

export interface TemplateData {
	APP_NAME: string;
	APP_PORT: number;
	DB_NAME: string;
	FEATURES: FeatureDependency[];
}

export interface FeatureDependency {
	name: string;
	package: string;
}

const FEATURE_MAP: Record<string, string> = {
	auth: "@affex/auth-core",
	billing: "@affex/billing-core",
	ai: "@affex/ai-core",
	notifications: "@affex/notifications-core",
	queue: "@affex/queue-core",
	"ui-kit": "@affex/ui-kit",
};

export function getFeatureDependencies(features: string[]): FeatureDependency[] {
	return features
		.filter((feature) => FEATURE_MAP[feature] !== undefined)
		.map((feature) => ({
			name: feature,
			package: FEATURE_MAP[feature],
		}));
}

export function processTemplate(content: string, data: TemplateData): string {
	const compiled = Handlebars.compile(content);
	return compiled(data);
}

export function derivePort(name: string, basePort = 3000): number {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = (hash << 5) - hash + name.charCodeAt(i);
		hash |= 0;
	}
	return basePort + (Math.abs(hash) % 1000);
}

export function deriveDbName(name: string): string {
	return `affex_${name.replace(/-/g, "_")}`;
}
