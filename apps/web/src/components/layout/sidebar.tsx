"use client";

import {
  Cube,
  CheckIcon,
  CaretUpDownIcon,
  FadersHorizontal,
  GearSix,
  Headphones,
  Article,
  MagnifyingGlassIcon,
  PlusIcon,
  PushPin,
  Kanban,
  TrashIcon,
  UsersThree,
  WarningCircle,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { authClient } from "~/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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

interface PinnedItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
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
  { icon: <Kanban size={20} />, label: "Board", active: true },
  { icon: <Article size={20} />, label: "Reports" },
  { icon: <UsersThree size={20} />, label: "Teams" },
  { icon: <Cube size={20} />, label: "Projects" },
];

const bottomNavItems: NavItem[] = [
  { icon: <Headphones size={18} />, label: "Suport" },
  { icon: <WarningCircle size={18} />, label: "Report a issue" },
  { icon: <GearSix size={18} />, label: "Settings" },
];

const keys = ["Ctrl", "/"];

// Mock data - these will come from API later
const pinnedProjects: PinnedItem[] = [
  {
    id: "1",
    name: "FrontEnd",
    icon: <span className="text-xs font-bold">F</span>,
    color: "bg-purple-600",
  },
  {
    id: "2",
    name: "API",
    icon: <span className="text-xs font-bold">A</span>,
    color: "bg-pink-600",
  },
  {
    id: "3",
    name: "Protótipo",
    icon: <span className="text-xs font-bold">P</span>,
    color: "bg-emerald-600",
  },
];

const pinnedTeams: PinnedItem[] = [
  {
    id: "1",
    name: "Devs",
    icon: <span className="text-xs font-bold">&lt;/&gt;</span>,
    color: "bg-blue-600",
  },
  {
    id: "2",
    name: "Design",
    icon: <span className="text-xs font-bold">D</span>,
    color: "bg-orange-600",
  },
  {
    id: "3",
    name: "Mktg",
    icon: <span className="text-xs font-bold">M</span>,
    color: "bg-yellow-500",
  },
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
    if (!orgToDelete || isDeletingOrg || !organizationsByCreation.length)
      return;

    const { id: orgId } = orgToDelete;
    const isActiveOrg = orgId === activeOrgId;

    setIsDeletingOrg(true);

    const currentIndex = organizationsByCreation.findIndex(
      (org) => org.id === orgId,
    );
    let nextOrg;

    if (currentIndex === organizationsByCreation.length - 1) {
      nextOrg = organizationsByCreation[currentIndex - 1];
    } else {
      nextOrg = organizationsByCreation[currentIndex + 1];
    }

    if (isActiveOrg && nextOrg) {
      const { error: setActiveError } = await authClient.organization.setActive(
        {
          organizationId: nextOrg.id,
        },
      );

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
  }, [
    orgToDelete,
    activeOrgId,
    organizationsByCreation,
    router,
    isDeletingOrg,
  ]);

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      {/* Organization Selector */}
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent">
            <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-accent text-lg font-bold">
              {selectedOrg?.name?.[0]?.toUpperCase() ?? "B"}
            </div>
            <div className="flex flex-1 flex-col items-start">
              <span className="text-sm text-muted-foreground">
                Organization
              </span>
              <span className="font-semibold text-xl">
                {selectedOrg?.name ?? "Select org"}
              </span>
            </div>
            <div className="p-px bg-gradient-to-t from-[#1d1d1d] to-[#353535] rounded-lg">
              <div className="bg-[#1e2025] p-1.5 rounded-lg">
                <CaretUpDownIcon size={20} />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuGroup>
              {organizationsByCreation.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrgSwitch(org.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded bg-muted text-xs font-medium">
                      {getInitials(org.name)}
                    </div>
                    <span>{org.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {org.id === activeOrgId && (
                      <CheckIcon size={16} className="text-primary" />
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteOrg(e, org.id, org.name)}
                      className="rounded p-1 opacity-0 transition-opacity hover:bg-destructive/10 group-hover:opacity-100"
                    >
                      <TrashIcon size={14} className="text-destructive" />
                    </button>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCreateOrg}>
              <PlusIcon size={16} className="mr-2" />
              Create organization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-1.5 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
        >
          <MagnifyingGlassIcon size={20} />
          <span className="flex-1 text-left text-sm">Search</span>
          {keys.map((key) => (
            <div
              key={key}
              className="text-[10px] p-px bg-gradient-to-t from-[#1d1d1d] to-[#353535] rounded-[0.5em]"
            >
              <div className="bg-[#1e2025] p-[0.375em] rounded-[0.4em]">
                <kbd className="font-medium block">{key}</kbd>
              </div>
            </div>
          ))}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-0.5 px-3">
        {mainNavItems.map((item) => (
          <button
            type="button"
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-sidebar-foreground",
              item.active
                ? "bg-sidebar-accent font-medium"
                : "hover:bg-sidebar-accent",
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Projects Section */}
      <div className="mt-6 flex flex-col gap-1 px-3">
        <span className="px-3 text-sm font-medium text-muted-foreground">
          Projects
        </span>
        <div className="flex flex-col gap-0.5">
          {pinnedProjects.map((project) => (
            <button
              type="button"
              key={project.id}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded",
                  project.color,
                )}
              >
                {project.icon}
              </div>
              <span className="flex-1 text-left font-medium">
                {project.name}
              </span>
              <PushPin
                size={16}
                weight="fill"
                className="text-sidebar-foreground/30 transition-colors group-hover:text-sidebar-foreground/60"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Teams Section */}
      <div className="mt-4 flex flex-col gap-1 px-3">
        <span className="px-3 text-sm font-medium text-muted-foreground">
          Teams
        </span>
        <div className="flex flex-col   gap-0.5">
          {pinnedTeams.map((team) => (
            <button
              type="button"
              key={team.id}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded",
                  team.color,
                )}
              >
                {team.icon}
              </div>
              <span className="flex-1 text-left">{team.name}</span>
              <PushPin
                size={16}
                weight="fill"
                className="text-sidebar-foreground/30 transition-colors group-hover:text-sidebar-foreground/60"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-0.5 px-3 pb-2">
        {bottomNavItems.map((item) => (
          <button
            type="button"
            key={item.label}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* User Card */}
      <div className="border-sidebar-border border-t p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent"
        >
          <Avatar>
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback>
              {getInitials(session?.user?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-sm font-medium">
              {session?.user?.name ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground">Developer</span>
          </div>
          <FadersHorizontal size={20} className="text-muted-foreground" />
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
