import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export function createPrismaClient(options?: { url?: string }) {
	if (globalForPrisma.prisma && !options?.url) {
		return globalForPrisma.prisma;
	}
	const client = new PrismaClient({
		datasourceUrl: options?.url ?? process.env.DATABASE_URL,
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
	});
	if (!options?.url) {
		globalForPrisma.prisma = client;
	}
	return client;
}

export type { PrismaClient };
