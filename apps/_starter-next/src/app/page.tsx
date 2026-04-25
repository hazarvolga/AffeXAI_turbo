import Link from "next/link";
import { Button } from "@affex/ui-kit";

export default function HomePage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
			<h1 className="text-5xl font-bold tracking-tight">AffexAI</h1>
			<p className="max-w-lg text-lg text-gray-600">
				AI-first enterprise platform. Build, deploy, and scale intelligent
				workflows with confidence.
			</p>
			<div className="flex gap-4">
				<Link href="/dashboard">
					<Button>Get Started</Button>
				</Link>
				<Link href="/login">
					<Button variant="outline">Sign In</Button>
				</Link>
			</div>
		</main>
	);
}