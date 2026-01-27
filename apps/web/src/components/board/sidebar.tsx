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
	Trash,
	Users,
	Warning,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { authClient } from "~/lib/auth-client";
import { AnimatedThemeToggler } from "~/components/ui/animated-theme-toggler";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { cn } from "~/lib/utils";
import type { Organization } from "better-auth/plugins";

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

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

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
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const { data: organizations = [], isPending: isLoading } =
		authClient.useListOrganizations();

	const [orgToDelete, setOrgToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [isSettingActive, setIsSettingActive] = useState(false);
	const [isDeletingOrg, setIsDeletingOrg] = useState(false);

	const activeOrgId = session?.session?.activeOrganizationId;
	const organizationsByCreation = useMemo(
		() =>
		  [...(organizations ?? [])].sort(
			(a, b) =>
			  +new Date((a as Organization).createdAt ?? 0) -
			  +new Date((b as Organization).createdAt ?? 0),
		  ),
		[organizations],
	  );
	const selectedOrg = useMemo(
		() => organizations?.find((org) => org.id === activeOrgId),
		[organizations, activeOrgId],
	);

	const handleOrgSwitch = useCallback(
		async (orgId: string) => {
			if (orgId === activeOrgId || isSettingActive) return;

			setIsSettingActive(true);

			const { error } = await authClient.organization.setActive({
				organizationId: orgId,
			});

			if (error) {
				toast.error("Failed to switch organization");
				setIsSettingActive(false);
				return;
			}

			await authClient.getSession({ fetchOptions: { cache: "no-cache" } });
			toast.success("Organization switched successfully");
			setIsSettingActive(false);
			router.refresh();
		},
		[activeOrgId, router, isSettingActive],
	);

	const handleCreateOrg = useCallback(() => {
		router.push("/onboarding");
	}, [router]);

	const handleDeleteOrg = useCallback(
		(e: React.MouseEvent, orgId: string, orgName: string) => {
			e.stopPropagation();

			if (!organizations || organizations.length === 1) {
				toast.error("Cannot delete your only organization");
				return;
			}

			setOrgToDelete({ id: orgId, name: orgName });
		},
		[organizations],
	);

	const confirmDeleteOrg = useCallback(async () => {
		if (!orgToDelete || isDeletingOrg || !organizationsByCreation.length) return;

		const { id: orgId } = orgToDelete;
		const isActiveOrg = orgId === activeOrgId;

		setIsDeletingOrg(true);

		const currentIndex = organizationsByCreation.findIndex((org) => org.id === orgId);
		let nextOrg;

		if (currentIndex === organizationsByCreation.length - 1) {
			nextOrg = organizationsByCreation[currentIndex - 1];
		} else {
			nextOrg = organizationsByCreation[currentIndex + 1];
		}

		if (isActiveOrg && nextOrg) {
			const { error: setActiveError } =
				await authClient.organization.setActive({
					organizationId: nextOrg.id,
				});

			if (setActiveError) {
				toast.error("Failed to switch organization");
				setIsDeletingOrg(false);
				return;
			}

			await authClient.getSession({ fetchOptions: { cache: "no-cache" } });
		}

		const { error: deleteError } = await authClient.organization.delete({
			organizationId: orgId,
		});

		if (deleteError) {
			toast.error("Failed to delete organization");
			setIsDeletingOrg(false);
			return;
		}

		toast.success("Organization deleted successfully");
		setOrgToDelete(null);
		setIsDeletingOrg(false);
		router.refresh();
	}, [orgToDelete, activeOrgId, organizationsByCreation, router, isDeletingOrg]);

	const handleSignOut = useCallback(async () => {
		await authClient.signOut();
		router.push("/login");
	}, [router]);

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
							{isLoading ? (
								<div className="flex size-5 animate-pulse items-center justify-center rounded bg-muted" />
							) : selectedOrg ? (
								<>
									<div className="flex size-5 items-center justify-center rounded bg-foreground font-semibold text-[10px] text-background">
										{getInitials(selectedOrg.name)}
									</div>
									<span className="flex-1 text-left font-medium text-foreground">
										{selectedOrg.name}
									</span>
								</>
							) : (
								<span className="flex-1 text-left text-muted-foreground">
									No organization
								</span>
							)}
							<CaretUpDown size={14} className="text-muted-foreground" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-52 rounded-lg border border-border bg-popover p-1"
							align="start"
							sideOffset={4}
						>
							<DropdownMenuGroup>
								{organizationsByCreation?.map((org) => (
									<DropdownMenuItem
										key={org.id}
										className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-foreground text-sm hover:bg-accent focus:bg-accent"
										onClick={() => handleOrgSwitch(org.id)}
										disabled={isSettingActive}
									>
										<div className="flex size-5 items-center justify-center rounded bg-foreground font-semibold text-[10px] text-background">
											{getInitials(org.name)}
										</div>
										<span className="flex-1">{org.name}</span>
										{selectedOrg?.id === org.id && (
											<Check size={14} className="text-foreground" />
										)}
										<button
											type="button"
											onClick={(e) => handleDeleteOrg(e, org.id, org.name)}
											disabled={isDeletingOrg}
											className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
										>
											<Trash size={14} />
										</button>
									</DropdownMenuItem>
								))}
							</DropdownMenuGroup>
							<DropdownMenuSeparator className="my-1 bg-border" />
							<DropdownMenuItem
								className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground text-sm hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground"
								onClick={handleCreateOrg}
							>
								<Plus size={14} />
								<span>Create organization </span>
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
					onClick={handleSignOut}
					className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-destructive text-sm transition-colors hover:bg-destructive/10"
				>
					<SignOut size={18} />
					<span>Sign out</span>
				</button>
			</div>

			<ConfirmDialog
				open={!!orgToDelete}
				onOpenChange={(open) => !open && setOrgToDelete(null)}
				title="Delete organization"
				description={`Are you sure you want to delete "${orgToDelete?.name}"? This action cannot be undone.`}
				onConfirm={confirmDeleteOrg}
				confirmText="Delete"
				cancelText="Cancel"
				variant="destructive"
				isLoading={isDeletingOrg}
			/>
		</aside>
	);
}
