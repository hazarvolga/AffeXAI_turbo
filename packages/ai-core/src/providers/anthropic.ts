import Anthropic from "@anthropic-ai/sdk";
import type { LLMConfig, LLMMessage, LLMOptions, LLMResponse } from "../types.js";

export function createAnthropicProvider(config: LLMConfig) {
	const client = new Anthropic({
		apiKey: config.apiKey,
		baseURL: config.baseUrl,
	});

	async function chat(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
		const systemMessage = messages.find((m) => m.role === "system");
		const nonSystemMessages = messages.filter((m) => m.role !== "system");

		const response = await client.messages.create({
			model: config.model,
			max_tokens: options?.maxTokens ?? 1024,
			system: systemMessage?.content,
			messages: nonSystemMessages.map((m) => ({
				role: m.role as "user" | "assistant",
				content: m.content,
			})),
			temperature: options?.temperature,
			top_p: options?.topP,
			stop_sequences: options?.stopSequences,
		});

		const textBlock = response.content.find((block) => block.type === "text");

		return {
			content: textBlock && "text" in textBlock ? textBlock.text : "",
			model: response.model,
			usage: {
				promptTokens: response.usage.input_tokens,
				completionTokens: response.usage.output_tokens,
				totalTokens: response.usage.input_tokens + response.usage.output_tokens,
			},
			finishReason: response.stop_reason ?? "unknown",
		};
	}

	return { chat };
}
