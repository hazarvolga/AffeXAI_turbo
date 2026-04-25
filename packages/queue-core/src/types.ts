import type { JobsOptions } from "bullmq";

export interface QueueConfig {
	name: string;
	redis: {
		host: string;
		port: number;
		password?: string;
		db?: number;
	};
}

export interface JobConfig<T> {
	name: string;
	data: T;
	opts?: Omit<JobsOptions, "jobId">;
}

export interface JobResult<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface QueueStats {
	waiting: number;
	active: number;
	completed: number;
	failed: number;
	delayed: number;
}
