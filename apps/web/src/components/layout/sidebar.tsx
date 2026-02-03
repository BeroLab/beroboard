"use client";

import {
  CheckIcon,
  CaretUpDownIcon,
  CaretRightIcon,
  List,
  MagnifyingGlassIcon,
  PlusIcon,
  PushPin,
  PencilSimpleIcon,
  XIcon,
  FadersHorizontalIcon,
  KanbanIcon,
  ArticleIcon,
  UsersThreeIcon,
  CubeIcon,
  HeadphonesIcon,
  WarningCircleIcon,
  GearSixIcon,
  DotsSixVerticalIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import {
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from "react";
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
import Image from "next/image";
import { motion, Reorder } from "framer-motion";
import { useCommandPalette } from "~/components/command-palette";

// Sidebar Context for mobile state management
interface SidebarContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-accent md:hidden",
        className,
      )}
    >
      <List size={24} />
    </button>
  );
}

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
  { icon: <KanbanIcon size={20} />, label: "Board", active: true },
  { icon: <ArticleIcon size={20} />, label: "Reports" },
  { icon: <UsersThreeIcon size={20} />, label: "Teams" },
  { icon: <CubeIcon size={20} />, label: "Projects" },
];

const bottomNavItems: NavItem[] = [
  { icon: <HeadphonesIcon size={18} />, label: "Suport" },
  { icon: <WarningCircleIcon size={18} />, label: "Report a issue" },
  { icon: <GearSixIcon size={18} />, label: "Settings" },
];

const keys = ["⌘", "K"];

// Mock data - these will come from API later
const projects: PinnedItem[] = [
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

const teams: PinnedItem[] = [
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

function SidebarContent({ className }: { className?: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { data: organizations = [], isPending: isLoading } =
    authClient.useListOrganizations();
  const { open: openCommandPalette } = useCommandPalette();

  const [orgToDelete, setOrgToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isSettingActive, setIsSettingActive] = useState(false);
  const [isDeletingOrg, setIsDeletingOrg] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isTeamsExpanded, setIsTeamsExpanded] = useState(true);
  const [pinnedProjectIds, setPinnedProjectIds] = useState<Set<string>>(
    new Set(),
  );
  const [pinnedTeamIds, setPinnedTeamIds] = useState<Set<string>>(new Set());
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "projects",
    "teams",
  ]);

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

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const aIsPinned = pinnedProjectIds.has(a.id);
      const bIsPinned = pinnedProjectIds.has(b.id);
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [pinnedProjectIds]);

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const aIsPinned = pinnedTeamIds.has(a.id);
      const bIsPinned = pinnedTeamIds.has(b.id);
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [pinnedTeamIds]);

  const toggleProjectPin = useCallback((projectId: string) => {
    setPinnedProjectIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  }, []);

  const toggleTeamPin = useCallback((teamId: string) => {
    setPinnedTeamIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  }, []);

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

  const handleEditOrg = useCallback(
    (e: React.MouseEvent, orgId: string) => {
      e.stopPropagation();
      router.push(`/settings/organization/${orgId}`);
    },
    [router],
  );

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
      {/* Organization Selector - Fixed Header */}
      <div className="shrink-0 px-1.5 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-1.5 px-1.5 py-2 rounded-xl transition-colors hover:bg-sidebar-accent cursor-pointer">
            {selectedOrg?.logo ? (
              <Image
                src={selectedOrg.logo}
                alt={selectedOrg.name}
                fill
                className="size-11 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent text-xl font-bold">
                {selectedOrg?.name?.[0]?.toUpperCase() ?? "B"}
              </div>
            )}
            <div className="flex flex-1 flex-col items-start min-w-0">
              <span className="text-sm text-muted-foreground">
                Organization
              </span>
              <span className="font-semibold text-lg truncate w-full text-start">
                {selectedOrg?.name ?? "Select org"}
              </span>
            </div>
            <div className="shrink-0 p-px bg-gradient-to-t from-[#1d1d1d] to-[#353535] rounded-lg">
              <div className="bg-[#1e2025] p-1.5 rounded-lg">
                <CaretUpDownIcon size={20} />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={8}>
            <DropdownMenuGroup>
              {organizationsByCreation.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrgSwitch(org.id)}
                  className="group flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {org.logo ? (
                      <Image
                        src={org.logo}
                        alt={org.name}
                        width={24}
                        height={24}
                        className="size-6 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium">
                        {getInitials(org.name)}
                      </div>
                    )}
                    <span className="truncate text-sm">{org.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {org.id === activeOrgId && (
                      <CheckIcon
                        size={16}
                        weight="bold"
                        className="text-primary"
                      />
                    )}
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-1.5">
        {/* Search & Main Navigation */}
        <nav className="flex flex-col gap-0.5">
          {/* Search */}
          <button
            type="button"
            onClick={openCommandPalette}
            className="flex w-full items-center gap-1.5 text-sidebar-foreground px-1.5 py-2 rounded-lg transition-colors hover:bg-sidebar-accent cursor-pointer"
          >
            <MagnifyingGlassIcon size={20} />
            <span className="flex-1 text-left text-sm">Search</span>
            <div className="flex items-center gap-1">
              {keys.map((key) => (
                <div
                  key={key}
                  className="text-[10px] p-px bg-gradient-to-t from-[#1d1d1d] to-[#353535] rounded-[0.4em]"
                >
                  <div className="bg-[#1e2025] px-2 py-1 rounded-[0.3em]">
                    <kbd className="font-medium block font-sans">{key}</kbd>
                  </div>
                </div>
              ))}
            </div>
          </button>

          {/* Nav Items */}
          {mainNavItems.map((item) => (
            <button
              type="button"
              key={item.label}
              className={cn(
                "flex items-center gap-1.5 text-sm text-sidebar-foreground px-1.5 py-2 rounded-lg transition-colors hover:bg-sidebar-accent cursor-pointer",
                item.active && "font-medium bg-sidebar-accent",
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Reorderable Sections */}
        <Reorder.Group
          axis="y"
          values={sectionOrder}
          onReorder={setSectionOrder}
          className="mt-4 flex flex-col gap-2"
        >
          {sectionOrder.map((section) => (
            <Reorder.Item
              key={section}
              value={section}
              transition={{
                layout: {
                  duration: 0.3,
                  ease: [0.32, 0.72, 0, 1],
                },
              }}
              whileDrag={{
                backgroundColor: "var(--sidebar)",
                borderRadius: "0.75rem",
              }}
              className="flex flex-col bg-sidebar rounded-xl"
            >
              {section === "projects" ? (
                <>
                  <div className="group flex items-center gap-1.5 px-1.5 py-2 rounded-lg transition-colors hover:bg-sidebar-accent">
                    <DotsSixVerticalIcon
                      size={16}
                      className="cursor-grab text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing"
                    />
                    <button
                      type="button"
                      onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                      className="flex flex-1 items-center gap-1.5 cursor-pointer"
                    >
                      <span className="flex-1 text-left text-sm font-medium text-muted-foreground">
                        Projects
                      </span>
                      <CaretRightIcon
                        size={16}
                        className={cn(
                          "text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
                          isProjectsExpanded && "rotate-90",
                        )}
                      />
                    </button>
                  </div>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      isProjectsExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden flex flex-col gap-0.5">
                      {sortedProjects.map((project) => (
                        <motion.div
                          key={project.id}
                          layout
                          transition={{
                            layout: {
                              duration: 0.3,
                              ease: [0.32, 0.72, 0, 1],
                            },
                          }}
                          className="group flex items-center gap-1.5 text-sm text-sidebar-foreground px-1.5 py-2 rounded-lg transition-colors hover:bg-sidebar-accent cursor-pointer"
                        >
                          <div
                            className={cn(
                              "flex size-5 items-center justify-center rounded-lg",
                              project.color,
                            )}
                          >
                            {project.icon}
                          </div>
                          <span className="flex-1 text-left">
                            {project.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleProjectPin(project.id)}
                            className={cn(
                              "transition-opacity cursor-pointer",
                              pinnedProjectIds.has(project.id)
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100",
                            )}
                          >
                            <PushPin
                              size={16}
                              weight={
                                pinnedProjectIds.has(project.id)
                                  ? "fill"
                                  : "regular"
                              }
                              className={cn(
                                "transition-colors",
                                pinnedProjectIds.has(project.id)
                                  ? "text-sidebar-foreground"
                                  : "text-sidebar-foreground/30 hover:text-sidebar-foreground/60",
                              )}
                            />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="group flex items-center gap-1.5 px-1.5 py-2 rounded-lg transition-colors hover:bg-sidebar-accent">
                    <DotsSixVerticalIcon
                      size={16}
                      className="cursor-grab text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing"
                    />
                    <button
                      type="button"
                      onClick={() => setIsTeamsExpanded(!isTeamsExpanded)}
                      className="flex flex-1 items-center gap-1.5 cursor-pointer"
                    >
                      <span className="flex-1 text-left text-sm font-medium text-muted-foreground">
                        Teams
                      </span>
                      <CaretRightIcon
                        size={16}
                        className={cn(
                          "text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
                          isTeamsExpanded && "rotate-90",
                        )}
                      />
                    </button>
                  </div>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      isTeamsExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden flex flex-col gap-0.5">
                      {sortedTeams.map((team) => (
                        <motion.div
                          key={team.id}
                          layout
                          transition={{
                            layout: {
                              duration: 0.3,
                              ease: [0.32, 0.72, 0, 1],
                            },
                          }}
                          className="group flex items-center gap-1.5 text-sm text-sidebar-foreground px-1.5 py-2 rounded-lg transition-colors hover:bg-sidebar-accent cursor-pointer"
                        >
                          <div
                            className={cn(
                              "flex size-5 items-center justify-center rounded-lg",
                              team.color,
                            )}
                          >
                            {team.icon}
                          </div>
                          <span className="flex-1 text-left">{team.name}</span>
                          <button
                            type="button"
                            onClick={() => toggleTeamPin(team.id)}
                            className={cn(
                              "transition-opacity cursor-pointer",
                              pinnedTeamIds.has(team.id)
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100",
                            )}
                          >
                            <PushPin
                              size={16}
                              weight={
                                pinnedTeamIds.has(team.id) ? "fill" : "regular"
                              }
                              className={cn(
                                "transition-colors",
                                pinnedTeamIds.has(team.id)
                                  ? "text-sidebar-foreground"
                                  : "text-sidebar-foreground/30 hover:text-sidebar-foreground/60",
                              )}
                            />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      {/* Fixed Footer */}
      <div className="shrink-0 px-1.5 pb-3">
        {/* Bottom Navigation */}
        <div className="flex flex-col gap-1 pb-4">
          {bottomNavItems.map((item) => (
            <button
              type="button"
              key={item.label}
              className="flex items-center gap-1.5 text-sm text-muted-foreground py-1 cursor-pointer transition-colors hover:underline w-fit"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Card */}
        <button
          type="button"
          className="flex w-full items-center gap-1.5 rounded-2xl bg-sidebar-accent p-2 pr-4 transition-colors hover:bg-sidebar-accent/80 cursor-pointer"
        >
          <Avatar className="size-9">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback>
              {getInitials(session?.user?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-grow items-start min-w-0">
            <span className="text-sm font-medium w-full truncate text-start">
              {session?.user?.name ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground">Developer</span>
          </div>
          <div className="text-muted-foreground">
            <FadersHorizontalIcon size={20} />
          </div>
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

export function Sidebar({ className }: SidebarProps) {
  const sidebarContext = useContext(SidebarContext);
  const isOpen = sidebarContext?.isOpen ?? false;
  const setIsOpen = sidebarContext?.setIsOpen ?? (() => {});

  return (
    <>
      {/* Desktop Sidebar */}
      <SidebarContent className={cn("hidden md:flex", className)} />

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent className="h-full" />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-2 top-3 rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <XIcon size={20} />
        </button>
      </div>
    </>
  );
}
