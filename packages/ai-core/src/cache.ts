import type { LLMMessage, LLMOptions, LLMResponse } from "./types.js";

const DEFAULT_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
	response: LLMResponse;
	expiresAt: number;
}

function hashInput(input: string): string {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		const char = input.charCodeAt(i);
		hash = ((hash << 5) - hash + char) | 0;
	}
	return hash.toString(36);
}

export function generateCacheKey(messages: LLMMessage[], options?: LLMOptions): string {
	const raw = JSON.stringify({ messages, options });
	return hashInput(raw);
}

export class LLMCache {
	private store = new Map<string, CacheEntry>();

	get(key: string): LLMResponse | null {
		const entry = this.store.get(key);
		if (!entry) return null;
		if (Date.now() > entry.expiresAt) {
			this.store.delete(key);
			return null;
		}
		return entry.response;
	}

	set(key: string, response: LLMResponse, ttlMs: number = DEFAULT_TTL_MS): void {
		this.store.set(key, {
			response,
			expiresAt: Date.now() + ttlMs,
		});
	}

	clear(): void {
		this.store.clear();
	}

	delete(key: string): void {
		this.store.delete(key);
	}
}
