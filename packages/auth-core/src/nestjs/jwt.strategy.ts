import type { TokenPayload } from "@affex/shared-types";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export interface JwtStrategyOptions {
	secret: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(options: JwtStrategyOptions) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: options.secret,
		});
	}

	validate(payload: TokenPayload): TokenPayload {
		if (!payload.sub || !payload.email) {
			throw new UnauthorizedException("Invalid token payload");
		}
		return payload;
	}
}
