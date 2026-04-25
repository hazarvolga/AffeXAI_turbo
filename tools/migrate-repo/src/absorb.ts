import path from "node:path";
import chalk from "chalk";
import fse from "fs-extra";
import { simpleGit } from "simple-git";

function parseWorkspaceYaml(content: string): string[] {
	const lines = content.split("\n");
	const packages: string[] = [];
	for (const line of lines) {
		const match = line.trim().match(/^-\s+"(.+)"$/);
		if (match) {
			packages.push(match[1]);
		}
	}
	return packages;
}

function serializeWorkspaceYaml(packages: string[]): string {
	const lines = ["packages:"];
	for (const pkg of packages.sort()) {
		lines.push(`  - "${pkg}"`);
	}
	return `${lines.join("\n")}\n`;
}

const MONOREPO_ROOT = path.resolve(import.meta.dirname, "../../..");

export async function absorbRepo(repoPath: string): Promise<void> {
	const absolutePath = path.resolve(repoPath);
	const git = simpleGit(absolutePath);

	// Step 1: Validate it's a git repository
	const isRepo = await git.checkIsRepo();
	if (!isRepo) {
		throw new Error(`${absolutePath} is not a git repository`);
	}

	console.log(chalk.cyan.bold(`\nabsorb: Absorbing ${absolutePath} into monorepo\n`));

	// Step 2: Extract repo name
	let name: string;
	const pkgPath = path.join(absolutePath, "package.json");
	if (await fse.pathExists(pkgPath)) {
		const pkg = await fse.readJson(pkgPath);
		name = ((pkg.name as string) || path.basename(absolutePath)).replace(/^@[^/]+\//, "");
	} else {
		name = path.basename(absolutePath);
	}

	console.log(chalk.white(`  Repository name: ${chalk.bold(name)}`));

	// Step 3: Run git subtree add
	const targetDir = `apps/${name}`;
	const appsDir = path.join(MONOREPO_ROOT, "apps");
	if (!(await fse.pathExists(appsDir))) {
		await fse.ensureDir(appsDir);
	}

	const targetPath = path.join(MONOREPO_ROOT, targetDir);
	if (await fse.pathExists(targetPath)) {
		throw new Error(
			`apps/${name} already exists in the monorepo. Remove it first or choose a different name.`,
		);
	}

	console.log(chalk.white(`  Running git subtree add for ${targetDir}...`));

	const monorepoGit = simpleGit(MONOREPO_ROOT);
	const headRef = await git.revparse(["HEAD"]).catch(() => "main");

	try {
		await monorepoGit.raw(["subtree", "add", "--prefix", targetDir, absolutePath, headRef]);
		console.log(chalk.green("  ✓ Git subtree added successfully"));
	} catch (subtreeError: unknown) {
		const msg = subtreeError instanceof Error ? subtreeError.message : String(subtreeError);
		console.log(chalk.yellow(`  ⚠ Git subtree add failed: ${msg}`));
		console.log(chalk.white("  Falling back to file copy..."));
		await fse.copy(absolutePath, targetPath, {
			filter: (src) => {
				const relative = path.relative(absolutePath, src);
				if (relative.includes("node_modules")) return false;
				if (relative.includes(".git")) return false;
				if (relative.includes("dist")) return false;
				if (relative.includes(".next")) return false;
				return true;
			},
		});
		console.log(chalk.green(`  ✓ Files copied to apps/${name}`));
	}

	// Step 4: Create/update package.json in the absorbed app
	const absorbedPkgPath = path.join(targetPath, "package.json");
	if (!(await fse.pathExists(absorbedPkgPath))) {
		const defaultPkg = {
			name: `@affex/${name}`,
			version: "0.1.0",
			private: true,
			scripts: {
				dev: "next dev",
				build: "next build",
				start: "next start",
			},
			dependencies: {},
		};
		await fse.writeJson(absorbedPkgPath, defaultPkg, { spaces: "\t" });
		console.log(chalk.green(`  ✓ Created default package.json at ${targetDir}`));
	} else {
		const pkg = await fse.readJson(absorbedPkgPath);
		if (!pkg.name?.startsWith("@affex/")) {
			pkg.name = `@affex/${name}`;
			await fse.writeJson(absorbedPkgPath, pkg, { spaces: "\t" });
			console.log(chalk.green(`  ✓ Updated package name to @affex/${name}`));
		}
	}

	// Step 5: Update pnpm-workspace.yaml if needed
	const workspaceYamlPath = path.join(MONOREPO_ROOT, "pnpm-workspace.yaml");
	if (await fse.pathExists(workspaceYamlPath)) {
		const content = await fse.readFile(workspaceYamlPath, "utf-8");
		const packages = parseWorkspaceYaml(content);
		if (!packages.includes("apps/*")) {
			packages.push("apps/*");
			await fse.writeFile(workspaceYamlPath, serializeWorkspaceYaml(packages));
			console.log(chalk.green("  ✓ Updated pnpm-workspace.yaml"));
		} else {
			console.log(chalk.gray("  ℹ pnpm-workspace.yaml already includes apps/*"));
		}
	}

	// Step 6: Print post-absorption instructions
	console.log("");
	console.log(chalk.cyan.bold("Post-absorption steps:"));
	console.log(chalk.white(`  1. cd ${targetPath}`));
	console.log(chalk.white("  2. pnpm install"));
	console.log(chalk.white("  3. Review and update dependencies to use @affex/* packages"));
	console.log(chalk.white("  4. Run: migrate audit . (to identify migration opportunities)"));
	console.log(chalk.white("  5. Update tsconfig.json to extend ../../tsconfig.base.json"));
	console.log(chalk.white("  6. Run: pnpm build && pnpm test"));
	console.log(chalk.white("  7. Commit the absorbed repo"));
	console.log("");
}
