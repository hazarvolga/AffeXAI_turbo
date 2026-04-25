interface SoftDeleteParams {
	action: string;
	model?: string;
	args?: Record<string, unknown>;
	data?: Record<string, unknown>;
	[key: string]: unknown;
}

type SoftDeleteMiddleware = (
	params: SoftDeleteParams,
	next: (params: SoftDeleteParams) => Promise<unknown>,
) => Promise<unknown>;

export function softDeleteMiddleware(): SoftDeleteMiddleware {
	return async (params, next) => {
		if (params.action === "delete" && params.model) {
			return next({
				...params,
				action: "update",
				data: { deletedAt: new Date() },
			});
		}
		if (params.action === "deleteMany" && params.model) {
			return next({
				...params,
				action: "updateMany",
				data: { deletedAt: new Date() },
			});
		}
		if (params.action === "findMany" || params.action === "findFirst") {
			if (!(params.args?.where as Record<string, unknown>)?.deletedAt) {
				params.args = params.args ?? {};
				params.args.where = (params.args.where as Record<string, unknown>) ?? {};
				(params.args.where as Record<string, unknown>).deletedAt = null;
			}
		}
		return next(params);
	};
}