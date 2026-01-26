"use client";

import {
	Building2,
	Check,
	ChevronsUpDown,
	LayoutGrid,
	List,
	Plus,
	Settings,
	Users,
} from "lucide-react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

interface Company {
	id: string;
	name: string;
	initials: string;
	color: string;
}

interface Project {
	id: string;
	name: string;
	color: string;
	active?: boolean;
}

interface NavItem {
	icon: React.ReactNode;
	label: string;
	active?: boolean;
}

interface SidebarProps {
	className?: string;
}

const companies: Company[] = [
	{ id: "1", name: "Acme Inc", initials: "A", color: "#6366F1" },
	{ id: "2", name: "Stark Industries", initials: "SI", color: "#E85A4F" },
	{ id: "3", name: "Wayne Enterprises", initials: "WE", color: "#32D583" },
	{ id: "4", name: "Umbrella Corp", initials: "UC", color: "#FFB547" },
];

const navItems: NavItem[] = [
	{ icon: <LayoutGrid className="size-5" />, label: "Board", active: true },
	{ icon: <List className="size-5" />, label: "Tasks" },
	{ icon: <Users className="size-5" />, label: "Team" },
	{ icon: <Settings className="size-5" />, label: "Settings" },
];

const projects: Project[] = [
	{ id: "1", name: "BeroBoard App", color: "#6366F1", active: true },
	{ id: "2", name: "Marketing Site", color: "#E85A4F" },
	{ id: "3", name: "Mobile App", color: "#32D583" },
];

export function Sidebar({ className }: SidebarProps) {
	const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0]);

	return (
		<aside
			className={cn(
				"flex h-screen w-60 shrink-0 flex-col bg-[#1A1A1E] py-6",
				className,
			)}
		>
			{/* Top section */}
			<div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5">
				{/* Logo */}
				<div className="flex items-center gap-3">
					<div className="flex size-8 items-center justify-center rounded-lg bg-[#6366F1]">
						<span className="font-bold text-sm text-white">B</span>
					</div>
					<span className="font-bold text-[#FAFAF9] text-lg">BeroBoard</span>
				</div>

				{/* Company Selector Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3 outline-none transition-colors hover:border-[#3A3A3E] focus:border-[#6366F1]">
						<div className="flex items-center gap-2.5">
							<div
								className="flex size-7 items-center justify-center rounded-md"
								style={{ backgroundColor: selectedCompany.color }}
							>
								<span className="font-semibold text-[13px] text-white">
									{selectedCompany.initials}
								</span>
							</div>
							<span className="font-medium text-[#FAFAF9] text-sm">
								{selectedCompany.name}
							</span>
						</div>
						<ChevronsUpDown className="size-4 text-[#4A4A50]" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[200px] rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
						align="start"
						sideOffset={8}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="px-2 py-1.5 font-semibold text-[#6B6B70] text-xs">
								Companies
							</DropdownMenuLabel>
							{companies.map((company) => (
								<DropdownMenuItem
									key={company.id}
									className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-[#FAFAF9] hover:bg-[#16161A] focus:bg-[#16161A]"
									onClick={() => setSelectedCompany(company)}
								>
									<div
										className="flex size-6 items-center justify-center rounded-md"
										style={{ backgroundColor: company.color }}
									>
										<span className="font-semibold text-[11px] text-white">
											{company.initials}
										</span>
									</div>
									<span className="flex-1 text-sm">{company.name}</span>
									{selectedCompany.id === company.id && (
										<Check className="size-4 text-[#6366F1]" />
									)}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="my-1 bg-[#2A2A2E]" />
						<DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-[#6B6B70] hover:bg-[#16161A] hover:text-[#FAFAF9] focus:bg-[#16161A] focus:text-[#FAFAF9]">
							<div className="flex size-6 items-center justify-center rounded-md border border-[#4A4A50] border-dashed">
								<Plus className="size-3.5" />
							</div>
							<span className="text-sm">Create company</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Navigation */}
				<nav className="flex flex-col gap-1">
					{navItems.map((item) => (
						<button
							type="button"
							key={item.label}
							className={cn(
								"flex items-center gap-3 rounded-lg px-5 py-2.5",
								item.active
									? "bg-[#6366F1] text-[#FAFAF9]"
									: "text-[#6B6B70] hover:bg-[#16161A]",
							)}
						>
							{item.icon}
							<span
								className={cn(
									"text-sm",
									item.active ? "font-semibold" : "font-medium",
								)}
							>
								{item.label}
							</span>
						</button>
					))}
				</nav>

				{/* Projects */}
				<div className="flex flex-col gap-2 px-5">
					<span className="font-semibold text-[#4A4A50] text-xs">Projects</span>
					{projects.map((project) => (
						<button
							type="button"
							key={project.id}
							className="flex items-center gap-2.5 py-2"
						>
							<div
								className="size-2 rounded"
								style={{ backgroundColor: project.color }}
							/>
							<span
								className={cn(
									"font-medium text-[13px]",
									project.active ? "text-[#FAFAF9]" : "text-[#6B6B70]",
								)}
							>
								{project.name}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* User section */}
			<div className="flex shrink-0 items-center gap-3 px-5 pt-4">
				<div className="flex size-9 items-center justify-center rounded-full bg-[#6366F1]">
					<span className="font-semibold text-[13px] text-white">JS</span>
				</div>
				<div className="flex flex-1 flex-col gap-0.5">
					<span className="font-medium text-[#FAFAF9] text-sm">John Smith</span>
					<span className="text-[#6B6B70] text-xs">john@company.com</span>
				</div>
			</div>
		</aside>
	);
}
