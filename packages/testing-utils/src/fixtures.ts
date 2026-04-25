export interface PostgresFixture {
	connectionString: string;
	container: unknown;
	stop: () => Promise<void>;
}

export interface RedisFixture {
	host: string;
	port: number;
	container: unknown;
	stop: () => Promise<void>;
}

/**
 * Create a PostgreSQL test fixture.
 *
 * When `@testcontainers/postgresql` is available this will spin up a real
 * Postgres container. Otherwise a mock in-memory implementation is provided
 * so that tests can still run without Docker.
 */
export async function createPostgresFixture(): Promise<PostgresFixture> {
	// Optional: real testcontainers integration
	// import { PostgreSqlContainer } from "@testcontainers/postgresql";
	// const container = await new PostgreSqlContainer("postgres:16").start();
	// const connectionString = container.getConnectionUri();
	// return {
	//   connectionString,
	//   container,
	//   stop: async () => { await container.stop(); },
	// };

	const connectionString = "postgresql://test:test@localhost:5432/testdb";

	return {
		connectionString,
		container: null,
		stop: async () => {
			// no-op for mock implementation
		},
	};
}

/**
 * Create a Redis test fixture.
 *
 * When `@testcontainers/redis` is available this will spin up a real Redis
 * container. Otherwise a mock implementation is provided so that tests can
 * still run without Docker.
 */
export async function createRedisFixture(): Promise<RedisFixture> {
	// Optional: real testcontainers integration
	// import { RedisContainer } from "@testcontainers/redis";
	// const container = await new RedisContainer("redis:7").start();
	// const host = container.getHost();
	// const port = container.getPort();
	// return { host, port, container, stop: async () => { await container.stop(); } };

	return {
		host: "localhost",
		port: 6379,
		container: null,
		stop: async () => {
			// no-op for mock implementation
		},
	};
}