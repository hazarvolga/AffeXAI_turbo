import path from "node:path";
import chalk from "chalk";
import fse from "fs-extra";
import { glob } from "glob";

const AFFEX_PACKAGE_MAP: Record<string, string> = {
	"@affex/auth-core": [
		"jwt",
		"oauth",
		"passport",
		"bcrypt",
		"argon2",
		"jose",
		"express-session",
	].join(","),
	"@affex/db-core": [
		"prisma",
		"@prisma/client",
		"typeorm",
		"sequelize",
		"mongoose",
		"knex",
		"drizzle-orm",
	].join(","),
	"@affex/shared-config": ["eslint", "prettier", "@typescript-eslint/eslint-plugin"].join(","),
	"@affex/ui-kit": ["@radix-ui/react-dialog", "@headlessui/react", "antd", "@mui/material"].join(
		",",
	),
	"@affex/testing-utils": ["jest", "vitest", "@playwright/test", "msw", "testcontainers"].join(","),
};

const NPMRC_CONTENT = `@affex:registry=http://localhost:4873/
registry=https://registry.npmjs.org/
`;

function findImportReplacements(
	filePath: string,
	packageName: string,
): Array<{ line: number; from: string; to: string }> {
	const replacements: Array<{ line: number; from: string; to: string }> = [];
	const affexPkg = `@affex/${packageName}`;
	const relatedDeps = AFFEX_PACKAGE_MAP[affexPkg]?.split(",") || [];

	const content = fse.readFileSync(filePath, "utf-8");
	const lines = content.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		for (const dep of relatedDeps) {
			if (
				line.includes(`from "${dep}"`) ||
				line.includes(`from '${dep}'`) ||
				line.includes(`require("${dep}"`) ||
				line.includes(`require('${dep}'`)
			) {
				replacements.push({
					line: i + 1,
					from: dep,
					to: affexPkg,
				});
			}
		}
	}

	return replacements;
}

export async function adoptPackage(repoPath: string, packageName: string): Promise<void> {
	const absolutePath = path.resolve(repoPath);
	const pkgPath = path.join(absolutePath, "package.json");
	const affexPkg = `@affex/${packageName}`;

	if (!(await fse.pathExists(pkgPath))) {
		throw new Error(`No package.json found at ${absolutePath}`);
	}

	if (!AFFEX_PACKAGE_MAP[affexPkg]) {
		throw new Error(
			`Unknown @affex package: ${affexPkg}. Available: ${Object.keys(AFFEX_PACKAGE_MAP)
				.map((k) => k.replace("@affex/", ""))
				.join(", ")}`,
		);
	}

	console.log(chalk.cyan.bold(`\nadopt: Adding ${affexPkg} to ${absolutePath}\n`));

	// Step 1: Add dependency to package.json
	const pkg = await fse.readJson(pkgPath);
	if (!pkg.dependencies) pkg.dependencies = {};
	if (pkg.dependencies[affexPkg]) {
		console.log(chalk.yellow(`  ⚠ ${affexPkg} is already in dependencies`));
	} else {
		pkg.dependencies[affexPkg] = "workspace:*";
		await fse.writeJson(pkgPath, pkg, { spaces: "\t" });
		console.log(chalk.green(`  ✓ Added ${affexPkg} to dependencies`));
	}

	// Step 2: Add .npmrc pointing to Verdaccio
	const npmrcPath = path.join(absolutePath, ".npmrc");
	const existingNpmrc = (await fse.pathExists(npmrcPath))
		? await fse.readFile(npmrcPath, "utf-8")
		: "";

	if (existingNpmrc.includes("@affex:registry")) {
		console.log(chalk.yellow("  ⚠ .npmrc already contains @affex registry"));
	} else {
		const updatedNpmrc = existingNpmrc
			? `${existingNpmrc.trimEnd()}\n${NPMRC_CONTENT}`
			: NPMRC_CONTENT;
		await fse.writeFile(npmrcPath, updatedNpmrc);
		console.log(chalk.green("  ✓ Created/updated .npmrc with Verdaccio registry"));
	}

	// Step 3: Scan for import replacements
	const sourceFiles = await glob("**/*.{ts,tsx,js,jsx}", {
		cwd: absolutePath,
		ignore: ["node_modules/**", "dist/**", ".next/**"],
	});

	let totalReplacements = 0;
	for (const file of sourceFiles) {
		const filePath = path.join(absolutePath, file);
		const replacements = findImportReplacements(filePath, packageName);
		if (replacements.length > 0) {
			console.log(chalk.white(`  → ${file}`));
			for (const r of replacements) {
				console.log(chalk.gray(`    Line ${r.line}: ${r.from} → ${r.to}`));
			}
			totalReplacements += replacements.length;
		}
	}

	if (totalReplacements > 0) {
		console.log(
			chalk.yellow(
				`\n  ⚠ Found ${totalReplacements} potential import replacement(s). Manual review required.`,
			),
		);
	}

	// Step 4: Print post-adoption instructions
	console.log("");
	console.log(chalk.cyan.bold("Post-adoption steps:"));
	console.log(chalk.white("  1. Review and update import statements listed above"));
	console.log(chalk.white("  2. Run: pnpm install"));
	console.log(chalk.white("  3. Run: pnpm build"));
	console.log(chalk.white("  4. Run: pnpm test"));
	console.log(chalk.white("  5. Check for API differences between old and new packages"));
	console.log("");
}
