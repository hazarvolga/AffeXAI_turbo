export interface AuditEntry {
	action: string;
	entity: string;
	entityId: string;
	userId?: string;
	metadata?: Record<string, unknown>;
	timestamp: Date;
}

export function createAuditEntry(
	action: string,
	entity: string,
	entityId: string,
	userId?: string,
	metadata?: Record<string, unknown>,
): AuditEntry {
	return {
		action,
		entity,
		entityId,
		userId,
		metadata,
		timestamp: new Date(),
	};
}