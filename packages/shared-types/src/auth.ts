import { z } from "zod";

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export type Login = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
	name: z.string().min(1).max(255),
	email: z.string().email(),
	password: z.string().min(8).max(128),
});

export type Register = z.infer<typeof RegisterSchema>;

export const TokenPayloadSchema = z.object({
	sub: z.string().uuid(),
	email: z.string().email(),
	role: z.enum(["admin", "user", "viewer"]),
	iat: z.number(),
	exp: z.number(),
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;

export const RefreshTokenSchema = z.object({
	refreshToken: z.string(),
});

export type RefreshToken = z.infer<typeof RefreshTokenSchema>;

export const AuthResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
	expiresIn: z.number(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;