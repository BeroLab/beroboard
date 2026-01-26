"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import type { Task } from "~/lib/types";
import { cn } from "~/lib/utils";

interface DraggableTaskCardProps {
	task: Task;
	isCompleted?: boolean;
}

const priorityColors = {
	HIGH: "#ef4444",
	MEDIUM: "#f59e0b",
	LOW: "#22c55e",
	NONE: "transparent",
};

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function DraggableTaskCard({
	task,
	isCompleted = false,
}: DraggableTaskCardProps) {
	const router = useRouter();
	const hasDragged = useRef(false);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: "task",
			task,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const firstLabel = task.labels?.[0];

	const handleMouseDown = () => {
		hasDragged.current = false;
	};

	const handleMouseMove = () => {
		hasDragged.current = true;
	};

	const handleClick = (e: React.MouseEvent) => {
		if (!hasDragged.current && !isDragging) {
			e.preventDefault();
			e.stopPropagation();
			router.push(`/task/${task.id}`);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			router.push(`/task/${task.id}`);
		}
	};

	return (
		<button
			type="button"
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"flex w-full flex-col gap-2 rounded-lg border p-3 text-left",
				isDragging
					? "border-foreground/20 border-dashed bg-accent/50 opacity-40"
					: "cursor-grab border-border bg-card transition-colors hover:border-foreground/20 active:cursor-grabbing",
			)}
		>
			<div className="flex items-start gap-2">
				{isCompleted ? (
					<CheckCircle
						size={16}
						weight="fill"
						className="mt-0.5 shrink-0 text-green-500"
					/>
				) : (
					task.priority !== "NONE" && (
						<div
							className="mt-1.5 size-1.5 shrink-0 rounded-full"
							style={{ backgroundColor: priorityColors[task.priority] }}
						/>
					)
				)}
				<span
					className={cn(
						"text-sm leading-snug",
						isCompleted
							? "text-muted-foreground line-through"
							: "font-medium text-foreground",
					)}
				>
					{task.title}
				</span>
			</div>

			{(firstLabel || task.assignee) && (
				<div className="flex items-center justify-between gap-2">
					{firstLabel && (
						<span
							className="rounded px-1.5 py-0.5 font-medium text-[11px]"
							style={{
								color: firstLabel.color,
								backgroundColor: `${firstLabel.color}15`,
							}}
						>
							{firstLabel.text}
						</span>
					)}
					{task.assignee && (
						<div
							className="flex size-5 items-center justify-center rounded-full bg-muted font-semibold text-[9px] text-muted-foreground"
							title={task.assignee.name}
						>
							{getInitials(task.assignee.name)}
						</div>
					)}
				</div>
			)}
		</button>
	);
}
