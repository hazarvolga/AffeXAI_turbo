import path from "node:path";
import chalk from "chalk";
import fse from "fs-extra";
import { glob } from "glob";
import type { AuditReport, PotentialMigration } from "./types.js";

const AFFEX_PACKAGES: Record<string, string[]> = {
	"@affex/auth-core": ["jwt", "oauth", "passport", "bcrypt", "argon2", "jose", "express-session"],
	"@affex/db-core": [
		"prisma",
		"@prisma/client",
		"typeorm",
		"sequelize",
		"mongoose",
		"knex",
		"drizzle-orm",
	],
	"@affex/shared-config": [
		"eslint",
		"prettier",
		"@typescript-eslint/eslint-plugin",
		"@typescript-eslint/parser",
		"eslint-config-next",
		"eslint-config-prettier",
	],
	"@affex/ui-kit": [
		"@radix-ui/react-dialog",
		"@radix-ui/react-dropdown-menu",
		"@headlessui/react",
		"antd",
		"material-ui",
		"@mui/material",
	],
	"@affex/testing-utils": ["jest", "vitest", "@playwright/test", "msw", "testcontainers"],
};

const CONFIG_FILE_PATTERNS = [
	".eslintrc*",
	".eslintrc.*",
	".prettierrc*",
	".prettierrc.*",
	"tsconfig.json",
	"jest.config.*",
	".babelrc*",
	"babel.config.*",
];

const UTILITY_DIR_PATTERNS = [
	"src/utils/**/*",
	"src/lib/**/*",
	"src/helpers/**/*",
	"src/shared/**/*",
	"lib/utils/**/*",
	"lib/shared/**/*",
];

function detectFramework(pkg: Record<string, unknown>): string {
	const deps = {
		...(pkg.dependencies as Record<string, string>),
		...(pkg.devDependencies as Record<string, string>),
	};
	if (deps.next) return "Next.js";
	if (deps["@nestjs/core"]) return "NestJS";
	if (deps.express) return "Express";
	if (deps.fastify) return "Fastify";
	if (deps.hono) return "Hono";
	if (deps.react) return "React";
	if (deps.vue) return "Vue";
	return "unknown";
}

function findPackageOverlaps(dependencies: Record<string, string>): PotentialMigration[] {
	const migrations: PotentialMigration[] = [];

	for (const [affexPkg, checkDeps] of Object.entries(AFFEX_PACKAGES)) {
		const overlaps = checkDeps.filter((dep) => dep in dependencies);
		for (const overlap of overlaps) {
			migrations.push({
				type: "package-replace",
				from: overlap,
				to: affexPkg,
				risk: overlap === "prisma" || overlap === "@prisma/client" ? "medium" : "low",
				description: `${overlap} can be replaced by ${affexPkg} which provides a standardized wrapper with monorepo conventions`,
			});
		}
	}

	return migrations;
}

function findConfigReplacements(repoPath: string): PotentialMigration[] {
	const migrations: PotentialMigration[] = [];

	for (const pattern of CONFIG_FILE_PATTERNS) {
		const matches = glob.sync(pattern, { cwd: repoPath, dot: true });
		for (const match of matches) {
			migrations.push({
				type: "config-replace",
				from: match,
				to: "@affex/shared-config",
				risk: "low",
				description: `${match} can be replaced by the shared config from @affex/shared-config to maintain consistency across the monorepo`,
			});
		}
	}

	return migrations;
}

function findUtilityMoves(repoPath: string): PotentialMigration[] {
	const migrations: PotentialMigration[] = [];

	for (const pattern of UTILITY_DIR_PATTERNS) {
		const matches = glob.sync(pattern, { cwd: repoPath, dot: true });
		if (matches.length > 0) {
			const dir = pattern.split("/").slice(0, 2).join("/");
			migrations.push({
				type: "utility-move",
				from: dir,
				to: "packages/shared-utils or new @affex/* package",
				risk: "medium",
				description: `${dir}/ contains ${matches.length} utility file(s) that could be extracted into a shared package for reuse across the monorepo`,
			});
		}
	}

	return migrations;
}

export async function auditRepo(repoPath: string): Promise<AuditReport> {
	const absolutePath = path.resolve(repoPath);
	const pkgPath = path.join(absolutePath, "package.json");

	if (!(await fse.pathExists(pkgPath))) {
		throw new Error(`No package.json found at ${absolutePath}`);
	}

	const pkg = await fse.readJson(pkgPath);
	const name = pkg.name || path.basename(absolutePath);
	const framework = detectFramework(pkg);
	const dependencies: Record<string, string> = {
		...(pkg.dependencies || {}),
		...(pkg.devDependencies || {}),
	};

	const potentialMigrations: PotentialMigration[] = [
		...findPackageOverlaps(dependencies),
		...findConfigReplacements(absolutePath),
		...findUtilityMoves(absolutePath),
	];

	return {
		repoPath: absolutePath,
		name,
		framework,
		dependencies,
		potentialMigrations,
	};
}

export function formatReport(report: AuditReport): string {
	const lines: string[] = [];
	const { repoPath, name, framework, dependencies, potentialMigrations } = report;

	lines.push("");
	lines.push(chalk.cyan.bold("═".repeat(60)));
	lines.push(chalk.cyan.bold(`  Migration Audit: ${name}`));
	lines.push(chalk.cyan.bold("═".repeat(60)));
	lines.push("");
	lines.push(`${chalk.white("Path:")}        ${repoPath}`);
	lines.push(`${chalk.white("Framework:")}   ${framework}`);
	lines.push(`${chalk.white("Dependencies:")} ${Object.keys(dependencies).length}`);
	lines.push("");

	if (potentialMigrations.length === 0) {
		lines.push(chalk.yellow("  No potential migrations found."));
		lines.push("");
		return lines.join("\n");
	}

	const grouped = {
		"package-replace": potentialMigrations.filter((m) => m.type === "package-replace"),
		"config-replace": potentialMigrations.filter((m) => m.type === "config-replace"),
		"utility-move": potentialMigrations.filter((m) => m.type === "utility-move"),
	};

	const typeLabels: Record<string, string> = {
		"package-replace": "📦 Package Replacements",
		"config-replace": "⚙️  Config Replacements",
		"utility-move": "🔧 Utility Extractions",
	};

	for (const [type, migrations] of Object.entries(grouped)) {
		if (migrations.length === 0) continue;
		lines.push(chalk.bold(typeLabels[type]));
		lines.push(chalk.gray("─".repeat(50)));
		for (const m of migrations) {
			const riskColor =
				m.risk === "low" ? chalk.green : m.risk === "medium" ? chalk.yellow : chalk.red;
			lines.push(
				`  ${riskColor(`[${m.risk.toUpperCase()}]`)} ${chalk.white(m.from)} → ${chalk.cyan(m.to)}`,
			);
			lines.push(`    ${chalk.gray(m.description)}`);
		}
		lines.push("");
	}

	lines.push(chalk.bold("Summary:"));
	lines.push(`  ${chalk.white("Total migrations:")} ${potentialMigrations.length}`);
	lines.push(
		`  ${chalk.white("Low risk:")}    ${potentialMigrations.filter((m) => m.risk === "low").length}`,
	);
	lines.push(
		`  ${chalk.white("Medium risk:")} ${potentialMigrations.filter((m) => m.risk === "medium").length}`,
	);
	lines.push(
		`  ${chalk.white("High risk:")}   ${potentialMigrations.filter((m) => m.risk === "high").length}`,
	);
	lines.push("");

	return lines.join("\n");
}
