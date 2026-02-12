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
	DotsThree,
	PencilSimple,
	Plus,
	Trash,
	X,
} from "@phosphor-icons/react";
import type { ComponentType, SVGProps } from "react";
import {
	BacklogIcon,
	DoneIcon,
	InProgressIcon,
	ReviewIcon,
	TodoIcon,
} from "~/components/icons";
import { useMemo, useRef, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Column, UpdateColumnInput } from "~/lib/types";
import { cn } from "~/lib/utils";
import { COLUMN_COLORS } from "./add-column";
import { DraggableTaskCard } from "./draggable-task-card";
import { InlineTaskCreate } from "./inline-task-create";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const ICON_MAP: Record<string, IconComponent> = {
	backlog: BacklogIcon,
	todo: TodoIcon,
	"in-progress": InProgressIcon,
	review: ReviewIcon,
	done: DoneIcon,
};

const NAME_TO_ICON: Record<string, IconComponent> = {
	backlog: BacklogIcon,
	todo: TodoIcon,
	"in progress": InProgressIcon,
	review: ReviewIcon,
	done: DoneIcon,
};

function getColumnVisual(
	name: string,
	color: string | null,
	isCompleted: boolean,
): { icon: IconComponent | null; dotColor: string | null } {
	// If color has icon: prefix, use the SVG icon
	if (color?.startsWith("icon:")) {
		const iconKey = color.slice(5);
		const icon = ICON_MAP[iconKey] ?? null;
		return { icon, dotColor: null };
	}

	// If color is a hex value, show colored dot
	if (color) {
		return { icon: null, dotColor: color };
	}

	// Fallback: match by name
	const key = name.toLowerCase();
	if (NAME_TO_ICON[key]) {
		return { icon: NAME_TO_ICON[key], dotColor: null };
	}
	if (isCompleted) return { icon: DoneIcon, dotColor: null };
	return { icon: TodoIcon, dotColor: null };
}

interface KanbanColumnProps {
	column: Column;
	onDelete?: (id: string) => void;
	onUpdate?: (id: string, input: UpdateColumnInput) => void;
	onCreateTask?: (title: string, columnId: string) => void;
	isCreatingTask?: boolean;
}

export function KanbanColumn({
	column,
	onDelete,
	onUpdate,
	onCreateTask,
	isCreatingTask,
}: KanbanColumnProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [editName, setEditName] = useState(column.name);
	const [editDescription, setEditDescription] = useState(
		column.description ?? "",
	);
	const [editMode, setEditMode] = useState<"icon" | "color">(
		column.color?.startsWith("icon:") ? "icon" : "color",
	);
	const [editIcon, setEditIcon] = useState(
		column.color?.startsWith("icon:") ? column.color.slice(5) : "backlog",
	);
	const [editColor, setEditColor] = useState(
		column.color && !column.color.startsWith("icon:")
			? column.color
			: COLUMN_COLORS[0].color,
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

	const { icon: StatusIcon, dotColor } = getColumnVisual(
		column.name,
		column.color,
		column.isCompleted,
	);

	const handleStartEdit = () => {
		setEditName(column.name);
		setEditDescription(column.description ?? "");
		const isIcon = column.color?.startsWith("icon:");
		setEditMode(isIcon ? "icon" : "color");
		setEditIcon(isIcon ? column.color!.slice(5) : "backlog");
		setEditColor(
			column.color && !isIcon ? column.color : COLUMN_COLORS[0].color,
		);
		setIsEditing(true);
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const handleCancelEdit = () => {
		setEditName(column.name);
		setEditDescription(column.description ?? "");
		setIsEditing(false);
	};

	const handleSaveEdit = () => {
		if (!editName.trim()) return;
		const colorValue =
			editMode === "icon" ? `icon:${editIcon}` : editColor;
		onUpdate?.(column.id, {
			name: editName.trim(),
			description: editDescription.trim() || null,
			color: colorValue,
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
			<div className="flex w-80 min-w-80 flex-col gap-3 rounded-xl bg-background p-3">
				<input
					ref={inputRef}
					type="text"
					value={editName}
					onChange={(e) => setEditName(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Column name..."
					className="h-9 rounded-lg border border-border bg-background px-3 text-foreground text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
				/>

				<input
					type="text"
					value={editDescription}
					onChange={(e) => setEditDescription(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Description (optional)"
					className="h-9 rounded-lg border border-border bg-background px-3 text-foreground text-xs placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
				/>

				{/* Mode toggle */}
				<div className="flex gap-1 rounded-lg bg-accent/50 p-0.5">
					<button
						type="button"
						onClick={() => setEditMode("icon")}
						className={cn(
							"flex-1 rounded-md px-2 py-1 text-xs transition-colors",
							editMode === "icon"
								? "bg-background font-medium text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Icon
					</button>
					<button
						type="button"
						onClick={() => setEditMode("color")}
						className={cn(
							"flex-1 rounded-md px-2 py-1 text-xs transition-colors",
							editMode === "color"
								? "bg-background font-medium text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Color
					</button>
				</div>

				{editMode === "icon" ? (
					<div className="flex flex-col gap-1.5">
						<span className="text-muted-foreground text-xs">Icon</span>
						<div className="flex flex-wrap gap-1.5">
							{Object.entries(ICON_MAP).map(([key, Icon]) => (
								<button
									key={key}
									type="button"
									onClick={() => setEditIcon(key)}
									title={key}
									className={cn(
										"flex size-7 items-center justify-center rounded-md transition-all",
										editIcon === key
											? "bg-accent ring-2 ring-foreground ring-offset-1 ring-offset-background"
											: "text-muted-foreground hover:bg-accent hover:text-foreground",
									)}
								>
									<Icon width={18} height={18} />
								</button>
							))}
						</div>
					</div>
				) : (
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
				)}

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
				"flex w-80 min-w-80 flex-col rounded-xl bg-background p-3",
				isDragging && "opacity-50",
			)}
		>
			{/* Draggable Header */}
			<div
				{...attributes}
				{...listeners}
				className="flex cursor-grab items-center justify-between active:cursor-grabbing"
			>
				<div className="flex items-center gap-2">
					{StatusIcon ? (
						<StatusIcon
							width={20}
							height={20}
							className="shrink-0 text-muted-foreground"
						/>
					) : dotColor ? (
						<div
							className="size-3 shrink-0 rounded-full"
							style={{ backgroundColor: dotColor }}
						/>
					) : null}
					<span className="font-medium text-foreground text-sm">
						{column.name}
					</span>
					<span className="text-muted-foreground/60 text-xs">
						{column.tasks.length}
					</span>
				</div>

				<div className="flex items-center gap-0.5">
					{onCreateTask && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								setIsCreating(true);
							}}
							onPointerDown={(e) => e.stopPropagation()}
							className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						>
							<Plus size={16} />
						</button>
					)}

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
			</div>

			{/* Description */}
			{column.description && (
				<p className="mt-1 text-muted-foreground/50 text-xs">{column.description}</p>
			)}

			{/* Task Drop Area */}
			<div
				ref={setDroppableNodeRef}
				className={cn(
					"mt-3 flex min-h-[100px] flex-1 flex-col gap-2 overflow-y-auto rounded-lg p-0.5",
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

				{isCreating && onCreateTask && (
					<InlineTaskCreate
						columnId={column.id}
						taskCount={column.tasks.length}
						onSubmit={(title, colId) => {
							onCreateTask(title, colId);
							setIsCreating(false);
						}}
						onCancel={() => setIsCreating(false)}
						isPending={isCreatingTask}
					/>
				)}
			</div>
		</div>
	);
}
