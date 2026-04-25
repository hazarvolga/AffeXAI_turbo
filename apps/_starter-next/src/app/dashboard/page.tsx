"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@affex/ui-kit";

export default function DashboardPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			router.push("/login");
			return;
		}
		setLoading(false);
	}, [router]);

	if (loading) {
		return (
			<main className="flex min-h-screen items-center justify-center">
				<p>Loading...</p>
			</main>
		);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
			<h1 className="text-3xl font-bold">Dashboard</h1>
			<p className="text-lg">Welcome to AffexAI</p>
			<Button
				variant="outline"
				onClick={() => {
					localStorage.removeItem("accessToken");
					router.push("/login");
				}}
			>
				Sign Out
			</Button>
		</main>
	);
}