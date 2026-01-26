"use client";

import { Check, Plus, X } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { cn } from "~/lib/utils";

interface AddColumnProps {
	onAdd: (name: string, color?: string) => void;
	isLoading?: boolean;
}

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

export function AddColumn({ onAdd, isLoading }: AddColumnProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState("");
	const [selectedColor, setSelectedColor] = useState(COLUMN_COLORS[0].color);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = () => {
		if (!name.trim()) return;
		onAdd(name.trim(), selectedColor);
		setName("");
		setSelectedColor(COLUMN_COLORS[0].color);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setName("");
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
									<Check size={12} weight="bold" className="text-white" />
								)}
							</button>
						))}
					</div>
				</div>

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
						<X size={14} />
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
			<Plus size={14} />
			<span className="text-sm">Add column</span>
		</button>
	);
}

export { COLUMN_COLORS };
