"use client";

import { useState } from "react";

interface InlineTaskCreateProps {
	columnId: string;
	taskCount: number;
	onSubmit: (title: string, columnId: string) => void;
	isPending?: boolean;
}

export function InlineTaskCreate({
	columnId,
	taskCount,
	onSubmit,
	isPending,
}: InlineTaskCreateProps) {
	const [title, setTitle] = useState("");

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && title.trim()) {
			onSubmit(title.trim(), columnId);
			setTitle("");
		}
	};

	return (
		<div className="flex flex-col gap-1.5 rounded-lg bg-card p-3">
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Type the issue title here..."
				disabled={isPending}
				className="bg-transparent text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none disabled:opacity-50"
			/>
			<span className="text-muted-foreground/40 text-xs">
				Issue #{taskCount + 1}
			</span>
		</div>
	);
}
