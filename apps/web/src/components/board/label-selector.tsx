import { CheckIcon, PlusIcon } from "@phosphor-icons/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { TaskLabel } from "~/lib/types";
import { Button } from "../ui/button";

interface LabelSelectorProps {
	allLabels: TaskLabel[];
	selectedLabels: TaskLabel[];
	onToggleLabel: (label: TaskLabel) => void;
}

export function LabelSelector({
	allLabels,
	selectedLabels,
	onToggleLabel,
}: LabelSelectorProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="outline"
						className="flex h-6 items-center gap-1 rounded border border-border border-dashed px-2 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
					>
						<PlusIcon size={12} />
						<span className="text-xs">Add label</span>
					</Button>
				}
			/>
			<DropdownMenuContent className="w-60 rounded-lg border-border bg-popover p-1">
				<DropdownMenuGroup>
					{allLabels.length === 0 ? (
						<div className="px-2 py-1.5 text-muted-foreground text-sm">
							No labels found.
						</div>
					) : (
						allLabels.map((label) => {
							const isSelected = selectedLabels.some((l) => l.id === label.id);
							return (
								<DropdownMenuItem
									key={label.id}
									className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-foreground hover:bg-accent focus:bg-accent"
									onClick={(e) => {
										e.preventDefault();
										onToggleLabel(label);
									}}
								>
									<div className="flex items-center gap-2">
										<div
											className="size-2 rounded-full"
											style={{ backgroundColor: label.color }}
										/>
										<span className="text-sm">{label.text}</span>
									</div>
									{isSelected && (
										<CheckIcon size={14} className="text-foreground" />
									)}
								</DropdownMenuItem>
							);
						})
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
