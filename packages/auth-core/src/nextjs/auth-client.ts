import type { AuthResponse } from "@affex/shared-types";

export interface AuthClientConfig {
	baseUrl: string;
	storage?: Storage;
}

const NOOP_STORAGE: Storage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {},
	clear: () => {},
	length: 0,
	key: () => null,
};

function getStorage(storage?: Storage): Storage {
	if (storage) return storage;
	if (typeof globalThis !== "undefined" && "localStorage" in globalThis) {
		return globalThis.localStorage;
	}
	return NOOP_STORAGE;
}

export class AuthClient {
	private readonly baseUrl: string;
	private readonly storage: Storage;

	constructor(config: AuthClientConfig) {
		this.baseUrl = config.baseUrl;
		this.storage = getStorage(config.storage);
	}

	async signIn(email: string, password: string): Promise<AuthResponse> {
		const response = await fetch(`${this.baseUrl}/api/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			throw new AuthError(`Sign in failed: ${response.statusText}`, response.status);
		}

		const data = (await response.json()) as AuthResponse;
		this.storage.setItem("accessToken", data.accessToken);
		this.storage.setItem("refreshToken", data.refreshToken);
		return data;
	}

	async signUp(name: string, email: string, password: string): Promise<AuthResponse> {
		const response = await fetch(`${this.baseUrl}/api/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		});

		if (!response.ok) {
			throw new AuthError(`Sign up failed: ${response.statusText}`, response.status);
		}

		const data = (await response.json()) as AuthResponse;
		this.storage.setItem("accessToken", data.accessToken);
		this.storage.setItem("refreshToken", data.refreshToken);
		return data;
	}

	signOut(): void {
		this.storage.removeItem("accessToken");
		this.storage.removeItem("refreshToken");
	}

	async refreshAccessToken(): Promise<AuthResponse> {
		const refreshToken = this.storage.getItem("refreshToken");
		if (!refreshToken) {
			throw new AuthError("No refresh token available", 401);
		}

		const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) {
			this.signOut();
			throw new AuthError(`Token refresh failed: ${response.statusText}`, response.status);
		}

		const data = (await response.json()) as AuthResponse;
		this.storage.setItem("accessToken", data.accessToken);
		this.storage.setItem("refreshToken", data.refreshToken);
		return data;
	}

	getSession(): { accessToken: string | null; refreshToken: string | null } {
		const accessToken = this.storage.getItem("accessToken");
		const refreshToken = this.storage.getItem("refreshToken");
		if (!accessToken && !refreshToken) {
			return { accessToken: null, refreshToken: null };
		}
		return { accessToken, refreshToken };
	}
}

export class AuthError extends Error {
	constructor(
		message: string,
		public readonly status: number,
	) {
		super(message);
		this.name = "AuthError";
	}
}

export function createAuthClient(config: AuthClientConfig): AuthClient {
	return new AuthClient(config);
}
