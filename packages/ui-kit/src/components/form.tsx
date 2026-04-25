import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface FormFieldProps {
	label: string;
	error?: string;
	description?: string;
	children: ReactNode;
	className?: string;
	htmlFor?: string;
}

export function FormField({
	label,
	error,
	description,
	children,
	className,
	htmlFor,
}: FormFieldProps) {
	return (
		<div className={cn("space-y-2", className)}>
			<label
				htmlFor={htmlFor}
				className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{label}
			</label>
			{description && <p className="text-sm text-muted-foreground">{description}</p>}
			{children}
			{error && <p className="text-sm font-medium text-destructive">{error}</p>}
		</div>
	);
}
