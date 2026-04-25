# @affex/queue-core

BullMQ typed wrapper with job factories and dead letter queue for the affexaiFactory monorepo.

## Usage

### Create a Queue and Worker

```typescript
import { createQueue, createWorker } from "@affex/queue-core";

const config = {
	name: "email",
	redis: { host: "localhost", port: 6379 },
};

const queue = createQueue(config);
const worker = createWorker(config, async (job) => {
	console.log(`Processing ${job.name}:`, job.data);
	return { success: true };
});
```

### Add a Typed Job

```typescript
import { createQueue, createJob } from "@affex/queue-core";
import type { JobConfig, JobResult } from "@affex/queue-core";

const queue = createQueue<{ to: string; subject: string }>(config);

await createJob(queue, {
	name: "send-email",
	data: { to: "user@example.com", subject: "Hello" },
	opts: { attempts: 3, backoff: { type: "exponential", delay: 1000 } },
});
```

### Queue Events

```typescript
import { createQueueEvents } from "@affex/queue-core";

const events = createQueueEvents(config);
events.on("completed", ({ jobId }) => console.log(`Job ${jobId} completed`));
events.on("failed", ({ jobId, failedReason }) => console.log(`Job ${jobId} failed: ${failedReason}`));
```

### Dead Letter Queue

```typescript
import { DLQ } from "@affex/queue-core/dlq";

const dlq = new DLQ();

// Register failure handler — moves failed jobs to DLQ automatically
await dlq.onFailed(config, (jobId, reason) => {
	console.log(`Job ${jobId} moved to DLQ: ${reason}`);
});

// Query DLQ
const count = await dlq.getDeadLetterCount(config);
const jobs = await dlq.getDeadLetterJobs(config, 0, 9);

// Retry all DLQ jobs back to the original queue
const retried = await dlq.retryAll(config);

// Discard all DLQ jobs
const discarded = await dlq.discardAll(config);

// Clean up
await dlq.close();
```

### NestJS Integration

```typescript
import { QueueModule } from "@affex/queue-core/nestjs";

@Module({
	imports: [
		QueueModule.register([
			{ name: "email", redis: { host: "localhost", port: 6379 } },
			{ name: "notifications", redis: { host: "localhost", port: 6379 } },
		]),
	],
})
export class AppModule {}

// Register a single queue with an optional worker processor
@Module({
	imports: [
		QueueModule.registerQueue(
			{ name: "email", redis: { host: "localhost", port: 6379 } },
			async (job) => { /* process */ },
		),
	],
})
export class EmailModule {}
```

## Exports

- `@affex/queue-core` — All public types, factory, and DLQ
- `@affex/queue-core/types` — Type definitions only
- `@affex/queue-core/factory` — Queue, Worker, and QueueEvents factories
- `@affex/queue-core/dlq` — Dead letter queue handler
- `@affex/queue-core/nestjs` — NestJS dynamic module