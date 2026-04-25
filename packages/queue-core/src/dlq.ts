import { type Job, Queue, QueueEvents } from "bullmq";
import type { QueueConfig } from "./types";

const DLQ_SUFFIX = ":dead-letter";

export class DLQ {
	private queues: Map<string, Queue> = new Map();
	private queueEvents: Map<string, QueueEvents> = new Map();

	private getDLQName(queueName: string): string {
		return `${queueName}${DLQ_SUFFIX}`;
	}

	private getDLQ(config: QueueConfig): Queue {
		const dlqName = this.getDLQName(config.name);
		const existing = this.queues.get(dlqName);
		if (existing) {
			return existing;
		}

		const queue = new Queue(dlqName, {
			connection: {
				host: config.redis.host,
				port: config.redis.port,
				password: config.redis.password,
				db: config.redis.db,
			},
		});
		this.queues.set(dlqName, queue);
		return queue;
	}

	async onFailed(
		config: QueueConfig,
		handler?: (jobId: string, failedReason: string) => void,
	): Promise<void> {
		const queueEvents = new QueueEvents(config.name, {
			connection: {
				host: config.redis.host,
				port: config.redis.port,
				password: config.redis.password,
				db: config.redis.db,
			},
		});

		this.queueEvents.set(config.name, queueEvents);

		queueEvents.on("failed", async ({ jobId, failedReason }) => {
			if (handler) {
				handler(jobId, failedReason);
			}
			const dlq = this.getDLQ(config);
			await dlq.add(jobId, { originalQueue: config.name, jobId, failedReason });
		});
	}

	async retryAll(config: QueueConfig): Promise<number> {
		const dlq = this.getDLQ(config);
		const jobs = await dlq.getJobs(["waiting", "delayed", "completed", "failed"]);
		const originalQueue = new Queue(config.name, {
			connection: {
				host: config.redis.host,
				port: config.redis.port,
				password: config.redis.password,
				db: config.redis.db,
			},
		});

		let retried = 0;
		for (const job of jobs) {
			if (job.data) {
				await originalQueue.add(job.name || "retry", job.data, {
					attempts: 3,
					backoff: { type: "exponential", delay: 1000 },
				});
				await job.remove();
				retried++;
			}
		}

		return retried;
	}

	async discardAll(config: QueueConfig): Promise<number> {
		const dlq = this.getDLQ(config);
		const jobs = await dlq.getJobs(["waiting", "delayed", "completed", "failed"]);
		let discarded = 0;
		for (const job of jobs) {
			await job.remove();
			discarded++;
		}
		return discarded;
	}

	async getDeadLetterJobs(config: QueueConfig, start = 0, end = -1): Promise<Job[]> {
		const dlq = this.getDLQ(config);
		return dlq.getFailed(start, end);
	}

	async getDeadLetterCount(config: QueueConfig): Promise<number> {
		const dlq = this.getDLQ(config);
		const counts = await dlq.getJobCounts("failed", "completed", "waiting", "delayed");
		return counts.failed + counts.completed + counts.waiting + counts.delayed;
	}

	async close(): Promise<void> {
		for (const queue of this.queues.values()) {
			await queue.close();
		}
		for (const events of this.queueEvents.values()) {
			await events.close();
		}
		this.queues.clear();
		this.queueEvents.clear();
	}
}
