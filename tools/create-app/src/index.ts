#!/usr/bin/env node

import chalk from "chalk";
import { generateApp } from "./generator.js";
import { prompts } from "./prompts.js";

async function main(): Promise<void> {
	console.log(
		chalk.cyan.bold(`
╔══════════════════════════════════════════╗
║     🏗️  AffeXAI App Scaffolder 🏗️       ║
╚══════════════════════════════════════════╝
	`),
	);
	console.log(chalk.gray("Create a new app in the AffeXAI monorepo\n"));

	try {
		const config = await prompts();
		await generateApp(config);

		console.log(chalk.green.bold("\n✅ App created successfully!\n"));
		console.log(chalk.white("Next steps:"));
		console.log(chalk.cyan(`  cd apps/${config.name}`));
		console.log(chalk.cyan("  pnpm dev\n"));
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(chalk.red(`\n❌ Error: ${message}\n`));
		process.exit(1);
	}
}

main();
