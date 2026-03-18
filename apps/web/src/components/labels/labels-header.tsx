import { MagnifyingGlass, Plus } from "@phosphor-icons/react";

interface LabelsHeaderProps {
	title: string;
	subtitle: string;
  onNewLabel: () => void;
  searchQuery: string;
	onSearchChange: (query: string) => void;
}

export function LabelsHeader({
	title,
	subtitle,
  onNewLabel,
  searchQuery,
	onSearchChange,
}: LabelsHeaderProps) {
	return (
		<div className="flex items-center justify-between border-border border-b pb-4">
			<div className="flex flex-col gap-0.5">
				<h1 className="font-semibold text-foreground text-xl tracking-tight">
					{title}
				</h1>
				<p className="text-muted-foreground text-sm">{subtitle}</p>
			</div>

			<div className="flex items-center gap-3">
				<div className="flex h-9 w-56 items-center gap-2 rounded-lg border border-border bg-background px-3 focus-within:border-foreground/30">
					<MagnifyingGlass size={16} className="text-muted-foreground" />
					<input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
						placeholder="Search labels..."
						className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground focus:outline-none"
					/>
				</div>

				<button
					type="button"
					className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-foreground px-4 text-background transition-opacity hover:opacity-90"
					onClick={onNewLabel}
				>
					<Plus size={16} weight="bold" />
					<span className="font-medium text-sm">New Label</span>
				</button>
			</div>
		</div>
	);
}
