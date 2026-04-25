import { LLMCache, generateCacheKey } from "./cache.js";
import { createLangfuseTracer } from "./langfuse.js";
import type { LangfuseTracerConfig } from "./langfuse.js";
import { createAnthropicProvider } from "./providers/anthropic.js";
import { createOllamaProvider } from "./providers/ollama.js";
import { createOpenAIProvider } from "./providers/openai.js";
import { retryWithBackoff } from "./retry.js";
import type { LLMConfig, LLMMessage, LLMOptions, LLMResponse, RetryConfig } from "./types.js";
import { DEFAULT_RETRY_CONFIG } from "./types.js";

export interface LLMClientOptions {
	retry?: Partial<RetryConfig>;
	cache?: boolean | LLMCache;
	langfuse?: LangfuseTracerConfig;
}

function createProvider(config: LLMConfig) {
	switch (config.provider) {
		case "openai":
			return createOpenAIProvider(config);
		case "anthropic":
			return createAnthropicProvider(config);
		case "ollama":
			return createOllamaProvider(config);
		default:
			throw new Error(`Unsupported provider: ${config.provider}`);
	}
}

export function createLLMClient(config: LLMConfig, options?: LLMClientOptions) {
	const provider = createProvider(config);
	const tracer = createLangfuseTracer(options?.langfuse);
	const cache =
		options?.cache === true
			? new LLMCache()
			: options?.cache instanceof LLMCache
				? options.cache
				: null;
	const retryConfig: RetryConfig = {
		...DEFAULT_RETRY_CONFIG,
		...options?.retry,
	};

	async function chat(messages: LLMMessage[], llmOptions?: LLMOptions): Promise<LLMResponse> {
		const cacheKey = cache ? generateCacheKey(messages, llmOptions) : "";
		if (cache) {
			const cached = cache.get(cacheKey);
			if (cached) return cached;
		}

		const startTime = Date.now();

		const response = await retryWithBackoff(() => provider.chat(messages, llmOptions), retryConfig);

		const latencyMs = Date.now() - startTime;

		tracer.traceLLMCall({
			provider: config.provider,
			model: config.model,
			messages,
			response,
			latencyMs,
		});

		if (cache) {
			cache.set(cacheKey, response);
		}

		return response;
	}

	return { chat };
}
