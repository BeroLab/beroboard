"use client";

import {
	CaretUpDown,
	Check,
	Gear,
	House,
	Kanban,
	MagnifyingGlass,
	Plus,
	Question,
	SignOut,
	Users,
	Warning,
} from "@phosphor-icons/react";
import { useState } from "react";
import { AnimatedThemeToggler } from "~/components/ui/animated-theme-toggler";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

interface Organization {
	id: string;
	name: string;
	initials: string;
}

interface NavItem {
	icon: React.ReactNode;
	label: string;
	href?: string;
	active?: boolean;
	shortcut?: string;
}

interface SidebarProps {
	className?: string;
}

const organizations: Organization[] = [
	{ id: "1", name: "Acme Inc.", initials: "A" },
	{ id: "2", name: "Stark Industries", initials: "SI" },
	{ id: "3", name: "Wayne Enterprises", initials: "WE" },
];

const mainNavItems: NavItem[] = [
	{ icon: <House size={18} />, label: "Home" },
	{
		icon: <MagnifyingGlass size={18} />,
		label: "Search",
		shortcut: "Ctrl K",
	},
];

const workspaceNavItems: NavItem[] = [
	{ icon: <Kanban size={18} />, label: "Board", active: true },
	{ icon: <Users size={18} />, label: "Team" },
	{ icon: <Gear size={18} />, label: "Settings" },
];

const bottomNavItems: NavItem[] = [
	{ icon: <Question size={18} />, label: "Support" },
	{ icon: <Warning size={18} />, label: "Report an issue" },
];

export function Sidebar({ className }: SidebarProps) {
	const [selectedOrg, setSelectedOrg] = useState<Organization>(
		organizations[0],
	);

	return (
		<aside
			className={cn(
				"flex h-screen w-56 shrink-0 flex-col border-border border-r bg-background",
				className,
			)}
		>
			<div className="flex flex-1 flex-col overflow-y-auto">
				{/* Main Navigation */}
				<nav className="flex flex-col gap-0.5 p-2">
					{mainNavItems.map((item) => (
						<button
							type="button"
							key={item.label}
							className={cn(
								"flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
								item.active
									? "bg-accent font-medium text-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-foreground",
							)}
						>
							{item.icon}
							<span className="flex-1 text-left">{item.label}</span>
							{item.shortcut && (
								<span className="flex items-center gap-0.5 text-muted-foreground text-xs">
									{item.shortcut.split(" ").map((key) => (
										<kbd
											key={key}
											className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]"
										>
											{key}
										</kbd>
									))}
								</span>
							)}
						</button>
					))}
				</nav>

				{/* Divider */}
				<div className="mx-3 my-2 h-px bg-border" />

				{/* Organization Selector */}
				<div className="px-2">
					<DropdownMenu>
						<DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent">
							<div className="flex size-5 items-center justify-center rounded bg-foreground font-semibold text-[10px] text-background">
								{selectedOrg.initials}
							</div>
							<span className="flex-1 text-left font-medium text-foreground">
								{selectedOrg.name}
							</span>
							<CaretUpDown size={14} className="text-muted-foreground" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-52 rounded-lg border border-border bg-popover p-1"
							align="start"
							sideOffset={4}
						>
							<DropdownMenuGroup>
								{organizations.map((org) => (
									<DropdownMenuItem
										key={org.id}
										className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-foreground text-sm hover:bg-accent focus:bg-accent"
										onClick={() => setSelectedOrg(org)}
									>
										<div className="flex size-5 items-center justify-center rounded bg-foreground font-semibold text-[10px] text-background">
											{org.initials}
										</div>
										<span className="flex-1">{org.name}</span>
										{selectedOrg.id === org.id && (
											<Check size={14} className="text-foreground" />
										)}
									</DropdownMenuItem>
								))}
							</DropdownMenuGroup>
							<DropdownMenuSeparator className="my-1 bg-border" />
							<DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground text-sm hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground">
								<Plus size={14} />
								<span>Create organization</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Workspace Navigation */}
				<nav className="mt-1 flex flex-col gap-0.5 px-2">
					{workspaceNavItems.map((item) => (
						<button
							type="button"
							key={item.label}
							className={cn(
								"flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
								item.active
									? "bg-accent font-medium text-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-foreground",
							)}
						>
							{item.icon}
							<span>{item.label}</span>
						</button>
					))}
				</nav>
			</div>

			{/* Bottom Navigation */}
			<div className="flex flex-col gap-0.5 border-border border-t p-2">
				{/* Theme Toggle */}
				<div className="flex items-center justify-between rounded-md px-2 py-1.5">
					<span className="text-muted-foreground text-sm">Theme</span>
					<AnimatedThemeToggler className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" />
				</div>

				{bottomNavItems.map((item) => (
					<button
						type="button"
						key={item.label}
						className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground"
					>
						{item.icon}
						<span>{item.label}</span>
					</button>
				))}

				<button
					type="button"
					className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-destructive text-sm transition-colors hover:bg-destructive/10"
				>
					<SignOut size={18} />
					<span>Sign out</span>
				</button>
			</div>
		</aside>
	);
}
