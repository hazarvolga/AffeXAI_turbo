import { type ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ROLE_HIERARCHY, type Role } from "../rbac.js";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

@Injectable()
export class RolesGuard {
	constructor(private reflector: Reflector) {}

	canMatch(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.get<Role[]>("roles", context.getHandler());
		if (!requiredRoles) {
			return true;
		}
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		if (!user?.role) {
			return false;
		}
		const userLevel = ROLE_HIERARCHY[user.role as Role] ?? 0;
		return requiredRoles.some((role: Role) => {
			const requiredLevel = ROLE_HIERARCHY[role] ?? 0;
			return userLevel >= requiredLevel;
		});
	}
}

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
