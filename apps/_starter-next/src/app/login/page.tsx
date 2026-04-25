"use client";

import { Button } from "@affex/ui-kit";
import { Input } from "@affex/ui-kit";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data.error ?? "Sign in failed");
				return;
			}

			router.push("/dashboard");
		} catch {
			setError("An unexpected error occurred");
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center px-6">
			<form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
				<h1 className="text-2xl font-bold">Sign In</h1>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<Input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<Input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<Button type="submit">Sign In</Button>
			</form>
		</main>
	);
}
