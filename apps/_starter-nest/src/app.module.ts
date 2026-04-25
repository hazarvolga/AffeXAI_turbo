import { AuthModule } from "@affex/auth-core/nestjs";
import { QueueModule } from "@affex/queue-core/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import databaseConfig from "./config/database";
import redisConfig from "./config/redis";
import { HealthModule } from "./health/health.module";
import { UsersModule } from "./users/users.module";

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
