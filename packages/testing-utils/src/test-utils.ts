import { vi } from "vitest";

/**
 * Wait for a specified number of milliseconds.
 */
export function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

/**
 * Create a mock Next.js router object.
 */
export function createMockRouter(
	overrides: Record<string, unknown> = {},
): Record<string, unknown> {
	return {
		push: vi.fn(),
		replace: vi.fn(),
		refresh: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		prefetch: vi.fn(),
		pathname: "/",
		query: {},
		asPath: "/",
		route: "/",
		isLocaleDomain: false,
		isReady: true,
		...overrides,
	};
}

/**
 * Create a mock Express/Nest request object.
 */
export function createMockRequest(
	overrides: Record<string, unknown> = {},
): Record<string, unknown> {
	return {
		body: {},
		params: {},
		query: {},
		headers: {},
		method: "GET",
		url: "/",
		ip: "127.0.0.1",
		...overrides,
	};
}

/**
 * Create a mock Express/Nest response object with chainable methods.
 */
export function createMockResponse(): Record<string, unknown> {
	const res: Record<string, unknown> = {};

	res.status = vi.fn().mockReturnValue(res);
	res.json = vi.fn().mockReturnValue(res);
	res.send = vi.fn().mockReturnValue(res);
	res.end = vi.fn().mockReturnValue(res);
	res.setHeader = vi.fn().mockReturnValue(res);
	res.redirect = vi.fn().mockReturnValue(res);
	res.clearCookie = vi.fn().mockReturnValue(res);
	res.cookie = vi.fn().mockReturnValue(res);
	res.locals = {};

	return res;
}