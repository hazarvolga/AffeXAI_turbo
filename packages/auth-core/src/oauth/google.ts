const GOOGLE_AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export interface GoogleTokenResponse {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	token_type: string;
	scope: string;
	id_token?: string;
}

export interface GoogleUserInfo {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
}

export function generateGoogleAuthUrl(
	clientId: string,
	redirectUri: string,
	scopes: string[] = ["openid", "email", "profile"],
): string {
	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: "code",
		scope: scopes.join(" "),
		access_type: "offline",
		prompt: "consent",
	});
	return `${GOOGLE_AUTH_BASE_URL}?${params.toString()}`;
}

export async function exchangeGoogleCode(
	code: string,
	clientId: string,
	clientSecret: string,
	redirectUri: string,
): Promise<GoogleTokenResponse> {
	const response = await fetch(GOOGLE_TOKEN_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: redirectUri,
			grant_type: "authorization_code",
		}).toString(),
	});

	if (!response.ok) {
		throw new Error(`Google OAuth code exchange failed: ${response.statusText}`);
	}

	return response.json() as Promise<GoogleTokenResponse>;
}

export async function getGoogleUser(accessToken: string): Promise<GoogleUserInfo> {
	const response = await fetch(GOOGLE_USERINFO_URL, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!response.ok) {
		throw new Error(`Google user info fetch failed: ${response.statusText}`);
	}

	return response.json() as Promise<GoogleUserInfo>;
}
