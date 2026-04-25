import { z } from "zod";

export const PaginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	orderBy: z.string().optional(),
	orderDir: z.enum(["asc", "desc"]).default("desc"),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		items: z.array(itemSchema),
		total: z.number().int().min(0),
		page: z.number().int().min(1),
		limit: z.number().int().min(1),
		totalPages: z.number().int().min(0),
	});

export type PaginatedResponse<T> = {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		data: dataSchema.optional(),
		error: z
			.object({
				code: z.string(),
				message: z.string(),
				details: z.unknown().optional(),
			})
			.optional(),
	});

export type ApiSuccess<T> = {
	success: true;
	data: T;
	error?: never;
};

export type ApiError = {
	success: false;
	data?: never;
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
