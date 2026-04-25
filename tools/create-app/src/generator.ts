import path from "node:path";
import url from "node:url";
import chalk from "chalk";
import fs from "fs-extra";
import type { AppConfig } from "./prompts.js";
import {
	type FeatureDependency,
	type TemplateData,
	deriveDbName,
	derivePort,
	getFeatureDependencies,
	processTemplate,
} from "./templates.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONOREPO_ROOT = path.resolve(__dirname, "../../..");
const APPS_DIR = path.join(MONOREPO_ROOT, "apps");
const TEMPLATES_DIR = path.join(__dirname, "templates");

const AI_AGENT_CONFIGS: Record<string, Record<string, string>> = {
	"claude+aider+openhands": {
		"CLAUDE.md": "# AI Agent Config\n\nThis project uses Claude Code, Aider, and OpenHands.\n",
		".aider.conf.yml": "model: claude-3-5-sonnet\nmap-tokens: 8192\n",
	},
	"claude-only": {
		"CLAUDE.md": "# AI Agent Config\n\nThis project uses Claude Code only.\n",
	},
};

export async function generateApp(config: AppConfig): Promise<void> {
	const targetDir = path.join(APPS_DIR, config.name);

	if (fs.existsSync(targetDir)) {
		throw new Error(`Directory already exists: ${targetDir}`);
	}

	const templateDir = path.join(TEMPLATES_DIR, config.template);
	if (!fs.existsSync(templateDir)) {
		throw new Error(`Template not found: ${config.template}`);
	}

	const features: FeatureDependency[] = getFeatureDependencies(config.features);
	const port = derivePort(config.name);
	const dbName = deriveDbName(config.name);

	const templateData: TemplateData = {
		APP_NAME: config.name,
		APP_PORT: port,
		DB_NAME: dbName,
		FEATURES: features,
	};

	await fs.ensureDir(targetDir);
	await copyAndProcessTemplate(templateDir, targetDir, templateData);

	if (config.deploy === "coolify") {
		await injectCoolifyStub(config.name, port);
	}

	if (config.aiAgentConfig !== "none") {
		await injectAgentConfig(targetDir, config.aiAgentConfig);
	}

	console.log(chalk.gray(`  Created: apps/${config.name}`));
	console.log(chalk.gray(`  Port: ${port}`));
	console.log(chalk.gray(`  Database: ${dbName}`));
	console.log(chalk.gray(`  Features: ${config.features.join(", ") || "none"}`));
}

async function copyAndProcessTemplate(
	srcDir: string,
	destDir: string,
	data: TemplateData,
): Promise<void> {
	const entries = await fs.readdir(srcDir, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(srcDir, entry.name);
		const destPath = path.join(destDir, entry.name);

		if (entry.isDirectory()) {
			await copyAndProcessTemplate(srcPath, destPath, data);
			continue;
		}

		if (entry.name.endsWith(".hbs")) {
			const content = await fs.readFile(srcPath, "utf-8");
			const processed = processTemplate(content, data);
			const outputPath = destPath.replace(/\.hbs$/, "");
			await fs.ensureDir(path.dirname(outputPath));
			await fs.writeFile(outputPath, processed);
		} else {
			let content = await fs.readFile(srcPath, "utf-8");
			if (isTextFile(entry.name)) {
				content = content
					.replace(/__APP_NAME__/g, data.APP_NAME)
					.replace(/__APP_PORT__/g, String(data.APP_PORT))
					.replace(/__DB_NAME__/g, data.DB_NAME);
			}
			await fs.ensureDir(path.dirname(destPath));
			await fs.writeFile(destPath, content);
		}
	}
}

async function injectCoolifyStub(appName: string, port: number): Promise<void> {
	const coolifyDir = path.join(MONOREPO_ROOT, "infra", "coolify");
	await fs.ensureDir(coolifyDir);

	const stubPath = path.join(coolifyDir, `${appName}.yaml`);
	const stubContent = [
		"# Coolify deployment stub for ${appName}",
		'version: "3.8"',
		"services:",
		`  ${appName}:`,
		"    build:",
		"      context: ../..",
		"      dockerfile: apps/${appName}/Dockerfile",
		"    ports:",
		`      - "${port}:${port}"`,
		"    environment:",
		"      - NODE_ENV=production",
	].join("\n");

	await fs.writeFile(stubPath, stubContent);
	console.log(chalk.gray(`  Added Coolify stub: infra/coolify/${appName}.yaml`));
}

async function injectAgentConfig(targetDir: string, aiAgentConfig: string): Promise<void> {
	const configs = AI_AGENT_CONFIGS[aiAgentConfig];
	if (!configs) {
		return;
	}

	for (const [filename, content] of Object.entries(configs)) {
		await fs.writeFile(path.join(targetDir, filename), content);
	}
	console.log(chalk.gray(`  Added AI agent config: ${aiAgentConfig}`));
}

function isTextFile(filename: string): boolean {
	const textExtensions = [
		".ts",
		".js",
		".json",
		".md",
		".yaml",
		".yml",
		".toml",
		".env",
		".txt",
		".css",
		".html",
		".prisma",
	];
	const ext = path.extname(filename);
	return textExtensions.includes(ext);
}
