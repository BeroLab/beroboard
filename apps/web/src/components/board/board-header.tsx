"use client";

import { useState } from "react";
import {
  CubeIcon,
  UsersThreeIcon,
  CalendarIcon,
  SlidersHorizontalIcon,
  BellIcon,
} from "@phosphor-icons/react";

const FILTER_TABS = [
  { id: "projects", label: "Projects", icon: CubeIcon },
  { id: "teams", label: "Teams", icon: UsersThreeIcon },
  { id: "date", label: "Date", icon: CalendarIcon },
] as const;

type FilterTab = (typeof FILTER_TABS)[number]["id"];

interface BoardHeaderProps {
  title: string;
  issueCount: number;
}

export function BoardHeader({ title, issueCount }: BoardHeaderProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("projects");

  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="font-bold text-2xl text-foreground tracking-tight">
            {title}
          </h1>
          <span className="text-muted-foreground text-sm">
            {issueCount} Issues
          </span>
        </div>

        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <BellIcon size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground"
        >
          <SlidersHorizontalIcon size={16} />
          <span>Display</span>
        </button>
      </div>
    </div>
  );
}
