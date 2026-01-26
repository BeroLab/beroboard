"use client";

import { Calendar, Check, ChevronDown, Plus, X } from "lucide-react";
import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Column, CreateTaskInput, TaskLabel } from "~/lib/types";

interface CreateTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	columns: Column[];
	onSubmit: (
		data: Omit<CreateTaskInput, "organizationId" | "createdById">,
	) => Promise<void>;
}

interface TagProps {
	text: string;
	color: string;
	onRemove?: () => void;
}

const priorities = [
	{ id: "HIGH" as const, label: "High", color: "#E85A4F" },
	{ id: "MEDIUM" as const, label: "Medium", color: "#FFB547" },
	{ id: "LOW" as const, label: "Low", color: "#32D583" },
	{ id: "NONE" as const, label: "None", color: "#4A4A50" },
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

function Tag({ text, color, onRemove }: TagProps) {
	return (
		<div
			className="flex h-7 items-center gap-1.5 rounded-md px-2.5"
			style={{ backgroundColor: `${color}33` }}
		>
			<span className="font-medium text-xs" style={{ color }}>
				{text}
			</span>
			{onRemove && (
				<button type="button" onClick={onRemove}>
					<X className="size-3" style={{ color }} />
				</button>
			)}
		</div>
	);
}

export function CreateTaskModal({
	isOpen,
	onClose,
	columns,
	onSubmit,
}: CreateTaskModalProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedColumn, setSelectedColumn] = useState<Column | null>(
		columns[0] ?? null,
	);
	const [priority, setPriority] = useState(priorities[3]);
	const [dueDate, setDueDate] = useState(dueDates[4]);
	const [tags, setTags] = useState<TaskLabel[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const resetForm = () => {
		setName("");
		setDescription("");
		setSelectedColumn(columns[0] ?? null);
		setPriority(priorities[3]);
		setDueDate(dueDates[4]);
		setTags([]);
	};

	const handleSubmit = async () => {
		if (!name.trim() || !selectedColumn) return;

		setIsSubmitting(true);
		try {
			await onSubmit({
				title: name,
				description: description || undefined,
				priority: priority.id,
				dueDate: dueDate.getValue(),
				labels: tags.length > 0 ? tags : undefined,
				columnId: selectedColumn.id,
			});
			resetForm();
			onClose();
		} finally {
			setIsSubmitting(false);
		}
	};

	const removeTag = (index: number) => {
		setTags(tags.filter((_, i) => i !== index));
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[600px] max-w-[600px] gap-0 rounded-2xl border-none bg-[#1A1A1E] p-0 ring-0 sm:max-w-[600px]"
			>
				{/* Header */}
				<DialogHeader className="flex-row items-center justify-between border-[#2A2A2E] border-b p-6">
					<DialogTitle className="font-semibold text-[#FAFAF9] text-[22px] -tracking-wide">
						Create New Task
					</DialogTitle>
					<DialogClose className="flex size-8 items-center justify-center rounded-lg bg-[#16161A] transition-colors hover:bg-[#1E1E22]">
						<X className="size-[18px] text-[#6B6B70]" />
					</DialogClose>
				</DialogHeader>

				{/* Body */}
				<div className="flex flex-col gap-5 p-6">
					{/* Task Name */}
					<div className="flex flex-col gap-2">
						<label className="font-medium text-[#6B6B70] text-[13px]">
							Task Name
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter task name..."
							className="h-11 rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3.5 text-[#FAFAF9] text-sm placeholder:text-[#4A4A50] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
						/>
					</div>

					{/* Description */}
					<div className="flex flex-col gap-2">
						<label className="font-medium text-[#6B6B70] text-[13px]">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add a description..."
							className="h-[100px] resize-none rounded-lg border border-[#2A2A2E] bg-[#16161A] p-3.5 text-[#FAFAF9] text-sm placeholder:text-[#4A4A50] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
						/>
					</div>

					{/* Column & Priority */}
					<div className="flex gap-4">
						{/* Column Dropdown */}
						<div className="flex flex-1 flex-col gap-2">
							<label className="font-medium text-[#6B6B70] text-[13px]">
								Column
							</label>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3.5 outline-none transition-colors hover:border-[#3A3A3E] focus:border-[#6366F1]">
									<div className="flex items-center gap-2">
										{selectedColumn?.color && (
											<div
												className="size-2 rounded-full"
												style={{ backgroundColor: selectedColumn.color }}
											/>
										)}
										<span className="text-[#FAFAF9] text-sm">
											{selectedColumn?.name ?? "Select column"}
										</span>
									</div>
									<ChevronDown className="size-[18px] text-[#6B6B70]" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-[--trigger-width] rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
									align="start"
									sideOffset={4}
								>
									<DropdownMenuGroup>
										{columns.map((col) => (
											<DropdownMenuItem
												key={col.id}
												className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[#FAFAF9] hover:bg-[#16161A] focus:bg-[#16161A]"
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
													<Check className="size-4 text-[#6366F1]" />
												)}
											</DropdownMenuItem>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Priority Dropdown */}
						<div className="flex flex-1 flex-col gap-2">
							<label className="font-medium text-[#6B6B70] text-[13px]">
								Priority
							</label>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3.5 outline-none transition-colors hover:border-[#3A3A3E] focus:border-[#6366F1]">
									<div className="flex items-center gap-2">
										<div
											className="size-2 rounded-full"
											style={{ backgroundColor: priority.color }}
										/>
										<span className="text-[#FAFAF9] text-sm">
											{priority.label}
										</span>
									</div>
									<ChevronDown className="size-[18px] text-[#6B6B70]" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-[--trigger-width] rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
									align="start"
									sideOffset={4}
								>
									<DropdownMenuGroup>
										{priorities.map((p) => (
											<DropdownMenuItem
												key={p.id}
												className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[#FAFAF9] hover:bg-[#16161A] focus:bg-[#16161A]"
												onClick={() => setPriority(p)}
											>
												<div className="flex items-center gap-2">
													<div
														className="size-2 rounded-full"
														style={{ backgroundColor: p.color }}
													/>
													<span className="text-sm">{p.label}</span>
												</div>
												{priority.id === p.id && (
													<Check className="size-4 text-[#6366F1]" />
												)}
											</DropdownMenuItem>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Due Date */}
					<div className="flex flex-col gap-2">
						<label className="font-medium text-[#6B6B70] text-[13px]">
							Due Date
						</label>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3.5 outline-none transition-colors hover:border-[#3A3A3E] focus:border-[#6366F1]">
								<div className="flex items-center gap-2.5">
									<Calendar className="size-4 text-[#6B6B70]" />
									<span className="text-[#FAFAF9] text-sm">
										{dueDate.label}
									</span>
								</div>
								<ChevronDown className="size-[18px] text-[#6B6B70]" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--trigger-width] rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
								align="start"
								sideOffset={4}
							>
								<DropdownMenuGroup>
									{dueDates.map((d) => (
										<DropdownMenuItem
											key={d.id}
											className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[#FAFAF9] hover:bg-[#16161A] focus:bg-[#16161A]"
											onClick={() => setDueDate(d)}
										>
											<span className="text-sm">{d.label}</span>
											{dueDate.id === d.id && (
												<Check className="size-4 text-[#6366F1]" />
											)}
										</DropdownMenuItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Tags */}
					<div className="flex flex-col gap-2">
						<label className="font-medium text-[#6B6B70] text-[13px]">
							Tags
						</label>
						<div className="flex flex-wrap items-center gap-2">
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
								className="flex h-7 items-center gap-1 rounded-md border border-[#2A2A2E] px-2.5 transition-colors hover:border-[#3A3A3E]"
							>
								<Plus className="size-3.5 text-[#4A4A50]" />
								<span className="font-medium text-[#4A4A50] text-xs">
									Add tag
								</span>
							</button>
						</div>
					</div>
				</div>

				{/* Footer */}
				<DialogFooter className="flex-row justify-end border-[#2A2A2E] border-t p-6">
					<DialogClose className="flex h-11 items-center justify-center rounded-lg border border-[#2A2A2E] px-5 transition-colors hover:bg-[#16161A]">
						<span className="font-medium text-[#6B6B70] text-sm">Cancel</span>
					</DialogClose>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!name.trim() || !selectedColumn || isSubmitting}
						className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#6366F1] px-6 transition-colors hover:bg-[#5558E3] disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Plus className="size-[18px] text-white" />
						<span className="font-semibold text-sm text-white">
							{isSubmitting ? "Creating..." : "Create Task"}
						</span>
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
