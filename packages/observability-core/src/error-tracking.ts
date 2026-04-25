import type pino from "pino";
import { createLogger } from "./logger.js";

export interface ErrorTrackerConfig {
	logger?: pino.Logger;
	onError?: (error: Error, context?: Record<string, unknown>) => void;
}

export interface ErrorTracker {
	track(error: Error, context?: Record<string, unknown>): void;
	wrapAsync<TArgs extends unknown[], TResult>(
		fn: (...args: TArgs) => Promise<TResult>,
	): (...args: TArgs) => Promise<TResult>;
}

class ErrorTrackerImpl implements ErrorTracker {
	private logger: pino.Logger;
	private onError?: (error: Error, context?: Record<string, unknown>) => void;

	constructor(config?: ErrorTrackerConfig) {
		this.logger = config?.logger ?? createLogger({ name: "error-tracker" });
		this.onError = config?.onError;
	}

	track(error: Error, context?: Record<string, unknown>): void {
		this.logger.error(
			{
				err: error,
				context,
				errorName: error.name,
				errorMessage: error.message,
			},
			`Error tracked: ${error.message}`,
		);

		if (this.onError) {
			this.onError(error, context);
		}
	}

	wrapAsync<TArgs extends unknown[], TResult>(
		fn: (...args: TArgs) => Promise<TResult>,
	): (...args: TArgs) => Promise<TResult> {
		return async (...args: TArgs): Promise<TResult> => {
			try {
				return await fn(...args);
			} catch (error) {
				this.track(error instanceof Error ? error : new Error(String(error)));
				throw error;
			}
		};
	}
}

export function createErrorTracker(config?: ErrorTrackerConfig): ErrorTracker {
	return new ErrorTrackerImpl(config);
}

export function trackError(
	error: Error,
	context?: Record<string, unknown>,
	logger?: pino.Logger,
): void {
	const log = logger ?? createLogger({ name: "error-tracker" });
	log.error(
		{
			err: error,
			context,
			errorName: error.name,
			errorMessage: error.message,
		},
		`Error tracked: ${error.message}`,
	);
}
