"use client";

import { CalendarBlank } from "@phosphor-icons/react";
import { format } from "date-fns";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
	value?: Date | null;
	onChange?: (date: Date | undefined) => void;
	placeholder?: string;
	className?: string;
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Pick a date",
	className,
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

	const handleSelect = (date: Date | undefined) => {
		onChange?.(date);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				className={cn(
					"flex h-9 w-full items-center justify-between rounded-lg border border-border bg-background px-3 outline-none transition-colors hover:border-foreground/20",
					className,
				)}
			>
				<div className="flex items-center gap-2">
					<CalendarBlank size={14} className="text-muted-foreground" />
					<span
						className={cn(
							"text-sm",
							value ? "text-foreground" : "text-muted-foreground",
						)}
					>
						{value ? format(value, "MMM d, yyyy") : placeholder}
					</span>
				</div>
			</PopoverTrigger>
			<PopoverContent
				className="w-auto rounded-lg border border-border p-0"
				align="start"
			>
				<Calendar
					mode="single"
					selected={value ?? undefined}
					onSelect={handleSelect}
					disabled={{ before: new Date() }}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
