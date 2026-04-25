const GITHUB_AUTH_BASE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";

export interface GitHubTokenResponse {
	access_token: string;
	token_type: string;
	scope: string;
}

export interface GitHubUserInfo {
	id: number;
	login: string;
	avatar_url: string;
	html_url: string;
	name: string | null;
	email: string | null;
	bio: string | null;
}

export function generateGitHubAuthUrl(
	clientId: string,
	redirectUri: string,
	scopes: string[] = ["read:user", "user:email"],
): string {
	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		scope: scopes.join(" "),
	});
	return `${GITHUB_AUTH_BASE_URL}?${params.toString()}`;
}

export async function exchangeGitHubCode(
	code: string,
	clientId: string,
	clientSecret: string,
	redirectUri: string,
): Promise<GitHubTokenResponse> {
	const response = await fetch(GITHUB_TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			code,
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: redirectUri,
		}),
	});

	if (!response.ok) {
		throw new Error(`GitHub OAuth code exchange failed: ${response.statusText}`);
	}

	return response.json() as Promise<GitHubTokenResponse>;
}

export async function getGitHubUser(accessToken: string): Promise<GitHubUserInfo> {
	const response = await fetch(GITHUB_USER_URL, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`GitHub user info fetch failed: ${response.statusText}`);
	}

	return response.json() as Promise<GitHubUserInfo>;
}
