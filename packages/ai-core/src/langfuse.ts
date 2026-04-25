import Langfuse from "langfuse";
import type { LLMMessage, LLMResponse } from "./types.js";

export interface LangfuseTracerConfig {
	publicKey?: string;
	secretKey?: string;
	baseUrl?: string;
}

export interface LangfuseTracer {
	trace(name: string, metadata?: Record<string, unknown>): string;
	traceLLMCall(params: {
		provider: string;
		model: string;
		messages: LLMMessage[];
		response: LLMResponse;
		latencyMs: number;
		traceId?: string;
	}): void;
	flush(): Promise<void>;
}

class NoOpTracer implements LangfuseTracer {
	trace(_name: string, _metadata?: Record<string, unknown>): string {
		return "";
	}

	traceLLMCall(_params: {
		provider: string;
		model: string;
		messages: LLMMessage[];
		response: LLMResponse;
		latencyMs: number;
		traceId?: string;
	}): void {}

	async flush(): Promise<void> {}
}

class LangfuseTracerImpl implements LangfuseTracer {
	private langfuse: Langfuse;

	constructor(config: LangfuseTracerConfig) {
		this.langfuse = new Langfuse({
			publicKey: config.publicKey,
			secretKey: config.secretKey,
			baseUrl: config.baseUrl,
		});
	}

	trace(name: string, metadata?: Record<string, unknown>): string {
		const trace = this.langfuse.trace({ name, metadata });
		return trace.id;
	}

	traceLLMCall(params: {
		provider: string;
		model: string;
		messages: LLMMessage[];
		response: LLMResponse;
		latencyMs: number;
		traceId?: string;
	}): void {
		const { provider, model, messages, response, latencyMs, traceId } = params;

		const trace = traceId
			? this.langfuse.trace({ id: traceId, name: `${provider}/${model}` })
			: this.langfuse.trace({ name: `${provider}/${model}` });

		trace.generation({
			name: `${provider}/${model}`,
			input: messages,
			output: response.content,
			metadata: {
				model,
				provider,
				latencyMs,
				usage: response.usage,
				finishReason: response.finishReason,
			},
		});
	}

	async flush(): Promise<void> {
		await this.langfuse.shutdownAsync();
	}
}

export function createLangfuseTracer(config?: LangfuseTracerConfig): LangfuseTracer {
	if (!config?.publicKey || !config?.secretKey) {
		return new NoOpTracer();
	}

	return new LangfuseTracerImpl(config);
}
