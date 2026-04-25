export interface ObservabilityTracerConfig {
	publicKey?: string;
	secretKey?: string;
	baseUrl?: string;
}

export interface ObservabilityTracer {
	trace(name: string, metadata?: Record<string, unknown>): string;
	logEvent(traceId: string, name: string, metadata?: Record<string, unknown>): void;
	logLLMCall(
		traceId: string,
		provider: string,
		model: string,
		input: unknown,
		output: unknown,
		latencyMs: number,
	): void;
}

class NoOpTracer implements ObservabilityTracer {
	trace(_name: string, _metadata?: Record<string, unknown>): string {
		return "";
	}

	logEvent(_traceId: string, _name: string, _metadata?: Record<string, unknown>): void {}

	logLLMCall(
		_traceId: string,
		_provider: string,
		_model: string,
		_input: unknown,
		_output: unknown,
		_latencyMs: number,
	): void {}
}

class LangfuseTracerImpl implements ObservabilityTracer {
	private publicKey: string;
	private secretKey: string;
	private baseUrl: string;
	private traces: Map<string, { name: string; events: unknown[]; generations: unknown[] }>;

	constructor(config: ObservabilityTracerConfig) {
		this.publicKey = config.publicKey ?? "";
		this.secretKey = config.secretKey ?? "";
		this.baseUrl = config.baseUrl ?? "https://cloud.langfuse.com";
		this.traces = new Map();
	}

	trace(name: string, metadata?: Record<string, unknown>): string {
		const traceId = `trace_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
		this.traces.set(traceId, { name, events: [metadata], generations: [] });
		return traceId;
	}

	logEvent(traceId: string, name: string, metadata?: Record<string, unknown>): void {
		const trace = this.traces.get(traceId);
		if (trace) {
			trace.events.push({ name, metadata });
		}
	}

	logLLMCall(
		traceId: string,
		provider: string,
		model: string,
		input: unknown,
		output: unknown,
		latencyMs: number,
	): void {
		const trace = this.traces.get(traceId);
		if (trace) {
			trace.generations.push({
				name: `${provider}/${model}`,
				input,
				output,
				metadata: { provider, model, latencyMs },
			});
		}
	}
}

export function createObservabilityTracer(config?: ObservabilityTracerConfig): ObservabilityTracer {
	if (!config?.publicKey || !config?.secretKey) {
		return new NoOpTracer();
	}

	return new LangfuseTracerImpl(config);
}
