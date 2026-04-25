import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@affex/auth-core/nestjs";
import { QueueModule } from "@affex/queue-core/nestjs";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { HealthModule } from "./health/health.module";
import databaseConfig from "./config/database";
import redisConfig from "./config/redis";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig, redisConfig],
		}),
		AuthModule.register({
			secret: process.env.JWT_SECRET ?? "change-me-in-production",
		}),
		QueueModule.register([]),
		UsersModule,
		HealthModule,
	],
	controllers: [AppController],
})
export class AppModule {}