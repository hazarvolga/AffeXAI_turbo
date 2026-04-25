import { beforeAll, afterAll } from "vitest";

export interface VitestSetupOptions {
	/**
	 * Enable MSW server interception.
	 * @default true
	 */
 enableMsw?: boolean;
	/**
	 * Enable global test timeout overrides (ms).
	 * @default 10000
	 */
 globalTimeout?: number;
}

const DEFAULT_OPTIONS: Required<VitestSetupOptions> = {
	enableMsw: true,
	globalTimeout: 10_000,
};

let mswServer: Awaited<ReturnType<typeof import("msw/node").setupServer>> | null = null;

export async function setup(options?: VitestSetupOptions): Promise<void> {
	const opts = { ...DEFAULT_OPTIONS, ...options };

	beforeAll(async () => {
		if (opts.enableMsw) {
			const { setupServer } = await import("msw/node");
			mswServer = setupServer();
			mswServer.listen({ onUnhandledRequest: "warn" });
		}
	});

	afterAll(() => {
		if (mswServer) {
			mswServer.close();
			mswServer = null;
		}
	});
}

export function getMswServer() {
	if (!mswServer) {
		throw new Error(
			"MSW server not initialized. Call setup() with enableMsw: true in your vitest setup file.",
		);
	}
	return mswServer;
}

export function teardown(): void {
	if (mswServer) {
		mswServer.close();
		mswServer = null;
	}
}