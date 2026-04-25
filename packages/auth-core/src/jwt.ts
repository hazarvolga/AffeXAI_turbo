import type { TokenPayload } from "@affex/shared-types";
import jsonwebtoken from "jsonwebtoken";
import type { SignOptions as JwtSignOptions } from "jsonwebtoken";

const DEFAULT_ACCESS_EXPIRY = "15m";
const DEFAULT_REFRESH_EXPIRY = "7d";

export function signAccessToken(
	payload: Omit<TokenPayload, "iat" | "exp">,
	secret: string,
	expiresIn: JwtSignOptions["expiresIn"] = DEFAULT_ACCESS_EXPIRY,
): string {
	return jsonwebtoken.sign(payload, secret, { expiresIn });
}

export function signRefreshToken(
	payload: Omit<TokenPayload, "iat" | "exp"> | TokenPayload,
	secret: string,
	expiresIn: JwtSignOptions["expiresIn"] = DEFAULT_REFRESH_EXPIRY,
): string {
	return jsonwebtoken.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string, secret: string): TokenPayload | null {
	try {
		const decoded = jsonwebtoken.verify(token, secret);
		return decoded as TokenPayload;
	} catch {
		return null;
	}
}

export function decodeToken(token: string): TokenPayload | null {
	const decoded = jsonwebtoken.decode(token);
	if (decoded && typeof decoded === "object") {
		return decoded as TokenPayload;
	}
	return null;
}
