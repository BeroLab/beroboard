"use client";

import {
	CalendarBlank,
	CaretDown,
	Check,
	FloppyDisk,
	Plus,
	X,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
	Column,
	TaskLabel,
	TaskWithDetails,
	UpdateTaskInput,
} from "@/lib/types";

interface EditTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: TaskWithDetails;
	columns: Column[];
	onSubmit: (data: UpdateTaskInput) => Promise<void>;
}

interface TagProps {
	text: string;
	color: string;
	onRemove?: () => void;
}

const priorities = [
	{ id: "HIGH" as const, label: "High", color: "#ef4444" },
	{ id: "MEDIUM" as const, label: "Medium", color: "#f59e0b" },
	{ id: "LOW" as const, label: "Low", color: "#22c55e" },
	{ id: "NONE" as const, label: "None", color: "transparent" },
];

const dueDates = [
	{
		id: "today",
		label: "Today",
		getValue: () => new Date().toISOString(),
	},
	{
		id: "tomorrow",
		label: "Tomorrow",
		getValue: () => new Date(Date.now() + 86400000).toISOString(),
	},
	{
		id: "next-week",
		label: "Next Week",
		getValue: () => new Date(Date.now() + 7 * 86400000).toISOString(),
	},
	{
		id: "next-month",
		label: "Next Month",
		getValue: () => new Date(Date.now() + 30 * 86400000).toISOString(),
	},
	{
		id: "no-date",
		label: "No due date",
		getValue: () => undefined,
	},
];

function formatDueDate(date: Date | string | null): string {
	if (!date) return "No due date";
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function Tag({ text, color, onRemove }: TagProps) {
	return (
		<div
			className="flex h-6 items-center gap-1 rounded px-2"
			style={{ backgroundColor: `${color}15` }}
		>
			<span className="font-medium text-xs" style={{ color }}>
				{text}
			</span>
			{onRemove && (
				<button type="button" onClick={onRemove}>
					<X size={12} style={{ color }} />
				</button>
			)}
		</div>
	);
}

export function EditTaskModal({
	isOpen,
	onClose,
	task,
	columns,
	onSubmit,
}: EditTaskModalProps) {
	const [name, setName] = useState(task.title);
	const [description, setDescription] = useState(task.description ?? "");
	const [selectedColumn, setSelectedColumn] = useState<Column | null>(
		columns.find((c) => c.id === task.columnId) ?? null,
	);
	const [priority, setPriority] = useState(
		priorities.find((p) => p.id === task.priority) ?? priorities[3],
	);
	const [dueDate, setDueDate] = useState<(typeof dueDates)[number] | null>(
		task.dueDate ? null : dueDates[4],
	);
	const [customDueDate, setCustomDueDate] = useState<string | null>(
		task.dueDate ? new Date(task.dueDate).toISOString() : null,
	);
	const [tags, setTags] = useState<TaskLabel[]>(task.labels ?? []);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setName(task.title);
			setDescription(task.description ?? "");
			setSelectedColumn(columns.find((c) => c.id === task.columnId) ?? null);
			setPriority(
				priorities.find((p) => p.id === task.priority) ?? priorities[3],
			);
			setDueDate(task.dueDate ? null : dueDates[4]);
			setCustomDueDate(
				task.dueDate ? new Date(task.dueDate).toISOString() : null,
			);
			setTags(task.labels ?? []);
		}
	}, [isOpen, task, columns]);

	const handleSubmit = async () => {
		if (!name.trim() || !selectedColumn) return;

		setIsSubmitting(true);
		try {
			const finalDueDate = dueDate
				? dueDate.getValue()
				: (customDueDate ?? undefined);
			await onSubmit({
				title: name,
				description: description || undefined,
				priority: priority.id,
				dueDate: finalDueDate,
				labels: tags.length > 0 ? tags : undefined,
				columnId: selectedColumn.id,
			});
			onClose();
		} finally {
			setIsSubmitting(false);
		}
	};

	const removeTag = (index: number) => {
		setTags(tags.filter((_, i) => i !== index));
	};

	const handleDueDateSelect = (d: (typeof dueDates)[number]) => {
		setDueDate(d);
		setCustomDueDate(null);
	};

	const dueDateLabel = dueDate
		? dueDate.label
		: customDueDate
			? formatDueDate(customDueDate)
			: "No due date";

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[480px] max-w-[480px] gap-0 rounded-xl border border-border bg-card p-0 sm:max-w-[480px]"
			>
				<DialogHeader className="flex-row items-center justify-between border-border border-b px-5 py-4">
					<DialogTitle className="font-semibold text-base text-foreground">
						Edit task
					</DialogTitle>
					<DialogClose className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
						<X size={16} />
					</DialogClose>
				</DialogHeader>

				<div className="flex flex-col gap-4 p-5">
					<div className="flex flex-col gap-1.5">
						<label className="font-medium text-muted-foreground text-xs">
							Task name
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter task name..."
							className="h-9 rounded-lg border border-border bg-background px-3 text-foreground text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="font-medium text-muted-foreground text-xs">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add a description..."
							className="h-20 resize-none rounded-lg border border-border bg-background p-3 text-foreground text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
						/>
					</div>

					<div className="flex gap-3">
						<div className="flex flex-1 flex-col gap-1.5">
							<label className="font-medium text-muted-foreground text-xs">
								Status
							</label>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-background px-3 outline-none transition-colors hover:border-foreground/20">
									<div className="flex items-center gap-2">
										{selectedColumn?.color && (
											<div
												className="size-2 rounded-full"
												style={{ backgroundColor: selectedColumn.color }}
											/>
										)}
										<span className="text-foreground text-sm">
											{selectedColumn?.name ?? "Select status"}
										</span>
									</div>
									<CaretDown size={14} className="text-muted-foreground" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-[--trigger-width] rounded-lg border border-border bg-popover p-1"
									align="start"
									sideOffset={4}
								>
									<DropdownMenuGroup>
										{columns.map((col) => (
											<DropdownMenuItem
												key={col.id}
												className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-foreground hover:bg-accent focus:bg-accent"
												onClick={() => setSelectedColumn(col)}
											>
												<div className="flex items-center gap-2">
													{col.color && (
														<div
															className="size-2 rounded-full"
															style={{ backgroundColor: col.color }}
														/>
													)}
													<span className="text-sm">{col.name}</span>
												</div>
												{selectedColumn?.id === col.id && (
													<Check size={14} className="text-foreground" />
												)}
											</DropdownMenuItem>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div className="flex flex-1 flex-col gap-1.5">
							<label className="font-medium text-muted-foreground text-xs">
								Priority
							</label>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-background px-3 outline-none transition-colors hover:border-foreground/20">
									<div className="flex items-center gap-2">
										{priority.color !== "transparent" && (
											<div
												className="size-2 rounded-full"
												style={{ backgroundColor: priority.color }}
											/>
										)}
										<span className="text-foreground text-sm">
											{priority.label}
										</span>
									</div>
									<CaretDown size={14} className="text-muted-foreground" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-[--trigger-width] rounded-lg border border-border bg-popover p-1"
									align="start"
									sideOffset={4}
								>
									<DropdownMenuGroup>
										{priorities.map((p) => (
											<DropdownMenuItem
												key={p.id}
												className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-foreground hover:bg-accent focus:bg-accent"
												onClick={() => setPriority(p)}
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
												{priority.id === p.id && (
													<Check size={14} className="text-foreground" />
												)}
											</DropdownMenuItem>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="font-medium text-muted-foreground text-xs">
							Due date
						</label>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-background px-3 outline-none transition-colors hover:border-foreground/20">
								<div className="flex items-center gap-2">
									<CalendarBlank size={14} className="text-muted-foreground" />
									<span className="text-foreground text-sm">
										{dueDateLabel}
									</span>
								</div>
								<CaretDown size={14} className="text-muted-foreground" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--trigger-width] rounded-lg border border-border bg-popover p-1"
								align="start"
								sideOffset={4}
							>
								<DropdownMenuGroup>
									{dueDates.map((d) => (
										<DropdownMenuItem
											key={d.id}
											className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-foreground hover:bg-accent focus:bg-accent"
											onClick={() => handleDueDateSelect(d)}
										>
											<span className="text-sm">{d.label}</span>
											{dueDate?.id === d.id && (
												<Check size={14} className="text-foreground" />
											)}
										</DropdownMenuItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="font-medium text-muted-foreground text-xs">
							Labels
						</label>
						<div className="flex flex-wrap items-center gap-1.5">
							{tags.map((tag, index) => (
								<Tag
									key={`${tag.text}-${index}`}
									text={tag.text}
									color={tag.color}
									onRemove={() => removeTag(index)}
								/>
							))}
							<button
								type="button"
								className="flex h-6 items-center gap-1 rounded border border-border border-dashed px-2 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
							>
								<Plus size={12} />
								<span className="text-xs">Add label</span>
							</button>
						</div>
					</div>
				</div>

				<DialogFooter className="flex-row justify-end gap-2 border-border border-t px-5 py-4">
					<DialogClose className="flex h-8 items-center justify-center rounded-lg border border-border px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
						<span className="text-sm">Cancel</span>
					</DialogClose>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!name.trim() || !selectedColumn || isSubmitting}
						className="flex h-8 items-center justify-center gap-1.5 rounded-full bg-foreground px-4 text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<FloppyDisk size={14} weight="bold" />
						<span className="font-medium text-sm">
							{isSubmitting ? "Saving..." : "Save changes"}
						</span>
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
