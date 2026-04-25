import pino from "pino";

export interface LoggerOptions {
	name?: string;
	level?: string;
	pretty?: boolean;
}

const isDevelopment = (): boolean => {
	return process.env.NODE_ENV !== "production";
};

export function createLogger(options?: LoggerOptions): pino.Logger {
	const name = options?.name ?? "affex";
	const level = options?.level ?? (isDevelopment() ? "debug" : "info");
	const pretty = options?.pretty ?? isDevelopment();

	const transport = pretty
		? {
				target: "pino-pretty",
				options: {
					colorize: true,
				},
			}
		: undefined;

	return pino({
		name,
		level,
		transport: transport ?? undefined,
	});
}

export function createChildLogger(
	parent: pino.Logger,
	context: Record<string, unknown>,
): pino.Logger {
	return parent.child(context);
}
