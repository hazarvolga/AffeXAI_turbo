import type { TokenPayload } from "@affex/shared-types";
import { type ExecutionContext, SetMetadata, createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): TokenPayload => {
		const request = ctx.switchToHttp().getRequest();
		return request.user;
	},
);

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
