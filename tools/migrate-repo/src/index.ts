#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { absorbRepo } from "./absorb.js";
import { adoptPackage } from "./adopt.js";
import { auditRepo, formatReport } from "./audit.js";

const program = new Command();

program
	.name("migrate")
	.description("CLI tool for migrating existing repos into the affexaiFactory monorepo")
	.version("0.1.0");

program
	.command("audit <path>")
	.description("Analyze a repo and generate a migration report")
	.action(async (repoPath: string) => {
		try {
			const report = await auditRepo(repoPath);
			console.log(formatReport(report));
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			console.error(chalk.red(`\nError: ${message}\n`));
			process.exit(1);
		}
	});

program
	.command("adopt <path>")
	.description("Adopt a specific @affex/* package into an existing repo")
	.option(
		"--pkg <packageName>",
		"Name of the @affex/* package to adopt (without the @affex/ prefix)",
	)
	.action(async (repoPath: string, options: { pkg?: string }) => {
		if (!options.pkg) {
			console.error(
				chalk.red("\nError: --pkg flag is required. Specify the @affex/* package name.\n"),
			);
			process.exit(1);
		}
		try {
			await adoptPackage(repoPath, options.pkg);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			console.error(chalk.red(`\nError: ${message}\n`));
			process.exit(1);
		}
	});

program
	.command("absorb <path>")
	.description("Absorb a repo into apps/<name>/ via git subtree")
	.action(async (repoPath: string) => {
		try {
			await absorbRepo(repoPath);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			console.error(chalk.red(`\nError: ${message}\n`));
			process.exit(1);
		}
	});

program.parse();
