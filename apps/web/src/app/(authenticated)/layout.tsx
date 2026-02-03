"use client";

import { Sidebar, SidebarProvider, SidebarTrigger } from "~/components/layout";
import { OrgGuard } from "~/components/org";
import {
  CommandPalette,
  CommandPaletteProvider,
} from "~/components/command-palette";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrgGuard>
      <CommandPaletteProvider>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Mobile Header */}
              <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4 md:hidden">
                <SidebarTrigger />
                <span className="font-semibold">Blaboard</span>
              </header>
              <main className="flex flex-1 flex-col overflow-hidden">
                {children}
              </main>
            </div>
          </div>
          <CommandPalette />
        </SidebarProvider>
      </CommandPaletteProvider>
    </OrgGuard>
  );
}
