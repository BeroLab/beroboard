"use client";

import { Columns, Plus } from "@phosphor-icons/react";
import { DEFAULT_COLUMNS } from "~/lib/types";

interface EmptyBoardProps {
	onCreateDefaultColumns: () => void;
	isLoading?: boolean;
}

export function EmptyBoard({
	onCreateDefaultColumns,
	isLoading,
}: EmptyBoardProps) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-5">
			<div className="flex size-12 items-center justify-center rounded-xl bg-muted">
				<Columns size={24} className="text-muted-foreground" />
			</div>

			<div className="flex flex-col items-center gap-1.5">
				<h3 className="font-semibold text-base text-foreground">
					No columns yet
				</h3>
				<p className="max-w-xs text-center text-muted-foreground text-sm">
					Get started by creating default columns or add your own custom
					columns.
				</p>
			</div>

			<div className="flex flex-col items-center gap-3">
				<button
					type="button"
					onClick={onCreateDefaultColumns}
					disabled={isLoading}
					className="flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 font-medium text-background text-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Plus size={14} weight="bold" />
					{isLoading ? "Creating..." : "Create default columns"}
				</button>

				<div className="flex flex-wrap justify-center gap-1.5">
					{DEFAULT_COLUMNS.map((col) => (
						<div
							key={col.name}
							className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1"
						>
							<div
								className="size-1.5 rounded-full"
								style={{ backgroundColor: col.color }}
							/>
							<span className="text-muted-foreground text-xs">{col.name}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
