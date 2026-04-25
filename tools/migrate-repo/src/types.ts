export interface PotentialMigration {
	type: "package-replace" | "config-replace" | "utility-move";
	from: string;
	to: string;
	risk: "low" | "medium" | "high";
	description: string;
}

export interface AuditReport {
	repoPath: string;
	name: string;
	framework: string;
	dependencies: Record<string, string>;
	potentialMigrations: PotentialMigration[];
}
