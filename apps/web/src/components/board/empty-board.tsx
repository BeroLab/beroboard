"use client";

import { Columns3, Plus } from "lucide-react";
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
		<div className="flex flex-1 flex-col items-center justify-center gap-6">
			<div className="flex size-16 items-center justify-center rounded-2xl bg-[#16161A]">
				<Columns3 className="size-8 text-[#6B6B70]" />
			</div>

			<div className="flex flex-col items-center gap-2">
				<h3 className="font-semibold text-[#FAFAF9] text-lg">No columns yet</h3>
				<p className="max-w-sm text-center text-[#6B6B70] text-sm">
					Get started by creating default columns or add your own custom columns
					to organize your tasks.
				</p>
			</div>

			<div className="flex flex-col items-center gap-3">
				<button
					type="button"
					onClick={onCreateDefaultColumns}
					disabled={isLoading}
					className="flex h-11 items-center gap-2 rounded-xl bg-[#6366F1] px-5 font-semibold text-sm text-white transition-colors hover:bg-[#5558E3] disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Plus className="size-4" />
					{isLoading ? "Creating..." : "Create default columns"}
				</button>

				<div className="flex flex-wrap justify-center gap-2">
					{DEFAULT_COLUMNS.map((col) => (
						<div
							key={col.name}
							className="flex items-center gap-1.5 rounded-lg bg-[#16161A] px-3 py-1.5"
						>
							<div
								className="size-2 rounded-full"
								style={{ backgroundColor: col.color }}
							/>
							<span className="text-[#6B6B70] text-xs">{col.name}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
