"use client";

import { Warning } from "@phosphor-icons/react";
import Link from "next/link";
import type { Task } from "~/lib/types";
import { cn } from "~/lib/utils";

interface TaskCardProps {
	task: Task;
	isCompleted?: boolean;
}

const priorityConfig = {
	HIGH: { color: "#ef4444", label: "High" },
	MEDIUM: { color: "#f59e0b", label: "Medium" },
	LOW: { color: "#22c55e", label: "Low" },
	NONE: null,
} as const;

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function stringToColor(str: string): string {
	const colors = ["#6366F1", "#E85A4F", "#32D583", "#FFB547", "#8B5CF6"];
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return colors[Math.abs(hash) % colors.length];
}

export function TaskCard({ task, isCompleted = false }: TaskCardProps) {
	const priority = priorityConfig[task.priority];

	return (
		<Link
			href={`/task/${task.id}`}
			className={cn(
				"flex flex-col gap-2.5 rounded-lg bg-card p-3 transition-all hover:ring-1 hover:ring-foreground/20",
				isCompleted && "opacity-60",
			)}
		>
			{/* Title */}
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

			{/* Indicators row */}
			{(priority || task.labels.length > 0) && (
				<div className="flex flex-wrap items-center gap-1.5">
					{priority && (
						<Warning
							size={14}
							weight="fill"
							style={{ color: priority.color }}
						/>
					)}
					{task.labels.map((label) => (
						<span
							key={label.text}
							className="rounded px-1.5 py-0.5 font-medium text-[11px]"
							style={{
								color: label.color,
								backgroundColor: `${label.color}15`,
							}}
						>
							{label.text}
						</span>
					))}
				</div>
			)}

			{/* Footer */}
			<div className="flex items-center justify-between">
				<span className="text-muted-foreground/60 text-xs">
					Issue #{task.order + 1}
				</span>
				{task.assignee && (
					<div
						className="flex size-6 items-center justify-center rounded-full font-semibold text-[10px] text-white"
						style={{ backgroundColor: stringToColor(task.assignee.name) }}
						title={task.assignee.name}
					>
						{getInitials(task.assignee.name)}
					</div>
				)}
			</div>
		</Link>
	);
}
