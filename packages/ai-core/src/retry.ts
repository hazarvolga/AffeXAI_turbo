import { DEFAULT_RETRY_CONFIG } from "./types.js";
import type { RetryConfig } from "./types.js";

export class RetriableError extends Error {
	public readonly statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = "RetriableError";
		this.statusCode = statusCode;
	}
}

function isRetriableStatusCode(status: number): boolean {
	return status === 429 || (status >= 500 && status < 600);
}

function calculateDelay(attempt: number, config: RetryConfig): number {
	const baseDelay = config.initialDelayMs * config.backoffMultiplier ** attempt;
	const jitter = Math.random() * 0.3 * baseDelay;
	const delay = baseDelay + jitter;
	return Math.min(delay, config.maxDelayMs);
}

export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	config: Partial<RetryConfig> = {},
): Promise<T> {
	const fullConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

	let lastError: unknown;

	for (let attempt = 0; attempt <= fullConfig.maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error: unknown) {
			lastError = error;

			const statusCode =
				error instanceof RetriableError
					? error.statusCode
					: typeof error === "object" && error !== null && "status" in error
						? (error as { status: number }).status
						: 0;

			if (!isRetriableStatusCode(statusCode) || attempt === fullConfig.maxRetries) {
				throw error;
			}

			const delay = calculateDelay(attempt, fullConfig);
			console.warn(
				`[ai-core] Retry attempt ${attempt + 1}/${fullConfig.maxRetries} after ${Math.round(delay)}ms (status: ${statusCode})`,
			);

			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw lastError;
}
