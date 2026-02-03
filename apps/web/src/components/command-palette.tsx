"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  KanbanIcon,
  ArticleIcon,
  UsersThreeIcon,
  CubeIcon,
  GearSixIcon,
  PlusIcon,
  SignOutIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { cn } from "~/lib/utils";

interface CommandPaletteContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null,
);

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      "useCommandPalette must be used within a CommandPaletteProvider",
    );
  }
  return context;
}

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "/" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
            onClick={close}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: 0.15,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 px-4"
          >
            <Command
              className="overflow-hidden rounded-xl bg-popover shadow-2xl ring-1 ring-white/10"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  close();
                }
              }}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-border px-4">
                <MagnifyingGlassIcon
                  size={20}
                  className="shrink-0 text-muted-foreground"
                />
                <Command.Input
                  placeholder="Search for pages, projects, teams..."
                  className="flex-1 bg-transparent py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <kbd className="hidden sm:flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                {/* Pages */}
                <Command.Group
                  heading="Pages"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  <CommandItem onSelect={() => { console.log("Board"); close(); }}>
                    <KanbanIcon size={18} />
                    <span>Board</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("Reports"); close(); }}>
                    <ArticleIcon size={18} />
                    <span>Reports</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("Teams"); close(); }}>
                    <UsersThreeIcon size={18} />
                    <span>Teams</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("Projects"); close(); }}>
                    <CubeIcon size={18} />
                    <span>Projects</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("Settings"); close(); }} shortcut={["⌘", ","]}>
                    <GearSixIcon size={18} />
                    <span>Settings</span>
                  </CommandItem>
                </Command.Group>

                {/* Projects */}
                <Command.Group
                  heading="Projects"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  <CommandItem onSelect={() => { console.log("FrontEnd"); close(); }}>
                    <div className="flex size-5 items-center justify-center rounded-lg bg-purple-600">
                      <span className="text-xs font-bold text-white">F</span>
                    </div>
                    <span>FrontEnd</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("API"); close(); }}>
                    <div className="flex size-5 items-center justify-center rounded-lg bg-pink-600">
                      <span className="text-xs font-bold text-white">A</span>
                    </div>
                    <span>API</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("Protótipo"); close(); }}>
                    <div className="flex size-5 items-center justify-center rounded-lg bg-emerald-600">
                      <span className="text-xs font-bold text-white">P</span>
                    </div>
                    <span>Protótipo</span>
                  </CommandItem>
                </Command.Group>

                {/* Teams */}
                <Command.Group
                  heading="Teams"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  <CommandItem onSelect={() => { console.log("Devs"); close(); }}>
                    <div className="flex size-5 items-center justify-center rounded-lg bg-blue-600">
                      <span className="text-xs font-bold text-white">&lt;/&gt;</span>
                    </div>
                    <span>Devs</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("Design"); close(); }}>
                    <div className="flex size-5 items-center justify-center rounded-lg bg-orange-600">
                      <span className="text-xs font-bold text-white">D</span>
                    </div>
                    <span>Design</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("Marketing"); close(); }}>
                    <div className="flex size-5 items-center justify-center rounded-lg bg-yellow-500">
                      <span className="text-xs font-bold text-white">M</span>
                    </div>
                    <span>Marketing</span>
                  </CommandItem>
                </Command.Group>

                {/* Actions */}
                <Command.Group
                  heading="Actions"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  <CommandItem onSelect={() => { console.log("Create project"); close(); }}>
                    <PlusIcon size={18} />
                    <span>Create new project</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("Create team"); close(); }}>
                    <PlusIcon size={18} />
                    <span>Create new team</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("Profile"); close(); }}>
                    <UserIcon size={18} />
                    <span>View profile</span>
                  </CommandItem>
                  <CommandItem onSelect={() => { console.log("Sign out"); close(); }}>
                    <SignOutIcon size={18} />
                    <span>Sign out</span>
                  </CommandItem>
                </Command.Group>
              </Command.List>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded-md bg-muted px-1.5 py-0.5 font-mono">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded-md bg-muted px-1.5 py-0.5 font-mono">↵</kbd>
                    select
                  </span>
                </div>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded-md bg-muted px-1.5 py-0.5 font-mono">esc</kbd>
                  close
                </span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CommandItem({
  children,
  onSelect,
  shortcut,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  shortcut?: string[];
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2 py-2 text-sm cursor-pointer",
        "text-foreground",
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
        "[&_svg]:text-muted-foreground [&_svg]:data-[selected=true]:text-accent-foreground",
      )}
    >
      {children}
      {shortcut && (
        <div className="ml-auto flex items-center gap-1">
          {shortcut.map((key, i) => (
            <kbd
              key={i}
              className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground font-mono"
            >
              {key}
            </kbd>
          ))}
        </div>
      )}
    </Command.Item>
  );
}
