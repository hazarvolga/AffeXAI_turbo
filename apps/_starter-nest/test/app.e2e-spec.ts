import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { AppModule } from "../src/app.module";
import type { INestApplication } from "@nestjs/common";

describe("App (e2e)", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it("GET / should return health status", async () => {
		const response = await app.getHttpServer()
			.get("/")
			.expect(200);

		expect(response.body).toEqual({
			status: "ok",
			timestamp: expect.any(String),
		});
	});
});