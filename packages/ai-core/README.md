# @affex/ai-core

Multi-provider LLM client with retry, caching, and Langfuse tracing.

## Installation

```bash
pnpm add @affex/ai-core
```

## Usage

### OpenAI

```typescript
import { createLLMClient } from "@affex/ai-core";

const client = createLLMClient({
	provider: "openai",
	model: "gpt-4o",
	apiKey: process.env.OPENAI_API_KEY,
});

const response = await client.chat([
	{ role: "system", content: "You are a helpful assistant." },
	{ role: "user", content: "Hello!" },
]);
console.log(response.content);
```

### Anthropic

```typescript
import { createLLMClient } from "@affex/ai-core";

const client = createLLMClient({
	provider: "anthropic",
	model: "claude-sonnet-4-20250514",
	apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await client.chat([
	{ role: "user", content: "Explain quantum computing." },
]);
```

### Local Ollama

```typescript
import { createLLMClient } from "@affex/ai-core";

const client = createLLMClient({
	provider: "ollama",
	model: "llama3.2",
	apiKey: "ollama",
});

const response = await client.chat([
	{ role: "user", content: "Summarize this text." },
]);
```

### Retry Configuration

```typescript
import { createLLMClient } from "@affex/ai-core";

const client = createLLMClient(
	{
		provider: "openai",
		model: "gpt-4o",
		apiKey: process.env.OPENAI_API_KEY,
	},
	{
		retry: {
			maxRetries: 5,
			initialDelayMs: 2000,
			maxDelayMs: 30000,
			backoffMultiplier: 2,
		},
	},
);
```

### Caching

```typescript
import { createLLMClient, LLMCache } from "@affex/ai-core";

const cache = new LLMCache();

const client = createLLMClient(
	{
		provider: "openai",
		model: "gpt-4o",
		apiKey: process.env.OPENAI_API_KEY,
	},
	{ cache },
);

// First call hits the provider
const response1 = await client.chat([{ role: "user", content: "Hello" }]);
// Second call returns cached response
const response2 = await client.chat([{ role: "user", content: "Hello" }]);

// Manual cache operations
cache.delete("some-key");
cache.clear();
```

### Langfuse Tracing

```typescript
import { createLLMClient } from "@affex/ai-core";

const client = createLLMClient(
	{
		provider: "openai",
		model: "gpt-4o",
		apiKey: process.env.OPENAI_API_KEY,
	},
	{
		langfuse: {
			publicKey: process.env.LANGFUSE_PUBLIC_KEY,
			secretKey: process.env.LANGFUSE_SECRET_KEY,
			baseUrl: process.env.LANGFUSE_BASE_URL,
		},
	},
);

// All chat calls are automatically traced to Langfuse
const response = await client.chat([{ role: "user", content: "Hello" }]);
```

## Exports

| Module | Description |
|--------|-------------|
| `@affex/ai-core` | Barrel export of all modules |
| `@affex/ai-core/providers/openai` | OpenAI provider |
| `@affex/ai-core/providers/anthropic` | Anthropic provider |
| `@affex/ai-core/providers/ollama` | Ollama (local) provider |
| `@affex/ai-core/retry` | Retry with exponential backoff |
| `@affex/ai-core/cache` | In-memory response cache |
| `@affex/ai-core/langfuse` | Langfuse tracing adapter |
| `@affex/ai-core/client` | Multi-provider LLM factory |