"use client";

import { type ReactNode, useState } from "react";
import { cn } from "../lib/utils";

export interface Column<T> {
	key: string;
	header: string;
	render?: (row: T) => ReactNode;
	sortable?: boolean;
}

export interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	onRowClick?: (row: T) => void;
	isLoading?: boolean;
	emptyMessage?: string;
	pageSize?: number;
	rowKey?: (row: T, index: number) => string;
}

function getNestedValue<T>(obj: T, key: string): unknown {
	return key
		.split(".")
		.reduce<unknown>(
			(acc, part) => (acc as Record<string, unknown>)?.[part],
			obj as Record<string, unknown>,
		);
}

export function DataTable<T>({
	columns,
	data,
	onRowClick,
	isLoading = false,
	emptyMessage = "No data available",
	pageSize = 10,
	rowKey,
}: DataTableProps<T>) {
	const [sortKey, setSortKey] = useState<string | null>(null);
	const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
	const [page, setPage] = useState(0);

	const handleSort = (key: string) => {
		if (sortKey === key) {
			setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortKey(key);
			setSortDir("asc");
		}
	};

	const sorted = [...data].sort((a, b) => {
		if (!sortKey) return 0;
		const aVal = getNestedValue(a, sortKey);
		const bVal = getNestedValue(b, sortKey);
		if (aVal === bVal) return 0;
		const cmp = aVal != null && bVal != null ? String(aVal).localeCompare(String(bVal)) : 0;
		return sortDir === "asc" ? cmp : -cmp;
	});

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>
		);
	}

	return (
		<div className="w-full">
			<div className="rounded-md border">
				<table className="w-full">
					<thead>
						<tr className="border-b bg-muted/50">
							{columns.map((col) => (
								<th
									key={col.key}
									className={cn(
										"h-12 px-4 text-left align-middle font-medium text-muted-foreground",
										col.sortable && "cursor-pointer select-none hover:text-foreground",
									)}
									role={col.sortable ? "button" : undefined}
									tabIndex={col.sortable ? 0 : undefined}
									onClick={col.sortable ? () => handleSort(col.key) : undefined}
									onKeyDown={
										col.sortable
											? (e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handleSort(col.key);
													}
												}
											: undefined
									}
								>
									{col.header}
									{col.sortable && sortKey === col.key && (
										<span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{paginated.length === 0 ? (
							<tr>
								<td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
									{emptyMessage}
								</td>
							</tr>
						) : (
							paginated.map((row, i) => {
								const key = rowKey ? rowKey(row, i) : `row-${i}`;
								const handleClick = onRowClick ? () => onRowClick(row) : undefined;
								const handleKeyDown = onRowClick
									? (e: React.KeyboardEvent<HTMLTableRowElement>) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												onRowClick(row);
											}
										}
									: undefined;
								return (
									<tr
										key={key}
										className={cn(
											"border-b transition-colors hover:bg-muted/50",
											onRowClick && "cursor-pointer",
										)}
										onClick={handleClick}
										onKeyDown={handleKeyDown}
									>
										{columns.map((col) => (
											<td key={col.key} className="p-4 align-middle">
												{col.render ? col.render(row) : String(getNestedValue(row, col.key) ?? "")}
											</td>
										))}
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
			{totalPages > 1 && (
				<div className="flex items-center justify-end gap-2 py-4">
					<button
						type="button"
						className="inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm disabled:pointer-events-none disabled:opacity-50"
						onClick={() => setPage((p) => Math.max(0, p - 1))}
						disabled={page === 0}
					>
						Previous
					</button>
					<span className="text-sm text-muted-foreground">
						{page + 1} / {totalPages}
					</span>
					<button
						type="button"
						className="inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm disabled:pointer-events-none disabled:opacity-50"
						onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
						disabled={page >= totalPages - 1}
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
}
