import OpenAI from "openai";
import type { LLMConfig, LLMMessage, LLMOptions, LLMResponse } from "../types.js";

export function createOllamaProvider(config: LLMConfig) {
	const client = new OpenAI.OpenAI({
		apiKey: config.apiKey || "ollama",
		baseURL: config.baseUrl || "http://localhost:11434/v1",
	});

	const model = config.model || "llama3.2";

	async function chat(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
		const response = await client.chat.completions.create({
			model,
			messages: messages.map((m) => ({
				role: m.role,
				content: m.content,
			})),
			temperature: options?.temperature,
			max_tokens: options?.maxTokens,
			top_p: options?.topP,
			stop: options?.stopSequences,
			stream: false,
		});

		const choice = response.choices[0];

		return {
			content: choice?.message?.content ?? "",
			model: response.model,
			usage: {
				promptTokens: response.usage?.prompt_tokens ?? 0,
				completionTokens: response.usage?.completion_tokens ?? 0,
				totalTokens: response.usage?.total_tokens ?? 0,
			},
			finishReason: choice?.finish_reason ?? "unknown",
		};
	}

	return { chat };
}
