export type LLMProvider = "openai" | "anthropic" | "ollama";

export interface LLMMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface LLMOptions {
	temperature?: number;
	maxTokens?: number;
	topP?: number;
	stopSequences?: string[];
	responseFormat?: { type: "text" } | { type: "json_object" };
}

export interface LLMResponse {
	content: string;
	model: string;
	usage: {
		promptTokens: number;
		completionTokens: number;
		totalTokens: number;
	};
	finishReason: string;
}

export interface LLMConfig {
	provider: LLMProvider;
	model: string;
	apiKey: string;
	baseUrl?: string;
}

export interface RetryConfig {
	maxRetries: number;
	initialDelayMs: number;
	maxDelayMs: number;
	backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
	maxRetries: 3,
	initialDelayMs: 1000,
	maxDelayMs: 10000,
	backoffMultiplier: 2,
};
