import { z } from "zod";

export const UserRoleSchema = z.enum(["admin", "user", "viewer"]);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string().min(1).max(255),
	role: UserRoleSchema,
	avatarUrl: z.string().url().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = UserSchema.partial().omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;