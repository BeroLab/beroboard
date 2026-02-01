"use client";

import { Sidebar } from "~/components/layout";
import { OrgGuard } from "~/components/org";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrgGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </OrgGuard>
  );
}
