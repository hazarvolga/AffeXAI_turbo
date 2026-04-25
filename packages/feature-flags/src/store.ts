import type { FlagDefinition } from "./types.js";

export class FlagStore {
	private flags = new Map<string, FlagDefinition>();

	set(key: string, definition: FlagDefinition): void {
		this.flags.set(key, definition);
	}

	get(key: string): FlagDefinition | undefined {
		return this.flags.get(key);
	}

	delete(key: string): void {
		this.flags.delete(key);
	}

	list(): FlagDefinition[] {
		return Array.from(this.flags.values());
	}

	clear(): void {
		this.flags.clear();
	}

	loadFromObject(flags: Record<string, FlagDefinition>): void {
		for (const [key, definition] of Object.entries(flags)) {
			this.flags.set(key, definition);
		}
	}

	loadFromJson(jsonString: string): void {
		const parsed: Record<string, FlagDefinition> = JSON.parse(jsonString);
		this.loadFromObject(parsed);
	}
}
