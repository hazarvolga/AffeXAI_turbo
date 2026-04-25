# @affex/observability-core

Structured logging (pino), Langfuse adapter, and error tracking.

## Installation

```bash
pnpm add @affex/observability-core
```

## Usage

### Structured Logging

```typescript
import { createLogger, createChildLogger } from "@affex/observability-core";

const logger = createLogger({ name: "my-service" });
logger.info("Server started");
logger.debug({ port: 3000 }, "Listening on port");

// Child logger with merged context
const requestLogger = createChildLogger(logger, { requestId: "abc-123" });
requestLogger.info("Processing request");
```

### Langfuse Tracing

```typescript
import { createObservabilityTracer } from "@affex/observability-core";

const tracer = createObservabilityTracer({
	publicKey: process.env.LANGFUSE_PUBLIC_KEY,
	secretKey: process.env.LANGFUSE_SECRET_KEY,
});

const traceId = tracer.trace("user-query", { userId: "u-1" });
tracer.logLLMCall(traceId, "openai", "gpt-4o", "Hello", "Hi!", 150);
tracer.logEvent(traceId, "response-sent", { latencyMs: 200 });

// NoOp tracer when no config provided
const noopTracer = createObservabilityTracer();
```

### Error Tracking

```typescript
import { createErrorTracker, trackError } from "@affex/observability-core";

// Simple one-off tracking
trackError(new Error("Something went wrong"), { userId: "u-1" });

// ErrorTracker instance
const tracker = createErrorTracker({
	onError: (err, ctx) => {
		// Send to external service
	},
});
tracker.track(new Error("Failed"), { step: "payment" });

// Wrap async functions
const safeFetch = tracker.wrapAsync(async (url: string) => {
	const res = await fetch(url);
	return res.json();
});
```

## Exports

| Module | Description |
|--------|-------------|
| `@affex/observability-core` | Barrel export of all modules |
| `@affex/observability-core/logger` | Pino logger factory |
| `@affex/observability-core/langfuse` | Langfuse tracing adapter |
| `@affex/observability-core/error-tracking` | Error tracking utilities |