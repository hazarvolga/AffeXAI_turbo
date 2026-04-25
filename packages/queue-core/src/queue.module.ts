import { type DynamicModule, Module, type Provider } from "@nestjs/common";
import type { Processor } from "bullmq";
import { createQueue, createWorker } from "./factory";
import type { QueueConfig } from "./types";

export const QUEUE_CONFIGS = "QUEUE_CONFIGS";
export const QUEUE_PREFIX = "BULLMQ_QUEUE_";

export function getQueueToken(name: string): string {
	return `${QUEUE_PREFIX}${name}`;
}

@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: NestJS dynamic modules require static methods
export class QueueModule {
	static register(configs: QueueConfig[]): DynamicModule {
		const providers: Provider[] = configs.map((config) => ({
			provide: getQueueToken(config.name),
			useFactory: () => createQueue(config),
		}));

		return {
			module: QueueModule,
			providers,
			exports: providers,
		};
	}

	static registerQueue(config: QueueConfig, processor?: Processor): DynamicModule {
		const providers: Provider[] = [
			{
				provide: getQueueToken(config.name),
				useFactory: () => createQueue(config),
			},
		];

		if (processor) {
			providers.push({
				provide: `${getQueueToken(config.name)}_WORKER`,
				useFactory: () => createWorker(config, processor),
			});
		}

		return {
			module: QueueModule,
			providers,
			exports: providers,
		};
	}
}
