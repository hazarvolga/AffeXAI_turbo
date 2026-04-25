import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { createLogger } from "@affex/observability-core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const pinoLogger = createLogger({ name: "starter-nest" });
	const app = await NestFactory.create(AppModule, {
		logger: new Logger(),
	});

	app.enableCors();
	app.useGlobalPipes(
		new (await import("@nestjs/common")).ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const port = process.env.PORT ?? 3001;
	await app.listen(port);
	pinoLogger.info(`🚀 starter-nest running on http://localhost:${port}`);
}

bootstrap();