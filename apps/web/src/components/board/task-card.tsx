"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import type { Task } from "~/lib/types";
import { cn } from "~/lib/utils";

interface TaskCardProps {
	task: Task;
	isCompleted?: boolean;
}

const priorityColors = {
	HIGH: "#E85A4F",
	MEDIUM: "#FFB547",
	LOW: "#32D583",
	NONE: "#4A4A50",
};

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
	const firstLabel = task.labels?.[0];

	return (
		<Link
			href={`/task/${task.id}`}
			className="flex cursor-pointer flex-col gap-3 rounded-xl border border-[#2A2A2E] bg-[#16161A] p-4 transition-colors hover:border-[#3A3A3E] hover:bg-[#1A1A1E]"
		>
			{/* Header */}
			<div className="flex items-center gap-2">
				{isCompleted ? (
					<div className="flex size-[18px] items-center justify-center rounded-full bg-[#32D583]">
						<Check className="size-3 text-[#0B0B0E]" />
					</div>
				) : (
					<div
						className="size-1.5 rounded-sm"
						style={{ backgroundColor: priorityColors[task.priority] }}
					/>
				)}
				<span
					className={cn(
						"font-medium text-sm",
						isCompleted ? "text-[#6B6B70]" : "text-[#FAFAF9]",
					)}
				>
					{task.title}
				</span>
			</div>

			{/* Description */}
			{task.description && (
				<p
					className={cn(
						"text-[13px]",
						isCompleted ? "text-[#4A4A50]" : "text-[#6B6B70]",
					)}
				>
					{task.description}
				</p>
			)}

			{/* Footer */}
			{(firstLabel || task.assignee) && (
				<div className="flex items-center justify-between">
					{firstLabel && (
						<span
							className="rounded-md px-2 py-1 font-medium text-[11px]"
							style={{
								color: firstLabel.color,
								backgroundColor: `${firstLabel.color}20`,
							}}
						>
							{firstLabel.text}
						</span>
					)}
					{task.assignee && (
						<div
							className="flex size-7 items-center justify-center rounded-full"
							style={{ backgroundColor: stringToColor(task.assignee.name) }}
						>
							<span className="font-semibold text-[11px] text-white">
								{getInitials(task.assignee.name)}
							</span>
						</div>
					)}
				</div>
			)}
		</Link>
	);
}
