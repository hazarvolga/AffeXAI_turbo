import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
	it("merges class names", () => {
		expect(cn("foo", "bar")).toBe("foo bar");
	});

	it("handles conditional classes", () => {
		expect(cn("base", false && "hidden", "extra")).toBe("base extra");
	});

	it("merges tailwind conflicts", () => {
		expect(cn("px-2", "px-4")).toBe("px-4");
	});
});