"use client";

import {
	ArrowLeft,
	CalendarBlank,
	DotsThree,
	PencilSimple,
	Trash,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";
import { EditTaskModal, Sidebar } from "@/components/board";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useColumns,
	useDeleteTask,
	useTask,
	useUpdateTask,
} from "@/hooks/board";
import type { UpdateTaskInput } from "@/lib/types";

const priorityColors = {
	HIGH: "#ef4444",
	MEDIUM: "#f59e0b",
	LOW: "#22c55e",
	NONE: "transparent",
};

const STATIC_TASK = {
	title: "Design new dashboard",
	status: "In Progress",
	statusColor: "#FFB547",
	priority: "Medium",
	priorityColor: "#FFB547",
	createdAt: "Jan 15, 2026",
	dueDate: "Jan 28, 2026",
	project: "Project Overview",
	description:
		"Create wireframes and mockups for the analytics dashboard. The design should include data visualization components, filtering options, and export functionality. Focus on creating an intuitive user experience that allows users to quickly understand their metrics.",
	assignee: {
		name: "Alice Martin",
		initials: "AM",
		color: "#E85A4F",
	},
	subtasks: [
		{ id: "1", text: "Research competitor dashboards", completed: true },
		{ id: "2", text: "Create low-fidelity wireframes", completed: true },
		{ id: "3", text: "Design high-fidelity mockups", completed: false },
		{ id: "4", text: "Create interactive prototype", completed: false },
	],
	tags: [
		{ text: "Design", color: "#6366F1" },
		{ text: "Dashboard", color: "#FFB547" },
	],
	attachments: [{ name: "dashboard-wireframe.fig", size: "2.4 MB" }],
	comments: [
		{
			id: "1",
			author: "Alex Wright",
			initials: "AW",
			color: "#E85A4F",
			time: "2 hours ago",
			text: "Great progress on the wireframes! I think we should add more filtering options to the sidebar.",
		},
	],
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
	const colors = ["#6366f1", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6"];
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return colors[Math.abs(hash) % colors.length];
}

function formatDate(date: Date | string | null): string {
	if (!date) return "Not set";
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

interface PageProps {
	params: Promise<{ taskId: string }>;
}

export default function TaskDetailsPage({ params }: PageProps) {
	const { taskId } = use(params);
	const router = useRouter();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const { data: task, isLoading, error, refetch } = useTask(taskId);
	const { data: columns = [] } = useColumns(task?.organizationId ?? "");
	const deleteTaskMutation = useDeleteTask(task?.organizationId ?? "");
	const updateTaskMutation = useUpdateTask(task?.organizationId ?? "");

	const handleDelete = async () => {
		if (!task) return;

		try {
			await deleteTaskMutation.mutateAsync(task.id);
			toast.success("Task deleted successfully");
			router.push("/");
		} catch {
			toast.error("Failed to delete task");
		}
	};

	const handleUpdate = async (input: UpdateTaskInput) => {
		if (!task) return;

		try {
			await updateTaskMutation.mutateAsync({ id: task.id, input });
			await refetch();
			toast.success("Task updated successfully");
		} catch {
			toast.error("Failed to update task");
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-screen bg-background">
				<Sidebar />
				<main className="flex flex-1 items-center justify-center">
					<div className="text-muted-foreground">Loading task...</div>
				</main>
			</div>
		);
	}

	if (error || !task) {
		return (
			<div className="flex h-screen bg-background">
				<Sidebar />
				<main className="flex flex-1 flex-col items-center justify-center gap-4">
					<div className="text-destructive">Task not found</div>
					<Link href="/" className="text-primary text-sm hover:underline">
						Back to board
					</Link>
				</main>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-background">
			<Sidebar />

			<main className="flex flex-1 flex-col">
				<header className="flex items-center justify-between border-border border-b px-6 py-5">
					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="flex size-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:border-foreground/20"
						>
							<ArrowLeft size={16} className="text-foreground" />
						</Link>
						<div className="flex items-center gap-2 text-sm">
							<span className="text-muted-foreground">Project Overview</span>
							<span className="text-muted-foreground/50">/</span>
							<span className="font-medium text-foreground">Task Details</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							type="button"
							className="flex h-9 items-center gap-2 rounded-lg border border-border bg-transparent px-3 text-foreground text-sm transition-colors hover:border-foreground/20 hover:bg-accent"
							onClick={() => setIsEditModalOpen(true)}
						>
							<PencilSimple size={16} />
							Edit
						</button>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:border-foreground/20 hover:bg-accent">
								<DotsThree
									size={20}
									weight="bold"
									className="text-foreground"
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-40 rounded-lg border border-border bg-popover p-1"
								align="end"
							>
								<DropdownMenuItem
									className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
									onClick={handleDelete}
								>
									<Trash size={16} />
									<span className="text-sm">Delete task</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>

				{/* Content Area */}
				<div className="flex flex-1 overflow-hidden">
					<div className="flex flex-1 flex-col gap-6 overflow-y-auto border-border border-r p-8">
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-3">
								{task.priority !== "NONE" && (
									<div
										className="size-2.5 rounded-sm"
										style={{ backgroundColor: priorityColors[task.priority] }}
									/>
								)}
								<h1 className="font-semibold text-[28px] text-foreground tracking-tight">
									{task.title}
								</h1>
							</div>
							<div className="flex items-center gap-4">
								<div
									className="flex h-7 items-center gap-1.5 rounded-md px-3"
									style={{ backgroundColor: `${task.statusColor}20` }}
								>
									<div
										className="size-1.5 rounded-full"
										style={{ backgroundColor: task.column.color ?? undefined }}
									/>
									<span
										className="font-medium text-xs"
										style={{ color: task.column.color ?? undefined }}
									>
										{task.status}
									</span>
								</div>
								<span className="text-[13px] text-muted-foreground">
									Created {formatDate(task.createdAt)}
								</span>
							</div>
						</div>

						{task.description && (
							<div className="flex flex-col gap-3">
								<span className="font-medium text-muted-foreground text-xs">
									Description
								</span>
								<p className="text-[15px] text-foreground leading-relaxed">
									{task.description}
								</p>
							</div>
						)}

						{task.labels && task.labels.length > 0 && (
							<div className="flex flex-col gap-3">
								<span className="font-medium text-muted-foreground text-xs">
									Labels
								</span>
								<div className="flex flex-wrap gap-2">
									{task.labels.map((label) => (
										<div
											key={label.text}
											className="flex h-7 items-center rounded-md px-3"
											style={{ backgroundColor: `${label.color}15` }}
										>
											{subtask.text}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Activity */}
						<div className="flex flex-col gap-6">
							<span className="font-semibold text-[#6B6B70] text-[13px]">
								Activity
							</span>

							{/* Comment Input */}
							<div className="flex h-12 items-center gap-3 rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3.5">
								<Avatar className="size-7">
									<AvatarFallback className="bg-[#6366F1] font-semibold text-[10px] text-white">
										JS
									</AvatarFallback>
								</Avatar>
								<span className="text-[#4A4A50] text-sm">Add a comment...</span>
							</div>

							{/* Comments */}
							<div className="flex flex-col gap-4">
								{task.comments.map((comment) => (
									<div key={comment.id} className="flex gap-3">
										<Avatar className="size-8">
											<AvatarFallback
												className="font-semibold text-[11px] text-white"
												style={{ backgroundColor: comment.color }}
											>
												{comment.initials}
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-1 flex-col gap-1.5">
											<div className="flex items-center gap-2">
												<span className="font-medium text-[#FAFAF9] text-sm">
													{comment.author}
												</span>
												<span className="text-[#4A4A50] text-xs">
													{comment.time}
												</span>
											</div>
											<p className="text-[#6B6B70] text-sm leading-relaxed">
												{comment.text}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="flex w-[360px] shrink-0 flex-col gap-6 bg-card p-6">
						<span className="font-semibold text-base text-foreground">
							Details
						</span>

						{/* Details List */}
						<div className="flex flex-col gap-5">
							{/* Assignee */}
							<div className="flex items-center justify-between">
								<span className="text-[13px] text-muted-foreground">
									Assignee
								</span>
								{task.assignee ? (
									<div className="flex items-center gap-2.5">
										<Avatar className="size-7">
											<AvatarFallback
												className="font-semibold text-[10px] text-white"
												style={{
													backgroundColor: stringToColor(task.assignee.name),
												}}
											>
												{getInitials(task.assignee.name)}
											</AvatarFallback>
										</Avatar>
										<span className="font-medium text-foreground text-sm">
											{task.assignee.name}
										</span>
									</div>
								) : (
									<span className="text-muted-foreground text-sm">
										Unassigned
									</span>
								)}
							</div>

							{/* Due Date */}
							<div className="flex items-center justify-between">
								<span className="text-[13px] text-muted-foreground">
									Due Date
								</span>
								<div className="flex items-center gap-2">
									<CalendarBlank size={16} className="text-muted-foreground" />
									<span className="font-medium text-foreground text-sm">
										{formatDate(task.dueDate)}
									</span>
								</div>
							</div>

							{/* Priority */}
							<div className="flex items-center justify-between">
								<span className="text-[13px] text-muted-foreground">
									Priority
								</span>
								<div className="flex items-center gap-2">
									{task.priority !== "NONE" && (
										<div
											className="size-2 rounded-full"
											style={{ backgroundColor: priorityColors[task.priority] }}
										/>
									)}
									<span className="font-medium text-foreground text-sm">
										{priorityLabels[task.priority]}
									</span>
								</div>
							</div>

							{/* Project */}
							<div className="flex items-center justify-between">
								<span className="text-[13px] text-muted-foreground">
									Status
								</span>
								<div className="flex items-center gap-2">
									<div
										className="size-2 rounded-full"
										style={{ backgroundColor: task.column.color ?? undefined }}
									/>
									<span className="font-medium text-foreground text-sm">
										{task.column.name}
									</span>
								</div>
							</div>
						</div>

						<div className="h-px bg-border" />

						{/* Tags */}
						<div className="flex flex-col gap-3">
							<span className="font-semibold text-base text-foreground">
								Created by
							</span>
							<div className="flex flex-wrap gap-2">
								{task.tags.map((tag) => (
									<div
										key={tag.text}
										className="flex h-7 items-center rounded-md px-3"
										style={{ backgroundColor: `${tag.color}33` }}
									>
										{getInitials(task.createdBy.name)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="font-medium text-foreground text-sm">
										{task.createdBy.name}
									</span>
									<span className="text-muted-foreground text-xs">
										{formatDate(task.createdAt)}
									</span>
								</div>
							</div>
						</div>

						<Separator className="bg-[#2A2A2E]" />

						{/* Attachments */}
						<div className="flex flex-col gap-3">
							<span className="font-semibold text-[#FAFAF9] text-base">
								Attachments
							</span>
							{task.attachments.map((attachment) => (
								<div
									key={attachment.name}
									className="flex h-12 items-center gap-3 rounded-lg bg-[#16161A] px-3"
								>
									<FileImage className="size-5 text-[#6366F1]" />
									<div className="flex flex-1 flex-col gap-0.5">
										<span className="font-medium text-[#FAFAF9] text-[13px]">
											{attachment.name}
										</span>
										<span className="text-[#4A4A50] text-[11px]">
											{attachment.size}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
