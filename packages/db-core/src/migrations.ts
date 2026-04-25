import { execSync } from "node:child_process";

export function runMigration(name: string): void {
	execSync(`npx prisma migrate dev --name ${name}`, { stdio: "inherit" });
}

export function resetDatabase(): void {
	execSync("npx prisma migrate reset --force", { stdio: "inherit" });
}

export function generateClient(): void {
	execSync("npx prisma generate", { stdio: "inherit" });
}

export function pushSchema(): void {
	execSync("npx prisma db push", { stdio: "inherit" });
}