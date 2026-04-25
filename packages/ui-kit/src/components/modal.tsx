"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "../lib/utils";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	size?: "sm" | "md" | "lg";
}

const sizeClasses = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
} as const;

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			dialog.showModal();
			document.body.style.overflow = "hidden";
		} else {
			dialog.close();
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleCancel = (e: Event) => {
			e.preventDefault();
			onClose();
		};

		dialog.addEventListener("cancel", handleCancel);
		return () => {
			dialog.removeEventListener("cancel", handleCancel);
		};
	}, [onClose]);

	return (
		<dialog
			ref={dialogRef}
			className="fixed inset-0 z-50 m-auto bg-transparent backdrop:bg-black/80"
		>
			<div
				className={cn(
					"relative w-full rounded-lg border bg-background p-6 shadow-lg",
					sizeClasses[size],
				)}
			>
				{title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
				<div className={cn(title && "mt-4")}>{children}</div>
				<button
					type="button"
					className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					onClick={onClose}
					aria-label="Close"
				>
					✕
				</button>
			</div>
		</dialog>
	);
}
