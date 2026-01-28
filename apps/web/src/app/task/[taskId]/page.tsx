"use client";

import {
	ArrowLeft,
	CaretDown,
	Check,
	DotsThree,
	Trash,
	User as UserIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "@/components/board";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useColumns,
	useDeleteTask,
	useMembers,
	useTask,
	useUpdateTask,
} from "@/hooks/board";
import type { Column, UpdateTaskInput, User } from "@/lib/types";

const priorityColors = {
	HIGH: "#ef4444",
	MEDIUM: "#f59e0b",
	LOW: "#22c55e",
	NONE: "transparent",
};

const priorities = [
	{ id: "HIGH" as const, label: "High", color: "#ef4444" },
	{ id: "MEDIUM" as const, label: "Medium", color: "#f59e0b" },
	{ id: "LOW" as const, label: "Low", color: "#22c55e" },
	{ id: "NONE" as const, label: "None", color: "transparent" },
];

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

interface EditableTitleProps {
	value: string;
	onSave: (value: string) => void;
	priority: "HIGH" | "MEDIUM" | "LOW" | "NONE";
}

function EditableTitle({ value, onSave, priority }: EditableTitleProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(value);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	useEffect(() => {
		setEditValue(value);
	}, [value]);

	const handleSave = () => {
		if (editValue.trim() && editValue !== value) {
			onSave(editValue.trim());
		} else {
			setEditValue(value);
		}
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSave();
		} else if (e.key === "Escape") {
			setEditValue(value);
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<div className="flex items-center gap-3">
				{priority !== "NONE" && (
					<div
						className="size-2.5 rounded-sm"
						style={{ backgroundColor: priorityColors[priority] }}
					/>
				)}
				<input
					ref={inputRef}
					type="text"
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					onBlur={handleSave}
					onKeyDown={handleKeyDown}
					className="w-full rounded-lg border border-border bg-background px-2 py-1 font-semibold text-[28px] text-foreground tracking-tight focus:border-foreground/30 focus:outline-none"
				/>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-3">
			{priority !== "NONE" && (
				<div
					className="size-2.5 rounded-sm"
					style={{ backgroundColor: priorityColors[priority] }}
				/>
			)}
			<button
				type="button"
				className="cursor-pointer rounded-lg bg-transparent p-0 text-left font-semibold text-[28px] text-foreground tracking-tight transition-colors hover:bg-accent/50"
				onClick={() => setIsEditing(true)}
			>
				{value}
			</button>
		</div>
	);
}

interface EditableDescriptionProps {
	value: string | null;
	onSave: (value: string | undefined) => void;
}

function EditableDescription({ value, onSave }: EditableDescriptionProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(value ?? "");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (isEditing && textareaRef.current) {
			textareaRef.current.focus();
			textareaRef.current.select();
		}
	}, [isEditing]);

	useEffect(() => {
		setEditValue(value ?? "");
	}, [value]);

	const handleSave = () => {
		const trimmed = editValue.trim();
		if (trimmed !== (value ?? "")) {
			onSave(trimmed || undefined);
		}
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setEditValue(value ?? "");
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<div className="flex flex-col gap-3">
				<span className="font-medium text-muted-foreground text-xs">
					Description
				</span>
				<textarea
					ref={textareaRef}
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					onBlur={handleSave}
					onKeyDown={handleKeyDown}
					placeholder="Add a description..."
					className="min-h-[100px] rounded-lg border border-border bg-background p-3 text-[15px] text-foreground leading-relaxed placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<span className="font-medium text-muted-foreground text-xs">
				Description
			</span>
			<button
				type="button"
				className="min-h-[24px] w-full cursor-pointer rounded-lg bg-transparent p-0 text-left text-[15px] text-foreground leading-relaxed transition-colors hover:bg-accent/50"
				onClick={() => setIsEditing(true)}
			>
				{value || (
					<span className="text-muted-foreground">Add a description...</span>
				)}
			</button>
		</div>
	);
}

interface AssigneeSelectProps {
	assignee: User | null;
	members: User[];
	onSelect: (assigneeId: string | null) => void;
}

function AssigneeSelect({ assignee, members, onSelect }: AssigneeSelectProps) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-[13px] text-muted-foreground">Assignee</span>
			<DropdownMenu>
				<DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent">
					{assignee ? (
						<>
							<Avatar className="size-7">
								<AvatarFallback
									className="font-semibold text-[10px] text-white"
									style={{
										backgroundColor: stringToColor(assignee.name),
									}}
								>
									{getInitials(assignee.name)}
								</AvatarFallback>
							</Avatar>
							<span className="font-medium text-foreground text-sm">
								{assignee.name}
							</span>
						</>
					) : (
						<>
							<div className="flex size-7 items-center justify-center rounded-full bg-muted">
								<UserIcon size={14} className="text-muted-foreground" />
							</div>
							<span className="text-muted-foreground text-sm">Unassigned</span>
						</>
					)}
					<CaretDown size={12} className="text-muted-foreground" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-56 rounded-lg border border-border bg-popover p-1"
					align="end"
					sideOffset={4}
				>
					<DropdownMenuGroup>
						<DropdownMenuItem
							className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-foreground hover:bg-accent focus:bg-accent"
							onClick={() => onSelect(null)}
						>
							<div className="flex items-center gap-2">
								<div className="flex size-7 items-center justify-center rounded-full bg-muted">
									<UserIcon size={14} className="text-muted-foreground" />
								</div>
								<span className="text-sm">Unassigned</span>
							</div>
							{!assignee && <Check size={14} className="text-foreground" />}
						</DropdownMenuItem>
						{members.map((member) => (
							<DropdownMenuItem
								key={member.id}
								className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-foreground hover:bg-accent focus:bg-accent"
								onClick={() => onSelect(member.id)}
							>
								<div className="flex items-center gap-2">
									<Avatar className="size-7">
										<AvatarFallback
											className="font-semibold text-[10px] text-white"
											style={{
												backgroundColor: stringToColor(member.name),
											}}
										>
											{getInitials(member.name)}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm">{member.name}</span>
								</div>
								{assignee?.id === member.id && (
									<Check size={14} className="text-foreground" />
								)}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

interface DueDateSelectProps {
	dueDate: Date | string | null;
	onSelect: (date: Date | undefined) => void;
}

function DueDateSelect({ dueDate, onSelect }: DueDateSelectProps) {
	const dateValue = dueDate ? new Date(dueDate) : null;

	return (
		<div className="flex items-center justify-between">
			<span className="text-[13px] text-muted-foreground">Due Date</span>
			<DatePicker
				value={dateValue}
				onChange={onSelect}
				placeholder="Not set"
				className="h-auto w-auto border-none bg-transparent px-2 py-1 hover:bg-accent"
			/>
		</div>
	);
}

interface PrioritySelectProps {
	priority: "HIGH" | "MEDIUM" | "LOW" | "NONE";
	onSelect: (priority: "HIGH" | "MEDIUM" | "LOW" | "NONE") => void;
}

function PrioritySelect({ priority, onSelect }: PrioritySelectProps) {
	const currentPriority = priorities.find((p) => p.id === priority);

	return (
		<div className="flex items-center justify-between">
			<span className="text-[13px] text-muted-foreground">Priority</span>
			<DropdownMenu>
				<DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent">
					{currentPriority && currentPriority.color !== "transparent" && (
						<div
							className="size-2 rounded-full"
							style={{ backgroundColor: currentPriority.color }}
						/>
					)}
					<span className="font-medium text-foreground text-sm">
						{currentPriority?.label ?? "None"}
					</span>
					<CaretDown size={12} className="text-muted-foreground" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-40 rounded-lg border border-border bg-popover p-1"
					align="end"
					sideOffset={4}
				>
					<DropdownMenuGroup>
						{priorities.map((p) => (
							<DropdownMenuItem
								key={p.id}
								className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-foreground hover:bg-accent focus:bg-accent"
								onClick={() => onSelect(p.id)}
							>
								<div className="flex items-center gap-2">
									{p.color !== "transparent" && (
										<div
											className="size-2 rounded-full"
											style={{ backgroundColor: p.color }}
										/>
									)}
									<span className="text-sm">{p.label}</span>
								</div>
								{priority === p.id && (
									<Check size={14} className="text-foreground" />
								)}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

interface StatusSelectProps {
	currentColumn: { id: string; name: string; color: string | null };
	columns: Column[];
	onSelect: (columnId: string) => void;
}

function StatusSelect({ currentColumn, columns, onSelect }: StatusSelectProps) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-[13px] text-muted-foreground">Status</span>
			<DropdownMenu>
				<DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent">
					<div
						className="size-2 rounded-full"
						style={{ backgroundColor: currentColumn.color ?? undefined }}
					/>
					<span className="font-medium text-foreground text-sm">
						{currentColumn.name}
					</span>
					<CaretDown size={12} className="text-muted-foreground" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-48 rounded-lg border border-border bg-popover p-1"
					align="end"
					sideOffset={4}
				>
					<DropdownMenuGroup>
						{columns.map((col) => (
							<DropdownMenuItem
								key={col.id}
								className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-foreground hover:bg-accent focus:bg-accent"
								onClick={() => onSelect(col.id)}
							>
								<div className="flex items-center gap-2">
									<div
										className="size-2 rounded-full"
										style={{ backgroundColor: col.color ?? undefined }}
									/>
									<span className="text-sm">{col.name}</span>
								</div>
								{currentColumn.id === col.id && (
									<Check size={14} className="text-foreground" />
								)}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

interface PageProps {
	params: Promise<{ taskId: string }>;
}

export default function TaskDetailsPage({ params }: PageProps) {
	const { taskId } = use(params);
	const router = useRouter();
	const { data: task, isLoading, error, refetch } = useTask(taskId);
	const { data: columns = [] } = useColumns(task?.organizationId ?? "");
	const { data: members = [] } = useMembers(task?.organizationId ?? "");
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

					<DropdownMenu>
						<DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:border-foreground/20 hover:bg-accent">
							<DotsThree size={20} weight="bold" className="text-foreground" />
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
				</header>

				<div className="flex flex-1 overflow-hidden">
					<div className="flex flex-1 flex-col gap-6 overflow-y-auto border-border border-r p-8">
						<div className="flex flex-col gap-4">
							<EditableTitle
								value={task.title}
								priority={task.priority}
								onSave={(title) => handleUpdate({ title })}
							/>
							<div className="flex items-center gap-4">
								<div
									className="flex h-7 items-center gap-1.5 rounded-md px-3"
									style={{ backgroundColor: `${task.column.color}20` }}
								>
									<div
										className="size-1.5 rounded-full"
										style={{ backgroundColor: task.column.color ?? undefined }}
									/>
									<span
										className="font-medium text-xs"
										style={{ color: task.column.color ?? undefined }}
									>
										{task.column.name}
									</span>
								</div>
								<span className="text-[13px] text-muted-foreground">
									Created {formatDate(task.createdAt)}
								</span>
							</div>
						</div>

						<EditableDescription
							value={task.description}
							onSave={(description) => handleUpdate({ description })}
						/>

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
											<span
												className="font-medium text-xs"
												style={{ color: label.color }}
											>
												{label.text}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="flex w-[360px] shrink-0 flex-col gap-6 bg-card p-6">
						<span className="font-semibold text-base text-foreground">
							Details
						</span>

						<div className="flex flex-col gap-5">
							<AssigneeSelect
								assignee={task.assignee}
								members={members}
								onSelect={(assigneeId) => handleUpdate({ assigneeId })}
							/>

							<DueDateSelect
								dueDate={task.dueDate}
								onSelect={(date) =>
									handleUpdate({ dueDate: date?.toISOString() })
								}
							/>

							<PrioritySelect
								priority={task.priority}
								onSelect={(priority) => handleUpdate({ priority })}
							/>

							<StatusSelect
								currentColumn={task.column}
								columns={columns}
								onSelect={(columnId) => handleUpdate({ columnId })}
							/>
						</div>

						<div className="h-px bg-border" />

						<div className="flex flex-col gap-3">
							<span className="font-semibold text-base text-foreground">
								Created by
							</span>
							<div className="flex items-center gap-2.5">
								<Avatar className="size-8">
									<AvatarFallback
										className="font-semibold text-[11px] text-white"
										style={{
											backgroundColor: stringToColor(task.createdBy.name),
										}}
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
					</div>
				</div>
			</main>
		</div>
	);
}
