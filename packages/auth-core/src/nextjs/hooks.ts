import type { TokenPayload } from "@affex/shared-types";
import { useCallback, useEffect, useState } from "react";
import { decodeToken } from "../jwt.js";
import { AuthClient } from "./auth-client.js";
import type { AuthClientConfig } from "./auth-client.js";

export interface UseAuthReturn {
	user: TokenPayload | null;
	isLoading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (name: string, email: string, password: string) => Promise<void>;
	signOut: () => void;
}

export interface UseSessionReturn {
	session: { accessToken: string | null; refreshToken: string | null };
	isLoading: boolean;
}

export function useAuth(config: AuthClientConfig): UseAuthReturn {
	const [client] = useState(() => new AuthClient(config));
	const [user, setUser] = useState<TokenPayload | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const session = client.getSession();
		if (session.accessToken) {
			const payload = decodeToken(session.accessToken);
			setUser(payload);
		}
		setIsLoading(false);
	}, [client]);

	const signIn = useCallback(
		async (email: string, password: string) => {
			setIsLoading(true);
			try {
				const response = await client.signIn(email, password);
				const payload = decodeToken(response.accessToken);
				setUser(payload);
			} finally {
				setIsLoading(false);
			}
		},
		[client],
	);

	const signUp = useCallback(
		async (name: string, email: string, password: string) => {
			setIsLoading(true);
			try {
				const response = await client.signUp(name, email, password);
				const payload = decodeToken(response.accessToken);
				setUser(payload);
			} finally {
				setIsLoading(false);
			}
		},
		[client],
	);

	const signOut = useCallback(() => {
		client.signOut();
		setUser(null);
	}, [client]);

	return { user, isLoading, signIn, signUp, signOut };
}

export function useSession(config: AuthClientConfig): UseSessionReturn {
	const [client] = useState(() => new AuthClient(config));
	const [session, setSession] = useState(client.getSession());
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setSession(client.getSession());
		setIsLoading(false);
	}, [client]);

	return { session, isLoading };
}
