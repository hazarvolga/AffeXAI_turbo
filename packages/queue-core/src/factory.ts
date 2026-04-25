import { type Processor, Queue, QueueEvents, Worker } from "bullmq";
import type { JobConfig, QueueConfig } from "./types";

export function buildRedisConfig(config: QueueConfig) {
	return {
		host: config.redis.host,
		port: config.redis.port,
		password: config.redis.password,
		db: config.redis.db,
	};
}

export function createQueue<T = unknown>(config: QueueConfig): Queue<T> {
	return new Queue<T>(config.name, {
		connection: buildRedisConfig(config),
		defaultJobOptions: {
			removeOnComplete: true,
			removeOnFail: false,
		},
	});
}

export function createWorker<T = unknown>(config: QueueConfig, processor: Processor<T>): Worker<T> {
	return new Worker<T>(config.name, processor, {
		connection: buildRedisConfig(config),
	});
}

export function createQueueEvents(config: QueueConfig): QueueEvents {
	return new QueueEvents(config.name, {
		connection: buildRedisConfig(config),
	});
}

export function createJob<T = unknown>(queue: Queue<T>, jobConfig: JobConfig<T>) {
	// BullMQ uses internal ExtractNameType/ExtractDataType generics that
	// don't compose well with external wrappers, so we cast through unknown.
	return (
		queue.add as (name: string, data: T, opts?: JobConfig<T>["opts"]) => ReturnType<Queue<T>["add"]>
	)(jobConfig.name, jobConfig.data, jobConfig.opts);
}
