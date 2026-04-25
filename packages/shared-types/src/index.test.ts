import { describe, it, expect } from "vitest";
import { z } from "zod";
import { UserSchema, UserRoleSchema, CreateUserSchema } from "./user.js";
import { PaginationSchema, ApiResponseSchema } from "./api.js";
import { LoginSchema, TokenPayloadSchema } from "./auth.js";

describe("UserRoleSchema", () => {
	it("should accept valid roles", () => {
		expect(UserRoleSchema.parse("admin")).toBe("admin");
		expect(UserRoleSchema.parse("user")).toBe("user");
		expect(UserRoleSchema.parse("viewer")).toBe("viewer");
	});

	it("should reject invalid roles", () => {
		expect(() => UserRoleSchema.parse("superadmin")).toThrow();
	});
});

describe("UserSchema", () => {
	it("should parse a valid user", () => {
		const user = UserSchema.parse({
			id: "550e8400-e29b-41d4-a716-446655440000",
			email: "test@example.com",
			name: "Test User",
			role: "user",
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		expect(user.role).toBe("user");
	});

	it("should reject invalid email", () => {
		expect(() =>
			UserSchema.parse({
				id: "550e8400-e29b-41d4-a716-446655440000",
				email: "invalid",
				name: "Test",
				role: "user",
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		).toThrow();
	});
});

describe("PaginationSchema", () => {
	it("should apply defaults", () => {
		const result = PaginationSchema.parse({});
		expect(result.page).toBe(1);
		expect(result.limit).toBe(20);
		expect(result.orderDir).toBe("desc");
	});

	it("should coerce string inputs", () => {
		const result = PaginationSchema.parse({ page: "3", limit: "10" });
		expect(result.page).toBe(3);
		expect(result.limit).toBe(10);
	});
});

describe("ApiResponseSchema", () => {
	it("should parse success response", () => {
		const schema = ApiResponseSchema(z.object({ id: z.string() }));
		const response = schema.safeParse({
			success: true,
			data: { id: "abc" },
		});
		expect(response.success).toBe(true);
	});
});

describe("LoginSchema", () => {
	it("should accept valid login", () => {
		const result = LoginSchema.parse({
			email: "test@example.com",
			password: "password123",
		});
		expect(result.email).toBe("test@example.com");
	});

	it("should reject short password", () => {
		expect(() =>
			LoginSchema.parse({
				email: "test@example.com",
				password: "short",
			}),
		).toThrow();
	});
});