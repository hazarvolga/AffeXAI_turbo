export type Role = "admin" | "user" | "viewer";

export const ROLE_HIERARCHY: Record<Role, number> = {
	admin: 3,
	user: 2,
	viewer: 1,
};

export const PERMISSIONS: Record<Role, string[]> = {
	admin: [
		"users:read",
		"users:write",
		"users:delete",
		"projects:read",
		"projects:write",
		"projects:delete",
		"settings:read",
		"settings:write",
		"settings:delete",
	],
	user: ["users:read", "projects:read", "projects:write", "settings:read"],
	viewer: ["users:read", "projects:read"],
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
	const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
	const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
	return userLevel >= requiredLevel;
}

export function hasPermission(userRole: Role, permission: string): boolean {
	const rolePermissions = PERMISSIONS[userRole] ?? [];
	return rolePermissions.includes(permission);
}
