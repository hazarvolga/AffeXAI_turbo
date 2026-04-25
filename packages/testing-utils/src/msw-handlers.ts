import { http, type HttpHandler, HttpResponse } from "msw";

// --- Auth mock data ---

interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		email: string;
		name: string;
	};
}

interface User {
	id: string;
	email: string;
	name: string;
	createdAt: string;
}

interface TokenResponse {
	accessToken: string;
	refreshToken: string;
}

const MOCK_USER: User = {
	id: "usr_mock_001",
	email: "test@affex.dev",
	name: "Test User",
	createdAt: new Date().toISOString(),
};

const MOCK_TOKENS: TokenResponse = {
	accessToken: "mock_access_token",
	refreshToken: "mock_refresh_token",
};

const MOCK_AUTH_RESPONSE: AuthResponse = {
	...MOCK_TOKENS,
	user: MOCK_USER,
};

// --- Auth handlers ---

export function createAuthHandlers(baseUrl: string): HttpHandler[] {
	return [
		http.post(`${baseUrl}/auth/login`, async () => {
			return HttpResponse.json(MOCK_AUTH_RESPONSE, { status: 200 });
		}),

		http.post(`${baseUrl}/auth/register`, async () => {
			return HttpResponse.json(MOCK_USER, { status: 201 });
		}),

		http.post(`${baseUrl}/auth/refresh`, async () => {
			return HttpResponse.json(MOCK_TOKENS, { status: 200 });
		}),
	];
}

// --- Generic CRUD handlers ---

interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
}

export function createApiHandlers(baseUrl: string): HttpHandler[] {
	const store = new Map<string, Map<string, Record<string, unknown>>>();

	return [
		http.get(`${baseUrl}/api/:resource`, ({ params }) => {
			const { resource } = params;
			const items = store.get(String(resource)) ?? new Map();
			const data = Array.from(items.values());
			const response: PaginatedResponse<Record<string, unknown>> = {
				data,
				total: data.length,
				page: 1,
				limit: 20,
			};
			return HttpResponse.json(response, { status: 200 });
		}),

		http.get(`${baseUrl}/api/:resource/:id`, ({ params }) => {
			const { resource, id } = params;
			const items = store.get(String(resource));
			const item = items?.get(String(id));
			if (!item) {
				return HttpResponse.json({ error: "Not found" }, { status: 404 });
			}
			return HttpResponse.json(item, { status: 200 });
		}),

		http.post(`${baseUrl}/api/:resource`, async ({ params, request }) => {
			const { resource } = params;
			const body = (await request.json()) as Record<string, unknown>;
			const id = `item_${Date.now()}`;
			const item = { id, ...body };
			if (!store.has(String(resource))) {
				store.set(String(resource), new Map());
			}
			store.get(String(resource))?.set(id, item);
			return HttpResponse.json(item, { status: 201 });
		}),

		http.put(`${baseUrl}/api/:resource/:id`, async ({ params, request }) => {
			const { resource, id } = params;
			const body = (await request.json()) as Record<string, unknown>;
			const items = store.get(String(resource));
			const existing = items?.get(String(id));
			if (!existing) {
				return HttpResponse.json({ error: "Not found" }, { status: 404 });
			}
			const updated = { ...existing, ...body };
			items?.set(String(id), updated);
			return HttpResponse.json(updated, { status: 200 });
		}),

		http.delete(`${baseUrl}/api/:resource/:id`, ({ params }) => {
			const { resource, id } = params;
			const items = store.get(String(resource));
			if (!items?.has(String(id))) {
				return HttpResponse.json({ error: "Not found" }, { status: 404 });
			}
			items?.delete(String(id));
			return new HttpResponse(null, { status: 204 });
		}),
	];
}

// --- Health handlers ---

export function createHealthHandlers(baseUrl: string): HttpHandler[] {
	return [
		http.get(`${baseUrl}/health`, () => {
			return HttpResponse.json(
				{ status: "ok", timestamp: new Date().toISOString() },
				{ status: 200 },
			);
		}),
	];
}
