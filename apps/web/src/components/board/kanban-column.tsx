"use client";

import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Check,
	DotsSixVertical,
	DotsThree,
	PencilSimple,
	Trash,
	X,
} from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Column, UpdateColumnInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { COLUMN_COLORS } from "./add-column";
import { DraggableTaskCard } from "./draggable-task-card";

interface KanbanColumnProps {
	column: Column;
	onDelete?: (id: string) => void;
	onUpdate?: (id: string, input: UpdateColumnInput) => void;
}

export function KanbanColumn({
	column,
	onDelete,
	onUpdate,
}: KanbanColumnProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState(column.name);
	const [editColor, setEditColor] = useState(
		column.color ?? COLUMN_COLORS[0].color,
	);
	const inputRef = useRef<HTMLInputElement>(null);

	const {
		attributes,
		listeners,
		setNodeRef: setSortableNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: `column-${column.id}`,
		data: {
			type: "column-sortable",
			column,
		},
	});

	const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
		id: column.id,
		data: {
			type: "column",
			column,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: transition ?? undefined,
	};

	const taskIds = useMemo(
		() => column.tasks.map((task) => task.id),
		[column.tasks],
	);

	const handleStartEdit = () => {
		setEditName(column.name);
		setEditColor(column.color ?? COLUMN_COLORS[0].color);
		setIsEditing(true);
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const handleCancelEdit = () => {
		setEditName(column.name);
		setEditColor(column.color ?? COLUMN_COLORS[0].color);
		setIsEditing(false);
	};

	const handleSaveEdit = () => {
		if (!editName.trim()) return;
		onUpdate?.(column.id, {
			name: editName.trim(),
			color: editColor,
		});
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSaveEdit();
		} else if (e.key === "Escape") {
			handleCancelEdit();
		}
	};

	if (isEditing) {
		return (
			<div className="flex w-64 min-w-64 flex-col gap-3 rounded-lg border border-border/50 bg-card/30 p-3 shadow-sm">
				<input
					ref={inputRef}
					type="text"
					value={editName}
					onChange={(e) => setEditName(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Column name..."
					className="h-9 rounded-lg border border-border bg-background px-3 text-foreground text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
				/>

				<div className="flex flex-col gap-1.5">
					<span className="text-muted-foreground text-xs">Color</span>
					<div className="flex flex-wrap gap-1.5">
						{COLUMN_COLORS.map((c) => (
							<button
								key={c.id}
								type="button"
								onClick={() => setEditColor(c.color)}
								className={cn(
									"flex size-6 items-center justify-center rounded-md transition-all",
									editColor === c.color
										? "ring-2 ring-foreground ring-offset-1 ring-offset-background"
										: "hover:scale-110",
								)}
								style={{ backgroundColor: c.color }}
							>
								{editColor === c.color && (
									<Check size={12} weight="bold" className="text-white" />
								)}
							</button>
						))}
					</div>
				</div>

				<div className="flex gap-2">
					<button
						type="button"
						onClick={handleSaveEdit}
						disabled={!editName.trim()}
						className="flex h-8 flex-1 items-center justify-center rounded-lg bg-foreground font-medium text-background text-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Save
					</button>
					<button
						type="button"
						onClick={handleCancelEdit}
						className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
					>
						<X size={14} />
					</button>
				</div>
			</div>
		);
	}

	return (
		<div
			ref={setSortableNodeRef}
			style={style}
			className={cn(
				"flex w-64 min-w-64 flex-col rounded-lg border border-border/50 bg-card/30 p-3 shadow-sm",
				isDragging && "opacity-50",
			)}
		>
			{/* Draggable Header */}
			<div
				{...attributes}
				{...listeners}
				className="flex cursor-grab items-center justify-between pb-2 active:cursor-grabbing"
			>
				<div className="flex items-center gap-2">
					<DotsSixVertical
						size={14}
						weight="bold"
						className="text-muted-foreground"
					/>
					{column.color && (
						<div
							className="size-2 rounded-full"
							style={{ backgroundColor: column.color }}
						/>
					)}
					<span className="font-medium text-foreground text-sm">
						{column.name}
					</span>
					<span className="text-muted-foreground text-xs">
						{column.tasks.length}
					</span>
				</div>

				{(onDelete || onUpdate) && (
					<DropdownMenu>
						<DropdownMenuTrigger
							className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
							onClick={(e) => e.stopPropagation()}
							onPointerDown={(e) => e.stopPropagation()}
						>
							<DotsThree size={16} weight="bold" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-36 rounded-lg border border-border bg-popover p-1"
							align="end"
							sideOffset={4}
						>
							{onUpdate && (
								<DropdownMenuItem
									className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-foreground hover:bg-accent focus:bg-accent"
									onClick={handleStartEdit}
								>
									<PencilSimple size={14} />
									<span className="text-sm">Edit column</span>
								</DropdownMenuItem>
							)}
							{onDelete && (
								<DropdownMenuItem
									className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
									onClick={() => onDelete(column.id)}
								>
									<Trash size={14} />
									<span className="text-sm">Delete column</span>
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			{/* Task Drop Area */}
			<div
				ref={setDroppableNodeRef}
				className={cn(
					"flex min-h-[100px] flex-1 flex-col gap-2 overflow-y-auto rounded-lg p-0.5",
					isOver && "bg-accent/50",
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
