import { createAuthClient } from "@affex/auth-core";

export const authClient = createAuthClient({
	baseUrl: "/api/auth",
});