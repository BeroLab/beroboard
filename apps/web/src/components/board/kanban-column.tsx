"use client";

import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Column } from "~/lib/types";
import { cn } from "~/lib/utils";
import { DraggableTaskCard } from "./draggable-task-card";

interface KanbanColumnProps {
	column: Column;
	onDelete?: (id: string) => void;
}

export function KanbanColumn({ column, onDelete }: KanbanColumnProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: column.id,
		data: {
			type: "column",
			column,
		},
	});

	const taskIds = useMemo(
		() => column.tasks.map((task) => task.id),
		[column.tasks],
	);

	return (
		<div className="flex w-72 min-w-72 flex-col gap-3">
			{/* Column Header */}
			<div className="flex items-center justify-between pb-2">
				<div className="flex items-center gap-2">
					{column.color && (
						<div
							className="size-2 rounded-full"
							style={{ backgroundColor: column.color }}
						/>
					)}
					<span className="font-semibold text-[#6B6B70] text-sm">
						{column.name}
					</span>
					<div className="flex size-6 items-center justify-center rounded-xl bg-[#16161A]">
						<span className="font-semibold text-[#6B6B70] text-xs">
							{column.tasks.length}
						</span>
					</div>
				</div>

				{onDelete && (
					<DropdownMenu>
						<DropdownMenuTrigger className="flex size-6 items-center justify-center rounded-md text-[#6B6B70] transition-colors hover:bg-[#16161A] hover:text-[#FAFAF9]">
							<MoreHorizontal className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-40 rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
							align="end"
							sideOffset={4}
						>
							<DropdownMenuItem
								className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-[#E85A4F] hover:bg-[#E85A4F]/10 focus:bg-[#E85A4F]/10 focus:text-[#E85A4F]"
								onClick={() => onDelete(column.id)}
							>
								<Trash2 className="size-4" />
								<span className="text-sm">Delete column</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			{/* Cards */}
			<div
				ref={setNodeRef}
				className={cn(
					"flex flex-1 flex-col gap-3 overflow-y-auto rounded-lg p-1 transition-colors",
					isOver && "bg-[#6366F1]/10",
				)}
			>
				<SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
					{column.tasks.map((task) => (
						<DraggableTaskCard
							key={task.id}
							task={task}
							isCompleted={column.isCompleted}
						/>
					))}
				</SortableContext>
			</div>
		</div>
	);
}
