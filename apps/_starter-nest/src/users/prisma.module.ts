import { createPrismaClient } from "@affex/db-core";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	providers: [
		{
			provide: "PRISMA_CLIENT",
			useFactory: () => createPrismaClient(),
		},
	],
	exports: ["PRISMA_CLIENT"],
})
export class PrismaModule {}
