"use client";

import { CheckIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import type { ComponentType, SVGProps } from "react";
import { useRef, useState } from "react";
import {
	BacklogIcon,
	DoneIcon,
	InProgressIcon,
	ReviewIcon,
	TodoIcon,
} from "~/components/icons";
import { cn } from "~/lib/utils";

interface AddColumnProps {
	onAdd: (name: string, color?: string, description?: string) => void;
	isLoading?: boolean;
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const COLUMN_COLORS = [
	{ id: "blue", color: "#3b82f6" },
	{ id: "yellow", color: "#eab308" },
	{ id: "green", color: "#22c55e" },
	{ id: "purple", color: "#8b5cf6" },
	{ id: "red", color: "#ef4444" },
	{ id: "orange", color: "#f97316" },
	{ id: "pink", color: "#ec4899" },
	{ id: "cyan", color: "#06b6d4" },
];

const COLUMN_ICONS: { id: string; label: string; icon: IconComponent }[] = [
	{ id: "backlog", label: "Backlog", icon: BacklogIcon },
	{ id: "todo", label: "Todo", icon: TodoIcon },
	{ id: "in-progress", label: "In Progress", icon: InProgressIcon },
	{ id: "review", label: "Review", icon: ReviewIcon },
	{ id: "done", label: "Done", icon: DoneIcon },
];

type SelectionMode = "icon" | "color";

export function AddColumn({ onAdd, isLoading }: AddColumnProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [mode, setMode] = useState<SelectionMode>("icon");
	const [selectedIcon, setSelectedIcon] = useState(COLUMN_ICONS[0].id);
	const [selectedColor, setSelectedColor] = useState(COLUMN_COLORS[0].color);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = () => {
		if (!name.trim()) return;
		const colorValue =
			mode === "icon" ? `icon:${selectedIcon}` : selectedColor;
		onAdd(name.trim(), colorValue, description.trim() || undefined);
		setName("");
		setDescription("");
		setMode("icon");
		setSelectedIcon(COLUMN_ICONS[0].id);
		setSelectedColor(COLUMN_COLORS[0].color);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setName("");
		setDescription("");
		setMode("icon");
		setSelectedIcon(COLUMN_ICONS[0].id);
		setSelectedColor(COLUMN_COLORS[0].color);
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	};

	const handleStartEditing = () => {
		setIsEditing(true);
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	if (isEditing) {
		return (
			<div className="flex w-64 min-w-64 flex-col gap-3 rounded-lg border border-border/50 bg-card/30 p-3 shadow-sm">
				<input
					ref={inputRef}
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Column name..."
					className="h-9 rounded-lg border border-border bg-background px-3 text-foreground text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
				/>

				<input
					type="text"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Description (optional)"
					className="h-9 rounded-lg border border-border bg-background px-3 text-foreground text-xs placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
				/>

				{/* Mode toggle */}
				<div className="flex gap-1 rounded-lg bg-accent/50 p-0.5">
					<button
						type="button"
						onClick={() => setMode("icon")}
						className={cn(
							"flex-1 rounded-md px-2 py-1 text-xs transition-colors",
							mode === "icon"
								? "bg-background font-medium text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Icon
					</button>
					<button
						type="button"
						onClick={() => setMode("color")}
						className={cn(
							"flex-1 rounded-md px-2 py-1 text-xs transition-colors",
							mode === "color"
								? "bg-background font-medium text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Color
					</button>
				</div>

				{mode === "icon" ? (
					<div className="flex flex-col gap-1.5">
						<span className="text-muted-foreground text-xs">Icon</span>
						<div className="flex flex-wrap gap-1.5">
							{COLUMN_ICONS.map((item) => {
								const Icon = item.icon;
								return (
									<button
										key={item.id}
										type="button"
										onClick={() => setSelectedIcon(item.id)}
										title={item.label}
										className={cn(
											"flex size-7 items-center justify-center rounded-md transition-all",
											selectedIcon === item.id
												? "bg-accent ring-2 ring-foreground ring-offset-1 ring-offset-background"
												: "text-muted-foreground hover:bg-accent hover:text-foreground",
										)}
									>
										<Icon width={18} height={18} />
									</button>
								);
							})}
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
									onClick={() => setSelectedColor(c.color)}
									className={cn(
										"flex size-6 items-center justify-center rounded-md transition-all",
										selectedColor === c.color
											? "ring-2 ring-foreground ring-offset-1 ring-offset-background"
											: "hover:scale-110",
									)}
									style={{ backgroundColor: c.color }}
								>
									{selectedColor === c.color && (
										<CheckIcon size={12} weight="bold" className="text-white" />
									)}
								</button>
							))}
						</div>
					</div>
				)}

				<div className="flex gap-2">
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!name.trim() || isLoading}
						className="flex h-8 flex-1 items-center justify-center rounded-lg bg-foreground font-medium text-background text-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading ? "Adding..." : "Add column"}
					</button>
					<button
						type="button"
						onClick={handleCancel}
						className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
					>
						<XIcon size={14} />
					</button>
				</div>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={handleStartEditing}
			className="flex h-9 w-64 min-w-64 items-center justify-center gap-1.5 rounded-lg border border-border border-dashed text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-accent hover:text-foreground"
		>
			<PlusIcon size={14} />
			<span className="text-sm">Add column</span>
		</button>
	);
}

export { COLUMN_COLORS };
