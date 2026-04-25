import inquirer from "inquirer";
import type { QuestionCollection } from "inquirer";

export interface AppConfig {
	name: string;
	template: string;
	features: string[];
	deploy: string;
	aiAgentConfig: string;
}

const KEBAB_CASE_REGEX = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const questions: QuestionCollection = [
	{
		type: "input",
		name: "name",
		message: "Project name (kebab-case):",
		validate: (input: string): string | boolean => {
			if (!input.trim()) {
				return "Project name is required";
			}
			if (!KEBAB_CASE_REGEX.test(input)) {
				return "Must be kebab-case (lowercase, hyphens, no leading hyphen)";
			}
			return true;
		},
	},
	{
		type: "list",
		name: "template",
		message: "Select a template:",
		choices: [
			{ name: "NestJS SaaS", value: "nest-saas" },
			{ name: "Next.js App", value: "next-app" },
			{ name: "NestJS Microservice", value: "nest-microservice" },
			{ name: "AI Agent", value: "ai-agent" },
		],
		default: "nest-saas",
	},
	{
		type: "checkbox",
		name: "features",
		message: "Select features:",
		choices: [
			{ name: "Auth", value: "auth", checked: true },
			{ name: "Billing", value: "billing", checked: false },
			{ name: "AI", value: "ai", checked: true },
			{ name: "Notifications", value: "notifications", checked: true },
			{ name: "Queue", value: "queue", checked: true },
			{ name: "UI Kit", value: "ui-kit", checked: true },
		],
	},
	{
		type: "list",
		name: "deploy",
		message: "Deployment target:",
		choices: [
			{ name: "Coolify", value: "coolify" },
			{ name: "None (manual)", value: "none" },
		],
		default: "coolify",
	},
	{
		type: "list",
		name: "aiAgentConfig",
		message: "AI agent configuration:",
		choices: [
			{ name: "Claude + Aider + OpenHands", value: "claude+aider+openhands" },
			{ name: "Claude only", value: "claude-only" },
			{ name: "None", value: "none" },
		],
		default: "claude+aider+openhands",
	},
];

export async function prompts(): Promise<AppConfig> {
	const answers = await inquirer.prompt(questions);
	return answers as AppConfig;
}
