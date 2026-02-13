"use client";

import { UserCircleDashedIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

interface InlineTaskCreateProps {
	columnId: string;
	taskCount: number;
	onSubmit: (title: string, columnId: string) => void;
	onCancel: () => void;
	isPending?: boolean;
}

export function InlineTaskCreate({
	columnId,
	taskCount,
	onSubmit,
	onCancel,
	isPending,
}: InlineTaskCreateProps) {
	const [title, setTitle] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && title.trim()) {
			onSubmit(title.trim(), columnId);
		} else if (e.key === "Escape") {
			onCancel();
		}
	};

	const handleBlur = () => {
		if (!title.trim()) {
			onCancel();
		}
	};

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-4">
			<input
				ref={inputRef}
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				placeholder="Type the issue title here..."
				disabled={isPending}
				className="bg-transparent text-foreground text-sm placeholder:text-muted-foreground/30 focus:outline-none disabled:opacity-50"
			/>

			<div className="flex items-center justify-between pt-4">
				<span className="text-muted-foreground/50 text-xs">
					Issue #{taskCount + 1} | FrontEnd
				</span>
				<UserCircleDashedIcon size={20} className="text-muted-foreground/40" />
			</div>
		</div>
	);
}
