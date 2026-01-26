"use client";

import {
	ArrowLeft,
	Calendar,
	Check,
	Edit2,
	FileImage,
	MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { Sidebar } from "~/components/board";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

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

export default function TaskDetailsPage() {
	const task = STATIC_TASK;
	const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

	return (
		<div className="flex h-screen bg-[#0B0B0E]">
			<Sidebar />

			<main className="flex flex-1 flex-col">
				{/* Header */}
				<header className="flex items-center justify-between border-[#2A2A2E] border-b px-6 py-5">
					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="flex size-9 items-center justify-center rounded-lg border border-[#2A2A2E] bg-[#16161A] transition-colors hover:border-[#3A3A3E]"
						>
							<ArrowLeft className="size-4 text-[#FAFAF9]" />
						</Link>
						<div className="flex items-center gap-2 text-sm">
							<span className="text-[#6B6B70]">Project Overview</span>
							<span className="text-[#4A4A50]">/</span>
							<span className="font-medium text-[#FAFAF9]">Task Details</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							size="sm"
							className="h-9 gap-2 border-[#2A2A2E] bg-transparent text-[#FAFAF9] hover:border-[#3A3A3E] hover:bg-[#16161A]"
						>
							<Edit2 className="size-4" />
							Edit
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="size-9 border-[#2A2A2E] bg-[#16161A] hover:border-[#3A3A3E] hover:bg-[#1A1A1E]"
						>
							<MoreHorizontal className="size-4 text-[#FAFAF9]" />
						</Button>
					</div>
				</header>

				{/* Content Area */}
				<div className="flex flex-1 overflow-hidden">
					{/* Left Panel */}
					<div className="flex flex-1 flex-col gap-6 overflow-y-auto border-[#2A2A2E] border-r p-8">
						{/* Task Header */}
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-3">
								<div
									className="size-2.5 rounded-sm"
									style={{ backgroundColor: task.priorityColor }}
								/>
								<h1 className="font-semibold text-[#FAFAF9] text-[28px] tracking-tight">
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
										style={{ backgroundColor: task.statusColor }}
									/>
									<span
										className="font-medium text-xs"
										style={{ color: task.statusColor }}
									>
										{task.status}
									</span>
								</div>
								<span className="text-[#4A4A50] text-[13px]">
									Created {task.createdAt}
								</span>
							</div>
						</div>

						{/* Description */}
						<div className="flex flex-col gap-3">
							<span className="font-semibold text-[#6B6B70] text-[13px]">
								Description
							</span>
							<p className="text-[#FAFAF9] text-[15px] leading-relaxed">
								{task.description}
							</p>
						</div>

						{/* Subtasks */}
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-[#6B6B70] text-[13px]">
									Subtasks
								</span>
								<span className="text-[#4A4A50] text-xs">
									{completedSubtasks} of {task.subtasks.length} completed
								</span>
							</div>
							<div className="flex flex-col gap-2">
								{task.subtasks.map((subtask) => (
									<div
										key={subtask.id}
										className="flex h-11 items-center gap-3 rounded-lg bg-[#16161A] px-3.5"
									>
										{subtask.completed ? (
											<div className="flex size-5 items-center justify-center rounded bg-[#32D583]">
												<Check className="size-3.5 text-white" />
											</div>
										) : (
											<div className="size-5 rounded border-2 border-[#4A4A50]" />
										)}
										<span
											className={cn(
												"text-sm",
												subtask.completed ? "text-[#4A4A50]" : "text-[#FAFAF9]",
											)}
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

					{/* Right Panel */}
					<div className="flex w-[360px] shrink-0 flex-col gap-6 bg-[#1A1A1E] p-6">
						<span className="font-semibold text-[#FAFAF9] text-base">
							Details
						</span>

						{/* Details List */}
						<div className="flex flex-col gap-5">
							{/* Assignee */}
							<div className="flex items-center justify-between">
								<span className="text-[#4A4A50] text-[13px]">Assignee</span>
								<div className="flex items-center gap-2.5">
									<Avatar className="size-7">
										<AvatarFallback
											className="font-semibold text-[10px] text-white"
											style={{ backgroundColor: task.assignee.color }}
										>
											{task.assignee.initials}
										</AvatarFallback>
									</Avatar>
									<span className="font-medium text-[#FAFAF9] text-sm">
										{task.assignee.name}
									</span>
								</div>
							</div>

							{/* Due Date */}
							<div className="flex items-center justify-between">
								<span className="text-[#4A4A50] text-[13px]">Due Date</span>
								<div className="flex items-center gap-2">
									<Calendar className="size-4 text-[#6B6B70]" />
									<span className="font-medium text-[#FAFAF9] text-sm">
										{task.dueDate}
									</span>
								</div>
							</div>

							{/* Priority */}
							<div className="flex items-center justify-between">
								<span className="text-[#4A4A50] text-[13px]">Priority</span>
								<div className="flex items-center gap-2">
									<div
										className="size-2 rounded-full"
										style={{ backgroundColor: task.priorityColor }}
									/>
									<span className="font-medium text-[#FAFAF9] text-sm">
										{task.priority}
									</span>
								</div>
							</div>

							{/* Project */}
							<div className="flex items-center justify-between">
								<span className="text-[#4A4A50] text-[13px]">Project</span>
								<span className="font-medium text-[#FAFAF9] text-sm">
									{task.project}
								</span>
							</div>
						</div>

						<Separator className="bg-[#2A2A2E]" />

						{/* Tags */}
						<div className="flex flex-col gap-3">
							<span className="font-semibold text-[#FAFAF9] text-base">
								Tags
							</span>
							<div className="flex flex-wrap gap-2">
								{task.tags.map((tag) => (
									<div
										key={tag.text}
										className="flex h-7 items-center rounded-md px-3"
										style={{ backgroundColor: `${tag.color}33` }}
									>
										<span
											className="font-medium text-xs"
											style={{ color: tag.color }}
										>
											{tag.text}
										</span>
									</div>
								))}
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
